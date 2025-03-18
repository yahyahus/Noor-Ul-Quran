import store from '../../store/store.js';
import { setAuthenticated } from '../../store/slices/authSlice.js';
import { setRole } from '../../store/slices/roleSlice.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const login = async (email, password, navigate) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
      credentials: 'include',
    });
    const data = await response.json();
    if (response.ok)
      {
      store.dispatch(setAuthenticated(true));

      // Set the role in the store
      store.dispatch(setRole(data.data.user.role));
      console.log(`Navigating to /portal/${data.data.user.role}/dashboard`);
      navigate(`/portal/${data.data.user.role}/dashboard`);
      return { success: true };
    }
    if (response.status === 401) {
      return { success: false, message: data.message };
    }
  } catch (error) {
    //console.error('Error:', error);
    return { success: false, message: 'An error occurred' };
  }
};

export const register = async (email, password, firstname, lastname, navigate) => {
  try {
    const role = store.getState().role;

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password, firstname, lastname, role }),
      credentials: 'include',
    });
    const data = await response.json();
    
    if (response.ok) {
      store.dispatch(setAuthenticated(true));
      console.log('Navigating to /portal/${role}/dashboard');
      navigate('/portal/${role}/dashboard');
      return { success: true };
    }
    
    // Return the detailed error message if available
    return { 
      success: false, 
      message: data.details || data.errors?.[0]?.message || data.message
    };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: 'An error occurred' };
  }
};