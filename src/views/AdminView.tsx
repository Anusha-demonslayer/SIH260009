import React, { useState, useEffect } from 'react';
import { fetchModels, fetchSatelliteScenes } from '../services/api';
import {
  Settings,
  Cpu,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Database,
  Radio,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const [models, setModels] = useState<any[]>([]);
  const [connectors, setConnectors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [mRes, sRes] = await Promise.all([fetchModels(), fetchSatelliteScenes()]);
      if (mRes.success) setModels(mRes.models);
      if (sRes.success) setConnectors(sRes.connectorsStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-neutral-100 uppercase tracking-wide">
              Model Health, Drift Monitoring & Space Data Connectors
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400">
              MLOps Central Dashboard
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time tracking of AI model versions, covariate shift, data pipeline freshness, and external geospatial APIs.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Models Grid */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-neutral-200">
          Deployed Machine Learning Production Models ({models.length})
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {models.map((mod) => (
            <div key={mod.id} className="p-4 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div>
                  <div className="font-bold text-neutral-100 text-sm">{mod.name}</div>
                  <div className="text-[10px] font-mono text-neutral-400">{mod.id}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-950 border border-neutral-800 text-amber-300">
                  {mod.version}
                </span>
              </div>

              <div className="space-y-1 font-mono text-[11px] text-neutral-300">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Algorithm:</span>
                  <span className="text-neutral-200 text-right truncate max-w-[180px]">{mod.algorithm.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Training Samples:</span>
                  <span className="text-neutral-200">{mod.trainingSamples.toLocaleString()} rows</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Feature Dimensions:</span>
                  <span className="text-neutral-200">{mod.featuresCount} features</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Last Retrained:</span>
                  <span className="text-neutral-200">{mod.trainingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Covariate Drift:</span>
                  <span className="text-emerald-400">{mod.driftStatus}</span>
                </div>
              </div>

              {/* Verified Metrics Badge */}
              <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800 space-y-1 font-mono text-[10px]">
                <div className="text-neutral-500 uppercase">{mod.metrics.label}</div>
                <div className="flex flex-wrap gap-2 text-cyan-300 font-bold">
                  {mod.metrics.rocAuc && <span>ROC-AUC: {mod.metrics.rocAuc}</span>}
                  {mod.metrics.f1Score && <span>F1: {mod.metrics.f1Score}</span>}
                  {mod.metrics.maeTonnes && <span>MAE: {mod.metrics.maeTonnes} T</span>}
                  {mod.metrics.r2Score && <span>R²: {mod.metrics.r2Score}</span>}
                  {mod.metrics.precision && <span>Prec: {mod.metrics.precision}</span>}
                  {mod.metrics.recall && <span>Rec: {mod.metrics.recall}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* External Data Connectors & APIs Status */}
      <div className="p-4 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-3 text-xs">
        <div className="font-semibold text-neutral-200 border-b border-neutral-800 pb-2 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>Geospatial & Operational Data Connectors Architecture</span>
          </span>
          <span className="text-emerald-400 font-mono text-[11px]">All Services Nominal</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
          {connectors.map((c, idx) => (
            <div key={idx} className="p-3 rounded bg-neutral-950 border border-neutral-800 space-y-1">
              <div className="font-bold text-neutral-200 font-sans text-xs truncate">
                {c.provider.split(' (')[0]}
              </div>
              <div className="text-[10px] text-emerald-400">{c.status}</div>
              <div className="text-[10px] text-neutral-500">Latency: {c.latencyMs} ms</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
