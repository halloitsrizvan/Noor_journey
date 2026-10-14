import React from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { akhlaqMissions } from "@/content/chapter-akhlaq";
import type { Mission } from "@/lib/noor/types";

import { MissionHero } from "./MissionHero";
import { WeeklyProgress } from "./WeeklyProgress";
import { ExploreTiles } from "./ExploreTiles";

interface ChildDashboardProps {
  onStartMission: (mission: Mission) => void;
  onOpenJourney: () => void;
  onOpenPractice: () => void;
}

export const ChildDashboard: React.FC<ChildDashboardProps> = ({
  onStartMission,
  onOpenJourney,
  onOpenPractice,
}) => {
  const { lang, activeProgress, getMissionStatus } = useNoor();
  const t = translations[lang];

  // Find the first available or in-progress mission for today
  const currentMission =
    akhlaqMissions.find((m) => {
      const status = getMissionStatus(m.id);
      return status === "available" || status === "current";
    }) ||
    akhlaqMissions[0];

  return (
    <div className="w-full space-y-6 animate-pop pb-6">
      {/* Main Page Heading */}
      <div>
        <h1
          className="text-2xl sm:text-3xl font-black text-[#141426] tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t.yourLearningSpace}
        </h1>
      </div>

      {/* Prominent Lavender Today's Mission Panel */}
      <MissionHero
        mission={currentMission}
        onContinue={onStartMission}
      />

      {/* Derived Weekly Progress */}
      <WeeklyProgress />

      {/* Supporting Destinations: Apricot & Sky-blue Explore Tiles */}
      <ExploreTiles
        onOpenJourney={onOpenJourney}
        onOpenPractice={onOpenPractice}
      />
    </div>
  );
};
