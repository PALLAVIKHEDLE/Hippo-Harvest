import React, { useState, useEffect } from 'react';
import { GlobalSettingsContext } from '../context/GlobalSettingsContext';

interface Props {
  currentTemperature: number;
  onTemperatureChange: (temp: number) => void;
}

export default function TemperatureControl({ currentTemperature, onTemperatureChange }: Props) {
  const [alert, setAlert] = useState<{ message: string; type: 'warning' | 'error' } | null>(null);
  const { temperatureThresholds } = React.useContext(GlobalSettingsContext) ?? {
    temperatureThresholds: { min: 16, max: 28, alertEnabled: true },
  };
  const MIN_TEMP = temperatureThresholds.min;
  const MAX_TEMP = temperatureThresholds.max;
  const STEP = 0.5;

  const presets = [
    { temp: 18, label: 'Cool', icon: '❄️' },
    { temp: 22, label: 'Comfort', icon: '😊' },
    { temp: 24, label: 'Warm', icon: '☀️' },
  ];

  const handleIncrement = () => {
    const newTemp = currentTemperature + STEP;
    onTemperatureChange(newTemp);

    if (newTemp > MAX_TEMP) {
      setAlert({
        message: `Temperature ${newTemp.toFixed(1)}°C exceeds maximum threshold of ${MAX_TEMP}°C`,
        type: 'error',
      });
    } else {
      setAlert(null);
    }
  };

  const handleDecrement = () => {
    const newTemp = currentTemperature - STEP;
    onTemperatureChange(newTemp);

    if (newTemp < MIN_TEMP) {
      setAlert({
        message: `Temperature ${newTemp.toFixed(1)}°C is below minimum threshold of ${MIN_TEMP}°C`,
        type: 'error',
      });
    } else {
      setAlert(null);
    }
  };

  useEffect(() => {
    // Check temperature bounds on component mount and temperature changes
    if (currentTemperature > MAX_TEMP) {
      setAlert({
        message: `Temperature ${currentTemperature.toFixed(1)}°C exceeds maximum threshold of ${MAX_TEMP}°C`,
        type: 'error',
      });
    } else if (currentTemperature < MIN_TEMP) {
      setAlert({
        message: `Temperature ${currentTemperature.toFixed(1)}°C is below minimum threshold of ${MIN_TEMP}°C`,
        type: 'error',
      });
    } else {
      setAlert(null);
    }
  }, [currentTemperature, MAX_TEMP, MIN_TEMP]);

  return (
    <div className="space-y-3">
      {alert && (
        <div
          className={`p-2 rounded-lg text-sm ${alert.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}
        >
          {alert.message}
        </div>
      )}
      {/* Temperature Control Header */}
      <div className="flex items-center justify-between text-sm">
        <div className="font-medium text-gray-800">Temperature Control</div>
        <div className="text-gray-500">
          {MIN_TEMP}°C - {MAX_TEMP}°C
        </div>
      </div>

      {/* Main Temperature Control */}
      <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        <button
          onClick={handleDecrement}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Decrease temperature"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
          </svg>
        </button>

        <div className="text-center px-3">
          <div className="text-2xl font-bold text-gray-800 tracking-tight">
            {currentTemperature.toFixed(1)}°C
          </div>
          <div className="text-xs text-gray-500">Target Temperature</div>
        </div>

        <button
          onClick={handleIncrement}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Increase temperature"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Preset Temperatures */}
      <div className="grid grid-cols-3 gap-2">
        {presets.map(({ temp, label, icon }) => (
          <button
            key={temp}
            onClick={() => onTemperatureChange(temp)}
            className={`
              p-2 rounded-xl text-center transition-all duration-200
              ${
                currentTemperature === temp
                  ? 'bg-blue-100 text-blue-700 shadow-inner'
                  : 'bg-white text-gray-600 hover:bg-blue-50 shadow-sm border border-gray-100'
              }
            `}
          >
            <div className="text-lg">{icon}</div>
            <div className="text-xs font-medium mt-0.5">{label}</div>
            <div className="text-xs text-gray-500">{temp}°C</div>
          </button>
        ))}
      </div>
    </div>
  );
}
