import React, { createContext, useContext, useState, useEffect } from 'react';
import { WeatherScenario, StormCell, Settlement, StakeholderViewMode, RegionalLanguage } from '../types/weather';
import { SCENARIOS } from '../data/scenarios';

export interface VisibleLayers {
  radarDbz: boolean;
  satelliteTir1: boolean;
  lightning: boolean;
  stormCentroids: boolean;
  uncertaintyCone: boolean;
  settlementMarkers: boolean;
}

interface WeatherContextType {
  currentView: 'LANDING' | 'DASHBOARD';
  setView: (view: 'LANDING' | 'DASHBOARD') => void;
  activeScenario: WeatherScenario;
  setScenarioId: (id: string) => void;
  timelineMinutes: number;
  setTimelineMinutes: (min: number) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  playbackSpeed: 1 | 2 | 5;
  setPlaybackSpeed: (speed: 1 | 2 | 5) => void;
  stakeholderMode: StakeholderViewMode;
  setStakeholderMode: (mode: StakeholderViewMode) => void;
  language: RegionalLanguage;
  setLanguage: (lang: RegionalLanguage) => void;
  selectedCell: StormCell | null;
  selectCellById: (id: string | null) => void;
  selectedSettlement: Settlement | null;
  selectSettlementById: (id: string | null) => void;
  visibleLayers: VisibleLayers;
  toggleLayer: (key: keyof VisibleLayers) => void;
  audioAlarmEnabled: boolean;
  toggleAudioAlarm: () => void;
  dashboardTheme: 'dark' | 'light';
  setDashboardTheme: (theme: 'dark' | 'light') => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setView] = useState<'LANDING' | 'DASHBOARD'>('LANDING');
  const [activeScenarioId, setActiveScenarioId] = useState<string>(SCENARIOS[0].id);
  const [timelineMinutes, setTimelineMinutes] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5>(1);
  const [stakeholderMode, setStakeholderMode] = useState<StakeholderViewMode>('DISASTER_MANAGEMENT');
  const [language, setLanguage] = useState<RegionalLanguage>('EN');
  const [selectedCellId, setSelectedCellId] = useState<string | null>(SCENARIOS[0].cells[0]?.id || null);
  const [selectedSettlementId, setSelectedSettlementId] = useState<string | null>(null);
  const [dashboardTheme, setDashboardTheme] = useState<'dark' | 'light'>('light');

  // Progressive disclosure: only essential layers on by default
  const [visibleLayers, setVisibleLayers] = useState<VisibleLayers>({
    radarDbz: true,
    satelliteTir1: false,
    lightning: false,
    stormCentroids: true,
    uncertaintyCone: false,
    settlementMarkers: true,
  });

  const [audioAlarmEnabled, setAudioAlarmEnabled] = useState<boolean>(false);
  const activeScenario = SCENARIOS.find(s => s.id === activeScenarioId) || SCENARIOS[0];

  const setScenarioId = (id: string) => {
    setActiveScenarioId(id);
    const newScen = SCENARIOS.find(s => s.id === id);
    if (newScen && newScen.cells.length > 0) setSelectedCellId(newScen.cells[0].id);
    else setSelectedCellId(null);
    setSelectedSettlementId(null);
    setTimelineMinutes(0);
    setIsPlaying(false);
  };

  const selectedCell = activeScenario.cells.find(c => c.id === selectedCellId) || null;
  const selectedSettlement = activeScenario.settlements.find(s => s.id === selectedSettlementId) || null;

  const selectCellById = (id: string | null) => {
    setSelectedCellId(id);
    if (id) setSelectedSettlementId(null);
  };

  const selectSettlementById = (id: string | null) => {
    setSelectedSettlementId(id);
    if (id) {
      const settlement = activeScenario.settlements.find(s => s.id === id);
      if (settlement?.threatCellId) setSelectedCellId(settlement.threatCellId);
    }
  };

  const toggleLayer = (key: keyof VisibleLayers) => {
    setVisibleLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAudioAlarm = () => setAudioAlarmEnabled(prev => !prev);
  const togglePlay = () => setIsPlaying(prev => !prev);

  // Sync theme with HTML root class
  useEffect(() => {
    if (dashboardTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [dashboardTheme]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimelineMinutes(prev => {
        const next = prev + 10;
        if (next > 360) { setIsPlaying(false); return 360; }
        return next;
      });
    }, 1200 / playbackSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  return (
    <WeatherContext.Provider value={{
      currentView, setView, activeScenario, setScenarioId,
      timelineMinutes, setTimelineMinutes, isPlaying, togglePlay,
      playbackSpeed, setPlaybackSpeed, stakeholderMode, setStakeholderMode,
      language, setLanguage, selectedCell, selectCellById,
      selectedSettlement, selectSettlementById, visibleLayers, toggleLayer,
      audioAlarmEnabled, toggleAudioAlarm,
      dashboardTheme, setDashboardTheme,
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within a WeatherProvider');
  return context;
};
