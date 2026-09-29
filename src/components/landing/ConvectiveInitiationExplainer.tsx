import React from 'react';

export const ConvectiveInitiationExplainer: React.FC = () => {
  return (
    <section id="how-it-works" className="relative z-10 py-20 px-6 max-w-5xl mx-auto border-t border-storm-800/60">
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
        How MeghDrishti catches storms before they fully form
      </h2>
      <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-2xl">
        Standard radar warnings only trigger once a storm has already produced
        dense precipitation cores. By that point, ground impact is minutes away.
        We monitor three independent precursor signals, each visible well before
        surface conditions change.
      </p>

      {/* Three signals as a clean timeline, not a matrix */}
      <div className="mt-12 relative">
        {/* Vertical connector line */}
        <div className="absolute left-[19px] top-3 bottom-3 w-px bg-storm-700 hidden sm:block" />

        <div className="space-y-8 sm:space-y-10">
          {/* Signal 1 */}
          <div className="flex items-start gap-5">
            <div className="shrink-0 w-10 h-10 rounded-full bg-sky-950 border border-sky-800/60 flex items-center justify-center font-mono text-xs font-bold text-sky-400 z-10">
              1
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-slate-100">
                Satellite sees the cloud top cooling rapidly
              </h3>
              <p className="mt-1.5 text-sm text-slate-400 leading-relaxed max-w-xl">
                INSAT-3D thermal infrared tracks cloud-top brightness temperature.
                When a developing tower cools faster than 4 K in 15 minutes and
                drops below 235 K, the atmosphere is building a convective column
                that will produce severe weather.
              </p>
              <div className="mt-2 text-xs font-mono text-slate-500">
                45 to 60 minutes before surface impact
              </div>
            </div>
          </div>

          {/* Signal 2 */}
          <div className="flex items-start gap-5">
            <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-950 border border-emerald-800/60 flex items-center justify-center font-mono text-xs font-bold text-emerald-400 z-10">
              2
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-slate-100">
                Radar picks up the first echo above the freezing level
              </h3>
              <p className="mt-1.5 text-sm text-slate-400 leading-relaxed max-w-xl">
                Doppler radar volume scans detect the first appearance of 35 dBZ
                reflectivity above the 0 degree C isotherm. Supercooled droplets
                are freezing into graupel aloft. Surface hail or downburst
                follows in 20 to 30 minutes.
              </p>
              <div className="mt-2 text-xs font-mono text-slate-500">
                25 to 35 minutes before surface impact
              </div>
            </div>
          </div>

          {/* Signal 3 */}
          <div className="flex items-start gap-5">
            <div className="shrink-0 w-10 h-10 rounded-full bg-amber-950 border border-amber-800/60 flex items-center justify-center font-mono text-xs font-bold text-amber-400 z-10">
              3
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-slate-100">
                Lightning rate suddenly spikes
              </h3>
              <p className="mt-1.5 text-sm text-slate-400 leading-relaxed max-w-xl">
                The IITM/Damini ground network detects a &quot;lightning jump&quot; &mdash;
                a sudden increase in total flash rate well above its running mean.
                This confirms vigorous updrafts and intense graupel collision,
                and reliably precedes severe surface weather.
              </p>
              <div className="mt-2 text-xs font-mono text-slate-500">
                15 to 25 minutes before surface impact
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What happens after detection */}
      <div className="mt-14 p-5 rounded border border-storm-800 bg-storm-900/40">
        <h3 className="font-display text-sm font-semibold text-slate-200">
          Once initiation is confirmed
        </h3>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          The system hands off to the nowcasting engine.
          For the first 2 hours, pySTEPS optical flow extrapolation tracks the cell forward.
          Beyond 2 hours, a trained spatiotemporal neural network blended with NWP
          boundary fields projects the storm out to 6 hours. Each cell gets a unique
          ID, speed, heading, and real-time countdown to every settlement in its path.
        </p>
      </div>
    </section>
  );
};
