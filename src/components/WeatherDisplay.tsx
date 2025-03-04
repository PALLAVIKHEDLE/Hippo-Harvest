import React from 'react';
import { Weather } from '../types/weather';

interface WeatherDisplayProps {
  weather: Weather | null;
  targetTemperature: number;
}

export default function WeatherDisplay({ weather, targetTemperature }: WeatherDisplayProps) {
  if (!weather) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-200 rounded-lg w-3/4"></div>
        <div className="h-8 bg-gray-200 rounded-lg w-1/2"></div>
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  const currentTemp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const tempDiff = currentTemp - targetTemperature;

  // Convert Unix timestamp to local time
  const sunrise = new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const sunset = new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Get weather icon URL
  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  // Temperature status color and icon
  const getStatusColor = (diff: number) => {
    if (Math.abs(diff) <= 1) return 'text-green-600 bg-green-50';
    return diff > 0 ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50';
  };

  const getStatusIcon = (diff: number) => {
    if (Math.abs(diff) <= 1) return '✓';
    return diff > 0 ? '↑' : '↓';
  };

  return (
    <div className="space-y-6">
      {/* Main Temperature Display */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-baseline">
            <span className="text-5xl font-bold text-gray-800">{currentTemp}°</span>
            <span className="ml-2 text-lg text-gray-500">C</span>
          </div>
          <div className="mt-1 flex items-center">
            <span className="text-sm text-gray-500">Feels like {feelsLike}°C</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-sm text-gray-500 capitalize">
              {weather.weather[0].description}
            </span>
          </div>
        </div>
        <img src={iconUrl} alt={weather.weather[0].description} className="w-20 h-20" />
      </div>

      {/* Temperature Status */}
      <div
        className={`px-4 py-3 rounded-lg flex items-center justify-between ${getStatusColor(tempDiff)}`}
      >
        <div className="flex items-center">
          <span className="text-2xl mr-2">{getStatusIcon(tempDiff)}</span>
          <div>
            <div className="font-medium">Target: {targetTemperature}°C</div>
            <div className="text-sm">
              {Math.abs(tempDiff) <= 1
                ? 'Temperature is optimal'
                : `${Math.abs(tempDiff)}°C ${tempDiff > 0 ? 'above' : 'below'} target`}
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: '💧', label: 'Humidity', value: `${weather.main.humidity}%` },
          { icon: '🌡️', label: 'Pressure', value: `${weather.main.pressure} hPa` },
          { icon: '💨', label: 'Wind', value: `${weather.wind.speed} m/s` },
          { icon: '☁️', label: 'Clouds', value: `${weather.clouds.all}%` },
        ].map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-lg p-3 flex items-center">
            <span className="text-xl mr-3">{item.icon}</span>
            <div>
              <div className="text-sm font-medium text-gray-800">{item.value}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Day Info */}
      <div className="flex justify-between text-sm">
        <div className="flex items-center">
          <span className="text-yellow-500 mr-2">🌅</span>
          <div>
            <div className="font-medium">{sunrise}</div>
            <div className="text-gray-500 text-xs">Sunrise</div>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-orange-500 mr-2">🌇</span>
          <div>
            <div className="font-medium">{sunset}</div>
            <div className="text-gray-500 text-xs">Sunset</div>
          </div>
        </div>
      </div>

      {/* Weather Alerts */}
      {weather.rain && weather.rain['1h'] > 0 && (
        <div className="mt-4 px-4 py-3 bg-blue-50 rounded-lg flex items-center">
          <span className="text-xl mr-3">🌧️</span>
          <div className="text-blue-700 text-sm">
            <span className="font-medium">{weather.rain['1h']} mm</span> rainfall in the last hour
          </div>
        </div>
      )}
    </div>
  );
}
