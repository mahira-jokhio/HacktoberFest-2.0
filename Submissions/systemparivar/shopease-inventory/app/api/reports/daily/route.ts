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
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    const sales = await Sale.find({
      createdAt: { $gte: startDate, $lte: endDate },
    }).populate("cashier", "name email")

    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0)
    const totalProfit = sales.reduce((sum, sale) => {
      const profit = sale.items.reduce((itemProfit, item) => {
        return itemProfit + item.total * 0.3 // Assuming 30% profit margin
      }, 0)
      return sum + profit
    }, 0)

    return NextResponse.json({
      date,
      totalSales,
      totalProfit,
      transactionCount: sales.length,
      sales,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate report" }, { status: 500 })
  }
}
