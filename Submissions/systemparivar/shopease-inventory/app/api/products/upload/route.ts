import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"

export async function POST(request: NextRequest) {
  try {
    const payload = await withAuth(request)
    if (payload instanceof NextResponse) {
      return payload
    }

    if (payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const uploadFormData = new FormData()
    uploadFormData.append("file", file)
    uploadFormData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET || "")

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: uploadFormData,
      },
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }

    return NextResponse.json({
      url: data.secure_url,
      publicId: data.public_id,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 })
  }
}
