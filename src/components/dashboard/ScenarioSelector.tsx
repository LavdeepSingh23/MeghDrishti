import React, { useState, useRef, useEffect } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { SCENARIOS } from '../../data/scenarios';
import { ChevronDown, Check } from 'lucide-react';

export const ScenarioSelector: React.FC = () => {
  const { activeScenario, setScenarioId, dashboardTheme } = useWeather();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isLight = dashboardTheme === 'light';

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-colors text-xs ${
          isLight
            ? 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-900'
            : 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-100'
        }`}
        title="Change Weather Scenario"
      >
        <div className="truncate mr-2">
          <span className="text-[10px] font-mono text-zinc-400 block">{activeScenario.code}</span>
          <span className="font-bold truncate block">{activeScenario.title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border shadow-2xl p-1.5 space-y-1 animate-in fade-in ${
          isLight
            ? 'bg-white border-slate-300 text-slate-800'
            : 'bg-zinc-950 border-zinc-800 text-zinc-200'
        }`}>
          <div className="px-2 py-1 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            Verified Indian Storm Datasets
          </div>
          {SCENARIOS.map((s) => {
            const isSelected = s.id === activeScenario.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setScenarioId(s.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  isSelected
                    ? (isLight ? 'bg-slate-200 text-slate-900 font-bold' : 'bg-zinc-800 text-white font-bold')
                    : (isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-zinc-900 text-zinc-300')
                }`}
              >
                <div>
                  <div className="font-mono text-[10px] text-zinc-400">{s.code} &bull; {s.region}</div>
                  <div className="font-bold">{s.title}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-rose-500 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
