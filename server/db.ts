import { User, Machine, SensorReading, Alert, WorkspaceZone, MaintenanceTask, CollaborationMessage, FactoryKpi } from '../src/types';

// Initial Mock Seed Data matching the Research Project & Presentation
export const initialUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Rajesh Varma',
    email: 'rajesh.varma@easwari-factory.io',
    role: 'supervisor',
    title: 'Plant Operations Supervisor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    department: 'Plant Operations',
    shift: 'Shift A (06:00 - 14:00)'
  },
  {
    id: 'usr-2',
    name: 'Dr. Ananya Sharma',
    email: 'ananya.sharma@easwari-factory.io',
    role: 'safety',
    title: 'Lead Industrial Safety Engineer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    department: 'Safety & ISO Compliance',
    shift: 'General (09:00 - 17:00)'
  },
  {
    id: 'usr-3',
    name: 'Naeya Joy Christina',
    email: 'naeya.joy@easwari-factory.io',
    role: 'maintenance',
    title: 'Lead Predictive Maintenance Engineer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    department: 'Maintenance & Robotics',
    shift: 'Shift A (06:00 - 14:00)'
  },
  {
    id: 'usr-4',
    name: 'Vikram Sundaram',
    email: 'vikram.s@easwari-factory.io',
    role: 'operations',
    title: 'CNC & Assembly Cell Operator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    department: 'Production Floor',
    shift: 'Shift A (06:00 - 14:00)'
  },
  {
    id: 'usr-5',
    name: 'Kavita Krishnan',
    email: 'kavita.k@easwari-factory.io',
    role: 'quality',
    title: 'QA & Compliance Lead',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    department: 'Quality Assurance & ISO',
    shift: 'General (09:00 - 17:00)'
  }
];

export const initialZones: WorkspaceZone[] = [
  {
    id: 'zone-1',
    code: 'ZONE-A',
    name: 'Robotic Welding & Cobot Cell',
    description: 'Shared human-robot collaborative welding workspace adhering to ISO/TS 15066 safety standard.',
    hazardLevel: 'high',
    safetyStatus: 'safe',
    activeWorkers: 2,
    machinesCount: 2,
    rect: { x: 5, y: 10, width: 42, height: 38 },
    color: '#3b82f6'
  },
  {
    id: 'zone-2',
    code: 'ZONE-B',
    name: 'Precision CNC Machining Center',
    description: 'High-precision multi-axis milling, turning, and cutting machinery with acoustic & vibration monitoring.',
    hazardLevel: 'moderate',
    safetyStatus: 'safe',
    activeWorkers: 1,
    machinesCount: 2,
    rect: { x: 52, y: 10, width: 43, height: 38 },
    color: '#8b5cf6'
  },
  {
    id: 'zone-3',
    code: 'ZONE-C',
    name: 'Automated Conveyor & AGV Transit',
    description: 'Automated Guided Vehicles (AGV) logistics route and high-speed robotic pick-and-place conveyor.',
    hazardLevel: 'moderate',
    safetyStatus: 'safe',
    activeWorkers: 2,
    machinesCount: 1,
    rect: { x: 5, y: 54, width: 42, height: 38 },
    color: '#10b981'
  },
  {
    id: 'zone-4',
    code: 'ZONE-D',
    name: 'Quality Inspection & Final Pack',
    description: 'Computer-vision optical sorting, hydraulic compression testing, and manual clearance workstation.',
    hazardLevel: 'low',
    safetyStatus: 'safe',
    activeWorkers: 3,
    machinesCount: 1,
    rect: { x: 52, y: 54, width: 43, height: 38 },
    color: '#f59e0b'
  }
];

