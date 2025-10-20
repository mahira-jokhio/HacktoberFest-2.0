import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../db/database';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      const sessionData = localStorage.getItem('userSession');
      if (sessionData) {
        try {
          const parsedSession = JSON.parse(sessionData);
          // Validate session is not expired (24 hours)
          const sessionTime = new Date(parsedSession.timestamp).getTime();
          const currentTime = new Date().getTime();
          const hoursDiff = (currentTime - sessionTime) / (1000 * 60 * 60);
          
          if (hoursDiff < 24) {
            setUser(parsedSession.user);
          } else {
            // Session expired
            localStorage.removeItem('userSession');
          }
        } catch (error) {
          console.error('Error parsing session:', error);
          localStorage.removeItem('userSession');
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const login = async (username, password) => {
    try {
      // Find user by username
      const foundUser = await db.users.findByUsername(username);
      
      if (!foundUser) {
        throw new Error('Invalid username or password');
      }

      // Verify password (in production, use proper hashing)
      if (foundUser.password !== password) {
        throw new Error('Invalid username or password');
      }

      // Create session object (exclude password)
      const userSession = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        name: foundUser.name
      };

      // Store session in localStorage
      const sessionData = {
        user: userSession,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('userSession', JSON.stringify(sessionData));

      setUser(userSession);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('userSession');
    setUser(null);
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    if (requiredRole === 'cashier') {
      // Both admin and cashier can access cashier routes
      return user.role === 'admin' || user.role === 'cashier';
    }
    return user.role === requiredRole;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
