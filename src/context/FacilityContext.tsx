import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Facility } from '../types';
import { GeocodingResponse } from '../types/weather';
import * as api from '../services/facilityApi';
import { GlobalSettingsContext } from './GlobalSettingsContext';

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
  resetToLocal: (facilityId?: string) => Promise<void>;
}

const defaultContextValue: FacilityContextType = {
  facilities: [],
  loading: false,
  error: null,
  addFacility: async () => {
    throw new Error('FacilityContext not initialized');
  },
  updateFacilityTemperature: async () => {
    throw new Error('FacilityContext not initialized');
  },
  deleteFacility: async () => {
    throw new Error('FacilityContext not initialized');
  },
  refreshWeatherData: async () => {
    throw new Error('FacilityContext not initialized');
  },
  resetToLocal: async () => {
    throw new Error('FacilityContext not initialized');
  },
};

export const FacilityContext = createContext<FacilityContextType>(defaultContextValue);

FacilityContext.displayName = 'FacilityContext';

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

export const FacilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { temperaturePresets } = useContext(GlobalSettingsContext) ?? {
    temperaturePresets: { day: 22, night: 18, weekend: 20 },
  };

  // Function to refresh weather data for all facilities
  const refreshWeatherData = useCallback(async () => {
    try {
      const updatedFacilities = await api.getFacilities();
      setFacilities(updatedFacilities);
    } catch (error: unknown) {
      console.error('Failed to refresh weather data:', error);
    }
  }, []);

  // Apply global temperature preset to all facilities when it changes
  useEffect(() => {
    if (!temperaturePresets) return;

    const applyGlobalPreset = async () => {
      try {
        // Get current hour to determine if it's day/night/weekend
        const currentHour = new Date().getHours();
        const isWeekend = [0, 6].includes(new Date().getDay());

        // Determine which preset to use
        let targetTemp;
        if (isWeekend) {
          targetTemp = temperaturePresets.weekend;
        } else if (currentHour >= 8 && currentHour < 20) {
          // Day time: 8 AM to 8 PM
          targetTemp = temperaturePresets.day;
        } else {
          targetTemp = temperaturePresets.night;
        }

        // Update facilities in the API but don't trigger state updates
        await Promise.all(
          facilities.map(async (facility) => {
            try {
              await api.updateFacilityTemperature(facility.id, targetTemp);
            } catch (error) {
              console.error(`Failed to update temperature for facility ${facility.id}:`, error);
            }
          })
        );

        // Update state once after all updates are done
        const updatedFacilities = await api.getFacilities();
        setFacilities(updatedFacilities);
      } catch (error) {
        console.error('Failed to apply global temperature preset:', error);
      }
    };

    if (facilities.length > 0) {
      applyGlobalPreset();
    }
  }, [temperaturePresets]); // Only depend on temperaturePresets, not facilities

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
    // Initial refresh
    refreshWeatherData();

    // Set up interval for future refreshes
    const intervalId = setInterval(refreshWeatherData, 5 * 60 * 1000); // Every 5 minutes

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array since refreshWeatherData is stable

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

  // Function to reset temperature to local weather
  const resetToLocal = useCallback(
    async (facilityId?: string) => {
      try {
        setError(null);
        const targetFacilities = facilityId
          ? facilities.filter((f) => f.id === facilityId)
          : facilities;

        await Promise.all(
          targetFacilities.map(async (facility) => {
            const comfortTemp = 22; // Default comfort temperature in Celsius
            let localTemp;

            if (facility.weather?.main.temp) {
              // Weather API returns temperature in Celsius (units=metric)
              localTemp = Math.round(facility.weather.main.temp);
            } else {
              localTemp = comfortTemp;
            }

            await api.updateFacilityTemperature(facility.id, localTemp);
          })
        );

        // Refresh all facilities after updates
        const updatedFacilities = await api.getFacilities();
        setFacilities(updatedFacilities);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Failed to reset temperature');
        throw error;
      }
    },
    [facilities]
  );

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
        resetToLocal,
      }}
    >
      {children}
    </FacilityContext.Provider>
  );
};

export const useFacilities = () => {
  const context = useContext(FacilityContext);
  if (!context) {
    throw new Error('useFacilities must be used within a FacilityProvider');
  }
  return context;
};
