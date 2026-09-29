import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { SCENARIOS } from '../../data/scenarios';
import { ChevronDown, ChevronUp, ArrowUpRight, Database, Layers, Cpu, Activity, LayoutDashboard } from 'lucide-react';

export const TechnicalDetail: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setScenarioId, setView } = useWeather();

  const handleLaunch = (id: string) => {
    setScenarioId(id);
    setView('DASHBOARD');
  };

  const layers = [
    { num: '1', title: 'Real-time ingestion', icon: Database, desc: 'IMD Doppler radar (dBZ + radial velocity, 10-min cycle), INSAT-3D/3DR TIR1 (cloud-top temperature, 4-min rapid scan), IITM lightning detection network (Damini), and optional AWS surface stations. Streamed via Kafka/MQTT connectors.' },
    { num: '2', title: 'Fusion and preprocessing', icon: Layers, desc: 'All sensors resampled onto a common 2 km grid with 10-minute time steps. Radar clutter removed via Py-ART. Satellite parallax corrected for INSAT 82E geostationary orbit. Output: a unified xarray data cube per grid cell.' },
    { num: '3', title: 'Convective initiation detection', icon: Cpu, desc: 'Satellite cooling rate, radar first-echo aloft, and lightning jump fed into an XGBoost classifier. Output: probability of storm genesis within the next 30 to 60 minutes, per grid cell.' },
    { num: '4', title: 'Nowcasting and hazard prediction', icon: Activity, desc: '0 to 2 hours: pySTEPS optical flow extrapolation. 2 to 6 hours: ConvLSTM / U-Net blended with NWP. Separate hazard heads for hail (MESH/VIL), downburst (radial divergence + VIL collapse), cloudburst (Z-R rain rate), and lightning density. TITAN-style cell tracking with unique IDs, speed, heading.' },
    { num: '5', title: 'Console and alert delivery', icon: LayoutDashboard, desc: 'Live GIS map with toggleable data layers. Settlement countdown timers. Stakeholder-specific views for disaster management, aviation, and rural farmers. Alert dispatch formatted to match CAP conventions, GSM cell broadcast, and WhatsApp channels.' },
  ];

  return (
    <section id="technical" className="relative z-10 px-6 max-w-5xl mx-auto pb-16">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 border-t border-b border-storm-800/60 text-left group"
      >
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
            Technical detail
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            5-layer architecture, hazard physics, and historical replay datasets
          </p>
        </div>
        {isOpen
          ? <ChevronUp className="w-5 h-5 text-slate-400" />
          : <ChevronDown className="w-5 h-5 text-slate-400" />
        }
      </button>

      {isOpen && (
        <div className="mt-8 space-y-12 animate-in fade-in">

          {/* Architecture layers */}
          <div>
            <h3 className="font-display text-base font-semibold text-slate-200 mb-6">System architecture</h3>
            <div className="space-y-4">
              {layers.map((layer) => {
                const Icon = layer.icon;
                return (
                  <div key={layer.num} className="flex items-start gap-4 p-4 rounded bg-storm-900/50 border border-storm-800/60">
                    <div className="shrink-0 w-8 h-8 rounded bg-storm-800 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-500">Layer {layer.num}</span>
                        <h4 className="font-display text-sm font-semibold text-slate-100">{layer.title}</h4>
                      </div>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">{layer.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hazard physics - descriptive, no raw formulas on surface */}
          <div>
            <h3 className="font-display text-base font-semibold text-slate-200 mb-4">How each hazard is calculated</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <HazardCard
                title="Hail risk and size"
                description="Estimated from Vertically Integrated Liquid (VIL) and how far above the freezing level the 50 dBZ echo extends. Higher and denser echo cores produce larger hailstones."
                thresholds="Watch: 10-20 mm / Warning: 20-35 mm / Severe: above 35 mm"
              />
              <HazardCard
                title="Downburst and sudden wind"
                description="Detected by divergence patterns in radar radial velocity at cloud base, combined with a sudden drop in VIL (core collapse) and dry sub-cloud air entrainment."
                thresholds="Watch: 45-60 km/h / Warning: 60-85 km/h / Severe: above 85 km/h"
              />
              <HazardCard
                title="Cloudburst and extreme rainfall"
                description="Rain rate derived from radar reflectivity using the standard convective Z-R relationship, cross-referenced with the IMD statutory cloudburst threshold of 100 mm per hour."
                thresholds="Heavy: 50-99 mm/h / Cloudburst: 100+ mm/h"
              />
              <HazardCard
                title="Lightning density"
                description="Ground strike density measured by the IITM time-of-arrival sensor network. A sudden jump in strike frequency above the running mean signals escalating internal updraft energy."
                thresholds="Watch: 10-25 / Warning: 25-50 / Severe: 50+ strikes per sq km per hour"
              />
            </div>
          </div>

          {/* Historical datasets */}
          <div>
            <h3 className="font-display text-base font-semibold text-slate-200 mb-4">Simulated replay datasets</h3>
            <p className="text-xs text-slate-400 mb-4">
              Archived radar and satellite observations from verified severe weather events.
              These drive the console demo as a simulated real-time stream.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SCENARIOS.map((scen) => (
                <div key={scen.id} className="p-4 rounded bg-storm-900/50 border border-storm-800/60 flex flex-col justify-between">
                  <div>
                    <div className="font-mono text-[11px] text-slate-500 mb-1">{scen.code}</div>
                    <h4 className="font-display text-sm font-semibold text-slate-100">{scen.title}</h4>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">{scen.region}</p>
                    <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-500">
                      <span>Peak: <strong className="text-slate-300">{scen.radarSummary.maxReflectivityDbz} dBZ</strong></span>
                      <span>Gust: <strong className="text-slate-300">{scen.radarSummary.peakGustKmh} km/h</strong></span>
                      <span>Rain: <strong className="text-slate-300">{scen.radarSummary.peakRainRateMmHr} mm/h</strong></span>
                      <span>Strikes: <strong className="text-slate-300">{scen.radarSummary.totalLightningStrikes}</strong></span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLaunch(scen.id)}
                    className="mt-4 w-full py-2 px-3 rounded bg-storm-800/80 hover:bg-sky-600 hover:text-slate-950 border border-storm-750 text-slate-300 font-mono text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Load into console</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </section>
  );
};

const HazardCard: React.FC<{ title: string; description: string; thresholds: string }> = ({ title, description, thresholds }) => (
  <div className="p-4 rounded bg-storm-900/50 border border-storm-800/60">
    <h4 className="font-display text-sm font-semibold text-slate-100">{title}</h4>
    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{description}</p>
    <div className="mt-2 text-[11px] font-mono text-slate-500">{thresholds}</div>
  </div>
);
