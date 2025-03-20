import { API_BASE_URL } from "@/config";

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
      dispatch(setRole(data.data?.user?.role)); // Use optional chaining to prevent errors
    } else {
      console.log(`Auth Check Failed: ${response.status} - ${response.statusText}`);
      dispatch(setAuthenticated(false));
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};
