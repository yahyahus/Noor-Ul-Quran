import { API_BASE_URL } from "@/config";
import { setAuthenticated } from '@/store/slices/authSlice.js';
import { setRole } from '@/store/slices/roleSlice.js';

export const checkAuth = async (dispatch) => {
  try {
    const response = await fetch(`${API_BASE_URL}/isloggedin`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();
    console.log('API Response:', data); // Debugging

    if (response.ok && data.status === "success" && data.data?.user) {
      dispatch(setAuthenticated(true));
      dispatch(setRole({ role: data.data.user.role }));
    } else {
      console.log(`Auth Check Failed: ${response.status} - ${data.message || response.statusText}`);
      dispatch(setAuthenticated(false));
      dispatch(setRole({ role: '' }));
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    dispatch(setAuthenticated(false));
    dispatch(setRole({ role: '' }));
  }
};
