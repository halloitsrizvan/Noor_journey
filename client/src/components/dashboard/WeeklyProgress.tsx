import React, { useState, useEffect } from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { Check } from "lucide-react";
import {
  getCompletedSubjectRoadmaps,
  type SubjectRoadmapStatus,
} from "@/lib/noor/curriculumRoadmap";

interface SubjectSession {
  idx: number;
  key: "tajweed" | "aqeedah" | "fiqh" | "lisanul-quran" | "akhlaq";
  en: string;
  ml: string;
  icon: string;
}

const MADRASA_SESSIONS: SubjectSession[] = [
  { idx: 1, key: "tajweed", en: "Tajweed", ml: "തജ്‌വീദ്", icon: "🎙️" },
  { idx: 2, key: "aqeedah", en: "Aqeedah", ml: "അഖീദ", icon: "🌙" },
  { idx: 3, key: "fiqh", en: "Fiqh", ml: "ഫിഖ്ഹ്", icon: "💧" },
  { idx: 4, key: "lisanul-quran", en: "Lisanul Quran", ml: "ലിസാൻ", icon: "📖" },
  { idx: 5, key: "akhlaq", en: "Akhlaq", ml: "അഖ്‌ലാഖ്", icon: "💛" },
];

export const WeeklyProgress: React.FC = () => {
  const { lang, activeProfile, activeProgress } = useNoor();
  const t = translations[lang];

  const childId = activeProfile?.id || "default";
  const [roadmapStatus, setRoadmapStatus] = useState<SubjectRoadmapStatus>(() =>
    getCompletedSubjectRoadmaps(childId, activeProgress)
  );

  useEffect(() => {
    const refreshStatus = () => {
      setRoadmapStatus(getCompletedSubjectRoadmaps(childId, activeProgress));
    };
    refreshStatus();
    window.addEventListener("noor-curriculum-roadmap-updated", refreshStatus);
    window.addEventListener("storage", refreshStatus);
    return () => {
      window.removeEventListener("noor-curriculum-roadmap-updated", refreshStatus);
      window.removeEventListener("storage", refreshStatus);
    };
  }, [childId, activeProgress]);

  // Session is completed ONLY after that subject's Curriculum Roadmap is completed
  const totalSessions = 5;
  const completedSessions = MADRASA_SESSIONS.filter(
    (s) => !!roadmapStatus[s.key]
  ).length;

  return (
    <section aria-label={t.yourProgress} className="w-full">
      {/* Header with Title and Text Summary */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7857E8]" />
          <h3
            className="text-lg sm:text-xl font-black text-[#141426] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.yourProgress}
          </h3>
        </div>
        <span className="text-xs font-black text-[#7857E8] bg-[#F0E9FF] border border-[#E3D4FF] px-2.5 py-1 rounded-full shadow-2xs">
          {completedSessions} / {totalSessions} {t.sessionsCompletedSuffix}
        </span>
      </div>

      {/* Progress Card */}
      <div className="bg-[#F8F7FA] border-2 border-[#E4E0E9]/80 rounded-[28px] p-4 sm:p-5 shadow-2xs">
        <div className="relative flex items-center justify-between px-2 sm:px-4">
          {/* Connecting Dotted Line */}
          <div className="absolute left-6 right-6 top-4 sm:top-5 -translate-y-1/2 border-t-2 border-dashed border-[#D5D0DB] z-0" />

          {MADRASA_SESSIONS.map((session) => {
            const isCompleted = !!roadmapStatus[session.key];
            const isCurrent = !isCompleted && !MADRASA_SESSIONS.slice(0, session.idx - 1).some((s) => !roadmapStatus[s.key]);

            return (
              <div
                key={session.idx}
                className="relative z-10 flex flex-col items-center gap-1.5 text-center group"
              >
                {/* Marker Circle */}
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-[#7857E8] text-white shadow-xs scale-105"
                      : isCurrent
                      ? "bg-white border-2 border-[#7857E8] text-[#7857E8] shadow-xs"
                      : "bg-[#EAE7EE] text-[#626273]"
                  }`}
                  aria-label={`${t.sessionWord} ${session.idx} (${lang === "ml" ? session.ml : session.en}): ${
                    isCompleted ? t.completed : t.available
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                  ) : (
                    <span className="text-sm sm:text-base filter drop-shadow-2xs">
                      {session.icon}
                    </span>
                  )}
                </div>

                {/* Session Label & Subject Title */}
                <div className="flex flex-col items-center leading-tight">
                  <span className="text-[10px] sm:text-xs font-black text-[#141426]">
                    {t.sessionWord} {session.idx}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#7857E8] truncate max-w-[55px] sm:max-w-none mt-0.5">
                    {lang === "ml" ? session.ml : session.en}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
