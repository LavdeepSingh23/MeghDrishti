import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { AlertTriangle, X, CheckCircle, Send, Smartphone } from 'lucide-react';

export const AlertDispatcherModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activeScenario, selectedCell, language } = useWeather();
  const [tab, setTab] = useState<'CAP_XML' | 'SMS_BROADCAST' | 'WHATSAPP'>('CAP_XML');
  const [isTransmitted, setIsTransmitted] = useState(false);

  if (!isOpen) return null;

  const cell = selectedCell || activeScenario.cells[0];
  const target = cell?.etaTargets[0] || { settlementName: 'National Capital Region', etaMinutes: 18 };

  const capXml = `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>IMD-NOWCAST-${cell?.code}-${Date.now()}</identifier>
  <sender>imd.nowcast.ops@imd.gov.in</sender>
  <sent>${new Date().toISOString()}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Met</category>
    <event>Severe Thunderstorm & Downburst (Microburst)</event>
    <urgency>Immediate</urgency>
    <severity>Extreme</severity>
    <certainty>Observed</certainty>
    <eventCode>
      <valueName>IMD-CODE</valueName>
      <value>TS-DOWNBURST-HAIL</value>
    </eventCode>
    <expires>${new Date(Date.now() + 3600000).toISOString()}</expires>
    <headline>URGENT: Severe Convective Storm approaching ${target.settlementName} in ${target.etaMinutes} minutes</headline>
    <description>IMD Doppler Radar detected convective cell ${cell?.code} with peak reflectivity ${cell?.dbzMax} dBZ, hail index MESH ${cell?.meshMm}mm, and destructive wind gusts up to ${cell?.gustSpeedKmh} km/h.</description>
    <instruction>Take immediate shelter indoors away from windows. Disconnect agricultural pumps. Aircraft operations suspend approach.</instruction>
    <area>
      <areaDesc>${activeScenario.region} - ${target.settlementName}</areaDesc>
      <circle>${cell?.lat},${cell?.lng},18.0</circle>
    </area>
  </info>
</alert>`;

  const smsText = `[IMD EMERGENCY ALERT]: Severe Thunderstorm approaching ${target.settlementName} in ~${target.etaMinutes} mins. Hailstorm & destructive winds (90+ km/h) expected. Stay indoors immediately. Do NOT shelter under trees. - NDMA / IMD MeghDrishti`;
  const smsHindi = `[मौसम आपातकालीन चेतावनी]: ${target.settlementName} में अगले ~${target.etaMinutes} मिनट में भीषण आँधी, ओलावृष्टि व आकाशीय बिजली का ख़तरा। तुरंत पक्के मकान में शरण लें। पेड़ों के नीचे खड़े न हों। - राष्ट्रीय आपदा प्रबंधन (NDMA)`;

  const handleTransmit = () => {
    setIsTransmitted(true);
    setTimeout(() => {
      setIsTransmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-storm-950 border border-storm-750 rounded shadow-2xl overflow-hidden font-mono text-xs flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 bg-storm-900 border-b border-storm-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Alert dispatch (formatted to match CAP conventions)</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white hover:bg-storm-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-storm-800 bg-storm-950 px-4 pt-2 space-x-2">
          <button
            onClick={() => setTab('CAP_XML')}
            className={`pb-2 px-3 border-b-2 font-bold transition-colors ${
              tab === 'CAP_XML' ? 'border-sky-400 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            CAP XML PAYLOAD
          </button>
          <button
            onClick={() => setTab('SMS_BROADCAST')}
            className={`pb-2 px-3 border-b-2 font-bold transition-colors ${
              tab === 'SMS_BROADCAST' ? 'border-sky-400 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            CELL BROADCAST (SMS)
          </button>
          <button
            onClick={() => setTab('WHATSAPP')}
            className={`pb-2 px-3 border-b-2 font-bold transition-colors ${
              tab === 'WHATSAPP' ? 'border-sky-400 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            WHATSAPP DISPATCH
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 bg-storm-950">
          {tab === 'CAP_XML' && (
            <div>
              <div className="text-[11px] text-slate-400 mb-2">
                Sample payload formatted to match the CAP schema structure:
              </div>
              <pre className="p-3 bg-storm-900 border border-storm-800 rounded text-emerald-400 text-[11px] overflow-x-auto leading-relaxed">
                {capXml}
              </pre>
            </div>
          )}

          {tab === 'SMS_BROADCAST' && (
            <div className="space-y-4">
              <div className="text-[11px] text-slate-400">
                Geo-Targeted GSM Cell Broadcast (Cellular Tower Push within 18 km radius):
              </div>
              
              <div className="p-3 bg-storm-900 border border-storm-800 rounded">
                <div className="text-[10px] text-slate-400 mb-1">ENGLISH TEMPLATE:</div>
                <div className="text-slate-100 font-sans text-xs leading-relaxed">{smsText}</div>
              </div>

              <div className="p-3 bg-storm-900 border border-storm-800 rounded">
                <div className="text-[10px] text-slate-400 mb-1">REGIONAL VERNACULAR (HINDI):</div>
                <div className="text-slate-100 font-sans text-xs leading-relaxed">{smsHindi}</div>
              </div>

              <div className="p-2.5 rounded bg-storm-900/60 border border-storm-850 text-[11px] text-sky-400 flex items-center space-x-2">
                <Smartphone className="w-4 h-4 shrink-0" />
                <span>Payload size: 142 chars. Compatible with legacy 2G feature phones.</span>
              </div>
            </div>
          )}

          {tab === 'WHATSAPP' && (
            <div className="space-y-3">
              <div className="text-[11px] text-slate-400">
                WhatsApp Business API Disaster Webhook Payload:
              </div>
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded font-sans text-xs text-slate-200">
                <strong className="text-emerald-400 block mb-1">IMD MeghDrishti Verified Alert Channel</strong>
                🔴 <strong>IMMINENT SEVERE STORM WARNING</strong><br/>
                Location: {target.settlementName}<br/>
                Estimated Impact Time: in {target.etaMinutes} minutes<br/>
                Expected Hazards: Hail (35mm), Wind Gusts (90 km/h), Lightning<br/>
                Stay in a safe shelter immediately. Do not stay outdoors.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-storm-900 border-t border-storm-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Simulated dispatch (prototype demonstration)
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-storm-800 hover:bg-storm-750 text-slate-300 font-semibold"
            >
              CANCEL
            </button>

            <button
              onClick={handleTransmit}
              disabled={isTransmitted}
              className="px-5 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center space-x-2 transition-all shadow"
            >
              {isTransmitted ? (
                <>
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>TRANSMITTED TO NDMA</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>DISPATCH BROADCAST NOW</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
