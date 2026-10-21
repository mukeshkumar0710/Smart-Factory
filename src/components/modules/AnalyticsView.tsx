import React from 'react';
import { useFactory } from '../../context/FactoryContext';
import {
  BarChart3,
  TrendingUp,
  Cpu,
  Shield,
  Activity,
  Sparkles,
  PieChart,
  Layers,
  ArrowUpRight,
  Info
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { machines, kpi, setSelectedMachineForAi } = useFactory();

  // Sort machines by risk (lowest health score first)
  const rankedMachines = [...machines].sort((a, b) => a.healthScore - b.healthScore);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Smart Factory Analytics & AI Predictive Intelligence
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-950 text-purple-300 border border-purple-800">
              AI / ML Activity Model &bull; ISO 10816-3
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous vibration feature extraction, failure probability classification, and Mean Time Between Failures (MTBF) analytics.
          </p>
        </div>
      </div>

      {/* Top 3 Metric Cards: OEE, MTBF, MTTR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Plant OEE */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Overall Plant OEE</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-white">{kpi?.avgOee ?? 87.2}%</div>
          <div className="space-y-1 text-[11px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span>Availability:</span>
              <span className="text-cyan-400">92.4%</span>
            </div>
            <div className="flex justify-between">
              <span>Performance:</span>
              <span className="text-indigo-400">88.5%</span>
            </div>
            <div className="flex justify-between">
              <span>Quality Rate:</span>
              <span className="text-emerald-400">98.2%</span>
            </div>
          </div>
        </div>

        {/* MTBF */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Mean Time Between Failures</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-cyan-300">{kpi?.mtbfHours ?? 428} hrs</div>
          <p className="text-[11px] text-slate-400">
            Average operational uptime between unplanned downtime events across all 6 production lines.
          </p>
        </div>

        {/* MTTR & Safety Incident */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Mean Time to Repair (MTTR)</span>
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-amber-300">{kpi?.mttrHours ?? 2.4} hrs</div>
          <p className="text-[11px] text-slate-400">
            Target: &lt; 3.0 hrs. Continuous IoT anomaly detection reduced turnaround time by 38%.
          </p>
        </div>
      </div>

      {/* Predictive Health & Failure Probability Ranking */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Predictive Maintenance Risk Ranking & Failure Probability
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by failure risk derived from real-time FFT vibration harmonics, thermal slope, and operational runtime.
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Algorithm: ISO 10816-3 + Gemini AI</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Equipment</th>
                <th className="py-2.5 px-3">Zone</th>
                <th className="py-2.5 px-3">Health Score</th>
                <th className="py-2.5 px-3">Failure Probability</th>
                <th className="py-2.5 px-3">Vib RMS (ISO Limit)</th>
                <th className="py-2.5 px-3">RUL (Hours)</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
              {rankedMachines.map(m => {
                const failureProb = Math.max(8, 100 - m.healthScore);
                const rul = Math.max(48, Math.round(m.healthScore * 14));
                const isHighRisk = failureProb > 30;

                return (
                  <tr key={m.id} className="hover:bg-slate-850/50 transition">
                    <td className="py-3 px-3">
                      <div className="font-sans font-bold text-white">{m.name}</div>
                      <div className="text-[10px] text-cyan-400">{m.code}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{m.zoneName.split(' ')[0]}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white">{m.healthScore}%</span>
                        <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              m.healthScore > 80
                                ? 'bg-cyan-500'
                                : m.healthScore > 65
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${m.healthScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                          isHighRisk
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {failureProb}% {isHighRisk ? 'Elevated' : 'Low'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={m.vibration > 4.5 ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                        {m.vibration} mm/s
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-200 font-bold">~{rul} hrs</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => setSelectedMachineForAi(m)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-medium flex items-center space-x-1 border border-slate-700 transition"
                      >
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>AI Diagnostic</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
