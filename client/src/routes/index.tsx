import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { NoorProvider, useNoor } from "@/lib/noor/state";
import { AppShell } from "@/components/layout/AppShell";
import type { NavTab } from "@/components/layout/BottomNav";
import type { Mission } from "@/lib/noor/types";

import { JourneyMap } from "@/components/journey/JourneyMap";
import { MissionOverviewModal } from "@/components/journey/ChapterOverviewDialog";
import { WorldSelectorModal } from "@/components/journey/WorldSelectorDialog";
import { PracticeScreen } from "@/components/practice/PracticeScreen";
import { CollectionScreen } from "@/components/collection/CollectionScreen";
import { ParentGateModal } from "@/components/parent/ParentGateModal";
import { ParentDashboardModal } from "@/components/parent/ParentDashboardModal";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { MissionPlayer } from "@/components/mission/MissionPlayer";

export const Route = createFileRoute("/")({
  component: NoorApp,
});

function NoorApp() {
  return (
    <NoorProvider>
      <NoorAppContent />
    </NoorProvider>
  );
}

function NoorAppContent() {
  const [currentTab, setCurrentTab] = useState<NavTab>("journey");
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [activePlayMission, setActivePlayMission] = useState<Mission | null>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);

  // Modals state
  const [isWorldSelectorOpen, setIsWorldSelectorOpen] = useState(false);
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [isParentDashboardOpen, setIsParentDashboardOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedWorldId, setSelectedWorldId] = useState("akhlaq");

  const handleStartMission = (mission: Mission) => {
    setIsReviewMode(false);
    setActivePlayMission(mission);
  };

  const handleStartReview = (mission: Mission) => {
    setIsReviewMode(true);
    setActivePlayMission(mission);
  };

  return (
    <>
      <AppShell
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenParentGate={() => setIsParentGateOpen(true)}
        onOpenProfilePicker={() => setIsOnboardingOpen(true)}
      >
        {currentTab === "journey" && (
          <JourneyMap
            onSelectMission={(mission) => setSelectedMission(mission)}
            onOpenWorldSelector={() => setIsWorldSelectorOpen(true)}
          />
        )}

        {currentTab === "practice" && (
          <PracticeScreen onStartReview={handleStartReview} />
        )}

        {currentTab === "collection" && <CollectionScreen />}
      </AppShell>

      {/* Mission Overview Modal */}
      <MissionOverviewModal
        mission={selectedMission}
        isOpen={!!selectedMission && !activePlayMission}
        onClose={() => setSelectedMission(null)}
        onStartMission={handleStartMission}
      />

      {/* Fullscreen Interactive Mission Player */}
      {activePlayMission && (
        <MissionPlayer
          mission={activePlayMission}
          isReviewMode={isReviewMode}
          onClose={() => {
            setActivePlayMission(null);
            setSelectedMission(null);
          }}
        />
      )}

      {/* World Selector Modal */}
      <WorldSelectorModal
        isOpen={isWorldSelectorOpen}
        onClose={() => setIsWorldSelectorOpen(false)}
        selectedWorldId={selectedWorldId}
        onSelectWorld={setSelectedWorldId}
      />

      {/* Parent Verification Gate */}
      <ParentGateModal
        isOpen={isParentGateOpen}
        onClose={() => setIsParentGateOpen(false)}
        onSuccess={() => setIsParentDashboardOpen(true)}
      />

      {/* Parent Dashboard & Demo Controls */}
      <ParentDashboardModal
        isOpen={isParentDashboardOpen}
        onClose={() => setIsParentDashboardOpen(false)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Onboarding & Profile Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </>
  );
}
