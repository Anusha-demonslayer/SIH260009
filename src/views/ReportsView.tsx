import React, { useState } from 'react';
import { Mine } from '../types/mining';
import { generateReport } from '../services/api';
import {
  FileSpreadsheet,
  Download,
  Printer,
  FileText,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface ReportsViewProps {
  activeMine: Mine;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ activeMine }) => {
  const [reportType, setReportType] = useState('Executive Summary');
  const [format, setFormat] = useState('PDF');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedReport, setLastGeneratedReport] = useState<any>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateReport(reportType, activeMine.id, format);
      if (res.success) {
        setLastGeneratedReport(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-neutral-100 uppercase tracking-wide">
              Regulatory Report Generator & Audit Dossiers
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400">
              IBM & Ministry of Mines Export
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Export certified exploration intelligence dossiers, production shortfall vulnerability briefings, and fleet telemetry logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Generator Configuration (4 cols) + Preview (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left: Generator Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          <div className="p-4 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-4 text-xs">
            <div className="font-semibold text-neutral-200 border-b border-neutral-800 pb-2">
              Dossier Configuration
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-neutral-400 block mb-1">Select Report Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-neutral-200 text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="Executive Summary">Executive Decision Briefing</option>
                  <option value="Exploration Intelligence">Mineral Prospectivity & Exploration Report</option>
                  <option value="Production Risk">Production Shortfall Vulnerability Audit</option>
                  <option value="Equipment Fleet Health">Heavy Equipment Predictive Maintenance Log</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Target Mine Concession</label>
                <input
                  type="text"
                  disabled
                  value={activeMine.name}
                  className="w-full bg-neutral-950/60 border border-neutral-800 rounded p-2 text-neutral-400 text-xs"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Export Format</label>
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  {['PDF', 'JSON', 'CSV'].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`p-2 rounded border text-xs transition-colors ${
                        format === fmt
                          ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Compiling Dossier...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Compile Audit Dossier</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Dossier Document Preview (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <div className="p-6 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <div className="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold">
                  MOIL LIMITED • MINING INTELLIGENCE DIVISION
                </div>
                <h2 className="text-base font-bold text-neutral-100 mt-1">
                  {lastGeneratedReport?.title || `MOIL Limited - ${reportType} - ${activeMine.name}`}
                </h2>
                <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                  Report ID: {lastGeneratedReport?.reportId || 'REP-904128'} · Date: 2026-09-29
                </div>
              </div>

              <span className="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono text-[11px]">
                Format: {format}
              </span>
            </div>

            {/* Content Preview */}
            <div className="space-y-3 text-neutral-300 leading-relaxed text-xs">
              <div className="p-3.5 rounded bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="font-semibold text-neutral-200">1. Executive Overview & Objectives</div>
                <p className="text-[11px] text-neutral-400">
                  This intelligence document summarizes space-borne multi-spectral anomaly detection and time-series production risk modeling for <strong>{activeMine.name}</strong>, located in {activeMine.district}, {activeMine.state}. The operational target is {activeMine.dailyTargetTonnes.toLocaleString()} Tonnes/day of high-grade manganese ore ({activeMine.primaryOreType}).
                </p>
              </div>

              <div className="p-3.5 rounded bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="font-semibold text-neutral-200">2. Production Risk Summary (Next 30 Days)</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
                    <div className="text-neutral-500 text-[10px]">Monthly Target</div>
                    <div className="text-neutral-200 font-bold">{(activeMine.dailyTargetTonnes * 30).toLocaleString()} T</div>
                  </div>
                  <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
                    <div className="text-neutral-500 text-[10px]">Projected Output</div>
                    <div className="text-amber-400 font-bold">{(activeMine.dailyTargetTonnes * 30 * 0.78).toLocaleString()} T</div>
                  </div>
                  <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
                    <div className="text-neutral-500 text-[10px]">Shortfall Gap</div>
                    <div className="text-rose-400 font-bold">-{(activeMine.dailyTargetTonnes * 30 * 0.22).toLocaleString()} T</div>
                  </div>
                  <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
                    <div className="text-neutral-500 text-[10px]">Revenue at Risk</div>
                    <div className="text-rose-400 font-bold">₹29.8 Cr</div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="font-semibold text-neutral-200">3. Regulatory UNFC-1997 Compliance Disclaimer</div>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  All potential resource zones and prospective target tonnages presented herein represent multi-sensor geospatial inversions. Classification into Proved/Probable Reserves under Indian Bureau of Mines and UNFC rules strictly necessitates subsequent exploratory core diamond drilling, stratigraphic trenching, and certified laboratory chemical assay.
                </p>
              </div>
            </div>

            {/* Sign-off */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-[11px] text-neutral-500 font-mono">
              <span>Cryptographic Signature: SHA-256: 4a9f8102b48917260594830182746193...</span>
              <span>MOIL Central Geology Cell, Nagpur</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
