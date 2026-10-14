import React from "react";
import type { Mission } from "@/lib/noor/types";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { akhlaqMissions } from "@/content/chapter-akhlaq";
import { akhlaqChapter, worlds } from "@/content/worlds-data";
import { MissionNode } from "./MissionNode";
import { LanternMascot } from "../mascot/LanternMascot";
import { Award, Compass, Sparkles, Target } from "lucide-react";

interface JourneyMapProps {
  onSelectMission: (mission: Mission) => void;
  onOpenWorldSelector: () => void;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({
  onSelectMission,
  onOpenWorldSelector,
}) => {
  const {
    lang,
    activeProfile,
    activeProgress,
    getMissionStatus,
    getWeeklyProgressCount,
  } = useNoor();

  const t = translations[lang];
  const currentWorld = worlds[0]; // Akhlaq world for demo
  const weeklyCount = getWeeklyProgressCount();
  const weeklyGoal = activeProfile?.weeklyGoal ?? 3;
  const weeklyPercent = Math.min(100, Math.round((weeklyCount / weeklyGoal) * 100));

  const hasChapterBadge = activeProgress?.badges.includes(akhlaqChapter.badge.id);

  return (
    <div className="flex flex-col w-full pb-8">
      {/* World Header Banner */}
      <div className="bg-gradient-to-b from-primary/15 via-primary/5 to-transparent px-4 pt-4 pb-3 border-b border-border/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
              <Compass className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider block">
                {t.worldTitle}
              </span>
              <h2 className="text-sm font-extrabold text-foreground leading-tight">
                {currentWorld.title[lang]}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenWorldSelector}
            className="text-xs font-bold text-primary hover:text-primary-deep bg-card border border-primary/30 px-3 py-1.5 rounded-full tactile shadow-2xs"
          >
            {t.switchWorld}
          </button>
        </div>

        {/* Weekly Goal Progress Bar */}
        <div className="mt-3 bg-card border border-border/80 rounded-2xl p-2.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold flex items-center gap-1.5 text-foreground">
              <Target className="w-3.5 h-3.5 text-primary" />
              {t.weeklyGoal}
            </span>
            <span className="font-extrabold text-primary">
              {weeklyCount} / {weeklyGoal} {lang === "ml" ? "ദിവസം" : "days"}
            </span>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-leaf rounded-full transition-all duration-500"
              style={{ width: `${weeklyPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mascot Greeting */}
      <div className="px-4 py-3 flex items-center gap-3">
        <LanternMascot mood="happy" size="sm" />
        <div className="flex-1 bg-card border border-primary/20 rounded-2xl p-2.5 shadow-2xs text-xs text-foreground font-medium leading-relaxed">
          {lang === "ml"
            ? `ഹലോ ${activeProfile?.nickname ?? "കൂട്ടുകാരാ"}! ഇന്ന് പുതിയൊരു നല്ല ശീലം കൂടി പഠിക്കാം.`
            : `Hello ${activeProfile?.nickname ?? "friend"}! Ready to learn another good character habit today?`}
        </div>
      </div>

      {/* Chapter Overview Card */}
      <div className="mx-4 mb-4 bg-card border-2 border-primary/20 rounded-2xl p-3 shadow-xs">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
              {lang === "ml" ? "അധ്യായം 1" : "Chapter 1"}
            </span>
            <h3 className="text-sm font-extrabold text-foreground leading-snug">
              {akhlaqChapter.title[lang]}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {akhlaqChapter.description[lang]}
            </p>
          </div>
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
              hasChapterBadge
                ? "bg-amber-100 border-amber-300 text-amber-700"
                : "bg-muted border-border text-muted-foreground"
            }`}
            title={akhlaqChapter.badge.name[lang]}
          >
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Vertical Garden Path with Connected Line */}
      <div className="relative flex flex-col items-center py-2 px-4">
        {/* Winding Trail Line in background */}
        <div className="absolute top-8 bottom-16 w-1.5 bg-gradient-to-b from-primary/30 via-leaf/40 to-gold/50 rounded-full -z-0" />

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
            className={`w-22 h-22 rounded-3xl flex flex-col items-center justify-center border-4 shadow-lg tactile ${
              hasChapterBadge
                ? "bg-amber-400 border-amber-600 text-amber-950 animate-pop"
                : "bg-muted border-border text-muted-foreground opacity-80"
            }`}
          >
            <Award className={`w-9 h-9 ${hasChapterBadge ? "text-amber-950" : "text-muted-foreground"}`} />
            <span className="text-[10px] font-extrabold mt-0.5 text-center px-1 leading-none">
              {hasChapterBadge ? "നേടി!" : "ബാഡ്ജ്"}
            </span>
          </div>
          <span className="text-xs font-bold text-foreground mt-2 text-center max-w-[140px] leading-tight">
            {akhlaqChapter.badge.name[lang]}
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5 text-center">
            {lang === "ml" ? "5 മിഷനുകൾ വിജയിക്കുമ്പോൾ ലഭിക്കും" : "Unlocked after completing 5 missions"}
          </span>
        </div>
      </div>
    </div>
  );
};
