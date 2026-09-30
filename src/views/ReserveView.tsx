import React, { useState } from 'react';
import {
  Mine,
  ReserveBlock,
  DrillHole,
} from '../types/mining';
import { runIdwReserveEstimate } from '../services/api';
import {
  Layers,
  Sparkles,
  Sliders,
  ShieldAlert,
  Database,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ReserveViewProps {
  activeMine: Mine;
  reserveBlocks: ReserveBlock[];
  drillHoles: DrillHole[];
  onRefreshReserves?: () => void;
}

export const ReserveView: React.FC<ReserveViewProps> = ({
  activeMine,
  reserveBlocks,
  drillHoles,
  onRefreshReserves,
}) => {
  const [selectedBlock, setSelectedBlock] = useState<ReserveBlock>(reserveBlocks[0] || null);

  // IDW Parameters
  const [idwPower, setIdwPower] = useState(2);
  const [searchRadiusKm, setSearchRadiusKm] = useState(1.5);
  const [gridResolution, setGridResolution] = useState(15);
  const [isCalculatingIdw, setIsCalculatingIdw] = useState(false);
  const [idwResult, setIdwResult] = useState<any>(null);

  const handleRunIdw = async () => {
    setIsCalculatingIdw(true);
    try {
      const res = await runIdwReserveEstimate({
        mineId: activeMine.id,
        power: idwPower,
        searchRadiusKm,
        gridResolution,
      });
      if (res.success) {
        setIdwResult(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCalculatingIdw(false);
    }
  };

  const totalMt = reserveBlocks.reduce((acc, b) => acc + b.estimatedTonnageMt, 0);
  const avgGrade =
    reserveBlocks.length > 0
      ? Number(
          (
            reserveBlocks.reduce((acc, b) => acc + b.estimatedGradeMn * b.estimatedTonnageMt, 0) /
            totalMt
          ).toFixed(1)
        )
      : 43.8;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-neutral-100 uppercase tracking-wide">
              Reserve Intelligence & Geostatistical Spatial Modeling
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400">
              UNFC-1997 / JORC Protocol
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Inverse Distance Weighting (IDW) 2D/3D interpolation fusing verified diamond-core assays with geological boundaries.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-right">
            <div className="text-[10px] text-neutral-500 uppercase">Estimated Resource</div>
            <div className="text-sm font-bold text-emerald-400">{totalMt.toFixed(2)} Mt @ {avgGrade}% Mn</div>
          </div>
        </div>
      </div>

      {/* Mandatory Ground Validation Warning Banner */}
      <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">Mandatory Mineral Resource Classification Disclaimer</div>
          <p className="text-amber-200/80 leading-relaxed text-[11px]">
            Satellite imagery and remote-sensing surface signals alone DO NOT prove subsurface underground manganese reserves. All estimated tonnage, grade intervals, and block models shown below are derived from geostatistical spatial interpolation (IDW/Kriging) of actual core drill-holes and <strong>strictly require ground validation</strong> (in-fill diamond core drilling and laboratory XRF chemical assay) prior to formal reserve certification.
          </p>
        </div>
      </div>

      {/* Main Grid: IDW Controller (4 cols) + Reserve Blocks & Assays (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left: IDW Spatial Interpolator (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          <div className="p-4 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Geostatistical IDW Parameters</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">2D Spatial Grid</span>
            </div>

            <div className="space-y-3">
              {/* Distance Power */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Distance Weighting Power (p)</span>
                  <span className="font-mono text-amber-400">{idwPower}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={idwPower}
                  onChange={(e) => setIdwPower(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="text-[10px] text-neutral-500">p=2 is standard inverse square weighting</div>
              </div>

              {/* Search Radius */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Search Neighborhood Radius</span>
                  <span className="font-mono text-amber-400">{searchRadiusKm} km</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={searchRadiusKm}
                  onChange={(e) => setSearchRadiusKm(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="text-[10px] text-neutral-500">Radius of influence surrounding drill collars</div>
              </div>

              {/* Grid Resolution */}
              <div>
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Grid Discretization Steps</span>
                  <span className="font-mono text-amber-400">{gridResolution} x {gridResolution}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="30"
                  step="5"
                  value={gridResolution}
                  onChange={(e) => setGridResolution(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="text-[10px] text-neutral-500">Computational cell density for concession block</div>
              </div>
            </div>

            <button
              onClick={handleRunIdw}
              disabled={isCalculatingIdw}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {isCalculatingIdw ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Interpolating Borehole Assays...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Execute IDW Spatial Interpolation</span>
                </>
              )}
            </button>
          </div>

          {/* IDW Result Statistics */}
          {idwResult && (
            <div className="p-3.5 rounded-lg bg-neutral-900/90 border border-cyan-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between text-cyan-400 font-semibold">
                <span>Interpolation Matrix Output</span>
                <span className="font-mono text-[10px] text-neutral-400">
                  {idwResult.estimatedGridCount} Points Computed
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Algorithm: {idwResult.algorithm} using {idwResult.parameters.drillPointsUsed} verified diamond drill holes.
              </p>
              <div className="text-[10px] font-mono text-neutral-400 pt-1 border-t border-neutral-800">
                Notice: {idwResult.groundValidationNote}
              </div>
            </div>
          )}

          {/* Confidence Category Guidelines */}
          <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs space-y-2">
            <div className="font-semibold text-neutral-300">Confidence Category Definitions</div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-400">HIGH CONFIDENCE:</strong> Verified by dense diamond-drill holes (&lt;150m spacing) with certified laboratory chemical assay.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-cyan-400">MEDIUM CONFIDENCE:</strong> Geostatistically interpolated via IDW with moderate borehole coverage (&lt;400m).
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-400">LOW CONFIDENCE:</strong> Geological extrapolation along regional strike. Requires in-fill validation core drilling.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Reserve Blocks + Drill Hole Assays (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* Estimated Reserve Blocks Table */}
          <div className="rounded-lg bg-neutral-900/80 border border-neutral-800 overflow-hidden text-xs">
            <div className="px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
              <span className="font-semibold text-neutral-200">Potential Resource Blocks ({reserveBlocks.length})</span>
              <span className="text-[10px] font-mono text-neutral-400">
                Sum: {totalMt.toFixed(2)} Mt
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-800 text-[10px] text-neutral-500 uppercase tracking-wider bg-neutral-950/50">
                    <th className="px-3 py-2">Block Identifier</th>
                    <th className="px-3 py-2 text-right">Depth (m)</th>
                    <th className="px-3 py-2 text-right">Est. Tonnes</th>
                    <th className="px-3 py-2 text-right">Grade (% Mn)</th>
                    <th className="px-3 py-2">Confidence Level</th>
                    <th className="px-3 py-2">Evidence Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono">
                  {reserveBlocks.map((block) => {
                    const isSelected = selectedBlock?.id === block.id;
                    const badgeColor =
                      block.confidenceCategory === 'HIGH CONFIDENCE'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : block.confidenceCategory === 'MEDIUM CONFIDENCE'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30';

                    return (
                      <tr
                        key={block.id}
                        onClick={() => setSelectedBlock(block)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-neutral-800/80 text-white' : 'hover:bg-neutral-900/60 text-neutral-300'
                        }`}
                      >
                        <td className="px-3 py-2.5 font-sans font-medium text-neutral-200">
                          {block.blockName}
                        </td>
                        <td className="px-3 py-2.5 text-right text-neutral-400">
                          {block.depthMeters}m
                        </td>
                        <td className="px-3 py-2.5 text-right font-bold text-emerald-400">
                          {block.estimatedTonnageMt} Mt
                        </td>
                        <td className="px-3 py-2.5 text-right font-bold text-amber-400">
                          {block.estimatedGradeMn}%
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-sans border ${badgeColor}`}>
                            {block.confidenceCategory}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-sans text-neutral-400 text-[11px]">
                          {block.evidenceLevel}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Drill-Hole Core Assays Table */}
          <div className="rounded-lg bg-neutral-900/80 border border-neutral-800 overflow-hidden text-xs">
            <div className="px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
              <span className="font-semibold text-neutral-200">Verified Diamond Drill Hole Assays ({drillHoles.length})</span>
              <span className="text-[10px] font-mono text-emerald-400">Laboratory Chemical Assays</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-800 text-[10px] text-neutral-500 uppercase tracking-wider bg-neutral-950/50">
                    <th className="px-3 py-2">Borehole Code</th>
                    <th className="px-3 py-2 text-right">Depth (m)</th>
                    <th className="px-3 py-2 text-right">Intercept (m)</th>
                    <th className="px-3 py-2 text-right">% Mn</th>
                    <th className="px-3 py-2 text-right">% Fe</th>
                    <th className="px-3 py-2 text-right">% P</th>
                    <th className="px-3 py-2">Host Lithology</th>
                    <th className="px-3 py-2">Assay Laboratory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono">
                  {drillHoles.map((dh) => (
                    <tr key={dh.id} className="hover:bg-neutral-900/60 text-neutral-300">
                      <td className="px-3 py-2 font-sans font-medium text-cyan-300">
                        {dh.code}
                      </td>
                      <td className="px-3 py-2 text-right text-neutral-400">
                        {dh.totalDepthMeters}m
                      </td>
                      <td className="px-3 py-2 text-right text-neutral-300">
                        {dh.interceptDepthFromMeters} - {dh.interceptDepthToMeters}m
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-amber-400">
                        {dh.mnGradePercentage}%
                      </td>
                      <td className="px-3 py-2 text-right text-neutral-400">
                        {dh.fePercentage}%
                      </td>
                      <td className="px-3 py-2 text-right text-neutral-400">
                        {dh.phosphorusPercentage}%
                      </td>
                      <td className="px-3 py-2 font-sans text-neutral-300 text-[11px] truncate max-w-[140px]">
                        {dh.lithology}
                      </td>
                      <td className="px-3 py-2 font-sans text-neutral-400 text-[10px] truncate max-w-[120px]">
                        {dh.verifiedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
