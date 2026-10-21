import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Machine, SensorReading, Alert, WorkspaceZone, MaintenanceTask, CollaborationMessage, FactoryKpi } from '../types';
import { api } from '../services/api';

interface FactoryContextType {
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  kpi: FactoryKpi | null;
  machines: Machine[];
  sensors: SensorReading[];
  zones: WorkspaceZone[];
  alerts: Alert[];
  maintenanceTasks: MaintenanceTask[];
  messages: CollaborationMessage[];
  isStreaming: boolean;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  toggleStreaming: () => Promise<void>;
  injectScenario: (scenario: 'motor_overheat' | 'proximity_breach' | 'vibration_anomaly' | 'hydraulic_leak' | 'normalize') => Promise<void>;
  resetSimulation: () => Promise<void>;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  resolveAlert: (alertId: string, rootCause: string, notes: string) => Promise<void>;
  createAlert: (data: Partial<Alert>) => Promise<void>;
  createMaintenanceTask: (data: any) => Promise<void>;
  updateMaintenanceTask: (id: string, data: Partial<MaintenanceTask>) => Promise<void>;
  signoffMaintenanceTask: (id: string, department: 'operations' | 'maintenance' | 'safety', approved: boolean) => Promise<void>;
  sendMessage: (content: string, machineCode?: string, priority?: string) => Promise<void>;
  selectedMachineForAi: Machine | null;
  setSelectedMachineForAi: (machine: Machine | null) => void;
}

const FactoryContext = createContext<FactoryContextType | undefined>(undefined);

export const FactoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('sf_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      id: 'usr-1',
      name: 'Rajesh Varma',
      email: 'rajesh.varma@easwari-factory.io',
      role: 'supervisor',
      title: 'Plant Operations Supervisor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      department: 'Plant Operations',
      shift: 'Shift A (06:00 - 14:00)'
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem('sf_auth_user'));
    } catch (e) {
      return false;
    }
  });

  const login = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('sf_auth_user', JSON.stringify(user));
    } catch (e) {}
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('sf_auth_user');
    } catch (e) {}
  };

  const [kpi, setKpi] = useState<FactoryKpi | null>(null);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [sensors, setSensors] = useState<SensorReading[]>([]);
  const [zones, setZones] = useState<WorkspaceZone[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [messages, setMessages] = useState<CollaborationMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMachineForAi, setSelectedMachineForAi] = useState<Machine | null>(null);

  const refreshData = useCallback(async () => {
    try {
      const [kpiRes, machinesRes, sensorsRes, zonesRes, alertsRes, tasksRes, messagesRes, usersRes] = await Promise.all([
        api.getKpi(),
        api.getMachines(),
        api.getSensors(),
        api.getZones(),
        api.getAlerts(),
        api.getMaintenanceTasks(),
        api.getMessages(),
        api.getUsers()
      ]);

      setKpi(kpiRes.kpi);
      setIsStreaming(kpiRes.isStreaming);
      setMachines(machinesRes);
      setSensors(sensorsRes);
      setZones(zonesRes);
      setAlerts(alertsRes);
      setMaintenanceTasks(tasksRes);
      setMessages(messagesRes);
      if (usersRes.length > 0 && users.length === 0) {
        setUsers(usersRes);
        // keep current user or default to first
        setCurrentUser(prev => usersRes.find(u => u.id === prev.id) || usersRes[0]);
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching factory state:', err);
      setError(err.message || 'Failed to sync with smart factory backend');
    } finally {
      setIsLoading(false);
    }
  }, [users.length]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Polling stream for live IoT telemetry
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      refreshData();
    }, 3000);
    return () => clearInterval(interval);
  }, [isStreaming, refreshData]);

  const toggleStreaming = async () => {
    try {
      const res = await api.toggleSimulation();
      setIsStreaming(res.isStreaming);
    } catch (err) {
      console.error(err);
    }
  };

  const injectScenario = async (scenario: 'motor_overheat' | 'proximity_breach' | 'vibration_anomaly' | 'hydraulic_leak' | 'normalize') => {
    await api.injectScenario(scenario);
    await refreshData();
  };

  const resetSimulation = async () => {
    await api.resetSimulation();
    await refreshData();
  };

  const acknowledgeAlert = async (alertId: string) => {
    await api.acknowledgeAlert(alertId, currentUser.name);
    await refreshData();
  };

  const resolveAlert = async (alertId: string, rootCause: string, notes: string) => {
    await api.resolveAlert(alertId, currentUser.name, rootCause, notes);
    await refreshData();
  };

  const createAlert = async (data: Partial<Alert>) => {
    await api.createAlert(data);
    await refreshData();
  };

  const createMaintenanceTask = async (data: any) => {
    await api.createMaintenanceTask({ ...data, createdBy: currentUser.name });
    await refreshData();
  };

  const updateMaintenanceTask = async (id: string, data: Partial<MaintenanceTask>) => {
    await api.updateMaintenanceTask(id, data);
    await refreshData();
  };

  const signoffMaintenanceTask = async (id: string, department: 'operations' | 'maintenance' | 'safety', approved: boolean) => {
    await api.signoffMaintenanceTask(id, department, approved, currentUser.name);
    await refreshData();
  };

  const sendMessage = async (content: string, machineCode?: string, priority?: string) => {
    await api.sendMessage(currentUser.id, content, machineCode, priority);
    await refreshData();
  };

  return (
    <FactoryContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser,
        isAuthenticated,
        login,
        logout,
        kpi,
        machines,
        sensors,
        zones,
        alerts,
        maintenanceTasks,
        messages,
        isStreaming,
        isLoading,
        error,
        refreshData,
        toggleStreaming,
        injectScenario,
        resetSimulation,
        acknowledgeAlert,
        resolveAlert,
        createAlert,
        createMaintenanceTask,
        updateMaintenanceTask,
        signoffMaintenanceTask,
        sendMessage,
        selectedMachineForAi,
        setSelectedMachineForAi
      }}
    >
      {children}
    </FactoryContext.Provider>
  );
};

export const useFactory = () => {
  const context = useContext(FactoryContext);
  if (!context) {
    throw new Error('useFactory must be used within a FactoryProvider');
  }
  return context;
};
