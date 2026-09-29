import React from 'react';
import { StormAtmosphereCanvas } from '../canvas/StormAtmosphereCanvas';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { ConvectiveInitiationExplainer } from './ConvectiveInitiationExplainer';
import { TechnicalDetail } from './TechnicalDetail';
import { LandingFooter } from './LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-storm-950 text-slate-100">
      <StormAtmosphereCanvas intensity="severe" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <LandingHeader />
        <main className="flex-1">
          <HeroSection />
          <ConvectiveInitiationExplainer />
          <TechnicalDetail />
        </main>
        <LandingFooter />
      </div>
    </div>
  );
};
