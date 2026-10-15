import React from "react";
import type { Mission } from "@/lib/noor/types";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { akhlaqMissions } from "@/content/chapter-akhlaq";
import { akhlaqChapter, worlds } from "@/content/worlds-data";
import { MissionNode } from "./MissionNode";
import { Compass, Award, ArrowLeft } from "lucide-react";
import { Illustration } from "@/components/common/Illustration";

interface JourneyMapProps {
  onSelectMission: (mission: Mission) => void;
  onOpenWorldSelector: () => void;
  onBackToDashboard?: () => void;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({
  onSelectMission,
  onOpenWorldSelector,
  onBackToDashboard,
}) => {
  const { lang, activeProgress, getMissionStatus } = useNoor();

  const t = translations[lang];
  const currentWorld = worlds[0]; // Akhlaq world
  const hasChapterBadge = Boolean(activeProgress?.badges?.includes(akhlaqChapter.badge.id));

  return (
    <div className="flex flex-col w-full pb-8 animate-pop">
      {/* Top Bar with Back Action & World Selector */}
      <div className="flex items-center justify-between gap-2 mb-4">
        {onBackToDashboard ? (
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F3F1F4] text-[#141426] text-xs font-bold tactile border border-[#E4E0E9]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === "ml" ? "ഡാഷ്‌ബോർഡ്" : "Dashboard"}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#E3D4FF] text-[#7857E8] flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </span>
            <span
              className="text-lg font-black text-[#141426]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {currentWorld.title[lang]}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={onOpenWorldSelector}
          className="text-xs font-bold text-[#7857E8] bg-[#F0E9FF] hover:bg-[#E3D4FF] border border-[#E3D4FF] px-3.5 py-1.5 rounded-full tactile shadow-2xs"
        >
          {t.switchWorld}
        </button>
      </div>

      {/* Chapter Overview Card in Lavender */}
      <div className="bg-[#E3D4FF] rounded-[28px] p-5 shadow-2xs mb-6 relative overflow-hidden">
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="max-w-[75%]">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7857E8] block mb-1">
              {lang === "ml" ? "അധ്യായം 1 • അഖ്ലാഖ്" : "Chapter 1 • Akhlaq"}
            </span>
            <h2
              className="text-xl font-black text-[#141426] leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {akhlaqChapter.title[lang]}
            </h2>
            <p className="text-xs text-[#626273] font-medium mt-1 leading-relaxed">
              {akhlaqChapter.description[lang]}
            </p>
          </div>

          <div className="w-16 h-16 shrink-0 -mr-1 -mt-1 pointer-events-none">
            <Illustration
              role="journey"
              className="w-full h-full object-contain drop-shadow-2xs"
              alt="Chapter flag on mountain"
            />
          </div>
        </div>
      </div>

      {/* Vertical Restrained Path with Mission Nodes */}
      <div className="relative flex flex-col items-center py-2 px-4">
        {/* Winding Trail Line in Background */}
        <div className="absolute top-8 bottom-20 w-1 border-r-2 border-dashed border-[#E4E0E9] -z-0" />

        {/* Mission Nodes */}
        {akhlaqMissions.map((mission, index) => {
          const status = getMissionStatus(mission.id);
          return (
            <MissionNode
              key={mission.id}
              mission={mission}
              status={status}
              index={index}
              onSelect={onSelectMission}
            />
          );
        })}

        {/* Final Chapter Badge Node */}
        <div className="flex flex-col items-center mt-6 relative z-10">
          <div
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 shadow-sm tactile ${
              hasChapterBadge
                ? "bg-[#FFD184] border-[#191A22] text-[#141426] animate-pop"
                : "bg-[#F3F1F4] border-[#E4E0E9] text-[#626273] opacity-75"
            }`}
          >
            <div className="w-14 h-14 pointer-events-none">
              <Illustration
                role="collection"
                className="w-full h-full object-contain"
                alt="Chapter star badge"
              />
            </div>
          </div>
          <span
            className="text-sm font-black text-[#141426] mt-2 text-center max-w-[160px] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {akhlaqChapter.badge.name[lang]}
          </span>
          <span className="text-[11px] font-semibold text-[#626273] mt-0.5 text-center">
            {lang === "ml"
              ? "5 മിഷനുകൾ പൂർത്തിയാക്കുമ്പോൾ"
              : "Awarded on chapter completion"}
          </span>
        </div>
      </div>
    </div>
  );
};
