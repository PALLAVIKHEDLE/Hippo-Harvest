import {
  OPENWEATHER_API_BASE_URL,
  OPENWEATHER_API_KEY,
  UNITS,
  ENDPOINTS,
} from '../config/constants';
import { CurrentWeather } from '../../app/types/weather';

export async function fetchWeatherData(lat: number, lon: number): Promise<CurrentWeather> {
  if (!OPENWEATHER_API_KEY) {
    console.error('API Key missing:', { OPENWEATHER_API_KEY });
    throw new Error('OpenWeather API key is not configured. Please check your .env file.');
  }

  const url = `${OPENWEATHER_API_BASE_URL}${ENDPOINTS.CURRENT_WEATHER}?lat=${lat}&lon=${lon}&units=${UNITS}&appid=${OPENWEATHER_API_KEY}`;
  console.log('Fetching weather data:', { url, lat, lon, units: UNITS });

  try {
    const response = await fetch(url);
    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', { status: response.status, error: errorText });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CurrentWeather = await response.json();
    console.log('Weather data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}
