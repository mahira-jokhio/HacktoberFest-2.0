import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Login = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(formData.email, formData.password)
    } catch (error) {
      alert('Login failed. Please try again.')
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section id="login">
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <i className="fas fa-coins"></i>
          </div>
          <h2 className="login-title">Welcome to FinQuest</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className="btn" style={{ width: '100%' }}>
              Login
            </button>
          </form>
          
          <div className="toggle-form">
            Don't have an account? <a onClick={onToggleForm}>Register</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login