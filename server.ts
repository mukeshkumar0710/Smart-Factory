import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { db } from './server/db';
import { simulationService } from './server/simulationService';
import { runPredictiveDiagnostic } from './server/aiService';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

// ==================== REST API ENDPOINTS ====================

// 1. System & KPI Summary
app.get('/api/kpi', (req, res) => {
  res.json({
    kpi: db.getFactoryKpi(),
    isStreaming: simulationService.isStreaming,
    streamInterval: simulationService.updateIntervalMs
  });
});

// 2. Users (Authentication & Role Switching)
app.get('/api/users', (req, res) => {
  res.json(db.users);
});

// 3. Machines & Equipment (Module 3)
app.get('/api/machines', (req, res) => {
  res.json(db.machines);
});

app.get('/api/machines/:id', (req, res) => {
  const machine = db.machines.find(m => m.id === req.params.id);
  if (!machine) return res.status(404).json({ error: 'Machine not found' });
  const sensors = db.sensors.filter(s => s.machineId === machine.id);
  const activeAlerts = db.alerts.filter(a => a.sourceMachineId === machine.id && a.status !== 'resolved');
  const tasks = db.maintenanceTasks.filter(t => t.machineId === machine.id);
  res.json({ machine, sensors, activeAlerts, tasks });
});

app.put('/api/machines/:id', (req, res) => {
  const machine = db.machines.find(m => m.id === req.params.id);
  if (!machine) return res.status(404).json({ error: 'Machine not found' });

  const { status, assignedTechnician, position } = req.body;
  if (status) machine.status = status;
  if (assignedTechnician !== undefined) machine.assignedTechnician = assignedTechnician;
  if (position) machine.position = position;

  res.json(machine);
});

// 4. Sensor Readings (Module 4)
app.get('/api/sensors', (req, res) => {
  res.json(db.sensors);
});

// 5. Workspace Zones & Floor Plan (Module 5)
app.get('/api/zones', (req, res) => {
  res.json(db.zones);
});

app.put('/api/zones/:id', (req, res) => {
  const zone = db.zones.find(z => z.id === req.params.id);
  if (!zone) return res.status(404).json({ error: 'Zone not found' });

  const { safetyStatus, activeWorkers } = req.body;
  if (safetyStatus) zone.safetyStatus = safetyStatus;
  if (typeof activeWorkers === 'number') zone.activeWorkers = Math.max(0, activeWorkers);

  res.json(zone);
});

// 6. Alert Management (Module 6)
app.get('/api/alerts', (req, res) => {
  const { status, severity } = req.query;
  let filtered = db.alerts;
  if (status && status !== 'all') {
    filtered = filtered.filter(a => a.status === status);
  }
  if (severity && severity !== 'all') {
    filtered = filtered.filter(a => a.severity === severity);
  }
  res.json(filtered);
});

app.post('/api/alerts', (req, res) => {
  const { title, type, severity, zoneId, sourceMachineId, description, isoStandard } = req.body;
  const zone = db.zones.find(z => z.id === zoneId);
  const machine = sourceMachineId ? db.machines.find(m => m.id === sourceMachineId) : undefined;

  const newAlert = {
    id: `alt-${Date.now()}`,
    title: title || 'Manual Safety Observation Alert',
    type: type || 'safety',
    severity: severity || 'warning',
    sourceMachineId: machine ? machine.id : undefined,
    machineName: machine ? `${machine.name} (${machine.code})` : undefined,
    zoneId: zone ? zone.id : (db.zones[0]?.id || 'zone-1'),
    zoneName: zone ? zone.name : (db.zones[0]?.name || 'General Factory Floor'),
    status: 'active' as const,
    timestamp: new Date().toISOString(),
    description: description || 'Hazard raised by floor worker or supervisor.',
    isoStandard: isoStandard || 'ISO 45001'
  };

  db.alerts.unshift(newAlert);
  res.status(201).json(newAlert);
});

app.put('/api/alerts/:id/acknowledge', (req, res) => {
  const alert = db.alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });

  const { acknowledgedBy } = req.body;
  alert.status = 'acknowledged';
  alert.acknowledgedBy = acknowledgedBy || 'System Supervisor';
  alert.acknowledgedAt = new Date().toISOString();

  res.json(alert);
});

