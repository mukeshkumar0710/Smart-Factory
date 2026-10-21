import React, { useState } from 'react';
import { useFactory } from '../../context/FactoryContext';
import { X, CalendarCheck2, Plus, Trash2 } from 'lucide-react';

interface CreateTaskModalProps {
  initialMachineId?: string;
  prefillData?: any;
  onClose: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  initialMachineId,
  prefillData,
  onClose
}) => {
  const { machines, users, createMaintenanceTask } = useFactory();

  const [title, setTitle] = useState<string>(
    prefillData?.title || 'Spindle High-Speed Vibration Inspection & Alignment'
  );
  const [machineId, setMachineId] = useState<string>(
    prefillData?.machineId || initialMachineId || machines[0]?.id || ''
  );
  const [type, setType] = useState<'preventive' | 'predictive' | 'corrective'>(
    prefillData?.type || 'predictive'
  );
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>(
    prefillData?.priority || 'high'
  );
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  );
  const [estimatedHours, setEstimatedHours] = useState<number>(2.5);
  const [assignedTechnician, setAssignedTechnician] = useState<string>(
    users.find(u => u.role === 'maintenance')?.name || 'Naeya Joy Christina'
  );
  const [lotoRequired, setLotoRequired] = useState<boolean>(true);
  const [iso15066Clearance, setIso15066Clearance] = useState<boolean>(false);
  const [partsInput, setPartsInput] = useState<string>('Spindle Bearing Set, Kluber NBU 15 Grease');
  const [checklist, setChecklist] = useState<{ id: string; task: string; isCompleted: boolean }[]>(
    prefillData?.checklist || [
      { id: '1', task: 'Perform electrical lockout / tagout (LOTO)', isCompleted: false },
      { id: '2', task: 'Disassemble spindle housing and inspect bearing balls for pitting', isCompleted: false },
      { id: '3', task: 'Re-pack high-speed grease and check dynamic vibration balance', isCompleted: false },
      { id: '4', task: 'Obtain safety officer sign-off before re-energizing', isCompleted: false }
    ]
  );
  const [newCheckItem, setNewCheckItem] = useState<string>('');
  const [notes, setNotes] = useState<string>(prefillData?.notes || '');

  const handleAddCheckItem = () => {
    if (!newCheckItem.trim()) return;
    setChecklist(prev => [
      ...prev,
      { id: `chk-${Date.now()}`, task: newCheckItem.trim(), isCompleted: false }
    ]);
    setNewCheckItem('');
  };

  const handleRemoveCheckItem = (id: string) => {
    setChecklist(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !machineId) return;

    const parts = partsInput
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    await createMaintenanceTask({
      title,
      machineId,
      type,
      priority,
      scheduledDate,
      estimatedHours,
      assignedTechnician,
      assignedTeam: 'maintenance',
      lotoRequired,
      iso15066Clearance,
      partsRequired: parts,
      checklist,
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
            <CalendarCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Create Maintenance Work Order</h3>
            <p className="text-xs text-slate-400">
              Schedule cross-functional maintenance with LOTO verification and multi-team signoffs.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Work Order Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Target Machine Asset</label>
              <select
                value={machineId}
                onChange={e => setMachineId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {machines.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.code} - {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Maintenance Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="predictive">Predictive (Sensor Anomaly)</option>
                <option value="preventive">Preventive (Routine Scheduled)</option>
                <option value="corrective">Corrective (Immediate Breakdown)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="high">High (Urgent)</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Scheduled Date/Time</label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Est. Hours</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={estimatedHours}
                onChange={e => setEstimatedHours(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Assigned Lead Technician</label>
            <input
              type="text"
              value={assignedTechnician}
              onChange={e => setAssignedTechnician(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Safety Checkboxes */}
          <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-slate-950 border border-slate-800">
            <label className="flex items-center space-x-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={lotoRequired}
                onChange={e => setLotoRequired(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
              />
              <span>OSHA 1910.147 LOTO Protocol Required</span>
            </label>

            <label className="flex items-center space-x-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={iso15066Clearance}
                onChange={e => setIso15066Clearance(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
              />
              <span>ISO/TS 15066 Cobot Safety Clearance</span>
            </label>
          </div>

          {/* Spare Parts Required */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Required Spare Parts (comma separated)
            </label>
            <input
              type="text"
              value={partsInput}
              onChange={e => setPartsInput(e.target.value)}
              placeholder="e.g. SKF Bearing 7014, O-Ring Seal Kit"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Checklist Items */}
          <div className="space-y-2">
            <label className="text-slate-300 font-semibold block">Procedure Checklist Items</label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {checklist.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-850"
                >
                  <span className="text-slate-300">{item.task}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCheckItem(item.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add checklist step..."
                value={newCheckItem}
                onChange={e => setNewCheckItem(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleAddCheckItem}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
              >
                Add Step
              </button>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Work Order Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Notes for the maintenance and safety leads..."
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
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-slate-950 font-bold transition shadow-lg shadow-amber-500/20"
            >
              Schedule Work Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
