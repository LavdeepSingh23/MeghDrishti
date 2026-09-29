import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useWeather } from '../../context/WeatherContext';
import { Layers, Compass, Box, Globe, Plane, Shield, Users, Sun, Moon } from 'lucide-react';

export const ThreatMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const stakeholderLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const {
    activeScenario,
    timelineMinutes,
    selectedCell,
    selectCellById,
    selectedSettlement,
    selectSettlementById,
    visibleLayers,
    toggleLayer,
    stakeholderMode,
    dashboardTheme,
    setDashboardTheme,
  } = useWeather();

  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [isLayersOpen, setIsLayersOpen] = useState<boolean>(false);
  const [activeCam, setActiveCam] = useState<'STORM' | 'INDIA'>('INDIA');
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const currentScenarioIdRef = useRef<string>(activeScenario.id);

  const CARTO_KEY = 'cb1_3z8v_1_f7ca45767c182ceeb46cafc9';
  const INDIA_BOUNDS: L.LatLngBoundsLiteral = [
    [7.0, 68.0],  // Southwest corner (below Kanyakumari, west of Gujarat)
    [36.5, 97.5], // Northeast corner (Ladakh to Arunachal Pradesh)
  ];
  const INDIA_CENTER: [number, number] = [22.0, 81.0];
  const INDIA_ZOOM = 4.4;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: INDIA_CENTER,
      zoom: INDIA_ZOOM,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const basemapType = dashboardTheme === 'light' ? 'voyager' : 'dark_all';
    const tileUrl = `https://basemaps.cartocdn.com/rastertiles/${basemapType}/{z}/{x}/{y}.png?key=${CARTO_KEY}`;
    const tl = L.tileLayer(tileUrl, {
      maxZoom: 18,
      attribution: '&copy; CARTO',
    }).addTo(map);
    tileLayerRef.current = tl;

    const lg = L.layerGroup().addTo(map);
    layerGroupRef.current = lg;

    const slg = L.layerGroup().addTo(map);
    stakeholderLayerGroupRef.current = slg;

    mapInstanceRef.current = map;

    // Continuous ResizeObserver so map instantly expands to 100% full width when drawer collapses
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    // Guarantee that map sizes correctly and fits all of India zoomed-out on dashboard open
    const resizeTimer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        mapInstanceRef.current.fitBounds(INDIA_BOUNDS, { padding: [24, 24] });
      }
    }, 150);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(resizeTimer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tile layer whenever dashboardTheme changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const basemapType = dashboardTheme === 'light' ? 'voyager' : 'dark_all';
    const tileUrl = `https://basemaps.cartocdn.com/rastertiles/${basemapType}/{z}/{x}/{y}.png?key=${CARTO_KEY}`;
    const tl = L.tileLayer(tileUrl, {
      maxZoom: 18,
      attribution: '&copy; CARTO',
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = tl;
  }, [dashboardTheme]);

  // Working Camera Buttons
  const handleFlyToIndia = () => {
    setActiveCam('INDIA');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(INDIA_BOUNDS, { padding: [24, 24] });
    }
  };

  const handleFlyToStorm = () => {
    setActiveCam('STORM');
    if (mapInstanceRef.current) {
      const targetCenter = selectedCell ? [selectedCell.lat, selectedCell.lng] as [number, number] : activeScenario.center;
      mapInstanceRef.current.setView(targetCenter, 9, { animate: true });
    }
  };

  const handleToggle3D = () => {
    setIs3DMode(prev => !prev);
  };

  // Only fly to scenario if the user explicitly switches scenarios after initial load
  useEffect(() => {
    if (currentScenarioIdRef.current !== activeScenario.id) {
      currentScenarioIdRef.current = activeScenario.id;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView(activeScenario.center, activeScenario.defaultZoom, { animate: true });
        setActiveCam('STORM');
      }
    }
  }, [activeScenario.id, activeScenario.center, activeScenario.defaultZoom]);

  // STAKEHOLDER MAP OVERLAYS: Visual changes on the map when tabs are clicked!
  useEffect(() => {
    const slg = stakeholderLayerGroupRef.current;
    if (!slg) return;
    slg.clearLayers();

    const cell = selectedCell || activeScenario.cells[0];
    if (!cell) return;

    if (stakeholderMode === 'AVIATION') {
      // Draw Airport Corridors & Runway Glide Paths
      const airport = activeScenario.settlements.find(s => s.type === 'AIRPORT') || activeScenario.settlements[0];
      if (airport) {
        // Runway holding zone circle
        L.circle([airport.lat, airport.lng], {
          radius: 12000,
          color: '#f59e0b',
          weight: 1.5,
          dashArray: '6, 6',
          fillColor: '#f59e0b',
          fillOpacity: 0.08,
        }).bindTooltip(`VIDP Aerodrome Warning Zone (R=12km)`).addTo(slg);

        // ILS Approach Corridor from Storm to Runway
        L.polyline([[cell.lat, cell.lng], [airport.lat, airport.lng]], {
          color: '#ef4444',
          weight: 2,
          dashArray: '4, 8',
        }).bindTooltip('ILS Approach Intercept Line - Severe Turbulence Risk').addTo(slg);
      }
    } else if (stakeholderMode === 'RURAL_FARMER') {
      // Draw Agricultural Tehsil Buffers & Village Safety Zones
      activeScenario.settlements.forEach((s) => {
        L.circle([s.lat, s.lng], {
          radius: 5000,
          color: '#22c55e',
          weight: 1.2,
          dashArray: '4, 4',
          fillColor: '#22c55e',
          fillOpacity: 0.07,
        }).bindTooltip(`${s.name} - Panchayat Shelter Radius (5km)`).addTo(slg);
      });
    } else if (stakeholderMode === 'DISASTER_MANAGEMENT') {
      // Civil Defense Sector Warning Radius
      L.circle([cell.lat, cell.lng], {
        radius: 20000,
        color: '#dc2626',
        weight: 1,
        dashArray: '2, 4',
        fillColor: '#dc2626',
        fillOpacity: 0.04,
      }).addTo(slg);
    }
  }, [stakeholderMode, activeScenario, selectedCell]);

  // Render Dynamic GIS Layers (Cloud structure, no flat pink cutouts!)
  useEffect(() => {
    const lg = layerGroupRef.current;
    if (!lg) return;
    lg.clearLayers();

    const computeOffset = (speedKmh: number, bearingDeg: number, minutes: number) => {
      const hours = minutes / 60;
      const distanceKm = speedKmh * hours;
      const bearingRad = (bearingDeg * Math.PI) / 180;
      const dLat = (distanceKm * Math.cos(bearingRad)) / 111.0;
      const dLng = (distanceKm * Math.sin(bearingRad)) / (111.0 * Math.cos((activeScenario.center[0] * Math.PI) / 180));
      return { dLat, dLng };
    };

    // 1. REALISTIC VOLUMETRIC CLOUD-TYPE STRUCTURE (Replaces flat pink polygon!)
    if (visibleLayers.radarDbz) {
      activeScenario.cells.forEach((cell) => {
        const { dLat, dLng } = computeOffset(cell.speedKmh, cell.bearingDeg, timelineMinutes);
        const currCenter: [number, number] = [cell.lat + dLat, cell.lng + dLng];
        const isSelected = selectedCell?.id === cell.id;

        // Layer A: Outer Cloud Anvil Canopy (Translucent Cyan/Teal Halo)
        L.circle(currCenter, {
          radius: 18000,
          color: '#38bdf8',
          weight: 1,
          dashArray: '3, 6',
          fillColor: '#0284c7',
          fillOpacity: 0.14,
        }).addTo(lg);

        // Layer B: Mid-Level Convective Cloud Mass (Rain/Storm 40-50 dBZ)
        L.circle(currCenter, {
          radius: 12000,
          color: '#eab308',
          weight: 1,
          fillColor: '#f59e0b',
          fillOpacity: 0.28,
        }).addTo(lg);

        // Layer C: Inner Severe Core (Deep Convective Downdraft/Hail 55-65 dBZ - NO harsh flat pink!)
        L.circle(currCenter, {
          radius: 6500,
          color: '#dc2626',
          weight: 1.5,
          fillColor: '#b91c1c',
          fillOpacity: 0.55,
        }).on('click', () => selectCellById(cell.id)).addTo(lg);

        // Layer D: Shifting Polygon with Cloud-Style Soft Edges
        const shiftedPolygon = cell.polygon.map(([lat, lng]) => [lat + dLat, lng + dLng] as [number, number]);
        const poly = L.polygon(shiftedPolygon, {
          color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.4)',
          weight: isSelected ? 2.5 : 1,
          fillColor: '#991b1b',
          fillOpacity: 0.22,
          dashArray: timelineMinutes > 0 ? '4, 4' : undefined,
        });
        poly.on('click', () => selectCellById(cell.id));
        poly.addTo(lg);
      });
    }

    // 2. INSAT-3D Thermal IR Satellite Halo
    if (visibleLayers.satelliteTir1) {
      activeScenario.cells.forEach((cell) => {
        const { dLat, dLng } = computeOffset(cell.speedKmh, cell.bearingDeg, timelineMinutes);
        const circle = L.circle([cell.lat + dLat, cell.lng + dLng], {
          radius: 26000,
          color: '#38bdf8',
          weight: 1,
          dashArray: '4, 8',
          fillColor: '#0369a1',
          fillOpacity: 0.12,
        });
        circle.bindTooltip(`Cloud Top: ${cell.cloudTopTempK} K (${(cell.cloudTopTempK - 273.15).toFixed(1)}°C)`).addTo(lg);
      });
    }

    // 3. Real-Time Lightning Flash Blips
    if (visibleLayers.lightning && timelineMinutes <= 15) {
      activeScenario.lightning.forEach((lt) => {
        const iconHtml = `<div class="relative flex items-center justify-center">
          <span class="absolute w-4 h-4 rounded-full bg-amber-400/40 animate-ping"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-white border border-amber-400 shadow"></span>
        </div>`;
        const marker = L.marker([lt.lat, lt.lng], {
          icon: L.divIcon({ html: iconHtml, className: '', iconSize: [16, 16], iconAnchor: [8, 8] }),
        });
        marker.bindTooltip(`⚡ ${lt.type} ${lt.peakCurrentKa} kA`, { offset: [10, 0] });
        marker.addTo(lg);
      });
    }

    // 4. Uncertainty Projection Cone
    if (visibleLayers.uncertaintyCone && timelineMinutes >= 0) {
      activeScenario.cells.forEach((cell) => {
        const { dLat, dLng } = computeOffset(cell.speedKmh, cell.bearingDeg, timelineMinutes);
        const shiftedCone = cell.forecastCone.map(([lat, lng]) => [lat + dLat, lng + dLng] as [number, number]);
        L.polygon(shiftedCone, {
          color: '#f59e0b', weight: 1, dashArray: '4, 4', fillColor: '#f59e0b', fillOpacity: 0.08,
        }).addTo(lg);
      });
    }

    // 5. Storm Centroid Markers (Professional Radar Blip)
    if (visibleLayers.stormCentroids) {
      activeScenario.cells.forEach((cell) => {
        const { dLat, dLng } = computeOffset(cell.speedKmh, cell.bearingDeg, timelineMinutes);
        const currLat = cell.lat + dLat;
        const currLng = cell.lng + dLng;
        const isSelected = selectedCell?.id === cell.id;

        const isLight = dashboardTheme === 'light';
        const badgeBg = isLight ? 'bg-white text-slate-900 border-slate-300 shadow-md' : 'bg-zinc-950 text-white border-zinc-700 shadow-xl';

        const centroidHtml = `
          <div style="transform: translateY(-22px);" class="flex flex-col items-center cursor-pointer group">
            <div class="px-2.5 py-1 rounded text-xs font-sans font-bold border whitespace-nowrap transition-transform group-hover:scale-105 ${badgeBg}">
              ${cell.code} &bull; ${cell.dbzMax} dBZ
            </div>
            <div class="w-2.5 h-2.5 rounded-full bg-rose-600 border-2 border-white mt-1 shadow"></div>
          </div>
        `;

        const marker = L.marker([currLat, currLng], {
          icon: L.divIcon({ html: centroidHtml, className: '', iconSize: [120, 48], iconAnchor: [60, 40] }),
          zIndexOffset: 1000,
        });
        marker.on('click', () => selectCellById(cell.id));
        marker.addTo(lg);

        // Vector arrow
        const vEndLat = currLat + (0.12 * Math.cos((cell.bearingDeg * Math.PI) / 180));
        const vEndLng = currLng + (0.12 * Math.sin((cell.bearingDeg * Math.PI) / 180));
        L.polyline([[currLat, currLng], [vEndLat, vEndLng]], {
          color: '#38bdf8', weight: 2, dashArray: '3, 3',
        }).addTo(lg);
      });
    }

    // 6. Settlement Markers (Cleanly Staggered Pins)
    if (visibleLayers.settlementMarkers) {
      activeScenario.settlements.forEach((set, idx) => {
        const isSelected = selectedSettlement?.id === set.id;
        const remainingEta = Math.max(0, (set.activeEtaMinutes || 0) - timelineMinutes);

        const shortName = set.name.split(' ').slice(0, 2).join(' ');
        const isLight = dashboardTheme === 'light';
        const badgeBg = isLight ? 'bg-white text-slate-900 border-slate-300' : 'bg-zinc-950 text-zinc-200 border-zinc-800';

        // Alternate offset to avoid stacking!
        const yOffset = (idx % 2 === 0) ? -14 : 14;
        const xOffset = (idx % 3 === 0) ? -18 : 18;

        const html = `
          <div style="transform: translate(${xOffset}px, ${yOffset}px);" class="flex items-center space-x-1.5 cursor-pointer group">
            <div class="w-2 h-2 rounded-full bg-rose-500 border border-white shadow"></div>
            <div class="px-2 py-0.5 rounded text-[11px] font-sans border shadow whitespace-nowrap ${badgeBg} ${
              isSelected ? 'ring-2 ring-rose-500 font-bold' : ''
            }">
              <span>${shortName}</span> <span class="font-mono font-bold text-rose-500 ml-1">${remainingEta}m</span>
            </div>
          </div>
        `;

        const marker = L.marker([set.lat, set.lng], {
          icon: L.divIcon({ html, className: '', iconSize: [130, 28], iconAnchor: [10, 10] }),
          zIndexOffset: 500,
        });
        marker.on('click', () => selectSettlementById(set.id));
        marker.addTo(lg);
      });
    }
  }, [activeScenario, timelineMinutes, visibleLayers, selectedCell, selectedSettlement, dashboardTheme]);

  const isLight = dashboardTheme === 'light';

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-zinc-950">
      
      {/* 3D Map Container Viewport */}
      <div
        ref={mapContainerRef}
        className="w-full h-full z-0 transition-transform duration-500 ease-out"
        style={is3DMode ? {
          transform: 'perspective(900px) rotateX(36deg) scale(1.12) translateY(-4%)',
          transformOrigin: '50% 85%',
        } : {
          transform: 'none',
        }}
      />

      {/* 3D Indicator Banner (Appears when 3D is active) */}
      {is3DMode && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-full bg-rose-950/90 border border-rose-600 text-rose-200 text-xs font-sans font-bold shadow-2xl flex items-center space-x-2 animate-in fade-in">
          <Box className="w-3.5 h-3.5 animate-spin" />
          <span>3D TACTICAL RADAR VIEW ACTIVE (36° OBLIQUE)</span>
        </div>
      )}

      {/* 1. Layers Toggle Button & Flyout Menu (Top-Right) */}
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={() => setIsLayersOpen(!isLayersOpen)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-sans font-semibold shadow-lg transition-colors ${
            isLight
              ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
              : 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-zinc-400" />
          <span>Layers & Theme</span>
        </button>

        {isLayersOpen && (
          <div className={`absolute right-0 top-full mt-1.5 w-52 rounded-xl border p-3 shadow-2xl space-y-3 animate-in fade-in text-xs font-sans ${
            isLight
              ? 'bg-white border-slate-300 text-slate-800'
              : 'bg-zinc-950 border-zinc-800 text-zinc-200'
          }`}>
            <div className="font-bold pb-1 border-b border-zinc-700/40">
              Active Radar Layers
            </div>
            <div className="space-y-1.5 text-xs">
              {([
                ['radarDbz', 'Convective Cloud Core'],
                ['satelliteTir1', 'Thermal IR (INSAT)'],
                ['lightning', 'Lightning Pulses'],
                ['stormCentroids', 'Storm Centroids'],
                ['uncertaintyCone', 'Forecast Cone'],
                ['settlementMarkers', 'Settlement Pins'],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center space-x-2 cursor-pointer text-zinc-400 hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={visibleLayers[key]}
                    onChange={() => toggleLayer(key)}
                    className="rounded bg-zinc-800 border-zinc-700 text-rose-600 focus:ring-0"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            {/* Complete Global Theme Switcher */}
            <div className="pt-2 border-t border-zinc-700/40">
              <div className="text-[11px] text-zinc-400 mb-1.5">Dashboard Theme</div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setDashboardTheme('dark')}
                  className={`flex-1 flex items-center justify-center space-x-1 py-1.5 rounded text-xs font-bold transition-colors ${
                    !isLight ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  <Moon className="w-3 h-3" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => setDashboardTheme('light')}
                  className={`flex-1 flex items-center justify-center space-x-1 py-1.5 rounded text-xs font-bold transition-colors ${
                    isLight ? 'bg-slate-200 text-slate-900 font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3 h-3" />
                  <span>Light</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Floating Map Tools (Real-time functioning All-India, Storm Focus, 3D buttons) */}
      <div className="absolute bottom-20 right-3 z-20 flex flex-col items-end gap-1.5 pointer-events-auto">
        <div className={`flex flex-col rounded-xl border shadow-xl p-1 gap-1 text-xs font-sans ${
          isLight
            ? 'bg-white/95 border-slate-300 text-slate-800'
            : 'bg-zinc-950/95 border-zinc-800 text-zinc-200'
        }`}>
          
          {/* Button 1: All-India */}
          <button
            onClick={handleFlyToIndia}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded transition-all text-left ${
              activeCam === 'INDIA'
                ? (isLight ? 'bg-slate-200 font-bold' : 'bg-zinc-800 font-bold text-white')
                : 'hover:bg-zinc-800/40 text-zinc-400'
            }`}
            title="Overview of India (National Scale)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">All-India</span>
          </button>

          {/* Button 2: Storm Focus */}
          <button
            onClick={handleFlyToStorm}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded transition-all text-left ${
              activeCam === 'STORM'
                ? (isLight ? 'bg-slate-200 font-bold' : 'bg-zinc-800 font-bold text-white')
                : 'hover:bg-zinc-800/40 text-zinc-400'
            }`}
            title="Focus On Active Storm Cell"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Storm Focus</span>
          </button>

          <div className="h-px bg-zinc-700/30 w-full" />

          {/* Button 3: 3D Perspective Toggle */}
          <button
            onClick={handleToggle3D}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded transition-all text-left ${
              is3DMode
                ? 'bg-rose-600 text-white font-bold shadow'
                : 'hover:bg-zinc-800/40 text-zinc-400'
            }`}
            title="Toggle 3D Perspective View"
          >
            <Box className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{is3DMode ? '3D Active' : '3D View'}</span>
          </button>

        </div>
      </div>

      {/* 3. dBZ Color Scale (Bottom-Left) */}
      <div className={`absolute bottom-4 left-4 z-20 px-3 py-2 rounded-xl shadow-xl backdrop-blur-md font-sans text-[10px] border ${
        isLight
          ? 'bg-white/95 border-slate-300 text-slate-800'
          : 'bg-zinc-950/95 border-zinc-800 text-zinc-300'
      }`}>
        <div className="mb-1 flex items-center justify-between font-semibold">
          <span>Reflectivity (dBZ)</span>
          <span className="font-mono text-zinc-400">IMD Radar</span>
        </div>
        <div className="flex h-2 w-48 rounded overflow-hidden border border-zinc-700/40">
          {['#00e4ff','#00a3ff','#00de36','#009e19','#ffff00','#ffb000','#ff0000','#c00000','#ff00ff','#990099','#ffffff'].map((c, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="flex justify-between font-mono text-[9px] text-zinc-400 mt-0.5">
          <span>10</span><span>35(CI)</span><span>50(Hail)</span><span>70+</span>
        </div>
      </div>

    </div>
  );
};
