import React, { useState } from 'react';
import { useFactory } from '../../context/FactoryContext';
import { Alert, AlertSeverity, AlertStatus } from '../../types';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Filter,
  Check,
  Search,
  Info,
  Radio,
  FileCheck
} from 'lucide-react';

interface AlertManagementViewProps {
  onOpenCreateAlertModal: () => void;
  onOpenResolveModal: (alert: Alert) => void;
}

export const AlertManagementView: React.FC<AlertManagementViewProps> = ({
  onOpenCreateAlertModal,
  onOpenResolveModal
}) => {
  const { alerts, acknowledgeAlert } = useFactory();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAlerts = alerts.filter(alert => {
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.zoneName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alert.machineName && alert.machineName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSeverity && matchesSearch;
  });

  const criticalCount = alerts.filter(a => a.status === 'active' && a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.status === 'active' && a.severity === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              Safety & Hardware Alert Management Center
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-950 text-red-300 border border-red-800">
              ISO/TS 15066 &bull; ISO 45001
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated threshold violation detection, proximity safety breaches, and documented root cause resolution.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenCreateAlertModal}
            className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-red-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Raise Safety Hazard</span>
          </button>
        </div>
      </div>

      {/* KPI Ticker Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Critical Alarms (Immediate Halt)</div>
            <div className="text-2xl font-mono font-extrabold text-red-400 mt-0.5">{criticalCount}</div>
          </div>
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Warnings (Tolerance Drift)</div>
            <div className="text-2xl font-mono font-extrabold text-amber-400 mt-0.5">{warningCount}</div>
          </div>
          <Radio className="w-6 h-6 text-amber-500" />
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Resolved & Documented</div>
            <div className="text-2xl font-mono font-extrabold text-emerald-400 mt-0.5">
              {alerts.filter(a => a.status === 'resolved').length}
            </div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search alerts by title, machine, zone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-slate-900 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No matching alerts found</p>
            <p className="text-xs text-slate-500 mt-1">All monitored machine parameters are in nominal ranges.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';
            const isActive = alert.status === 'active';
            const isAck = alert.status === 'acknowledged';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition shadow-sm space-y-3 ${
                  isCritical
                    ? 'bg-red-950/20 border-red-800/80'
                    : isWarning
                    ? 'bg-amber-950/20 border-amber-800/60'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        isCritical
                          ? 'bg-red-900/80 text-red-200 border-red-500'
                          : isWarning
                          ? 'bg-amber-900/80 text-amber-200 border-amber-500'
                          : 'bg-blue-900/80 text-blue-200 border-blue-500'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {alert.type}
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-semibold">{alert.isoStandard}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-white">{alert.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.description}</p>
                </div>

                <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>Zone: {alert.zoneName}</span>
                  {alert.machineName && <span>Asset: {alert.machineName}</span>}
                  {alert.acknowledgedBy && (
                    <span className="text-amber-300">Ack by: {alert.acknowledgedBy}</span>
                  )}
                  {alert.resolvedBy && (
                    <span className="text-emerald-300">Resolved by: {alert.resolvedBy}</span>
                  )}
                </div>

                {/* Root Cause & Resolution Info if resolved */}
                {alert.status === 'resolved' && alert.rootCause && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/60 text-xs space-y-1 text-slate-300">
                    <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Root Cause: {alert.rootCause}</span>
                    </div>
                    {alert.resolutionNotes && (
                      <p className="text-[11px] text-slate-400">{alert.resolutionNotes}</p>
                    )}
                  </div>
                )}

                {/* Actions Bar */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs">
                    Status:{' '}
                    <span
                      className={`font-mono font-bold uppercase ${
                        isActive ? 'text-red-400' : isAck ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isActive && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-600 transition"
                      >
                        Acknowledge
                      </button>
                    )}
                    {alert.status !== 'resolved' && (
                      <button
                        onClick={() => onOpenResolveModal(alert)}
                        className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1 shadow-sm transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve & Log RCA</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
