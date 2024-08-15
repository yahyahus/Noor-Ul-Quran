import { useNavigate } from 'react-router-dom';
import { useState } from 'react';



const useAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:5000/portal', { method: 'GET', credentials: 'include' });
      if (response.ok) {
        setIsAuthenticated(true);
      } else if (response.status === 403) {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setIsAuthenticated(true);
        navigate('/portal');
      }
      return data;
    } catch (error) {
      console.error('Error:', error);
      return { message: 'An error occurred' };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setIsAuthenticated(true);
        navigate('/portal');
      }
      return data;
    } catch (error) {
      console.error('Error:', error);
      return { message: 'An error occurred' };
    }
  };

  return { isAuthenticated, checkAuth, login, register };
};

export default useAuth;
