import React from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { akhlaqMissions } from "@/content/chapter-akhlaq";
import { ArrowRight, ChevronRight, Clock } from "lucide-react";
import { Illustration } from "@/components/common/Illustration";

interface ExploreTilesProps {
  onOpenJourney: () => void;
  onOpenPractice: () => void;
}

export const ExploreTiles: React.FC<ExploreTilesProps> = ({
  onOpenJourney,
  onOpenPractice,
}) => {
  const { lang, activeProgress, getDueReviews } = useNoor();
  const t = translations[lang];

  const totalMissions = akhlaqMissions.length;
  const completedMissions = akhlaqMissions.filter(
    (m) => activeProgress?.missions[m.id]?.passedAt
  ).length;

  const currentMissionIndex = Math.min(completedMissions + 1, totalMissions);
  const dueReviews = getDueReviews();

  return (
    <section aria-label={t.keepExploring} className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-lg font-black text-[#141426]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t.keepExploring}
        </h3>
        <button
          type="button"
          onClick={onOpenJourney}
          className="text-xs font-bold text-[#7857E8] hover:underline flex items-center gap-0.5"
        >
          <span>{t.seeAll}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2 Balanced Pastel Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Apricot Tile: My Journey */}
        <div
          onClick={onOpenJourney}
          className="relative overflow-hidden bg-[#FFD184] rounded-[26px] p-4 flex flex-col justify-between min-h-[170px] shadow-2xs cursor-pointer tactile group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onOpenJourney()}
          aria-label={t.myJourneyTitle}
        >
          {/* Text Header */}
          <div className="relative z-10">
            <h4
              className="text-base font-black text-[#141426] leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.myJourneyTitle}
            </h4>
            <span className="text-[11px] font-bold text-[#141426]/75 block mt-0.5">
              {lang === "ml"
                ? `മിഷൻ ${currentMissionIndex} / ${totalMissions}`
                : `Mission ${currentMissionIndex} of ${totalMissions}`}
            </span>
          </div>

          {/* Action Button & 3D Illustration */}
          <div className="relative z-10 flex items-end justify-between mt-4">
            <div className="w-8 h-8 rounded-full bg-[#191A22] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* Illustration on the right */}
            <div className="w-24 h-24 -mr-2 -mb-2 pointer-events-none">
              <Illustration
                role="journey"
                className="w-full h-full object-contain drop-shadow-2xs"
                alt="Winding path on rolling hill"
              />
            </div>
          </div>
        </div>

        {/* Sky-blue Tile: Quick Practice */}
        <div
          onClick={onOpenPractice}
          className="relative overflow-hidden bg-[#BEDAFF] rounded-[26px] p-4 flex flex-col justify-between min-h-[170px] shadow-2xs cursor-pointer tactile group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onOpenPractice()}
          aria-label={t.quickPracticeTitle}
        >
          {/* Text Header */}
          <div className="relative z-10">
            <h4
              className="text-base font-black text-[#141426] leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.quickPracticeTitle}
            </h4>
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#141426]/75 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>
                {dueReviews.length > 0
                  ? `${dueReviews.length} ${t.dueRevisions}`
                  : `3 ${t.minutes}`}
              </span>
            </div>
          </div>

          {/* Action Button & 3D Illustration */}
          <div className="relative z-10 flex items-end justify-between mt-4">
            <div className="w-8 h-8 rounded-full bg-[#191A22] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* Illustration on the right */}
            <div className="w-24 h-24 -mr-2 -mb-2 pointer-events-none">
              <Illustration
                role="practice"
                className="w-full h-full object-contain drop-shadow-2xs"
                alt="Yellow pencil drawing curve"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
