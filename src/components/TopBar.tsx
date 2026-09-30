import React from 'react';
import {
  Pickaxe,
  Satellite,
  CloudRain,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  User,
  SlidersHorizontal,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { Mine } from '../types/mining';

interface TopBarProps {
  mines: Mine[];
  activeMineId: string;
  onSelectMine: (id: string) => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  isExecutiveMode: boolean;
  onToggleExecutiveMode: () => void;
  onOpenCopilot: () => void;
  onRefreshData: () => void;
  isRefreshing?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  mines,
  activeMineId,
  onSelectMine,
  isDemoMode,
  onToggleDemoMode,
  isExecutiveMode,
  onToggleExecutiveMode,
  onOpenCopilot,
  onRefreshData,
  isRefreshing = false,
}) => {
  const activeMine = mines.find((m) => m.id === activeMineId) || mines[0];

  return (
    <header className="h-14 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur px-4 flex items-center justify-between shrink-0 select-none z-30">
      {/* Brand & Identity */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-neutral-950 font-bold shadow-md shadow-amber-500/10">
            <Pickaxe className="w-4 h-4 text-neutral-950" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-neutral-100 text-sm">MANGANEX AI</span>
              <span className="text-[10px] font-mono tracking-wider px-1.5 py-0.2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                MOIL SIH26009
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 hidden sm:inline">
              Manganese Exploration & Production Intelligence
            </span>
          </div>
        </div>

        <div className="h-5 w-px bg-neutral-800 hidden md:block" />

        {/* Mine Selector Dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-colors text-xs">
            <span className="text-neutral-400">Mine:</span>
            <span className="font-medium text-neutral-200">{activeMine ? activeMine.name : 'Loading...'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <select
            value={activeMineId}
            onChange={(e) => onSelectMine(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full"
          >
            {mines.map((mine) => (
              <option key={mine.id} value={mine.id} className="bg-neutral-900 text-neutral-200">
                {mine.name} ({mine.district}, {mine.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Real-time Status Telemetry */}
      <div className="hidden lg:flex items-center gap-5 text-xs text-neutral-400">
        <div className="flex items-center gap-1.5" title="Copernicus Sentinel-1/2 Status">
          <Satellite className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sentinel-2 L2A</span>
          <span className="text-neutral-600">/</span>
          <span className="text-neutral-300 font-mono">10m BOA</span>
        </div>

        <div className="flex items-center gap-1.5" title="IMD Doppler Weather Radar Feed">
          <CloudRain className="w-3.5 h-3.5 text-amber-400" />
          <span>Monsoon Alert: 48mm</span>
        </div>

        <div className="flex items-center gap-1.5" title="XGBoost Prospectivity Model v3.2">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>ProspectXGB-v3.2</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Primary Actions & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Refresh button */}
        <button
          onClick={onRefreshData}
          disabled={isRefreshing}
          className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 rounded transition-colors disabled:opacity-50"
          title="Refresh telemetry and model predictions"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
        </button>

        {/* Demo / Live Switcher */}
        <button
          onClick={onToggleDemoMode}
          className={`px-2.5 py-1 text-xs font-mono font-medium rounded border transition-colors whitespace-nowrap ${
            isDemoMode
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
          }`}
          title="Toggle between Synthetic Demo Benchmark and Connected Live Data"
        >
          {isDemoMode ? 'DEMO MODE' : 'LIVE DATA'}
        </button>

        {/* Executive Mode Button */}
        <button
          onClick={onToggleExecutiveMode}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded border transition-colors whitespace-nowrap ${
            isExecutiveMode
              ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-sm shadow-amber-500/30'
              : 'bg-neutral-900 text-amber-400 border-neutral-700 hover:border-amber-500/50'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>EXECUTIVE MODE</span>
        </button>

        {/* AI Copilot Button */}
        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded bg-neutral-900 text-neutral-200 border border-neutral-700 hover:border-neutral-600 hover:text-amber-300 transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Manganex Copilot</span>
        </button>

        {/* Profile / MOIL Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-neutral-800 text-xs">
          <div className="w-7 h-7 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="font-medium text-neutral-200 text-xs leading-none">MOIL Executive</span>
            <span className="text-[10px] text-neutral-500">Ministry Evaluator</span>
          </div>
        </div>
      </div>
    </header>
  );
};
