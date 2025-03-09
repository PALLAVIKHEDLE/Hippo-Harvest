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
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-primary-100">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg mr-2">📍</span>
            <div>
              <h3 className="font-medium text-black">{facility.name}</h3>
              <p className="text-sm text-gray-600">
                {facility.location.city}, {facility.location.state}
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

      <div className="p-3">
        <WeatherDisplay weather={facility.weather} targetTemperature={facility.targetTemperature} />
      </div>

      <div className="border-t border-gray-100">
        <div className="p-3">
          <TemperatureControl
            currentTemperature={facility.targetTemperature}
            onTemperatureChange={(temp) => onTemperatureChange(facility.id, temp)}
          />
        </div>
        <button
          onClick={() => {
            const comfortTemp = 22;
            const localTemp = facility.weather?.main.temp
              ? Math.round(facility.weather.main.temp)
              : comfortTemp;

            onTemperatureChange(facility.id, localTemp);
          }}
          className="w-full p-2 text-sm text-gray-800 hover:text-gray-900 bg-primary-50 hover:bg-primary-100 transition-colors border-t border-primary-100 flex items-center justify-center font-medium"
          title={`Reset to local weather temperature (defaults to ${22}°C if weather data unavailable)`}
        >
          <span className="mr-2">🌡️</span>
          Reset to Local Weather
        </button>
      </div>
    </div>
  );
}
