import React, { useState, useEffect } from 'react';
import { EvidenceRecord } from '../types/mining';
import { fetchEvidence } from '../services/api';
import {
  FileCheck2,
  ShieldCheck,
  Search,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';

export const EvidenceView: React.FC = () => {
  const [evidenceRecords, setEvidenceRecords] = useState<EvidenceRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<EvidenceRecord | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchEvidence();
        if (res.success) {
          setEvidenceRecords(res.records);
          setSelectedRecord(res.records[0] || null);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const filtered = evidenceRecords.filter((r) =>
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.predictionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.targetEntityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.evidenceHash.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-neutral-100 uppercase tracking-wide">
              AI Evidence Audit Trail & Cryptographic Traceability
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400">
              SHA-256 Ledger
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Complete immutable audit log establishing regulatory compliance with Indian Bureau of Mines (IBM) and UNFC-1997 reporting guidelines.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search prediction ID, hash, or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 w-64"
          />
        </div>
      </div>

      {/* Main Grid: Records List (6 cols) + Inspector (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left: Records Table (6 cols) */}
        <div className="lg:col-span-6 flex flex-col space-y-3">
          <div className="rounded-lg bg-neutral-900/80 border border-neutral-800 overflow-hidden text-xs">
            <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800 font-semibold text-neutral-200">
              Audit Inferences Log ({filtered.length})
            </div>

            <div className="divide-y divide-neutral-800/60 max-h-[540px] overflow-y-auto">
              {filtered.map((record) => {
                const isSelected = selectedRecord?.id === record.id;
                return (
                  <div
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className={`p-3 cursor-pointer transition-colors space-y-1 ${
                      isSelected ? 'bg-neutral-800 text-white' : 'hover:bg-neutral-900/60 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-400">{record.id}</span>
                      <span className="text-[10px] font-mono text-neutral-400">{record.timestamp}</span>
                    </div>

                    <div className="text-xs font-semibold text-neutral-200">
                      {record.predictionType}: {record.targetEntityId}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                      <span>Model: {record.modelVersion}</span>
                      <span className="text-emerald-400">Conf: {record.confidenceScore}%</span>
                    </div>

                    <div className="text-[9px] font-mono text-neutral-500 truncate">
                      SHA-256: {record.evidenceHash}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Selected Record Deep Inspector (6 cols) */}
        <div className="lg:col-span-6 flex flex-col space-y-3 text-xs">
          {selectedRecord && (
            <div className="p-4 rounded-lg bg-neutral-900/90 border border-neutral-700 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div>
                  <div className="font-bold text-neutral-100 text-sm">{selectedRecord.id}</div>
                  <div className="text-[11px] text-neutral-400 font-mono">
                    Timestamp: {selectedRecord.timestamp} · Model: {selectedRecord.modelVersion}
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">
                  Confidence: {selectedRecord.confidenceScore}%
                </span>
              </div>

              {/* Prediction summary */}
              <div>
                <div className="text-neutral-400 text-[10px] uppercase font-bold">Prediction Output</div>
                <div className="text-sm font-semibold text-amber-300 font-mono mt-0.5">
                  {selectedRecord.predictedValue}
                </div>
              </div>

              {/* Cryptographic Hash */}
              <div className="p-3 rounded bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] uppercase text-neutral-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cryptographic Evidence Hash</span>
                  </span>
                  <button
                    onClick={() => handleCopyHash(selectedRecord.evidenceHash)}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono text-[10px]"
                  >
                    {copiedHash === selectedRecord.evidenceHash ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy SHA-256</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-[11px] font-mono text-neutral-300 break-all bg-neutral-900/60 p-2 rounded border border-neutral-800">
                  {selectedRecord.evidenceHash}
                </div>
              </div>

              {/* Input Datasets */}
              <div className="space-y-1.5">
                <div className="font-semibold text-neutral-300">Input Lineage Datasets:</div>
                <div className="space-y-1 font-mono text-[11px]">
                  {selectedRecord.inputDatasets.map((ds, idx) => (
                    <div key={idx} className="p-1.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300">
                      • {ds}
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Snapshot */}
              <div className="space-y-1.5">
                <div className="font-semibold text-neutral-300">Feature Values Vector:</div>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                  {Object.entries(selectedRecord.featureSnapshot).map(([k, v]) => (
                    <div key={k} className="p-1.5 rounded bg-neutral-950 border border-neutral-800/80 flex justify-between">
                      <span className="text-neutral-400 truncate">{k}:</span>
                      <span className="text-amber-300 font-bold ml-1">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regulatory Sign-off */}
              <div className="p-3 rounded bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
                <div>
                  <strong className="text-neutral-300">Supervisory Sign-Off:</strong> {selectedRecord.analystSignOff}
                </div>
                <div>
                  <strong className="text-amber-300">Validation Status:</strong> {selectedRecord.validationRequiredNote}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
