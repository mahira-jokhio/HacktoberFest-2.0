"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SalesForm } from "@/components/sales/sales-form"

export default function SalesPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          setIsAuthorized(true)
        } else {
          router.push("/login")
        }
      } catch {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  if (!isAuthorized) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Sale</h1>
        <SalesForm />
      </div>
    </div>
  )
}
