"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Edit, Trash2, Plus } from "lucide-react"

export function ProductList() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [search])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products?search=${search}`)
      const data = await response.json()
      setProducts(data.products)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return

    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (response.ok) {
        setProducts(products.filter((p) => p._id !== id))
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Products</CardTitle>
        <Link href="/products/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: any) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      {product.quantity <= product.lowStockThreshold ? (
                        <div className="flex items-center gap-1 text-destructive">
                          <AlertTriangle className="w-4 h-4" />
                          Low Stock
                        </div>
                      ) : (
                        <span className="text-green-600">In Stock</span>
                      )}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Link href={`/products/${product._id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(product._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
