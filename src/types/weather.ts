export type HazardSeverity = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

export interface StormCell {
  id: string;
  code: string;
  name: string;
  lat: number;
  lng: number;
  speedKmh: number;
  bearingDeg: number;
  directionLabel: string;
  dbzMax: number;
  echoTopKm: number;
  vilKgM2: number;
  meshMm: number;
  downburstProbPercent: number;
  gustSpeedKmh: number;
  rainRateMmHr: number;
  lightningStrikesPerMin: number;
  ciStatus: 'DETECTED' | 'DEVELOPING' | 'MATURE' | 'DECAYING';
  ciCoolingRateK15m: number;
  cloudTopTempK: number;
  freezingLevelM: number;
  severity: HazardSeverity;
  primaryHazard: 'HAIL' | 'DOWNBURST' | 'CLOUDBURST' | 'LIGHTNING';
  polygon: [number, number][];
  pastPath: [number, number][];
  forecastCone: [number, number][];
  etaTargets: {
    settlementId: string;
    settlementName: string;
    distanceKm: number;
    etaMinutes: number;
  }[];
}

export interface Settlement {
  id: string;
  name: string;
  type: 'DISTRICT_HQ' | 'TEHSIL' | 'AIRPORT' | 'VILLAGE';
  district: string;
  state: string;
  lat: number;
  lng: number;
  population?: number;
  elevationMeters?: number;
  alertTier: HazardSeverity;
  threatDetails?: string;
  activeEtaMinutes?: number;
  threatCellId?: string;
}

export interface LightningStrike {
  id: string;
  lat: number;
  lng: number;
  timestampAgoSec: number;
  peakCurrentKa: number;
  polarity?: '+' | '-';
  type: 'CG' | 'IC'; // Cloud-to-Ground or Intra-Cloud
}

export interface CIAlert {
  id: string;
  region: string;
  gridCoordinate: string;
  coolingRateK15m: number;
  brightnessTempK: number;
  radarInitiationDbz: number;
  lightningJumpSigma: number;
  confidencePercent: number;
  predictedImpactWindowMin: string;
  status: 'SURVEILLANCE' | 'TRIGGERED' | 'CONFIRMED';
}

export interface WeatherScenario {
  id: string;
  code: string;
  title: string;
  subTitle: string;
  region: string;
  historicalDate: string;
  eventDescription: string;
  radarStationName: string;
  center: [number, number];
  defaultZoom: number;
  cells: StormCell[];
  settlements: Settlement[];
  lightning: LightningStrike[];
  ciAlerts: CIAlert[];
  radarSummary: {
    maxReflectivityDbz: number;
    maxEchoTopKm: number;
    peakGustKmh: number;
    peakRainRateMmHr: number;
    activeCellsCount: number;
    totalLightningStrikes: number;
  };
}

export type StakeholderViewMode = 'DISASTER_MANAGEMENT' | 'AVIATION' | 'RURAL_FARMER';
export type RegionalLanguage = 'EN' | 'HI' | 'BN' | 'PA';
