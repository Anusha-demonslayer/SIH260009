import React, { useState, useEffect } from 'react';
import {
  Mine,
  ProductionForecastDay,
} from '../types/mining';
import { fetchProductionForecast, fetchProductionHistory } from '../services/api';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Sliders,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  Download,
  Upload,
} from 'lucide-react';

interface ProductionForecastViewProps {
  activeMine: Mine;
  onNavigateToSimulator?: () => void;
}

export const ProductionForecastView: React.FC<ProductionForecastViewProps> = ({
  activeMine,
  onNavigateToSimulator,
}) => {
  const [horizonDays, setHorizonDays] = useState<number>(30);
  const [rainfallMultiplier, setRainfallMultiplier] = useState<number>(1.0);
  const [availabilityOverride, setAvailabilityOverride] = useState<number>(80);
  const [forecast, setForecast] = useState<ProductionForecastDay[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [histRes, foreRes] = await Promise.all([
        fetchProductionHistory(activeMine.id, 30),
        fetchProductionForecast({
          mineId: activeMine.id,
          forecastHorizonDays: horizonDays,
          expectedRainfallFactor: rainfallMultiplier,
          equipmentAvailabilityOverride: availabilityOverride,
        }),
      ]);

      if (histRes.success) setHistory(histRes.data);
      if (foreRes.success) setForecast(foreRes.forecast);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeMine.id, horizonDays]);

  const target = activeMine.dailyTargetTonnes;
  const avgPredicted =
    forecast.length > 0
      ? Math.round(forecast.reduce((acc, f) => acc + f.predictedTonnes, 0) / forecast.length)
      : target * 0.78;
  const gapTonnes = target - avgPredicted;
  const criticalDays = forecast.filter((f) => f.riskCategory === 'CRITICAL' || f.riskCategory === 'HIGH').length;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-neutral-100 uppercase tracking-wide">
              Production Forecasting & Shortfall Gap Analysis
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400">
              LightGBM Time-Series Ensemble v2.8
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Multi-horizon production projection incorporating haul fleet SCADA, blasting sequence, and monsoon rain radar.
          </p>
        </div>

        {/* Horizon selector buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-900 rounded p-1 border border-neutral-800 text-xs">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setHorizonDays(d)}
                className={`px-3 py-1 rounded transition-colors font-mono ${
                  horizonDays === d
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {d}-Day
              </button>
            ))}
          </div>

          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-neutral-900/90 border border-neutral-800">
          <div className="text-neutral-400 uppercase text-[10px]">Daily Target Tonnage</div>
          <div className="text-xl font-bold font-mono text-neutral-100 mt-1">
            {target.toLocaleString()} <span className="text-xs font-normal text-neutral-400">TPD</span>
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">MOIL Monthly Operational Plan</div>
        </div>

        <div className="p-3 rounded-lg bg-neutral-900/90 border border-neutral-800">
          <div className="text-neutral-400 uppercase text-[10px]">Forecasted Daily Output</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {avgPredicted.toLocaleString()} <span className="text-xs font-normal text-neutral-400">TPD</span>
          </div>
          <div className="text-[10px] text-rose-400 mt-0.5 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            <span>Gap: -{gapTonnes.toLocaleString()} TPD ({((gapTonnes / target) * 100).toFixed(1)}%)</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-neutral-900/90 border border-rose-500/30">
          <div className="text-rose-400 uppercase text-[10px]">High/Critical Risk Days</div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">
            {criticalDays} <span className="text-xs font-normal text-rose-300">Days</span>
          </div>
          <div className="text-[10px] text-rose-300 mt-0.5">Within next {horizonDays} days</div>
        </div>

        <div className="p-3 rounded-lg bg-neutral-900/90 border border-neutral-800">
          <div className="text-neutral-400 uppercase text-[10px]">Revenue at Shortfall Risk</div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">
            ₹{(((gapTonnes * horizonDays * 14200) / 10000000)).toFixed(2)} <span className="text-xs font-normal text-neutral-400">Cr</span>
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">@ ₹14,200/T Mn Ore Benchmark</div>
        </div>
      </div>

      {/* Production Chart Simulation (SVG Visualization) */}
      <div className="p-4 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-2 text-xs">
          <div className="font-semibold text-neutral-200 flex items-center gap-2">
            <span>Production Trajectory: Past 30 Days (Actual) + Next {horizonDays} Days (Forecast)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-neutral-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400" />
              <span>Actual Output</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-400" />
              <span>ML Predicted</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-rose-400" />
              <span>Target Line ({target} TPD)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-rose-500/20 border border-rose-500/40 rounded-sm" />
              <span>Shortfall Zone</span>
            </span>
          </div>
        </div>

        {/* Scaled SVG Chart */}
        <div className="w-full h-64 relative bg-neutral-950/60 rounded border border-neutral-800/80 p-2 overflow-hidden">
          {/* Target Reference Line */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-rose-400/80 z-10 pointer-events-none flex justify-end pr-2"
            style={{ top: '22%' }}
          >
            <span className="text-[9px] font-mono text-rose-400 bg-neutral-950/80 px-1 rounded">
              TARGET: {target} TPD
            </span>
          </div>

          {/* SVG Canvas */}
          <svg className="w-full h-full" viewBox="0 0 800 220" preserveAspectRatio="none">
            {/* Grid horizontal lines */}
            <line x1="0" y1="50" x2="800" y2="50" stroke="#333333" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="0" y1="100" x2="800" y2="100" stroke="#333333" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="0" y1="150" x2="800" y2="150" stroke="#333333" strokeWidth="0.5" strokeDasharray="3,3" />

            {/* Vertical Divider (History vs Forecast) */}
            <line x1="380" y1="0" x2="380" y2="220" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,4" />
            <text x="385" y="16" fill="#f59e0b" fontSize="10" fontFamily="monospace">
              TODAY (2026-09-29)
            </text>

            {/* Shortfall Shading under Forecast Target */}
            <path
              d="M 380,48 L 800,48 L 800,140 Q 600,180 500,150 L 380,95 Z"
              fill="rgba(239, 68, 68, 0.12)"
            />

            {/* Actual History Line (Left side) */}
            <path
              d="M 10,95 Q 60,70 120,85 T 220,110 T 310,75 T 380,95"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
            />

            {/* Predicted Line (Right side) */}
            <path
              d="M 380,95 Q 440,165 480,185 T 560,140 T 660,80 T 790,65"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
            />

            {/* Confidence Upper Bound */}
            <path
              d="M 380,85 Q 440,150 480,170 T 560,125 T 660,70 T 790,55"
              fill="none"
              stroke="rgba(245, 158, 11, 0.35)"
              strokeWidth="1"
              strokeDasharray="2,2"
            />

            {/* Confidence Lower Bound */}
            <path
              d="M 380,105 Q 440,180 480,200 T 560,155 T 660,95 T 790,75"
              fill="none"
              stroke="rgba(245, 158, 11, 0.35)"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          </svg>

          {/* Key annotation for Oct 01 monsoon dip */}
          <div
            className="absolute bg-neutral-900/90 border border-rose-500/60 p-1.5 rounded text-[10px] text-rose-300 shadow-lg pointer-events-none"
            style={{ left: '55%', top: '65%' }}
          >
            <div className="font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>Oct 01: 1,664 TPD (Monsoon Dip)</span>
            </div>
            <div className="text-[9px] text-neutral-400">48mm Rain + EXC-014 Overheat</div>
          </div>
        </div>
      </div>

      {/* Interactive Forecast Tuning Controls */}
      <div className="p-4 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Exogenous Weather & Fleet Sensitivity Tuning</span>
          </span>
          <button
            onClick={loadData}
            className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition-colors"
          >
            Recalculate Forecast
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-neutral-400 mb-1">
              <span>Expected Rainfall Intensity Factor</span>
              <span className="font-mono text-amber-400">{rainfallMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={rainfallMultiplier}
              onChange={(e) => setRainfallMultiplier(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="text-[10px] text-neutral-500">Modulates in-pit haul road slipperiness and truck speed derating</div>
          </div>

          <div>
            <div className="flex justify-between text-neutral-400 mb-1">
              <span>Fleet Availability Override</span>
              <span className="font-mono text-amber-400">{availabilityOverride}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="95"
              step="5"
              value={availabilityOverride}
              onChange={(e) => setAvailabilityOverride(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="text-[10px] text-neutral-500">Simulates preventive overhaul impact or unscheduled breakdown</div>
          </div>
        </div>
      </div>

      {/* Daily Breakdown Table */}
      <div className="rounded-lg bg-neutral-900/80 border border-neutral-800 overflow-hidden text-xs">
        <div className="px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
          <span className="font-semibold text-neutral-200">Daily Forecast Matrix (Upcoming {forecast.length} Days)</span>
          <span className="text-[10px] font-mono text-neutral-400">LightGBM Quantile Bounds</span>
        </div>

        <div className="overflow-x-auto max-h-80">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-neutral-950">
              <tr className="border-b border-neutral-800 text-[10px] text-neutral-500 uppercase tracking-wider">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2 text-right">Target (T)</th>
                <th className="px-3 py-2 text-right">Predicted (T)</th>
                <th className="px-3 py-2 text-right">Confidence Band</th>
                <th className="px-3 py-2 text-right">Shortfall Gap</th>
                <th className="px-3 py-2">Risk Level</th>
                <th className="px-3 py-2">Primary Risk Driver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {forecast.slice(0, 14).map((day) => {
                const gap = day.targetTonnes - day.predictedTonnes;
                const riskColor =
                  day.riskCategory === 'CRITICAL'
                    ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                    : day.riskCategory === 'HIGH'
                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                    : day.riskCategory === 'MEDIUM'
                    ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
                    : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

                return (
                  <tr key={day.date} className="hover:bg-neutral-900/60 text-neutral-300">
                    <td className="px-3 py-2 text-neutral-200">{day.date}</td>
                    <td className="px-3 py-2 text-right">{day.targetTonnes.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right font-bold text-amber-300">
                      {day.predictedTonnes.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right text-neutral-400 text-[11px]">
                      {day.confidenceLowerTonnes.toLocaleString()} - {day.confidenceUpperTonnes.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-rose-400">
                      {gap > 0 ? `-${gap.toLocaleString()}` : '+0'}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-sans border ${riskColor}`}>
                        {day.riskCategory} ({day.shortfallRiskPercentage}%)
                      </span>
                    </td>
                    <td className="px-3 py-2 font-sans text-neutral-300 text-[11px] truncate max-w-[200px]">
                      {day.topCauses[0]?.cause}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
