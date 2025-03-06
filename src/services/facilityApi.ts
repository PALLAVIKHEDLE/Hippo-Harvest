import { Facility } from '../types';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const STORAGE_KEY = 'facilities';

// Function to load facilities from localStorage
export function loadFacilities(): Facility[] {
  const storedFacilities = localStorage.getItem(STORAGE_KEY);
  return storedFacilities ? JSON.parse(storedFacilities) : [];
}

// Function to save facilities to localStorage
function saveFacilities(facilities: Facility[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(facilities));
}

// Function to fetch weather data from OpenWeather API
async function fetchWeatherData(lat: number, lon: number) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

// Function to get coordinates from city name using OpenWeather Geocoding API
async function getCoordinates(city: string, stateCode?: string) {
  const query = stateCode ? `${city},${stateCode},US` : city;
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${OPENWEATHER_API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch coordinates');
  }

  const data = await response.json();
  if (!data.length) {
    throw new Error('City not found');
  }

  return data[0];
}

// Function to get all facilities with updated weather data
export async function getFacilities(): Promise<Facility[]> {
  try {
    const facilities = loadFacilities();
    if (!facilities.length) return [];

    const updatedFacilities = await Promise.all(
      facilities.map(async (facility) => {
        try {
          const weather = await fetchWeatherData(
            facility.location.latitude,
            facility.location.longitude
          );
          return { ...facility, weather };
        } catch (error) {
          console.error(`Failed to update weather for ${facility.location.city}:`, error);
          return facility;
        }
      })
    );

    return updatedFacilities.filter(Boolean);
  } catch (error) {
    console.error('Failed to get facilities:', error);
    return [];
  }
}

// Function to add a new facility
export async function addFacility(cityName: string, stateCode?: string): Promise<Facility> {
  // Get coordinates for the city
  const location = await getCoordinates(cityName, stateCode);

  // Fetch initial weather data
  const weather = await fetchWeatherData(location.lat, location.lon);

  // Create new facility
  const newFacility: Facility = {
    id: Date.now().toString(),
    name: `${location.name} Facility`,
    location: {
      city: location.name,
      state: location.state || stateCode || '',
      latitude: location.lat,
      longitude: location.lon,
    },
    weather,
    targetTemperature: 22, // Set a comfortable default temperature of 22°C (71.6°F)
  };

  // Add to localStorage
  const facilities = loadFacilities();

  // Check for duplicate city
  const isDuplicate = facilities.some(
    (f) =>
      f.location.city.toLowerCase() === newFacility.location.city.toLowerCase() &&
      f.location.state === newFacility.location.state
  );

  if (isDuplicate) {
    throw new Error('Facility already exists for this city');
  }

  facilities.push(newFacility);
  saveFacilities(facilities);

  return newFacility;
}

// Function to update facility temperature
export async function updateFacilityTemperature(
  facilityId: string,
  temperature: number
): Promise<Facility> {
  const facilities = loadFacilities();
  const facilityIndex = facilities.findIndex((f) => f.id === facilityId);

  if (facilityIndex === -1) {
    throw new Error('Facility not found');
  }

  // Update the target temperature
  facilities[facilityIndex] = {
    ...facilities[facilityIndex],
    targetTemperature: temperature,
  };

  // Save to localStorage
  saveFacilities(facilities);

  // Return updated facility with fresh weather data
  const updatedWeather = await fetchWeatherData(
    facilities[facilityIndex].location.latitude,
    facilities[facilityIndex].location.longitude
  );

  const updatedFacility = {
    ...facilities[facilityIndex],
    weather: updatedWeather,
  };

  return updatedFacility;
}

// Function to delete a facility
export async function deleteFacility(facilityId: string): Promise<void> {
  const facilities = loadFacilities();
  const updatedFacilities = facilities.filter((f) => f.id !== facilityId);
  saveFacilities(updatedFacilities);
}

// Clear all facilities
export function clearFacilities(): void {
  localStorage.removeItem(STORAGE_KEY);
}
