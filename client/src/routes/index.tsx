import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { NoorProvider, useNoor } from "@/lib/noor/state";
import { AppShell } from "@/components/layout/AppShell";
import type { NavTab } from "@/components/layout/BottomNav";
import type { Mission } from "@/lib/noor/types";

import { ChildDashboard } from "@/components/dashboard/ChildDashboard";
import { JourneyMap } from "@/components/journey/JourneyMap";
import { MissionOverviewModal } from "@/components/journey/ChapterOverviewDialog";
import { WorldSelectorModal } from "@/components/journey/WorldSelectorDialog";
import { PracticeScreen } from "@/components/practice/PracticeScreen";
import { CollectionScreen } from "@/components/collection/CollectionScreen";
import { ParentGateModal } from "@/components/parent/ParentGateModal";
import { ParentDashboardModal } from "@/components/parent/ParentDashboardModal";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { MissionPlayer } from "@/components/mission/MissionPlayer";
import { WelcomeAuthScreen } from "@/components/auth/WelcomeAuthScreen";

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
  const { authAccount } = useNoor();

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>("journey");
  const [journeyView, setJourneyView] = useState<"dashboard" | "map">("dashboard");

  // Welcome / Sign-in Screen toggle
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);

  // Active missions & review state
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

  // If Welcome Screen is explicitly active, display the left visual reference screen
  if (showWelcomeScreen) {
    return (
      <WelcomeAuthScreen
        onEnterChildSpace={() => setShowWelcomeScreen(false)}
      />
    );
  }

  return (
    <>
      <AppShell
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === "journey") {
            setJourneyView("dashboard");
          }
        }}
        onOpenParentGate={() => setIsParentGateOpen(true)}
        onOpenProfilePicker={() => setIsParentGateOpen(true)}
      >
        {/* TAB 1: JOURNEY (Child Dashboard / Journey Map) */}
        {currentTab === "journey" && (
          <>
            {journeyView === "dashboard" ? (
              <ChildDashboard
                onStartMission={handleStartMission}
                onOpenJourney={() => setJourneyView("map")}
                onOpenPractice={() => setCurrentTab("practice")}
              />
            ) : (
              <JourneyMap
                onSelectMission={(mission) => setSelectedMission(mission)}
                onOpenWorldSelector={() => setIsWorldSelectorOpen(true)}
                onBackToDashboard={() => setJourneyView("dashboard")}
              />
            )}
          </>
        )}

        {/* TAB 2: PRACTICE (Spaced Revision Queue) */}
        {currentTab === "practice" && (
          <PracticeScreen onStartReview={handleStartReview} />
        )}

        {/* TAB 3: COLLECTION (Milestone Badges & Avatars) */}
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

      {/* Parent Dashboard & Account Controls */}
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
