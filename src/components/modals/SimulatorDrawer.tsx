import React from 'react';
import { useFactory } from '../../context/FactoryContext';
import {
  X,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Radio,
  Flame,
  Activity,
  Gauge,
  CheckCircle2,
  Zap,
  Info
} from 'lucide-react';

interface SimulatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulatorDrawer: React.FC<SimulatorDrawerProps> = ({ isOpen, onClose }) => {
  const { isStreaming, toggleStreaming, injectScenario, resetSimulation } = useFactory();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 space-y-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">IoT Sensor Simulation Deck</h3>
                <p className="text-xs text-slate-400">Prototype Test & Anomaly Injector</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stream Controller */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Live Telemetry Generator</span>
              <span
                className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                  isStreaming
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}
              >
                {isStreaming ? 'STREAMING (3s)' : 'PAUSED'}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Generates stochastic sensor jitter (thermal dissipation, spindle micro-vibrations, proximity) to simulate industrial MQTT broker packets.
            </p>

            <button
              onClick={toggleStreaming}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 border transition ${
                isStreaming
                  ? 'bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border-amber-800'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Telemetry Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Telemetry Stream</span>
                </>
              )}
            </button>
          </div>

          {/* Fault Scenarios */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Inject Industrial Failure Scenarios
            </h4>
            <p className="text-xs text-slate-400">
              Trigger specific machine failure modes to observe automatic alert raising, risk score classification, and Cobot protective stops:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => injectScenario('proximity_breach')}
                className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-red-950/30 border border-slate-800 hover:border-red-800/80 transition group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white group-hover:text-red-300 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-red-400" />
                    Cobot ISO/TS 15066 Proximity Breach
                  </span>
                  <span className="text-[10px] font-mono text-red-400 uppercase">Critical</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Moves human distance to 0.52m on KUKA CyberWeld Cobot. Automatically executes protective halt and sets Zone A to breach state.
                </p>
              </button>

              <button
                onClick={() => injectScenario('motor_overheat')}
                className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-amber-950/30 border border-slate-800 hover:border-amber-800/80 transition group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white group-hover:text-amber-300 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Spindle Thermal Runaway
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 uppercase">Warning</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Raises Haas CNC-201 temperature to 84.6°C, exceeding maximum thermal cutoff.
                </p>
              </button>

              <button
                onClick={() => injectScenario('vibration_anomaly')}
                className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-purple-950/30 border border-slate-800 hover:border-purple-800/80 transition group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white group-hover:text-purple-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    Severe Bearing Harmonic Vibration
                  </span>
                  <span className="text-[10px] font-mono text-purple-400 uppercase">Critical</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Spikes vibration to 6.4 mm/s RMS, demonstrating ISO 10816-3 Class II breach.
                </p>
              </button>

              <button
                onClick={() => injectScenario('hydraulic_leak')}
                className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-blue-950/30 border border-slate-800 hover:border-blue-800/80 transition group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white group-hover:text-blue-300 flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-blue-400" />
                    Hydraulic Circuit Depressurization
                  </span>
                  <span className="text-[10px] font-mono text-blue-400 uppercase">Warning</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Drops Bosch Rexroth 150T Press pressure to 68 bar.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Reset */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => {
              resetSimulation();
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 border border-slate-700 transition"
          >
            <RotateCcw className="w-4 h-4 text-emerald-400" />
            <span>Restore Factory Baseline (Nominal)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
