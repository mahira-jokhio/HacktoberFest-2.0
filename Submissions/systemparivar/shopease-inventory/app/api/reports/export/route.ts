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
    const format = searchParams.get("format") || "csv"
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const query: any = {}
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) query.createdAt.$lte = new Date(endDate)
    }

    const sales = await Sale.find(query).populate("cashier", "name email")

    if (format === "csv") {
      let csv = "Invoice Number,Date,Cashier,Items,Subtotal,Tax,Total,Payment Method\n"

      sales.forEach((sale) => {
        const itemsStr = sale.items.map((i) => `${i.productName}(${i.quantity})`).join(";")
        csv += `${sale.invoiceNumber},"${sale.createdAt.toISOString()}","${sale.cashier.name}","${itemsStr}",${sale.subtotal},${sale.tax},${sale.total},${sale.paymentMethod}\n`
      })

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="sales-report.csv"',
        },
      })
    }

    // JSON format
    return NextResponse.json({
      exportDate: new Date().toISOString(),
      totalRecords: sales.length,
      sales,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to export report" }, { status: 500 })
  }
}
