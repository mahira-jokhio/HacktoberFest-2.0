import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = ({ currentPage, onPageChange }) => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <header>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-coins"></i>
            <span>FinQuest</span>
          </div>
          <nav>
            <ul>
              <li>
                <a 
                  href="#" 
                  className={currentPage === 'dashboard' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange('dashboard')
                  }}
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={currentPage === 'transactions' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange('transactions')
                  }}
                >
                  Transactions
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={currentPage === 'goals' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange('goals')
                  }}
                >
                  Goals
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={currentPage === 'achievements' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange('achievements')
                  }}
                >
                  Achievements
                </a>
              </li>
            </ul>
          </nav>
          <div className="user-actions">
            <div className="user-profile">
              <div className="avatar">{user?.avatar}</div>
              <span>{user?.name}</span>
            </div>
            <button className="btn btn-outline" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar