export interface Weather {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number; // UTC timestamp in seconds
    sunset: number; // UTC timestamp in seconds
  };
  timezone: number; // Shift in seconds from UTC
  id: number;
  name: string;
  cod: number;
}

export interface GeocodingResponse {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

// Example response from OpenWeather API:
/*
{
  "coord": {"lon": -122.4194,"lat": 37.7749},
  "weather": [{"id": 800,"main": "Clear","description": "clear sky","icon": "01d"}],
  "base": "stations",
  "main": {
    "temp": 15.23,
    "feels_like": 14.81,
    "temp_min": 12.78,
    "temp_max": 17.22,
    "pressure": 1016,
    "humidity": 77
  },
  "visibility": 10000,
  "wind": {"speed": 4.12,"deg": 270,"gust": 8.23},
  "clouds": {"all": 0},
  "dt": 1646521468,
  "sys": {
    "type": 2,
    "id": 2017352,
    "country": "US",
    "sunrise": 1646579892,
    "sunset": 1646621001
  },
  "timezone": -28800,  // PST offset (-8 hours in seconds)
  "id": 5391959,
  "name": "San Francisco",
  "cod": 200
}
*/
