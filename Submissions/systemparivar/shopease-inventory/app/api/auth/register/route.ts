import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"
import { generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const { name, email, password, role } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Please provide all required fields" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "cashier",
    })

    // Generate token
    const token = await generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Set cookie
    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    )

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 })
  }
}
