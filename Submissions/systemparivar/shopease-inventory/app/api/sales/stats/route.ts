import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import dbConnect from "@/lib/db"
import Sale from "@/lib/models/Sale"
import Product from "@/lib/models/Product"

export async function GET(request: NextRequest) {
  try {
    const payload = await withAuth(request)
    if (payload instanceof NextResponse) {
      return payload
    }

    await dbConnect()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Today's sales
    const todaySales = await Sale.find({
      createdAt: { $gte: today, $lt: tomorrow },
    })

    const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0)
    const todayCount = todaySales.length

    // Top selling products
    const topProducts = await Sale.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          productName: { $first: "$items.productName" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.total" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ])

    // Low stock products
    const lowStockProducts = await Product.find({
      $expr: { $lte: ["$quantity", "$lowStockThreshold"] },
    }).limit(5)

    return NextResponse.json({
      todayTotal,
      todayCount,
      topProducts,
      lowStockProducts,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch stats" }, { status: 500 })
  }
}
