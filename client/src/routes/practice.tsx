import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StudentAppShell } from "@/components/layout/StudentAppShell";
import { PracticeScreen } from "@/components/practice/PracticeScreen";
import { MissionPlayer } from "@/components/mission/MissionPlayer";
import { akhlaqMissions } from "@/content/chapter-akhlaq";
import type { Mission } from "@/lib/noor/types";

export const Route = createFileRoute("/practice")({
  component: PracticeRoute,
});

function PracticeRoute() {
  const [activePlayMission, setActivePlayMission] = useState<Mission | null>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("openLatest") === "true") {
        const missionId = params.get("missionId");
        const found = akhlaqMissions.find((m) => m.id === missionId) || akhlaqMissions[0];
        setActivePlayMission(found);
        setIsReviewMode(false);

        // Clear query parameters so reload stays on practice screen cleanly
        const url = new URL(window.location.href);
        url.searchParams.delete("openLatest");
        url.searchParams.delete("missionId");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, []);

  const handleStartReview = (mission: Mission, reviewMode: boolean = true) => {
    setActivePlayMission(mission);
    setIsReviewMode(reviewMode);
  };

  return (
    <StudentAppShell currentTab="practice">
      <PracticeScreen onStartReview={handleStartReview} />

      {/* Interactive Task / Mission Popup Modal */}
      {activePlayMission && (
        <MissionPlayer
          mission={activePlayMission}
          isReviewMode={isReviewMode}
          onClose={() => setActivePlayMission(null)}
        />
      )}
    </StudentAppShell>
  );
}
