import axios from 'axios';

export const BASE_URL = 'https://whatsapp-api-salution-production-9.up.railway.app';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add API Key
api.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('apiKey');
  if (apiKey) {
    config.headers['x-api-key'] = apiKey;
  }
  return config;
});

// Response interceptor to handle revoked keys
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.data?.error === 'Invalid API key') {
      // Clear storage and redirect on revoked key
      localStorage.removeItem('apiKey');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login?error=revoked';
      }
    }
    return Promise.reject(error);
  }
);
