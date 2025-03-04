export const OPENWEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Get API key from environment variable
export const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// Temperature units
export const UNITS = 'metric'; // Using Celsius

// API endpoints
export const ENDPOINTS = {
  CURRENT_WEATHER: '/weather',
} as const;
