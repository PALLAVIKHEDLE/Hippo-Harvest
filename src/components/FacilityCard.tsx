import React from 'react';
import { Facility } from '../types';
import WeatherDisplay from './WeatherDisplay';
import TemperatureControl from './TemperatureControl';

interface Props {
  facility: Facility;
  onTemperatureChange: (facilityId: string, temperature: number) => void;
  onDelete: (facilityId: string) => void;
}

export default function FacilityCard({ facility, onTemperatureChange, onDelete }: Props) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${facility.name}?`)) {
      onDelete(facility.id);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      {/* Facility Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-white">
            <span className="text-lg mr-2">📍</span>
            <div>
              <h3 className="font-medium">{facility.name}</h3>
              <p className="text-xs text-blue-100">
                {facility.location.city}, {facility.location.country}
              </p>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="text-white opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Delete facility"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Weather Display */}
      <div className="p-3">
        <WeatherDisplay weather={facility.weather} targetTemperature={facility.targetTemperature} />
      </div>

      {/* Temperature Controls */}
      <div className="border-t border-gray-100">
        <div className="p-3">
          <TemperatureControl
            currentTemperature={facility.targetTemperature}
            onTemperatureChange={(temp) => onTemperatureChange(facility.id, temp)}
          />
        </div>
        <button
          onClick={() => {
            // Reset to weather-based temperature if available, otherwise use comfort temperature (22°C)
            const comfortTemp = 22; // Default comfort temperature in Celsius
            let localTemp;

            if (facility.weather?.main.temp) {
              // Weather API returns temperature in Celsius (units=metric)
              localTemp = Math.round(facility.weather.main.temp);
            } else {
              localTemp = comfortTemp;
            }

            onTemperatureChange(facility.id, localTemp);
          }}
          className="w-full p-2 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 transition-colors border-t border-gray-100 flex items-center justify-center"
          title={`Reset to local weather temperature (defaults to ${22}°C if weather data unavailable)`}
        >
          <span className="mr-2">🌡️</span>
          Reset to Local Weather
        </button>
      </div>
    </div>
  );
}
