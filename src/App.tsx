import React, { useState, useEffect } from 'react';
import {
  Mine,
  ExplorationTarget,
  DrillHole,
  ReserveBlock,
  EquipmentAsset,
  ActionRecommendation,
  WeatherObservation,
  SatelliteScene,
} from './types/mining';
import {
  fetchMines,
  fetchExplorationTargets,
  fetchProspectivityMap,
  fetchReserves,
  fetchEquipment,
  fetchWeather,
  fetchSatelliteScenes,
  fetchRecommendations,
} from './services/api';

import { TopBar } from './components/TopBar';
import { Sidebar, NavModule } from './components/Sidebar';
import { ExecutiveDecisionModal } from './components/ExecutiveDecisionModal';
import { CopilotDrawer } from './components/CopilotDrawer';
import { LandingLoginModal } from './views/LandingLoginModal';

// Views
import { CommandCenterView } from './views/CommandCenterView';
import { ExplorationView } from './views/ExplorationView';
import { ProspectivityMapView } from './views/ProspectivityMapView';
import { ReserveView } from './views/ReserveView';
import { ProductionForecastView } from './views/ProductionForecastView';
import { ShortfallRadarView } from './views/ShortfallRadarView';
import { EquipmentView } from './views/EquipmentView';
import { WeatherSatelliteView } from './views/WeatherSatelliteView';
import { DigitalTwinView } from './views/DigitalTwinView';
import { WhatIfSimulatorView } from './views/WhatIfSimulatorView';
import { RecommendationsView } from './views/RecommendationsView';
import { EvidenceView } from './views/EvidenceView';
import { DataStudioView } from './views/DataStudioView';
import { ReportsView } from './views/ReportsView';
import { AdminView } from './views/AdminView';

