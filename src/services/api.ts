import { User, Machine, SensorReading, Alert, WorkspaceZone, MaintenanceTask, CollaborationMessage, FactoryKpi } from '../types';

export const api = {
  // KPI
  async getKpi(): Promise<{ kpi: FactoryKpi; isStreaming: boolean; streamInterval: number }> {
    const res = await fetch('/api/kpi');
    if (!res.ok) throw new Error('Failed to fetch KPIs');
    return res.json();
  },

  // Users
  async getUsers(): Promise<User[]> {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  // Machines
  async getMachines(): Promise<Machine[]> {
    const res = await fetch('/api/machines');
    if (!res.ok) throw new Error('Failed to fetch machines');
    return res.json();
  },

  async getMachineDetails(id: string): Promise<{ machine: Machine; sensors: SensorReading[]; activeAlerts: Alert[]; tasks: MaintenanceTask[] }> {
    const res = await fetch(`/api/machines/${id}`);
    if (!res.ok) throw new Error('Failed to fetch machine details');
    return res.json();
  },

  async updateMachine(id: string, data: Partial<Machine>): Promise<Machine> {
    const res = await fetch(`/api/machines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update machine');
    return res.json();
  },

  // Sensors
  async getSensors(): Promise<SensorReading[]> {
    const res = await fetch('/api/sensors');
    if (!res.ok) throw new Error('Failed to fetch sensors');
    return res.json();
  },

  // Zones
  async getZones(): Promise<WorkspaceZone[]> {
    const res = await fetch('/api/zones');
    if (!res.ok) throw new Error('Failed to fetch zones');
    return res.json();
  },

  async updateZone(id: string, data: Partial<WorkspaceZone>): Promise<WorkspaceZone> {
    const res = await fetch(`/api/zones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update zone');
    return res.json();
  },

  // Alerts
  async getAlerts(status?: string, severity?: string): Promise<Alert[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (severity) params.append('severity', severity);
    const res = await fetch(`/api/alerts?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  async createAlert(alertData: Partial<Alert>): Promise<Alert> {
    const res = await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alertData)
    });
    if (!res.ok) throw new Error('Failed to create alert');
    return res.json();
  },

  async acknowledgeAlert(id: string, acknowledgedBy: string): Promise<Alert> {
    const res = await fetch(`/api/alerts/${id}/acknowledge`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acknowledgedBy })
    });
    if (!res.ok) throw new Error('Failed to acknowledge alert');
    return res.json();
  },

  async resolveAlert(id: string, resolvedBy: string, rootCause: string, resolutionNotes: string): Promise<Alert> {
    const res = await fetch(`/api/alerts/${id}/resolve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolvedBy, rootCause, resolutionNotes })
    });
    if (!res.ok) throw new Error('Failed to resolve alert');
    return res.json();
  },

  // Maintenance
  async getMaintenanceTasks(): Promise<MaintenanceTask[]> {
    const res = await fetch('/api/maintenance');
    if (!res.ok) throw new Error('Failed to fetch maintenance tasks');
    return res.json();
  },

  async createMaintenanceTask(data: any): Promise<MaintenanceTask> {
    const res = await fetch('/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create maintenance task');
    return res.json();
  },

  async updateMaintenanceTask(id: string, data: Partial<MaintenanceTask>): Promise<MaintenanceTask> {
    const res = await fetch(`/api/maintenance/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update maintenance task');
    return res.json();
  },

  async signoffMaintenanceTask(id: string, department: 'operations' | 'maintenance' | 'safety', approved: boolean, approvedBy: string): Promise<MaintenanceTask> {
    const res = await fetch(`/api/maintenance/${id}/signoff`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ department, approved, approvedBy })
    });
    if (!res.ok) throw new Error('Failed to sign off maintenance task');
    return res.json();
  },

  // Collaboration Messages
  async getMessages(): Promise<CollaborationMessage[]> {
    const res = await fetch('/api/messages');
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async sendMessage(senderId: string, content: string, machineCode?: string, priority?: string): Promise<CollaborationMessage> {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId, content, machineCode, priority })
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  // AI Diagnostic
  async runAiDiagnostic(machineId: string, operatorNotes?: string): Promise<any> {
    const res = await fetch('/api/ai/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ machineId, operatorNotes })
    });
    if (!res.ok) throw new Error('Failed to run AI diagnostic');
    return res.json();
  },

  // Simulation
  async toggleSimulation(): Promise<{ isStreaming: boolean }> {
    const res = await fetch('/api/simulation/toggle', { method: 'POST' });
    return res.json();
  },

  async injectScenario(scenario: 'motor_overheat' | 'proximity_breach' | 'vibration_anomaly' | 'hydraulic_leak' | 'normalize'): Promise<any> {
    const res = await fetch('/api/simulation/scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario })
    });
    return res.json();
  },

  async resetSimulation(): Promise<any> {
    const res = await fetch('/api/simulation/reset', { method: 'POST' });
    return res.json();
  }
};
