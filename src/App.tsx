import React, { useState } from 'react';
import { FactoryProvider, useFactory } from './context/FactoryContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { DashboardView } from './components/modules/DashboardView';
import { FloorMapView } from './components/modules/FloorMapView';
import { MachineMonitoringView } from './components/modules/MachineMonitoringView';
import { SensorFeedsView } from './components/modules/SensorFeedsView';
import { MaintenanceSchedulingView } from './components/modules/MaintenanceSchedulingView';
import { AlertManagementView } from './components/modules/AlertManagementView';
import { CollaborationHubView } from './components/modules/CollaborationHubView';
import { AnalyticsView } from './components/modules/AnalyticsView';

import { AiDiagnosticModal } from './components/modals/AiDiagnosticModal';
import { CreateTaskModal } from './components/modals/CreateTaskModal';
import { CreateAlertModal } from './components/modals/CreateAlertModal';
import { ResolveAlertModal } from './components/modals/ResolveAlertModal';
import { SimulatorDrawer } from './components/modals/SimulatorDrawer';
import { Alert } from './types';
import { LoginPage } from './components/auth/LoginPage';

function MainLayout() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCreateAlertOpen, setIsCreateAlertOpen] = useState(false);
  const [alertToResolve, setAlertToResolve] = useState<Alert | null>(null);
  const [taskPrefill, setTaskPrefill] = useState<any>(null);
  const [targetMachineForTask, setTargetMachineForTask] = useState<string | undefined>(undefined);

  const { selectedMachineForAi, setSelectedMachineForAi } = useFactory();

  const handleScheduleMaintenanceFromMachine = (machineId: string) => {
    setTargetMachineForTask(machineId);
    setTaskPrefill(null);
    setIsCreateTaskOpen(true);
  };

  const handleScheduleMaintenanceFromAi = (prefill: any) => {
    setTaskPrefill(prefill);
    setTargetMachineForTask(prefill.machineId);
    setIsCreateTaskOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        onOpenAlerts={() => setActiveTab('alerts')}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />

        {/* Dynamic Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigateToFloor={() => setActiveTab('floormap')}
              onNavigateToAlerts={() => setActiveTab('alerts')}
              onNavigateToMaintenance={() => setActiveTab('maintenance')}
            />
          )}

          {activeTab === 'floormap' && <FloorMapView />}

          {activeTab === 'machines' && (
            <MachineMonitoringView
              onScheduleMaintenance={handleScheduleMaintenanceFromMachine}
            />
          )}

          {activeTab === 'sensors' && <SensorFeedsView />}

          {activeTab === 'maintenance' && (
            <MaintenanceSchedulingView
              onOpenCreateTaskModal={() => {
                setTaskPrefill(null);
                setTargetMachineForTask(undefined);
                setIsCreateTaskOpen(true);
              }}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertManagementView
              onOpenCreateAlertModal={() => setIsCreateAlertOpen(true)}
              onOpenResolveModal={(alert: Alert) => setAlertToResolve(alert)}
            />
          )}

          {activeTab === 'collaboration' && <CollaborationHubView />}

          {activeTab === 'analytics' && <AnalyticsView />}
        </main>
      </div>

      {/* Modals & Drawers */}
      <AiDiagnosticModal
        machine={selectedMachineForAi}
        onClose={() => setSelectedMachineForAi(null)}
        onScheduleMaintenance={handleScheduleMaintenanceFromAi}
      />

      {isCreateTaskOpen && (
        <CreateTaskModal
          initialMachineId={targetMachineForTask}
          prefillData={taskPrefill}
          onClose={() => {
            setIsCreateTaskOpen(false);
            setTaskPrefill(null);
            setTargetMachineForTask(undefined);
          }}
        />
      )}

      {isCreateAlertOpen && (
        <CreateAlertModal onClose={() => setIsCreateAlertOpen(false)} />
      )}

      <ResolveAlertModal
        alert={alertToResolve}
        onClose={() => setAlertToResolve(null)}
      />

      <SimulatorDrawer
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />
    </div>
  );
}

function AppContent() {
  const { isAuthenticated } = useFactory();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <MainLayout />;
}

export default function App() {
  return (
    <FactoryProvider>
      <AppContent />
    </FactoryProvider>
  );
}
