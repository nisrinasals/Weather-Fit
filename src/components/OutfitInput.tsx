import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface OutfitInputProps {
  onSubmit: (outfit: string) => void;
  isLoading: boolean;
}

export function OutfitInput({ onSubmit, isLoading }: OutfitInputProps) {
  const [outfit, setOutfit] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (outfit.trim() && !isLoading) {
      onSubmit(outfit.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-3">
        <label htmlFor="outfit" className="block text-sm font-medium text-gray-300">
          What are you planning to wear today?
        </label>
        <div className="relative">
          <textarea
            id="outfit"
            value={outfit}
            onChange={(e) => setOutfit(e.target.value)}
            placeholder="e.g., White linen pants, cream blouse, dewy cushion foundation, light pink lip tint..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none min-h-[100px]"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={!outfit.trim() || isLoading}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Check My Outfit
            </>
          )}
        </button>
      </div>
    </form>
  );
}