export const initialMachines: Machine[] = [
  {
    id: 'm-1',
    code: 'CBT-101',
    name: 'KUKA CyberWeld 700 Cobot',
    model: 'KUKA LBR iiwa 14 R820',
    category: 'robotics',
    zoneId: 'zone-1',
    zoneName: 'Robotic Welding & Cobot Cell',
    status: 'running',
    healthScore: 94,
    oee: 89.2,
    temperature: 52.4,
    vibration: 2.1,
    proximityDistance: 1.8,
    runtimeHours: 3410,
    lastMaintenance: '2026-09-18',
    nextScheduledMaintenance: '2026-10-28',
    assignedTechnician: 'Naeya Joy Christina',
    position: { x: 22, y: 25 },
    isCobot: true,
    safetyZoneStatus: 'safe'
  },
  {
    id: 'm-2',
    code: 'LSW-102',
    name: 'TRUMPF TruLaser Cell 3030',
    model: 'TRUMPF TLC-3000 Series',
    category: 'laser',
    zoneId: 'zone-1',
    zoneName: 'Robotic Welding & Cobot Cell',
    status: 'running',
    healthScore: 91,
    oee: 86.5,
    temperature: 61.2,
    vibration: 3.4,
    proximityDistance: 2.4,
    runtimeHours: 4290,
    lastMaintenance: '2026-09-25',
    nextScheduledMaintenance: '2026-11-05',
    assignedTechnician: 'Naeya Joy Christina',
    position: { x: 36, y: 32 },
    isCobot: false,
    safetyZoneStatus: 'safe'
  },
  {
    id: 'm-3',
    code: 'CNC-201',
    name: 'Haas VF-4 5-Axis Vertical Mill',
    model: 'Haas Super-Speed VF-4SS',
    category: 'cnc',
    zoneId: 'zone-2',
    zoneName: 'Precision CNC Machining Center',
    status: 'running',
    healthScore: 78,
    oee: 81.0,
    temperature: 68.5,
    vibration: 4.8, // Slightly elevated vibration
    proximityDistance: 1.5,
    hydraulicPressure: 64.2,
    rpm: 11800,
    runtimeHours: 6120,
    lastMaintenance: '2026-08-14',
    nextScheduledMaintenance: '2026-10-22',
    assignedTechnician: 'Vikram Sundaram',
    position: { x: 68, y: 22 },
    isCobot: false,
    safetyZoneStatus: 'safe'
  },
  {
    id: 'm-4',
    code: 'CNC-202',
    name: 'Mazak QuickTurn Lathe 250',
    model: 'Mazak QT-COMPACT 250MY',
    category: 'cnc',
    zoneId: 'zone-2',
    zoneName: 'Precision CNC Machining Center',
    status: 'idle',
    healthScore: 96,
    oee: 92.4,
    temperature: 38.1,
    vibration: 0.9,
    proximityDistance: 3.1,
    hydraulicPressure: 58.0,
    runtimeHours: 1980,
    lastMaintenance: '2026-10-02',
    nextScheduledMaintenance: '2026-12-10',
    assignedTechnician: 'Vikram Sundaram',
    position: { x: 84, y: 34 },
    isCobot: false,
    safetyZoneStatus: 'safe'
  },
  {
    id: 'm-5',
    code: 'AGV-301',
    name: 'Omron LD-90 Autonomous AGV',
    model: 'Omron Mobile Transporter LD-90',
    category: 'logistics',
    zoneId: 'zone-3',
    zoneName: 'Automated Conveyor & AGV Transit',
    status: 'running',
    healthScore: 88,
    oee: 87.8,
    temperature: 44.0,
    vibration: 1.8,
    proximityDistance: 1.2,
    runtimeHours: 2840,
    lastMaintenance: '2026-09-10',
    nextScheduledMaintenance: '2026-11-12',
    assignedTechnician: 'Naeya Joy Christina',
    position: { x: 20, y: 72 },
    isCobot: true,
    safetyZoneStatus: 'safe'
  },
  {
    id: 'm-6',
    code: 'PRS-401',
    name: 'Bosch Rexroth 150T Hydraulic Press',
    model: 'Rexroth HydroForm H-150',
    category: 'hydraulic',
    zoneId: 'zone-4',
    zoneName: 'Quality Inspection & Final Pack',
    status: 'running',
    healthScore: 85,
    oee: 84.6,
    temperature: 58.9,
    vibration: 2.6,
    proximityDistance: 2.1,
    hydraulicPressure: 142.5,
    runtimeHours: 5200,
    lastMaintenance: '2026-08-30',
    nextScheduledMaintenance: '2026-10-25',
    assignedTechnician: 'Vikram Sundaram',
    position: { x: 74, y: 76 },
    isCobot: false,
    safetyZoneStatus: 'safe'
  }
];

