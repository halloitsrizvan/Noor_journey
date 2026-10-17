import React, { useState } from "react";
import type { Mission } from "@/lib/noor/types";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { akhlaqMissions } from "@/content/chapter-akhlaq";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Play,
  RotateCcw,
  Lock,
  ChevronRight,
  Flame,
} from "lucide-react";
import { Illustration } from "@/components/common/Illustration";
import { DailyIbadahRevisionTracker } from "./DailyIbadahRevisionTracker";

interface PracticeScreenProps {
  onStartReview: (mission: Mission, isReviewMode?: boolean) => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({ onStartReview }) => {
  const { lang, activeProgress, getMissionStatus } = useNoor();
  const t = translations[lang];
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  // Find next unlocked / actionable mission
  const nextMission =
    akhlaqMissions.find((m) => {
      const status = getMissionStatus(m.id);
      return status === "current" || status === "available";
    }) ||
    akhlaqMissions.find((m) => !activeProgress?.missions[m.id]?.passedAt) ||
    akhlaqMissions[0];

  const completedCount = akhlaqMissions.filter(
    (m) => !!activeProgress?.missions[m.id]?.passedAt
  ).length;

  return (
    <div className="flex flex-col w-full space-y-5 animate-pop pb-8">
      {/* Sky-blue Feature Header with 3D Pencil Illustration */}
      <div className="bg-[#BEDAFF] rounded-[28px] p-5 shadow-2xs relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10 max-w-[65%]">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#141426]/70 block mb-1">
            {lang === "ml" ? "ഓർമ്മപ്പെടുത്തൽ & പരിശീലനം" : "Spaced Retention & Practice"}
          </span>
          <h1
            className="text-2xl font-black text-[#141426] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.quickPracticeTitle}
          </h1>
          <p className="text-xs text-[#141426]/80 font-medium mt-1 leading-relaxed">
            {t.practiceDesc}
          </p>
        </div>

        {/* 3D Pencil Illustration */}
        <div className="w-24 h-24 shrink-0 -mr-2 pointer-events-none">
          <Illustration
            role="practice"
            className="w-full h-full object-contain drop-shadow-2xs"
            alt="Pencil drawing smooth curve"
          />
        </div>
      </div>

      {/* Daily Ibadah & Worship Tracker: Swalah, Sunnah, Quran, Dhikr, Swalath */}
      <DailyIbadahRevisionTracker />

      {/* Concept Mastery Track Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2
              className="text-base font-black text-[#141426]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {lang === "ml" ? "ആശയങ്ങളുടെ ഉറപ്പ് (Mastery Track)" : "Concept Mastery Track"}
            </h2>
            <p className="text-[11px] text-[#626273] mt-0.5">
              {lang === "ml"
                ? `${completedCount} / ${akhlaqMissions.length} ആശയങ്ങൾ പഠിച്ചു കഴിഞ്ഞു`
                : `${completedCount} of ${akhlaqMissions.length} lessons learned • Click any step to practice`}
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#F3F1F4] text-[#141426] text-xs font-bold border border-[#E4E0E9] flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#FF9800]" />
            <span>{Math.round((completedCount / akhlaqMissions.length) * 100)}%</span>
          </span>
        </div>

        {/* Locked Notice Banner */}
        {lockedNotice && (
          <div className="mb-3 p-3 rounded-2xl bg-[#FFF4E5] border border-[#FFE2B5] text-[#935200] text-xs font-semibold flex items-center justify-between animate-fade-in">
            <span>{lockedNotice}</span>
            <button
              type="button"
              onClick={() => setLockedNotice(null)}
              className="text-[#935200] font-bold text-xs hover:underline ml-2"
            >
              ✕
            </button>
          </div>
        )}

        <div className="space-y-2.5">
          {akhlaqMissions.map((m) => {
            const passed = !!activeProgress?.missions[m.id]?.passedAt;
            const review = activeProgress?.reviews[m.id];
            const isRetained = review?.isRetained;
            const status = getMissionStatus(m.id);
            const isCurrent = status === "current" || status === "available";
            const isLocked = status === "locked" && !passed;

            const handleCardClick = () => {
              if (passed) {
                // If passed, allow reviewing anytime
                onStartReview(m, true);
              } else if (isCurrent) {
                // If it's the current up-next mission, start it immediately
                onStartReview(m, false);
              } else if (isLocked) {
                setLockedNotice(
                  lang === "ml"
                    ? `ഈ സ്റ്റെപ്പ് അൺലോക്ക് ചെയ്യാൻ മിഷൻ #${m.order - 1} പൂർത്തിയാക്കുക.`
                    : `Complete Mission #${m.order - 1} first to unlock this step!`
                );
              }
            };

            return (
              <div
                key={m.id}
                onClick={handleCardClick}
                className={`bg-white border rounded-[22px] p-3.5 shadow-2xs flex items-center justify-between gap-3 transition-all cursor-pointer ${
                  isCurrent
                    ? "border-[#7857E8] ring-2 ring-[#7857E8]/15 bg-gradient-to-r from-white to-[#F8F5FF]"
                    : passed
                    ? "border-[#E4E0E9] hover:border-[#7857E8] hover:shadow-xs"
                    : "border-[#ECE9F0] opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold ${
                      passed
                        ? "bg-[#287553] text-white"
                        : isCurrent
                        ? "bg-[#7857E8] text-white ring-2 ring-[#7857E8]/30"
                        : "bg-[#F3F1F4] text-[#626273]"
                    }`}
                  >
                    {passed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isCurrent ? (
                      <span className="text-[11px]">#{m.order}</span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-[#8E8B99]" />
                    )}
                  </div>

                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-[#141426] block truncate">
                        {m.title[lang]}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FFD184] text-[#553600] text-[9px] font-black uppercase tracking-wider shrink-0">
                          {lang === "ml" ? "അടുത്തത്" : "Up Next"}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#626273] font-medium block truncate mt-0.5">
                      {m.concept[lang]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {passed ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartReview(m, true);
                      }}
                      className="px-3 py-1.5 rounded-full bg-[#E3D4FF] hover:bg-[#D5C1FF] text-[#7857E8] text-[11px] font-black flex items-center gap-1 tactile border border-[#7857E8]/20 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{isRetained ? (lang === "ml" ? "റിവിഷൻ" : "Review") : t.masteryReady}</span>
                    </button>
                  ) : isCurrent ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartReview(m, false);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-[#191A22] hover:bg-black text-[#FFD184] text-[11px] font-black flex items-center gap-1 tactile shadow-xs transition-transform active:scale-95"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{lang === "ml" ? "തുടങ്ങുക" : "Start Step"}</span>
                      <ArrowRight className="w-3 h-3 text-white" />
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-[#F3F1F4] text-[#8E8B99] border-[#E4E0E9] flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>{t.masteryNotStarted}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
