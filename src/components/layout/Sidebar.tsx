import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Cpu,
  Activity,
  CalendarCheck2,
  ShieldAlert,
  MessagesSquare,
  BarChart3,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useFactory } from '../../context/FactoryContext';

export type ActiveTab =
  | 'dashboard'
  | 'floormap'
  | 'machines'
  | 'sensors'
  | 'maintenance'
  | 'alerts'
  | 'collaboration'
  | 'analytics';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSimulator: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenSimulator }) => {
  const { alerts, maintenanceTasks, kpi } = useFactory();

  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;
  const criticalCount = alerts.filter(a => a.status === 'active' && a.severity === 'critical').length;
  const pendingMaintenanceCount = maintenanceTasks.filter(t => t.status === 'scheduled' || t.status === 'in_progress').length;

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Factory Overview',
      subtitle: 'Central view of status & alerts',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'floormap' as ActiveTab,
      label: 'Digital Twin Floor Map',
      subtitle: 'Real-time asset tracking & zones',
      icon: MapPin,
      badge: kpi?.safetyScore && kpi.safetyScore < 70 ? 'Hazard' : null,
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30'
    },
    {
      id: 'machines' as ActiveTab,
      label: 'Equipment & Machines',
      subtitle: 'Status, OEE & health scores',
      icon: Cpu,
      badge: null
    },
    {
      id: 'sensors' as ActiveTab,
      label: 'IoT Telemetry & Sensors',
      subtitle: 'Temp, vibration, proximity streams',
      icon: Activity,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'maintenance' as ActiveTab,
      label: 'Maintenance Scheduling',
      subtitle: 'Cross-functional Kanban & LOTO',
      icon: CalendarCheck2,
      badge: pendingMaintenanceCount > 0 ? `${pendingMaintenanceCount} Tasks` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 'alerts' as ActiveTab,
      label: 'Alert Management',
      subtitle: 'ISO/TS 15066 safety alarms',
      icon: ShieldAlert,
      badge: activeAlertsCount > 0 ? `${activeAlertsCount}` : null,
      badgeColor: criticalCount > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 'collaboration' as ActiveTab,
      label: 'Cross-Functional Hub',
      subtitle: 'Operations &bull; Maint &bull; Safety',
      icon: MessagesSquare,
      badge: null
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'Predictive Analytics & AI',
      subtitle: 'Risk scoring & ML diagnostics',
      icon: BarChart3,
      badge: 'AI',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          MERN Smart Factory Modules
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center space-x-3 transition group relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/70 to-slate-800 text-white border border-cyan-800/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              )}
              <Icon
                className={`w-4 h-4 shrink-0 transition ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium border ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 truncate">{item.subtitle}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Simulator Quick Launcher in Sidebar Footer */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <button
          onClick={onOpenSimulator}
          className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-950/60 to-slate-800 hover:from-amber-900/60 hover:to-slate-750 text-amber-300 border border-amber-700/50 text-xs font-medium flex items-center justify-between transition group shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>IoT Fault Simulator</span>
          </div>
          <span className="text-[10px] bg-amber-950 px-1.5 py-0.5 rounded font-mono text-amber-200 border border-amber-800/80">
            Deck
          </span>
        </button>

        <div className="px-2 py-1.5 bg-slate-950/60 rounded-lg border border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Node.js + Express + React
          </span>
          <span className="text-slate-500 font-mono">v1.4</span>
        </div>
      </div>
    </aside>
  );
};
