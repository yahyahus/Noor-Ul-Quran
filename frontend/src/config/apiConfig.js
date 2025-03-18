// API base URL configuration
const getApiBaseUrl = () => {
  // For Create React App, environment variables must start with REACT_APP_
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Fallback for development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000';
  }
  
  // Fallback for production - could be relative URL or actual domain
  return window.location.origin.includes('localhost') 
    ? 'http://localhost:5000' 
    : `${window.location.origin}/api`;
};

export const API_BASE_URL = getApiBaseUrl();