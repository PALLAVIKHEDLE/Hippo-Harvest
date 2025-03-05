import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Facility } from '../types';
import { GeocodingResponse } from '../types/weather';
import * as api from '../services/facilityApi';

interface CityInfo {
  name: string;
  state: string;
}

interface FacilityContextType {
  facilities: Facility[];
  loading: boolean;
  error: string | null;
  addFacility: (city: string, stateCode?: string) => Promise<void>;
  updateFacilityTemperature: (id: string, temperature: number) => Promise<void>;
  deleteFacility: (id: string) => Promise<void>;
  refreshWeatherData: () => Promise<void>;
}

const FacilityContext = createContext<FacilityContextType>({
  facilities: [],
  loading: false,
  error: null,
  addFacility: async () => {},
  updateFacilityTemperature: async () => {},
  deleteFacility: async () => {},
  refreshWeatherData: async () => {},
});

// Fetch popular US cities from an external API
async function fetchPopularCities(): Promise<CityInfo[]> {
  try {
    const response = await fetch(
      'https://api.openweathermap.org/geo/1.0/direct?q=San Francisco,CA,US&q=New York,NY,US&q=Chicago,IL,US&q=Seattle,WA,US&limit=4&appid=' +
        import.meta.env.VITE_OPENWEATHER_API_KEY
    );
    if (!response.ok) throw new Error('Failed to fetch cities');
    const cities: GeocodingResponse[] = await response.json();
    return cities.map((city) => ({
      name: city.name,
      state: city.state.split(' ').pop() || city.state,
    }));
  } catch (error: unknown) {
    console.error('Failed to fetch popular cities:', error);
    // Fallback to basic cities if API fails
    return [
      { name: 'San Francisco', state: 'CA' },
      { name: 'New York', state: 'NY' },
      { name: 'Chicago', state: 'IL' },
    ];
  }
}

export function FacilityProvider({ children }: { children: React.ReactNode }) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to refresh weather data for all facilities
  const refreshWeatherData = useCallback(async () => {
    try {
      const updatedFacilities = await api.getFacilities();
      setFacilities(updatedFacilities);
    } catch (error: unknown) {
      console.error('Failed to refresh weather data:', error);
    }
  }, []);

  // Load facilities from localStorage and initialize default cities if needed
  useEffect(() => {
    const initializeFacilities = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load existing facilities
        const existingFacilities = await api.getFacilities();

        // If no facilities exist, add default cities
        if (!existingFacilities.length) {
          // Clear any potential stale data
          api.clearFacilities();

          // Fetch popular cities from API
          const popularCities = await fetchPopularCities();

          // Add each city as a facility
          const defaultFacilities = await Promise.all(
            popularCities.map(async (city) => {
              try {
                return await api.addFacility(city.name, city.state);
              } catch (error: unknown) {
                console.error(`Failed to add ${city.name}:`, error);
                return null;
              }
            })
          );

          setFacilities(
            defaultFacilities.filter(
              (facility: Facility | null): facility is Facility => facility !== null
            )
          );
        } else {
          setFacilities(existingFacilities);
        }
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Failed to load facilities');
        setFacilities([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    initializeFacilities();
  }, []); // Only run once on mount

  // Periodically refresh weather data
  useEffect(() => {
    const intervalId = setInterval(refreshWeatherData, 5 * 60 * 1000); // Every 5 minutes
    return () => clearInterval(intervalId);
  }, [refreshWeatherData]);

  const addFacility = useCallback(async (city: string, stateCode?: string) => {
    try {
      setError(null);
      const newFacility = await api.addFacility(city, stateCode);
      if (newFacility) {
        setFacilities((prev) => [...prev, newFacility]);
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to add facility');
      throw error;
    }
  }, []);

  const updateFacilityTemperature = useCallback(async (id: string, temperature: number) => {
    try {
      setError(null);
      const updatedFacility = await api.updateFacilityTemperature(id, temperature);
      if (updatedFacility) {
        setFacilities((prev) =>
          prev.map((facility) => (facility.id === id ? updatedFacility : facility))
        );
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to update temperature');
      throw error;
    }
  }, []);

  const deleteFacility = useCallback(async (id: string) => {
    try {
      setError(null);
      await api.deleteFacility(id);
      setFacilities((prev) => prev.filter((facility) => facility.id !== id));
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to delete facility');
      throw error;
    }
  }, []);

  return (
    <FacilityContext.Provider
      value={{
        facilities,
        loading,
        error,
        addFacility,
        updateFacilityTemperature,
        deleteFacility,
        refreshWeatherData,
      }}
    >
      {children}
    </FacilityContext.Provider>
  );
}

export function useFacilities() {
  const context = useContext(FacilityContext);
  if (!context) {
    throw new Error('useFacilities must be used within a FacilityProvider');
  }
  return context;
}
