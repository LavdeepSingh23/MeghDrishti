import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { RegionalLanguage } from '../../types/weather';
import { Users, X, AlertTriangle, ShieldCheck, Zap, Wind, CloudRain, Disc } from 'lucide-react';

interface LanguageContent {
  title: string;
  subtitle: string;
  nearestSettlement: string;
  countdownLabel: string;
  hailTitle: string;
  hailAdvice: string;
  lightningTitle: string;
  lightningAdvice: string;
  windTitle: string;
  windAdvice: string;
  rainTitle: string;
  rainAdvice: string;
  lowBandwidthNote: string;
}

const TRANSLATIONS: Record<RegionalLanguage, LanguageContent> = {
  EN: {
    title: 'FARMER EMERGENCY WEATHER BULLETIN',
    subtitle: 'High-contrast low-bandwidth transmission for rural villages & tehsils',
    nearestSettlement: 'NEAREST VILLAGE / TEHSIL:',
    countdownLabel: 'STORM ARRIVAL COUNTDOWN:',
    hailTitle: 'HAIL PROTECTION (MESH 35mm)',
    hailAdvice: 'Cover harvested grains and nurseries with tarpaulins. Keep livestock under sturdy concrete shelter.',
    lightningTitle: 'LIGHTNING SAFETY (SEVERE RISK)',
    lightningAdvice: 'Never shelter under lone trees or tin sheds. Disconnect agricultural solar pumps and stay away from metal fences.',
    windTitle: 'STRONG WIND / SQUALL (90+ km/h)',
    windAdvice: 'Tie down loose tin sheets. Avoid driving tractors or two-wheelers through open fields.',
    rainTitle: 'TORRENTIAL DOWNPOUR / CLOUDBURST',
    rainAdvice: 'Immediately vacate low-lying stream beds and culverts. Move to elevated ground.',
    lowBandwidthNote: 'Optimized for 2G / low-connectivity cellular nodes. Auto-cached locally.',
  },
  HI: {
    title: 'किसान आपातकालीन मौसम बुलेटिन',
    subtitle: 'ग्रामीण क्षेत्रों के लिए कम इंटरनेट वाला तेज़ चेतावनी संदेश',
    nearestSettlement: 'निकटतम गाँव / तहसील:',
    countdownLabel: 'तूफ़ान पहुँचने का समय (उलटी गिनती):',
    hailTitle: 'ओलावृष्टि से सुरक्षा (ओले 35 मिमी)',
    hailAdvice: 'कटी हुई फ़सलों और नर्सरी को तिरपाल से ढकें। मवेशियों को पक्के और सुरक्षित बाड़े में ले जाएं।',
    lightningTitle: 'आकाशीय बिजली का ख़तरा (अत्यधिक सतर्कता)',
    lightningAdvice: 'अकेले पेड़ों या टिन शेड के नीचे कभी खड़े न हों। सोलर पंप का कनेक्शन तुरंत काटें और लोहे के बाड़ों से दूर रहें।',
    windTitle: 'भीषण आँधी / तूफ़ानी हवाएं (90+ किमी/घंटा)',
    windAdvice: 'कच्चे छप्पर और टिन की चादरों को मज़बूती से बाँधें। खुले खेतों में ट्रैक्टर या बाइक न चलाएं।',
    rainTitle: 'अत्यधिक भारी वर्षा / बादल फटना',
    rainAdvice: 'नदी-नालों और निचले इलाक़ों को तुरंत ख़ाली करें। ऊँचे स्थानों पर शरण लें।',
    lowBandwidthNote: 'यह संदेश 2G नेटवर्क और कम स्पीड वाले मोबाइल पर भी तुरंत खुलता है।',
  },
  BN: {
    title: 'কৃষকদের জন্য জরুরি আবহাওয়া বুলেটিন',
    subtitle: 'গ্রামীণ অঞ্চলের জন্য দ্রুত সতর্কবার্তা (কম ইন্টারনেট সংযোগের জন্য উপযুক্ত)',
    nearestSettlement: 'নিকটবর্তী গ্রাম / মহকুমা:',
    countdownLabel: 'ঝড় পৌঁছানোর সময় (কাউন্টডাউন):',
    hailTitle: 'শিলাবৃষ্টি থেকে সুরক্ষা (শিলা ৩৫ মিমি)',
    hailAdvice: 'তোলা ফসল ও বীজতলা ত্রিপল দিয়ে ঢেকে রাখুন। গবাদি পশুকে পাকা আশ্রয়ে নিরাপদে রাখুন।',
    lightningTitle: 'বজ্রপাতের সতর্কতা (চরম বিপদ)',
    lightningAdvice: 'কোনোভাবেই ফাঁকা মাঠের বড় গাছের নিচে বা টিনের চালার নিচে দাঁড়াবেন না। সোলার পাম্প বন্ধ রাখুন।',
    windTitle: 'কালবৈশাখীর তীব্র ঝড় (৯০+ কিমি/ঘণ্টা)',
    windAdvice: 'ঘরের চাল ও টিন শক্ত করে বাঁধুন। খোলা মাঠে চলাচল অবিলম্বে বন্ধ করুন।',
    rainTitle: 'অতি ভারী বৃষ্টিপাত / মেঘভাঙা বৃষ্টি',
    rainAdvice: 'নদী তীরবর্তী ও নীচু এলাকা অবিলম্বে খালি করে উঁচু জায়গায় চলে যান।',
    lowBandwidthNote: '২জি ইন্টারনেটেও দ্রুত লোড হওয়ার সুবিধাযুক্ত।',
  },
  PA: {
    title: 'ਕਿਸਾਨ ਸੰਕਟਕਾਲੀ ਮੌਸਮ ਬੁਲੇਟਿਨ',
    subtitle: 'ਪੇਂਡੂ ਖੇਤਰਾਂ ਲਈ ਘੱਟ ਇੰਟਰਨੈਟ ਤੇ ਤੁਰੰਤ ਚੇਤਾਵਨੀ ਸੁਨੇਹਾ',
    nearestSettlement: 'ਨੇੜਲਾ ਪਿੰਡ / ਤਹਿਸੀਲ:',
    countdownLabel: 'ਤੂਫ਼ਾਨ ਆਉਣ ਦਾ ਸਮਾਂ:',
    hailTitle: 'ਗੜੇਮਾਰੀ ਤੋਂ ਬਚਾਅ (ਗੜੇ 35 ਮਿਲੀਮੀਟਰ)',
    hailAdvice: 'ਵੱਢੀ ਹੋਈ ਫ਼ਸਲ ਨੂੰ ਤਰਪਾਲ ਨਾਲ ਢੱਕੋ। ਪਸ਼ੂਆਂ ਨੂੰ ਪੱਕੇ ਸ਼ੈੱਡ ਵਿੱਚ ਬੰਨ੍ਹੋ।',
    lightningTitle: 'ਅਸਮਾਨੀ ਬਿਜਲੀ ਦਾ ਖ਼ਤਰਾ',
    lightningAdvice: 'ਇਕੱਲੇ ਦਰੱਖਤ ਹੇਠਾਂ ਬਿਲਕੁਲ ਨਾ ਖੜ੍ਹੋ। ਖੇਤਾਂ ਵਿਚਲੇ ਸੋਲਰ ਪੰਪ ਤੁਰੰਤ ਬੰਦ ਕਰੋ।',
    windTitle: 'ਤੇਜ਼ ਝੱਖੜ / ਤੂਫ਼ਾਨ (90+ ਕਿਲੋਮੀਟਰ/ਘੰਟਾ)',
    windAdvice: 'ਕੱਚੀਆਂ ਛੱਤਾਂ ਨੂੰ ਪੱਕਾ ਬੰਨ੍ਹੋ। ਖੁੱਲ੍ਹੇ ਖੇਤਾਂ ਵਿੱਚ ਜਾਣ ਤੋਂ ਪਰਹੇਜ਼ ਕਰੋ।',
    rainTitle: 'ਬਹੁਤ ਭਾਰੀ ਮੀਂਹ ਦੀ ਚਿਤਾਵਨੀ',
    rainAdvice: 'ਨੀਵੇਂ ਖੇਤਰਾਂ ਅਤੇ ਨਹਿਰਾਂ-ਨਾਲਿਆਂ ਤੋਂ ਦੂਰ ਉੱਚੀਆਂ ਥਾਵਾਂ ਤੇ ਜਾਓ।',
    lowBandwidthNote: 'ਇਹ ਪੰਨਾ 2G ਨੈੱਟਵਰਕ ਤੇ ਵੀ ਆਸਾਨੀ ਨਾਲ ਚੱਲਦਾ ਹੈ।',
  },
};

