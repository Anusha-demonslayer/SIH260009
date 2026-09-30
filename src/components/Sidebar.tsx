import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Map as MapIcon,
  Layers,
  TrendingUp,
  Radar,
  Truck,
  CloudSun,
  Activity,
  Sliders,
  Sparkles,
  FileCheck2,
  Database,
  FileSpreadsheet,
  Settings,
} from 'lucide-react';

export type NavModule =
  | 'command-center'
  | 'exploration'
  | 'prospectivity-map'
  | 'reserves'
  | 'production-forecast'
  | 'shortfall-radar'
  | 'equipment'
  | 'weather-satellite'
  | 'digital-twin'
  | 'what-if-simulator'
  | 'recommendations'
  | 'evidence'
  | 'data-studio'
  | 'reports'
  | 'admin';

interface SidebarProps {
  activeModule: NavModule;
  onSelectModule: (module: NavModule) => void;
  shortfallAlertCount?: number;
  recommendationsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  shortfallAlertCount = 2,
  recommendationsCount = 4,
}) => {
  const navItems: {
    id: NavModule;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'exploration', label: 'Exploration Intelligence', icon: Compass, badge: 'AI', badgeColor: 'bg-amber-500/20 text-amber-300' },
    { id: 'prospectivity-map', label: 'Prospectivity GIS Map', icon: MapIcon },
    { id: 'reserves', label: 'Reserve Intelligence (IDW)', icon: Layers },
    { id: 'production-forecast', label: 'Production Forecast', icon: TrendingUp },
    { id: 'shortfall-radar', label: 'Shortfall Radar', icon: Radar, badge: shortfallAlertCount, badgeColor: 'bg-rose-500/20 text-rose-300' },
    { id: 'equipment', label: 'Equipment & Fleet (PdM)', icon: Truck },
    { id: 'weather-satellite', label: 'Weather & Satellite', icon: CloudSun },
    { id: 'digital-twin', label: 'Mine Digital Twin', icon: Activity },
    { id: 'what-if-simulator', label: 'What-If Simulator', icon: Sliders, badge: 'New', badgeColor: 'bg-cyan-500/20 text-cyan-300' },
    { id: 'recommendations', label: 'AI Action Engine', icon: Sparkles, badge: recommendationsCount, badgeColor: 'bg-amber-500/20 text-amber-300' },
    { id: 'evidence', label: 'Evidence & Audit Trail', icon: FileCheck2 },
    { id: 'data-studio', label: 'Data Studio (Upload)', icon: Database },
    { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet },
    { id: 'admin', label: 'Admin & Model Health', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col shrink-0 select-none overflow-y-auto">
      <div className="p-3 text-[11px] font-mono uppercase tracking-wider text-neutral-500 border-b border-neutral-800/80">
        Navigation Modules
      </div>

      <nav className="p-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded transition-colors text-left group ${
                isActive
                  ? 'bg-neutral-900 text-amber-400 font-medium border-l-2 border-amber-500 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-amber-400' : 'text-neutral-500 group-hover:text-neutral-300'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                    item.badgeColor || 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Ground validation reminder notice */}
      <div className="mt-auto p-3 m-2 rounded bg-neutral-900/70 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
        <div className="flex items-center gap-1.5 text-amber-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Ground Validation Rule</span>
        </div>
        <p className="text-[10px] text-neutral-500 leading-relaxed">
          Remote sensing signals identify prospectivity target zones. Direct resource certification strictly requires core diamond drilling & assay.
        </p>
      </div>
    </aside>
  );
};
