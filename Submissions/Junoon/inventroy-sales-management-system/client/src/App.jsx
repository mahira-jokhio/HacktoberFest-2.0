import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/Layout/AdminLayout";
import Dashboard from "./components/Layout/Dashboard";
import Products from "./components/Layout/Products";
import AddProduct from "./components/Layout/AddProduct";
import Invoice from "./components/Layout/Invoice";
import RegisterComp from "./components/forms/RegisterComp";
import PublicRoute from "./components/Layout/PublicRoute";
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import LoginComp from "./components/forms/LoginComp";
import Reports from "./components/Layout/Reports";

// Layouts
// import AdminLayout from "./layouts/AdminLayout";
// import CashierLayout from "./layouts/CashierLayout";

// // Admin Pages
// import Dashboard from "./pages/admin/Dashboard";
// import Products from "./pages/admin/Products";
// import AddProduct from "./pages/admin/AddProduct";
// import Invoices from "./pages/admin/Invoices";
// import Reports from "./pages/admin/Reports";
// import LowStock from "./pages/admin/LowStock";
// // import Users from "./pages/admin/Users";
// import POS from "./pages/admin/POS";
// // import Profile from "./pages/admin/Profile";

// // Cashier Pages
// import CashierDashboard from "./pages/cashier/Dashboard";
// import CashierPOS from "./pages/cashier/POS";
// import CashierInvoices from "./pages/cashier/Invoices";
// import CashierProducts from "./pages/cashier/Products";
// // import CashierProfile from "./pages/cashier/Profile";

function AppRoutes() {
  return (
    <Router>
      <Routes>

         <Route path="login" element={ <PublicRoute><LoginComp /></PublicRoute>} />
         <Route path="register" element={ <PublicRoute><RegisterComp /></PublicRoute>} />
        {/* ✅ Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="invoice" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
          <Route path="reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          {/* <Route path="pos" element={<POS />} /> */}
          {/* <Route path="invoices" element={<Invoices />} />
          <Route path="reports" element={<Reports />} />
          <Route path="low-stock" element={<LowStock />} /> */}

        </Route>

        {/* ✅ Cashier Routes */}
        {/* <Route path="/cashier" element={<CashierLayout />}>
          <Route path="dashboard" element={<CashierDashboard />} />
          <Route path="pos" element={<CashierPOS />} />
          <Route path="invoices" element={<CashierInvoices />} />
          <Route path="products" element={<CashierProducts />} />

        </Route> */}

        {/* ✅ Default Redirect */}
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />

      </Routes>
    </Router>
  );
}

export default AppRoutes;
