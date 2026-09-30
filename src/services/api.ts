import {
  Mine,
  ExplorationTarget,
  DrillHole,
  ReserveBlock,
  ProductionForecastDay,
  EquipmentAsset,
  WeatherObservation,
  SatelliteScene,
  SimulationParams,
  SimulationResult,
  ActionRecommendation,
  EvidenceRecord,
} from '../types/mining';

const API_BASE = '/api';

export async function fetchHealth(): Promise<any> {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function loginUser(email: string, password: string): Promise<any> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function fetchMines(): Promise<{ success: boolean; data: Mine[] }> {
  const res = await fetch(`${API_BASE}/mines`);
  return res.json();
}

export async function fetchExplorationTargets(mineId?: string): Promise<{ success: boolean; data: ExplorationTarget[] }> {
  const url = mineId ? `${API_BASE}/exploration/zones?mineId=${mineId}` : `${API_BASE}/exploration/zones`;
  const res = await fetch(url);
  return res.json();
}

export async function runProspectivityPrediction(payload: {
  mineId: string;
  targetName: string;
  coordinates: [number, number];
  spectralWeight: number;
  radarWeight: number;
  terrainWeight: number;
  geologyWeight: number;
}): Promise<{ success: boolean; data: ExplorationTarget }> {
  const res = await fetch(`${API_BASE}/exploration/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function fetchProspectivityMap(mineId?: string): Promise<{
  success: boolean;
  targets: ExplorationTarget[];
  drillHoles: DrillHole[];
  reserveBlocks: ReserveBlock[];
}> {
  const url = mineId ? `${API_BASE}/prospectivity/map?mineId=${mineId}` : `${API_BASE}/prospectivity/map`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchReserves(mineId?: string): Promise<{
  success: boolean;
  summary: any;
  reserveBlocks: ReserveBlock[];
  drillHoles: DrillHole[];
}> {
  const url = mineId ? `${API_BASE}/reserves?mineId=${mineId}` : `${API_BASE}/reserves`;
  const res = await fetch(url);
  return res.json();
}

export async function runIdwReserveEstimate(payload: {
  mineId: string;
  power: number;
  searchRadiusKm: number;
  gridResolution: number;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/reserves/estimate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function fetchProductionHistory(mineId: string, days = 30): Promise<{ success: boolean; data: any[] }> {
  const res = await fetch(`${API_BASE}/production/history?mineId=${mineId}&days=${days}`);
  return res.json();
}

export async function fetchProductionForecast(payload: {
  mineId: string;
  forecastHorizonDays: number;
  expectedRainfallFactor?: number;
  equipmentAvailabilityOverride?: number;
}): Promise<{
  success: boolean;
  dailyTargetTonnes: number;
  model: string;
  forecast: ProductionForecastDay[];
}> {
  const res = await fetch(`${API_BASE}/production/forecast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function fetchShortfallRisk(mineId?: string): Promise<{
  success: boolean;
  radarDays: any[];
  currentCriticalAlert: string;
}> {
  const url = mineId ? `${API_BASE}/shortfall/risk?mineId=${mineId}` : `${API_BASE}/shortfall/risk`;
  const res = await fetch(url);
  return res.json();
}

export async function explainShortfall(mineId: string, date: string): Promise<any> {
  const res = await fetch(`${API_BASE}/shortfall/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mineId, date }),
  });
  return res.json();
}

export async function fetchEquipment(mineId?: string, category?: string): Promise<{
  success: boolean;
  fleetHealthSummary: any;
  data: EquipmentAsset[];
}> {
  const params = new URLSearchParams();
  if (mineId) params.append('mineId', mineId);
  if (category) params.append('category', category);
  const res = await fetch(`${API_BASE}/equipment?${params.toString()}`);
  return res.json();
}

export async function predictEquipmentFailure(payload: {
  equipmentId: string;
  engineTempC: number;
  hydraulicPressurePsi: number;
  vibrationMmSec: number;
  operatingHours: number;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/equipment/predict-failure`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function fetchWeather(): Promise<{
  success: boolean;
  current: WeatherObservation;
  forecast14Days: WeatherObservation[];
  impactSummary: string;
}> {
  const res = await fetch(`${API_BASE}/weather`);
  return res.json();
}

export async function fetchSatelliteScenes(): Promise<{
  success: boolean;
  scenes: SatelliteScene[];
  connectorsStatus: any[];
}> {
  const res = await fetch(`${API_BASE}/satellite/scenes`);
  return res.json();
}

export async function runWhatIfSimulation(params: SimulationParams): Promise<{
  success: boolean;
  result: SimulationResult;
}> {
  const res = await fetch(`${API_BASE}/simulation/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function fetchRecommendations(): Promise<{
  success: boolean;
  recommendations: ActionRecommendation[];
}> {
  const res = await fetch(`${API_BASE}/recommendations`);
  return res.json();
}

export async function updateRecommendationStatus(id: string, status: string): Promise<any> {
  const res = await fetch(`${API_BASE}/recommendations/${id}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function queryCopilot(query: string, activeMineId: string): Promise<{
  success: boolean;
  reply: string;
  sourceReferences: any[];
  quickSuggestions: string[];
}> {
  const res = await fetch(`${API_BASE}/copilot/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, activeMineId }),
  });
  return res.json();
}

export async function uploadDataset(payload: { fileName: string; fileType: string; content: string }): Promise<any> {
  const res = await fetch(`${API_BASE}/data/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function fetchDatasets(): Promise<{ success: boolean; datasets: any[] }> {
  const res = await fetch(`${API_BASE}/data/datasets`);
  return res.json();
}

export async function fetchEvidence(): Promise<{ success: boolean; records: EvidenceRecord[] }> {
  const res = await fetch(`${API_BASE}/evidence`);
  return res.json();
}

export async function fetchModels(): Promise<{ success: boolean; models: any[] }> {
  const res = await fetch(`${API_BASE}/models`);
  return res.json();
}

export async function generateReport(type: string, mineId: string, format = 'PDF'): Promise<any> {
  const res = await fetch(`${API_BASE}/reports/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, mineId, format }),
  });
  return res.json();
}
