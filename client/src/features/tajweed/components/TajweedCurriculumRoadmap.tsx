import React, { useState } from "react";
import {
  TAJWEED_CURRICULUMS,
  type TajweedCurriculumItem,
} from "../data/tajweedRoadmapData";
import {
  getTajweedCurriculumProgress,
  completeTajweedCurriculum,
} from "../progressRoadmap";
import { TajweedCurriculumModal } from "./TajweedCurriculumModal";
import {
  Lock,
  Play,
  Check,
  Award,
  Sparkles,
  Trophy,
} from "lucide-react";

interface TajweedCurriculumRoadmapProps {
  childId: string;
  lang: "ml" | "en";
  onAwardXp?: (amount: number, curriculumId: string) => void;
}

export const TajweedCurriculumRoadmap: React.FC<TajweedCurriculumRoadmapProps> = ({
  childId,
  lang,
  onAwardXp,
}) => {
  const [progressVersion, setProgressVersion] = useState(0);
  const progress = getTajweedCurriculumProgress(childId);

  const [selectedCurriculum, setSelectedCurriculum] =
    useState<TajweedCurriculumItem | null>(null);
  const [lockedAlertMessage, setLockedAlertMessage] = useState<string | null>(null);

  const completedCount = progress.completedIds.length;
  const totalCount = TAJWEED_CURRICULUMS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Alternating horizontal winding offsets matching JourneyMap / visual reference
  const offsetClasses = [
    "translate-x-0",
    "translate-x-7 sm:translate-x-10",
    "translate-x-0",
    "-translate-x-7 sm:-translate-x-10",
    "translate-x-0",
  ];

  const handleNodeClick = (curriculum: TajweedCurriculumItem) => {
    const isUnlocked = progress.unlockedIds.includes(curriculum.id);
    if (!isUnlocked) {
      setLockedAlertMessage(
        lang === "ml"
          ? `ഈ പാഠം അൺലോക്ക് ചെയ്യാൻ പാഠം ${curriculum.order - 1} പൂർത്തിയാക്കി ക്വിസ് പാസാവുക! 🗝️`
          : `Complete Level ${curriculum.order - 1} and pass its quiz to unlock this step! 🗝️`
      );
      setTimeout(() => setLockedAlertMessage(null), 3500);
      return;
    }
    setSelectedCurriculum(curriculum);
  };

  const handleQuizPassed = (curriculumId: string, xpEarned: number) => {
    const res = completeTajweedCurriculum(childId, curriculumId);
    setProgressVersion((v) => v + 1);
    const awarded = res.xpEarned > 0 ? res.xpEarned : xpEarned;
    if (awarded > 0 && onAwardXp) {
      onAwardXp(awarded, curriculumId);
    }
  };

  return (
    <div className="w-full space-y-4 pt-2">
      {/* Locked Alert Toast */}
      {lockedAlertMessage && (
        <div className="p-3.5 bg-[#FFF0D6] border-2 border-[#FFD184] text-[#B45309] rounded-2xl text-xs font-bold flex items-center justify-between shadow-md animate-pop">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0 text-[#D97706]" />
            <span>{lockedAlertMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setLockedAlertMessage(null)}
            className="text-xs hover:underline ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Card */}
      <div className="bg-white border-2 border-[#E4E0E9] rounded-[28px] p-5 shadow-2xs relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Soft Ambient Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#E3D4FF]/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7857E8] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#7857E8] bg-[#F0E9FF] px-2.5 py-0.5 rounded-full border border-[#E3D4FF]">
              {lang === "ml" ? "10 ഘട്ടങ്ങൾ" : "10 Levels Pathway"}
            </span>
          </div>

          <h3
            className="text-lg sm:text-xl font-black text-[#141426] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {lang === "ml" ? "തജ്‌വീദ് പാഠ്യപദ്ധതി റോഡ്മാപ്പ്" : "Tajweed Curriculum Roadmap"}
          </h3>

          <p className="text-xs text-[#626273] font-semibold mt-0.5 max-w-md leading-relaxed">
            {lang === "ml"
              ? "ഓരോ ഘട്ടവും പഠിച്ച് ക്വിസ് പാസായി അടുത്ത പാഠം അൺലോക്ക് ചെയ്യാം"
              : "Step-by-step path: learn the rule & pass the quiz to unlock the next level"}
          </p>
        </div>

        {/* Progress Capsule */}
        <div className="relative z-10 w-full sm:w-auto bg-[#F3F1F4] border border-[#E4E0E9] p-3 rounded-2xl flex flex-col items-start sm:items-end gap-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#E59700]" />
            <span className="text-xs font-black text-[#141426]">
              {completedCount} / {totalCount} {lang === "ml" ? "പൂർത്തിയായി" : "Completed"}
            </span>
          </div>

          <div className="w-full sm:w-36 h-2 bg-[#E4E0E9] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7857E8] to-[#10B981] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          VERTICAL WINDING ROADMAP PATH (Matching Attached Image UI)
         ======================================================== */}
      <div className="relative flex flex-col items-center py-6 px-4 bg-white/40 border border-[#E4E0E9]/60 rounded-[32px] overflow-hidden">
        {/* Central Dashed Vertical Connecting Line */}
        <div className="absolute top-12 bottom-36 w-0.5 border-r-2 border-dashed border-[#D1D5DB] z-0 pointer-events-none" />

        {/* 10 Curriculum Stepping Nodes */}
        <div className="w-full flex flex-col items-center space-y-6 relative z-10">
          {TAJWEED_CURRICULUMS.map((curriculum, index) => {
            const isUnlocked = progress.unlockedIds.includes(curriculum.id);
            const isCompleted = progress.completedIds.includes(curriculum.id);
            const isCurrent = isUnlocked && !isCompleted;
            const offsetClass = offsetClasses[index % offsetClasses.length];

            return (
              <div
                key={curriculum.id}
                className={`flex flex-col items-center relative transition-transform duration-300 ${offsetClass}`}
              >
                {/* Stepping Stone Circular Button */}
                <button
                  type="button"
                  onClick={() => handleNodeClick(curriculum)}
                  className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-200 tactile shadow-sm ${
                    isCompleted
                      ? "bg-[#7857E8] text-white border-4 border-white ring-4 ring-[#7857E8]/20 shadow-md"
                      : isCurrent
                      ? "bg-[#E3D4FF] text-[#141426] border-4 border-[#191A22] shadow-lg scale-105"
                      : "bg-[#F3F4F6] text-[#9CA3AF] border-2 border-[#E5E7EB] opacity-75"
                  }`}
                  aria-label={`${curriculum.englishTitle} — ${
                    isCompleted ? "Completed" : isCurrent ? "Active" : "Locked"
                  }`}
                >
                  {/* Icon Inside Circle */}
                  {isCompleted ? (
                    <>
                      <Check className="w-8 h-8 text-white stroke-[3]" />
                      <span className="text-[10px] font-black tracking-tight mt-0.5">
                        +{curriculum.xpReward} XP
                      </span>
                    </>
                  ) : isCurrent ? (
                    <>
                      <Play className="w-7 h-7 fill-[#141426] translate-x-0.5" />
                      <span className="text-[10px] font-black tracking-tight mt-0.5">
                        {lang === "ml" ? "തുടങ്ങാം" : "Start"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-6 h-6 text-[#9CA3AF]" />
                      <span className="text-[10px] font-bold text-[#9CA3AF] mt-0.5">
                        {lang === "ml" ? "ലോക്ക്" : "Locked"}
                      </span>
                    </>
                  )}

                  {/* Level Number Badge on Top-Right */}
                  <span
                    className={`absolute -top-1 -right-1 w-6 h-6 rounded-full font-black text-[11px] flex items-center justify-center border-2 border-white shadow-xs ${
                      isCompleted
                        ? "bg-[#287553] text-white"
                        : isCurrent
                        ? "bg-[#191A22] text-[#FFD184]"
                        : "bg-[#4B5563] text-white"
                    }`}
                  >
                    {curriculum.order}
                  </span>
                </button>

                {/* Pill Title Label Badge */}
                <div className="mt-2 text-center max-w-[200px]">
                  <span
                    onClick={() => handleNodeClick(curriculum)}
                    className={`text-xs font-bold block leading-tight px-3.5 py-1.5 rounded-full shadow-2xs border cursor-pointer tactile transition-all ${
                      isCurrent
                        ? "bg-[#191A22] text-white border-transparent shadow-xs"
                        : isCompleted
                        ? "bg-[#F0E9FF] text-[#7857E8] border-[#E3D4FF]"
                        : "bg-white text-[#141426] border-[#E4E0E9]"
                    }`}
                  >
                    {curriculum.englishTitle}
                  </span>

                  {/* Arabic Title & Details under pill */}
                  <div className="mt-0.5">
                    <span
                      dir="rtl"
                      className="text-xs font-serif font-bold text-[#626273] block leading-tight"
                      style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
                    >
                      {curriculum.arabicTitle}
                    </span>
                    <span className="text-[10px] text-[#626273]/80 font-medium block">
                      {isCompleted
                        ? lang === "ml"
                          ? "പരിശീലിച്ചു കഴിഞ്ഞു ✓"
                          : "Quiz Passed ✓"
                        : isCurrent
                        ? lang === "ml"
                          ? "ക്വിസ് എടുക്കൂ 🎯"
                          : "Take Quiz to Unlock 🎯"
                        : lang === "ml"
                        ? "5 മിനിറ്റ്"
                        : "5 min"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Final Chapter Reward Medallion Node (Matching Screenshot) */}
          <div className="flex flex-col items-center pt-6 text-center">
            {/* Golden Circle Medallion */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-b from-[#F3F0FF] to-[#E5DEFF] border-4 border-white shadow-md flex items-center justify-center relative mb-2 group-hover:scale-105 transition-transform">
              <div className="text-3xl filter drop-shadow-xs">
                🏅
              </div>
              {completedCount === totalCount && (
                <div className="absolute inset-0 rounded-full ring-4 ring-[#E59700] animate-pulse" />
              )}
            </div>

            <h4
              className="text-sm sm:text-base font-black text-[#141426] leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {lang === "ml"
                ? "തജ്‌വീദ് പാരായണ സാരഥി"
                : "Guardian of Tajweed Recitation"}
            </h4>

            <span className="text-[11px] font-semibold text-[#626273] mt-0.5 block">
              {lang === "ml"
                ? "10 ഘട്ടങ്ങളും പൂർത്തിയാക്കുമ്പോൾ ലഭിക്കുന്ന നേട്ടം"
                : "Awarded on completing all 10 Tajweed curriculums"}
            </span>
          </div>
        </div>
      </div>

      {/* Curriculum Modal for Learning and Quiz */}
      {selectedCurriculum && (
        <TajweedCurriculumModal
          curriculum={selectedCurriculum}
          isOpen={!!selectedCurriculum}
          isCompleted={progress.completedIds.includes(selectedCurriculum.id)}
          lang={lang}
          onClose={() => setSelectedCurriculum(null)}
          onQuizPassed={handleQuizPassed}
        />
      )}
    </div>
  );
};
