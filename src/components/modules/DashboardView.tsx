import React from 'react';
import { useFactory } from '../../context/FactoryContext';
import {
  ShieldCheck,
  ShieldAlert,
  Cpu,
  AlertTriangle,
  Activity,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Zap,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  Radio
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateToFloor: () => void;
  onNavigateToAlerts: () => void;
  onNavigateToMaintenance: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToFloor,
  onNavigateToAlerts,
  onNavigateToMaintenance
}) => {
  const {
    kpi,
    machines,
    zones,
    alerts,
    maintenanceTasks,
    messages,
    injectScenario,
    resetSimulation,
    setSelectedMachineForAi,
    acknowledgeAlert
  } = useFactory();

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');
  const runningMachines = machines.filter(m => m.status === 'running').length;
  const faultMachines = machines.filter(m => m.status === 'fault').length;
  const maintMachines = machines.filter(m => m.status === 'maintenance').length;

  return (
    <div className="space-y-6">
      {/* College Project Title Header Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
              EASWARI ENGINEERING COLLEGE &bull; DEPT OF IT
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              ISO/TS 15066 COMPLIANT
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight mt-1">
            Smart Factory Collaborative Workspace Monitoring System
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time asset tracking, automated safety risk classification, and cross-functional maintenance scheduling.
          </p>
        </div>

        {/* Quick Scenario Injection Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium mr-1 hidden lg:inline">Test Injector:</span>
          <button
            onClick={() => injectScenario('proximity_breach')}
            className="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800 text-xs font-medium flex items-center space-x-1.5 transition"
            title="Simulate human entering Cobot safety zone"
          >
            <Radio className="w-3.5 h-3.5 text-red-400" />
            <span>Cobot Breach</span>
          </button>
          <button
            onClick={() => injectScenario('motor_overheat')}
            className="px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800 text-xs font-medium flex items-center space-x-1.5 transition"
            title="Simulate spindle thermal runaway on CNC mill"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Overheat Spindle</span>
          </button>
          <button
            onClick={() => injectScenario('vibration_anomaly')}
            className="px-2.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800 text-xs font-medium flex items-center space-x-1.5 transition"
            title="Simulate harmonic vibration bearing failure"
          >
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            <span>Vibration Surge</span>
          </button>
          <button
            onClick={resetSimulation}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center space-x-1.5 transition"
            title="Reset to factory baseline"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Top Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Safety Score */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Factory Safety Index</span>
            <ShieldCheck
              className={`w-5 h-5 ${
                (kpi?.safetyScore || 100) >= 80
                  ? 'text-emerald-400'
                  : (kpi?.safetyScore || 100) >= 60
                  ? 'text-amber-400'
                  : 'text-red-400'
              }`}
            />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span
              className={`text-2xl font-mono font-extrabold ${
                (kpi?.safetyScore || 100) >= 80
                  ? 'text-emerald-400'
                  : (kpi?.safetyScore || 100) >= 60
                  ? 'text-amber-400'
                  : 'text-red-400'
              }`}
            >
              {kpi?.safetyScore ?? 96}%
            </span>
            <span className="text-[11px] text-slate-400">ISO 45001 Standard</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                (kpi?.safetyScore || 100) >= 80
                  ? 'bg-emerald-500'
                  : (kpi?.safetyScore || 100) >= 60
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${kpi?.safetyScore ?? 96}%` }}
            />
          </div>
        </div>

        {/* Fleet Equipment Status */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Equipment Fleet Status</span>
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-mono font-extrabold text-white">
              {runningMachines}/{machines.length}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">Running Nominal</span>
          </div>
          <div className="mt-2.5 flex items-center space-x-2 text-[10px] font-mono">
            <span className="text-emerald-400 font-bold">{runningMachines} Active</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-red-400 font-bold">{faultMachines} Fault</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-amber-400 font-bold">{maintMachines} Maint</span>
          </div>
        </div>

        {/* Overall Equipment Effectiveness (OEE) */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Plant OEE Efficiency</span>
            <Activity className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-mono font-extrabold text-indigo-300">
              {kpi?.avgOee ?? 87.2}%
            </span>
            <span className="text-[11px] text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +1.4% Target
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-full" style={{ width: `${kpi?.avgOee ?? 87.2}%` }} />
          </div>
        </div>

        {/* Active Alerts Count */}
        <div
          onClick={onNavigateToAlerts}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Safety Alarms</span>
            <ShieldAlert
              className={`w-5 h-5 ${
                criticalAlerts.length > 0 ? 'text-red-400 animate-bounce' : 'text-amber-400'
              }`}
            />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span
              className={`text-2xl font-mono font-extrabold ${
                criticalAlerts.length > 0 ? 'text-red-400' : 'text-amber-400'
              }`}
            >
              {activeAlerts.length}
            </span>
            <span className="text-[11px] text-slate-400">
              {criticalAlerts.length} Critical Require Action
            </span>
          </div>
          <div className="mt-2 text-[10px] text-cyan-400 group-hover:underline flex items-center gap-1">
            <span>Review in Alert Management</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Factory Zones Status Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Workspace Zones & Safety Classification
            </h3>
            <span className="text-xs text-slate-400">(Module 5)</span>
          </div>
          <button
            onClick={onNavigateToFloor}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1"
          >
            <span>Open Interactive Floor Plan</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map(zone => {
            const isBreach = zone.safetyStatus === 'breach';
            const isCaution = zone.safetyStatus === 'caution';
            return (
              <div
                key={zone.id}
                className={`p-4 rounded-xl border transition ${
                  isBreach
                    ? 'bg-red-950/40 border-red-800/80'
                    : isCaution
                    ? 'bg-amber-950/30 border-amber-800/70'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-slate-400">{zone.code}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${
                      isBreach
                        ? 'bg-red-900/60 text-red-200 border-red-500 animate-pulse'
                        : isCaution
                        ? 'bg-amber-900/60 text-amber-200 border-amber-500'
                        : 'bg-emerald-900/50 text-emerald-300 border-emerald-600'
                    }`}
                  >
                    {zone.safetyStatus}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white mt-1.5 truncate">{zone.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{zone.description}</p>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{zone.activeWorkers} Personnel</span>
                  </span>
                  <span>{zone.machinesCount} Assets</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main 2-Col Split: Machine Health Fleet & Active Alarms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Live Equipment Fleet (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Connected Assets & Telemetry Overview
            </h3>
            <span className="text-xs text-slate-500 font-mono">Live ISO 10816-3 &bull; ISO/TS 15066</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {machines.map(m => {
              const isCobot = m.isCobot;
              return (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-2.5 relative group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-mono text-cyan-400 font-semibold">{m.code}</span>
                        {isCobot && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
                            Cobot
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs text-white truncate max-w-[180px]">{m.name}</h4>
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        m.status === 'running'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : m.status === 'fault'
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>

                  {/* Telemetry row */}
                  <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-950 p-2 rounded-lg border border-slate-850 font-mono text-[11px]">
                    <div>
                      <div className="text-[9px] text-slate-400">Temp</div>
                      <div
                        className={
                          m.temperature > 75 ? 'text-red-400 font-bold' : 'text-slate-200'
                        }
                      >
                        {m.temperature}°C
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400">Vibration</div>
                      <div
                        className={
                          m.vibration > 4.5 ? 'text-amber-400 font-bold' : 'text-slate-200'
                        }
                      >
                        {m.vibration} mm/s
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400">Health</div>
                      <div className="text-cyan-400 font-bold">{m.healthScore}%</div>
                    </div>
                  </div>

                  {/* Diagnostic Action Button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 truncate">{m.zoneName.split(' ')[0]}</span>
                    <button
                      onClick={() => setSelectedMachineForAi(m)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-medium flex items-center space-x-1 border border-slate-700 transition"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>AI Diagnostic</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Safety Alarms & Cross-Functional Tasks (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Live Safety & Telemetry Alarms
            </h3>
            <button
              onClick={onNavigateToAlerts}
              className="text-xs text-cyan-400 hover:text-cyan-300"
            >
              All ({alerts.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {activeAlerts.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400 flex flex-col items-center justify-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-1" />
                <span className="text-white font-medium">All Safe & Nominal</span>
                <span>No active critical or warning hazards.</span>
              </div>
            ) : (
              activeAlerts.slice(0, 3).map(alert => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border space-y-1.5 transition ${
                    alert.severity === 'critical'
                      ? 'bg-red-950/40 border-red-800'
                      : 'bg-amber-950/30 border-amber-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-bold uppercase font-mono px-1.5 py-0.2 rounded border ${
                        alert.severity === 'critical'
                          ? 'bg-red-900/80 text-red-200 border-red-500'
                          : 'bg-amber-900/80 text-amber-200 border-amber-500'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(alert.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-white leading-tight">{alert.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-snug">{alert.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-cyan-400">
                      {alert.isoStandard || 'ISO Standard'}
                    </span>
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-medium border border-slate-600 transition"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Cross-Functional Maintenance Highlights */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Scheduled Maintenance Work
              </span>
              <button
                onClick={onNavigateToMaintenance}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Kanban
              </button>
            </div>
            <div className="space-y-2">
              {maintenanceTasks.slice(0, 2).map(task => (
                <div key={task.id} className="p-2 rounded-lg bg-slate-950 border border-slate-850 text-xs">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-cyan-400 font-semibold">{task.code}</span>
                    <span className="text-slate-400 uppercase">{task.status.replace('_', ' ')}</span>
                  </div>
                  <div className="text-slate-200 font-medium text-[11px] mt-0.5 truncate">{task.title}</div>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>Tech: {task.assignedTechnician}</span>
                    <span className="text-amber-400">{task.estimatedHours}h est.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
