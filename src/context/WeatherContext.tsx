import React, { createContext, useContext, useState, useCallback } from 'react';
import { Facility } from '../types/facilities';
import { fetchWeatherData } from '../services/weatherApi';

interface WeatherState {
  isLoading: boolean;
  error: string | null;
}

interface WeatherContextType extends WeatherState {
  updateFacilityWeather: (facility: Facility) => Promise<void>;
  updateAllFacilitiesWeather: (facilities: Facility[]) => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WeatherState>({
    isLoading: false,
    error: null,
  });

  const updateFacilityWeather = useCallback(async (facility: Facility) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      console.log('Updating weather for facility:', {
        facilityId: facility.id,
        location: facility.location,
      });

      const weatherData = await fetchWeatherData(
        facility.location.latitude,
        facility.location.longitude
      );

      facility.weather = weatherData;
      console.log('Updated facility weather:', {
        facilityId: facility.id,
        weather: weatherData,
      });

      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Error updating facility weather:', {
        facilityId: facility.id,
        error,
      });
      setState((prev) => ({
        ...prev,
        error: 'Failed to fetch weather data',
        isLoading: false,
      }));
    }
  }, []);

  const updateAllFacilitiesWeather = useCallback(async (facilities: Facility[]) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      console.log('Updating weather for all facilities:', {
        facilityCount: facilities.length,
        facilities: facilities.map((f) => ({ id: f.id, location: f.location })),
      });

      const weatherPromises = facilities.map((facility) =>
        fetchWeatherData(facility.location.latitude, facility.location.longitude)
      );

      const weatherResults = await Promise.all(weatherPromises);
      console.log('Received weather data for all facilities:', weatherResults);

      facilities.forEach((facility, index) => {
        facility.weather = weatherResults[index];
      });

      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error updating all facilities weather:', error);
      setState((prev) => ({
        ...prev,
        error: 'Failed to fetch weather data',
        isLoading: false,
      }));
    }
  }, []);

  const value = {
    ...state,
    updateFacilityWeather,
    updateAllFacilitiesWeather,
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
