import React, { useState } from 'react';
import {
  Mine,
  ExplorationTarget,
  DrillHole,
  ReserveBlock,
  EquipmentAsset,
  ActionRecommendation,
  WeatherObservation,
} from '../types/mining';
import { MiningMap } from '../components/MiningMap';
import {
  Compass,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Cpu,
  Truck,
  CloudRain,
  ShieldAlert,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Layers,
  Activity,
  CheckCircle,
} from 'lucide-react';

interface CommandCenterViewProps {
  activeMine: Mine;
  targets: ExplorationTarget[];
  drillHoles: DrillHole[];
  reserveBlocks: ReserveBlock[];
  equipment: EquipmentAsset[];
  recommendations: ActionRecommendation[];
  weather: WeatherObservation;
  onNavigateToModule: (module: any) => void;
  onSelectTarget: (target: ExplorationTarget) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  activeMine,
  targets,
  drillHoles,
  reserveBlocks,
  equipment,
  recommendations,
  weather,
  onNavigateToModule,
  onSelectTarget,
}) => {
  const topTarget = targets.sort((a, b) => b.prospectivityScore - a.prospectivityScore)[0];
  const criticalEquipment = equipment.filter((e) => e.failureRiskPct >= 70);
  const totalResourceMt = reserveBlocks.reduce((acc, b) => acc + b.estimatedTonnageMt, 0);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
      {/* First Screen Purpose Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border border-neutral-800 rounded-lg p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-neutral-100 text-sm">
              MINING INTELLIGENCE COMMAND CENTER
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded">
              {activeMine.name}
            </span>
          </div>
          <p className="text-neutral-400 text-xs">
            We are finding where manganese may be, why it may be there, how much production is at risk, and what MOIL should do next.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <div className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-mono">
            Target: {activeMine.dailyTargetTonnes.toLocaleString()} TPD @ {activeMine.averageMnGrade}% Mn
          </div>
          <button
            onClick={() => onNavigateToModule('what-if-simulator')}
            className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-medium rounded text-xs transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Mitigation</span>
          </button>
        </div>
      </div>

      {/* Top 8 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {/* KPI 1 */}
        <div
          onClick={() => onNavigateToModule('reserves')}
          className="p-2.5 rounded bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-colors"
        >
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Resource Potential</div>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
            {totalResourceMt.toFixed(1)} <span className="text-xs font-normal text-neutral-400">Mt</span>
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5 truncate">
            {reserveBlocks.length} Blocks · Requires Val.
          </div>
        </div>

        {/* KPI 2 */}
        <div
          onClick={() => onNavigateToModule('exploration')}
          className="p-2.5 rounded bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-colors"
        >
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Prospectivity Targets</div>
          <div className="text-lg font-bold font-mono text-amber-400 mt-1">
            {targets.length} <span className="text-xs font-normal text-neutral-400">Zones</span>
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5 truncate">
            Top Score: {topTarget ? topTarget.prospectivityScore : 89}/100
          </div>
        </div>

        {/* KPI 3 */}
        <div
          onClick={() => onNavigateToModule('production-forecast')}
          className="p-2.5 rounded bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-colors"
        >
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider">30-Day Forecast</div>
          <div className="text-lg font-bold font-mono text-neutral-200 mt-1">
            {(activeMine.dailyTargetTonnes * 0.78).toFixed(0)} <span className="text-xs font-normal text-neutral-400">TPD</span>
          </div>
          <div className="text-[10px] text-rose-400 mt-0.5 flex items-center gap-0.5">
            <TrendingDown className="w-3 h-3" />
            <span>-22% vs Target</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div
          onClick={() => onNavigateToModule('shortfall-radar')}
          className="p-2.5 rounded bg-neutral-900/90 border border-rose-500/30 hover:border-rose-500/50 cursor-pointer transition-colors"
        >
          <div className="text-[10px] text-rose-400 uppercase tracking-wider">Shortfall Risk</div>
          <div className="text-lg font-bold font-mono text-rose-400 mt-1">
            71% <span className="text-xs font-normal text-rose-400/70">Prob.</span>
          </div>
          <div className="text-[10px] text-rose-300 mt-0.5 truncate">
            Peak: 88% on Oct 01
          </div>
        </div>

        {/* KPI 5 */}
        <div
          onClick={() => onNavigateToModule('equipment')}
          className="p-2.5 rounded bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-colors"
        >
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Fleet Availability</div>
          <div className="text-lg font-bold font-mono text-neutral-200 mt-1">
            81.2%
          </div>
          <div className="text-[10px] text-amber-400 mt-0.5 truncate">
            {criticalEquipment.length} Critical Units
          </div>
        </div>

        {/* KPI 6 */}
        <div
          onClick={() => onNavigateToModule('weather-satellite')}
          className="p-2.5 rounded bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-colors"
        >
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Weather Risk</div>
          <div className="text-lg font-bold font-mono text-amber-400 mt-1">
            48 <span className="text-xs font-normal text-neutral-400">mm</span>
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5 truncate">
            Monsoon Peak Oct 01
          </div>
        </div>

        {/* KPI 7 */}
        <div
          onClick={() => onNavigateToModule('admin')}
          className="p-2.5 rounded bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-colors"
        >
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider">AI Confidence</div>
          <div className="text-lg font-bold font-mono text-cyan-400 mt-1">
            84.2%
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5 truncate">
            Ensemble v3.2.1
          </div>
        </div>

        {/* KPI 8 */}
        <div
          onClick={() => onNavigateToModule('recommendations')}
          className="p-2.5 rounded bg-neutral-900/90 border border-amber-500/30 hover:border-amber-500/50 cursor-pointer transition-colors"
        >
          <div className="text-[10px] text-amber-400 uppercase tracking-wider">Active Alerts</div>
          <div className="text-lg font-bold font-mono text-amber-400 mt-1">
            {recommendations.length}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5 truncate">
            Action Ready
          </div>
        </div>
      </div>

      {/* Main Center Section: GIS Map (65%) + Intelligence Side Panel (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[500px]">
        {/* Left Map Viewport */}
        <div className="lg:col-span-8 flex flex-col rounded-lg border border-neutral-800 overflow-hidden bg-neutral-950">
          <div className="px-3 py-2 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-200">Interactive Mining Geospatial Intelligence</span>
              <span className="text-neutral-500">·</span>
              <span className="text-neutral-400 text-[11px]">Sentinel-1/2 & DEM Overlays</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
              <span>Click any marker to inspect evidence</span>
            </div>
          </div>

          <div className="flex-1 w-full relative min-h-[440px]">
            <MiningMap
              activeMine={activeMine}
              targets={targets}
              drillHoles={drillHoles}
              reserveBlocks={reserveBlocks}
              equipment={equipment}
              onSelectTarget={onSelectTarget}
            />
          </div>
        </div>

        {/* Right Intelligence & Action Feeds */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {/* Production Shortfall Radar Snapshot */}
          <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Shortfall Radar (Upcoming 5 Days)</span>
              </span>
              <button
                onClick={() => onNavigateToModule('shortfall-radar')}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
              >
                <span>Full Radar</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-1 text-center font-mono">
              <div className="p-1.5 rounded bg-neutral-950 border border-neutral-800">
                <div className="text-[10px] text-neutral-500">30 SEP</div>
                <div className="text-xs font-bold text-amber-400 mt-0.5">HIGH</div>
                <div className="text-[9px] text-neutral-400">67%</div>
              </div>
              <div className="p-1.5 rounded bg-neutral-950 border border-rose-500/40">
                <div className="text-[10px] text-neutral-500">01 OCT</div>
                <div className="text-xs font-bold text-rose-400 mt-0.5">CRIT</div>
                <div className="text-[9px] text-rose-300">88%</div>
              </div>
              <div className="p-1.5 rounded bg-neutral-950 border border-neutral-800">
                <div className="text-[10px] text-neutral-500">02 OCT</div>
                <div className="text-xs font-bold text-amber-400 mt-0.5">HIGH</div>
                <div className="text-[9px] text-neutral-400">74%</div>
              </div>
              <div className="p-1.5 rounded bg-neutral-950 border border-neutral-800">
                <div className="text-[10px] text-neutral-500">03 OCT</div>
                <div className="text-xs font-bold text-yellow-400 mt-0.5">MED</div>
                <div className="text-[9px] text-neutral-400">42%</div>
              </div>
              <div className="p-1.5 rounded bg-neutral-950 border border-neutral-800">
                <div className="text-[10px] text-neutral-500">04 OCT</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">LOW</div>
                <div className="text-[9px] text-neutral-400">18%</div>
              </div>
            </div>

            <div className="text-[11px] text-neutral-400 bg-neutral-950/70 p-2 rounded border border-neutral-800">
              <strong className="text-rose-300">Key Root Cause:</strong> Shovel EXC-014 operating at 104°C (78% failure risk) combined with 48mm rainfall front arriving Oct 01.
            </div>
          </div>

          {/* Urgent AI Action Recommendation */}
          <div className="p-3 rounded-lg bg-neutral-900/80 border border-amber-500/30 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Priority AI Recommendation</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                +540 T/day Impact
              </span>
            </div>

            <p className="text-[11px] text-neutral-200 leading-relaxed">
              {recommendations[0]
                ? recommendations[0].recommendedAction
                : 'Stage prophylactic replacement of EXC-014 hydraulic valve cluster tonight during shift change; redeploy stand-by shovel EXC-009 to Bench 4 face.'}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-neutral-800 text-[11px]">
              <span className="text-neutral-400">Confidence: 88%</span>
              <button
                onClick={() => onNavigateToModule('recommendations')}
                className="text-amber-400 hover:text-amber-300 font-medium"
              >
                Review & Execute →
              </button>
            </div>
          </div>

          {/* Top Prospectivity Zones Preview */}
          <div className="flex-1 p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-2 text-xs overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Ranked Exploration Targets</span>
              </span>
              <button
                onClick={() => onNavigateToModule('exploration')}
                className="text-[11px] text-neutral-400 hover:text-neutral-200"
              >
                View All ({targets.length})
              </button>
            </div>

            <div className="space-y-1.5">
              {targets.slice(0, 3).map((target) => (
                <div
                  key={target.id}
                  onClick={() => onSelectTarget(target)}
                  className="p-2 rounded bg-neutral-950 border border-neutral-800 hover:border-amber-500/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-neutral-200 truncate">{target.name}</span>
                    <span className="font-mono font-bold text-amber-400 ml-2">
                      {target.prospectivityScore}/100
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1 font-mono">
                    <span>Est: {target.estimatedResourcePotentialMt} Mt</span>
                    <span className="text-emerald-400">{target.drillingPriority.split(' - ')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
