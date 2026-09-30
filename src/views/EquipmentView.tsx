import React, { useState } from 'react';
import {
  Mine,
  EquipmentAsset,
} from '../types/mining';
import { predictEquipmentFailure } from '../services/api';
import {
  Truck,
  AlertTriangle,
  Activity,
  Sliders,
  Sparkles,
  RefreshCw,
  Wrench,
  Gauge,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface EquipmentViewProps {
  activeMine: Mine;
  equipment: EquipmentAsset[];
  onRefreshEquipment?: () => void;
}

export const EquipmentView: React.FC<EquipmentViewProps> = ({
  activeMine,
  equipment,
  onRefreshEquipment,
}) => {
  const [selectedAsset, setSelectedAsset] = useState<EquipmentAsset>(
    equipment.find((e) => e.code === 'EXC-014') || equipment[0]
  );

  // Sensor simulator inputs
  const [engineTemp, setEngineTemp] = useState<number>(selectedAsset?.telemetry.engineTempC || 104);
  const [hydraulicPsi, setHydraulicPsi] = useState<number>(selectedAsset?.telemetry.hydraulicPressurePsi || 4420);
  const [vibration, setVibration] = useState<number>(selectedAsset?.telemetry.vibrationMmSec || 8.4);
  const [operatingHours, setOperatingHours] = useState<number>(selectedAsset?.telemetry.operatingHours || 14280);

  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const handleSelectAsset = (asset: EquipmentAsset) => {
    setSelectedAsset(asset);
    setEngineTemp(asset.telemetry.engineTempC);
    setHydraulicPsi(asset.telemetry.hydraulicPressurePsi);
    setVibration(asset.telemetry.vibrationMmSec);
    setOperatingHours(asset.telemetry.operatingHours);
    setPredictionResult(null);
  };

  const handleRunPdM = async () => {
    if (!selectedAsset) return;
    setIsPredicting(true);
    try {
      const res = await predictEquipmentFailure({
        equipmentId: selectedAsset.id,
        engineTempC: engineTemp,
        hydraulicPressurePsi: hydraulicPsi,
        vibrationMmSec: vibration,
        operatingHours,
      });
      if (res.success) {
        setPredictionResult(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPredicting(false);
    }
  };

  const filteredEquipment = equipment.filter((e) => {
    if (categoryFilter === 'ALL') return true;
    return e.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  const criticalCount = equipment.filter((e) => e.failureRiskPct >= 70).length;
  const avgAvailability = (
    equipment.reduce((acc, e) => acc + e.availabilityPct, 0) / equipment.length
  ).toFixed(1);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-neutral-100 uppercase tracking-wide">
              Heavy Equipment Fleet & Predictive Maintenance (PdM)
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400">
              Isolation Forest & CAN-bus Telemetry v1.9
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time machine health monitoring, hydraulic pressure anomaly tracking, and remaining useful life (RUL) estimation.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
            <span className="text-neutral-500 uppercase text-[10px]">Fleet Avg Availability: </span>
            <span className="font-bold text-emerald-400">{avgAvailability}%</span>
          </div>
          <div className="p-2 rounded bg-neutral-900 border border-rose-500/40">
            <span className="text-neutral-500 uppercase text-[10px]">Urgent Maintenance: </span>
            <span className="font-bold text-rose-400">{criticalCount} Units</span>
          </div>
        </div>
      </div>

      {/* Main Grid: PdM Simulator (4 cols) + Fleet Assets Table (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left: Interactive Telemetry Anomaly Simulator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          {selectedAsset && (
            <div className="p-4 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div>
                  <div className="font-bold text-neutral-100 text-sm flex items-center gap-2">
                    <span>{selectedAsset.code}</span>
                    <span className="text-[10px] font-mono text-neutral-400">({selectedAsset.model})</span>
                  </div>
                  <div className="text-[11px] text-neutral-400">{selectedAsset.location}</div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                    selectedAsset.failureRiskPct >= 70
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  Risk: {selectedAsset.failureRiskPct}%
                </span>
              </div>

              {/* Sensor Sliders */}
              <div className="space-y-3">
                {/* Engine Temp */}
                <div>
                  <div className="flex justify-between text-neutral-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Engine & Transmission Temp</span>
                    </span>
                    <span className={`font-mono font-bold ${engineTemp > 98 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {engineTemp}°C {engineTemp > 98 && '(OVERHEAT)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="125"
                    step="1"
                    value={engineTemp}
                    onChange={(e) => setEngineTemp(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="text-[10px] text-neutral-500">Nominal threshold: &lt;92°C</div>
                </div>

                {/* Hydraulic Pressure */}
                <div>
                  <div className="flex justify-between text-neutral-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Main Hydraulic Pump Pressure</span>
                    </span>
                    <span className={`font-mono font-bold ${hydraulicPsi > 4300 ? 'text-rose-400' : 'text-neutral-200'}`}>
                      {hydraulicPsi} PSI
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2800"
                    max="5000"
                    step="50"
                    value={hydraulicPsi}
                    onChange={(e) => setHydraulicPsi(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="text-[10px] text-neutral-500">Normal working range: 3400 - 4100 PSI</div>
                </div>

                {/* Vibration */}
                <div>
                  <div className="flex justify-between text-neutral-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-rose-400" />
                      <span>Bearing Tri-axial Vibration (RMS)</span>
                    </span>
                    <span className={`font-mono font-bold ${vibration > 7.0 ? 'text-rose-400' : 'text-neutral-200'}`}>
                      {vibration} mm/s
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="14.0"
                    step="0.2"
                    value={vibration}
                    onChange={(e) => setVibration(parseFloat(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                  <div className="text-[10px] text-neutral-500">ISO 10816 Class IV critical vibration limit: 7.1 mm/s</div>
                </div>

                {/* Operating Hours */}
                <div>
                  <div className="flex justify-between text-neutral-300 mb-1">
                    <span>Cumulative Operating Hours</span>
                    <span className="font-mono text-neutral-200">{operatingHours.toLocaleString()} hrs</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="25000"
                    step="200"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(parseInt(e.target.value))}
                    className="w-full accent-neutral-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleRunPdM}
                disabled={isPredicting}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50"
              >
                {isPredicting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating Anomaly Isolation Forest...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Failure Risk & RUL Prediction</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Real PdM Prediction Output */}
          {predictionResult && (
            <div className="p-4 rounded-lg bg-neutral-900/90 border border-rose-500/40 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-bold text-neutral-100 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>PdM Diagnostic Result</span>
                </span>
                <span className="text-[10px] font-mono text-rose-400 font-bold">
                  Failure Risk: {predictionResult.failureRiskPct}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase">Risk Horizon</div>
                  <div className="text-base font-bold text-amber-400">
                    Next {predictionResult.riskHorizonHours}h
                  </div>
                </div>
                <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase">Expected Downtime</div>
                  <div className="text-base font-bold text-rose-400">
                    {predictionResult.expectedDowntimeHours} Hours
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-medium text-neutral-300">Likely Failure Mode:</div>
                <p className="text-[11px] text-rose-300 font-mono">{predictionResult.likelyFailureMode}</p>
              </div>

              <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                <strong>Recommended Mitigation:</strong> {predictionResult.recommendedIntervention}
              </div>
            </div>
          )}
        </div>

        {/* Right: Fleet Telemetry Grid (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="rounded-lg bg-neutral-900/80 border border-neutral-800 overflow-hidden text-xs">
            <div className="px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
              <span className="font-semibold text-neutral-200">Active Heavy Mining Equipment</span>
              <div className="flex items-center gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5 text-neutral-300 text-[11px]"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Excavator">Excavators</option>
                  <option value="Dumper">Dumpers</option>
                  <option value="Crusher">Crushers</option>
                  <option value="Drill">Drills</option>
                  <option value="Conveyor">Conveyors / Hoists</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-neutral-950">
                  <tr className="border-b border-neutral-800 text-[10px] text-neutral-500 uppercase tracking-wider">
                    <th className="px-3 py-2">Asset Code</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2 text-right">Avail %</th>
                    <th className="px-3 py-2 text-right">Failure Risk</th>
                    <th className="px-3 py-2 text-right">MTBF (hrs)</th>
                    <th className="px-3 py-2 text-right">Temp</th>
                    <th className="px-3 py-2">Maintenance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono">
                  {filteredEquipment.map((eq) => {
                    const isSelected = selectedAsset?.id === eq.id;
                    const isCritical = eq.failureRiskPct >= 70;
                    return (
                      <tr
                        key={eq.id}
                        onClick={() => handleSelectAsset(eq)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-neutral-800 text-white' : 'hover:bg-neutral-900/60 text-neutral-300'
                        }`}
                      >
                        <td className="px-3 py-2.5 font-bold text-amber-300 font-sans">{eq.code}</td>
                        <td className="px-3 py-2.5 font-sans text-neutral-400">{eq.category}</td>
                        <td className="px-3 py-2.5 text-right font-medium">{eq.availabilityPct}%</td>
                        <td className="px-3 py-2.5 text-right font-bold">
                          <span className={isCritical ? 'text-rose-400' : 'text-emerald-400'}>
                            {eq.failureRiskPct}%
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right text-neutral-400">{eq.mtbfHours}</td>
                        <td
                          className={`px-3 py-2.5 text-right ${
                            eq.telemetry.engineTempC > 98 ? 'text-rose-400 font-bold' : 'text-neutral-400'
                          }`}
                        >
                          {eq.telemetry.engineTempC}°C
                        </td>
                        <td className="px-3 py-2.5 font-sans text-[11px]">
                          <span
                            className={`px-1.5 py-0.2 rounded ${
                              eq.maintenanceStatus === 'Urgent Maintenance'
                                ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                                : eq.maintenanceStatus === 'Inspection Due'
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {eq.maintenanceStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
