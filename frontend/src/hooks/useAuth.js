import { API_BASE_URL } from "@/config";
import { setAuthenticated } from '@/store/slices/authSlice.js';
import { setRole } from '@/store/slices/roleSlice.js';

export const checkAuth = async (dispatch) => {
  try {
    const response = await fetch(`${API_BASE_URL}/isloggedin`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json(); // Parse the JSON body
      console.log('API Response:', data); // Log the response

      if (data.message) {
        console.log('Server Message:', data.message); // Log any message from the server
      }

      dispatch(setAuthenticated(true));
      dispatch(setRole({ role: data.data?.user?.role || '' })); // Ensure correct state update
    } else {
      console.log(`Auth Check Failed: ${response.status} - ${response.statusText}`);
      dispatch(setAuthenticated(false));
      dispatch(setRole({ role: '' })); // Clear role on failure
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    dispatch(setAuthenticated(false));
    dispatch(setRole({ role: '' })); // Ensure role resets on errors
  }
};