app.put('/api/alerts/:id/resolve', (req, res) => {
  const alert = db.alerts.find(a => a.id === req.params.id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });

  const { resolvedBy, rootCause, resolutionNotes } = req.body;
  alert.status = 'resolved';
  alert.resolvedBy = resolvedBy || 'Maintenance Engineer';
  alert.resolvedAt = new Date().toISOString();
  alert.rootCause = rootCause || 'Corrective adjustment completed';
  alert.resolutionNotes = resolutionNotes || 'All operating parameters restored to nominal limits.';

  // If this alert was causing a protective stop on a machine, check if it can be restored
  if (alert.sourceMachineId) {
    const machine = db.machines.find(m => m.id === alert.sourceMachineId);
    if (machine && machine.status === 'fault') {
      machine.status = 'running';
      machine.safetyZoneStatus = 'safe';
    }
  }

  // Update zone status if no more critical alerts remain in that zone
  const remainingZoneAlerts = db.alerts.filter(a => a.zoneId === alert.zoneId && a.status === 'active' && a.severity === 'critical');
  if (remainingZoneAlerts.length === 0) {
    const zone = db.zones.find(z => z.id === alert.zoneId);
    if (zone && zone.safetyStatus === 'breach') {
      zone.safetyStatus = 'safe';
    }
  }

  res.json(alert);
});

// 7. Maintenance Scheduling & Work Orders (Cross-Functional Coordination)
app.get('/api/maintenance', (req, res) => {
  res.json(db.maintenanceTasks);
});

app.post('/api/maintenance', (req, res) => {
  const {
    title,
    machineId,
    type,
    priority,
    scheduledDate,
    estimatedHours,
    assignedTechnician,
    assignedTeam,
    lotoRequired,
    iso15066Clearance,
    partsRequired,
    checklist,
    notes,
    createdBy
  } = req.body;

  const machine = db.machines.find(m => m.id === machineId);
  if (!machine) return res.status(400).json({ error: 'Invalid machine ID' });

  const newTask = {
    id: `tsk-${Date.now()}`,
    code: `WO-2026-${Math.floor(100 + Math.random() * 900)}`,
    title,
    machineId: machine.id,
    machineCode: machine.code,
    machineName: machine.name,
    zoneId: machine.zoneId,
    type: type || 'preventive',
    priority: priority || 'medium',
    status: 'scheduled' as const,
    scheduledDate: scheduledDate || new Date(Date.now() + 86400000).toISOString(),
    estimatedHours: estimatedHours || 2.0,
    assignedTechnician: assignedTechnician || 'Unassigned',
    assignedTeam: assignedTeam || 'maintenance',
    lotoRequired: Boolean(lotoRequired),
    lotoCompleted: false,
    iso15066Clearance: Boolean(iso15066Clearance),
    partsRequired: partsRequired || [],
    checklist: (checklist && checklist.length > 0) ? checklist : [
      { id: '1', task: 'Verify electrical lockout and safety tagging (LOTO)', isCompleted: false },
      { id: '2', task: 'Mechanical diagnostic and sensor calibration', isCompleted: false },
      { id: '3', task: 'Obtain multi-team safety clearance sign-off', isCompleted: false }
    ],
    crossFunctionalSignoffs: {
      operations: { approved: true, by: createdBy || 'Operations Lead', timestamp: new Date().toISOString() },
      maintenance: { approved: false },
      safety: { approved: false }
    },
    notes: notes || '',
    createdAt: new Date().toISOString()
  };

  db.maintenanceTasks.unshift(newTask);
  res.status(201).json(newTask);
});

