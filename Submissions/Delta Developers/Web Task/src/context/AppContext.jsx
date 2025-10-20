import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, fileStorage } from '../db/database';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // State for data with file-based storage
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [dataVersion, setDataVersion] = useState(0);

  // Load data from file storage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [productsData, salesData, employeesData, customersData, attendanceData] = await Promise.all([
      db.products.toArray(),
      db.sales.toArray(),
      db.employees.toArray(),
      db.customers.toArray(),
      db.attendance.toArray()
    ]);
    
    setProducts(productsData);
    setSales(salesData);
    setEmployees(employeesData);
    setCustomers(customersData);
    setAttendance(attendanceData);
  };

  // Refresh data after changes
  const refreshData = () => {
    loadData();
    setDataVersion(prev => prev + 1);
  };

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Dashboard calculations
  const getDashboardStats = () => {
    const today = new Date().toISOString().split('T')[0];
    
    const todaySales = sales?.filter(sale => 
      sale.date.startsWith(today)
    ) || [];

    const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const todayProfit = todaySales.reduce((sum, sale) => sum + sale.profit, 0);
    
    const todayAttendance = attendance?.filter(att => 
      att.date === today && att.status === 'absent'
    ) || [];

    return {
      todaySales: todayTotal,
      todayProfit: todayProfit,
      totalProducts: products?.length || 0,
      absentToday: todayAttendance.length
    };
  };

  // Finance calculations
  const getFinanceStats = (period = 'today') => {
    const now = new Date();
    let filteredSales = sales || [];

    if (period === 'today') {
      const today = now.toISOString().split('T')[0];
      filteredSales = sales?.filter(sale => sale.date.startsWith(today)) || [];
    } else if (period === 'month') {
      const month = now.toISOString().substring(0, 7);
      filteredSales = sales?.filter(sale => sale.date.startsWith(month)) || [];
    }

    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalCost = filteredSales.reduce((sum, sale) => sum + sale.cost, 0);
    const grossProfit = totalSales - totalCost;
    
    const totalSalaries = employees?.reduce((sum, emp) => sum + emp.salary, 0) || 0;
    const netProfit = grossProfit - totalSalaries;

    // Top selling products
    const productSales = {};
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.product_id]) {
          productSales[item.product_id] = {
            name: item.name,
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.product_id].quantity += item.quantity;
        productSales[item.product_id].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      totalSales,
      totalCost,
      grossProfit,
      totalSalaries,
      netProfit,
      topProducts,
      salesCount: filteredSales.length
    };
  };

  const value = {
    darkMode,
    toggleDarkMode,
    products,
    sales,
    employees,
    customers,
    attendance,
    getDashboardStats,
    getFinanceStats,
    refreshData,
    fileStorage,
    db
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
