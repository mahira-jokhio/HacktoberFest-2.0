"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ProductForm } from "@/components/products/product-form"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          if (data.user.role === "admin") {
            setIsAuthorized(true)
            fetchProduct()
          } else {
            router.push("/dashboard")
          }
        } else {
          router.push("/login")
        }
      } catch {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      const data = await response.json()
      setProduct(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push("/products")
      } else {
        throw new Error("Failed to update product")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthorized || !product) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
        <ProductForm onSubmit={handleSubmit} initialData={product} isLoading={isLoading} />
      </div>
    </div>
  )
}
