import React, { useState } from 'react';
import { useFactory } from '../../context/FactoryContext';
import {
  Activity,
  Bell,
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  Zap,
  Users,
  ChevronDown,
  Cpu,
  Flame,
  Radio,
  LogOut,
  SlidersHorizontal
} from 'lucide-react';

interface NavbarProps {
  onOpenAlerts: () => void;
  onOpenSimulator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAlerts, onOpenSimulator }) => {
  const {
    currentUser,
    users,
    setCurrentUser,
    logout,
    alerts,
    kpi,
    isStreaming,
    toggleStreaming,
    injectScenario,
    resetSimulation
  } = useFactory();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScenarioMenuOpen, setIsScenarioMenuOpen] = useState(false);

  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;
  const criticalCount = alerts.filter(a => a.status === 'active' && a.severity === 'critical').length;

  const roleColors: Record<string, string> = {
    supervisor: 'bg-purple-900/60 text-purple-300 border-purple-500/40',
    safety: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40',
    maintenance: 'bg-amber-900/60 text-amber-300 border-amber-500/40',
    operations: 'bg-blue-900/60 text-blue-300 border-blue-500/40',
    quality: 'bg-cyan-900/60 text-cyan-300 border-cyan-500/40'
  };

  return (
    <header className="h-16 bg-slate-900/95 border-b border-slate-800 text-slate-100 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
      {/* Brand & Academic Project Title */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40">
          <Cpu className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-base md:text-lg tracking-tight text-white flex items-center gap-1.5">
              <span>Smart Factory</span>
              <span className="hidden sm:inline text-cyan-400 font-mono text-xs uppercase px-1.5 py-0.5 bg-cyan-950/80 rounded border border-cyan-800/60">
                MERN IoT Core
              </span>
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 font-medium truncate max-w-xs md:max-w-md hidden sm:block">
            Collaborative Workspace &bull; Real-Time Asset Tracking &bull; ISO/TS 15066
          </p>
        </div>
      </div>

      {/* Center Actions: Telemetry Streamer & Scenario Trigger */}
      <div className="hidden lg:flex items-center space-x-3">
        {/* Live Stream Controller */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
          <span className="relative flex h-2.5 w-2.5">
            {isStreaming && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isStreaming ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="font-mono text-slate-300">
            {isStreaming ? 'MQTT Telemetry: Active (3s)' : 'Telemetry: Paused'}
          </span>
          <button
            onClick={toggleStreaming}
            title={isStreaming ? 'Pause Sensor Stream' : 'Resume Sensor Stream'}
            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>

        {/* Quick Scenario Injector */}
        <div className="relative">
          <button
            onClick={() => setIsScenarioMenuOpen(!isScenarioMenuOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-200 border border-slate-700 transition"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Test Scenarios</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isScenarioMenuOpen && (
            <div className="absolute top-full mt-1.5 right-0 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-2 z-50 text-xs">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Simulate Factory Event
              </div>
              <button
                onClick={() => {
                  injectScenario('proximity_breach');
                  setIsScenarioMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-red-950/40 text-red-300 hover:text-red-200 flex items-center gap-2 transition"
              >
                <Radio className="w-3.5 h-3.5 text-red-400" />
                <div>
                  <div className="font-medium">Cobot Proximity Breach</div>
                  <div className="text-[10px] text-slate-400">Triggers ISO/TS 15066 Halt (&lt;0.8m)</div>
                </div>
              </button>
              <button
                onClick={() => {
                  injectScenario('motor_overheat');
                  setIsScenarioMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-amber-950/40 text-amber-300 hover:text-amber-200 flex items-center gap-2 transition"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <div>
                  <div className="font-medium">Spindle Thermal Surge</div>
                  <div className="text-[10px] text-slate-400">Haas CNC-201 reaches 84.6°C</div>
                </div>
              </button>
              <button
                onClick={() => {
                  injectScenario('vibration_anomaly');
                  setIsScenarioMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-purple-950/40 text-purple-300 hover:text-purple-200 flex items-center gap-2 transition"
              >
                <Activity className="w-3.5 h-3.5 text-purple-400" />
                <div>
                  <div className="font-medium">Bearing Harmonic Vibration</div>
                  <div className="text-[10px] text-slate-400">Vibration spike to 6.4 mm/s RMS</div>
                </div>
              </button>
              <button
                onClick={() => {
                  injectScenario('hydraulic_leak');
                  setIsScenarioMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-blue-950/40 text-blue-300 hover:text-blue-200 flex items-center gap-2 transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                <div>
                  <div className="font-medium">Hydraulic Pressure Drop</div>
                  <div className="text-[10px] text-slate-400">Rexroth Press drops to 68 bar</div>
                </div>
              </button>
              <div className="my-1 border-t border-slate-800" />
              <button
                onClick={() => {
                  resetSimulation();
                  setIsScenarioMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800 text-slate-300 flex items-center gap-2 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reset to Nominal Standard</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Alerts & User Profile Switcher */}
      <div className="flex items-center space-x-3">
        {/* Simulator Drawer Trigger for Mobile */}
        <button
          onClick={onOpenSimulator}
          className="lg:hidden p-2 rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700 transition"
          title="IoT Simulator"
        >
          <Zap className="w-4 h-4" />
        </button>

        {/* Alerts Bell */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition border border-slate-700"
          title="View Active Alerts"
        >
          <Bell className="w-4 h-4" />
          {activeAlertsCount > 0 && (
            <span
              className={`absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white ${
                criticalCount > 0 ? 'bg-red-500 animate-bounce' : 'bg-amber-500'
              }`}
            >
              {activeAlertsCount}
            </span>
          )}
        </button>

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 transition"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-cyan-500/50"
            />
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-slate-200 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 capitalize">
                {currentUser.role} &bull; {currentUser.shift.split(' ')[0]}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-800">
                <div className="text-xs font-semibold text-slate-300">Cross-Functional Team Persona</div>
                <div className="text-[11px] text-slate-400">
                  Switch persona to test role-specific sign-offs & approvals:
                </div>
              </div>
              <div className="py-1 space-y-1">
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-3 transition ${
                      currentUser.id === u.id ? 'bg-slate-800 ring-1 ring-cyan-500/40' : 'hover:bg-slate-800/60'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-200 truncate">{u.name}</span>
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.5 rounded border font-mono font-bold ${
                            roleColors[u.role] || 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{u.title}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-800/60 flex items-center justify-between text-xs transition"
                >
                  <span className="font-semibold">Sign Out to Login Page</span>
                  <LogOut className="w-3.5 h-3.5" />
                </button>
                <div className="text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Easwari Eng. College</span>
                  <span>Dept: IT</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Direct Logout Icon Button */}
        <button
          onClick={logout}
          className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-300 border border-slate-700 hover:border-red-800/80 transition hidden sm:flex items-center"
          title="Sign Out to Login Page"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
