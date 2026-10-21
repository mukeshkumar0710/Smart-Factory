import React, { useState } from 'react';
import { useFactory } from '../../context/FactoryContext';
import { X, ShieldAlert, AlertTriangle } from 'lucide-react';
import { AlertSeverity } from '../../types';

interface CreateAlertModalProps {
  onClose: () => void;
}

export const CreateAlertModal: React.FC<CreateAlertModalProps> = ({ onClose }) => {
  const { machines, zones, createAlert } = useFactory();

  const [title, setTitle] = useState<string>('');
  const [severity, setSeverity] = useState<AlertSeverity>('warning');
  const [type, setType] = useState<any>('safety');
  const [machineId, setMachineId] = useState<string>('');
  const [zoneId, setZoneId] = useState<string>(zones[0]?.id || 'zone-1');
  const [description, setDescription] = useState<string>('');
  const [isoStandard, setIsoStandard] = useState<string>('ISO 45001 / ISO/TS 15066');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    await createAlert({
      title,
      severity,
      type,
      sourceMachineId: machineId || undefined,
      zoneId,
      description,
      isoStandard
    });

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
          <div className="p-2.5 rounded-xl bg-red-950 text-red-400 border border-red-800">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Raise Safety Hazard / Anomaly</h3>
            <p className="text-xs text-slate-400">
              Broadcasts immediate hazard notice to cross-functional teams and updates safety index.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Hazard / Incident Summary</label>
            <input
              type="text"
              required
              placeholder="e.g. Optical proximity blind spot observed near Cobot arm"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Severity Classification</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="critical">Critical (Immediate Halt Required)</option>
                <option value="warning">Warning (Parameter Deviation)</option>
                <option value="info">Info / Notice</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Alert Category</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="safety">Workspace Safety (ISO 45001)</option>
                <option value="proximity">Cobot Proximity (ISO/TS 15066)</option>
                <option value="hardware">Machine Telemetry (ISO 10816)</option>
                <option value="environmental">Environmental Hazard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Factory Zone</label>
              <select
                value={zoneId}
                onChange={e => setZoneId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {zones.map(z => (
                  <option key={z.id} value={z.id}>
                    {z.code} - {z.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Associated Machine (Optional)</label>
              <select
                value={machineId}
                onChange={e => setMachineId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="">None / General Area</option>
                {machines.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.code} - {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Detailed Observation</label>
            <textarea
              rows={3}
              required
              placeholder="Describe what occurred, any worker proximity breach, unusual noises, or safety perimeter violations..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Applicable Standard Reference</label>
            <input
              type="text"
              value={isoStandard}
              onChange={e => setIsoStandard(e.target.value)}
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
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition shadow-lg shadow-red-500/20"
            >
              Broadcast Hazard Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
