import React from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardView } from './components/dashboard/DashboardView';

const MainAppContent: React.FC = () => {
  const { currentView } = useWeather();

  if (currentView === 'DASHBOARD') {
    return <DashboardView />;
  }

  return <LandingPage />;
};

export default function App() {
  return (
    <WeatherProvider>
      <MainAppContent />
    </WeatherProvider>
  );
}
