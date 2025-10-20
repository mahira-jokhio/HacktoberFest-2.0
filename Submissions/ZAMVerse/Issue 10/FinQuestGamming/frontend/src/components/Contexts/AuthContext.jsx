import React, { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = (email, password) => {
    // Mock login - in real app, this would be an API call
    setUser({
      id: 1,
      name: 'ZAMVerse',
      email: email,
      avatar: 'ZAM'
    })
    return Promise.resolve()
  }

  const register = (name, email, password) => {
    // Mock registration - in real app, this would be an API call
    setUser({
      id: 1,
      name: name,
      email: email,
      avatar: name.substring(0, 3).toUpperCase()
    })
    return Promise.resolve()
  }

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}