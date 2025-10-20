import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import dbConnect from '@/lib/db';
import Sale from '@/lib/models/Sale';
import Product from '@/lib/models/Product';
import StockAlert from '@/lib/models/StockAlert';

export async function GET(request: NextRequest) {
  try {
    const payload = await withAuth(request);
    if (payload instanceof NextResponse) {
      return payload;
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const query: any = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const sales = await Sale.find(query)
      .populate('cashier', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Sale.countDocuments(query);

    return NextResponse.json({
      sales,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}

// ...existing code...

export async function POST(request: NextRequest) {
  try {
    const payload = await withAuth(request);
    if (payload instanceof NextResponse) {
      return payload;
    }

    await dbConnect();

    const body = await request.json();
    const { items, tax, paymentMethod, notes } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in sale' },
        { status: 400 }
      );
    }

    // Calculate totals and update inventory
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      processedItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
      });

      // Update product quantity
      product.quantity -= item.quantity;
      await product.save();

      // Check for low stock and create alert
      if (product.quantity <= product.lowStockThreshold) {
        const existingAlert = await StockAlert.findOne({
          productId: product._id,
          status: 'active',
        });

        if (!existingAlert) {
          await StockAlert.create({
            productId: product._id,
            productName: product.name,
            currentQuantity: product.quantity,
            threshold: product.lowStockThreshold,
          });
        }
      }
    }

    const totalTax = tax || 0;
    const total = subtotal + totalTax;

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`;

    const sale = await Sale.create({
      invoiceNumber,
      items: processedItems,
      subtotal,
      tax: totalTax,
      total,
      paymentMethod,
      cashier: payload.userId,
      notes,
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create sale' },
      { status: 500 }
    );
  }
}
