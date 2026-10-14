import React from "react";
import type { Mission } from "@/lib/noor/types";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { akhlaqMissions } from "@/content/chapter-akhlaq";
import { CheckCircle2, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Illustration } from "@/components/common/Illustration";

interface PracticeScreenProps {
  onStartReview: (mission: Mission) => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({ onStartReview }) => {
  const { lang, activeProgress, getDueReviews } = useNoor();
  const t = translations[lang];
  const dueReviews = getDueReviews();

  return (
    <div className="flex flex-col w-full space-y-5 animate-pop pb-6">
      {/* Sky-blue Feature Header with 3D Pencil Illustration */}
      <div className="bg-[#BEDAFF] rounded-[28px] p-5 shadow-2xs relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10 max-w-[65%]">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#141426]/70 block mb-1">
            {lang === "ml" ? "ഓർമ്മപ്പെടുത്തൽ" : "Spaced Retention"}
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

      {/* Due Reviews Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-base font-black text-[#141426] flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <Clock className="w-4 h-4 text-[#7857E8]" />
            <span>{t.dueRevisions}</span>
          </h2>
          {dueReviews.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-[#E3D4FF] text-[#7857E8] text-xs font-black">
              {dueReviews.length} {t.revisionsDueCount}
            </span>
          )}
        </div>

        {dueReviews.length === 0 ? (
          <div className="bg-white border border-[#E4E0E9] rounded-[26px] p-6 text-center shadow-2xs flex flex-col items-center">
            <div className="w-24 h-24 mb-2 pointer-events-none">
              <Illustration
                role="mission-reading"
                className="w-full h-full object-contain"
                alt="Noor reading comfortably"
              />
            </div>
            <h3
              className="text-base font-black text-[#141426] mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.noRevisionsDue}
            </h3>
            <p className="text-xs text-[#626273] max-w-[260px] leading-relaxed">
              {lang === "ml"
                ? "പഠിച്ച മിഷനുകൾ 1, 3, 7 ദിവസത്തെ ഇടവേളകളിൽ ഇവിടെ റിവിഷനായി എത്തും."
                : "Completed missions schedule for review at 1, 3, and 7-day spaced intervals."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dueReviews.map(({ missionId, review }) => {
              const mission = akhlaqMissions.find((m) => m.id === missionId);
              if (!mission) return null;
              return (
                <div
                  key={missionId}
                  className="bg-white border border-[#E4E0E9] rounded-[24px] p-4 shadow-2xs flex items-center justify-between gap-3 hover:border-[#7857E8] transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black text-[#7857E8] uppercase tracking-wider block">
                      {lang === "ml"
                        ? `സ്റ്റേജ് ${review.stage + 1} റിവിഷൻ`
                        : `Stage ${review.stage + 1} Review`}
                    </span>
                    <h3
                      className="text-sm font-black text-[#141426] truncate"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {mission.title[lang]}
                    </h3>
                    <span className="text-xs text-[#626273] font-medium block truncate">
                      {mission.concept[lang]}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onStartReview(mission)}
                    className="px-4 py-2.5 rounded-full bg-[#191A22] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 tactile shadow-xs shrink-0"
                  >
                    <span>{t.start}</span>
                    <span className="text-[#FFD184] text-[11px] font-black">+5 XP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Concept Mastery States */}
      <div>
        <h2
          className="text-base font-black text-[#141426] mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {lang === "ml" ? "ആശയങ്ങളുടെ ഉറപ്പ് (Mastery)" : "Concept Mastery Track"}
        </h2>

        <div className="space-y-2">
          {akhlaqMissions.map((m) => {
            const passed = !!activeProgress?.missions[m.id]?.passedAt;
            const review = activeProgress?.reviews[m.id];
            const isRetained = review?.isRetained;

            const badgeColor = isRetained
              ? "bg-[#287553]/15 text-[#287553] border-[#287553]/30"
              : passed
              ? "bg-[#E3D4FF] text-[#7857E8] border-[#7857E8]/30"
              : "bg-[#F3F1F4] text-[#626273] border-[#E4E0E9]";

            const statusText = isRetained
              ? t.masteryRetained
              : passed
              ? t.masteryReady
              : t.masteryNotStarted;

            return (
              <div
                key={m.id}
                className="bg-white border border-[#E4E0E9] rounded-[20px] p-3 shadow-2xs flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      passed ? "bg-[#7857E8] text-white" : "bg-[#F3F1F4] text-[#626273]"
                    }`}
                  >
                    {passed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-[10px] font-bold">#{m.order}</span>
                    )}
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-bold text-[#141426] block truncate">
                      {m.title[lang]}
                    </span>
                    <span className="text-[10px] text-[#626273] block truncate">
                      {m.concept[lang]}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold border shrink-0 ${badgeColor}`}
                >
                  {statusText}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
