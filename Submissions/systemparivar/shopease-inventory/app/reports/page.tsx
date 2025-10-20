"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download } from "lucide-react"

export default function ReportsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [reportType, setReportType] = useState("daily")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1))
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()))
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          if (data.user.role === "admin") {
            setUser(data.user)
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

  const generateReport = async () => {
    setLoading(true)
    setError("")
    try {
      let url = ""
      if (reportType === "daily") {
        url = `/api/reports/daily?date=${selectedDate}`
      } else {
        url = `/api/reports/monthly?month=${selectedMonth}&year=${selectedYear}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to generate report")
        return
      }

      setReportData(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async (format: string) => {
    try {
      const response = await fetch(`/api/reports/export?format=${format}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `sales-report.${format}`
      a.click()
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and export sales reports</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Report</SelectItem>
                    <SelectItem value="monthly">Monthly Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {reportType === "daily" && (
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </div>
              )}

              {reportType === "monthly" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="month">Month</Label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {new Date(2024, i).toLocaleString("default", { month: "long" })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            <Button onClick={generateReport} disabled={loading} className="w-full">
              {loading ? "Generating..." : "Generate Report"}
            </Button>
          </CardContent>
        </Card>

        {reportData && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Report Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sales</p>
                    <p className="text-2xl font-bold">${reportData.totalSales?.toFixed(2) || "0.00"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Profit</p>
                    <p className="text-2xl font-bold">${reportData.totalProfit?.toFixed(2) || "0.00"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transactions</p>
                    <p className="text-2xl font-bold">{reportData.transactionCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sales Details</CardTitle>
                <div className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => exportReport("csv")}>
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => exportReport("json")}>
                    <Download className="w-4 h-4 mr-2" />
                    JSON
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {reportData.sales && reportData.sales.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice</TableHead>
                          <TableHead>Cashier</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Payment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportData.sales.map((sale: any) => (
                          <TableRow key={sale._id}>
                            <TableCell className="font-mono text-sm">{sale.invoiceNumber}</TableCell>
                            <TableCell>{sale.cashier?.name || "N/A"}</TableCell>
                            <TableCell>{sale.items.length}</TableCell>
                            <TableCell className="font-bold">${sale.total.toFixed(2)}</TableCell>
                            <TableCell className="capitalize">{sale.paymentMethod}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No sales data for this period</p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
