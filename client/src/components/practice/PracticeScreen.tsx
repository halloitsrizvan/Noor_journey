import React from "react";
import type { Mission } from "@/lib/noor/types";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { akhlaqMissions } from "@/content/chapter-akhlaq";
import { LanternMascot } from "../mascot/LanternMascot";
import { BookOpen, CheckCircle, Clock, Play, RotateCcw, Sparkles } from "lucide-react";

interface PracticeScreenProps {
  onStartReview: (mission: Mission) => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({ onStartReview }) => {
  const { lang, activeProgress, getDueReviews, effectiveNow } = useNoor();
  const t = translations[lang];
  const dueReviews = getDueReviews();

  return (
    <div className="flex flex-col w-full p-4 space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sand/80 to-card border border-border/80 rounded-3xl p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-base font-black text-foreground">{t.practiceTitle}</h2>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t.practiceDesc}
        </p>
      </div>

      {/* Due Reviews Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-coral" />
            {t.dueRevisions}
          </span>
          {dueReviews.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-coral-soft text-coral-deep text-[11px] font-extrabold">
              {dueReviews.length} {t.revisionsDueCount}
            </span>
          )}
        </div>

        {dueReviews.length === 0 ? (
          <div className="bg-card border-2 border-border/80 rounded-3xl p-6 text-center shadow-xs flex flex-col items-center">
            <LanternMascot mood="happy" size="md" className="mb-2" />
            <h4 className="text-sm font-extrabold text-foreground mb-1">
              {t.noRevisionsDue}
            </h4>
            <p className="text-xs text-muted-foreground max-w-[240px]">
              {lang === "ml"
                ? "പഠിച്ച കാര്യങ്ങൾ കൃത്യമായ ഇടവേളകളിൽ ഓർത്തെടുക്കാൻ ഇവിടെ കാണിക്കും."
                : "Scheduled reviews will appear here at 1, 3, and 7-day intervals."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {dueReviews.map(({ missionId, review }) => {
              const mission = akhlaqMissions.find((m) => m.id === missionId);
              if (!mission) return null;
              return (
                <div
                  key={missionId}
                  className="bg-card border-2 border-coral/30 rounded-2xl p-3 shadow-xs flex items-center justify-between gap-3 animate-rise"
                >
                  <div>
                    <span className="text-[10px] font-bold text-coral-deep uppercase tracking-wider block">
                      {lang === "ml" ? `സ്റ്റേജ് ${review.stage + 1} റിവിഷൻ` : `Stage ${review.stage + 1} Review`}
                    </span>
                    <h4 className="text-xs font-extrabold text-foreground leading-snug">
                      {mission.title[lang]}
                    </h4>
                    <span className="text-[10px] text-muted-foreground">
                      {mission.concept[lang]}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onStartReview(mission)}
                    className="px-3.5 py-2 rounded-xl bg-coral hover:bg-coral-deep text-white text-xs font-extrabold flex items-center gap-1.5 tactile shadow-xs shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{t.start} (+5 XP)</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Concept Mastery States */}
      <div>
        <span className="text-xs font-black text-foreground uppercase tracking-wider block mb-2">
          {lang === "ml" ? "ആശയങ്ങളുടെ ഉറപ്പ് (Mastery)" : "Concept Mastery Track"}
        </span>

        <div className="space-y-2">
          {akhlaqMissions.map((mission) => {
            const isPassed = !!activeProgress?.missions[mission.id]?.passedAt;
            const review = activeProgress?.reviews[mission.id];

            let badgeText = t.masteryNotStarted;
            let badgeClass = "bg-muted text-muted-foreground";

            if (review?.retained) {
              badgeText = t.masteryRetained;
              badgeClass = "bg-leaf-soft text-leaf-deep font-black border border-leaf/30";
            } else if (review && review.dueAt <= effectiveNow) {
              badgeText = t.masteryReady;
              badgeClass = "bg-coral-soft text-coral-deep font-bold border border-coral/30";
            } else if (isPassed) {
              badgeText = t.masteryLearning;
              badgeClass = "bg-sky-soft text-sky-deep font-bold border border-sky/30";
            }

            return (
              <div
                key={mission.id}
                className="bg-card border border-border/80 rounded-2xl p-3 shadow-2xs flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                      isPassed ? "bg-leaf text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {mission.order}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-foreground leading-tight">
                      {mission.title[lang]}
                    </h5>
                    <span className="text-[10px] text-muted-foreground">
                      {mission.concept[lang]}
                    </span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] ${badgeClass}`}>
                  {badgeText}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
