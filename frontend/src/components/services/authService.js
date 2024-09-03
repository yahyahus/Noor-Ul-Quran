import store from '../../store/store.js';
import { setAuthenticated } from '../../store/slices/authSlice.js';
import { setRole } from '../../store/slices/roleSlice.js';

export const login = async (email, password, navigate) => {
  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
      credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
      store.dispatch(setAuthenticated(true));
      store.dispatch(setRole(data.role)); // Dispatch the user's role
      navigate('/portal');
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
    const role = store.getState().role; // Get the role from the Redux store

    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password, firstname, lastname, role }),
      credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
      store.dispatch(setAuthenticated(true));
      navigate('/portal');
      return { success: true };
    }
    if (response.status === 400) {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: 'An error occurred' };
  }
};
