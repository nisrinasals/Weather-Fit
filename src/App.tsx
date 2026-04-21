import { useState } from 'react';
import { Header } from './components/Header';
import { OutfitInput } from './components/OutfitInput';
import { WeatherDisplay } from './components/WeatherDisplay';
import { VerdictDisplay } from './components/VerdictDisplay';
import { LocationInput } from './components/LocationInput';
import { useStylist } from './hooks/useStylist';
import { RefreshCw } from 'lucide-react';

function App() {
  const [location, setLocation] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const { checkOutfit, reset, isLoading, result } = useStylist();

  const handleLocationSet = (lat: number, lon: number, name: string) => {
    setLocation({ lat, lon, name });
  };

  const handleSubmit = async (outfit: string) => {
    if (!location) {
      alert('Please set your location first');
      return;
    }
    await checkOutfit(outfit, location.lat, location.lon);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Step 1: Set Your Location
            </h2>
            <LocationInput
              onLocationSet={handleLocationSet}
              currentLocation={location?.name || null}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Step 2: Describe Your Outfit
            </h2>
            <OutfitInput onSubmit={handleSubmit} isLoading={isLoading} />
          </section>

          {result && (
            <section className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                  Your Weather Report
                </h2>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Start Over
                </button>
              </div>

              <WeatherDisplay weather={result.weather} />

              <div>
                <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
                  Stylist Verdict
                </h2>
                <VerdictDisplay verdict={result.verdict} advice={result.advice} />
              </div>
            </section>
          )}

          {!result && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">
                Set your location and describe your outfit to get started
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-xs text-gray-600">
          Daily Stylist - Your weather-aware wardrobe assistant
        </div>
      </footer>
    </div>
  );
}

export default App;
