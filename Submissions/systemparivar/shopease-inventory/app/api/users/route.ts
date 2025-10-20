import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"

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

    const users = await User.find({}, "-password").sort({ createdAt: -1 })

    return NextResponse.json({ users })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch users" }, { status: 500 })
  }
}