export const initialSensorReadings: SensorReading[] = [
  {
    id: 'sns-1',
    machineId: 'm-1',
    machineCode: 'CBT-101',
    sensorType: 'temperature',
    value: 52.4,
    unit: '°C',
    status: 'normal',
    thresholdMin: 20,
    thresholdMax: 75,
    timestamp: new Date().toISOString(),
    history: [49.1, 49.8, 50.4, 51.0, 51.7, 52.1, 52.0, 52.4]
  },
  {
    id: 'sns-2',
    machineId: 'm-1',
    machineCode: 'CBT-101',
    sensorType: 'proximity',
    value: 1.8,
    unit: 'm',
    status: 'normal',
    thresholdMin: 0.8, // ISO/TS 15066 safety boundary
    thresholdMax: 5.0,
    timestamp: new Date().toISOString(),
    history: [2.5, 2.3, 2.1, 1.9, 1.8, 1.8, 1.9, 1.8]
  },
  {
    id: 'sns-3',
    machineId: 'm-3',
    machineCode: 'CNC-201',
    sensorType: 'vibration',
    value: 4.8,
    unit: 'mm/s',
    status: 'warning',
    thresholdMin: 0.2,
    thresholdMax: 4.5,
    timestamp: new Date().toISOString(),
    history: [3.4, 3.6, 3.9, 4.1, 4.4, 4.6, 4.7, 4.8]
  },
  {
    id: 'sns-4',
    machineId: 'm-3',
    machineCode: 'CNC-201',
    sensorType: 'temperature',
    value: 68.5,
    unit: '°C',
    status: 'normal',
    thresholdMin: 20,
    thresholdMax: 78,
    timestamp: new Date().toISOString(),
    history: [62.0, 63.5, 65.0, 66.2, 67.0, 67.8, 68.2, 68.5]
  },
  {
    id: 'sns-5',
    machineId: 'm-5',
    machineCode: 'AGV-301',
    sensorType: 'proximity',
    value: 1.2,
    unit: 'm',
    status: 'normal',
    thresholdMin: 0.6,
    thresholdMax: 6.0,
    timestamp: new Date().toISOString(),
    history: [2.8, 2.4, 1.9, 1.5, 1.3, 1.2, 1.2, 1.2]
  },
  {
    id: 'sns-6',
    machineId: 'm-6',
    machineCode: 'PRS-401',
    sensorType: 'pressure',
    value: 142.5,
    unit: 'bar',
    status: 'normal',
    thresholdMin: 100,
    thresholdMax: 160,
    timestamp: new Date().toISOString(),
    history: [138, 139, 141, 142, 142.5, 143, 142, 142.5]
  }
];

export const initialAlerts: Alert[] = [
  {
    id: 'alt-101',
    title: 'Spindle Bearing Vibration Warning',
    type: 'hardware',
    severity: 'warning',
    sourceMachineId: 'm-3',
    machineName: 'Haas VF-4 5-Axis Vertical Mill (CNC-201)',
    zoneId: 'zone-2',
    zoneName: 'Precision CNC Machining Center',
    status: 'active',
    timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    description: 'Vibration RMS reached 4.8 mm/s exceeding warning threshold (4.5 mm/s). FFT indicates harmonic resonance in spindle bearings.',
    isoStandard: 'ISO 10816-3',
    acknowledgedBy: undefined
  },
  {
    id: 'alt-102',
    title: 'Cobot Adaptive Speed Reduced',
    type: 'proximity',
    severity: 'info',
    sourceMachineId: 'm-1',
    machineName: 'KUKA CyberWeld 700 Cobot (CBT-101)',
    zoneId: 'zone-1',
    zoneName: 'Robotic Welding & Cobot Cell',
    status: 'acknowledged',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    description: 'Worker entered the 2.0m collaborative perimeter. KUKA LBR iiwa reduced arm velocity to 250 mm/s according to ISO/TS 15066 safety rules.',
    isoStandard: 'ISO/TS 15066',
    acknowledgedBy: 'Dr. Ananya Sharma',
    acknowledgedAt: new Date(Date.now() - 85 * 60 * 1000).toISOString()
  }
];

