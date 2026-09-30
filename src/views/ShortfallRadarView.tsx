import React, { useState, useEffect } from 'react';
import {
  Mine,
} from '../types/mining';
import { fetchShortfallRisk, explainShortfall } from '../services/api';
import {
  Radar,
  AlertTriangle,
  CloudRain,
  Truck,
  Activity,
  ArrowRight,
  TrendingDown,
  ChevronRight,
  ShieldAlert,
  Flame,
  CheckCircle,
} from 'lucide-react';

interface ShortfallRadarViewProps {
  activeMine: Mine;
  onNavigateToRecommendations?: () => void;
}

export const ShortfallRadarView: React.FC<ShortfallRadarViewProps> = ({
  activeMine,
  onNavigateToRecommendations,
}) => {
  const [radarDays, setRadarDays] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-01');
  const [explanation, setExplanation] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadRadar() {
      try {
        const res = await fetchShortfallRisk(activeMine.id);
        if (res.success) {
          setRadarDays(res.radarDays);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadRadar();
  }, [activeMine.id]);

  useEffect(() => {
    async function loadExplanation() {
      setIsLoading(true);
      try {
        const res = await explainShortfall(activeMine.id, selectedDate);
        if (res.success) {
          setExplanation(res);
          setSelectedNode(res.dependencyGraph[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadExplanation();
  }, [activeMine.id, selectedDate]);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-rose-400" />
            <h1 className="text-base font-bold text-neutral-100 uppercase tracking-wide">
              Production Shortfall Radar & Root-Cause Dependency Graph
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400">
              Causal Bayesian Network v2.1
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Dynamic calendar vulnerability matrix tracking operational propagation from monsoon weather cells down to crusher feed ore delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded">
            Alert: Monsoon Precipitation Front Arriving Oct 01
          </span>
        </div>
      </div>

      {/* Calendar Timeline: Click a date to inspect */}
      <div className="p-4 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-neutral-200">
            Select Horizon Day (Upcoming 7 Days Shortfall Risk Timeline)
          </span>
          <span className="text-neutral-400 text-[11px]">Click a day to run causal graph analysis</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {radarDays.map((day) => {
            const isSelected = selectedDate === day.date;
            const riskBorder =
              day.risk === 'CRITICAL'
                ? 'border-rose-500/80 bg-rose-950/20'
                : day.risk === 'HIGH'
                ? 'border-amber-500/60 bg-amber-950/20'
                : day.risk === 'MEDIUM'
                ? 'border-yellow-500/40 bg-yellow-950/10'
                : 'border-neutral-800 bg-neutral-950/60';

            const textColor =
              day.risk === 'CRITICAL'
                ? 'text-rose-400'
                : day.risk === 'HIGH'
                ? 'text-amber-400'
                : day.risk === 'MEDIUM'
                ? 'text-yellow-400'
                : 'text-emerald-400';

            return (
              <button
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${riskBorder} ${
                  isSelected ? 'ring-2 ring-amber-400 shadow-lg' : 'hover:border-neutral-700'
                }`}
              >
                <div className="text-[10px] font-mono text-neutral-400">{day.date}</div>
                <div className={`text-base font-bold font-mono mt-1 ${textColor}`}>
                  {day.risk}
                </div>
                <div className="text-xs font-mono text-neutral-300 mt-0.5">
                  {day.shortfallRiskPct}% Risk
                </div>
                <div className="text-[10px] text-neutral-500 mt-1 font-mono">
                  {day.expectedTonnes} / {day.targetTonnes} T
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Causal Breakdown Details */}
      {explanation && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          {/* Left: Root-Cause Graph Interactive Chain (8 cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-3">
            <div className="p-4 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-xs">
                <div>
                  <span className="font-bold text-neutral-100 text-sm">
                    Root-Cause Dependency Chain — Date: {explanation.targetDate}
                  </span>
                  <div className="text-neutral-400 text-xs mt-0.5">
                    Click each causality node to inspect physical telemetry and allocated loss contribution
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-rose-400 text-sm">
                    Shortfall: -{explanation.projectedGapTonnes} Tonnes ({explanation.shortfallProbability}% Prob.)
                  </span>
                </div>
              </div>

              {/* Sequential Graph Nodes */}
              <div className="space-y-2">
                {explanation.dependencyGraph.map((node: any, idx: number) => {
                  const isNodeSelected = selectedNode?.node === node.node;
                  return (
                    <div key={node.node}>
                      <div
                        onClick={() => setSelectedNode(node)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                          isNodeSelected
                            ? 'bg-neutral-800/90 border-amber-500 shadow-md'
                            : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded bg-neutral-900 border border-neutral-700 flex items-center justify-center text-xs font-mono font-bold text-amber-400">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-200 text-xs flex items-center gap-2">
                              <span>{node.label}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-neutral-900 rounded text-neutral-400">
                                {node.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-neutral-400 mt-0.5">{node.value}</div>
                          </div>
                        </div>

                        <div className="text-right font-mono">
                          <div className="text-xs font-bold text-amber-400">
                            Impact: {node.impactScore}%
                          </div>
                          <div className="text-[10px] text-neutral-500">Causal Weight</div>
                        </div>
                      </div>

                      {/* Arrow Down Connector */}
                      {idx < explanation.dependencyGraph.length - 1 && (
                        <div className="flex justify-center py-1 text-neutral-600">
                          ↓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Selected Node Detail & Loss Allocation (4 cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-3 text-xs">
            {/* Node Inspector */}
            {selectedNode && (
              <div className="p-4 rounded-lg bg-neutral-900/90 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="font-semibold text-amber-400 uppercase tracking-wide text-xs">
                    Node Telemetry Inspection
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">{selectedNode.node}</span>
                </div>

                <div>
                  <div className="text-sm font-bold text-neutral-100">{selectedNode.label}</div>
                  <div className="text-neutral-300 mt-1">{selectedNode.value}</div>
                </div>

                <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Causal Severity:</span>
                    <span className="text-rose-400 font-bold">{selectedNode.impactScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Status Classification:</span>
                    <span className="text-amber-300">{selectedNode.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Directly Impacts:</span>
                    <span className="text-cyan-300">
                      {selectedNode.nextNodes.length > 0 ? selectedNode.nextNodes.join(', ') : 'Final Output'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onNavigateToRecommendations}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded transition-colors text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <span>View Mitigation in AI Recommendations</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Quantitative Loss Allocation Breakdown */}
            <div className="p-4 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-3">
              <div className="font-semibold text-neutral-200">
                Allocated Production Loss Breakdown ({explanation.projectedGapTonnes} Tonnes Gap)
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                <div>
                  <div className="flex justify-between text-neutral-300 mb-0.5">
                    <span>Equipment Downtime (EXC-014)</span>
                    <span className="text-rose-400 font-bold">{explanation.allocatedLossTonnes.equipmentDowntime} T (36%)</span>
                  </div>
                  <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '36%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-300 mb-0.5">
                    <span>Haul Road Slipperiness / Rain</span>
                    <span className="text-amber-400 font-bold">{explanation.allocatedLossTonnes.haulRoadRainDerate} T (29%)</span>
                  </div>
                  <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '29%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-300 mb-0.5">
                    <span>Blasting Postponement</span>
                    <span className="text-yellow-400 font-bold">{explanation.allocatedLossTonnes.blastPostponement} T (20%)</span>
                  </div>
                  <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: '20%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-neutral-300 mb-0.5">
                    <span>Crusher Ramp Queue Delay</span>
                    <span className="text-cyan-400 font-bold">{explanation.allocatedLossTonnes.crusherRampQueuing} T (15%)</span>
                  </div>
                  <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
