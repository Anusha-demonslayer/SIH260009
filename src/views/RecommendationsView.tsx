import React, { useState } from 'react';
import {
  ActionRecommendation,
  Mine,
} from '../types/mining';
import { updateRecommendationStatus } from '../services/api';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  RefreshCw,
} from 'lucide-react';

interface RecommendationsViewProps {
  activeMine: Mine;
  recommendations: ActionRecommendation[];
  onRefreshRecommendations?: () => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  activeMine,
  recommendations: initialRecommendations,
  onRefreshRecommendations,
}) => {
  const [recommendations, setRecommendations] = useState<ActionRecommendation[]>(initialRecommendations);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, status: 'Approved' | 'Executed') => {
    setProcessingId(id);
    try {
      const res = await updateRecommendationStatus(id, status);
      if (res.success) {
        setRecommendations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-neutral-100 uppercase tracking-wide">
              AI Action Recommendation Engine
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400">
              Prescriptive Optimization v3.0
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Data-backed operational interventions synthesising prospectivity targets, fleet health anomalies, and weather vulnerabilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded">
            {recommendations.length} Action Directives Available
          </span>
        </div>
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const isCritical = rec.severity === 'CRITICAL';
          const isApproved = rec.status === 'Approved';
          const isExecuted = rec.status === 'Executed';

          return (
            <div
              key={rec.id}
              className={`p-5 rounded-lg border transition-all space-y-3.5 ${
                isCritical
                  ? 'bg-neutral-900/90 border-rose-500/40 shadow-lg'
                  : 'bg-neutral-900/80 border-neutral-800'
              }`}
            >
              {/* Header line */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {rec.severity}
                  </span>
                  <span className="font-bold text-neutral-100 text-sm">{rec.problem}</span>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-cyan-400">Confidence: {rec.confidencePct}%</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] ${
                      isExecuted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : isApproved
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>
              </div>

              {/* Underlying Evidence */}
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Ground Evidence:
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-xs text-neutral-300">
                  {rec.evidence.map((ev, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {ev}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Action */}
              <div className="p-3 rounded bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 leading-relaxed">
                <strong className="text-amber-400">Action Plan: </strong>
                {rec.recommendedAction}
              </div>

              {/* Impact & Trade-Off Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 space-y-0.5">
                  <div className="font-bold text-[10px] uppercase">Expected Operational Impact</div>
                  <div>{rec.expectedImpact}</div>
                </div>

                <div className="p-2.5 rounded bg-amber-950/20 border border-amber-500/30 text-amber-300 space-y-0.5">
                  <div className="font-bold text-[10px] uppercase">Operational Trade-Off</div>
                  <div>{rec.tradeOff}</div>
                </div>
              </div>

              {/* Affected Assets & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-neutral-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 text-[11px]">Affected Assets:</span>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                    {rec.affectedAssets.map((asset, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300">
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isApproved && !isExecuted && (
                    <button
                      onClick={() => handleUpdateStatus(rec.id, 'Approved')}
                      disabled={processingId === rec.id}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded font-medium transition-colors"
                    >
                      Approve Action
                    </button>
                  )}

                  {!isExecuted && (
                    <button
                      onClick={() => handleUpdateStatus(rec.id, 'Executed')}
                      disabled={processingId === rec.id}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded transition-colors shadow-sm"
                    >
                      Authorize & Execute
                    </button>
                  )}

                  {isExecuted && (
                    <span className="text-emerald-400 font-mono flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      <span>Mitigation Executed</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
