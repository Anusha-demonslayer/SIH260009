// Core domain types for Manganex AI Intelligence Platform

export interface Mine {
  id: string;
  name: string;
  state: string;
  district: string;
  type: 'Open Pit' | 'Underground' | 'Mixed';
  coordinates: [number, number]; // [lat, lng]
  bounds: [[number, number], [number, number]]; // bounding box
  geologicalFormation: string;
  primaryOreType: string;
  averageMnGrade: number; // in %
  dailyTargetTonnes: number;
  activeWorkforce: number;
  operationalStatus: 'Active' | 'Derated' | 'Maintenance' | 'Rain Delayed';
  summary: string;
}

export interface ExplorationTarget {
  id: string;
  mineId: string;
  name: string;
  coordinates: [number, number];
  polygon?: [number, number][];
  prospectivityScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  estimatedResourcePotentialMt: number; // Million tonnes
  expectedGradeRange: string; // e.g. "36% - 44% Mn"
  drillingPriority: 'Tier 1 - Immediate' | 'Tier 2 - High' | 'Tier 3 - Secondary' | 'Low Priority';
  validationStatus: 'AI Identified' | 'Remote Sensing Reviewed' | 'Geological Validated' | 'Drilling Planned' | 'Assay Verified';
  spectralFeatures: {
    swirAnomalyScore: number;
    ironOxideRatio: number;
    clayAlterationRatio: number;
    ferrousMineralIndex: number;
    ndviCover: number;
  };
  radarFeatures: {
    vvBackscatter: number;
    vhBackscatter: number;
    vvVhRatio: number;
    surfaceRoughness: number;
  };
  terrainFeatures: {
    elevationMeters: number;
    slopeDegrees: number;
    topographicPositionIndex: number;
    drainageProximityMeters: number;
  };
  geologicalFeatures: {
    lithologyMatch: string;
    formation: string;
    faultProximityMeters: number;
    historicalOccurrenceDistanceKm: number;
  };
  shapContributions: {
    feature: string;
    impactPercentage: number;
    isPositive: boolean;
    description: string;
  }[];
  aiEvidenceTrail: {
    step: string;
    evidence: string;
    confidenceDelta: string;
    status: 'Verified' | 'Inferred' | 'Requires Validation';
  }[];
  evidenceHash: string; // SHA-256
  createdAt: string;
}

export interface DrillHole {
  id: string;
  mineId: string;
  code: string;
  coordinates: [number, number];
  elevationMeters: number;
  totalDepthMeters: number;
  interceptDepthFromMeters: number;
  interceptDepthToMeters: number;
  mnGradePercentage: number;
  fePercentage: number;
  phosphorusPercentage: number;
  silicaPercentage: number;
  lithology: string;
  assayDate: string;
  verifiedBy: string;
}

export interface ReserveBlock {
  id: string;
  mineId: string;
  blockName: string;
  bounds: [number, number][];
  depthMeters: number;
  volumeM3: number;
  estimatedTonnageMt: number;
  estimatedGradeMn: number;
  confidenceCategory: 'HIGH CONFIDENCE' | 'MEDIUM CONFIDENCE' | 'LOW CONFIDENCE';
  evidenceLevel: 'Drilling & Assay Confirmed' | 'Geostatistical Kriging / IDW' | 'Geological Extrapolation (Requires Validation)';
  requiresGroundValidation: boolean;
  krigeVariance: number;
}

export interface ProductionForecastDay {
  date: string;
  targetTonnes: number;
  actualTonnes?: number;
  predictedTonnes: number;
  confidenceLowerTonnes: number;
  confidenceUpperTonnes: number;
  shortfallRiskPercentage: number;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  topCauses: {
    cause: string;
    contributionPct: number;
  }[];
}

export interface EquipmentAsset {
  id: string;
  code: string;
  mineId: string;
  category: 'Excavator' | 'Dumper' | 'Drill' | 'Loader' | 'Crusher' | 'Conveyor' | 'Dozer';
  model: string;
  location: string;
  coordinates: [number, number];
  availabilityPct: number;
  utilizationPct: number;
  downtimeHoursLast30d: number;
  mtbfHours: number; // Mean time between failures
  mttrHours: number; // Mean time to repair
  failureRiskPct: number;
  riskHorizonHours: number;
  expectedDowntimeHours: number;
  telemetry: {
    engineTempC: number;
    hydraulicPressurePsi: number;
    vibrationMmSec: number;
    fuelLevelPct: number;
    operatingHours: number;
  };
  likelyFailureMode: string;
  maintenanceStatus: 'Optimal' | 'Inspection Due' | 'Urgent Maintenance' | 'In Repair';
}

export interface WeatherObservation {
  date: string;
  temperatureC: number;
  rainfallMm: number;
  soilMoisturePct: number;
  landSurfaceTempC: number;
  cloudCoverPct: number;
  windSpeedKmh: number;
  haulRoadCondition: 'Dry - Optimum' | 'Damp - 10% Derated' | 'Slick - 25% Derated' | 'Flooded - Operations Suspended';
  equipmentDeratingFactor: number; // 0.0 to 1.0 (multiplier for production)
}

export interface SatelliteScene {
  id: string;
  sensor: 'Sentinel-2 Multispectral' | 'Sentinel-1 SAR' | 'Landsat-8/9 OLI' | 'SRTM DEM 30m' | 'Bhuvan Cartosat-1';
  acquisitionDate: string;
  cloudCoverPct: number;
  resolutionMeters: number;
  coverageAreaKm2: number;
  bandsAvailable: string[];
  processingStatus: 'Level-2A Surface Reflectance Calibrated' | 'GRD Radar Calibrated' | 'DEM Ortho-rectified';
  spectralIndicesComputed: string[];
  thumbnailUrl?: string;
}

export interface SimulationParams {
  mineId: string;
  equipmentAvailabilityPct: number;
  rainfallIntensityMm: number;
  blastingDelayDays: number;
  activeExcavators: number;
  activeDumpers: number;
  shiftHoursPerDay: number;
  maintenanceDelayHours: number;
  feedGradeMnPct: number;
  miningRateTonnesPerHr: number;
}

export interface SimulationResult {
  baselineProductionTonnes: number;
  simulatedProductionTonnes: number;
  baselineShortfallRiskPct: number;
  simulatedShortfallRiskPct: number;
  dailyRevenueImpactInrLakhs: number;
  equipmentUtilizationPct: number;
  oreHaulageDeficitTonnes: number;
  carbonEmissionVarianceTons: number;
  summary: string;
}

export interface ActionRecommendation {
  id: string;
  problem: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  evidence: string[];
  recommendedAction: string;
  expectedImpact: string;
  confidencePct: number;
  tradeOff: string;
  affectedAssets: string[];
  status: 'Pending Review' | 'Approved' | 'Executed';
}

export interface EvidenceRecord {
  id: string;
  timestamp: string;
  predictionType: 'Mineral Prospectivity' | 'Production Shortfall' | 'Equipment Anomaly' | 'Resource Estimation';
  targetEntityId: string;
  modelVersion: string;
  inputDatasets: string[];
  featureSnapshot: Record<string, string | number>;
  predictedValue: string;
  confidenceScore: number;
  evidenceHash: string;
  analystSignOff: string;
  validationRequiredNote: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  sourceReferences?: {
    title: string;
    type: 'prospectivity' | 'production' | 'equipment' | 'evidence';
    targetId: string;
  }[];
  quickSuggestions?: string[];
}
