"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Package, ShoppingCart, FileText, Users, Lock } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          setIsAuthenticated(true)
          router.push("/dashboard")
        }
      } catch {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">ShopEase</h1>
          </div>
          <div className="space-x-2">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Inventory & Sales Management Made Simple</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Manage your inventory, track sales, and monitor stock levels in real time. Perfect for small businesses.
        </p>
        <div className="space-x-4">
          <Link href="/register">
            <Button size="lg">Start Free Trial</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-t py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Powerful Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Package className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Product Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Add, edit, and delete products with SKU, category, price, and quantity tracking. Get automatic
                  low-stock alerts.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ShoppingCart className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Sales Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create and manage invoices with automatic calculations. Track total sales and profits in real time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Reports & Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Generate daily and monthly reports. Export to CSV or JSON formats for further analysis.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-primary mb-2" />
                <CardTitle>User Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Admin and Cashier roles with different permissions. Manage users and control access levels.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Data Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Beautiful charts and graphs showing sales trends, top products, and revenue distribution.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lock className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Secure login with JWT authentication. MongoDB database for reliable data storage and backup.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to streamline your business?</h3>
        <p className="text-lg text-muted-foreground mb-8">
          Join hundreds of small businesses using ShopEase to manage their inventory and sales.
        </p>
        <Link href="/register">
          <Button size="lg">Create Your Account</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 ShopEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
