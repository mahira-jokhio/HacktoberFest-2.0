
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(request: NextRequest) {
  try {
    const payload = await withAuth(request);
    if (payload instanceof NextResponse) {
      return payload;
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await withAuth(request);
    if (payload instanceof NextResponse) {
      return payload;
    }

    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();

    const body = await request.json();
    const { name, sku, category, price, quantity, lowStockThreshold, description } = body;

    if (!name || !sku || !category || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const product = await Product.create({
      name,
      sku,
      category,
      price,
      quantity: quantity || 0,
      lowStockThreshold: lowStockThreshold || 10,
      description,
      createdBy: payload.userId,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
