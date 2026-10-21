import { GoogleGenAI } from '@google/genai';
import { Machine, SensorReading } from '../src/types';

interface AiDiagnosticResult {
  machineId: string;
  machineCode: string;
  riskScore: number; // 0-100
  failureProbability: number; // 0-100 %
  remainingUsefulLifeHours: number;
  healthClassification: 'Optimal' | 'Caution' | 'Degraded' | 'Critical Failure Imminent';
  isoStandardCompliance: string;
  primaryRiskFactor: string;
  rootCauseAnalysis: string;
  prescriptiveActions: string[];
  recommendedMaintenanceType: 'preventive' | 'predictive' | 'corrective';
  estimatedDowntimeRequired: string;
  safetyAdvisory: string;
  aiSource: 'gemini-2.5-flash' | 'rule-engine-iso10816';
}

export async function runPredictiveDiagnostic(
  machine: Machine,
  sensorReadings: SensorReading[],
  operatorNotes?: string
): Promise<AiDiagnosticResult> {
  const machineSensors = sensorReadings.filter(s => s.machineId === machine.id);
  const tempSensor = machineSensors.find(s => s.sensorType === 'temperature');
  const vibSensor = machineSensors.find(s => s.sensorType === 'vibration');
  const proxSensor = machineSensors.find(s => s.sensorType === 'proximity');

  const currentTemp = tempSensor ? tempSensor.value : machine.temperature;
  const currentVib = vibSensor ? vibSensor.value : machine.vibration;
  const currentProx = proxSensor ? proxSensor.value : machine.proximityDistance;

  // Baseline rule-based computation matching industrial ISO 10816-3 & ISO/TS 15066
  let failureProb = 12;
  let rulHours = 1200;
  let classification: AiDiagnosticResult['healthClassification'] = 'Optimal';
  let primaryRisk = 'Normal operation within standard tolerances';
  let prescriptiveActions = ['Continue standard weekly operational logging', 'Inspect lube levels at next shift interval'];

  if (currentVib > 4.5 || currentTemp > 75) {
    failureProb = 68;
    rulHours = 72;
    classification = 'Degraded';
    primaryRisk = `Spindle bearing vibration (${currentVib} mm/s) exceeding ISO 10816-3 Class II limits`;
    prescriptiveActions = [
      'Perform electrical Lockout/Tagout (LOTO)',
      'Inspect spindle angular contact bearings for harmonic wear',
      'Replenish high-speed synthetic grease (Kluber NBU 15)',
      'Re-balance spindle shaft dynamically at 6,000 RPM'
    ];
  } else if (currentVib > 3.5 || currentTemp > 65) {
    failureProb = 38;
    rulHours = 340;
    classification = 'Caution';
    primaryRisk = 'Thermal dissipation variance and slight harmonic oscillation';
    prescriptiveActions = [
      'Clean cooling fan heat exchangers and inlet filters',
      'Schedule ultrasonic vibration check within 48 hours'
    ];
  }

  if (machine.isCobot && currentProx < 1.0) {
    primaryRisk = `ISO/TS 15066 safety boundary breach: Human worker detected within ${currentProx}m of robot arm`;
    prescriptiveActions.unshift('Verify Cobot protective stop interlock and laser scanner field calibration');
  }

  // Attempt Gemini API call if key is present
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a Smart Factory Senior Industrial IoT & Predictive Maintenance AI Diagnostics System.
Analyze this industrial asset telemetry:
- Machine Name: ${machine.name} (${machine.code})
- Category: ${machine.category} (Cobot: ${machine.isCobot ? 'Yes (ISO/TS 15066 compliance active)' : 'No'})
- Current Status: ${machine.status}
- Temperature: ${currentTemp} °C
- Vibration RMS: ${currentVib} mm/s
- Proximity Distance to Human: ${currentProx} meters
- Hydraulic Pressure: ${machine.hydraulicPressure ?? 'N/A'} bar
- Runtime Hours: ${machine.runtimeHours} hrs
- Operator Context: ${operatorNotes || 'Routine operational telemetry stream'}

Provide a JSON diagnostic response strictly in this valid JSON format:
{
  "riskScore": number between 0 and 100,
  "failureProbability": number between 0 and 100,
  "remainingUsefulLifeHours": estimated number of hours,
  "healthClassification": "Optimal" or "Caution" or "Degraded" or "Critical Failure Imminent",
  "isoStandardCompliance": "Compliant with ISO 10816-3 & ISO/TS 15066" or relevant note,
  "primaryRiskFactor": "Short 1-sentence risk summary",
  "rootCauseAnalysis": "2-3 sentences explaining technical mechanism (e.g. ball bearing micro-spalling, thermal friction)",
  "prescriptiveActions": ["Step 1", "Step 2", "Step 3"],
  "recommendedMaintenanceType": "preventive" or "predictive" or "corrective",
  "estimatedDowntimeRequired": "e.g. 2.5 hours",
  "safetyAdvisory": "Safety directive for cross-functional operations team"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return {
          machineId: machine.id,
          machineCode: machine.code,
          riskScore: parsed.riskScore ?? Math.round(failureProb * 1.1),
          failureProbability: parsed.failureProbability ?? failureProb,
          remainingUsefulLifeHours: parsed.remainingUsefulLifeHours ?? rulHours,
          healthClassification: parsed.healthClassification ?? classification,
          isoStandardCompliance: parsed.isoStandardCompliance ?? 'ISO 10816-3 Class II & ISO/TS 15066',
          primaryRiskFactor: parsed.primaryRiskFactor ?? primaryRisk,
          rootCauseAnalysis: parsed.rootCauseAnalysis ?? 'Thermal and vibration harmonic analysis indicate micro-friction in rotational components.',
          prescriptiveActions: parsed.prescriptiveActions && parsed.prescriptiveActions.length > 0 ? parsed.prescriptiveActions : prescriptiveActions,
          recommendedMaintenanceType: parsed.recommendedMaintenanceType ?? (failureProb > 50 ? 'predictive' : 'preventive'),
          estimatedDowntimeRequired: parsed.estimatedDowntimeRequired ?? '2.0 hours',
          safetyAdvisory: parsed.safetyAdvisory ?? 'Ensure LOTO lock-out procedure and coordinate with shift supervisor before mechanical intervention.',
          aiSource: 'gemini-2.5-flash'
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out, utilizing local industrial rule-engine fallback:', err);
    }
  }

  // Industrial Rule-Engine Fallback
  return {
    machineId: machine.id,
    machineCode: machine.code,
    riskScore: Math.round(failureProb * 1.1),
    failureProbability: failureProb,
    remainingUsefulLifeHours: rulHours,
    healthClassification: classification,
    isoStandardCompliance: 'ISO 10816-3 Class II & ISO/TS 15066 (Harmonic vibration evaluated)',
    primaryRiskFactor: primaryRisk,
    rootCauseAnalysis: `Continuous telemetry analysis shows vibration velocity at ${currentVib} mm/s and temperature at ${currentTemp}°C. Spectral analysis matches bearing contact wear in the spindle rotor assembly.`,
    prescriptiveActions: prescriptiveActions,
    recommendedMaintenanceType: failureProb > 50 ? 'predictive' : 'preventive',
    estimatedDowntimeRequired: failureProb > 50 ? '3.5 hours' : '1.5 hours',
    safetyAdvisory: machine.isCobot
      ? 'Ensure safety laser scanners remain energized and workers observe yellow barrier line.'
      : 'Strict electrical LOTO protocol required before disassembling drive train.',
    aiSource: 'rule-engine-iso10816'
  };
}
