import React, { useState } from 'react';
import { useFactory } from '../../context/FactoryContext';
import { Alert } from '../../types';
import { X, CheckCircle, FileText } from 'lucide-react';

interface ResolveAlertModalProps {
  alert: Alert | null;
  onClose: () => void;
}

export const ResolveAlertModal: React.FC<ResolveAlertModalProps> = ({ alert, onClose }) => {
  const { resolveAlert } = useFactory();
  const [rootCause, setRootCause] = useState<string>(
    'Parameter recalibrated and mechanical safety clearance completed.'
  );
  const [notes, setNotes] = useState<string>(
    'Technician inspected sensor optical lenses, cleared obstruction, and ran calibration test.'
  );

  if (!alert) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rootCause.trim()) return;

    await resolveAlert(alert.id, rootCause, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Resolve Alert & Document RCA</h3>
            <p className="text-xs text-slate-400">
              Complete Root Cause Analysis (RCA) and certify machine readiness to resume normal speed.
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 text-xs text-slate-300">
          <div className="font-bold text-white">{alert.title}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{alert.description}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Root Cause Classification (RCA)
            </label>
            <input
              type="text"
              required
              value={rootCause}
              onChange={e => setRootCause(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Corrective Action Taken & Resolution Notes
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg shadow-emerald-500/20"
            >
              Certify Resolved
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
