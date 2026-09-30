import React, { useState } from 'react';
import {
  Mine,
  EquipmentAsset,
} from '../types/mining';
import {
  Activity,
  Layers,
  Truck,
  Flame,
  ArrowRight,
  ShieldAlert,
  Gauge,
  Thermometer,
  Wrench,
  CheckCircle,
} from 'lucide-react';

interface DigitalTwinViewProps {
  activeMine: Mine;
  equipment: EquipmentAsset[];
}

interface MineTwinNode {
  id: string;
  name: string;
  type: 'Pit Face' | 'Blast Zone' | 'Haul Road' | 'Crusher' | 'Stockpile' | 'Beneficiation' | 'Rail Dispatch';
  status: 'Nominal' | 'Bottleneck' | 'High Risk' | 'Derated';
  metrics: {
    throughputTpd: number;
    capacityPct: number;
    temperatureC?: number;
    vibrationMmSec?: number;
    failureRiskPct?: number;
  };
  dependencies: string[];
  description: string;
  assignedEquipment: string[];
}

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({
  activeMine,
  equipment,
}) => {
  const twinNodes: MineTwinNode[] = [
    {
      id: 'TWIN-BENCH-4',
      name: 'North Pit Bench 4 (High-Grade Ore Face)',
      type: 'Pit Face',
      status: 'High Risk',
      metrics: { throughputTpd: 1800, capacityPct: 82, failureRiskPct: 78 },
      dependencies: ['TWIN-HAUL-RAMP-2', 'TWIN-CRUSHER-01'],
      description: 'Primary pyrolusite ore extraction zone. Constrained by Excavator EXC-014 hydraulic overheating.',
      assignedEquipment: ['EXC-014', 'TRK-009', 'TRK-012'],
    },
    {
      id: 'TWIN-BLAST-5',
      name: 'Bench 5 Pre-split Blast Pattern',
      type: 'Blast Zone',
      status: 'Derated',
      metrics: { throughputTpd: 2400, capacityPct: 65, failureRiskPct: 45 },
      dependencies: ['TWIN-BENCH-4'],
      description: 'Loaded blast pattern delayed by 14 hours to evade 48mm monsoon storm saturation.',
      assignedEquipment: ['DRL-003'],
    },
    {
      id: 'TWIN-HAUL-RAMP-2',
      name: 'In-Pit Haul Ramp Segment 2',
      type: 'Haul Road',
      status: 'Derated',
      metrics: { throughputTpd: 2800, capacityPct: 70 },
      dependencies: ['TWIN-CRUSHER-01'],
      description: '1:10 uphill gradient experiencing dumper transmission thermal spikes (TRK-009 @ 108°C).',
      assignedEquipment: ['TRK-009', 'TRK-015', 'Dozer DOZ-02'],
    },
    {
      id: 'TWIN-CRUSHER-01',
      name: 'Primary Jaw Crusher CR-01',
      type: 'Crusher',
      status: 'Nominal',
      metrics: { throughputTpd: 3100, capacityPct: 88, temperatureC: 76, vibrationMmSec: 6.8, failureRiskPct: 38 },
      dependencies: ['TWIN-STOCKPILE-A', 'TWIN-BENEFICIATION'],
      description: 'Metso C130 primary jaw crusher operating at optimal throughput with routine liner wear.',
      assignedEquipment: ['CR-01', 'Loader LDR-04'],
    },
    {
      id: 'TWIN-STOCKPILE-A',
      name: 'ROM Manganese Pad Stockpile A',
      type: 'Stockpile',
      status: 'Bottleneck',
      metrics: { throughputTpd: 2200, capacityPct: 92 },
      dependencies: ['TWIN-BENEFICIATION'],
      description: 'Emergency ore buffer holding 18 hours operational feed; requires dry shed protection before storm.',
      assignedEquipment: ['Loader LDR-02'],
    },
    {
      id: 'TWIN-BENEFICIATION',
      name: 'Heavy Media Beneficiation & Screening Plant',
      type: 'Beneficiation',
      status: 'Nominal',
      metrics: { throughputTpd: 3200, capacityPct: 85, vibrationMmSec: 3.2, failureRiskPct: 15 },
      dependencies: ['TWIN-RAIL-SIDING'],
      description: 'Jigging and heavy media separation unit producing 44% Mn metallurgical concentrate.',
      assignedEquipment: ['Screen SCR-01', 'Conveyor CV-04'],
    },
    {
      id: 'TWIN-RAIL-SIDING',
      name: 'MOIL Rail Loading Dispatch Siding',
      type: 'Rail Dispatch',
      status: 'Nominal',
      metrics: { throughputTpd: 3500, capacityPct: 74 },
      dependencies: [],
      description: 'Direct rail rake wagon dispatch loading facility connecting to Central Railway network.',
      assignedEquipment: ['Wagon Loader WL-01'],
    },
  ];

  const [selectedNode, setSelectedNode] = useState<MineTwinNode>(twinNodes[0]);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-neutral-100 uppercase tracking-wide">
              Mine Operational Digital Twin
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-400">
              Real-Time Telemetry Topology
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            End-to-end mineral flow simulation from open pit bench extraction, haul ramp bottlenecks, crushing, down to rail dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded">
            Live SCADA Integration Active
          </span>
        </div>
      </div>

      {/* Main Flow Diagram */}
      <div className="p-4 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-4">
        <div className="text-xs font-semibold text-neutral-200">
          Operational Mining Flow Topology (Click node to inspect SCADA parameters)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {twinNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const statusBorder =
              node.status === 'High Risk'
                ? 'border-rose-500/60 bg-rose-950/20'
                : node.status === 'Derated' || node.status === 'Bottleneck'
                ? 'border-amber-500/50 bg-amber-950/15'
                : 'border-neutral-800 bg-neutral-950';

            const statusText =
              node.status === 'High Risk'
                ? 'text-rose-400'
                : node.status === 'Derated' || node.status === 'Bottleneck'
                ? 'text-amber-400'
                : 'text-emerald-400';

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${statusBorder} ${
                  isSelected ? 'ring-2 ring-amber-400 shadow-lg' : 'hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span>{node.type}</span>
                  <span className={`font-bold ${statusText}`}>{node.status}</span>
                </div>

                <div className="font-bold text-neutral-100 text-xs mt-1.5 line-clamp-1">
                  {node.name}
                </div>

                <div className="grid grid-cols-2 gap-1 pt-2 mt-2 border-t border-neutral-800/80 font-mono text-[10px]">
                  <div>
                    <div className="text-neutral-500">Flow Rate</div>
                    <div className="text-neutral-200 font-bold">{node.metrics.throughputTpd} TPD</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Load Factor</div>
                    <div className="text-neutral-200 font-bold">{node.metrics.capacityPct}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Twin Component Deep Inspection */}
      {selectedNode && (
        <div className="p-4 rounded-lg bg-neutral-900/90 border border-neutral-700 space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-2">
            <div>
              <div className="text-base font-bold text-neutral-100 flex items-center gap-2">
                <span>{selectedNode.name}</span>
                <span className="text-xs font-mono text-amber-400 px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800">
                  {selectedNode.type}
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-1">{selectedNode.description}</p>
            </div>

            <span className="px-3 py-1 rounded bg-neutral-950 border border-neutral-800 font-mono text-neutral-200">
              Throughput: {selectedNode.metrics.throughputTpd} TPD ({selectedNode.metrics.capacityPct}% Cap)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Assigned Assets */}
            <div className="p-3 rounded bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="font-semibold text-neutral-300 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Assigned Fleet Assets</span>
              </div>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {selectedNode.assignedEquipment.map((eq, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-200">
                    {eq}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Flow Downstream */}
            <div className="p-3 rounded bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="font-semibold text-neutral-300 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                <span>Downstream Bottleneck Path</span>
              </div>
              <div className="text-[11px] text-neutral-300 font-mono">
                {selectedNode.dependencies.length > 0
                  ? selectedNode.dependencies.join(' ➔ ')
                  : 'Terminal Node (Final Dispatch)'}
              </div>
            </div>

            {/* Vulnerability Severity */}
            <div className="p-3 rounded bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="font-semibold text-neutral-300 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Operational Impact</span>
              </div>
              <div className="text-[11px] text-neutral-300 leading-relaxed">
                {selectedNode.status === 'High Risk'
                  ? 'Immediate potential point of failure. Recommendation REC-2026-001 active.'
                  : 'Operating within acceptable baseline thresholds.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
