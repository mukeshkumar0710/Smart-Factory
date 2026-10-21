import React, { useState, useEffect } from 'react';
import { Machine } from '../../types';
import { api } from '../../services/api';
import { useFactory } from '../../context/FactoryContext';
import {
  Sparkles,
  X,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Shield,
  Activity,
  Clock,
  ArrowRight,
  Cpu,
  Loader2
} from 'lucide-react';

interface AiDiagnosticModalProps {
  machine: Machine | null;
  onClose: () => void;
  onScheduleMaintenance: (taskPrefill: any) => void;
}

export const AiDiagnosticModal: React.FC<AiDiagnosticModalProps> = ({
  machine,
  onClose,
  onScheduleMaintenance
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [diagnostic, setDiagnostic] = useState<any | null>(null);
  const [operatorNotes, setOperatorNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!machine) return;
    let isMounted = true;
    setLoading(true);
    setError(null);

    api
      .runAiDiagnostic(machine.id, operatorNotes)
      .then(res => {
        if (isMounted) {
          setDiagnostic(res);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message || 'Diagnostic failed');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [machine]);

  if (!machine) return null;

  const handleRerun = () => {
    setLoading(true);
    api
      .runAiDiagnostic(machine.id, operatorNotes)
      .then(res => {
        setDiagnostic(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-950 text-purple-400 border border-purple-800">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-cyan-400">{machine.code}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {machine.category}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">{machine.name}</h3>
            <p className="text-xs text-slate-400">
              AI Predictive Diagnostic Engine &bull; Sensor Preprocessing &bull; Feature Extraction
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-300">
              Ingesting sensor telemetry & analyzing harmonic vibration...
            </p>
            <p className="text-xs text-slate-500 font-mono">
              Evaluating ISO 10816-3 & ISO/TS 15066 safety criteria
            </p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs">
            {error}
          </div>
        ) : diagnostic ? (
          <div className="space-y-4">
            {/* Health Classification Banner */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                diagnostic.healthClassification === 'Critical Failure Imminent' ||
                diagnostic.healthClassification === 'Degraded'
                  ? 'bg-red-950/30 border-red-800'
                  : diagnostic.healthClassification === 'Caution'
                  ? 'bg-amber-950/30 border-amber-800'
                  : 'bg-emerald-950/30 border-emerald-800'
              }`}
            >
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400">
                  Equipment Health Classification
                </span>
                <div
                  className={`text-lg font-bold ${
                    diagnostic.failureProbability > 50
                      ? 'text-red-400'
                      : diagnostic.failureProbability > 25
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {diagnostic.healthClassification}
                </div>
                <div className="text-xs text-slate-300 mt-0.5">{diagnostic.primaryRiskFactor}</div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Failure Risk</span>
                <div className="text-2xl font-mono font-extrabold text-white">
                  {diagnostic.failureProbability}%
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  RUL: ~{diagnostic.remainingUsefulLifeHours} hrs
                </div>
              </div>
            </div>

            {/* Root Cause Analysis */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Root Cause & Spectral Telemetry Analysis
              </div>
              <p className="text-slate-300 leading-relaxed">{diagnostic.rootCauseAnalysis}</p>
              <div className="text-[10px] font-mono text-cyan-400 pt-1">
                Standard: {diagnostic.isoStandardCompliance}
              </div>
            </div>

            {/* Prescriptive Action Steps */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                Prescriptive Maintenance Recommendations
              </div>
              <div className="space-y-1.5">
                {diagnostic.prescriptiveActions.map((action: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-850 text-xs text-slate-200 flex items-start space-x-2"
                  >
                    <span className="font-mono text-cyan-400 font-bold shrink-0">{idx + 1}.</span>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Directive */}
            <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-800/60 text-xs text-slate-300 flex items-start space-x-2.5">
              <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-blue-300">Safety Directive:</strong> {diagnostic.safetyAdvisory}
              </div>
            </div>

            {/* Operator Notes Input for Re-run */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <label className="text-xs text-slate-400">Add Operator Observation & Recalculate:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Audible harmonic noise noticed during high-speed cycle..."
                  value={operatorNotes}
                  onChange={e => setOperatorNotes(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleRerun}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                >
                  Recalculate
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                Engine Source: {diagnostic.aiSource}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs transition"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onScheduleMaintenance({
                      machineId: machine.id,
                      title: `${diagnostic.recommendedMaintenanceType.toUpperCase()}: ${diagnostic.primaryRiskFactor}`,
                      type: diagnostic.recommendedMaintenanceType,
                      priority: diagnostic.failureProbability > 50 ? 'high' : 'medium',
                      notes: `Auto-generated from AI diagnostic. Root Cause: ${diagnostic.rootCauseAnalysis}`,
                      checklist: diagnostic.prescriptiveActions.map((act: string, i: number) => ({
                        id: `chk-${i}`,
                        task: act,
                        isCompleted: false
                      }))
                    });
                  }}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-cyan-600/20 transition"
                >
                  <span>Auto-Create Work Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
