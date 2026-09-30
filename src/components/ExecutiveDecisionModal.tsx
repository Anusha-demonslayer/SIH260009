import React from 'react';
import {
  Compass,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  X,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Mine, ExplorationTarget, ActionRecommendation } from '../types/mining';

interface ExecutiveDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMine: Mine;
  topTarget?: ExplorationTarget;
  topRecommendation?: ActionRecommendation;
  onApplyRecommendation?: (rec: ActionRecommendation) => void;
}

export const ExecutiveDecisionModal: React.FC<ExecutiveDecisionModalProps> = ({
  isOpen,
  onClose,
  activeMine,
  topTarget,
  topRecommendation,
  onApplyRecommendation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-neutral-950 border border-amber-500/40 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-neutral-950 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-100 uppercase tracking-wide">
                Executive Decision Matrix — {activeMine.name}
              </h2>
              <p className="text-xs text-neutral-400">
                Synthesis of Space-Borne Prospectivity, Production Vulnerability, and Corrective Interventions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Decision Grid */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Row 1: Opportunity vs Risk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Where is the Opportunity? */}
            <div className="p-4 rounded-lg bg-neutral-900/80 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>1. Where is the Manganese Opportunity?</span>
              </div>

              <div>
                <div className="text-lg font-bold text-neutral-100">
                  {topTarget ? topTarget.name : 'Zone North Ridge Fold Axis (TGT-DB-01)'}
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  Host: Sausar Group Mansar Schist fold hinge with gondite contact
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800 text-center">
                <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase">Prospectivity</div>
                  <div className="text-base font-bold text-amber-400 font-mono">
                    {topTarget ? topTarget.prospectivityScore : 89}/100
                  </div>
                </div>
                <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase">Est. Resource</div>
                  <div className="text-base font-bold text-emerald-400 font-mono">
                    {topTarget ? topTarget.estimatedResourcePotentialMt : 3.4} Mt
                  </div>
                </div>
                <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase">Confidence</div>
                  <div className="text-base font-bold text-cyan-400 font-mono">
                    {topTarget ? topTarget.confidenceScore : 84}%
                  </div>
                </div>
              </div>

              <div className="text-xs text-neutral-300 bg-neutral-950/60 p-2.5 rounded border border-neutral-800">
                <strong>Why Here:</strong> Sentinel-2 SWIR hydroxyl index = 1.94, Sentinel-1 radar surface roughness anomaly, adjacent to diamond drill hole DH-DB-101 (8.3m @ 45.8% Mn).
              </div>
            </div>

            {/* What is the Risk? */}
            <div className="p-4 rounded-lg bg-neutral-900/80 border border-rose-500/30 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>2. What Could Go Wrong & Production at Risk?</span>
              </div>

              <div>
                <div className="text-lg font-bold text-neutral-100">
                  Upcoming 5-Day Shortfall: 71% Risk (Oct 01 Spike: 88%)
                </div>
                <div className="text-xs text-rose-300 mt-0.5">
                  Projected 5-day cumulative shortfall: ~4,100 Tonnes
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800 text-center">
                <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase">Shortfall Prob</div>
                  <div className="text-base font-bold text-rose-400 font-mono">71%</div>
                </div>
                <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase">Daily Gap</div>
                  <div className="text-base font-bold text-amber-400 font-mono">-790 T/day</div>
                </div>
                <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase">Revenue at Risk</div>
                  <div className="text-base font-bold text-rose-400 font-mono">₹58.2 Lakhs</div>
                </div>
              </div>

              <div className="text-xs text-neutral-300 bg-neutral-950/60 p-2.5 rounded border border-neutral-800">
                <strong>Main Causes:</strong> Heavy shovel <strong>EXC-014</strong> operating at 104°C (78% failure risk) + 48mm monsoon precipitation arriving Oct 01 + Bench 5 blast delay.
              </div>
            </div>
          </div>

          {/* Row 2: What Should MOIL Do? */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 border border-amber-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>3. Recommended Immediate Action & Expected Impact</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                Simulated Impact: +540 Tonnes/day (+8.4% Recovery)
              </span>
            </div>

            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Overhaul Shovel EXC-014:</strong> Stage 4-hour prophylactic hydraulic seal replacement tonight during shift change, avoiding catastrophic 72-hour breakdown.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Advance Blasting Window:</strong> Shift Bench 5 firing schedule 14 hours earlier into the dry morning window of Sept 30 before the 48mm precipitation front hits.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Drilling Mobilization:</strong> Prioritize 3 diamond core validation holes on Target TGT-DB-01 to establish JORC/UNFC certified manganese reserves.
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs text-neutral-400">
                Status: <span className="text-amber-400 font-medium">Ready for Executive Authorization</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 rounded transition-colors"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    if (topRecommendation && onApplyRecommendation) {
                      onApplyRecommendation(topRecommendation);
                    }
                    onClose();
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded transition-colors shadow-md shadow-amber-500/20"
                >
                  Authorize Operational Mitigation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-2.5 bg-neutral-950 border-t border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between">
          <span>MOIL Central Mining Intelligence Platform • SIH 2026 Problem Statement SIH26009</span>
          <span className="font-mono">Demo Scenario — Synthetic Operational Benchmark</span>
        </div>
      </div>
    </div>
  );
};
