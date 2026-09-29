import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { X, Disc, Wind, CloudRain, Zap, TrendingDown, AlertTriangle, MapPin, ChevronDown, ChevronUp, Radio } from 'lucide-react';

interface CellDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCapModal: () => void;
}

const FormulaDrawer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-1.5">
      <button
        onClick={() => setOpen(!open)}
        className="text-[10px] text-neutral-500 hover:text-neutral-300 flex items-center gap-1 transition-colors"
      >
        <span>Formula & Physics Details</span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <div className="mt-1.5 p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[10px] font-mono text-neutral-400 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

export const CellDrawer: React.FC<CellDrawerProps> = ({ isOpen, onClose, onOpenCapModal }) => {
  const {
    activeScenario,
    selectedCell,
    selectSettlementById,
    timelineMinutes,
  } = useWeather();

  const [activeTab, setActiveTab] = useState<'HAZARDS' | 'VERTICAL_3D' | 'INITIATION' | 'TRAJECTORY'>('HAZARDS');

  if (!isOpen) return null;

  const cell = selectedCell || activeScenario.cells[0];
  if (!cell) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[440px] p-3 sm:p-4 flex flex-col pointer-events-auto">
      <div className="w-full h-full rounded-2xl border border-neutral-800 bg-black/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-750 flex items-center justify-center text-white">
              <Radio className="w-4 h-4 animate-pulse text-rose-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">{cell.code}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  cell.severity === 'RED'
                    ? 'bg-rose-950/80 border-rose-600 text-rose-300'
                    : 'bg-amber-950/80 border-amber-600 text-amber-300'
                }`}>
                  {cell.severity} ALERT
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-sans mt-0.5 truncate max-w-[240px]">
                {cell.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors border border-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls (Segmented Control) */}
        <div className="px-4 pt-3 pb-2 border-b border-neutral-850 bg-black">
          <div className="flex p-1 rounded-xl bg-neutral-950 border border-neutral-850 text-xs">
            {(['HAZARDS', 'VERTICAL_3D', 'INITIATION', 'TRAJECTORY'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-neutral-100 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab === 'HAZARDS' ? 'Hazards' : tab === 'VERTICAL_3D' ? '3D Profile' : tab === 'INITIATION' ? 'Precursors' : 'ETAs'}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 font-sans text-xs">
          
          {/* TAB 1: HAZARD ASSESSMENT */}
          {activeTab === 'HAZARDS' && (
            <div className="space-y-3 font-mono">
              {/* Hail */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-850">
                <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
                  <span className="text-neutral-200 flex items-center space-x-1.5">
                    <Disc className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-semibold text-xs text-neutral-200">Hail Severity (MESH)</span>
                  </span>
                  <span className="text-cyan-300 font-mono font-bold">{cell.meshMm} mm</span>
                </div>
                <div className="w-full bg-black h-2 rounded-full overflow-hidden p-0.5 border border-neutral-800">
                  <div className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full rounded-full" style={{ width: `${Math.min(100, (cell.meshMm / 50) * 100)}%` }} />
                </div>
                <div className="mt-1.5 text-[11px] text-neutral-400 flex justify-between font-mono">
                  <span>Freezing level: {cell.freezingLevelM}m</span>
                  <span className="text-cyan-300 font-medium">{cell.meshMm >= 30 ? 'LARGE HAIL RISK' : 'MODERATE'}</span>
                </div>
                <FormulaDrawer>
                  MESH (Maximum Estimated Size of Hail) derived from reflectivity core height above 0°C isotherm. VIL = 3.44×10⁻⁶ × ∫ Z^(4/7) dh.
                </FormulaDrawer>
              </div>

              {/* Downburst */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-850">
                <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
                  <span className="text-neutral-200 flex items-center space-x-1.5">
                    <Wind className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold text-xs text-neutral-200">Downburst Gust Front</span>
                  </span>
                  <span className="text-amber-300 font-mono font-bold">{cell.gustSpeedKmh} km/h</span>
                </div>
                <div className="w-full bg-black h-2 rounded-full overflow-hidden p-0.5 border border-neutral-800">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full" style={{ width: `${Math.min(100, (cell.gustSpeedKmh / 120) * 100)}%` }} />
                </div>
                <div className="mt-1.5 text-[11px] text-neutral-400 flex justify-between font-mono">
                  <span>Downburst Probability</span>
                  <span className="text-amber-300 font-bold">{cell.downburstProbPercent}%</span>
                </div>
                <FormulaDrawer>
                  Identified via radar radial velocity divergence (∇ • Vr) at cloud base combined with negative d(VIL)/dt core collapse and dry air entrainment.
                </FormulaDrawer>
              </div>

              {/* Cloudburst */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-850">
                <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
                  <span className="text-neutral-200 flex items-center space-x-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-rose-400" />
                    <span className="font-semibold text-xs text-neutral-200">Instantaneous Rain Rate</span>
                  </span>
                  <span className="text-rose-400 font-mono font-bold">{cell.rainRateMmHr} mm/h</span>
                </div>
                <div className="w-full bg-black h-2 rounded-full overflow-hidden p-0.5 border border-neutral-800">
                  <div className="bg-gradient-to-r from-rose-500 to-red-400 h-full rounded-full" style={{ width: `${Math.min(100, (cell.rainRateMmHr / 140) * 100)}%` }} />
                </div>
                <div className="mt-1.5 text-[11px] text-neutral-400 flex justify-between font-mono">
                  <span>IMD Threshold: ≥ 100 mm/h</span>
                  <span className="text-rose-300 font-medium">{cell.rainRateMmHr >= 100 ? 'CLOUDBURST' : 'TORRENTIAL'}</span>
                </div>
                <FormulaDrawer>
                  Rain rate calculated from Marshall-Palmer relation Z = 200 R^1.6. Checked against statutory 100 mm/hr flash flood criteria.
                </FormulaDrawer>
              </div>

              {/* Lightning */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-850">
                <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
                  <span className="text-neutral-200 flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                    <span className="font-semibold text-xs text-neutral-200">Lightning Flash Rate</span>
                  </span>
                  <span className="text-purple-300 font-mono font-bold">{cell.lightningStrikesPerMin} / min</span>
                </div>
                <div className="w-full bg-black h-2 rounded-full overflow-hidden p-0.5 border border-neutral-800">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full rounded-full" style={{ width: `${Math.min(100, (cell.lightningStrikesPerMin / 70) * 100)}%` }} />
                </div>
                <div className="mt-1.5 text-[11px] text-neutral-400 flex justify-between font-mono">
                  <span>Ground Sensor Triangulation</span>
                  <span className="text-purple-300 font-medium">SEVERE JUMP</span>
                </div>
                <FormulaDrawer>
                  Triangulated by ground sensors. Flash jump rate dF/dt &gt; 2σ signals explosive graupel collision aloft.
                </FormulaDrawer>
              </div>
            </div>
          )}

          {/* TAB 2: 3D VERTICAL ALTITUDE PROFILE (RHI SCAN) */}
          {activeTab === 'VERTICAL_3D' && (
            <div className="space-y-3 font-mono">
              <div className="text-neutral-400 text-xs mb-1 flex items-center justify-between font-sans">
                <span className="font-semibold text-white">RHI Vertical Atmospheric Profile</span>
                <span className="text-[10px] text-cyan-400 font-mono">0 - 18 km Altitude</span>
              </div>

              {/* Interactive Atmospheric Column Visualization */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 relative overflow-hidden">
                <div className="text-[10px] text-neutral-400 mb-2 font-mono">
                  Overshooting Cloud Top: <strong className="text-white">{cell.echoTopKm} km</strong>
                </div>

                {/* Layer 16km+ */}
                <div className="p-2 rounded bg-purple-950/40 border border-purple-800/40 flex items-center justify-between text-[11px]">
                  <span className="text-purple-300 font-medium">16.0 - 18.0 km // Tropopause Anvil</span>
                  <span className="text-neutral-400">{cell.cloudTopTempK} K (-54°C)</span>
                </div>

                {/* Layer 12-16km */}
                <div className="p-2.5 rounded bg-rose-950/60 border border-rose-700/60 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-rose-300 font-medium block">10.0 - 15.0 km // Convective Core</span>
                    <span className="text-[9px] text-neutral-400">Peak Echo: {cell.dbzMax} dBZ</span>
                  </div>
                  <span className="text-rose-400 font-bold">{cell.vilKgM2} kg/m²</span>
                </div>

                {/* Layer 5-10km */}
                <div className="p-2 rounded bg-amber-950/40 border border-amber-700/40 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-amber-300 font-medium block">5.0 - 8.0 km // Hail Genesis Aloft</span>
                    <span className="text-[9px] text-neutral-400">MESH: {cell.meshMm} mm</span>
                  </div>
                  <span className="text-amber-400 font-medium">Supercooled Liquid</span>
                </div>

                {/* Freezing Level Isotherm */}
                <div className="py-1 px-2 border-y border-dashed border-cyan-400/60 text-cyan-300 flex items-center justify-between text-[10px] bg-cyan-950/20">
                  <span>0°C Freezing Level Isotherm</span>
                  <span className="font-bold">{cell.freezingLevelM} meters ASL</span>
                </div>

                {/* Surface */}
                <div className="p-2 rounded bg-neutral-900/80 border border-neutral-750 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-white font-medium block">0 - 2.0 km // Surface Outflow Boundary</span>
                    <span className="text-[9px] text-neutral-400">Divergence Gust Front</span>
                  </div>
                  <span className="text-amber-300 font-bold">{cell.gustSpeedKmh} km/h</span>
                </div>
              </div>

              <div className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                The 50 dBZ echo extends <strong className="text-white">{((cell.echoTopKm * 1000) - cell.freezingLevelM) / 1000} km</strong> above the freezing level, generating rapid graupel formation and microburst potential.
              </div>
            </div>
          )}

          {/* TAB 3: CONVECTIVE INITIATION */}
          {activeTab === 'INITIATION' && (
            <div className="space-y-3 font-mono">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs">
                Convective initiation detected <strong className="text-white">35 minutes before</strong> surface radar echo exceeded 35 dBZ.
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                  <span className="text-[10px] text-neutral-500 block mb-0.5">Cloud-Top Cooling</span>
                  <strong className="text-rose-400 text-sm">{cell.ciCoolingRateK15m} K / 15m</strong>
                  <span className="text-[9px] text-neutral-600 block mt-1">Threshold: ≤ -4 K/15m</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                  <span className="text-[10px] text-neutral-500 block mb-0.5">Brightness Temp</span>
                  <strong className="text-cyan-300 text-sm">{cell.cloudTopTempK} K</strong>
                  <span className="text-[9px] text-neutral-600 block mt-1">Threshold: &lt; 235 K</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                  <span className="text-[10px] text-neutral-500 block mb-0.5">Echo Top (40 dBZ)</span>
                  <strong className="text-white text-sm">{cell.echoTopKm} km ASL</strong>
                  <span className="text-[9px] text-neutral-600 block mt-1">Core altitude</span>
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                  <span className="text-[10px] text-neutral-500 block mb-0.5">Vert. Liquid (VIL)</span>
                  <strong className="text-emerald-400 text-sm">{cell.vilKgM2} kg/m²</strong>
                  <span className="text-[9px] text-neutral-600 block mt-1">Water density</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850 text-[11px] text-neutral-400 leading-relaxed font-sans">
                The ML initiation model fuses INSAT-3D thermal cooling rates with early Doppler scans aloft to classify explosive storm genesis before precipitation reaches ground sensors.
              </div>
            </div>
          )}

          {/* TAB 4: DOWNSTREAM PATH ETAs */}
          {activeTab === 'TRAJECTORY' && (
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-neutral-400 mb-2">
                Settlements along forward advection vector ({cell.directionLabel}, {cell.speedKmh} km/h):
              </div>
              {cell.etaTargets.map((target) => {
                const remaining = Math.max(0, target.etaMinutes - timelineMinutes);
                return (
                  <div
                    key={target.settlementId}
                    onClick={() => selectSettlementById(target.settlementId)}
                    className="p-3 rounded-xl bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-neutral-700 cursor-pointer font-mono text-xs flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center space-x-2.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      <div>
                        <div className="font-medium text-white">{target.settlementName}</div>
                        <div className="text-[10px] text-neutral-500">Distance: {target.distanceKm} km</div>
                      </div>
                    </div>
                    <span className={`text-sm font-mono font-bold ${remaining <= 15 ? 'text-rose-400' : 'text-amber-300'}`}>
                      {remaining}m
                    </span>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Drawer Action Footer */}
        <div className="p-4 border-t border-neutral-800 bg-black flex items-center gap-3">
          <button
            onClick={onOpenCapModal}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg active:scale-98"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Broadcast CAP / SMS Alert</span>
          </button>
        </div>

      </div>
    </div>
  );
};
