import React from 'react';
import { Radio } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-storm-800/60 py-10 px-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-sky-400/60" />
          <span>MeghDrishti Prototype</span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span>Data: IMD DWR, MOSDAC INSAT-3D/3DR, IITM Lightning</span>
          <span>Core: pySTEPS, PyTorch, Leaflet</span>
        </div>
      </div>
    </footer>
  );
};
