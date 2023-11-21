// axios.js
import axios from 'axios';

// Set up Axios instance
const instance = axios.create();

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { instance };