export function App() {
  const [activeModule, setActiveModule] = useState<NavModule>('command-center');
  const [mines, setMines] = useState<Mine[]>([]);
  const [activeMineId, setActiveMineId] = useState<string>('mine-dongri-buzurg');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isExecutiveMode, setIsExecutiveMode] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>({
    name: 'MOIL Evaluator / Executive',
    role: 'Chief Mining Officer',
  });

  // Domain state
  const [targets, setTargets] = useState<ExplorationTarget[]>([]);
  const [drillHoles, setDrillHoles] = useState<DrillHole[]>([]);
  const [reserveBlocks, setReserveBlocks] = useState<ReserveBlock[]>([]);
  const [equipment, setEquipment] = useState<EquipmentAsset[]>([]);
  const [recommendations, setRecommendations] = useState<ActionRecommendation[]>([]);
  const [weather, setWeather] = useState<WeatherObservation | null>(null);
  const [forecast14Days, setForecast14Days] = useState<WeatherObservation[]>([]);
  const [scenes, setScenes] = useState<SatelliteScene[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<ExplorationTarget | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Load all foundational datasets from backend
  const loadPlatformData = async () => {
    setIsRefreshing(true);
    try {
      const [
        minesRes,
        mapRes,
        equipRes,
        weathRes,
        satRes,
        recRes,
      ] = await Promise.all([
        fetchMines(),
        fetchProspectivityMap(activeMineId),
        fetchEquipment(activeMineId),
        fetchWeather(),
        fetchSatelliteScenes(),
        fetchRecommendations(),
      ]);

      if (minesRes.success) setMines(minesRes.data);
      if (mapRes.success) {
        setTargets(mapRes.targets);
        setDrillHoles(mapRes.drillHoles);
        setReserveBlocks(mapRes.reserveBlocks);
      }
      if (equipRes.success) setEquipment(equipRes.data);
      if (weathRes.success) {
        setWeather(weathRes.current);
        setForecast14Days(weathRes.forecast14Days);
      }
      if (satRes.success) setScenes(satRes.scenes);
      if (recRes.success) setRecommendations(recRes.recommendations);
    } catch (err) {
      console.error('Error loading Manganex intelligence data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, [activeMineId]);

  const activeMine = mines.find((m) => m.id === activeMineId) || mines[0];

  const handleSelectTargetFromMap = (target: ExplorationTarget) => {
    setSelectedTarget(target);
  };

  const handleApplyRecommendation = (rec: ActionRecommendation) => {
    setActiveModule('what-if-simulator');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans select-none">
      {/* Top Bar Contract */}
      <TopBar
        mines={mines}
        activeMineId={activeMineId}
        onSelectMine={setActiveMineId}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode((prev) => !prev)}
        isExecutiveMode={isExecutiveMode}
        onToggleExecutiveMode={() => setIsExecutiveMode(true)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onRefreshData={loadPlatformData}
        isRefreshing={isRefreshing}
      />

      {/* Main Body: Sidebar + Active Module Viewport */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          shortfallAlertCount={2}
          recommendationsCount={recommendations.length}
        />

        {/* Viewport Canvas */}
        <main className="flex-1 flex flex-col overflow-hidden bg-neutral-950">
          {activeMine && (
            <>
              {activeModule === 'command-center' && (
                <CommandCenterView
                  activeMine={activeMine}
                  targets={targets}
                  drillHoles={drillHoles}
                  reserveBlocks={reserveBlocks}
                  equipment={equipment}
                  recommendations={recommendations}
                  weather={weather || ({} as any)}
                  onNavigateToModule={setActiveModule}
                  onSelectTarget={handleSelectTargetFromMap}
                />
              )}

              {activeModule === 'exploration' && (
                <ExplorationView
                  activeMine={activeMine}
                  targets={targets}
                  onSelectTarget={handleSelectTargetFromMap}
                  onRefreshTargets={loadPlatformData}
                />
              )}

              {activeModule === 'prospectivity-map' && (
                <ProspectivityMapView
                  activeMine={activeMine}
                  targets={targets}
                  drillHoles={drillHoles}
                  reserveBlocks={reserveBlocks}
                  equipment={equipment}
                  onSelectTarget={handleSelectTargetFromMap}
                  onSelectDrillHole={() => {}}
                />
              )}

              {activeModule === 'reserves' && (
                <ReserveView
                  activeMine={activeMine}
                  reserveBlocks={reserveBlocks}
                  drillHoles={drillHoles}
                  onRefreshReserves={loadPlatformData}
                />
              )}

              {activeModule === 'production-forecast' && (
                <ProductionForecastView
                  activeMine={activeMine}
                  onNavigateToSimulator={() => setActiveModule('what-if-simulator')}
                />
              )}

              {activeModule === 'shortfall-radar' && (
                <ShortfallRadarView
                  activeMine={activeMine}
                  onNavigateToRecommendations={() => setActiveModule('recommendations')}
                />
              )}

              {activeModule === 'equipment' && (
                <EquipmentView
                  activeMine={activeMine}
                  equipment={equipment}
                  onRefreshEquipment={loadPlatformData}
                />
              )}

              {activeModule === 'weather-satellite' && (
                <WeatherSatelliteView
                  weather={weather || ({} as any)}
                  forecast14Days={forecast14Days}
                  scenes={scenes}
                />
              )}

              {activeModule === 'digital-twin' && (
                <DigitalTwinView
                  activeMine={activeMine}
                  equipment={equipment}
                />
              )}

              {activeModule === 'what-if-simulator' && (
                <WhatIfSimulatorView activeMine={activeMine} />
              )}

              {activeModule === 'recommendations' && (
                <RecommendationsView
                  activeMine={activeMine}
                  recommendations={recommendations}
                  onRefreshRecommendations={loadPlatformData}
                />
              )}

              {activeModule === 'evidence' && <EvidenceView />}

              {activeModule === 'data-studio' && <DataStudioView />}

              {activeModule === 'reports' && <ReportsView activeMine={activeMine} />}

              {activeModule === 'admin' && <AdminView />}
            </>
          )}
        </main>
      </div>

      {/* Executive Decision Modal (Section 36) */}
      {activeMine && (
        <ExecutiveDecisionModal
          isOpen={isExecutiveMode}
          onClose={() => setIsExecutiveMode(false)}
          activeMine={activeMine}
          topTarget={targets[0]}
          topRecommendation={recommendations[0]}
          onApplyRecommendation={handleApplyRecommendation}
        />
      )}

      {/* AI Copilot Drawer (Section 21) */}
      {activeMine && (
        <CopilotDrawer
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          activeMine={activeMine}
          onNavigateToTarget={(targetId) => {
            setActiveModule('exploration');
            setIsCopilotOpen(false);
          }}
        />
      )}

      {/* Landing / Login Modal (Section 30) */}
      <LandingLoginModal
        isOpen={isLoginModalOpen}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsLoginModalOpen(false);
        }}
      />
    </div>
  );
}

export default App;
