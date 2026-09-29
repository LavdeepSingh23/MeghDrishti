import React, { useState, useEffect } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Clock, ChevronDown, ChevronUp, MapPin, Disc, Wind, CloudRain, Zap, AlertTriangle } from 'lucide-react';
import { ScenarioSelector } from './ScenarioSelector';

interface OperationsDossierProps {
  onOpenCapModal?: () => void;
}

const FormulaDrawer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { dashboardTheme } = useWeather();
  const isLight = dashboardTheme === 'light';

  return (
    <div className="mt-1.5 pt-1 border-t border-zinc-700/20 dark:border-zinc-800/60">
      <button
        onClick={() => setOpen(!open)}
        className="text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors font-sans cursor-pointer"
      >
        <span>Physics Formulation</span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <div className={`mt-1.5 p-2 rounded-md border text-[10px] font-mono leading-relaxed ${
          isLight
            ? 'bg-slate-100 border-slate-300 text-slate-700'
            : 'bg-[#0a0f16] border-zinc-800 text-zinc-400'
        }`}>
          {children}
        </div>
      )}
    </div>
  );
};

export const OperationsDossier: React.FC<OperationsDossierProps> = () => {
  const {
    activeScenario,
    selectedCell,
    selectedSettlement,
    selectSettlementById,
    timelineMinutes,
    stakeholderMode,
    language,
    setLanguage,
    dashboardTheme,
  } = useWeather();

  const [secondsOffset, setSecondsOffset] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsOffset((s) => (s + 1) % 60);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cell = selectedCell || activeScenario.cells[0];
  const primaryTarget = cell?.etaTargets[0];
  const targetSettlement = selectedSettlement || activeScenario.settlements.find(s => s.id === primaryTarget?.settlementId);

  const baseMinutes = Math.max(0, (targetSettlement?.activeEtaMinutes || primaryTarget?.etaMinutes || 20) - timelineMinutes);
  const displayMin = baseMinutes;
  const displaySec = baseMinutes > 0 ? (59 - secondsOffset).toString().padStart(2, '0') : '00';

  const airport = activeScenario.settlements.find(s => s.type === 'AIRPORT') || activeScenario.settlements[0];
  const ciAlert = activeScenario.ciAlerts[0];

  const isLight = dashboardTheme === 'light';

  return (
    <aside className={`w-[360px] md:w-[380px] h-full flex flex-col border-r select-none shrink-0 z-20 overflow-hidden font-sans transition-colors duration-200 ${
      isLight
        ? 'bg-slate-50 border-slate-300 text-slate-900'
        : 'bg-[#0c121b] border-zinc-800 text-zinc-100'
    }`}>
      
      {/* Scrollable Operations Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs font-sans">
        
        {/* Scenario Quick Picker */}
        <ScenarioSelector />
        
        {/* Cell Header & High-Precision Countdown Block */}
        <div className={`p-3.5 rounded-xl border space-y-2.5 transition-colors shadow-sm ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#131b26] border-zinc-700/70'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-sm tracking-tight">
                {cell?.code} &bull; {cell?.name}
              </span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border tracking-tight ${
              cell?.severity === 'RED'
                ? 'bg-rose-950/80 border-rose-600 text-rose-300'
                : 'bg-amber-950/80 border-amber-600 text-amber-300'
            }`}>
              {cell?.severity} ALERT
            </span>
          </div>

          {/* Countdown Display Card */}
          <div className={`p-3 rounded-lg border flex items-center justify-between ${
            isLight
              ? 'bg-slate-100/80 border-slate-200 text-slate-900'
              : 'bg-[#090d14] border-zinc-800/90 text-white'
          }`}>
            <div>
              <div className="flex items-center space-x-1 text-[11px] text-zinc-400">
                <Clock className="w-3 h-3 text-rose-500" />
                <span>Impact Countdown:</span>
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-rose-500 pt-0.5">
                {displayMin > 0 ? `${displayMin}m ${displaySec}s` : 'REACHED'}
              </div>
            </div>

            <div className="text-right text-[11px] font-mono space-y-0.5">
              <div className="font-semibold text-zinc-300">
                {primaryTarget?.distanceKm || 14} km dist
              </div>
              <div className="text-zinc-400">
                {cell?.speedKmh} km/h {cell?.directionLabel}
              </div>
            </div>
          </div>

          <div className="text-xs flex items-center justify-between pt-0.5">
            <span className="text-zinc-400">Primary Impact Target:</span>
            <strong className="text-rose-600 dark:text-rose-400 font-bold truncate max-w-[180px]">
              {targetSettlement?.name}
            </strong>
          </div>
        </div>

        {/* Integrated Convective Initiation Precursor Alert */}
        {ciAlert && (
          <div className={`p-3 rounded-xl border text-xs leading-snug shadow-sm ${
            isLight ? 'bg-amber-50/80 border-amber-300 text-amber-950' : 'bg-[#181912] border-amber-600/40 text-amber-200'
          }`}>
            <div className="font-bold flex items-center space-x-1.5 mb-1 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Convective Initiation Detected (30-60m Lead)</span>
            </div>
            <p className="text-[11px] opacity-90">
              Rapid cooling rate detected at {ciAlert.region}. Anticipated impact window: <strong className="font-bold">{ciAlert.predictedImpactWindowMin}</strong>.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-amber-500/20 font-mono text-[10px]">
              <div>Cooling: <strong>{cell?.ciCoolingRateK15m} K/15m</strong></div>
              <div>Echo Top: <strong>{cell?.echoTopKm} km</strong></div>
            </div>
          </div>
        )}

        {/* 4 Severe Physical Hazard Gauges */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Severe Physical Hazards
          </div>

          {/* Hail */}
          <div className={`p-3 rounded-xl border shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-[#131b26] border-zinc-700/60'}`}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center space-x-1.5">
                <Disc className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-bold">Hail Severity (MESH)</span>
              </span>
              <span className="font-mono font-bold text-sky-400">{cell?.meshMm} mm</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800/80 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, ((cell?.meshMm || 0) / 50) * 100)}%` }} />
            </div>
            <div className="mt-1.5 text-[10px] text-zinc-400 flex justify-between font-mono">
              <span>Freezing: {cell?.freezingLevelM}m ASL</span>
              <span className="font-semibold text-zinc-300">{(cell?.meshMm || 0) >= 30 ? 'High Risk (>30mm)' : 'Moderate'}</span>
            </div>
            <FormulaDrawer>
              MESH derived from reflectivity core height above 0°C isotherm. VIL = 3.44×10⁻⁶ × ∫ Z^(4/7) dh.
            </FormulaDrawer>
          </div>

          {/* Wind */}
          <div className={`p-3 rounded-xl border shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-[#131b26] border-zinc-700/60'}`}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center space-x-1.5">
                <Wind className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold">Downburst Gust Speed</span>
              </span>
              <span className="font-mono font-bold text-amber-400">{cell?.gustSpeedKmh} km/h</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800/80 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, ((cell?.gustSpeedKmh || 0) / 120) * 100)}%` }} />
            </div>
            <div className="mt-1.5 text-[10px] text-zinc-400 flex justify-between font-mono">
              <span>Probability: {cell?.downburstProbPercent}%</span>
              <span className="font-semibold text-zinc-300">Radial Velocity Divergence</span>
            </div>
            <FormulaDrawer>
              Identified via radar radial velocity divergence (∇ • Vr) at cloud base combined with VIL core collapse.
            </FormulaDrawer>
          </div>

          {/* Rain */}
          <div className={`p-3 rounded-xl border shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-[#131b26] border-zinc-700/60'}`}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center space-x-1.5">
                <CloudRain className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold">Instant Rain Rate</span>
              </span>
              <span className="font-mono font-bold text-emerald-400">{cell?.rainRateMmHr} mm/h</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800/80 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, ((cell?.rainRateMmHr || 0) / 140) * 100)}%` }} />
            </div>
            <div className="mt-1.5 text-[10px] text-zinc-400 flex justify-between font-mono">
              <span>IMD Flash Flood Limit: 100 mm/h</span>
              <span className="font-semibold text-zinc-300">{(cell?.rainRateMmHr || 0) >= 100 ? 'Extreme Flash Flood' : 'Torrential'}</span>
            </div>
            <FormulaDrawer>
              Derived from Marshall-Palmer relation Z = 200 R^1.6. Checked against statutory flash flood limits.
            </FormulaDrawer>
          </div>

          {/* Lightning */}
          <div className={`p-3 rounded-xl border shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-[#131b26] border-zinc-700/60'}`}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-bold">Lightning Frequency</span>
              </span>
              <span className="font-mono font-bold text-purple-400">{cell?.lightningStrikesPerMin} / min</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800/80 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, ((cell?.lightningStrikesPerMin || 0) / 70) * 100)}%` }} />
            </div>
            <div className="mt-1.5 text-[10px] text-zinc-400 flex justify-between font-mono">
              <span>IITM Ground Sensor Network</span>
              <span className="font-semibold text-zinc-300">Active Strike Jump</span>
            </div>
            <FormulaDrawer>
              Flash rate acceleration (dF/dt &gt; 2σ) confirms internal updraft graupel collisions.
            </FormulaDrawer>
          </div>
        </div>

        {/* 5. Stakeholder Module */}
        {stakeholderMode === 'DISASTER_MANAGEMENT' && (
          <div className="space-y-2 pt-2 border-t border-zinc-700/30">
            <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Downstream Vulnerable Settlements
            </div>
            <div className="space-y-1.5">
              {cell?.etaTargets.map((target) => {
                const remaining = Math.max(0, target.etaMinutes - timelineMinutes);
                const isSelected = targetSettlement?.id === target.settlementId;
                return (
                  <button
                    key={target.settlementId}
                    onClick={() => selectSettlementById(target.settlementId)}
                    className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? (isLight ? 'bg-slate-200 border-slate-400 font-bold' : 'bg-zinc-800 border-zinc-600 font-bold text-white')
                        : (isLight ? 'bg-white border-slate-200 hover:bg-slate-100' : 'bg-[#131b26] border-zinc-700/60 hover:bg-[#192332]')
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="font-semibold">{target.settlementName}</span>
                    </div>
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{remaining}m</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {stakeholderMode === 'AVIATION' && (
          <div className="space-y-2.5 pt-2 border-t border-zinc-700/30">
            <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Aviation Corridor & Aerodrome Status
            </div>
            <div className={`p-3 rounded-xl border space-y-1.5 shadow-sm ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#131b26] border-zinc-700/60'
            }`}>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold">{airport.name}</span>
                <span className="text-[10px] font-mono font-bold text-rose-500">MICROBURST ALERT</span>
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                ETA: <strong className="font-bold text-rose-600">{airport.activeEtaMinutes || 18}m</strong> &bull; Wind Shear: <strong>{cell?.gustSpeedKmh} km/h</strong>
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 font-mono">
              Simulated SPECI Bulletin (ICAO Convention):
            </div>
            <div className={`p-2.5 rounded-lg border font-mono text-[10px] leading-relaxed overflow-x-auto ${
              isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-[#090d14] border-zinc-800 text-zinc-300'
            }`}>
              SPECI VIDP 231215Z 28045G58KT 1200 +TSRA SQ BKN015CB OVC080 22/19 Q1004 WS ALL RWY=
            </div>
          </div>
        )}

        {stakeholderMode === 'RURAL_FARMER' && (
          <div className="space-y-2.5 pt-2 border-t border-zinc-700/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Farmer Advisory Bulletin
              </span>
              <div className="flex space-x-1">
                {(['EN', 'HI', 'BN', 'PA'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                      language === lang
                        ? (isLight ? 'bg-slate-800 text-white' : 'bg-zinc-200 text-zinc-950')
                        : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <div className={`p-3 rounded-xl border space-y-2 text-xs leading-relaxed shadow-sm ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#131b26] border-zinc-700/60'
            }`}>
              <p className="font-bold text-rose-600 dark:text-rose-400">
                {language === 'HI' ? 'चेतावनी: अगले 20-30 मिनट में तेज हवा, ओलावृष्टि और भारी बारिश की संभावना है।' : 'Severe Weather Alert: Destructive winds, large hail, and extreme precipitation expected.'}
              </p>
              <ul className="space-y-1 text-zinc-500 dark:text-zinc-400 text-xs list-disc list-inside">
                <li>{language === 'HI' ? 'खुले खेतों से तुरंत सुरक्षित पक्के स्थान पर जाएं।' : 'Evacuate open fields immediately; seek pucca shelter.'}</li>
                <li>{language === 'HI' ? 'पशुओं को टिन शेड या बड़े पेड़ों के नीचे न बांधें।' : 'Do not tether cattle under tin canopies or isolated trees.'}</li>
                <li>{language === 'HI' ? 'बिजली के खंभों और धातु की बाड़ से दूर रहें।' : 'Stay away from high-tension wires and metal irrigation piping.'}</li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
};
