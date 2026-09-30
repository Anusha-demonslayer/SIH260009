import React, { useState, useEffect } from 'react';
import {
  Mine,
  SimulationParams,
  SimulationResult,
} from '../types/mining';
import { runWhatIfSimulation } from '../services/api';
import {
  Sliders,
  Sparkles,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface WhatIfSimulatorViewProps {
  activeMine: Mine;
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({
  activeMine,
}) => {
  const [params, setParams] = useState<SimulationParams>({
    mineId: activeMine.id,
    equipmentAvailabilityPct: 82,
    rainfallIntensityMm: 24,
    blastingDelayDays: 1,
    activeExcavators: 4,
    activeDumpers: 16,
    shiftHoursPerDay: 16,
    maintenanceDelayHours: 4,
    feedGradeMnPct: activeMine.averageMnGrade,
    miningRateTonnesPerHr: 220,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const executeSimulation = async (customParams?: SimulationParams) => {
    const p = customParams || params;
    setIsSimulating(true);
    try {
      const res = await runWhatIfSimulation(p);
      if (res.success) {
        setResult(res.result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    executeSimulation();
  }, [activeMine.id]);

  const loadPreset = (presetName: string) => {
    let presetParams: SimulationParams;

    if (presetName === 'monsoon') {
      presetParams = {
        ...params,
        rainfallIntensityMm: 48,
        equipmentAvailabilityPct: 70,
        blastingDelayDays: 2,
        activeExcavators: 3,
        activeDumpers: 12,
      };
    } else if (presetName === 'excavator-down') {
      presetParams = {
        ...params,
        activeExcavators: 3,
        equipmentAvailabilityPct: 68,
        blastingDelayDays: 1,
      };
    } else {
      // Optimal
      presetParams = {
        ...params,
        rainfallIntensityMm: 5,
        equipmentAvailabilityPct: 92,
        activeExcavators: 5,
        activeDumpers: 20,
        blastingDelayDays: 0,
      };
    }

    setParams(presetParams);
    executeSimulation(presetParams);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-neutral-100 uppercase tracking-wide">
              What-If Mine Production Simulator
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400">
              Real Backend Discrete-Event Engine
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Simulate the operational and revenue consequences of weather disruptions, equipment breakdowns, and fleet reassignments.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-neutral-500 hidden sm:inline">Presets:</span>
          <button
            onClick={() => loadPreset('monsoon')}
            className="px-2.5 py-1 rounded bg-neutral-900 border border-rose-500/30 text-rose-300 text-xs hover:bg-neutral-800 transition-colors"
          >
            Extreme Monsoon (48mm)
          </button>
          <button
            onClick={() => loadPreset('excavator-down')}
            className="px-2.5 py-1 rounded bg-neutral-900 border border-amber-500/30 text-amber-300 text-xs hover:bg-neutral-800 transition-colors"
          >
            EXC-014 Breakdown
          </button>
          <button
            onClick={() => loadPreset('optimal')}
            className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs hover:bg-emerald-500/30 transition-colors font-medium"
          >
            Optimized Fleet (+1 Shovel)
          </button>
        </div>
      </div>

      {/* Main Grid: Parameter Sliders (6 cols) + Baseline vs Simulation (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left: Interactive Controls (6 cols) */}
        <div className="lg:col-span-6 flex flex-col space-y-3">
          <div className="p-4 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="font-semibold text-neutral-200">Operational Decision Levers</span>
              <button
                onClick={() => executeSimulation()}
                disabled={isSimulating}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* Active Excavators */}
              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>Active Shovels / Excavators</span>
                  <span className="font-mono text-amber-400 font-bold">{params.activeExcavators} Units</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  step="1"
                  value={params.activeExcavators}
                  onChange={(e) => setParams({ ...params, activeExcavators: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Active Dump Trucks */}
              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>Active Dump Trucks (60T)</span>
                  <span className="font-mono text-amber-400 font-bold">{params.activeDumpers} Trucks</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="24"
                  step="1"
                  value={params.activeDumpers}
                  onChange={(e) => setParams({ ...params, activeDumpers: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Equipment Availability */}
              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>Fleet Availability Target</span>
                  <span className="font-mono text-amber-400 font-bold">{params.equipmentAvailabilityPct}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="98"
                  step="2"
                  value={params.equipmentAvailabilityPct}
                  onChange={(e) => setParams({ ...params, equipmentAvailabilityPct: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Rainfall Intensity */}
              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>Rainfall Precipitation</span>
                  <span className="font-mono text-rose-400 font-bold">{params.rainfallIntensityMm} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="2"
                  value={params.rainfallIntensityMm}
                  onChange={(e) => setParams({ ...params, rainfallIntensityMm: parseInt(e.target.value) })}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Blasting Delay */}
              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>Blasting Schedule Delay</span>
                  <span className="font-mono text-amber-400 font-bold">{params.blastingDelayDays} Days</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={params.blastingDelayDays}
                  onChange={(e) => setParams({ ...params, blastingDelayDays: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Shift Hours */}
              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>Operating Shift Hours</span>
                  <span className="font-mono text-amber-400 font-bold">{params.shiftHoursPerDay} hrs/day</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="24"
                  step="2"
                  value={params.shiftHoursPerDay}
                  onChange={(e) => setParams({ ...params, shiftHoursPerDay: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: BASELINE vs SIMULATION Outcome (6 cols) */}
        <div className="lg:col-span-6 flex flex-col space-y-3">
          {result && (
            <div className="p-4 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-bold text-neutral-100 text-sm">
                  Comparative Simulation Analysis
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Calculated via /api/simulation/run
                </span>
              </div>

              {/* Comparison Cards Grid */}
              <div className="grid grid-cols-2 gap-3 text-center">
                {/* Baseline */}
                <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
                  <div className="text-[10px] uppercase text-neutral-500 font-bold">Current Baseline</div>
                  <div className="text-xl font-bold font-mono text-neutral-200">
                    {result.baselineProductionTonnes.toLocaleString()}{' '}
                    <span className="text-xs font-normal text-neutral-400">TPD</span>
                  </div>
                  <div className="text-[11px] font-mono text-rose-400">
                    Shortfall Risk: {result.baselineShortfallRiskPct}%
                  </div>
                </div>

                {/* Simulated Scenario */}
                <div className="p-3 rounded-lg bg-neutral-950 border border-amber-500/40 space-y-1">
                  <div className="text-[10px] uppercase text-amber-400 font-bold">Simulated Scenario</div>
                  <div className="text-xl font-bold font-mono text-amber-400">
                    {result.simulatedProductionTonnes.toLocaleString()}{' '}
                    <span className="text-xs font-normal text-neutral-400">TPD</span>
                  </div>
                  <div
                    className={`text-[11px] font-mono font-bold ${
                      result.simulatedShortfallRiskPct < result.baselineShortfallRiskPct
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    Shortfall Risk: {result.simulatedShortfallRiskPct}%
                  </div>
                </div>
              </div>

              {/* Economic Delta Impact */}
              <div className="p-3 rounded bg-neutral-950 border border-neutral-800 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Daily Revenue Impact:</span>
                  <span
                    className={`text-sm font-bold ${
                      result.dailyRevenueImpactInrLakhs >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {result.dailyRevenueImpactInrLakhs >= 0 ? '+' : ''}₹{result.dailyRevenueImpactInrLakhs} Lakhs/day
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Equipment Fleet Utilization:</span>
                  <span className="text-neutral-200">{result.equipmentUtilizationPct}%</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Remaining Ore Haulage Gap:</span>
                  <span className="text-amber-400">{result.oreHaulageDeficitTonnes.toLocaleString()} Tonnes</span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="p-3 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                <strong>Executive Assessment:</strong> {result.summary}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