app.put('/api/maintenance/:id', (req, res) => {
  const task = db.maintenanceTasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const { status, checklist, lotoCompleted, actualHours, notes } = req.body;
  if (status) task.status = status;
  if (checklist) task.checklist = checklist;
  if (typeof lotoCompleted === 'boolean') task.lotoCompleted = lotoCompleted;
  if (typeof actualHours === 'number') task.actualHours = actualHours;
  if (notes !== undefined) task.notes = notes;

  // If task moved to in_progress and machine is associated, update machine to maintenance
  if (status === 'in_progress') {
    const machine = db.machines.find(m => m.id === task.machineId);
    if (machine) machine.status = 'maintenance';
  } else if (status === 'completed') {
    const machine = db.machines.find(m => m.id === task.machineId);
    if (machine && machine.status === 'maintenance') {
      machine.status = 'running';
      machine.lastMaintenance = new Date().toISOString().split('T')[0];
      machine.healthScore = Math.min(100, machine.healthScore + 15);
    }
  }

  res.json(task);
});

app.put('/api/maintenance/:id/signoff', (req, res) => {
  const task = db.maintenanceTasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const { department, approved, approvedBy } = req.body; // 'operations' | 'maintenance' | 'safety'
  if (!['operations', 'maintenance', 'safety'].includes(department)) {
    return res.status(400).json({ error: 'Invalid department for cross-functional sign-off' });
  }

  const deptKey = department as 'operations' | 'maintenance' | 'safety';
  task.crossFunctionalSignoffs[deptKey] = {
    approved: Boolean(approved),
    by: approvedBy || `${department.toUpperCase()} Lead`,
    timestamp: new Date().toISOString()
  };

  // If all 3 have approved and task is completed, ensure status transition
  const allApproved =
    task.crossFunctionalSignoffs.operations.approved &&
    task.crossFunctionalSignoffs.maintenance.approved &&
    task.crossFunctionalSignoffs.safety.approved;

  if (allApproved && task.status === 'pending_safety_signoff') {
    task.status = 'completed';
    const machine = db.machines.find(m => m.id === task.machineId);
    if (machine) {
      machine.status = 'running';
      machine.healthScore = 98;
    }
  }

  res.json(task);
});

// 8. Cross-Functional Collaboration Hub & Feed
app.get('/api/messages', (req, res) => {
  res.json(db.messages);
});

app.post('/api/messages', (req, res) => {
  const { senderId, content, machineCode, priority } = req.body;
  const user = db.users.find(u => u.id === senderId) || db.users[0];

  const newMsg = {
    id: `msg-${Date.now()}`,
    senderId: user.id,
    senderName: user.name,
    senderRole: user.role,
    senderAvatar: user.avatar,
    department: user.department,
    team: (user.role === 'supervisor' ? 'operations' : user.role) as any,
    content,
    timestamp: new Date().toISOString(),
    machineCode,
    priority: priority || 'routine'
  };

  db.messages.unshift(newMsg);
  res.status(201).json(newMsg);
});

// 9. AI Predictive Maintenance & ISO/TS 15066 Engine (Module 7 & AI)
app.post('/api/ai/diagnose', async (req, res) => {
  try {
    const { machineId, operatorNotes } = req.body;
    const machine = db.machines.find(m => m.id === machineId);
    if (!machine) return res.status(404).json({ error: 'Machine not found' });

    const result = await runPredictiveDiagnostic(machine, db.sensors, operatorNotes);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Diagnosis failed' });
  }
});

// 10. IoT Simulator & Fault Injection Deck
app.post('/api/simulation/toggle', (req, res) => {
  if (simulationService.isStreaming) {
    simulationService.stop();
  } else {
    simulationService.start();
    simulationService.isStreaming = true;
  }
  res.json({ isStreaming: simulationService.isStreaming });
});

app.post('/api/simulation/interval', (req, res) => {
  const { intervalMs } = req.body;
  if (typeof intervalMs === 'number' && intervalMs >= 500) {
    simulationService.setIntervalTime(intervalMs);
  }
  res.json({ updateIntervalMs: simulationService.updateIntervalMs });
});

app.post('/api/simulation/scenario', (req, res) => {
  const { scenario } = req.body;
  simulationService.injectScenario(scenario);
  res.json({ message: `Injected scenario: ${scenario}`, success: true });
});

app.post('/api/simulation/reset', (req, res) => {
  simulationService.injectScenario('normalize');
  res.json({ message: 'Factory simulation reset to nominal specifications', success: true });
});

// ==================== VITE MIDDLEWARE / STATIC ASSETS ====================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Smart Factory Server] listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
