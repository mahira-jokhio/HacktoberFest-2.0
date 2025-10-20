import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { FinanceProvider, useFinance } from './contexts/FinanceContext'
import Navbar from './components/common/Navbar'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Goals from './pages/Goals'
import Achievements from './pages/Achievements'
import Login from './pages/Login'
import Register from './pages/Register'

function AppContent() {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')

  if (!user) {
    return (
      <div>
        {currentPage === 'login' ? (
          <Login onToggleForm={() => setCurrentPage('register')} />
        ) : (
          <Register onToggleForm={() => setCurrentPage('login')} />
        )}
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'transactions':
        return <Transactions />
      case 'goals':
        return <Goals />
      case 'achievements':
        return <Achievements />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app">
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="container">
        {renderPage()}
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <AppContent />
      </FinanceProvider>
    </AuthProvider>
  )
}

export default App