import { db } from './db';
import { Alert, SensorReading } from '../src/types';

export class SimulationService {
  private intervalId: NodeJS.Timeout | null = null;
  public isStreaming: boolean = true;
  public updateIntervalMs: number = 3000;

  constructor() {
    this.start();
  }

  public start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.tick();
    }, this.updateIntervalMs);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isStreaming = false;
  }

  public setIntervalTime(ms: number) {
    this.updateIntervalMs = ms;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(() => {
        this.tick();
      }, this.updateIntervalMs);
    }
  }

  // Periodic sensor drift & telemetry simulation
  public tick() {
    if (!this.isStreaming) return;

    db.machines.forEach(machine => {
      if (machine.status === 'running') {
        // Slight natural vibration noise
        const vibDelta = (Math.random() - 0.48) * 0.15;
        machine.vibration = Math.max(0.4, Number((machine.vibration + vibDelta).toFixed(2)));

        // Slight thermal fluctuation
        const tempDelta = (Math.random() - 0.49) * 0.3;
        machine.temperature = Math.max(25, Number((machine.temperature + tempDelta).toFixed(1)));

        // Proximity small jitter if active
        if (machine.proximityDistance) {
          const proxDelta = (Math.random() - 0.5) * 0.08;
          machine.proximityDistance = Math.max(0.4, Number((machine.proximityDistance + proxDelta).toFixed(2)));
        }

        // Hydraulic pressure small drift
        if (machine.hydraulicPressure) {
          const pressDelta = (Math.random() - 0.5) * 0.5;
          machine.hydraulicPressure = Math.max(50, Number((machine.hydraulicPressure + pressDelta).toFixed(1)));
        }
      }
    });

    // Sync sensor readings collection
    db.sensors.forEach(sensor => {
      const machine = db.machines.find(m => m.id === sensor.machineId);
      if (!machine) return;

      let newValue = sensor.value;
      if (sensor.sensorType === 'temperature') newValue = machine.temperature;
      if (sensor.sensorType === 'vibration') newValue = machine.vibration;
      if (sensor.sensorType === 'proximity') newValue = machine.proximityDistance;
      if (sensor.sensorType === 'pressure' && machine.hydraulicPressure) newValue = machine.hydraulicPressure;

      sensor.value = newValue;
      sensor.timestamp = new Date().toISOString();
      sensor.history.push(newValue);
      if (sensor.history.length > 15) {
        sensor.history.shift();
      }

      // Check thresholds
      if (sensor.thresholdMax && newValue >= sensor.thresholdMax) {
        sensor.status = 'critical';
      } else if (sensor.thresholdMax && newValue >= sensor.thresholdMax * 0.88) {
        sensor.status = 'warning';
      } else if (sensor.thresholdMin && newValue <= sensor.thresholdMin) {
        sensor.status = 'critical';
      } else {
        sensor.status = 'normal';
      }
    });

    // Check ISO/TS 15066 Cobot rules
    const cobot = db.machines.find(m => m.code === 'CBT-101');
    const zoneA = db.zones.find(z => z.code === 'ZONE-A');
    if (cobot && zoneA) {
      if (cobot.proximityDistance < 0.8) {
        cobot.safetyZoneStatus = 'protective_stop';
        cobot.status = 'fault';
        zoneA.safetyStatus = 'breach';
        this.ensureAlert({
          id: 'alt-iso-breach',
          title: 'CRITICAL: ISO/TS 15066 Cobot Safety Perimeter Breach',
          type: 'proximity',
          severity: 'critical',
          sourceMachineId: cobot.id,
          machineName: `${cobot.name} (${cobot.code})`,
          zoneId: zoneA.id,
          zoneName: zoneA.name,
          status: 'active',
          timestamp: new Date().toISOString(),
          description: `Worker detected inside protective stop perimeter (${cobot.proximityDistance}m < 0.8m limit). Emergency halt initiated.`,
          isoStandard: 'ISO/TS 15066:2016 Cl. 5.5.3'
        });
      } else if (cobot.proximityDistance < 2.0) {
        cobot.safetyZoneStatus = 'reduced_speed';
        zoneA.safetyStatus = 'caution';
      } else {
        if (cobot.safetyZoneStatus !== 'safe' && cobot.proximityDistance >= 2.0) {
          cobot.safetyZoneStatus = 'safe';
          if (cobot.status === 'fault') cobot.status = 'running';
          zoneA.safetyStatus = 'safe';
        }
      }
    }
  }

  private ensureAlert(alertData: Alert) {
    const existing = db.alerts.find(a => a.id === alertData.id && a.status === 'active');
    if (!existing) {
      db.alerts.unshift(alertData);
    }
  }

  // Inject specific industrial scenario
  public injectScenario(scenario: 'motor_overheat' | 'proximity_breach' | 'vibration_anomaly' | 'hydraulic_leak' | 'normalize') {
    switch (scenario) {
      case 'motor_overheat': {
        const cnc = db.machines.find(m => m.code === 'CNC-201');
        if (cnc) {
          cnc.temperature = 84.6;
          cnc.status = 'fault';
          this.ensureAlert({
            id: `alt-heat-${Date.now()}`,
            title: 'Spindle Thermal Runaway Alert',
            type: 'hardware',
            severity: 'critical',
            sourceMachineId: cnc.id,
            machineName: `${cnc.name} (${cnc.code})`,
            zoneId: cnc.zoneId,
            zoneName: cnc.zoneName,
            status: 'active',
            timestamp: new Date().toISOString(),
            description: 'Haas VF-4 spindle head exceeded maximum operating thermal cutoff (84.6°C). High risk of stator winding damage.',
            isoStandard: 'ISO 10816-3'
          });
        }
        break;
      }
      case 'proximity_breach': {
        const cobot = db.machines.find(m => m.code === 'CBT-101');
        const zoneA = db.zones.find(z => z.code === 'ZONE-A');
        if (cobot && zoneA) {
          cobot.proximityDistance = 0.52;
          cobot.safetyZoneStatus = 'protective_stop';
          cobot.status = 'fault';
          zoneA.safetyStatus = 'breach';
          this.ensureAlert({
            id: `alt-prox-${Date.now()}`,
            title: 'Protective Stop: Human Worker in Cobot Reach Envelope',
            type: 'safety',
            severity: 'critical',
            sourceMachineId: cobot.id,
            machineName: `${cobot.name} (${cobot.code})`,
            zoneId: zoneA.id,
            zoneName: zoneA.name,
            status: 'active',
            timestamp: new Date().toISOString(),
            description: 'UWB positioning beacon detected employee at 0.52m from KUKA LBR iiwa collaborative arm. Immediate protective stop enforced per ISO/TS 15066.',
            isoStandard: 'ISO/TS 15066'
          });
        }
        break;
      }
      case 'vibration_anomaly': {
        const cnc = db.machines.find(m => m.code === 'CNC-201');
        if (cnc) {
          cnc.vibration = 6.4;
          cnc.healthScore = 62;
          this.ensureAlert({
            id: `alt-vib-${Date.now()}`,
            title: 'Severe Rotor Dynamic Imbalance Detected',
            type: 'hardware',
            severity: 'critical',
            sourceMachineId: cnc.id,
            machineName: `${cnc.name} (${cnc.code})`,
            zoneId: cnc.zoneId,
            zoneName: cnc.zoneName,
            status: 'active',
            timestamp: new Date().toISOString(),
            description: 'Vibration velocity surge to 6.4 mm/s RMS. Critical harmonic excitation at 200 Hz indicates outer bearing raceway flaking.',
            isoStandard: 'ISO 10816-3'
          });
        }
        break;
      }
      case 'hydraulic_leak': {
        const press = db.machines.find(m => m.code === 'PRS-401');
        if (press) {
          press.hydraulicPressure = 68.0;
          press.status = 'fault';
          this.ensureAlert({
            id: `alt-press-${Date.now()}`,
            title: 'Hydraulic Circuit Pressure Drop',
            type: 'hardware',
            severity: 'warning',
            sourceMachineId: press.id,
            machineName: `${press.name} (${press.code})`,
            zoneId: press.zoneId,
            zoneName: press.zoneName,
            status: 'active',
            timestamp: new Date().toISOString(),
            description: 'Main reservoir circuit pressure dropped to 68 bar (normal 140-160 bar). Potential hydraulic valve or line seal bypass.',
            isoStandard: 'DIN EN ISO 4413'
          });
        }
        break;
      }
      case 'normalize': {
        db.resetToDefaults();
        break;
      }
    }
  }
}

export const simulationService = new SimulationService();
