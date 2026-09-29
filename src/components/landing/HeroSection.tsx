import React, { useState, useEffect, useRef } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { ArrowRight, Zap, Shield, Radar } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setView } = useWeather();
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Mouse offset for interactive multi-layer cloud parallax
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) / (rect.width / 2);
      const dy = (e.clientY - centerY) / (rect.height / 2);
      setMouseOffset({
        x: Math.max(-1, Math.min(1, dx)),
        y: Math.max(-1, Math.min(1, dy)),
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative z-10 pt-32 sm:pt-36 pb-20 px-6 max-w-5xl mx-auto flex flex-col items-center text-center select-none"
    >
      {/* 1. Sleek Minimal Status Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] backdrop-blur-xl text-xs text-slate-300 mb-6 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        <span className="font-mono text-[11px] tracking-wider text-slate-300 uppercase">
          0–6H High-Resolution Convective Nowcasting
        </span>
      </div>

      {/* 2. Centered Heading with Sophisticated Volumetric Thunderstorm Clouds */}
      <div
        className="relative my-2 flex items-center justify-center cursor-default group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* === SOPHISTICATED VOLUMETRIC CLOUDS (Atmospheric, multi-layered, organic soft billows) === */}
        
        {/* Layer 1: Deep Tropospheric Storm Mass (Backing Ambient Haze) */}
        <div
          className="absolute -inset-x-24 -inset-y-16 pointer-events-none transition-transform duration-700 ease-out"
          style={{
            transform: `translate3d(${mouseOffset.x * 8}px, ${mouseOffset.y * 6}px, 0)`,
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-r from-sky-950/20 via-slate-800/30 to-sky-900/20 blur-3xl opacity-70" />
        </div>

        {/* Layer 2: Flanking Left Volumetric Cumulus Billows */}
        <div
          className="absolute -left-24 sm:-left-44 lg:-left-56 -top-10 sm:-top-16 w-48 sm:w-72 lg:w-96 h-40 sm:h-56 pointer-events-none transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(${mouseOffset.x * 18}px, ${mouseOffset.y * 14}px, 0) scale(${
              isHovered ? 1.04 : 1.0
            })`,
          }}
        >
          {/* Multi-layered organic cloud lobes (no cartoon strokes, authentic soft volume) */}
          <div className="relative w-full h-full filter blur-[1px]">
            {/* Lobe 1 */}
            <div className="absolute top-4 left-6 w-32 sm:w-44 h-24 sm:h-32 rounded-full bg-gradient-to-br from-slate-700/40 via-slate-800/60 to-transparent blur-md" />
            {/* Lobe 2 */}
            <div className="absolute -top-2 left-16 sm:left-24 w-36 sm:w-48 h-28 sm:h-36 rounded-full bg-gradient-to-b from-slate-600/35 via-slate-800/70 to-slate-900/40 blur-lg" />
            {/* Lobe 3 */}
            <div className="absolute top-12 left-28 sm:left-40 w-28 sm:w-36 h-20 sm:h-28 rounded-full bg-gradient-to-tr from-sky-900/20 via-slate-800/50 to-transparent blur-md" />
            {/* Soft illuminated silver wisp */}
            <div
              className={`absolute top-2 left-12 w-28 h-12 rounded-full bg-sky-400/10 blur-xl transition-opacity duration-500 ${
                isHovered ? 'opacity-80' : 'opacity-30'
              }`}
            />
          </div>
        </div>

        {/* Layer 3: Flanking Right Volumetric Cumulus Billows */}
        <div
          className="absolute -right-24 sm:-right-44 lg:-right-56 -bottom-8 sm:-bottom-14 w-48 sm:w-72 lg:w-96 h-40 sm:h-56 pointer-events-none transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(${-mouseOffset.x * 16}px, ${-mouseOffset.y * 12}px, 0) scale(${
              isHovered ? 1.04 : 1.0
            })`,
          }}
        >
          <div className="relative w-full h-full filter blur-[1px]">
            {/* Lobe 1 */}
            <div className="absolute bottom-4 right-8 w-36 sm:w-48 h-28 sm:h-36 rounded-full bg-gradient-to-tl from-slate-700/45 via-slate-800/65 to-transparent blur-md" />
            {/* Lobe 2 */}
            <div className="absolute -bottom-2 right-20 sm:right-28 w-32 sm:w-44 h-24 sm:h-32 rounded-full bg-gradient-to-t from-slate-600/35 via-slate-800/70 to-slate-900/40 blur-lg" />
            {/* Lobe 3 */}
            <div className="absolute bottom-10 right-32 sm:right-44 w-28 sm:w-36 h-20 sm:h-28 rounded-full bg-gradient-to-bl from-sky-900/20 via-slate-800/50 to-transparent blur-md" />
            {/* Soft illuminated silver wisp */}
            <div
              className={`absolute bottom-6 right-16 w-32 h-14 rounded-full bg-sky-400/10 blur-xl transition-opacity duration-500 ${
                isHovered ? 'opacity-80' : 'opacity-30'
              }`}
            />
          </div>
        </div>

        {/* Central Clean Main Title */}
        <div className="relative z-10 px-4 py-1">
          <h1
            className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.85)] leading-[1.05]"
            style={{
              fontFamily: '"Aleo", Georgia, serif',
              textShadow: isHovered
                ? '0 0 45px rgba(56, 189, 248, 0.35), 0 6px 25px rgba(0,0,0,0.9)'
                : '0 6px 30px rgba(0,0,0,0.85)',
            }}
          >
            MeghDrishti
          </h1>
        </div>
      </div>

      {/* 3. Clean, Punchy Subtitle (Zero Text Clutter) */}
      <h2 className="mt-5 text-xl sm:text-2xl lg:text-3xl font-medium text-slate-100 max-w-2xl leading-snug">
        Detecting severe convective storms{' '}
        <span className="text-sky-400 font-semibold underline decoration-sky-500/30 underline-offset-4">
          30 to 60 minutes
        </span>{' '}
        before ground impact.
      </h2>

      {/* 4. Single Crisp Value Proposition */}
      <p className="mt-3.5 text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
        Fusing live Doppler radar, INSAT-3D thermal infrared, and lightning networks across India
        into a 2 km grid that catches convective initiation before storms touch down.
      </p>

      {/* 5. Sleek Floating Action Controls */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
        <button
          onClick={() => setView('DASHBOARD')}
          className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-7 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(14,165,233,0.4)] hover:shadow-[0_0_35px_rgba(14,165,233,0.6)] active:scale-95 cursor-pointer"
        >
          <span>Launch Mission Console</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        <a
          href="#how-it-works"
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-full border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-sm font-medium transition-all backdrop-blur-md"
        >
          <span>Explore Architecture</span>
        </a>
      </div>

      {/* 6. Minimal Institutional Proof Points */}
      <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-2">
          <Zap className="w-3.5 h-3.5 text-sky-400" />
          <span>+30–60m Pre-Radar Lead Time</span>
        </div>
        <div className="hidden sm:block text-slate-600">•</div>
        <div className="flex items-center space-x-2">
          <Radar className="w-3.5 h-3.5 text-sky-400" />
          <span>2 km Convective Fusion Grid</span>
        </div>
        <div className="hidden sm:block text-slate-600">•</div>
        <div className="flex items-center space-x-2">
          <Shield className="w-3.5 h-3.5 text-sky-400" />
          <span>IMD DWR + INSAT-3D Core</span>
        </div>
      </div>
    </section>
  );
};
