import axios from 'axios';

const api = axios.create({
  baseURL: `http://${window.location.hostname}:8080`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Don't send token for login or register requests
    if (config.url.includes('/auth/login') || config.url.includes('/register')) {
      return config;
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
