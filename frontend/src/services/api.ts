import axios from 'axios';
import { SearchQuery, Product, CountryMap } from '../types';
import { API_URL } from '../config';

// Create axios instance with configuration
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Add a retry interceptor with a max retry limit
api.interceptors.response.use(undefined, async (error) => {
  const { config, message } = error;
  
  // If the request was made and the server responded with a status code outside of 2xx range
  if (error.response) {
    console.error('Server responded with error:', error.response.status, error.response.data);
    return Promise.reject(error);
  }
  
  // If the request was made but no response was received (network error)
  // Only retry once to prevent infinite loops
  if (error.request && !config._retry && (message.includes('Network Error') || message.includes('timeout'))) {
    config._retry = true;
    return new Promise((resolve) => {
      setTimeout(() => resolve(api(config)), 1000);
    });
  }
  
  return Promise.reject(error);
});

export const searchProducts = async (searchQuery: SearchQuery): Promise<Product[]> => {
  try {
    const response = await api.post('/products/search', searchQuery);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    // Return empty array instead of throwing to avoid crashing the UI
    return [];
  }
};

export const getCountries = async (): Promise<CountryMap> => {
  try {
    const response = await api.get('/products/countries');
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    // Return empty object instead of throwing
    return {};
  }
}; 