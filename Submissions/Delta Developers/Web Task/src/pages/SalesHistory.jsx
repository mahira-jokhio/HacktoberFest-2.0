import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, DollarSign, TrendingUp, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const SalesHistory = () => {
  const { getFinanceStats, sales, customers, products } = useApp();
  const [period, setPeriod] = useState('today');
  
  const stats = getFinanceStats(period);

  // Prepare monthly sales data for bar chart
  const monthlySalesData = useMemo(() => {
    const monthlyData = {};
    const currentYear = new Date().getFullYear();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().substring(0, 7);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[monthKey] = { month: monthName, sales: 0, profit: 0, cost: 0 };
    }
    
    // Aggregate sales data
    sales?.forEach(sale => {
      const monthKey = sale.date.substring(0, 7);
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].sales += sale.total;
        monthlyData[monthKey].profit += sale.profit;
        monthlyData[monthKey].cost += sale.cost;
      }
    });
    
    return Object.values(monthlyData).map(item => ({
      ...item,
      sales: Math.round(item.sales),
      profit: Math.round(item.profit),
      cost: Math.round(item.cost)
    }));
  }, [sales]);

  // Category-wise sales for pie chart
  const categorySalesData = useMemo(() => {
    const categorySales = {};
    
    const filteredSales = period === 'today' 
      ? sales?.filter(sale => sale.date.startsWith(new Date().toISOString().split('T')[0]))
      : period === 'month'
      ? sales?.filter(sale => sale.date.startsWith(new Date().toISOString().substring(0, 7)))
      : sales;
    
    filteredSales?.forEach(sale => {
      sale.items.forEach(item => {
        const product = products?.find(p => p.id === item.product_id);
        const category = product?.category || 'Unknown';
        
        if (!categorySales[category]) {
          categorySales[category] = 0;
        }
        categorySales[category] += item.price * item.quantity;
      });
    });

    return Object.entries(categorySales).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round(value)
    }));
  }, [sales, products, period]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  const getCustomerName = (sale) => {
    // First check if customer_name is stored directly in the sale
    if (sale.customer_name) {
      return sale.customer_name;
    }
    // Fallback to looking up by customer_id
    if (sale.customer_id) {
      const customer = customers?.find(c => c.id === sale.customer_id);
      return customer?.name || 'Unknown Customer';
    }
    return 'Walk-in Customer';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredSales = sales?.filter(sale => {
    const now = new Date();
    if (period === 'today') {
      const today = now.toISOString().split('T')[0];
      return sale.date.startsWith(today);
    } else if (period === 'month') {
      const month = now.toISOString().substring(0, 7);
      return sale.date.startsWith(month);
    }
    return true;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales & Finance</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your sales performance and profitability
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('today')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === 'today'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === 'month'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Finance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sales</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                Rs. {stats.totalSales.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <DollarSign className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Cost</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                Rs. {stats.totalCost.toLocaleString()}
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Package className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gross Profit</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                Rs. {stats.grossProfit.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
              <p className={`text-2xl font-bold mt-2 ${
                stats.netProfit >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                Rs. {stats.netProfit.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                After salaries: Rs. {stats.totalSalaries.toLocaleString()}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stats.netProfit >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
              <DollarSign className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">6-Month Sales Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value) => `Rs. ${value.toLocaleString()}`}
              />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
              <Bar dataKey="profit" fill="#10b981" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category-wise Sales Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Sales by Category ({period === 'today' ? 'Today' : 'This Month'})
          </h2>
          {categorySalesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categorySalesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categorySalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value) => `Rs. ${value.toLocaleString()}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              No sales data available for this period
            </div>
          )}
        </div>
      </div>

      {/* Profit Trend Line Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Profit Trend (6 Months)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              stroke="#9ca3af"
              style={{ fontSize: '11px' }}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value) => `Rs. ${value.toLocaleString()}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="profit" 
              stroke="#10b981" 
              strokeWidth={3}
              name="Profit"
              dot={{ fill: '#10b981', r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="cost" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Cost"
              dot={{ fill: '#f59e0b', r: 4 }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Selling Products */}
      {stats.topProducts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Top Selling Products</h2>
          <div className="space-y-3">
            {stats.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{product.quantity} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 dark:text-green-400">
                    Rs. {product.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Sales Transactions ({filteredSales.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSales.map(sale => (
                <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(sale.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {getCustomerName(sale)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {sale.items.map((item, idx) => (
                      <div key={idx}>{item.name} x{item.quantity}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                    Rs. {sale.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    Rs. {sale.cost.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                    Rs. {sale.profit.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;
