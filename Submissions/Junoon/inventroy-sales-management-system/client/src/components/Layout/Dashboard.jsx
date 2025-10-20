import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Legend } from "recharts";

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [salesData, setSalesData] = useState([]); // daily
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get("http://localhost:3000/api/invoices", { params: { limit: 1000 } }),
      axios.get("http://localhost:3000/api/products", { params: { limit: 1000 } })
    ]).then(([invRes, prodRes]) => {
      const invs = invRes.data.data || [];
      const prods = prodRes.data.data || [];
      setInvoices(invs);
      setProducts(prods);

      // Daily sales
      const salesByDate = {};
      invs.forEach((inv) => {
        const date = inv.createdAt?.slice(0, 10) || "Unknown";
        salesByDate[date] = (salesByDate[date] || 0) + (inv.grandTotal || inv.total || 0);
      });
      setSalesData(Object.entries(salesByDate).map(([date, sales]) => ({ date, sales })));

      // Monthly sales
      const salesByMonth = {};
      invs.forEach((inv) => {
        if (!inv.createdAt) return;
        const month = inv.createdAt.slice(0, 7); // YYYY-MM
        salesByMonth[month] = (salesByMonth[month] || 0) + (inv.grandTotal || inv.total || 0);
      });
      setMonthlySalesData(Object.entries(salesByMonth).map(([month, sales]) => ({ month, sales })));

      setLoading(false);
    });
  }, []);

  // Product stats
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => Number(p.stock) > 0).length;
  const lowStockProducts = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 5).length;

  // For product stock bar chart
  const productStockData = products.map(p => ({ name: p.name, stock: Number(p.stock) }));

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-700 rounded-lg p-5 shadow text-center">
          <div className="text-3xl font-bold">{totalProducts}</div>
          <div className="text-sm mt-2">Total Products</div>
        </div>
        <div className="bg-green-700 rounded-lg p-5 shadow text-center">
          <div className="text-3xl font-bold">{inStockProducts}</div>
          <div className="text-sm mt-2">In-Stock Products</div>
        </div>
        <div className="bg-yellow-600 rounded-lg p-5 shadow text-center">
          <div className="text-3xl font-bold">{lowStockProducts}</div>
          <div className="text-sm mt-2">Low Stock (&le;5)</div>
        </div>
        <div className="bg-purple-700 rounded-lg p-5 shadow text-center">
          <div className="text-3xl font-bold">{invoices.length}</div>
          <div className="text-sm mt-2">Total Sales (Invoices)</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Daily Sales Chart */}
        <div className="bg-white/5 rounded-xl shadow-xl p-6">
          <h3 className="text-lg font-semibold mb-2">Daily Sales</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#00bfff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Sales Chart */}
        <div className="bg-white/5 rounded-xl shadow-xl p-6">
          <h3 className="text-lg font-semibold mb-2">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlySalesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="sales" fill="#ffb300" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Stock Chart */}
      <div className="bg-white/5 rounded-xl shadow-xl p-6 mt-8">
        <h3 className="text-lg font-semibold mb-2">Product Stock Levels</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productStockData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#fff" interval={0} angle={-30} textAnchor="end" height={80} />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Bar dataKey="stock" fill="#00e676" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {loading && <div className="text-center py-8">Loading...</div>}
    </div>
  );
};

export default Dashboard;
