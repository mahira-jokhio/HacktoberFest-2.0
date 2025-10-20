import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";

const PAGE_SIZE = 10;

const Reports = () => {
  const [invoices, setInvoices] = useState([]);
  useEffect(()=>{
   console.log("Invoices",invoices);
  },[invoices])
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chartData, setChartData] = useState([]); // daily
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [dailyCsv, setDailyCsv] = useState([]);
  const [monthlyCsv, setMonthlyCsv] = useState([]);
  const [tableCsv, setTableCsv] = useState([]);
  const [profit, setProfit] = useState(0);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    setLoading(true);
    // Fetch products first
    axios.get('http://localhost:3000/api/products')
      .then(prodRes => {
        const productsInDb = prodRes.data.data.map(p => p.name);
        axios
          .get(`http://localhost:3000/api/invoices`, {
            params: { page, limit: PAGE_SIZE },
          })
          .then((res) => {
            const data = res.data.data || [];
            setInvoices(data);
            setTotalPages(res.data.totalPages || 1);
            // Prepare daily chart data
            const salesByDate = {};
            let totalSales = 0;
            let totalCost = 0;
            const productSales = {};
            data.forEach((inv) => {
              const date = inv.createdAt?.slice(0, 10) || "Unknown";
              const sale = inv.grandTotal || inv.total || 0;
              salesByDate[date] = (salesByDate[date] || 0) + sale;
              totalSales += sale;
              // Calculate cost and top products
              if (Array.isArray(inv.items)) {
                inv.items.forEach(item => {
                  // If item has cost field, use it; else assume cost = 0
                  const cost = item.cost || 0;
                  totalCost += cost * (item.quantity || 1);
                  // Top products (only those in DB)
                  if (item.name && productsInDb.includes(item.name)) {
                    productSales[item.name] = (productSales[item.name] || 0) + (item.quantity || 1);
                  }
                });
              }
            });
            setProfit(totalSales - totalCost);
            // Top-selling products array
            const topArr = Object.entries(productSales)
              .map(([name, qty]) => ({ name, qty }))
              .sort((a, b) => b.qty - a.qty)
              .slice(0, 10); // top 10
            setTopProducts(topArr);
            const dailyArr = Object.entries(salesByDate).map(([date, sales]) => ({ date, sales }));
            setChartData(dailyArr);
            // Table CSV: all paginated invoices
            setTableCsv(data.map(inv => ({
              invoiceNumber: inv.invoiceNumber,
              customerName: inv.customerName,
              createdAt: inv.createdAt?.slice(0,10),
              grandTotal: inv.grandTotal || inv.total || 0,
              status: inv.status || 'Paid',
            })));
            // Daily CSV: only today's invoices
            const today = new Date().toISOString().slice(0,10);
            setDailyCsv(
              data.filter(inv => inv.createdAt?.slice(0,10) === today)
                .map(inv => ({
                  invoiceNumber: inv.invoiceNumber,
                  customerName: inv.customerName,
                  createdAt: inv.createdAt?.slice(0,10),
                  grandTotal: inv.grandTotal || inv.total || 0,
                  status: inv.status || 'Paid',
                }))
            );
            setError("");
          })
          .catch((err) => {
            setError("Failed to fetch invoices");
          })
          .finally(() => setLoading(false));
      });
  }, [page]);

  // Monthly sales chart (all pages)
  useEffect(() => {
    // fetch all invoices for monthly aggregation (could be optimized with backend aggregation)
    axios.get(`http://localhost:3000/api/invoices`, { params: { limit: 1000 } })
      .then((res) => {
        const data = res.data.data || [];
        const salesByMonth = {};
        data.forEach((inv) => {
          if (!inv.createdAt) return;
          const month = inv.createdAt.slice(0, 7); // YYYY-MM
          salesByMonth[month] = (salesByMonth[month] || 0) + (inv.grandTotal || inv.total || 0);
        });
        const monthlyArr = Object.entries(salesByMonth).map(([month, sales]) => ({ month, sales }));
        setMonthlyChartData(monthlyArr);
        // Monthly CSV: only current month invoices
        const currentMonth = new Date().toISOString().slice(0,7);
        setMonthlyCsv(
          data.filter(inv => inv.createdAt?.slice(0,7) === currentMonth)
            .map(inv => ({
              invoiceNumber: inv.invoiceNumber,
              customerName: inv.customerName,
              createdAt: inv.createdAt?.slice(0,10),
              grandTotal: inv.grandTotal || inv.total || 0,
              status: inv.status || 'Paid',
            }))
        );
      });
  }, []);

  // Export to PDF (daily or monthly)
  const handleExportPDF = (type = "table") => {
    const doc = new jsPDF();
    let y = 20;
    if (type === "monthly") {
      doc.text("Monthly Sales Report", 10, 10);
      monthlyCsv.forEach((row, idx) => {
        doc.text(`${idx + 1}. ${row.invoiceNumber} | ${row.customerName} | ${row.createdAt} | $${row.grandTotal} | ${row.status}`, 10, y);
        y += 8;
      });
      doc.save("monthly-sales-report.pdf");
    } else if (type === "daily") {
      doc.text("Daily Sales Report", 10, 10);
      dailyCsv.forEach((row, idx) => {
        doc.text(`${idx + 1}. ${row.invoiceNumber} | ${row.customerName} | ${row.createdAt} | $${row.grandTotal} | ${row.status}`, 10, y);
        y += 8;
      });
      doc.save("daily-sales-report.pdf");
    } else {
      doc.text("Invoices Report", 10, 10);
      tableCsv.forEach((row, idx) => {
        doc.text(`${idx + 1}. ${row.invoiceNumber} | ${row.customerName} | ${row.createdAt} | $${row.grandTotal} | ${row.status}`, 10, y);
        y += 8;
      });
      doc.save("invoices-report.pdf");
    }
  };

  // CSV headers
  const csvHeaders = [
    { label: "Invoice #", key: "invoiceNumber" },
    { label: "Customer", key: "customerName" },
    { label: "Date", key: "createdAt" },
    { label: "Total", key: "grandTotal" },
    { label: "Status", key: "status" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-8 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">📊 Sales Reports</h2>
        <div className="flex gap-2 flex-wrap">
          <div className="bg-gray-700 text-white px-4 py-2 rounded mr-2">
            <span className="font-bold">Total Profit:</span> ${profit.toLocaleString()}
          </div>
          <CSVLink
            data={tableCsv}
            headers={csvHeaders}
            filename={`invoices-report.csv`}
            className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700"
          >
            Export Table CSV
          </CSVLink>
          <button
            onClick={() => handleExportPDF("table")}
            className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
          >
            Export Table PDF
          </button>
          <CSVLink
            data={dailyCsv}
            headers={csvHeaders}
            filename={`daily-sales-report.csv`}
            className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700"
          >
            Export Daily CSV
          </CSVLink>
          <button
            onClick={() => handleExportPDF("daily")}
            className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
          >
            Export Daily PDF
          </button>
          <CSVLink
            data={monthlyCsv}
            headers={csvHeaders}
            filename={`monthly-sales-report.csv`}
            className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700"
          >
            Export Monthly CSV
          </CSVLink>
          <button
            onClick={() => handleExportPDF("monthly")}
            className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
          >
            Export Monthly PDF
          </button>
        </div>
      </div>
     <div className="flex gap-4 w-full" >
      {/* Daily Chart */}
      <div className="bg-white/5 w-[33%] backdrop-blur-md rounded-xl shadow-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-2">Daily Sales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#fff" tick={{ fontSize: 10, fill: '#fff' }} />
            <YAxis stroke="#fff" tick={{ fontSize: 10, fill: '#fff' }} />
            <Tooltip />
            <Bar dataKey="sales" fill="#00bfff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white/5 w-[33%] backdrop-blur-md rounded-xl shadow-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-2">Monthly Sales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#fff" tick={{ fontSize: 10, fill: '#fff' }} />
            <YAxis stroke="#fff" tick={{ fontSize: 10, fill: '#fff' }} />
            <Tooltip />
            <Bar dataKey="sales" fill="#ffb300" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products Chart */}
      <div className="bg-white/5 w-[33%] backdrop-blur-md rounded-xl shadow-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-2">Top-Selling Products</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#fff" interval={0} angle={-30} textAnchor="end" height={80} tick={{ fontSize: 10, fill: '#fff' }} />
            <YAxis stroke="#fff" tick={{ fontSize: 10, fill: '#fff' }} />
            <Tooltip />
            <Bar dataKey="qty" fill="#4caf50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-xl p-6">
        <h3 className="text-lg font-semibold mb-2">Invoices (Page {page} of {totalPages})</h3>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-400">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="px-2 py-2">Invoice #</th>
                  <th className="px-2 py-2">Customer</th>
                  <th className="px-2 py-2">Date</th>
                  <th className="px-2 py-2">Total</th>
                  <th className="px-2 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv._id} className="border border-gray-700">
                    <td className="px-2 py-2">{inv.invoiceNumber}</td>
                    <td className="px-2 py-2">{inv.customerName}</td>
                    <td className="px-2 py-2">{inv.createdAt?.slice(0,10)}</td>
                    <td className="px-2 py-2">${inv.grandTotal || inv.total || 0}</td>
                    <td className="px-2 py-2">{"Paid"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
