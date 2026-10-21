import React, { useState } from 'react';
import { useFactory } from '../../context/FactoryContext';
import { Machine } from '../../types';
import {
  Shield,
  ShieldAlert,
  Radio,
  User,
  Cpu,
  Zap,
  Info,
  Maximize2,
  AlertTriangle,
  Sparkles,
  Move
} from 'lucide-react';

interface FloorWorker {
  id: string;
  name: string;
  role: string;
  tagId: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  zoneCode: string;
}

export const FloorMapView: React.FC = () => {
  const { machines, zones, alerts, setSelectedMachineForAi } = useFactory();
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(machines[0] || null);
  const [selectedWorker, setSelectedWorker] = useState<FloorWorker | null>(null);

  // Dynamic workers positioned in floor zones
  const [workers, setWorkers] = useState<FloorWorker[]>([
    { id: 'w-1', name: 'Vikram Sundaram (Operator)', role: 'CNC Operator', tagId: 'UWB-092', x: 28, y: 32, zoneCode: 'ZONE-A' },
    { id: 'w-2', name: 'Dr. Ananya Sharma (Safety)', role: 'Safety Auditor', tagId: 'UWB-044', x: 14, y: 22, zoneCode: 'ZONE-A' },
    { id: 'w-3', name: 'Karthik Rao (Machinist)', role: 'Machinist', tagId: 'UWB-108', x: 62, y: 28, zoneCode: 'ZONE-B' },
    { id: 'w-4', name: 'Ananya Sen (Logistics)', role: 'AGV Handler', tagId: 'UWB-077', x: 30, y: 78, zoneCode: 'ZONE-C' },
    { id: 'w-5', name: 'Rohan Mehra (QC Inspector)', role: 'QA Inspector', tagId: 'UWB-055', x: 65, y: 72, zoneCode: 'ZONE-D' },
    { id: 'w-6', name: 'Priya Nair (Packaging)', role: 'Packer', tagId: 'UWB-012', x: 82, y: 65, zoneCode: 'ZONE-D' }
  ]);

  const cobot = machines.find(m => m.code === 'CBT-101');
  const activeZoneAlerts = alerts.filter(a => a.status === 'active');

  // Interactive worker repositioning when clicking on the floor
  const handleFloorClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // If a worker is selected, move them to the clicked location
    if (selectedWorker) {
      setWorkers(prev =>
        prev.map(w => {
          if (w.id === selectedWorker.id) {
            // Determine zone
            let zone = 'ZONE-A';
            if (clickX >= 50 && clickY < 50) zone = 'ZONE-B';
            else if (clickX < 50 && clickY >= 50) zone = 'ZONE-C';
            else if (clickX >= 50 && clickY >= 50) zone = 'ZONE-D';

            return { ...w, x: Number(clickX.toFixed(1)), y: Number(clickY.toFixed(1)), zoneCode: zone };
          }
          return w;
        })
      );
    }
  };

  // Helper to calculate distance from worker to cobot in meters (scaled)
  const calculateDistanceToCobot = (workerX: number, workerY: number) => {
    if (!cobot) return 5;
    const dx = workerX - cobot.position.x;
    const dy = workerY - cobot.position.y;
    const distPercentage = Math.sqrt(dx * dx + dy * dy);
    // 100% is approximately 30 meters floor width
    return Number(((distPercentage / 100) * 25).toFixed(2));
  };

  const nearestWorkerDist = cobot
    ? Math.min(...workers.map(w => calculateDistanceToCobot(w.x, w.y)))
    : 2.5;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
              Digital Twin Factory Floor & Real-Time Asset Tracking
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
              ISO/TS 15066 Compliance Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time UWB positioning, automated collaborative safety zones, and machine telemetry.
            <span className="text-amber-300 font-medium ml-1">
              Select a worker below, then click on the floor map to simulate worker movement!
            </span>
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <div className="text-right pr-3 border-r border-slate-800 hidden sm:block">
            <div className="text-[10px] uppercase font-bold text-slate-400">Collaborative Zone A Distance</div>
            <div
              className={`text-sm font-mono font-bold ${
                nearestWorkerDist < 0.8
                  ? 'text-red-400'
                  : nearestWorkerDist < 2.0
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {nearestWorkerDist} m {nearestWorkerDist < 0.8 ? '(Protective Halt)' : nearestWorkerDist < 2.0 ? '(Reduced Spd)' : '(Normal)'}
            </div>
          </div>
          <button
            onClick={() => {
              // Move worker 1 inside cobot zone to demo ISO breach
              setWorkers(prev =>
                prev.map(w =>
                  w.id === 'w-1'
                    ? { ...w, x: (cobot?.position.x || 22) + 2, y: (cobot?.position.y || 25) + 1.5, zoneCode: 'ZONE-A' }
                    : w
                )
              );
            }}
            className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/80 text-xs font-medium flex items-center space-x-1.5 transition"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>Test Zone A Breach</span>
          </button>
        </div>
      </div>

      {/* Main Floor Layout & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SVG Floor Map - 3 Cols on Large Screens */}
        <div className="lg:col-span-3 bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-inner relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Zone A: Cobots & Welding
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Zone B: CNC Machining
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Zone C: AGV Transit
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Zone D: QA & Press
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-500 hidden sm:inline">
              Grid Scale: 1:100 (UWB Mesh Active)
            </span>
          </div>

          {/* Interactive SVG Factory Floor */}
          <div className="w-full aspect-[16/10] bg-slate-950 rounded-lg border border-slate-800 relative cursor-crosshair overflow-hidden">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              onClick={handleFloorClick}
            >
              {/* Floor Grid Lines */}
              <defs>
                <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                  <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#1e293b" strokeWidth="0.3" />
                </pattern>
                {/* Cobot Safety Perimeter Gradients */}
                <radialGradient id="cobotPerimeterCaution" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#eab308" stopOpacity="0.35" />
                  <stop offset="80%" stopColor="#eab308" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="cobotPerimeterDanger" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                  <stop offset="85%" stopColor="#ef4444" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="100" height="100" fill="url(#grid)" />

              {/* Transit Aisles & Safety Walkways */}
              <line x1="48" y1="0" x2="48" y2="100" stroke="#334155" strokeWidth="3" strokeDasharray="1,1" />
              <line x1="0" y1="48" x2="100" y2="48" stroke="#334155" strokeWidth="3" strokeDasharray="1,1" />

              {/* Zone A: Robotic Welding & Cobot Cell */}
              <rect
                x="4"
                y="5"
                width="42"
                height="40"
                rx="2"
                fill="#0f172a"
                stroke={
                  zones[0]?.safetyStatus === 'breach'
                    ? '#ef4444'
                    : zones[0]?.safetyStatus === 'caution'
                    ? '#eab308'
                    : '#3b82f6'
                }
                strokeWidth="0.8"
                strokeDasharray="2,1"
              />
              <text x="6" y="10" fill="#93c5fd" fontSize="2.5" fontWeight="bold" fontFamily="monospace">
                ZONE A: ROBOTIC WELDING & COBOT
              </text>

              {/* ISO/TS 15066 Cobot Safety Perimeter around KUKA (CBT-101) */}
              {cobot && (
                <g>
                  {/* Outer Warning Perimeter (2.0m ~ 12% radius) */}
                  <circle
                    cx={cobot.position.x}
                    cy={cobot.position.y}
                    r="12"
                    fill="url(#cobotPerimeterCaution)"
                    stroke="#eab308"
                    strokeWidth="0.4"
                    strokeDasharray="1,1"
                    className="animate-pulse"
                  />
                  {/* Inner Protective Stop Perimeter (0.8m ~ 5.5% radius) */}
                  <circle
                    cx={cobot.position.x}
                    cy={cobot.position.y}
                    r="5.5"
                    fill={cobot.safetyZoneStatus === 'protective_stop' ? 'url(#cobotPerimeterDanger)' : '#ef444415'}
                    stroke="#ef4444"
                    strokeWidth="0.6"
                  />
                  <text
                    x={cobot.position.x - 5.5}
                    y={cobot.position.y - 6.5}
                    fill="#fca5a5"
                    fontSize="1.6"
                    fontFamily="monospace"
                  >
                    ISO/TS 15066 (0.8m STOP)
                  </text>
                </g>
              )}

              {/* Zone B: Precision CNC Machining */}
              <rect
                x="52"
                y="5"
                width="44"
                height="40"
                rx="2"
                fill="#0f172a"
                stroke="#8b5cf6"
                strokeWidth="0.8"
                strokeDasharray="2,1"
              />
              <text x="54" y="10" fill="#c4b5fd" fontSize="2.5" fontWeight="bold" fontFamily="monospace">
                ZONE B: PRECISION CNC MACHINING
              </text>

              {/* Zone C: Automated AGV Transit */}
              <rect
                x="4"
                y="52"
                width="42"
                height="43"
                rx="2"
                fill="#0f172a"
                stroke="#10b981"
                strokeWidth="0.8"
                strokeDasharray="2,1"
              />
              <text x="6" y="57" fill="#6ee7b7" fontSize="2.5" fontWeight="bold" fontFamily="monospace">
                ZONE C: AGV LOGISTICS & ASSEMBLY
              </text>
              {/* AGV Guide Track */}
              <path
                d="M 12 70 L 38 70 A 5 5 0 0 1 42 75 L 42 85"
                fill="none"
                stroke="#10b98155"
                strokeWidth="1.5"
                strokeDasharray="2,1"
              />

              {/* Zone D: Quality & Hydraulic Press */}
              <rect
                x="52"
                y="52"
                width="44"
                height="43"
                rx="2"
                fill="#0f172a"
                stroke="#f59e0b"
                strokeWidth="0.8"
                strokeDasharray="2,1"
              />
              <text x="54" y="57" fill="#fcd34d" fontSize="2.5" fontWeight="bold" fontFamily="monospace">
                ZONE D: QUALITY INSPECTION & PRESS
              </text>

              {/* Machines Rendered as Interactive Nodes */}
              {machines.map(m => {
                const isSelected = selectedMachine?.id === m.id;
                const statusColor =
                  m.status === 'running'
                    ? '#10b981'
                    : m.status === 'fault'
                    ? '#ef4444'
                    : m.status === 'maintenance'
                    ? '#f59e0b'
                    : '#94a3b8';

                return (
                  <g
                    key={m.id}
                    className="cursor-pointer transition transform hover:scale-110"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedMachine(m);
                      setSelectedWorker(null);
                    }}
                  >
                    <rect
                      x={m.position.x - 3.5}
                      y={m.position.y - 3.5}
                      width="7"
                      height="7"
                      rx="1"
                      fill="#1e293b"
                      stroke={isSelected ? '#38bdf8' : statusColor}
                      strokeWidth={isSelected ? 1.2 : 0.8}
                    />
                    <circle cx={m.position.x} cy={m.position.y} r="1.5" fill={statusColor} />
                    {/* Machine Code Label */}
                    <text
                      x={m.position.x}
                      y={m.position.y + 5.2}
                      fill="#f1f5f9"
                      fontSize="1.8"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {m.code}
                    </text>
                  </g>
                );
              })}

              {/* Workers Rendered as Draggable / Clickable Avatars */}
              {workers.map(w => {
                const isSelected = selectedWorker?.id === w.id;
                return (
                  <g
                    key={w.id}
                    className="cursor-pointer transition"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedWorker(w);
                      setSelectedMachine(null);
                    }}
                  >
                    <circle
                      cx={w.x}
                      cy={w.y}
                      r="2.2"
                      fill={isSelected ? '#38bdf8' : '#0284c7'}
                      stroke={isSelected ? '#ffffff' : '#38bdf8'}
                      strokeWidth={isSelected ? 0.8 : 0.4}
                    />
                    <circle cx={w.x} cy={w.y} r="0.9" fill="#ffffff" />
                    {/* Worker Name Label */}
                    <text
                      x={w.x}
                      y={w.y - 3}
                      fill="#e2e8f0"
                      fontSize="1.5"
                      textAnchor="middle"
                      fontWeight="600"
                    >
                      {w.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Instruction Callout on Floor */}
            {selectedWorker && (
              <div className="absolute bottom-3 left-3 bg-cyan-950/90 text-cyan-200 border border-cyan-800 text-[11px] px-3 py-1.5 rounded-md backdrop-blur flex items-center space-x-2">
                <Move className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>
                  Moving <strong>{selectedWorker.name}</strong>: Click anywhere on the floor map to relocate!
                </span>
              </div>
            )}
          </div>

          {/* Quick Workers Bar */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Select Worker to Reposition:</span>
            <div className="flex flex-wrap gap-1.5">
              {workers.map(w => (
                <button
                  key={w.id}
                  onClick={() => {
                    setSelectedWorker(w);
                    setSelectedMachine(null);
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition ${
                    selectedWorker?.id === w.id
                      ? 'bg-cyan-600 text-white shadow-sm ring-1 ring-cyan-300'
                      : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                  }`}
                >
                  {w.name.split(' ')[0]} ({w.zoneCode})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Inspector Panel */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-4">
          {selectedMachine ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                    {selectedMachine.code}
                  </span>
                  <h3 className="font-bold text-sm text-white leading-tight">{selectedMachine.name}</h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                    selectedMachine.status === 'running'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : selectedMachine.status === 'fault'
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {selectedMachine.status}
                </span>
              </div>

              {/* Health & OEE */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Health Index</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">
                    {selectedMachine.healthScore}%
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full rounded-full"
                      style={{ width: `${selectedMachine.healthScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Overall OEE</div>
                  <div className="text-lg font-mono font-bold text-emerald-400">
                    {selectedMachine.oee}%
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${selectedMachine.oee}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Live Telemetry Snapshot */}
              <div className="space-y-2 text-xs">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Live Sensor Telemetry
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Temperature:</span>
                    <span
                      className={
                        selectedMachine.temperature > 75 ? 'text-red-400 font-bold' : 'text-slate-200'
                      }
                    >
                      {selectedMachine.temperature} °C
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vibration RMS:</span>
                    <span
                      className={
                        selectedMachine.vibration > 4.5 ? 'text-amber-400 font-bold' : 'text-slate-200'
                      }
                    >
                      {selectedMachine.vibration} mm/s
                    </span>
                  </div>
                  {selectedMachine.proximityDistance && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Worker Proximity:</span>
                      <span
                        className={
                          selectedMachine.proximityDistance < 0.8
                            ? 'text-red-400 font-bold'
                            : selectedMachine.proximityDistance < 2.0
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }
                      >
                        {selectedMachine.proximityDistance} m
                      </span>
                    </div>
                  )}
                  {selectedMachine.hydraulicPressure && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hydraulic Pressure:</span>
                      <span className="text-slate-200">{selectedMachine.hydraulicPressure} bar</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Collaborative Robot Safety Badge */}
              {selectedMachine.isCobot && (
                <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/60 text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 text-blue-300 font-semibold">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    <span>ISO/TS 15066 Cobot Safety</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Mode:{' '}
                    <span className="font-mono font-bold uppercase text-white">
                      {selectedMachine.safetyZoneStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              )}

              {/* AI Diagnostic Trigger */}
              <button
                onClick={() => setSelectedMachineForAi(selectedMachine)}
                className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-cyan-600/30 transition"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Run AI Predictive Diagnostic</span>
              </button>
            </div>
          ) : selectedWorker ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                  UWB Beacon: {selectedWorker.tagId}
                </span>
                <h3 className="font-bold text-sm text-white">{selectedWorker.name}</h3>
                <p className="text-xs text-slate-400">{selectedWorker.role}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Current Zone</div>
                <div className="font-mono text-sm text-cyan-300">{selectedWorker.zoneCode}</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold pt-1">
                  Floor Coordinates
                </div>
                <div className="font-mono text-xs text-slate-300">
                  X: {selectedWorker.x}% &bull; Y: {selectedWorker.y}%
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold pt-1">
                  Distance to KUKA Cobot
                </div>
                <div
                  className={`font-mono text-sm font-bold ${
                    calculateDistanceToCobot(selectedWorker.x, selectedWorker.y) < 0.8
                      ? 'text-red-400'
                      : calculateDistanceToCobot(selectedWorker.x, selectedWorker.y) < 2.0
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {calculateDistanceToCobot(selectedWorker.x, selectedWorker.y)} meters
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                <p className="text-[11px] leading-relaxed">
                  Click anywhere on the factory floor grid to simulate worker relocation and observe real-time
                  proximity and hazard calculations.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
              <Info className="w-8 h-8 text-slate-600" />
              <p className="text-xs">Click on any machine or worker on the floor plan to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