export const RuralFarmerOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { activeScenario, selectedCell, language, setLanguage } = useWeather();
  const t = TRANSLATIONS[language] || TRANSLATIONS.EN;
  const village = activeScenario.settlements.find(s => s.type === 'VILLAGE' || s.type === 'TEHSIL') || activeScenario.settlements[0];
  const cell = selectedCell || activeScenario.cells[0];

  return (
    <div className="absolute inset-y-0 left-0 w-full sm:w-[500px] bg-storm-950 border-r border-storm-750 z-25 p-5 font-mono text-xs overflow-y-auto">
      
      {/* Top Bar with Language Selector */}
      <div className="flex items-center justify-between pb-3 border-b border-storm-800">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-100 text-sm">{t.title}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-storm-900 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Language Buttons */}
      <div className="mt-3 flex items-center space-x-2">
        {(['EN', 'HI', 'BN', 'PA'] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-3 py-1 rounded text-xs font-bold border transition-colors ${
              language === lang
                ? 'bg-emerald-600 border-emerald-500 text-slate-950'
                : 'bg-storm-900 border-storm-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            {lang === 'EN' ? 'English' : lang === 'HI' ? 'हिन्दी' : lang === 'BN' ? 'বাংলা' : 'ਪੰਜਾਬੀ'}
          </button>
        ))}
      </div>

      {/* Urgent Countdown Card */}
      <div className="mt-4 p-4 rounded bg-rose-950/80 border-2 border-rose-600 text-rose-100">
        <div className="flex items-center justify-between text-xs font-bold">
          <span>{t.nearestSettlement}</span>
          <span className="text-white text-sm underline">{village.name}</span>
        </div>

        <div className="mt-3 pt-3 border-t border-rose-800/80">
          <div className="text-[11px] uppercase tracking-wider text-rose-300">
            {t.countdownLabel}
          </div>
          <div className="text-3xl font-extrabold text-white mt-1">
            {village.activeEtaMinutes || 18} MINUTES
          </div>
        </div>
      </div>

      {/* Actionable Directives */}
      <div className="mt-5 space-y-3 font-sans">
        
        {/* Hail */}
        <div className="p-3.5 rounded bg-storm-900 border border-cyan-800/80">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono font-bold text-xs mb-1">
            <Disc className="w-4 h-4" />
            <span>{t.hailTitle}</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {t.hailAdvice}
          </p>
        </div>

        {/* Lightning */}
        <div className="p-3.5 rounded bg-storm-900 border border-amber-800/80">
          <div className="flex items-center space-x-2 text-amber-400 font-mono font-bold text-xs mb-1">
            <Zap className="w-4 h-4" />
            <span>{t.lightningTitle}</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {t.lightningAdvice}
          </p>
        </div>

        {/* Wind */}
        <div className="p-3.5 rounded bg-storm-900 border border-sky-800/80">
          <div className="flex items-center space-x-2 text-sky-400 font-mono font-bold text-xs mb-1">
            <Wind className="w-4 h-4" />
            <span>{t.windTitle}</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {t.windAdvice}
          </p>
        </div>

        {/* Rain */}
        <div className="p-3.5 rounded bg-storm-900 border border-rose-800/80">
          <div className="flex items-center space-x-2 text-rose-400 font-mono font-bold text-xs mb-1">
            <CloudRain className="w-4 h-4" />
            <span>{t.rainTitle}</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {t.rainAdvice}
          </p>
        </div>

      </div>

      {/* Low-Bandwidth Mode Indicator */}
      <div className="mt-5 p-2.5 rounded bg-storm-900/60 border border-storm-850 text-[11px] font-mono text-emerald-400 flex items-center space-x-2">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span>{t.lowBandwidthNote}</span>
      </div>

    </div>
  );
};
