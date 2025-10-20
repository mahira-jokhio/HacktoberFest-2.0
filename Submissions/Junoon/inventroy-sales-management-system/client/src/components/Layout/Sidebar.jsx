import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from '../../utils/axios'

const adminNavItems = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Products", path: "/admin/products" },
  { name: "Invoice", path: "/admin/invoice" },
  // { name: "POS (Sell)", path: "/admin/pos" },
  // { name: "Sales / Invoices", path: "/admin/invoices" },
  { name: "Reports", path: "/admin/reports" },
  // { name: "Low Stock Alerts", path: "/admin/low-stock" },
  // { name: "Users", path: "/admin/users" }, // manage cashier users
  // { name: "Profile", path: "/admin/profile" },
];

const SideBar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      alert('Logout failed');
    }
  };

  return (
    <>
      {/* Floating button for small screens */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-red-600 text-white rounded-full p-4 shadow-lg md:hidden"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle Sidebar"
      >
        {open ? (
          <span>&#10005;</span> // X icon
        ) : (
          <span>&#9776;</span> // Hamburger icon
        )}
      </button>
      <aside
        className={`w-72 min-h-screen flex flex-col shadow-lg border-r fixed top-0 left-0 z-40 bg-[var(--secondary-color)] text-[var(--text-color)] transition-transform duration-300 md:static md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} md:block`}
        style={{ borderColor: 'var(--text-color)' }}
      >
        <div
          className="text-2xl font-bold py-6 px-4 tracking-wide"
          style={{ borderBottom: '1px solid var(--text-color)' }}
        >
          Admin Panel
        </div>
        <nav className="flex-1 h-[70%] px-4 py-6">
          <ul className="space-y-2">
            {adminNavItems.map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded transition-colors ${
                      isActive
                        ? 'bg-[var(--primary-color)] text-[var(--text-color)] font-semibold'
                        : 'hover:bg-[var(--primary-color)] hover:text-[var(--text-color)]'
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto px-4 py-4 text-xs flex flex-col gap-2" style={{ borderTop: '1px solid var(--text-color)', color: 'var(--text-color)' }}>
          <button
            onClick={handleLogout}
            className="w-full py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
          <span>&copy; {new Date().getFullYear()} Admin Panel</span>
        </div>
      </aside>
    </>
  )
}

export default SideBar
