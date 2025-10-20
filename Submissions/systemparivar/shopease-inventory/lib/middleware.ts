import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./auth"

export async function withAuth(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }

  return payload
}

export function withRole(allowedRoles: string[]) {
  return (payload: any) => {
    if (!allowedRoles.includes(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return null
  }
}
