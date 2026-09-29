import React, { useState, useEffect } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { NotchNav, NotchItemData } from '../navigation/NotchNav';
import { ScenarioSelector } from './ScenarioSelector';
import { OperationsDossier } from './OperationsDossier';
import { ThreatMap } from './ThreatMap';
import { TimeMachineSlider } from './TimeMachineSlider';
import { AlertDispatcherModal } from './AlertDispatcherModal';
import {
  Shield,
  Plane,
  Users,
  ArrowLeft,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    setView,
    stakeholderMode,
    setStakeholderMode,
    audioAlarmEnabled,
    toggleAudioAlarm,
    dashboardTheme,
    setDashboardTheme,
  } = useWeather();

  const [isCapModalOpen, setIsCapModalOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(true);
  const [timeStr, setTimeStr] = useState('');

  const isLight = dashboardTheme === 'light';

  useEffect(() => {
    const updateTime = () => {
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
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Stakeholder items for Center Notch Menu with Framer Motion spring pill
  const notchItems: NotchItemData[] = [
    {
      id: 'DISASTER_MANAGEMENT',
      label: 'District / DDMA',
      icon: Shield,
    },
    {
      id: 'AVIATION',
      label: 'Aviation Met',
      icon: Plane,
      badge: 'METAR',
    },
    {
      id: 'RURAL_FARMER',
      label: 'Rural / Krishi',
      icon: Users,
      badge: 'NDMA',
    },
  ];

  // Left Notch: Return to Briefing & MeghDrishti Institutional Identity
  const leftNotchLogo = (
    <div className="flex items-center space-x-2 sm:space-x-2.5">
      <button
        onClick={() => setView('LANDING')}
        className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
        title="Return to Briefing"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Briefing</span>
      </button>

      <div className="flex items-center space-x-1.5 pl-0.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ring-2 ring-emerald-500/20" />
        <span className="font-bold text-xs sm:text-sm tracking-tight text-white whitespace-nowrap">
          MeghDrishti
        </span>
      </div>
    </div>
  );

  // Right Notch: Clock, Siren, Theme Toggle, CAP Alert Button
  const rightNotchContent = (
    <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs">
      {/* Live IST Clock */}
      <span className="font-mono text-[11px] hidden md:inline px-2 py-0.5 rounded-full border bg-zinc-900 border-zinc-700/80 text-zinc-300 whitespace-nowrap">
        {timeStr}
      </span>

      {/* Audio Siren Toggle */}
      <button
        onClick={toggleAudioAlarm}
        className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
          audioAlarmEnabled
            ? 'bg-amber-950/80 border-amber-500/80 text-amber-400 animate-pulse'
            : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700/80 text-zinc-300 hover:text-white'
        }`}
        title={audioAlarmEnabled ? 'Audio Siren Active' : 'Enable Audio Siren'}
      >
        {audioAlarmEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
      </button>

      {/* Quick Theme Toggle */}
      <button
        onClick={() => setDashboardTheme(isLight ? 'dark' : 'light')}
        className="p-1.5 rounded-full border bg-zinc-900 hover:bg-zinc-800 border-zinc-700/80 text-zinc-300 hover:text-white transition-colors cursor-pointer"
        title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
      </button>

      {/* High-priority CAP Alert Dispatch Button */}
      <button
        onClick={() => setIsCapModalOpen(true)}
        className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-all cursor-pointer active:scale-95 whitespace-nowrap"
      >
        <AlertCircle className="w-3.5 h-3.5" />
        <span className="hidden sm:inline whitespace-nowrap">CAP Dispatch</span>
      </button>
    </div>
  );

  return (
    <>
      <NotchNav
        position="top"
        items={notchItems}
        activeId={stakeholderMode}
        onActiveChange={(id) => setStakeholderMode(id as any)}
        logo={leftNotchLogo}
        rightContent={rightNotchContent}
        contentClassName="overflow-hidden p-0"
      >
        {/* Split Operations Workbench */}
        <div className="relative flex w-full h-full overflow-hidden select-none">
          {/* 1. Left Collapsible Operations Drawer */}
          <div
            className={`h-full transition-all duration-300 ease-in-out flex shrink-0 relative z-20 ${
              isDossierOpen ? 'w-[360px] md:w-[380px]' : 'w-0'
            }`}
          >
            <div className="w-[360px] md:w-[380px] h-full overflow-hidden">
              <OperationsDossier onOpenCapModal={() => setIsCapModalOpen(true)} />
            </div>
          </div>

          {/* Drawer Toggle Tab */}
          <button
            onClick={() => setIsDossierOpen(!isDossierOpen)}
            className={`absolute top-14 z-30 flex items-center justify-center py-2 px-2.5 rounded-r-xl border border-l-0 shadow-2xl transition-all duration-300 cursor-pointer backdrop-blur-md ${
              isDossierOpen ? 'left-[360px] md:left-[380px]' : 'left-0'
            } ${
              isLight
                ? 'bg-white/95 text-slate-800 border-slate-300 hover:bg-slate-100'
                : 'bg-zinc-950/95 text-zinc-200 border-zinc-700 hover:bg-zinc-900'
            }`}
            title={isDossierOpen ? 'Collapse Operations (Full-Width Map View)' : 'Expand Operations'}
          >
            {isDossierOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <div className="flex items-center space-x-1.5 text-xs font-semibold">
                <ChevronRight className="w-4 h-4 text-rose-500" />
                <span className="hidden sm:inline">Operations</span>
              </div>
            )}
          </button>

          {/* 2. Right Uninterrupted GIS Radar Map (Expands to 100% full width when collapsed) */}
          <main className="relative flex-1 h-full flex flex-col bg-black overflow-hidden">
            {/* Central Map Canvas */}
            <div className="relative flex-1 w-full h-full overflow-hidden">
              <ThreatMap />
            </div>

            {/* Docked Time Machine Scrubber (Bottom of Map) */}
            <TimeMachineSlider />
          </main>
        </div>
      </NotchNav>

      {/* CAP XML / SMS / WhatsApp Broadcast Modal */}
      <AlertDispatcherModal
        isOpen={isCapModalOpen}
        onClose={() => setIsCapModalOpen(false)}
      />
    </>
  );
};
