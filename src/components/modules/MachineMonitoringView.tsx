import React, { useState } from 'react';
import { useFactory } from '../../context/FactoryContext';
import { Machine } from '../../types';
import {
  Cpu,
  Search,
  Filter,
  Sparkles,
  CalendarPlus,
  Shield,
  Activity,
  Thermometer,
  Radio,
  Gauge,
  Clock,
  Wrench,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface MachineMonitoringViewProps {
  onScheduleMaintenance: (machineId: string) => void;
}

export const MachineMonitoringView: React.FC<MachineMonitoringViewProps> = ({ onScheduleMaintenance }) => {
  const { machines, setSelectedMachineForAi } = useFactory();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredMachines = machines.filter(m => {
    const matchesCategory = filterCategory === 'all' || m.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.zoneName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Machine & Equipment Fleet Monitoring
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time operating telemetry, ISO/TS 15066 Cobot safety compliance, and predictive health index.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search code, name, zone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Categories</option>
            <option value="robotics">Cobots & Robotics</option>
            <option value="cnc">CNC Machining</option>
            <option value="laser">Laser Cutting & Welding</option>
            <option value="logistics">AGV Logistics</option>
            <option value="hydraulic">Hydraulic Presses</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="running">Running</option>
            <option value="fault">Fault / Alert</option>
            <option value="maintenance">In Maintenance</option>
            <option value="idle">Idle</option>
          </select>
        </div>
      </div>

      {/* Machine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredMachines.map(machine => {
          const isCobot = machine.isCobot;
          const statusColors: Record<string, string> = {
            running: 'bg-emerald-950 text-emerald-400 border-emerald-800',
            fault: 'bg-red-950 text-red-400 border-red-800',
            maintenance: 'bg-amber-950 text-amber-400 border-amber-800',
            idle: 'bg-slate-800 text-slate-400 border-slate-700'
          };

          return (
            <div
              key={machine.id}
              className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition shadow-sm"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-slate-800/80 bg-slate-850/50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono text-xs font-bold text-cyan-400">{machine.code}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {machine.category}
                      </span>
                      {isCobot && (
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800 font-semibold">
                          ISO/TS 15066
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-white mt-1 leading-snug">{machine.name}</h3>
                    <p className="text-[11px] text-slate-400">{machine.model}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${
                      statusColors[machine.status]
                    }`}
                  >
                    {machine.status}
                  </span>
                </div>

                <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Zone: {machine.zoneName.split(' ')[0]}</span>
                  <span>Tech: {machine.assignedTechnician || 'Unassigned'}</span>
                </div>
              </div>

              {/* Telemetry Metrics Grid */}
              <div className="p-4 space-y-3">
                {/* Health & OEE Progress Bars */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Health Index</span>
                      <span className="font-mono font-bold text-cyan-400">{machine.healthScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          machine.healthScore > 80
                            ? 'bg-cyan-500'
                            : machine.healthScore > 65
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${machine.healthScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Machine OEE</span>
                      <span className="font-mono font-bold text-emerald-400">{machine.oee}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${machine.oee}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Sensor Readings Snapshot */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950 border border-slate-850">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 font-sans">
                      <Thermometer className="w-3 h-3 text-amber-400" />
                      <span>Temp</span>
                    </div>
                    <div
                      className={`text-xs font-bold mt-0.5 ${
                        machine.temperature > 75 ? 'text-red-400' : 'text-slate-200'
                      }`}
                    >
                      {machine.temperature} °C
                    </div>
                  </div>

                  <div className="p-2 rounded bg-slate-950 border border-slate-850">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 font-sans">
                      <Activity className="w-3 h-3 text-purple-400" />
                      <span>Vibration</span>
                    </div>
                    <div
                      className={`text-xs font-bold mt-0.5 ${
                        machine.vibration > 4.5 ? 'text-amber-400' : 'text-slate-200'
                      }`}
                    >
                      {machine.vibration} mm/s
                    </div>
                  </div>

                  {machine.proximityDistance && (
                    <div className="p-2 rounded bg-slate-950 border border-slate-850">
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 font-sans">
                        <Radio className="w-3 h-3 text-cyan-400" />
                        <span>Worker Dist</span>
                      </div>
                      <div
                        className={`text-xs font-bold mt-0.5 ${
                          machine.proximityDistance < 0.8
                            ? 'text-red-400'
                            : machine.proximityDistance < 2.0
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {machine.proximityDistance} m
                      </div>
                    </div>
                  )}

                  {machine.hydraulicPressure && (
                    <div className="p-2 rounded bg-slate-950 border border-slate-850">
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 font-sans">
                        <Gauge className="w-3 h-3 text-blue-400" />
                        <span>Pressure</span>
                      </div>
                      <div className="text-xs font-bold mt-0.5 text-slate-200">
                        {machine.hydraulicPressure} bar
                      </div>
                    </div>
                  )}

                  <div className="p-2 rounded bg-slate-950 border border-slate-850">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 font-sans">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Runtime</span>
                    </div>
                    <div className="text-xs font-bold mt-0.5 text-slate-200">
                      {machine.runtimeHours} hrs
                    </div>
                  </div>
                </div>

                {/* Maintenance Schedule Row */}
                <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between border-t border-slate-800">
                  <span>Last Maint: {machine.lastMaintenance}</span>
                  <span className="text-amber-300">Next: {machine.nextScheduledMaintenance}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedMachineForAi(machine)}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                  <span>AI Diagnostic</span>
                </button>
                <button
                  onClick={() => onScheduleMaintenance(machine.id)}
                  className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 border border-slate-700 transition"
                  title="Create Work Order"
                >
                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                  <span>Work Order</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
