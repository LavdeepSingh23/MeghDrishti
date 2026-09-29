import React, { useState, useEffect } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { SCENARIOS } from '../../data/scenarios';
import { ArrowLeft, Volume2, VolumeX, Shield, Plane, Users, AlertCircle, ChevronDown } from 'lucide-react';

export const DashboardNavbar: React.FC<{ onOpenCapModal: () => void }> = ({ onOpenCapModal }) => {
  const {
    setView,
    activeScenario,
    setScenarioId,
    stakeholderMode,
    setStakeholderMode,
    audioAlarmEnabled,
    toggleAudioAlarm,
  } = useWeather();

  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const opts: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      setTimeStr(new Intl.DateTimeFormat('en-GB', opts).format(now) + ' IST');
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <header className="absolute top-3 inset-x-3 sm:inset-x-4 z-30 select-none pointer-events-none">
      <div className="w-full rounded-xl border border-neutral-800 bg-black/90 backdrop-blur-xl shadow-2xl px-3.5 py-2 flex items-center justify-between gap-3 pointer-events-auto">
        
        {/* Left: Branding & Scenario Selector */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={() => setView('LANDING')}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-all"
            title="Return to Briefing"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Briefing</span>
          </button>

          <div className="h-4 w-px bg-neutral-800 hidden sm:block" />

          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-tight text-white">
              MeghDrishti
            </span>
          </div>

          {/* Scenario Selector Dropdown with fixed width & truncation */}
          <div className="relative max-w-[180px] sm:max-w-[240px] md:max-w-[280px]">
            <select
              value={activeScenario.id}
              onChange={(e) => setScenarioId(e.target.value)}
              className="w-full appearance-none bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-200 text-xs font-mono rounded-lg pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-neutral-600 cursor-pointer truncate transition-colors"
            >
              {SCENARIOS.map((s) => (
                <option key={s.id} value={s.id} className="bg-neutral-950 text-neutral-200">
                  {s.code}: {s.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Center: Clean Single-Line Segmented Stakeholder Tabs */}
        <div className="hidden lg:flex items-center p-1 rounded-lg bg-neutral-950 border border-neutral-800 text-xs shrink-0">
          <button
            onClick={() => setStakeholderMode('DISASTER_MANAGEMENT')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md whitespace-nowrap text-xs font-medium transition-all ${
              stakeholderMode === 'DISASTER_MANAGEMENT'
                ? 'bg-neutral-100 text-neutral-950 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Disaster / DDMA</span>
          </button>
          <button
            onClick={() => setStakeholderMode('AVIATION')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md whitespace-nowrap text-xs font-medium transition-all ${
              stakeholderMode === 'AVIATION'
                ? 'bg-neutral-100 text-neutral-950 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Aviation</span>
          </button>
          <button
            onClick={() => setStakeholderMode('RURAL_FARMER')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md whitespace-nowrap text-xs font-medium transition-all ${
              stakeholderMode === 'RURAL_FARMER'
                ? 'bg-neutral-100 text-neutral-950 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Rural / Farmer</span>
          </button>
        </div>

        {/* Right: Audio Siren, CAP Trigger, Clock (shrink-0, no wrapping) */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={toggleAudioAlarm}
            className={`p-1.5 rounded-lg border transition-all ${
              audioAlarmEnabled
                ? 'bg-rose-950/80 border-rose-600 text-rose-300'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title={audioAlarmEnabled ? 'Siren Active (Click to Mute)' : 'Siren Muted (Click to Arm)'}
          >
            {audioAlarmEnabled ? <Volume2 className="w-4 h-4 text-rose-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenCapModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium whitespace-nowrap transition-all shadow-sm active:scale-95"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dispatch Alert</span>
          </button>

          <div className="font-mono text-xs text-neutral-400 pl-2.5 border-l border-neutral-800 hidden md:block whitespace-nowrap">
            {timeStr}
          </div>
        </div>

      </div>
    </header>
  );
};
