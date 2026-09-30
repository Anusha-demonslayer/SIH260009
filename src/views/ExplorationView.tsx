import React, { useState } from 'react';
import {
  Mine,
  ExplorationTarget,
} from '../types/mining';
import { runProspectivityPrediction } from '../services/api';
import {
  Compass,
  Sparkles,
  Sliders,
  ChevronRight,
  ShieldAlert,
  Layers,
  Filter,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Info,
} from 'lucide-react';

interface ExplorationViewProps {
  activeMine: Mine;
  targets: ExplorationTarget[];
  onSelectTarget: (target: ExplorationTarget) => void;
  onRefreshTargets: () => void;
}

export const ExplorationView: React.FC<ExplorationViewProps> = ({
  activeMine,
  targets,
  onSelectTarget,
  onRefreshTargets,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<ExplorationTarget>(targets[0] || null);

  // Model parameters
  const [spectralWeight, setSpectralWeight] = useState(0.35);
  const [radarWeight, setRadarWeight] = useState(0.25);
  const [terrainWeight, setTerrainWeight] = useState(0.2);
  const [geologyWeight, setGeologyWeight] = useState(0.2);
  const [newTargetName, setNewTargetName] = useState('West Ridge Extension Anomaly');
  const [isRunningModel, setIsRunningModel] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('ALL');

  const handleRunInference = async () => {
    setIsRunningModel(true);
    try {
      const res = await runProspectivityPrediction({
        mineId: activeMine.id,
        targetName: newTargetName,
        coordinates: [
          Number((activeMine.coordinates[0] + (Math.random() - 0.5) * 0.02).toFixed(4)),
          Number((activeMine.coordinates[1] + (Math.random() - 0.5) * 0.02).toFixed(4)),
        ],
        spectralWeight,
        radarWeight,
        terrainWeight,
        geologyWeight,
      });

      if (res.success && res.data) {
        setSelectedTarget(res.data);
        onRefreshTargets();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningModel(false);
    }
  };

  const filteredTargets = targets.filter((t) => {
    if (filterPriority === 'ALL') return true;
    return t.drillingPriority.toLowerCase().includes(filterPriority.toLowerCase());
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-neutral-100 uppercase tracking-wide">
              Mineral Prospectivity & Exploration Intelligence
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400">
              {activeMine.geologicalFormation}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Space-borne multi-spectral, SAR roughness, and Sausar Group stratigraphic feature fusion pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-neutral-400 font-mono">
            {targets.length} Target Zones Identified
          </div>
          <button
            onClick={onRefreshTargets}
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
            title="Refresh Target Pipeline"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Parameters / Execution Panel + Targets Table + SHAP Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left Column: Interactive ML Pipeline Configurator (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          <div className="p-4 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Feature Weighting Engine</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">XGBoost v3.2</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-neutral-400 block mb-1">Target Anomaly Label</label>
                <input
                  type="text"
                  value={newTargetName}
                  onChange={(e) => setNewTargetName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Spectral Weight */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Spectral Index (SWIR/VNIR ratios)</span>
                  <span className="font-mono text-amber-400">{(spectralWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.6"
                  step="0.05"
                  value={spectralWeight}
                  onChange={(e) => setSpectralWeight(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="text-[10px] text-neutral-500">Sentinel-2 B11/B12 Hydroxyl & B04/B02 Iron Oxide ratios</div>
              </div>

              {/* Radar Weight */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>SAR Roughness (Sentinel-1)</span>
                  <span className="font-mono text-amber-400">{(radarWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={radarWeight}
                  onChange={(e) => setRadarWeight(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="text-[10px] text-neutral-500">VV/VH Cross-Polarization & Subsurface Roughness</div>
              </div>

              {/* Geology Match */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Geological Stratigraphy Match</span>
                  <span className="font-mono text-amber-400">{(geologyWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={geologyWeight}
                  onChange={(e) => setGeologyWeight(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="text-[10px] text-neutral-500">Mansar Schist contact & Regional Fold Proximity</div>
              </div>

              {/* Terrain Weight */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Terrain & Slope Feasibility</span>
                  <span className="font-mono text-amber-400">{(terrainWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.4"
                  step="0.05"
                  value={terrainWeight}
                  onChange={(e) => setTerrainWeight(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="text-[10px] text-neutral-500">SRTM 30m DEM Slope & Strip-Ratio Feasibility</div>
              </div>
            </div>

            <button
              onClick={handleRunInference}
              disabled={isRunningModel}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {isRunningModel ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Satellite Spatial Inversion...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run Mineral Prospectivity Model</span>
                </>
              )}
            </button>
          </div>

          {/* Evidence Hierarchy Guideline */}
          <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-400 space-y-2">
            <div className="font-semibold text-neutral-300">Exploration Evidence Hierarchy</div>
            <div className="space-y-1.5 font-mono text-[10px]">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">01. Remote Sensing:</span>
                <span className="text-neutral-400">Multi-spectral SWIR & SAR anomaly</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">02. Geological:</span>
                <span className="text-neutral-400">Sausar Mansar Schist fold hinge</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400">03. AI Inference:</span>
                <span className="text-neutral-400">Prospectivity Score & Confidence</span>
              </div>
              <div className="flex items-center gap-2 text-rose-300 font-bold">
                <span>04. Drilling Assay:</span>
                <span>Mandatory Ground Validation Required</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right: Target Ranking Table + SHAP Explainability (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* Target List */}
          <div className="rounded-lg bg-neutral-900/80 border border-neutral-800 overflow-hidden text-xs">
            <div className="px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
              <span className="font-semibold text-neutral-200">Ranked Manganese Exploration Targets</span>
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-neutral-500" />
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 rounded px-2 py-0.5 text-neutral-300 text-[11px]"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="Tier 1">Tier 1 - Immediate</option>
                  <option value="Tier 2">Tier 2 - High</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-800 text-[10px] text-neutral-500 uppercase tracking-wider bg-neutral-950/50">
                    <th className="px-3 py-2">Target ID & Name</th>
                    <th className="px-3 py-2 text-right">Score</th>
                    <th className="px-3 py-2 text-right">Confidence</th>
                    <th className="px-3 py-2 text-right">Est. Resource</th>
                    <th className="px-3 py-2">Expected Grade</th>
                    <th className="px-3 py-2">Drilling Priority</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono">
                  {filteredTargets.map((target) => {
                    const isSelected = selectedTarget?.id === target.id;
                    return (
                      <tr
                        key={target.id}
                        onClick={() => {
                          setSelectedTarget(target);
                          onSelectTarget(target);
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-neutral-800/80 text-white' : 'hover:bg-neutral-900/60 text-neutral-300'
                        }`}
                      >
                        <td className="px-3 py-2.5 font-sans font-medium text-neutral-200">
                          {target.name}
                        </td>
                        <td className="px-3 py-2.5 text-right font-bold text-amber-400">
                          {target.prospectivityScore}/100
                        </td>
                        <td className="px-3 py-2.5 text-right text-cyan-400">
                          {target.confidenceScore}%
                        </td>
                        <td className="px-3 py-2.5 text-right text-emerald-400 font-bold">
                          {target.estimatedResourcePotentialMt} Mt
                        </td>
                        <td className="px-3 py-2.5 text-neutral-300 font-sans text-[11px]">
                          {target.expectedGradeRange}
                        </td>
                        <td className="px-3 py-2.5 text-[11px]">
                          <span
                            className={`px-1.5 py-0.2 rounded font-sans ${
                              target.drillingPriority.includes('Tier 1')
                                ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {target.drillingPriority}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-[11px] font-sans text-neutral-400">
                          {target.validationStatus}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Target Deep Explainability Card */}
          {selectedTarget && (
            <div className="p-4 rounded-lg bg-neutral-900/90 border border-neutral-700 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <div className="text-base font-bold text-neutral-100 flex items-center gap-2">
                    <span>{selectedTarget.name}</span>
                    <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.2 rounded">
                      Prospectivity: {selectedTarget.prospectivityScore}/100
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    Coordinates: {selectedTarget.coordinates[0].toFixed(4)}°N, {selectedTarget.coordinates[1].toFixed(4)}°E · Host: {selectedTarget.geologicalFeatures.lithologyMatch}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
                    Est. {selectedTarget.estimatedResourcePotentialMt} Mt @ {selectedTarget.expectedGradeRange}
                  </span>
                </div>
              </div>

              {/* WHY THIS TARGET? SHAP Feature Decomposition */}
              <div className="space-y-2">
                <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>WHY THIS TARGET? (SHAP Feature Attribution)</span>
                </div>

                <div className="space-y-1.5">
                  {selectedTarget.shapContributions.map((contrib, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-between"
                    >
                      <div className="space-y-0.5 pr-4">
                        <div className="font-medium text-neutral-200">{contrib.feature}</div>
                        <div className="text-[11px] text-neutral-400">{contrib.description}</div>
                      </div>
                      <div
                        className={`text-sm font-mono font-bold shrink-0 ${
                          contrib.isPositive ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {contrib.isPositive ? '+' : ''}{contrib.impactPercentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Evidence Trail & Ground Validation Call-to-Action */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="font-semibold text-neutral-200">AI Evidence Trail (Traceability)</div>
                <div className="space-y-1">
                  {selectedTarget.aiEvidenceTrail.map((trail, idx) => (
                    <div key={idx} className="p-2 rounded bg-neutral-950/70 border border-neutral-800/80 text-[11px]">
                      <div className="flex justify-between font-mono text-[10px] text-neutral-400">
                        <span>{trail.step}</span>
                        <span className={trail.status === 'Verified' ? 'text-emerald-400' : 'text-amber-400'}>
                          {trail.status}
                        </span>
                      </div>
                      <p className="text-neutral-300 mt-0.5">{trail.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ground Validation Rule */}
              <div className="p-3 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-xs">Recommended Next Action: Prioritize Ground Geological Validation & Drilling</div>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed">
                    Satellite remote-sensing evidence identifies prospectivity target zones. Direct resource certification under UNFC/JORC standards requires field geological trenching, core diamond drilling, and chemical laboratory assays.
                  </p>
                </div>
              </div>

              {/* SHA-256 Hash */}
              <div className="text-[10px] font-mono text-neutral-500 break-all pt-1 border-t border-neutral-800">
                Evidence Hash: SHA-256:{selectedTarget.evidenceHash}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
