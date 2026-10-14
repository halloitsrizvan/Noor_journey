import React from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { Check } from "lucide-react";

export const WeeklyProgress: React.FC = () => {
  const { lang, activeProfile, getWeeklyProgressCount } = useNoor();
  const t = translations[lang];

  const totalSessions = activeProfile?.weeklyGoal || 3;
  const completedSessions = Math.min(getWeeklyProgressCount(), totalSessions);

  const sessionIndices = Array.from({ length: totalSessions }, (_, i) => i + 1);

  return (
    <section aria-label={t.yourProgress} className="w-full">
      {/* Header with Title and Text Summary */}
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-lg font-black text-[#141426]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t.yourProgress}
        </h3>
        <span className="text-xs font-semibold text-[#626273]">
          {completedSessions} / {totalSessions} {t.sessionsCompletedSuffix}
        </span>
      </div>

      {/* Progress Card */}
      <div className="bg-[#F3F1F4]/70 border border-[#E4E0E9]/70 rounded-[24px] p-4">
        <div className="relative flex items-center justify-between px-3">
          {/* Connecting Dotted Line */}
          <div className="absolute left-6 right-6 top-4 -translate-y-1/2 border-t-2 border-dashed border-[#E4E0E9] z-0" />

          {sessionIndices.map((idx) => {
            const isCompleted = idx <= completedSessions;

            return (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center gap-1.5"
              >
                {/* Marker Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-[#7857E8] text-white shadow-xs"
                      : "bg-[#E4E0E9] text-transparent"
                  }`}
                  aria-label={`${t.sessionWord} ${idx}: ${isCompleted ? t.completed : t.available}`}
                >
                  {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                </div>

                {/* Session Label */}
                <span className="text-[11px] font-bold text-[#626273]">
                  {t.sessionWord} {idx}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
