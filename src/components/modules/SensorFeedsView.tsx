import React, { useState } from 'react';
import { useFactory } from '../../context/FactoryContext';
import { SensorType } from '../../types';
import {
  Activity,
  Thermometer,
  Radio,
  Gauge,
  Sliders,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export const SensorFeedsView: React.FC = () => {
  const { sensors, isStreaming, toggleStreaming, refreshData } = useFactory();
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredSensors = sensors.filter(s => {
    if (selectedType === 'all') return true;
    return s.sensorType === selectedType;
  });

  const getSensorIcon = (type: SensorType) => {
    switch (type) {
      case 'temperature':
        return Thermometer;
      case 'vibration':
        return Activity;
      case 'proximity':
        return Radio;
      case 'pressure':
        return Gauge;
      default:
        return Sliders;
    }
  };

  // Helper to render inline SVG sparkline
  const renderSparkline = (history: number[], minVal: number, maxVal: number, isWarning: boolean, isCritical: boolean) => {
    if (!history || history.length < 2) return null;
    const width = 120;
    const height = 36;
    const min = Math.min(...history, minVal * 0.9);
    const max = Math.max(...history, maxVal * 1.1) || 1;
    const range = max - min || 1;

    const points = history
      .map((val, idx) => {
        const x = (idx / (history.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    const strokeColor = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#38bdf8';

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {/* Current point pulse */}
        {points.length > 0 && (
          <circle
            cx={points.split(' ').pop()?.split(',')[0]}
            cy={points.split(' ').pop()?.split(',')[1]}
            r="3"
            fill={strokeColor}
            className="animate-ping"
          />
        )}
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              Real-Time IoT Sensor Telemetry & Stream Ingestion
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
              MERN Pipeline Live
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Streaming continuous vibration (ISO 10816), Cobot optical proximity (ISO/TS 15066), and thermal loads.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={toggleStreaming}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 border transition ${
              isStreaming
                ? 'bg-amber-950/60 text-amber-300 border-amber-800/80 hover:bg-amber-900/60'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/60'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Ingestion</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Stream</span>
              </>
            )}
          </button>

          <button
            onClick={() => refreshData()}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Force Telemetry Sync"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Sensor Types</option>
            <option value="temperature">Temperature (°C)</option>
            <option value="vibration">Vibration (mm/s RMS)</option>
            <option value="proximity">Proximity Distance (m)</option>
            <option value="pressure">Hydraulic Pressure (bar)</option>
          </select>
        </div>
      </div>

      {/* Sensor Cards Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSensors.map(sensor => {
          const Icon = getSensorIcon(sensor.sensorType);
          const isCritical = sensor.status === 'critical';
          const isWarning = sensor.status === 'warning';

          return (
            <div
              key={sensor.id}
              className={`p-4 rounded-xl border transition shadow-sm ${
                isCritical
                  ? 'bg-red-950/30 border-red-800'
                  : isWarning
                  ? 'bg-amber-950/20 border-amber-800/80'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <Icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-cyan-400">{sensor.machineCode}</span>
                    <h3 className="font-semibold text-xs text-white capitalize">{sensor.sensorType} Stream</h3>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${
                    isCritical
                      ? 'bg-red-900/80 text-red-200 border-red-500 animate-pulse'
                      : isWarning
                      ? 'bg-amber-900/80 text-amber-200 border-amber-500'
                      : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                  }`}
                >
                  {sensor.status}
                </span>
              </div>

              {/* Value & Sparkline */}
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Live Reading</div>
                  <div className="text-2xl font-mono font-extrabold text-white flex items-baseline space-x-1">
                    <span className={isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-slate-100'}>
                      {sensor.value}
                    </span>
                    <span className="text-xs text-slate-400">{sensor.unit}</span>
                  </div>
                </div>

                {/* Sparkline Visual */}
                <div className="pb-1">
                  {renderSparkline(
                    sensor.history,
                    sensor.thresholdMin || 0,
                    sensor.thresholdMax || 100,
                    isWarning,
                    isCritical
                  )}
                </div>
              </div>

              {/* Threshold & Timestamp Footer */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>
                  Threshold: {sensor.thresholdMin ? `${sensor.thresholdMin} - ` : '< '}
                  {sensor.thresholdMax} {sensor.unit}
                </span>
                <span className="text-slate-500">
                  {new Date(sensor.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Industrial Sensor Threshold Reference Spec Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          Industrial Threshold Classification Specs (ISO / IEC Standards)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Sensor Parameter</th>
                <th className="py-2.5 px-3">Nominal Band</th>
                <th className="py-2.5 px-3">Warning Band</th>
                <th className="py-2.5 px-3">Protective Shutdown</th>
                <th className="py-2.5 px-3">Standard Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Spindle Vibration RMS</td>
                <td className="py-2.5 px-3 text-emerald-400">0.2 - 3.5 mm/s</td>
                <td className="py-2.5 px-3 text-amber-400">3.5 - 4.5 mm/s</td>
                <td className="py-2.5 px-3 text-red-400">&gt; 4.5 mm/s</td>
                <td className="py-2.5 px-3 text-slate-400">ISO 10816-3 Class II</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Cobot Proximity Envelope</td>
                <td className="py-2.5 px-3 text-emerald-400">&gt; 2.0 m (100% velocity)</td>
                <td className="py-2.5 px-3 text-amber-400">0.8 - 2.0 m (250 mm/s)</td>
                <td className="py-2.5 px-3 text-red-400">&lt; 0.8 m (Emergency Stop)</td>
                <td className="py-2.5 px-3 text-slate-400">ISO/TS 15066:2016 Cl. 5.5</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Motor Core Temperature</td>
                <td className="py-2.5 px-3 text-emerald-400">25 - 65 °C</td>
                <td className="py-2.5 px-3 text-amber-400">65 - 75 °C</td>
                <td className="py-2.5 px-3 text-red-400">&gt; 75 °C (Thermal trip)</td>
                <td className="py-2.5 px-3 text-slate-400">IEC 60034-1 Thermal Class F</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Hydraulic Circuit Pressure</td>
                <td className="py-2.5 px-3 text-emerald-400">120 - 160 bar</td>
                <td className="py-2.5 px-3 text-amber-400">90 - 120 bar</td>
                <td className="py-2.5 px-3 text-red-400">&lt; 90 bar (Leak warning)</td>
                <td className="py-2.5 px-3 text-slate-400">DIN EN ISO 4413</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
