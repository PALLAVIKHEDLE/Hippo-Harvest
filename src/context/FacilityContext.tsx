import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Facility } from '../types';
import * as api from '../services/facilityApi';

interface FacilityContextType {
  facilities: Facility[];
  loading: boolean;
  error: string | null;
  addFacility: (city: string, stateCode?: string) => Promise<void>;
  updateFacilityTemperature: (id: string, temperature: number) => Promise<void>;
  deleteFacility: (id: string) => Promise<void>;
}

const FacilityContext = createContext<FacilityContextType>({
  facilities: [],
  loading: false,
  error: null,
  addFacility: async () => {},
  updateFacilityTemperature: async () => {},
  deleteFacility: async () => {},
});

const DEFAULT_CITIES = [
  { name: 'San Francisco', state: 'CA' },
  { name: 'New York', state: 'NY' },
  { name: 'Chicago', state: 'IL' },
  { name: 'Seattle', state: 'WA' },
];

export function FacilityProvider({ children }: { children: React.ReactNode }) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

          // Add default cities
          const defaultFacilities = await Promise.all(
            DEFAULT_CITIES.map(async (city) => {
              try {
                return await api.addFacility(city.name, city.state);
              } catch (error) {
                console.error(`Failed to add ${city.name}:`, error);
                return null;
              }
            })
          );

          setFacilities(defaultFacilities.filter(Boolean));
        } else {
          setFacilities(existingFacilities);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load facilities');
        setFacilities([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    initializeFacilities();
  }, []); // Only run once on mount

  const addFacility = useCallback(async (city: string, stateCode?: string) => {
    try {
      setError(null);
      const newFacility = await api.addFacility(city, stateCode);
      if (newFacility) {
        setFacilities((prev) => [...prev, newFacility]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add facility');
      throw err;
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update temperature');
      throw err;
    }
  }, []);

  const deleteFacility = useCallback(async (id: string) => {
    try {
      setError(null);
      await api.deleteFacility(id);
      setFacilities((prev) => prev.filter((facility) => facility.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete facility');
      throw err;
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
