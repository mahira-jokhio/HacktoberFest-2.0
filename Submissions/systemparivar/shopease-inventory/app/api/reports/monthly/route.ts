import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import dbConnect from "@/lib/db"
import Sale from "@/lib/models/Sale"

export async function GET(request: NextRequest) {
  try {
    const payload = await withAuth(request)
    if (payload instanceof NextResponse) {
      return payload
    }

    if (payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await dbConnect()

    const { searchParams } = new URL(request.url)
    const month = Number.parseInt(searchParams.get("month") || String(new Date().getMonth() + 1))
    const year = Number.parseInt(searchParams.get("year") || String(new Date().getFullYear()))

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59, 999)

    const sales = await Sale.find({
      createdAt: { $gte: startDate, $lte: endDate },
    }).populate("cashier", "name email")

    const dailyData = {}
    sales.forEach((sale) => {
      const day = sale.createdAt.getDate()
      if (!dailyData[day]) {
        dailyData[day] = { sales: 0, count: 0 }
      }
      dailyData[day].sales += sale.total
      dailyData[day].count += 1
    })

    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0)
    const totalProfit = sales.reduce((sum, sale) => {
      const profit = sale.items.reduce((itemProfit, item) => {
        return itemProfit + item.total * 0.3
      }, 0)
      return sum + profit
    }, 0)

    return NextResponse.json({
      month,
      year,
      totalSales,
      totalProfit,
      transactionCount: sales.length,
      dailyData,
      sales,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate report" }, { status: 500 })
  }
}
