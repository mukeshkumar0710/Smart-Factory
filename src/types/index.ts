export type UserRole = 'supervisor' | 'maintenance' | 'operations' | 'safety' | 'quality';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar: string;
  department: string;
  shift: string;
}

export type MachineStatus = 'running' | 'idle' | 'fault' | 'maintenance';

export interface Machine {
  id: string;
  code: string;
  name: string;
  model: string;
  category: 'robotics' | 'cnc' | 'laser' | 'assembly' | 'logistics' | 'hydraulic';
  zoneId: string;
  zoneName: string;
  status: MachineStatus;
  healthScore: number; // 0-100
  oee: number; // Overall Equipment Effectiveness %
  temperature: number; // Celsius
  vibration: number; // mm/s RMS
  proximityDistance: number; // meters from nearest human
  hydraulicPressure?: number; // bar
  rpm?: number;
  runtimeHours: number;
  lastMaintenance: string;
  nextScheduledMaintenance: string;
  assignedTechnician?: string;
  position: { x: number; y: number }; // Percentage in factory layout
  isCobot: boolean; // Collaborative robot subject to ISO/TS 15066
  safetyZoneStatus: 'safe' | 'reduced_speed' | 'protective_stop';
}

export type SensorType = 'temperature' | 'vibration' | 'proximity' | 'motion' | 'noise' | 'pressure';

export interface SensorReading {
  id: string;
  machineId: string;
  machineCode: string;
  sensorType: SensorType;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  thresholdMin?: number;
  thresholdMax?: number;
  timestamp: string;
  history: number[]; // Last 10 values for sparklines
}

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface Alert {
  id: string;
  title: string;
  type: 'safety' | 'hardware' | 'proximity' | 'environmental' | 'maintenance';
  severity: AlertSeverity;
  sourceMachineId?: string;
  machineName?: string;
  zoneId: string;
  zoneName: string;
  status: AlertStatus;
  timestamp: string;
  description: string;
  isoStandard?: string; // e.g. "ISO/TS 15066"
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  rootCause?: string;
  resolutionNotes?: string;
}

export interface WorkspaceZone {
  id: string;
  code: string;
  name: string;
  description: string;
  hazardLevel: 'low' | 'moderate' | 'high';
  safetyStatus: 'safe' | 'caution' | 'breach';
  activeWorkers: number;
  machinesCount: number;
  rect: { x: number; y: number; width: number; height: number };
  color: string;
}

export type MaintenanceType = 'preventive' | 'predictive' | 'corrective';
export type MaintenancePriority = 'high' | 'medium' | 'low';
export type MaintenanceStatus = 'draft' | 'scheduled' | 'in_progress' | 'pending_safety_signoff' | 'completed';

export interface MaintenanceChecklistItem {
  id: string;
  task: string;
  isCompleted: boolean;
  completedBy?: string;
}

export interface MaintenanceTask {
  id: string;
  code: string;
  title: string;
  machineId: string;
  machineCode: string;
  machineName: string;
  zoneId: string;
  type: MaintenanceType;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  scheduledDate: string;
  estimatedHours: number;
  actualHours?: number;
  assignedTechnician: string;
  assignedTeam: 'maintenance' | 'operations' | 'safety';
  lotoRequired: boolean; // Lockout/Tagout
  lotoCompleted: boolean;
  iso15066Clearance: boolean; // Cobot safety clearance
  partsRequired: string[];
  checklist: MaintenanceChecklistItem[];
  crossFunctionalSignoffs: {
    operations: { approved: boolean; by?: string; timestamp?: string };
    maintenance: { approved: boolean; by?: string; timestamp?: string };
    safety: { approved: boolean; by?: string; timestamp?: string };
  };
  notes: string;
  createdAt: string;
}

export interface CollaborationMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  department: string;
  team: 'operations' | 'maintenance' | 'safety' | 'management';
  content: string;
  timestamp: string;
  machineCode?: string;
  priority?: 'routine' | 'urgent' | 'alert';
}

export interface FactoryKpi {
  safetyScore: number; // 0-100
  runningMachines: number;
  totalMachines: number;
  activeAlerts: number;
  criticalAlerts: number;
  avgOee: number;
  activeWorkersOnFloor: number;
  mtbfHours: number; // Mean Time Between Failures
  mttrHours: number; // Mean Time to Repair
  lastIncidentDaysAgo: number;
}
