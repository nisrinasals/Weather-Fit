import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-amber-400" />
        <div>
          <h1 className="text-xl font-bold text-white">Daily Stylist</h1>
          <p className="text-xs text-gray-400">Your weather-aware wardrobe assistant</p>
        </div>
      </div>
    </header>
  );
}
