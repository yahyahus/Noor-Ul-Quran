// useAuth.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
import { setAuthenticated } from '../store/slices/authSlice.js';
import { setRole } from '../store/slices/roleSlice.js';

export const checkAuth = async (dispatch) => {
  try {
    const response = await fetch(`${API_BASE_URL}/isloggedin`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();  // Parse the JSON body
      //how to log the msg
      dispatch(setAuthenticated(true));
      dispatch(setRole(data.data.user.role));  // Set the role in the store
    } else if (response.status === 403 || response.status === 401) {
      dispatch(setAuthenticated(false));
    } else {
      dispatch(setAuthenticated(false));
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

