import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import dbConnect from "@/lib/db"
import Sale from "@/lib/models/Sale"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await withAuth(request)
    if (payload instanceof NextResponse) {
      return payload
    }

    await dbConnect()
    const sale = await Sale.findById(params.id).populate("cashier", "name email")

    if (!sale) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 })
    }

    return NextResponse.json(sale)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch sale" }, { status: 500 })
  }
}
