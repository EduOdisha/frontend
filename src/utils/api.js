import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Chrome and other browsers always log failed network requests in RED in the console
    // This is a browser feature and cannot be completely hidden by code.
    
    const message = error.response?.data?.message || 'Something went wrong';
    
    // We only log "real" errors that aren't 401 (Not Logged In)
    if (error.response?.status !== 401) {
      console.error('EduOdisha API Error:', message);
    }
    
    return Promise.reject(error);
  }
);

export default api;