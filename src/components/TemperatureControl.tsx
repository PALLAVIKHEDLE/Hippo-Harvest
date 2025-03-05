import React from 'react';

interface Props {
  currentTemperature: number;
  onTemperatureChange: (temp: number) => void;
}

export default function TemperatureControl({ currentTemperature, onTemperatureChange }: Props) {
  const MIN_TEMP = 16;
  const MAX_TEMP = 28;
  const STEP = 0.5;

  const presets = [
    { temp: 18, label: 'Cool', icon: '❄️' },
    { temp: 22, label: 'Comfort', icon: '😊' },
    { temp: 24, label: 'Warm', icon: '☀️' },
  ];

  const handleIncrement = () => {
    if (currentTemperature < MAX_TEMP) {
      onTemperatureChange(currentTemperature + STEP);
    }
  };

  const handleDecrement = () => {
    if (currentTemperature > MIN_TEMP) {
      onTemperatureChange(currentTemperature - STEP);
    }
  };

  return (
    <div className="space-y-3">
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
          disabled={currentTemperature <= MIN_TEMP}
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
          disabled={currentTemperature >= MAX_TEMP}
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
