import { useState, useEffect } from 'react';
// import axios from '../utils/axios'; // Or use "axios" directly
import axios from '../utils/axios';
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: loading, true: logged in, false: not
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Assuming backend has a /auth/me route that checks cookies and returns user data
        const response = await axios.get('http://localhost:3000/api/auth/me');
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  return { isAuthenticated, user };
};

export default useAuth;