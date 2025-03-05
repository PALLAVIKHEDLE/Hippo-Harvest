import React from 'react';
import { Weather } from '../types';

interface Props {
  weather: Weather | null;
  targetTemperature: number;
}

export default function WeatherDisplay({ weather, targetTemperature }: Props) {
  if (!weather) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
        <div className="text-gray-500 flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading weather data...
        </div>
      </div>
    );
  }

  const currentTemp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const tempDiff = (targetTemperature - currentTemp).toFixed(1);

  // Format sunrise and sunset times using the facility's timezone
  const formatTime = (timestamp: number) => {
    try {
      const date = new Date((timestamp + weather.timezone) * 1000);
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, '0');
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Time unavailable';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return '☀️';
      case 'clouds':
        return '☁️';
      case 'rain':
        return '🌧️';
      case 'snow':
        return '❄️';
      case 'thunderstorm':
        return '⛈️';
      case 'drizzle':
        return '🌦️';
      case 'mist':
      case 'fog':
        return '🌫️';
      default:
        return '🌤️';
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Temperature and Weather */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-5xl font-bold text-gray-800 tracking-tighter">
              {currentTemp}°<span className="text-xl text-gray-500 ml-1">C</span>
            </div>
            <div className="ml-3 text-sm text-gray-600">Feels like {feelsLike}°C</div>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-1">{getWeatherIcon(weather.weather[0].main)}</div>
            <div className="text-sm font-medium text-gray-800">
              {weather.weather[0].description}
            </div>
          </div>
        </div>
      </div>

      {/* Target Temperature Info */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-blue-600">Target: {targetTemperature}°C</div>
            <div className="text-xs text-blue-500 mt-0.5">
              {Number(tempDiff) > 0
                ? `${tempDiff}°C below target`
                : Number(tempDiff) < 0
                  ? `${Math.abs(Number(tempDiff))}°C above target`
                  : 'At target temperature'}
            </div>
          </div>
          <div className="text-2xl">
            {Number(tempDiff) > 2 ? '🔼' : Number(tempDiff) < -2 ? '🔽' : '✅'}
          </div>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <span className="text-xl mr-2">💧</span>
            <div>
              <div className="text-xs font-medium text-gray-500">Humidity</div>
              <div className="text-sm font-semibold text-gray-800">{weather.main.humidity}%</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <span className="text-xl mr-2">🌬️</span>
            <div>
              <div className="text-xs font-medium text-gray-500">Wind Speed</div>
              <div className="text-sm font-semibold text-gray-800">
                {Math.round(weather.wind.speed)} m/s
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sunrise/Sunset Times */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-3 shadow-sm">
          <div className="flex items-center">
            <span className="text-xl mr-2">🌅</span>
            <div>
              <div className="text-xs font-medium text-orange-600">Sunrise</div>
              <div className="text-sm font-semibold text-gray-800">
                {formatTime(weather.sys.sunrise)}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-3 shadow-sm">
          <div className="flex items-center">
            <span className="text-xl mr-2">🌇</span>
            <div>
              <div className="text-xs font-medium text-purple-600">Sunset</div>
              <div className="text-sm font-semibold text-gray-800">
                {formatTime(weather.sys.sunset)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
