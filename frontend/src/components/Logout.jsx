import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthenticated } from '../../src/store/slices/authSlice.js';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useLogoutHelper = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  const handleLogout = async () => {
    try {
      // const response = await fetch('http://localhost:5000/logout', {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        dispatch(setAuthenticated(false));
        navigate('/');
      } else {
        console.log(response);
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return handleLogout;
};
