import React, { useState, useEffect } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Clock, Disc, Wind, CloudRain, Zap, TrendingDown, AlertTriangle, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

const ExpandableFormula: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-1">
      <button
        onClick={() => setOpen(!open)}
        className="text-[10px] text-slate-500 hover:text-slate-400 flex items-center gap-1 transition-colors"
      >
        <span>How this is calculated</span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <div className="mt-1 p-2 rounded bg-storm-950 border border-storm-850 text-[10px] font-mono text-slate-500 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

export const CellInspectorPanel: React.FC<{ onOpenCapModal: () => void }> = ({ onOpenCapModal }) => {
  const {
    activeScenario, selectedCell, selectedSettlement,
    selectSettlementById, timelineMinutes,
  } = useWeather();

  const [secondsOffset, setSecondsOffset] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSecondsOffset(s => (s + 1) % 60), 1000);
    return () => clearInterval(timer);
  }, []);

  const cell = selectedCell || activeScenario.cells[0];
  if (!cell) {
    return (
      <div className="w-80 h-full bg-storm-950 border-l border-storm-800 p-4 font-mono text-xs text-slate-400">
        No active cells in current sector.
      </div>
    );
  }

  const primaryTarget = cell.etaTargets[0];
  const targetSettlement = selectedSettlement || activeScenario.settlements.find(s => s.id === primaryTarget?.settlementId);
  const baseMinutes = Math.max(0, (targetSettlement?.activeEtaMinutes || primaryTarget?.etaMinutes || 20) - timelineMinutes);
  const displaySec = baseMinutes > 0 ? (59 - secondsOffset).toString().padStart(2, '0') : '00';

  return (
    <aside className="w-80 h-full bg-storm-950/95 border-l border-storm-800 flex flex-col z-20 overflow-y-auto select-none backdrop-blur-md">

      {/* Cell header */}
      <div className="p-4 border-b border-storm-800">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>{cell.code}</span>
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            cell.severity === 'RED' ? 'bg-rose-950 border-rose-700 text-rose-300' : 'bg-amber-950 border-amber-700 text-amber-300'
          }`}>{cell.severity}</span>
        </div>
        <h2 className="font-display text-sm font-semibold text-slate-100">{cell.name}</h2>
        <div className="mt-1 flex items-center space-x-3 font-mono text-[11px] text-slate-400">
          <span>{cell.dbzMax} dBZ</span>
          <span>{cell.speedKmh} km/h {cell.directionLabel}</span>
        </div>
      </div>

      {/* Countdown */}
      <div className="p-4 bg-storm-900/60 border-b border-storm-800">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Impact countdown</span>
          </span>
          <span className="text-sky-400">{targetSettlement?.name.split(' ').slice(0, 2).join(' ')}</span>
        </div>
        <div className="font-mono text-3xl font-bold text-amber-300 tracking-wider my-1">
          {baseMinutes > 0 ? `${baseMinutes}m ${displaySec}s` : 'Reached'}
        </div>
        <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-storm-800">
          <span>{targetSettlement?.name}</span>
          <span>{primaryTarget?.distanceKm || 12} km</span>
        </div>
      </div>

      {/* CI telemetry */}
      <div className="p-4 border-b border-storm-800">
        <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400 mb-2">
          <TrendingDown className="w-3.5 h-3.5 text-sky-400" />
          <span>Initiation indicators</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="p-2 rounded bg-storm-900/80 border border-storm-800">
            <span className="text-slate-500 block text-[10px]">Cloud-top cooling</span>
            <strong className="text-rose-400">{cell.ciCoolingRateK15m} K / 15m</strong>
          </div>
          <div className="p-2 rounded bg-storm-900/80 border border-storm-800">
            <span className="text-slate-500 block text-[10px]">Brightness temp</span>
            <strong className="text-sky-300">{cell.cloudTopTempK} K</strong>
          </div>
          <div className="p-2 rounded bg-storm-900/80 border border-storm-800">
            <span className="text-slate-500 block text-[10px]">Echo top</span>
            <strong className="text-slate-200">{cell.echoTopKm} km</strong>
          </div>
          <div className="p-2 rounded bg-storm-900/80 border border-storm-800">
            <span className="text-slate-500 block text-[10px]">VIL</span>
            <strong className="text-emerald-400">{cell.vilKgM2} kg/m2</strong>
          </div>
        </div>
      </div>

      {/* Hazards - clean gauges, formulas behind drawers */}
      <div className="p-4 border-b border-storm-800 space-y-3">
        <div className="text-xs font-mono text-slate-400">Hazard assessment</div>

        {/* Hail */}
        <div className="p-2.5 rounded bg-storm-900/80 border border-storm-800">
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-slate-300 flex items-center space-x-1.5">
              <Disc className="w-3.5 h-3.5 text-cyan-400" /><span>Hail</span>
            </span>
            <span className="text-cyan-400 font-bold">{cell.meshMm} mm</span>
          </div>
          <div className="w-full bg-storm-950 h-1.5 rounded overflow-hidden">
            <div className="bg-cyan-400 h-full" style={{ width: `${Math.min(100, (cell.meshMm / 50) * 100)}%` }} />
          </div>
          <ExpandableFormula>
            MESH = 2.54 x (SHI)^0.5 where SHI is the Severe Hail Index from radar reflectivity profile above 0C isotherm. VIL = 3.44e-6 x integral of Z^(4/7) dh.
          </ExpandableFormula>
        </div>

        {/* Downburst */}
        <div className="p-2.5 rounded bg-storm-900/80 border border-storm-800">
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-slate-300 flex items-center space-x-1.5">
              <Wind className="w-3.5 h-3.5 text-amber-400" /><span>Downburst</span>
            </span>
            <span className="text-amber-400 font-bold">{cell.gustSpeedKmh} km/h</span>
          </div>
          <div className="w-full bg-storm-950 h-1.5 rounded overflow-hidden">
            <div className="bg-amber-400 h-full" style={{ width: `${Math.min(100, (cell.gustSpeedKmh / 120) * 100)}%` }} />
          </div>
          <div className="mt-1 text-[10px] font-mono text-slate-500">{cell.downburstProbPercent}% probability</div>
          <ExpandableFormula>
            Detected via radial velocity divergence at cloud base combined with sudden VIL core collapse (negative dVIL/dt) and dry sub-cloud air entrainment.
          </ExpandableFormula>
        </div>

        {/* Rain rate */}
        <div className="p-2.5 rounded bg-storm-900/80 border border-storm-800">
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-slate-300 flex items-center space-x-1.5">
              <CloudRain className="w-3.5 h-3.5 text-rose-400" /><span>Rain rate</span>
            </span>
            <span className="text-rose-400 font-bold">{cell.rainRateMmHr} mm/h</span>
          </div>
          <div className="w-full bg-storm-950 h-1.5 rounded overflow-hidden">
            <div className="bg-rose-500 h-full" style={{ width: `${Math.min(100, (cell.rainRateMmHr / 140) * 100)}%` }} />
          </div>
          <div className="mt-1 text-[10px] font-mono text-slate-500">
            {cell.rainRateMmHr >= 100 ? 'Exceeds IMD cloudburst threshold' : 'Below cloudburst threshold'}
          </div>
          <ExpandableFormula>
            Rain rate derived from radar reflectivity via the convective Z-R relationship (Z = 200 R^1.6). IMD defines cloudburst as sustained rate above 100 mm/hr over a small area.
          </ExpandableFormula>
        </div>

        {/* Lightning */}
        <div className="p-2.5 rounded bg-storm-900/80 border border-storm-800">
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-slate-300 flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-400" /><span>Lightning</span>
            </span>
            <span className="text-indigo-300 font-bold">{cell.lightningStrikesPerMin} / min</span>
          </div>
          <div className="w-full bg-storm-950 h-1.5 rounded overflow-hidden">
            <div className="bg-indigo-400 h-full" style={{ width: `${Math.min(100, (cell.lightningStrikesPerMin / 70) * 100)}%` }} />
          </div>
          <ExpandableFormula>
            Flash density = total strikes / (area x time). A lightning jump is defined as dF/dt exceeding 2 standard deviations above the running mean, signalling intensification.
          </ExpandableFormula>
        </div>
      </div>

      {/* Settlement ETA queue */}
      <div className="p-4 border-b border-storm-800 flex-1">
        <div className="text-xs font-mono text-slate-400 mb-2">Downstream settlements</div>
        <div className="space-y-1.5">
          {cell.etaTargets.map((target) => {
            const remaining = Math.max(0, target.etaMinutes - timelineMinutes);
            const isTargetSelected = targetSettlement?.id === target.settlementId;
            return (
              <div
                key={target.settlementId}
                onClick={() => selectSettlementById(target.settlementId)}
                className={`p-2 rounded border cursor-pointer font-mono text-xs flex items-center justify-between transition-colors ${
                  isTargetSelected
                    ? 'bg-sky-950/60 border-sky-700 text-sky-200'
                    : 'bg-storm-900/50 border-storm-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{target.settlementName}</span>
                </div>
                <span className={`font-bold ${remaining <= 15 ? 'text-rose-400' : 'text-amber-300'}`}>{remaining}m</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dispatch CTA */}
      <div className="p-4 bg-storm-950 border-t border-storm-800">
        <button
          onClick={onOpenCapModal}
          className="w-full py-2.5 px-4 rounded bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-semibold transition-all flex items-center justify-center space-x-2"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Broadcast alert</span>
        </button>
      </div>
    </aside>
  );
};
