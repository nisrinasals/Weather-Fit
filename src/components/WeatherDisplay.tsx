import { CloudRain, Droplets, Thermometer, Wind } from 'lucide-react';
import type { WeatherData } from '../types';

interface WeatherDisplayProps {
  weather: WeatherData;
}

export function WeatherDisplay({ weather }: WeatherDisplayProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400">Current Weather</h3>
        <span className="text-xs text-gray-500">{weather.location}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-amber-400" />
          <div>
            <p className="text-lg font-bold text-white">{Math.round(weather.temperature)}°C</p>
            <p className="text-xs text-gray-500">Feels like {Math.round(weather.feels_like)}°C</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-lg font-bold text-white">{Math.round(weather.rain_probability)}%</p>
            <p className="text-xs text-gray-500">Rain chance</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-cyan-400" />
          <div>
            <p className="text-lg font-bold text-white">{weather.humidity}%</p>
            <p className="text-xs text-gray-500">Humidity</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-lg font-bold text-white">{Math.round(weather.wind_speed)} km/h</p>
            <p className="text-xs text-gray-500">Wind</p>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-300 capitalize">{weather.description}</p>
    </div>
  );
}
