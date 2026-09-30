import React, { useState } from 'react';
import {
  WeatherObservation,
  SatelliteScene,
} from '../types/mining';
import {
  CloudSun,
  Satellite,
  CloudRain,
  Layers,
  Thermometer,
  Wind,
  Droplets,
  Calendar,
  Radio,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface WeatherSatelliteViewProps {
  weather: WeatherObservation;
  forecast14Days: WeatherObservation[];
  scenes: SatelliteScene[];
}

export const WeatherSatelliteView: React.FC<WeatherSatelliteViewProps> = ({
  weather,
  forecast14Days,
  scenes,
}) => {
  const [selectedScene, setSelectedScene] = useState<SatelliteScene>(scenes[0] || null);
  const [activeBandCombo, setActiveBandCombo] = useState<string>('iron-oxide');

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <Satellite className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-neutral-100 uppercase tracking-wide">
              Weather Telemetry & Space-Borne Satellite Remote Sensing
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400">
              Copernicus & IMD Doppler Ingestion
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time space observation architecture integrating Sentinel-2 multispectral, Sentinel-1 SAR, Landsat-9, and local precipitation radar.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">
            Sentinel-2 BOA: Cloud 3.4%
          </span>
        </div>
      </div>

      {/* Part 1: Weather Telemetry Connected to Production Risk */}
      <div className="p-4 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-xs">
          <span className="font-semibold text-neutral-200 flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-amber-400" />
            <span>Weather Intelligence & Haul Road Impact Forecasting</span>
          </span>
          <span className="text-rose-400 font-mono text-[11px]">
            Peak Monsoon Cell Arriving Oct 01 (48mm)
          </span>
        </div>

        {/* 7-Day Weather Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {forecast14Days.slice(0, 7).map((w) => {
            const isHeavyRain = w.rainfallMm >= 25;
            return (
              <div
                key={w.date}
                className={`p-3 rounded-lg border text-center text-xs space-y-1 ${
                  isHeavyRain
                    ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                }`}
              >
                <div className="text-[10px] font-mono text-neutral-400">{w.date}</div>
                <div className="text-base font-bold font-mono">
                  {w.rainfallMm} <span className="text-[10px] font-normal text-neutral-400">mm</span>
                </div>
                <div className="text-[10px] text-neutral-400">Temp: {w.temperatureC}°C</div>
                <div className="text-[9px] font-mono text-amber-300 truncate">
                  Road: {w.haulRoadCondition.split(' - ')[0]}
                </div>
                <div className="text-[10px] font-mono text-rose-400 font-bold pt-0.5 border-t border-neutral-800">
                  Derate: {Math.round(w.equipmentDeratingFactor * 100)}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Physical Mechanism Chain */}
        <div className="p-3 rounded bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-1">
          <strong className="text-amber-400">Direct Weather-to-Production Coupling:</strong>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            When precipitation exceeds 25mm, pit ramp slip coefficient increases by 55%, forcing haul speeds from 28 km/h down to 14 km/h. This reduces dumper cycles from 4.2 to 2.4 cycles/shift, creating a -1,536 TPD delivery gap at the primary crusher feed hopper.
          </p>
        </div>
      </div>

      {/* Part 2: Satellite Scenes Explorer & Multi-Spectral Mineral Indices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Satellite Scenes List (6 cols) */}
        <div className="lg:col-span-6 flex flex-col space-y-3">
          <div className="rounded-lg bg-neutral-900/80 border border-neutral-800 overflow-hidden text-xs">
            <div className="px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
              <span className="font-semibold text-neutral-200">Satellite Acquisition Catalog ({scenes.length})</span>
              <span className="text-[10px] font-mono text-neutral-400">Copernicus / USGS / ISRO</span>
            </div>

            <div className="divide-y divide-neutral-800/80">
              {scenes.map((scene) => {
                const isSelected = selectedScene?.id === scene.id;
                return (
                  <div
                    key={scene.id}
                    onClick={() => setSelectedScene(scene)}
                    className={`p-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-neutral-800 text-white' : 'hover:bg-neutral-900/60 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300 font-sans">{scene.sensor}</span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {scene.acquisitionDate.split('T')[0]}
                      </span>
                    </div>

                    <div className="text-[11px] text-neutral-400 font-mono truncate mt-0.5">
                      {scene.id}
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-neutral-400 mt-1 font-mono">
                      <span>Res: {scene.resolutionMeters}m</span>
                      <span>Cloud: {scene.cloudCoverPct}%</span>
                      <span className="text-emerald-400">{scene.processingStatus.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Selected Scene Spectral Processing (6 cols) */}
        <div className="lg:col-span-6 flex flex-col space-y-3 text-xs">
          {selectedScene && (
            <div className="p-4 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-4">
              <div className="border-b border-neutral-800 pb-2">
                <div className="font-bold text-neutral-100 text-sm">{selectedScene.sensor}</div>
                <div className="text-neutral-400 text-xs font-mono mt-0.5">
                  Acquired: {selectedScene.acquisitionDate} · Resolution: {selectedScene.resolutionMeters}m GSD
                </div>
              </div>

              {/* Spectral Band Ratios Config */}
              <div className="space-y-2">
                <div className="font-semibold text-neutral-200">Computed Mineral Alteration Indices:</div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {selectedScene.spectralIndicesComputed.map((idxName, idx) => (
                    <div key={idx} className="p-2 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                      <span className="text-neutral-200">{idxName}</span>
                      <span className="text-emerald-400 text-[10px]">Calibrated</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Band Specifications */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                <div className="font-semibold text-neutral-200">Available Sensor Bands:</div>
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  {selectedScene.bandsAvailable.map((band, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300">
                      {band}
                    </span>
                  ))}
                </div>
              </div>

              {/* Processing Pipeline Note */}
              <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400">
                <strong className="text-neutral-300">Server-Side Tile Engine:</strong> Large raster tiles are processed via GDAL/Rasterio on backend to prevent browser memory saturation.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
