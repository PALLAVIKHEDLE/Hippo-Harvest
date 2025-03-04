import React from 'react';
import { Facility } from '../types/facilities';
import WeatherDisplay from './WeatherDisplay';
import TemperatureControl from './TemperatureControl';
import { useFacilities } from '../context/FacilityContext';

interface Props {
  facility: Facility;
}

export default function FacilityCard({ facility }: Props) {
  const { updateFacilityTemperature, deleteFacility } = useFacilities();

  const handleTemperatureChange = async (newTemp: number) => {
    try {
      await updateFacilityTemperature(facility.id, newTemp);
    } catch (error) {
      console.error('Failed to update temperature:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFacility(facility.id);
    } catch (error) {
      console.error('Failed to delete facility:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{facility.name}</h2>
            <p className="text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {`${facility.location.city}, ${facility.location.state}`}
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Delete facility"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Weather Display */}
      <div className="p-6 bg-white">
        <WeatherDisplay
          weather={facility.weather}
          targetTemperature={facility.targetTemperature}
          onTemperatureChange={handleTemperatureChange}
        />
      </div>

      {/* Temperature Control */}
      <div className="p-6 bg-gray-50">
        <TemperatureControl
          facilityId={facility.id}
          currentTemperature={facility.weather?.main.temp ?? 0}
          targetTemperature={facility.targetTemperature}
          onTemperatureChange={handleTemperatureChange}
        />
      </div>
    </div>
  );
}
