import React from 'react'
// import SideBar from './SideBar'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import SideBar from './Sidebar'

const AdminLayout = () => (
  <div className="flex min-h-screen">
    <SideBar />
    <div className="flex flex-col flex-1 h-screen">
      <div style={{ height: '100px' }}>
        <Header />
      </div>
      <div
        className="flex-1"
        style={{
          background: 'var(--secondary-color)',
          overflowY: 'auto',
          minHeight: 0,
          maxHeight: 'calc(100vh - 100px)'
        }}
      >
        <Outlet />
      </div>
    </div>
  </div>
);

export default AdminLayout;
