import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// simple response wrapper
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // central place for error handling
    return Promise.reject(error.response ? error.response.data : error);
  }
);

export default api;
