import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthenticated } from '../store/slices/authSlice.js';



const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:5000/portal', { method: 'GET', credentials: 'include' });
      if (response.ok) {
        dispatch(setAuthenticated(true));
      } else if (response.status === 403 || response.status === 401) {
        dispatch(setAuthenticated(false));
      } else {
        dispatch(setAuthenticated(false));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return { isAuthenticated, checkAuth };
};

export default useAuth;
