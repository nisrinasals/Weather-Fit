import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationInputProps {
  onLocationSet: (lat: number, lon: number, name: string) => void;
  currentLocation: string | null;
}

export function LocationInput({ onLocationSet, currentLocation }: LocationInputProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = () => {
    setIsLocating(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const city = data.address?.city || data.address?.town || data.address?.village || 'Unknown';
          onLocationSet(latitude, longitude, city);
        } catch {
          onLocationSet(latitude, longitude, 'Your Location');
        }
        setIsLocating(false);
      },
      (err) => {
        setError(err.message || 'Unable to get location');
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        <button
          onClick={handleGetLocation}
          disabled={isLocating}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 text-sm transition-colors disabled:opacity-50"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
          {currentLocation ? 'Update Location' : 'Set Location'}
        </button>
        {currentLocation && (
          <span className="text-sm text-gray-400">
            <MapPin className="w-3 h-3 inline mr-1" />
            {currentLocation}
          </span>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
