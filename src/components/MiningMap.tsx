import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Mine,
  ExplorationTarget,
  DrillHole,
  ReserveBlock,
  EquipmentAsset,
} from '../types/mining';
import {
  Layers,
  Eye,
  EyeOff,
  Crosshair,
  Maximize2,
  Info,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface MiningMapProps {
  activeMine: Mine;
  targets: ExplorationTarget[];
  drillHoles: DrillHole[];
  reserveBlocks: ReserveBlock[];
  equipment?: EquipmentAsset[];
  onSelectTarget?: (target: ExplorationTarget) => void;
  onSelectDrillHole?: (drill: DrillHole) => void;
}

export const MiningMap: React.FC<MiningMapProps> = ({
  activeMine,
  targets,
  drillHoles,
  reserveBlocks,
  equipment = [],
  onSelectTarget,
  onSelectDrillHole,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{
    targets: L.LayerGroup;
    drills: L.LayerGroup;
    reserves: L.LayerGroup;
    equipment: L.LayerGroup;
    mineBoundary: L.LayerGroup;
  } | null>(null);

  const [visibleLayers, setVisibleLayers] = useState({
    targets: true,
    drills: true,
    reserves: true,
    equipment: true,
    mineBoundary: true,
  });

  const [selectedTarget, setSelectedTarget] = useState<ExplorationTarget | null>(null);
  const [baseMapType, setBaseMapType] = useState<'dark' | 'satellite'>('dark');
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: activeMine.coordinates,
      zoom: 13,
      zoomControl: false,
    });

    // Dark Matter tile layer
    const darkTiles = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    baseTileLayerRef.current = darkTiles;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Create layer groups
    const targetGroup = L.layerGroup().addTo(map);
    const drillGroup = L.layerGroup().addTo(map);
    const reserveGroup = L.layerGroup().addTo(map);
    const equipmentGroup = L.layerGroup().addTo(map);
    const boundaryGroup = L.layerGroup().addTo(map);

    layerGroupsRef.current = {
      targets: targetGroup,
      drills: drillGroup,
      reserves: reserveGroup,
      equipment: equipmentGroup,
      mineBoundary: boundaryGroup,
    };

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center when mine changes
  useEffect(() => {
    if (mapInstanceRef.current && activeMine) {
      mapInstanceRef.current.setView(activeMine.coordinates, 13, { animate: true });
    }
  }, [activeMine]);

  // Toggle base tile layer
  const toggleBaseMap = (type: 'dark' | 'satellite') => {
    if (!mapInstanceRef.current || !baseTileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(baseTileLayerRef.current);

    if (type === 'satellite') {
      baseTileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye',
          maxZoom: 18,
        }
      ).addTo(mapInstanceRef.current);
    } else {
      baseTileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(mapInstanceRef.current);
    }
    setBaseMapType(type);
  };

  // Populate layers
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupsRef.current) return;
    const { targets: tGroup, drills: dGroup, reserves: rGroup, equipment: eqGroup, mineBoundary: bGroup } =
      layerGroupsRef.current;

    // Clear existing
    tGroup.clearLayers();
    dGroup.clearLayers();
    rGroup.clearLayers();
    eqGroup.clearLayers();
    bGroup.clearLayers();

    // 1. Mine Boundary
    if (visibleLayers.mineBoundary && activeMine.bounds) {
      const [[minLat, minLng], [maxLat, maxLng]] = activeMine.bounds;
      const boundsPolygon = [
        [minLat, minLng],
        [minLat, maxLng],
        [maxLat, maxLng],
        [maxLat, minLng],
      ] as L.LatLngExpression[];

      L.polygon(boundsPolygon, {
        color: '#f59e0b',
        weight: 1.5,
        dashArray: '4, 4',
        fillColor: '#f59e0b',
        fillOpacity: 0.04,
      })
        .bindTooltip(`${activeMine.name} Concession Boundary`, { sticky: true })
        .addTo(bGroup);
    }

    // 2. Reserve Blocks
    if (visibleLayers.reserves) {
      reserveBlocks.forEach((block) => {
        const color =
          block.confidenceCategory === 'HIGH CONFIDENCE'
            ? '#10b981'
            : block.confidenceCategory === 'MEDIUM CONFIDENCE'
            ? '#38bdf8'
            : '#f59e0b';

        L.polygon(block.bounds as L.LatLngExpression[], {
          color,
          weight: 1.5,
          fillColor: color,
          fillOpacity: 0.22,
        })
          .bindTooltip(
            `<strong>${block.blockName}</strong><br/>Grade: ${block.estimatedGradeMn}% Mn | Ton: ${block.estimatedTonnageMt} Mt<br/><span style="color:${color}">${block.confidenceCategory}</span>`,
            { sticky: true }
          )
          .addTo(rGroup);
      });
    }

    // 3. Drill Holes
    if (visibleLayers.drills) {
      drillHoles.forEach((hole) => {
        const marker = L.circleMarker(hole.coordinates, {
          radius: 6,
          fillColor: '#06b6d4',
          color: '#ffffff',
          weight: 1.5,
          fillOpacity: 0.9,
        });

        marker.bindTooltip(
          `<strong>${hole.code}</strong><br/>Mn Grade: ${hole.mnGradePercentage}% | Depth: ${hole.totalDepthMeters}m<br/>Lithology: ${hole.lithology}`,
          { sticky: true }
        );

        marker.on('click', () => {
          if (onSelectDrillHole) onSelectDrillHole(hole);
        });

        marker.addTo(dGroup);
      });
    }

    // 4. Exploration Targets (Prospectivity Hotspots)
    if (visibleLayers.targets) {
      targets.forEach((target) => {
        const score = target.prospectivityScore;
        const color = score >= 85 ? '#ef4444' : score >= 75 ? '#f59e0b' : '#eab308';

        // Outer pulsing ring
        L.circle(target.coordinates, {
          radius: 220,
          color,
          weight: 1,
          fillColor: color,
          fillOpacity: 0.15,
        }).addTo(tGroup);

        // Core marker
        const marker = L.circleMarker(target.coordinates, {
          radius: 9,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          fillOpacity: 0.95,
        });

        marker.bindTooltip(
          `<strong>${target.name}</strong><br/>Prospectivity: <span style="font-weight:bold;color:${color}">${target.prospectivityScore}/100</span><br/>Confidence: ${target.confidenceScore}% | Est: ${target.estimatedResourcePotentialMt} Mt`,
          { sticky: true }
        );

        marker.on('click', () => {
          setSelectedTarget(target);
          if (onSelectTarget) onSelectTarget(target);
        });

        marker.addTo(tGroup);
      });
    }

    // 5. Equipment
    if (visibleLayers.equipment) {
      equipment.forEach((eq) => {
        const marker = L.circleMarker(eq.coordinates, {
          radius: 5,
          fillColor: eq.failureRiskPct > 70 ? '#ef4444' : '#10b981',
          color: '#000000',
          weight: 1,
          fillOpacity: 0.85,
        });

        marker.bindTooltip(
          `<strong>${eq.code} (${eq.category})</strong><br/>Risk: ${eq.failureRiskPct}% | Status: ${eq.maintenanceStatus}<br/>Location: ${eq.location}`,
          { sticky: true }
        );

        marker.addTo(eqGroup);
      });
    }
  }, [targets, drillHoles, reserveBlocks, equipment, visibleLayers, activeMine]);

  const toggleLayer = (key: keyof typeof visibleLayers) => {
    setVisibleLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative w-full h-full min-h-[420px] bg-neutral-950 overflow-hidden flex">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls & Layer Selector */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <div className="bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded p-2 text-xs shadow-lg space-y-1.5 w-48">
          <div className="flex items-center justify-between text-neutral-400 font-medium pb-1 border-b border-neutral-800">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>GIS Layers</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleBaseMap('dark')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  baseMapType === 'dark' ? 'bg-neutral-800 text-neutral-200' : 'text-neutral-500'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => toggleBaseMap('satellite')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  baseMapType === 'satellite' ? 'bg-neutral-800 text-neutral-200' : 'text-neutral-500'
                }`}
              >
                Sat
              </button>
            </div>
          </div>

          <div className="space-y-1 pt-0.5 text-neutral-300">
            <label className="flex items-center justify-between hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Target Zones ({targets.length})</span>
              </span>
              <input
                type="checkbox"
                checked={visibleLayers.targets}
                onChange={() => toggleLayer('targets')}
                className="accent-amber-500"
              />
            </label>

            <label className="flex items-center justify-between hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Drill Holes ({drillHoles.length})</span>
              </span>
              <input
                type="checkbox"
                checked={visibleLayers.drills}
                onChange={() => toggleLayer('drills')}
                className="accent-cyan-400"
              />
            </label>

            <label className="flex items-center justify-between hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span>Reserve Blocks ({reserveBlocks.length})</span>
              </span>
              <input
                type="checkbox"
                checked={visibleLayers.reserves}
                onChange={() => toggleLayer('reserves')}
                className="accent-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between hover:text-white cursor-pointer select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Active Fleet ({equipment.length})</span>
              </span>
              <input
                type="checkbox"
                checked={visibleLayers.equipment}
                onChange={() => toggleLayer('equipment')}
                className="accent-rose-500"
              />
            </label>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded p-2 text-[11px] shadow-lg text-neutral-400 space-y-1 w-48">
          <div className="font-medium text-neutral-300">Prospectivity Heatmap</div>
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span>Low (&lt;70)</span>
            <span>Mid (70-84)</span>
            <span>High (&ge;85)</span>
          </div>
          <div className="h-1.5 w-full rounded bg-gradient-to-r from-yellow-500 via-amber-500 to-red-500" />
        </div>
      </div>

      {/* Target Inspection Flyout Panel */}
      {selectedTarget && (
        <div className="absolute top-3 right-3 z-10 w-96 max-h-[92%] overflow-y-auto bg-neutral-900/95 backdrop-blur border border-neutral-700/80 rounded shadow-2xl p-4 text-xs space-y-3">
          <div className="flex items-start justify-between border-b border-neutral-800 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-100 text-sm">{selectedTarget.name}</span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                {selectedTarget.coordinates[0].toFixed(4)}°N, {selectedTarget.coordinates[1].toFixed(4)}°E
              </div>
            </div>
            <button
              onClick={() => setSelectedTarget(null)}
              className="text-neutral-400 hover:text-white px-1.5 py-0.5 text-sm"
            >
              ✕
            </button>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
              <div className="text-[10px] text-neutral-500 uppercase">Prospectivity</div>
              <div className="text-base font-bold font-mono text-amber-400">
                {selectedTarget.prospectivityScore}/100
              </div>
            </div>
            <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
              <div className="text-[10px] text-neutral-500 uppercase">AI Confidence</div>
              <div className="text-base font-bold font-mono text-cyan-400">
                {selectedTarget.confidenceScore}%
              </div>
            </div>
            <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
              <div className="text-[10px] text-neutral-500 uppercase">Resource Est.</div>
              <div className="text-base font-bold font-mono text-emerald-400">
                {selectedTarget.estimatedResourcePotentialMt} Mt
              </div>
            </div>
          </div>

          {/* Geological & Priority Metadata */}
          <div className="space-y-1.5 text-neutral-300">
            <div className="flex justify-between">
              <span className="text-neutral-400">Host Lithology:</span>
              <span className="font-medium text-right text-neutral-200">{selectedTarget.geologicalFeatures.lithologyMatch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Expected Grade:</span>
              <span className="font-mono text-amber-300">{selectedTarget.expectedGradeRange}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Drilling Priority:</span>
              <span className="font-mono text-emerald-300">{selectedTarget.drillingPriority}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Validation Status:</span>
              <span className="text-amber-400 font-medium">{selectedTarget.validationStatus}</span>
            </div>
          </div>

          {/* SHAP Contributors */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-800">
            <div className="font-semibold text-neutral-200 flex items-center justify-between">
              <span>Why This Target? (SHAP Explainability)</span>
            </div>
            <div className="space-y-1">
              {selectedTarget.shapContributions.map((shap, idx) => (
                <div key={idx} className="p-1.5 rounded bg-neutral-950/60 border border-neutral-800 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-neutral-300">{shap.feature}</span>
                    <span className={`font-mono font-bold ${shap.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {shap.isPositive ? '+' : ''}{shap.impactPercentage}%
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{shap.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Trail */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-800">
            <div className="font-semibold text-neutral-200">AI Evidence Trail</div>
            <div className="space-y-1">
              {selectedTarget.aiEvidenceTrail.map((trail, idx) => (
                <div key={idx} className="p-1.5 rounded bg-neutral-950 border border-neutral-800 text-[11px]">
                  <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400">
                    <span>{trail.step}</span>
                    <span className={trail.status === 'Verified' ? 'text-emerald-400' : 'text-amber-400'}>
                      {trail.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300 mt-0.5">{trail.evidence}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ground Validation Notice */}
          <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 space-y-1">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Ground Validation Required</span>
            </div>
            <p className="text-[10px] text-amber-200/80 leading-relaxed">
              Manganese prospectivity derived from multi-spectral SWIR and SAR backscatter represents exploration targets. UNFC/IBM resource estimation mandates core diamond drilling and chemical assay confirmation.
            </p>
          </div>

          {/* Hash & Close */}
          <div className="text-[10px] font-mono text-neutral-500 break-all pt-1 border-t border-neutral-800">
            SHA-256: {selectedTarget.evidenceHash}
          </div>
        </div>
      )}
    </div>
  );
};
