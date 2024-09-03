// useAuth.js
import { setAuthenticated } from '../store/slices/authSlice.js';

export const checkAuth = async (dispatch) => {
  try {
    const response = await fetch('http://localhost:5000/portal', {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      dispatch(setAuthenticated(true));
    } else if (response.status === 403 || response.status === 401) {
      dispatch(setAuthenticated(false));
    } else {
      dispatch(setAuthenticated(false));
    }
  } catch (error) {
    // Handle any unexpected errors
    console.error('Unexpected error:', error);
  }
};
