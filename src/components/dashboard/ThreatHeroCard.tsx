import React, { useState, useEffect } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Clock, ChevronUp, ChevronDown, SlidersHorizontal, ArrowUpRight, AlertTriangle } from 'lucide-react';

interface ThreatHeroCardProps {
  onOpenDrawer: () => void;
}

export const ThreatHeroCard: React.FC<ThreatHeroCardProps> = ({ onOpenDrawer }) => {
  const {
    activeScenario,
    selectedCell,
    selectedSettlement,
    timelineMinutes,
  } = useWeather();

  const [isMinimized, setIsMinimized] = useState(false);
  const [secondsOffset, setSecondsOffset] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsOffset((s) => (s + 1) % 60);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cell = selectedCell || activeScenario.cells[0];
  if (!cell) return null;

  const primaryTarget = cell.etaTargets[0];
  const targetSettlement = selectedSettlement || activeScenario.settlements.find(s => s.id === primaryTarget?.settlementId);

  const baseMinutes = Math.max(0, (targetSettlement?.activeEtaMinutes || primaryTarget?.etaMinutes || 20) - timelineMinutes);
  const displayMin = baseMinutes;
  const displaySec = baseMinutes > 0 ? (59 - secondsOffset).toString().padStart(2, '0') : '00';

  const isSevere = cell.severity === 'RED' || baseMinutes <= 15;
  const ciAlert = activeScenario.ciAlerts[0];

  return (
    <div className="absolute top-20 left-4 z-20 max-w-xs sm:max-w-sm w-full select-none transition-all duration-300 pointer-events-auto">
      <div className="rounded-xl border border-neutral-800 bg-black/90 backdrop-blur-xl shadow-2xl p-4 text-neutral-100 ring-1 ring-white/5">
        
        {/* Header Strip */}
        <div className="flex items-center justify-between pb-2.5 border-b border-neutral-850">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isSevere ? 'bg-rose-500 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
            <span className="font-semibold text-xs text-white">
              {cell.code} &bull; {cell.name.split(' ')[0]}
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium border ${
              cell.severity === 'RED'
                ? 'bg-rose-950/80 border-rose-700 text-rose-300'
                : 'bg-amber-950/80 border-amber-700 text-amber-300'
            }`}>
              {cell.severity}
            </span>
          </div>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded-md hover:bg-neutral-850 text-neutral-400 hover:text-white transition-colors"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Main Countdown Display */}
        {!isMinimized && (
          <>
            <div className="pt-3 pb-2">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                <span className="flex items-center space-x-1.5">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Impact Countdown</span>
                </span>
                <span className="text-white font-medium truncate max-w-[120px]">
                  {targetSettlement?.name.split(' ')[0]}
                </span>
              </div>

              <div className="flex items-baseline justify-between mt-0.5">
                <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  {displayMin > 0 ? `${displayMin}m ${displaySec}s` : 'REACHED'}
                </div>
                <div className="text-right text-[11px] font-mono text-neutral-400">
                  <div>{primaryTarget?.distanceKm || 14} km</div>
                  <div>{cell.speedKmh} km/h</div>
                </div>
              </div>

              <div className="mt-1.5 text-xs text-neutral-300 truncate">
                Target: <strong className="text-white">{targetSettlement?.name}</strong>
              </div>
            </div>

            {/* Quick 4-Hazard Summary */}
            <div className="grid grid-cols-4 gap-1.5 pt-2.5 pb-2.5 border-t border-neutral-850 font-mono text-[10px]">
              <div className="p-1.5 rounded bg-neutral-900/80 border border-neutral-800 text-center">
                <span className="text-neutral-500 block text-[9px]">HAIL</span>
                <strong className="text-cyan-300">{cell.meshMm}mm</strong>
              </div>
              <div className="p-1.5 rounded bg-neutral-900/80 border border-neutral-800 text-center">
                <span className="text-neutral-500 block text-[9px]">WIND</span>
                <strong className="text-amber-300">{cell.gustSpeedKmh}km</strong>
              </div>
              <div className="p-1.5 rounded bg-neutral-900/80 border border-neutral-800 text-center">
                <span className="text-neutral-500 block text-[9px]">RAIN</span>
                <strong className="text-rose-300">{cell.rainRateMmHr}mm</strong>
              </div>
              <div className="p-1.5 rounded bg-neutral-900/80 border border-neutral-800 text-center">
                <span className="text-neutral-500 block text-[9px]">STRIKES</span>
                <strong className="text-purple-300">{cell.lightningStrikesPerMin}/m</strong>
              </div>
            </div>

            {/* Integrated CI Precursor Alert (if detected) */}
            {ciAlert && (
              <div className="py-2 px-2.5 mb-2.5 rounded bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-200/90 leading-tight">
                <span className="font-semibold text-amber-300 block mb-0.5">⚡ Convective Initiation Detected</span>
                Rapid cooling at {ciAlert.region} &bull; Window: {ciAlert.predictedImpactWindowMin}
              </div>
            )}

            {/* Action to open full interactive drawer */}
            <button
              onClick={onOpenDrawer}
              className="w-full py-2 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white text-xs font-medium transition-all flex items-center justify-center space-x-1.5 active:scale-98"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
              <span>Inspect Cell & Physics Telemetry</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 text-neutral-400" />
            </button>
          </>
        )}

        {/* Minimized View */}
        {isMinimized && (
          <div className="pt-2 flex items-center justify-between cursor-pointer" onClick={() => setIsMinimized(false)}>
            <div className="flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-base font-bold text-white">
                {displayMin > 0 ? `${displayMin}m ${displaySec}s` : 'REACHED'}
              </span>
              <span className="text-xs text-neutral-400 truncate max-w-[120px]">
                {targetSettlement?.name.split(' ')[0]}
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 hover:text-white underline">Expand</span>
          </div>
        )}

      </div>
    </div>
  );
};
