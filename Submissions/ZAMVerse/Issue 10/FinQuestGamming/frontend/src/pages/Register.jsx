import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Register = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    try {
      await register(formData.name, formData.email, formData.password)
    } catch (error) {
      alert('Registration failed. Please try again.')
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section id="register">
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <i className="fas fa-coins"></i>
          </div>
          <h2 className="login-title">Create Account</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="reg-name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email</label>
              <input
                type="email"
                className="form-control"
                id="reg-email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <input
                type="password"
                className="form-control"
                id="reg-password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="reg-confirm"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className="btn" style={{ width: '100%' }}>
              Register
            </button>
          </form>
          
          <div className="toggle-form">
            Already have an account? <a onClick={onToggleForm}>Login</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register