export const initialMaintenanceTasks: MaintenanceTask[] = [
  {
    id: 'tsk-201',
    code: 'WO-2026-089',
    title: 'Spindle Bearing Greasing & Vibration Re-Alignment',
    machineId: 'm-3',
    machineCode: 'CNC-201',
    machineName: 'Haas VF-4 5-Axis Vertical Mill',
    zoneId: 'zone-2',
    type: 'predictive',
    priority: 'high',
    status: 'scheduled',
    scheduledDate: '2026-10-22T08:00',
    estimatedHours: 3.5,
    assignedTechnician: 'Naeya Joy Christina',
    assignedTeam: 'maintenance',
    lotoRequired: true,
    lotoCompleted: false,
    iso15066Clearance: false,
    partsRequired: ['SKF 7014 Angular Contact Bearings', 'Kluber NBU 15 High-Speed Grease', 'O-Ring Seal Kit'],
    checklist: [
      { id: 'c1', task: 'Perform electrical lockout/tagout (LOTO) on breaker panel B2', isCompleted: false },
      { id: 'c2', task: 'Dismantle spindle housing cover and inspect grease condition', isCompleted: false },
      { id: 'c3', task: 'Replace worn seals and apply Kluber NBU 15 grease', isCompleted: false },
      { id: 'c4', task: 'Execute vibration accelerometer test under 8,000 RPM idle', isCompleted: false },
      { id: 'c5', task: 'Obtain Safety Engineer sign-off prior to re-energizing', isCompleted: false }
    ],
    crossFunctionalSignoffs: {
      operations: { approved: true, by: 'Rajesh Varma', timestamp: '2026-10-20T14:15:00Z' },
      maintenance: { approved: true, by: 'Naeya Joy Christina', timestamp: '2026-10-20T14:40:00Z' },
      safety: { approved: false }
    },
    notes: 'Triggered automatically by AI vibration predictive model after 14-day trend analysis.',
    createdAt: '2026-10-20T14:00:00Z'
  },
  {
    id: 'tsk-202',
    code: 'WO-2026-090',
    title: 'KUKA Cobot Laser Scanner Calibration & ISO/TS 15066 Audit',
    machineId: 'm-1',
    machineCode: 'CBT-101',
    machineName: 'KUKA CyberWeld 700 Cobot',
    zoneId: 'zone-1',
    type: 'preventive',
    priority: 'medium',
    status: 'in_progress',
    scheduledDate: '2026-10-21T10:00',
    estimatedHours: 2.0,
    actualHours: 1.2,
    assignedTechnician: 'Dr. Ananya Sharma',
    assignedTeam: 'safety',
    lotoRequired: false,
    lotoCompleted: true,
    iso15066Clearance: true,
    partsRequired: ['Optical Lens Cleaning Kit', 'Laser Calibration Target'],
    checklist: [
      { id: 'k1', task: 'Clean SICK MicroScan3 safety laser scanner optics', isCompleted: true, completedBy: 'Dr. Ananya Sharma' },
      { id: 'k2', task: 'Verify warning zone boundary at 2.0m radius', isCompleted: true, completedBy: 'Dr. Ananya Sharma' },
      { id: 'k3', task: 'Verify protective emergency stop zone boundary at 0.8m radius', isCompleted: false },
      { id: 'k4', task: 'Log collaborative torque sensor threshold values in controller', isCompleted: false }
    ],
    crossFunctionalSignoffs: {
      operations: { approved: true, by: 'Rajesh Varma', timestamp: '2026-10-20T10:00:00Z' },
      maintenance: { approved: true, by: 'Naeya Joy Christina', timestamp: '2026-10-20T10:15:00Z' },
      safety: { approved: true, by: 'Dr. Ananya Sharma', timestamp: '2026-10-20T10:30:00Z' }
    },
    notes: 'Bi-monthly compliance audit required for ISO/TS 15066 safety certification.',
    createdAt: '2026-10-19T09:00:00Z'
  },
  {
    id: 'tsk-203',
    code: 'WO-2026-087',
    title: 'Hydraulic Press Filter Cartridge Replacement',
    machineId: 'm-6',
    machineCode: 'PRS-401',
    machineName: 'Bosch Rexroth 150T Hydraulic Press',
    zoneId: 'zone-4',
    type: 'preventive',
    priority: 'low',
    status: 'completed',
    scheduledDate: '2026-10-18T14:00',
    estimatedHours: 2.5,
    actualHours: 2.1,
    assignedTechnician: 'Vikram Sundaram',
    assignedTeam: 'maintenance',
    lotoRequired: true,
    lotoCompleted: true,
    iso15066Clearance: true,
    partsRequired: ['Rexroth 10-micron High-Pressure Filter Element', 'Hydraulic Fluid HLP 46 (20L)'],
    checklist: [
      { id: 'p1', task: 'Depressurize hydraulic reservoir and engage mechanical ram lock', isCompleted: true },
      { id: 'p2', task: 'Replace element and inspect for metal particulate wear', isCompleted: true },
      { id: 'p3', task: 'Refill oil and test cycle pressure at 150 bar', isCompleted: true }
    ],
    crossFunctionalSignoffs: {
      operations: { approved: true, by: 'Rajesh Varma' },
      maintenance: { approved: true, by: 'Naeya Joy Christina' },
      safety: { approved: true, by: 'Dr. Ananya Sharma' }
    },
    notes: 'Fluid contamination level reduced to ISO 4406 Class 16/14/11.',
    createdAt: '2026-10-17T11:00:00Z'
  }
];

