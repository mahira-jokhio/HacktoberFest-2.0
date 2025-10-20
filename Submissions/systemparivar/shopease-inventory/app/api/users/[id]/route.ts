import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await withAuth(request)
    if (payload instanceof NextResponse) {
      return payload
    }

    if (payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await dbConnect()

    const body = await request.json()
    const { role, isActive } = body

    const user = await User.findByIdAndUpdate(params.id, { role, isActive }, { new: true }).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await withAuth(request)
    if (payload instanceof NextResponse) {
      return payload
    }

    if (payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await dbConnect()

    const user = await User.findByIdAndDelete(params.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete user" }, { status: 500 })
  }
}
