import React, { useState } from 'react';
import {
  Mine,
  ExplorationTarget,
  DrillHole,
  ReserveBlock,
  EquipmentAsset,
} from '../types/mining';
import { MiningMap } from '../components/MiningMap';
import { Map, Layers, ShieldCheck, Info } from 'lucide-react';

interface ProspectivityMapViewProps {
  activeMine: Mine;
  targets: ExplorationTarget[];
  drillHoles: DrillHole[];
  reserveBlocks: ReserveBlock[];
  equipment: EquipmentAsset[];
  onSelectTarget: (target: ExplorationTarget) => void;
  onSelectDrillHole: (drill: DrillHole) => void;
}

export const ProspectivityMapView: React.FC<ProspectivityMapViewProps> = ({
  activeMine,
  targets,
  drillHoles,
  reserveBlocks,
  equipment,
  onSelectTarget,
  onSelectDrillHole,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-4 space-y-3">
      {/* View Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-amber-400" />
          <div>
            <h1 className="text-base font-bold text-neutral-100 uppercase tracking-wide">
              GIS Prospectivity & Reserve Spatial Map
            </h1>
            <p className="text-xs text-neutral-400">
              High-resolution spatial layering of Sentinel-1 SAR roughness, Sentinel-2 SWIR mineral indices, drill hole assays, and concession boundaries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>{targets.length} Target Zones</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>{drillHoles.length} Diamond Drill Holes</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span>{reserveBlocks.length} Estimated Reserve Blocks</span>
          </span>
        </div>
      </div>

      {/* Full-width Map Container */}
      <div className="flex-1 w-full min-h-[520px] rounded-lg border border-neutral-800 overflow-hidden relative">
        <MiningMap
          activeMine={activeMine}
          targets={targets}
          drillHoles={drillHoles}
          reserveBlocks={reserveBlocks}
          equipment={equipment}
          onSelectTarget={onSelectTarget}
          onSelectDrillHole={onSelectDrillHole}
        />
      </div>

      {/* Footer Spatial Note */}
      <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Coordinate Reference: WGS 84 / UTM zone 44N • Sausar Meta-sedimentary Manganese Belt</span>
        </div>
        <span className="font-mono text-neutral-500">CartoDB Dark Matter / Esri World Imagery Dual Support</span>
      </div>
    </div>
  );
};
