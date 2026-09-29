import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';

export const TimeMachineSlider: React.FC = () => {
  const {
    timelineMinutes,
    setTimelineMinutes,
    isPlaying,
    togglePlay,
    playbackSpeed,
    setPlaybackSpeed,
    dashboardTheme,
  } = useWeather();

  const isLight = dashboardTheme === 'light';

  const handleStep = (delta: number) => {
    setTimelineMinutes(Math.max(-60, Math.min(360, timelineMinutes + delta)));
  };

  const handleResetNow = () => {
    setTimelineMinutes(0);
  };

  const sign = timelineMinutes >= 0 ? '+' : '-';
  const absMin = Math.abs(timelineMinutes);
  const hours = Math.floor(absMin / 60);
  const mins = absMin % 60;
  const timeFormatted = `T ${sign}${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m`;

  let regimeLabel = 'Observed Radar';
  if (timelineMinutes > 120) {
    regimeLabel = 'Neural / NWP Blend';
  } else if (timelineMinutes > 0) {
    regimeLabel = 'pySTEPS Optical Flow';
  }

  return (
    <div
      className={`w-full border-t px-4 py-2.5 flex items-center justify-between gap-4 select-none z-20 transition-colors ${
        isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-[#0c0c0e] border-zinc-800 text-zinc-300'
      }`}
    >
      {/* 1. Playback Controls */}
      <div className="flex items-center space-x-1.5 shrink-0">
        <button
          onClick={togglePlay}
          className={`p-1.5 rounded-md font-bold transition-colors active:scale-95 shadow-sm ${
            isLight
              ? 'bg-slate-900 hover:bg-black text-white'
              : 'bg-white hover:bg-zinc-200 text-black'
          }`}
          title={isPlaying ? 'Pause Playback' : 'Start Playback'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
        </button>

        <button
          onClick={() => handleStep(-10)}
          className={`p-1.5 rounded-md border transition-colors ${
            isLight
              ? 'bg-white hover:bg-slate-200 border-slate-300 text-slate-700'
              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
          }`}
          title="Step -10m"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => handleStep(10)}
          className={`p-1.5 rounded-md border transition-colors ${
            isLight
              ? 'bg-white hover:bg-slate-200 border-slate-300 text-slate-700'
              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
          }`}
          title="Step +10m"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleResetNow}
          className={`px-2 py-1 rounded-md border text-xs font-medium transition-colors flex items-center space-x-1 ${
            isLight
              ? 'bg-white hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900'
              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white'
          }`}
          title="Reset to NOW"
        >
          <RotateCcw className="w-3 h-3" />
          <span>NOW</span>
        </button>

        {/* Speed Selector */}
        <div
          className={`flex items-center rounded-md p-0.5 border font-mono text-[10px] ml-1 ${
            isLight ? 'bg-slate-200 border-slate-300' : 'bg-zinc-950 border-zinc-800'
          }`}
        >
          {([1, 2, 5] as const).map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                playbackSpeed === spd
                  ? isLight
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'bg-zinc-800 text-white font-bold'
                  : isLight
                  ? 'text-slate-500 hover:text-slate-800'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* 2. Timeline Range Scrubber */}
      <div className="flex-1 flex flex-col justify-center max-w-xl">
        <div
          className={`flex items-center justify-between text-[10px] font-mono mb-1 whitespace-nowrap gap-1 select-none ${
            isLight ? 'text-slate-600' : 'text-zinc-400'
          }`}
        >
          <span>-60m (Past)</span>
          <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${isLight ? 'bg-slate-200 text-slate-900' : 'bg-zinc-800 text-white'}`}>
            NOW (0m)
          </span>
          <span>+2h (pySTEPS)</span>
          <span>+6h (Blend)</span>
        </div>

        <input
          type="range"
          min={-60}
          max={360}
          step={10}
          value={timelineMinutes}
          onChange={(e) => setTimelineMinutes(parseInt(e.target.value, 10))}
          className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer border ${
            isLight
              ? 'bg-slate-200 border-slate-300 accent-slate-900'
              : 'bg-zinc-800 border-zinc-700 accent-white'
          }`}
        />

        <div className="flex h-0.5 w-full mt-1 rounded overflow-hidden">
          <div className="w-[14.2%] bg-cyan-500" title="Radar Observation" />
          <div className="w-[28.5%] bg-emerald-500" title="pySTEPS Extrapolation" />
          <div className="w-[57.3%] bg-indigo-500" title="Neural Network Blend" />
        </div>
      </div>

      {/* 3. Regime Tag & Offset */}
      <div className="flex items-center space-x-2 shrink-0">
        <div
          className={`px-2.5 py-1 rounded-md border text-xs font-medium ${
            isLight ? 'bg-white border-slate-300 text-slate-700' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
          }`}
        >
          {regimeLabel}
        </div>
        <div
          className={`px-2.5 py-1 rounded-md border font-mono text-xs font-bold tracking-wider ${
            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-zinc-900 border-zinc-800 text-white'
          }`}
        >
          {timeFormatted}
        </div>
      </div>
    </div>
  );
};
