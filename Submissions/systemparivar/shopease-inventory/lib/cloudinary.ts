export async function uploadToCloudinary(file: File): Promise<{ url: string; publicId: string }> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET || "")

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  )

  if (!response.ok) {
    throw new Error("Upload failed")
  }

  const data = await response.json()
  return {
    url: data.secure_url,
    publicId: data.public_id,
  }
}

export function getCloudinaryUrl(publicId: string, options?: { width?: number; height?: number; crop?: string }) {
  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`

  let transformations = ""
  if (options?.width || options?.height) {
    transformations = `w_${options.width || "auto"},h_${options.height || "auto"},c_${options.crop || "fill"}`
  }

  return `${baseUrl}/${transformations}/${publicId}`
}
