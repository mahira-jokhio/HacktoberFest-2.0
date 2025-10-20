"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { TopProducts } from "@/components/dashboard/top-products"
import { LowStockAlert } from "@/components/dashboard/low-stock-alert"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { BarChart3, Package, ShoppingCart, FileText, LogOut, Users } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          router.push("/login")
        }
      } catch {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">ShopEase</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-4 overflow-x-auto">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          {user?.role === "admin" && (
            <>
              <Link href="/products">
                <Button variant="ghost" size="sm">
                  <Package className="w-4 h-4 mr-2" />
                  Products
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="ghost" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Reports
                </Button>
              </Link>
              <Link href="/users">
                <Button variant="ghost" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Users
                </Button>
              </Link>
            </>
          )}
          <Link href="/sales">
            <Button variant="ghost" size="sm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              New Sale
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart />
          <RevenueChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TopProducts />
          </div>
          <div>
            <LowStockAlert />
          </div>
        </div>
      </main>
    </div>
  )
}
