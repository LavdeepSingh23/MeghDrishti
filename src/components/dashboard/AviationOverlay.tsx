import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Plane, AlertTriangle, X } from 'lucide-react';

export const AviationOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { activeScenario, selectedCell } = useWeather();
  const airport = activeScenario.settlements.find(s => s.type === 'AIRPORT') || activeScenario.settlements[0];
  const cell = selectedCell || activeScenario.cells[0];

  return (
    <div className="absolute inset-y-0 left-0 w-full sm:w-[480px] bg-storm-950/95 border-r border-storm-800 z-25 p-5 font-mono text-xs overflow-y-auto backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-storm-800">
        <div className="flex items-center space-x-2">
          <Plane className="w-4 h-4 text-sky-400" />
          <span className="font-display font-semibold text-slate-100 text-sm">Aviation weather briefing</span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-storm-900 text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 p-3.5 rounded bg-storm-900 border border-storm-750">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400">Target aerodrome:</span>
          <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-700 text-rose-300 font-bold">Microburst alert</span>
        </div>
        <div className="text-sm font-bold text-slate-100">{airport.name}</div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
          <div>ETA: <strong className="text-amber-400">{airport.activeEtaMinutes || 18} min</strong></div>
          <div>Est. gust: <strong className="text-rose-400">{cell?.gustSpeedKmh || 85} km/h</strong></div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[11px] text-slate-400 mb-1">Simulated SPECI bulletin (formatted to match ICAO conventions):</div>
        <div className="p-3 rounded bg-storm-900/90 border border-storm-800 text-[11px] text-emerald-400 leading-relaxed overflow-x-auto">
          SPECI VIDP 231215Z 28045G58KT 1200 +TSRA SQ BKN015CB OVC080 22/19 Q1004 WS ALL RWY TEMPO 0800 +TSGR FCST MESH 35MM=
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="text-[11px] text-slate-400 font-semibold">Operational recommendations:</div>
        <div className="p-2.5 rounded bg-storm-900/60 border border-storm-800 text-slate-300 flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div><strong className="text-white block">Approach suspension recommended</strong>Holding or diversion for inbound flights within 30 NM radius.</div>
        </div>
        <div className="p-2.5 rounded bg-storm-900/60 border border-storm-800 text-slate-300 flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div><strong className="text-white block">Ground ops cease</strong>Ramp, refueling, and baggage handling suspended due to lightning density.</div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-storm-800 text-[10px] text-slate-500">
        Bulletin format follows ICAO Annex 3 SPECI conventions. Not a certified operational product.
      </div>
    </div>
  );
};
