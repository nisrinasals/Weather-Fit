export interface WeatherData {
  temperature: number;
  feels_like: number;
  humidity: number;
  rain_probability: number;
  description: string;
  location: string;
  wind_speed: number;
}

export interface OutfitCheck {
  id: string;
  outfit_description: string;
  weather_data: WeatherData | null;
  verdict: string | null;
  advice: string | null;
  created_at: string;
}

export interface StylistResponse {
  verdict: 'SAFE' | 'WARNING' | 'DISASTER';
  advice: string;
}
