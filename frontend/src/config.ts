// Configuration file for environment-specific settings

// API URL - use environment variable in production, fallback for development
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Other configuration variables can be added here 