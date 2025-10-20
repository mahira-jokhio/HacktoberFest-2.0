"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function SalesChart() {
  const [data, setData] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMonthlyData()
  }, [])

  const fetchMonthlyData = async () => {
    try {
      const currentMonth = new Date().getMonth() + 1
      const currentYear = new Date().getFullYear()

      const response = await fetch(`/api/reports/monthly?month=${currentMonth}&year=${currentYear}`)
      const reportData = await response.json()

      if (response.ok && reportData.dailyData) {
        const chartData = Object.entries(reportData.dailyData).map(([day, data]: [string, any]) => ({
          day: `Day ${day}`,
          sales: data.sales,
          transactions: data.count,
        }))
        setData(chartData)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Sales Trend</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="hsl(var(--chart-1))" name="Sales ($)" />
              <Bar dataKey="transactions" fill="hsl(var(--chart-2))" name="Transactions" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
