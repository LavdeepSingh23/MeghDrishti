import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Radio } from 'lucide-react';

export const LandingHeader: React.FC = () => {
  const { setView } = useWeather();

  return (
    <header className="relative z-20 w-full border-b border-storm-800/60 bg-storm-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Radio className="w-5 h-5 text-sky-400" />
          <span className="font-display text-sm font-semibold tracking-wide text-slate-100">
            MeghDrishti
          </span>
        </div>

        <nav className="hidden sm:flex items-center space-x-6 text-xs text-slate-400">
          <a href="#how-it-works" className="hover:text-slate-200 transition-colors">How it works</a>
          <a href="#technical" className="hover:text-slate-200 transition-colors">Technical detail</a>
        </nav>

        <button
          onClick={() => setView('DASHBOARD')}
          className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-display font-medium text-xs tracking-wide transition-colors"
        >
          Open live console
        </button>
      </div>
    </header>
  );
};
