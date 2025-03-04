import { CurrentWeather } from './weather';

export interface Location {
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface Facility {
  id: string;
  name: string;
  location: Location;
  targetTemperature: number;
  weather: CurrentWeather | null;
}

export interface FacilityUpdateRequest {
  facilityId: string;
  temperature: number;
}