export const initialCollaborationMessages: CollaborationMessage[] = [
  {
    id: 'msg-1',
    senderId: 'usr-2',
    senderName: 'Dr. Ananya Sharma',
    senderRole: 'safety',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    department: 'Safety & ISO Compliance',
    team: 'safety',
    content: 'Reminder to all floor operators: Cobot CBT-101 collaborative perimeter testing is underway. Keep clear of the 0.8m yellow floor markings until sign-off.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    machineCode: 'CBT-101',
    priority: 'routine'
  },
  {
    id: 'msg-2',
    senderId: 'usr-3',
    senderName: 'Naeya Joy Christina',
    senderRole: 'maintenance',
    senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    department: 'Maintenance & Robotics',
    team: 'maintenance',
    content: 'Noticed slight vibration spike on CNC-201 (Haas VF-4). Work order WO-2026-089 is scheduled for tomorrow 08:00. Operations, please approve shift downtime.',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    machineCode: 'CNC-201',
    priority: 'urgent'
  },
  {
    id: 'msg-3',
    senderId: 'usr-1',
    senderName: 'Rajesh Varma',
    senderRole: 'supervisor',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    department: 'Plant Operations',
    team: 'operations',
    content: 'Downtime approved for CNC-201 from 08:00 to 11:30 tomorrow. Production batch has been rerouted to secondary lathe.',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    machineCode: 'CNC-201',
    priority: 'routine'
  }
];

// In-Memory Database Controller simulating MongoDB collections
class SmartFactoryDB {
  public users: User[] = [...initialUsers];
  public machines: Machine[] = [...initialMachines];
  public sensors: SensorReading[] = [...initialSensorReadings];
  public alerts: Alert[] = [...initialAlerts];
  public zones: WorkspaceZone[] = [...initialZones];
  public maintenanceTasks: MaintenanceTask[] = [...initialMaintenanceTasks];
  public messages: CollaborationMessage[] = [...initialCollaborationMessages];

  // Helper to recompute factory-wide KPIs
  public getFactoryKpi(): FactoryKpi {
    const total = this.machines.length;
    const running = this.machines.filter(m => m.status === 'running').length;
    const activeAlerts = this.alerts.filter(a => a.status !== 'resolved');
    const critical = activeAlerts.filter(a => a.severity === 'critical').length;
    
    // Safety score calculation
    let safetyPenalty = (critical * 18) + (activeAlerts.length * 4);
    const anyBreach = this.zones.some(z => z.safetyStatus === 'breach');
    if (anyBreach) safetyPenalty += 20;
    const safetyScore = Math.max(45, Math.min(100, 100 - safetyPenalty));

    const totalOee = this.machines.reduce((acc, m) => acc + m.oee, 0);
    const avgOee = total > 0 ? Number((totalOee / total).toFixed(1)) : 85.0;

    return {
      safetyScore,
      runningMachines: running,
      totalMachines: total,
      activeAlerts: activeAlerts.length,
      criticalAlerts: critical,
      avgOee,
      activeWorkersOnFloor: this.zones.reduce((acc, z) => acc + z.activeWorkers, 0),
      mtbfHours: 428,
      mttrHours: 2.4,
      lastIncidentDaysAgo: 142
    };
  }

  // Reset to factory defaults
  public resetToDefaults() {
    this.machines = JSON.parse(JSON.stringify(initialMachines));
    this.sensors = JSON.parse(JSON.stringify(initialSensorReadings));
    this.alerts = JSON.parse(JSON.stringify(initialAlerts));
    this.zones = JSON.parse(JSON.stringify(initialZones));
    this.maintenanceTasks = JSON.parse(JSON.stringify(initialMaintenanceTasks));
    this.messages = JSON.parse(JSON.stringify(initialCollaborationMessages));
  }
}

export const db = new SmartFactoryDB();
