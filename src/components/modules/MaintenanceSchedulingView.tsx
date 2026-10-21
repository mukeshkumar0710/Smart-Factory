import React, { useState } from 'react';
import { useFactory } from '../../context/FactoryContext';
import { MaintenanceTask, MaintenanceStatus } from '../../types';
import {
  CalendarCheck2,
  Plus,
  Clock,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Layers,
  ChevronRight,
  ListFilter,
  CheckSquare,
  Square,
  Lock,
  Unlock
} from 'lucide-react';

interface MaintenanceSchedulingViewProps {
  onOpenCreateTaskModal: () => void;
}

export const MaintenanceSchedulingView: React.FC<MaintenanceSchedulingViewProps> = ({
  onOpenCreateTaskModal
}) => {
  const {
    maintenanceTasks,
    currentUser,
    updateMaintenanceTask,
    signoffMaintenanceTask
  } = useFactory();

  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(
    maintenanceTasks[0] || null
  );
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const kanbanColumns: { id: MaintenanceStatus; title: string; color: string }[] = [
    { id: 'scheduled', title: 'Scheduled Work Orders', color: 'border-blue-500' },
    { id: 'in_progress', title: 'In Execution', color: 'border-amber-500' },
    { id: 'pending_safety_signoff', title: 'Pending Cross-Team Signoff', color: 'border-purple-500' },
    { id: 'completed', title: 'Completed & Certified', color: 'border-emerald-500' }
  ];

  const handleToggleChecklist = (task: MaintenanceTask, itemId: string) => {
    const updatedChecklist = task.checklist.map(item =>
      item.id === itemId
        ? { ...item, isCompleted: !item.isCompleted, completedBy: !item.isCompleted ? currentUser.name : undefined }
        : item
    );

    const allChecked = updatedChecklist.every(i => i.isCompleted);
    let newStatus = task.status;
    if (allChecked && task.status === 'in_progress') {
      newStatus = 'pending_safety_signoff';
    }

    updateMaintenanceTask(task.id, {
      checklist: updatedChecklist,
      status: newStatus
    });

    if (selectedTask?.id === task.id) {
      setSelectedTask(prev =>
        prev
          ? {
              ...prev,
              checklist: updatedChecklist,
              status: newStatus
            }
          : null
      );
    }
  };

  const handleToggleLoto = (task: MaintenanceTask) => {
    const newLoto = !task.lotoCompleted;
    updateMaintenanceTask(task.id, { lotoCompleted: newLoto });
    if (selectedTask?.id === task.id) {
      setSelectedTask(prev => (prev ? { ...prev, lotoCompleted: newLoto } : null));
    }
  };

  const handleStatusChange = (task: MaintenanceTask, newStatus: MaintenanceStatus) => {
    updateMaintenanceTask(task.id, { status: newStatus });
    if (selectedTask?.id === task.id) {
      setSelectedTask(prev => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleSignoff = (task: MaintenanceTask, dept: 'operations' | 'maintenance' | 'safety') => {
    signoffMaintenanceTask(task.id, dept, true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CalendarCheck2 className="w-5 h-5 text-amber-400" />
              Cross-Functional Maintenance Scheduling & Work Orders
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-950 text-amber-300 border border-amber-800">
              Operations &bull; Maintenance &bull; Safety
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Coordinate plant downtime, track LOTO safety clearance, assign technicians, and execute certified multi-department sign-offs.
          </p>
        </div>

        {/* View Toggle & New Work Order Button */}
        <div className="flex items-center space-x-3">
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded-md font-medium transition ${
                viewMode === 'kanban'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md font-medium transition ${
                viewMode === 'list'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              List View
            </button>
          </div>

          <button
            onClick={onOpenCreateTaskModal}
            className="px-3 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Work Order</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {kanbanColumns.map(col => {
            const columnTasks = maintenanceTasks.filter(t => t.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-slate-900/80 rounded-xl border border-slate-800 p-3 space-y-3 flex flex-col justify-between min-h-[500px]"
              >
                <div>
                  {/* Column Header */}
                  <div className={`pb-2.5 border-b-2 ${col.color} flex items-center justify-between`}>
                    <h3 className="font-bold text-xs text-white uppercase tracking-wider">{col.title}</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-3 mt-3">
                    {columnTasks.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-500">No tasks in this stage</div>
                    ) : (
                      columnTasks.map(task => {
                        const completedChecks = task.checklist.filter(c => c.isCompleted).length;
                        const totalChecks = task.checklist.length;
                        const isSelected = selectedTask?.id === task.id;

                        return (
                          <div
                            key={task.id}
                            onClick={() => setSelectedTask(task)}
                            className={`p-3.5 rounded-xl bg-slate-950 border cursor-pointer transition shadow-sm space-y-2.5 ${
                              isSelected
                                ? 'border-cyan-400 ring-1 ring-cyan-500/50'
                                : 'border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] font-bold text-cyan-400">
                                {task.code}
                              </span>
                              <span
                                className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border ${
                                  task.priority === 'high'
                                    ? 'bg-red-950 text-red-300 border-red-800'
                                    : task.priority === 'medium'
                                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                                    : 'bg-blue-950 text-blue-300 border-blue-800'
                                }`}
                              >
                                {task.priority}
                              </span>
                            </div>

                            <h4 className="font-bold text-xs text-white leading-snug line-clamp-2">
                              {task.title}
                            </h4>

                            <div className="text-[11px] text-slate-400 flex items-center justify-between">
                              <span className="truncate">{task.machineName}</span>
                              <span className="font-mono text-amber-300 shrink-0">{task.estimatedHours}h</span>
                            </div>

                            {/* Checklist Progress */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] text-slate-400">
                                <span>Checklist</span>
                                <span className="font-mono">
                                  {completedChecks}/{totalChecks}
                                </span>
                              </div>
                              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                <div
                                  className="bg-cyan-500 h-full rounded-full"
                                  style={{
                                    width: `${totalChecks > 0 ? (completedChecks / totalChecks) * 100 : 0}%`
                                  }}
                                />
                              </div>
                            </div>

                            {/* Cross-functional Sign-off Badges */}
                            <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
                              <div className="flex items-center space-x-1 font-mono">
                                <span
                                  title="Operations Signoff"
                                  className={`px-1 py-0.5 rounded text-[9px] font-bold ${
                                    task.crossFunctionalSignoffs.operations.approved
                                      ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                      : 'bg-slate-900 text-slate-500'
                                  }`}
                                >
                                  OPS
                                </span>
                                <span
                                  title="Maintenance Signoff"
                                  className={`px-1 py-0.5 rounded text-[9px] font-bold ${
                                    task.crossFunctionalSignoffs.maintenance.approved
                                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                      : 'bg-slate-900 text-slate-500'
                                  }`}
                                >
                                  MNT
                                </span>
                                <span
                                  title="Safety / ISO Signoff"
                                  className={`px-1 py-0.5 rounded text-[9px] font-bold ${
                                    task.crossFunctionalSignoffs.safety.approved
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                      : 'bg-slate-900 text-slate-500'
                                  }`}
                                >
                                  SFT
                                </span>
                              </div>

                              <span className="text-[10px] text-slate-400 truncate max-w-[90px]">
                                {task.assignedTechnician.split(' ')[0]}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {col.id === 'scheduled' && (
                  <button
                    onClick={onOpenCreateTaskModal}
                    className="w-full py-2 rounded-lg border border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-xs flex items-center justify-center space-x-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table View */
        <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">WO Code</th>
                <th className="py-3 px-4">Work Order Title</th>
                <th className="py-3 px-4">Machine & Zone</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Technician</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Multi-Team Approvals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {maintenanceTasks.map(task => (
                <tr
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="hover:bg-slate-800/50 cursor-pointer transition"
                >
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{task.code}</td>
                  <td className="py-3 px-4 font-medium text-white">{task.title}</td>
                  <td className="py-3 px-4">{task.machineName}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        task.priority === 'high'
                          ? 'bg-red-950 text-red-300 border-red-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">{task.assignedTechnician}</td>
                  <td className="py-3 px-4 uppercase font-mono text-[11px]">{task.status.replace('_', ' ')}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1.5 font-mono text-[10px]">
                      <span className={task.crossFunctionalSignoffs.operations.approved ? 'text-blue-400' : 'text-slate-600'}>
                        OPS✓
                      </span>
                      <span className={task.crossFunctionalSignoffs.maintenance.approved ? 'text-amber-400' : 'text-slate-600'}>
                        MNT✓
                      </span>
                      <span className={task.crossFunctionalSignoffs.safety.approved ? 'text-emerald-400' : 'text-slate-600'}>
                        SFT✓
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected Task Inspection & Multi-Team Approval Drawer */}
      {selectedTask && (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-cyan-400">{selectedTask.code}</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedTask.type} Maintenance
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                  Stage: {selectedTask.status.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">{selectedTask.title}</h3>
              <p className="text-xs text-slate-400">
                Asset: {selectedTask.machineName} ({selectedTask.machineCode}) &bull; Scheduled Date:{' '}
                {new Date(selectedTask.scheduledDate).toLocaleString()}
              </p>
            </div>

            {/* Quick Stage Transitions */}
            <div className="flex items-center space-x-2">
              {selectedTask.status === 'scheduled' && (
                <button
                  onClick={() => handleStatusChange(selectedTask, 'in_progress')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Start Work Order</span>
                </button>
              )}
              {selectedTask.status === 'in_progress' && (
                <button
                  onClick={() => handleStatusChange(selectedTask, 'pending_safety_signoff')}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Request Safety Sign-Off</span>
                </button>
              )}
              {selectedTask.status === 'pending_safety_signoff' && (
                <button
                  onClick={() => handleStatusChange(selectedTask, 'completed')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Certified Complete</span>
                </button>
              )}
            </div>
          </div>

          {/* Details & Sign-offs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Checklist & Safety Protocol (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              {/* LOTO Banner */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  selectedTask.lotoCompleted
                    ? 'bg-emerald-950/40 border-emerald-800'
                    : 'bg-amber-950/40 border-amber-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      selectedTask.lotoCompleted ? 'bg-emerald-900/60 text-emerald-300' : 'bg-amber-900/60 text-amber-300'
                    }`}
                  >
                    {selectedTask.lotoCompleted ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {selectedTask.lotoCompleted ? 'Lockout / Tagout (LOTO) Verified' : 'Electrical LOTO Pending'}
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      OSHA 1910.147 standard for hazardous energy isolation prior to disassembly.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleLoto(selectedTask)}
                  className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-600 transition"
                >
                  {selectedTask.lotoCompleted ? 'Unlock / Re-energize' : 'Confirm LOTO Applied'}
                </button>
              </div>

              {/* Maintenance Task Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                  Technical Procedure Checklist
                </h4>

                <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {selectedTask.checklist.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleChecklist(selectedTask, item.id)}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-900 cursor-pointer transition text-xs"
                    >
                      {item.isCompleted ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <span className={`flex-1 ${item.isCompleted ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                        {item.task}
                      </span>
                      {item.completedBy && (
                        <span className="text-[10px] font-mono text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded">
                          by {item.completedBy.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Spare Parts */}
              {selectedTask.partsRequired && selectedTask.partsRequired.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Allocated Spare Parts & Consumables
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.partsRequired.map((part, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-xs border border-slate-800 font-mono"
                      >
                        &bull; {part}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cross-Functional Sign-Off Hub (1 col) */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Cross-Functional Sign-Offs
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Requires 3-way signoff between teams to certify maintenance completion.
                  </p>
                </div>

                {/* 1. Operations Signoff */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-300">1. Operations Downtime Approval</span>
                    <span
                      className={`font-mono text-[10px] font-bold ${
                        selectedTask.crossFunctionalSignoffs.operations.approved
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {selectedTask.crossFunctionalSignoffs.operations.approved ? 'APPROVED' : 'PENDING'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Signatory: {selectedTask.crossFunctionalSignoffs.operations.by || 'Operations Lead'}
                  </div>
                  {!selectedTask.crossFunctionalSignoffs.operations.approved && (
                    <button
                      onClick={() => handleSignoff(selectedTask, 'operations')}
                      className="w-full py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
                    >
                      Approve as Operations Lead
                    </button>
                  )}
                </div>

                {/* 2. Maintenance Engineering Signoff */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">2. Maintenance Tech Certification</span>
                    <span
                      className={`font-mono text-[10px] font-bold ${
                        selectedTask.crossFunctionalSignoffs.maintenance.approved
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {selectedTask.crossFunctionalSignoffs.maintenance.approved ? 'CERTIFIED' : 'PENDING'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Signatory: {selectedTask.crossFunctionalSignoffs.maintenance.by || 'Maintenance Lead'}
                  </div>
                  {!selectedTask.crossFunctionalSignoffs.maintenance.approved && (
                    <button
                      onClick={() => handleSignoff(selectedTask, 'maintenance')}
                      className="w-full py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition"
                    >
                      Certify as Maintenance Lead
                    </button>
                  )}
                </div>

                {/* 3. Safety & ISO Clearance Signoff */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300">3. Industrial Safety Clearance</span>
                    <span
                      className={`font-mono text-[10px] font-bold ${
                        selectedTask.crossFunctionalSignoffs.safety.approved
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {selectedTask.crossFunctionalSignoffs.safety.approved ? 'CLEARED' : 'PENDING'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Signatory: {selectedTask.crossFunctionalSignoffs.safety.by || 'Safety Officer'}
                  </div>
                  {!selectedTask.crossFunctionalSignoffs.safety.approved && (
                    <button
                      onClick={() => handleSignoff(selectedTask, 'safety')}
                      className="w-full py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                    >
                      Sign Off as Safety Engineer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
