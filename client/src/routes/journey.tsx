import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { StudentAppShell } from "@/components/layout/StudentAppShell";
import { ChildDashboard } from "@/components/dashboard/ChildDashboard";
import { JourneyMap } from "@/components/journey/JourneyMap";
import { MissionOverviewModal } from "@/components/journey/ChapterOverviewDialog";
import { MissionPlayer } from "@/components/mission/MissionPlayer";
import type { Mission } from "@/lib/noor/types";

export const Route = createFileRoute("/journey")({
  component: JourneyRoute,
});

function JourneyRoute() {
  const navigate = useNavigate();
  const [journeyView, setJourneyView] = useState<"dashboard" | "map">("dashboard");
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [activePlayMission, setActivePlayMission] = useState<Mission | null>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);

  const handleStartMissionFromHero = (mission: Mission) => {
    navigate({
      to: "/practice",
      search: { openLatest: "true", missionId: mission.id } as any,
    });
  };

  const handleStartMissionDirectly = (mission: Mission) => {
    setIsReviewMode(false);
    setActivePlayMission(mission);
  };

  return (
    <StudentAppShell currentTab="journey">
      {journeyView === "dashboard" ? (
        <ChildDashboard
          onStartMission={handleStartMissionFromHero}
          onOpenJourney={() => setJourneyView("map")}
          onOpenPractice={() => navigate({ to: "/practice" })}
        />
      ) : (
        <JourneyMap
          onSelectMission={(mission) => setSelectedMission(mission)}
          onOpenWorldSelector={() => {}}
          onBackToDashboard={() => setJourneyView("dashboard")}
        />
      )}

      {/* Mission Overview Modal */}
      <MissionOverviewModal
        mission={selectedMission}
        isOpen={!!selectedMission && !activePlayMission}
        onClose={() => setSelectedMission(null)}
        onStartMission={handleStartMissionDirectly}
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
    </StudentAppShell>
  );
}
