import React from "react";
import type { FatihahModuleData, FatihahProgressRecord } from "../types";
import { Illustration } from "@/components/common/Illustration";
import {
  BookOpen,
  CheckCircle,
  Play,
  Lock,
  ArrowRight,
  ArrowLeft,
  Shield,
  Sparkles,
  Info,
  Award,
} from "lucide-react";

interface FatihahOverviewProps {
  moduleData: FatihahModuleData;
  progress: FatihahProgressRecord;
  lang: "ml" | "en";
  onSelectVerse: (verseId: string) => void;
  onOpenFullReading: () => void;
  onBackToJourney: () => void;
}

export const FatihahOverview: React.FC<FatihahOverviewProps> = ({
  moduleData,
  progress,
  lang,
  onSelectVerse,
  onOpenFullReading,
  onBackToJourney,
}) => {
  // Count explored verses
  const exploredCount = Object.values(progress.verses).filter((v) => v.isExplored).length;
  const knowledgePassedCount = Object.values(progress.verses).filter((v) => v.knowledgeCheckPassed).length;
  const teacherReviewCount = Object.values(progress.verses).filter(
    (v) => v.recitationStatus === "awaiting_teacher_review" || v.recitationStatus === "reviewed_by_teacher"
  ).length;

  // Find next uncompleted verse to continue
  const nextVerseToContinue =
    moduleData.verses.find((v) => !progress.verses[v.id]?.isExplored) || moduleData.verses[0];

  return (
    <div className="w-full flex flex-col space-y-5 animate-pop pb-8">
      {/* Back to Journey / Madrasa Subjects Navigation */}
      <div>
        <button
          type="button"
          onClick={onBackToJourney}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#626273] hover:text-[#141426] px-3 py-1.5 rounded-full hover:bg-[#F3F1F4] tactile transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === "ml" ? "← മദ്‌റസ വിഷയങ്ങളിലേക്ക് മടങ്ങുക" : "← Back to Madrasa Subjects"}</span>
        </button>
      </div>

      {/* 1. Header Banner with Golden Lantern Companion & Lavender Card */}
      <div className="bg-[#E3D4FF] rounded-[32px] p-5 sm:p-6 shadow-2xs relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Soft Decorative Glow */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-sm text-center sm:text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#7857E8] bg-white/70 px-3 py-1 rounded-full inline-block mb-1.5 shadow-2xs">
            {lang === "ml" ? "ഖുർആൻ പഠനം • തജ്‌വീദ്" : "Quran Studies • Tajweed"}
          </span>

          <h1
            className="text-2xl sm:text-3xl font-black text-[#141426] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {moduleData.titles[lang]}
          </h1>

          <p className="text-xs text-[#141426]/75 font-medium mt-1 leading-relaxed">
            {moduleData.descriptions[lang]}
          </p>

          {/* Quick Metrics (Truthful counts, no fake percentages) */}
          <div className="flex items-center justify-center sm:justify-start gap-2 pt-3">
            <span className="text-[11px] font-black text-[#141426] bg-white/80 px-2.5 py-1 rounded-xl shadow-2xs">
              {exploredCount} / 7 {lang === "ml" ? "ആയത്തുകൾ പഠിച്ചു" : "Verses Explored"}
            </span>

            {knowledgePassedCount > 0 && (
              <span className="text-[11px] font-black text-[#287553] bg-white/80 px-2.5 py-1 rounded-xl shadow-2xs">
                {knowledgePassedCount} {lang === "ml" ? "പരിശോധനകൾ പാസായി" : "Checks Passed"}
              </span>
            )}
          </div>
        </div>

        {/* 3D Lantern Reading Companion */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 shrink-0 pointer-events-none relative flex items-center justify-center">
          <Illustration
            role="login"
            className="w-full h-full object-contain animate-float"
            alt="Lantern reading companion"
          />
        </div>
      </div>

      {/* 2. Primary Actions: Continue & Full Surah Reading */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Continue Action Button */}
        <button
          type="button"
          onClick={() => onSelectVerse(nextVerseToContinue.id)}
          className="h-14 bg-[#191A22] hover:bg-black text-white rounded-[22px] font-black text-sm flex items-center justify-center gap-2 shadow-md tactile transition-all"
        >
          <span>
            {lang === "ml"
              ? `പഠനം തുടരുക (ആയത്ത് ${nextVerseToContinue.number}) →`
              : `Continue (Verse ${nextVerseToContinue.number}) →`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Full Surah Reading View Button */}
        <button
          type="button"
          onClick={onOpenFullReading}
          className="h-14 bg-white hover:bg-[#F3F1F4] text-[#141426] border border-[#E4E0E9] rounded-[22px] font-black text-sm flex items-center justify-center gap-2 shadow-2xs tactile transition-all"
        >
          <BookOpen className="w-4 h-4 text-[#7857E8]" />
          <span>{lang === "ml" ? "മുഴുവൻ സൂറത്തും വായിക്കുക" : "Full Surah Reading View"}</span>
        </button>
      </div>

      {/* 3. Seven Verse-Based Mission Nodes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2
            className="text-base font-black text-[#141426]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {lang === "ml" ? "ആയത്ത് മിഷനുകൾ (7 ആയത്തുകൾ)" : "Verse Exploration Missions (7 Verses)"}
          </h2>
          <span className="text-xs font-bold text-[#626273]">
            {exploredCount} / 7
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {moduleData.verses.map((verse) => {
            const vProg = progress.verses[verse.id];
            const isExplored = Boolean(vProg?.isExplored);
            const isKnowledgePassed = Boolean(vProg?.knowledgeCheckPassed);
            const isTeacherReview = vProg?.recitationStatus === "awaiting_teacher_review";

            return (
              <div
                key={verse.id}
                onClick={() => onSelectVerse(verse.id)}
                className={`p-4 rounded-[24px] border-2 transition-all tactile cursor-pointer flex items-center justify-between gap-3 shadow-2xs ${
                  isExplored
                    ? "bg-white border-[#7857E8]/40 hover:border-[#7857E8]"
                    : "bg-white border-[#E4E0E9] hover:border-[#FFD184]"
                }`}
              >
                {/* Left: Verse Badge + Snippet */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 shadow-2xs ${
                      isExplored
                        ? "bg-[#7857E8] text-white"
                        : "bg-[#F3F1F4] text-[#141426]"
                    }`}
                  >
                    <span>{verse.number}</span>
                  </div>

                  <div className="min-w-0">
                    <span className="text-xs font-black text-[#141426] block truncate">
                      {lang === "ml" ? `ആയത്ത് ${verse.number}` : `Verse ${verse.number}`}
                    </span>
                    <span
                      dir="rtl"
                      className="text-sm font-serif text-[#626273] truncate block mt-0.5"
                      style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
                    >
                      {verse.textUthmani}
                    </span>
                  </div>
                </div>

                {/* Right: Status Badges */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {isExplored && (
                    <span className="text-[10px] font-black text-[#287553] bg-[#287553]/10 px-2 py-0.5 rounded-full border border-[#287553]/20">
                      Explored
                    </span>
                  )}
                  {isKnowledgePassed && (
                    <span className="text-[10px] font-black text-[#7857E8] bg-[#F0E9FF] px-2 py-0.5 rounded-full border border-[#E3D4FF]">
                      Quiz
                    </span>
                  )}
                  {isTeacherReview && (
                    <span className="text-[10px] font-black text-[#E59700] bg-[#FFF0D6] px-2 py-0.5 rounded-full border border-[#FFD184]">
                      Review
                    </span>
                  )}
                  <div className="w-8 h-8 rounded-full bg-[#F3F1F4] flex items-center justify-center text-[#141426]">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Concise Explanation of the 3 Learning Modes */}
      <div className="bg-[#FFF8EE] border border-[#FFD184] rounded-[26px] p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#E59700]" />
          <h3 className="text-xs font-black text-[#141426] uppercase tracking-wider">
            {lang === "ml" ? "മൂന്ന് തരം പുരോഗതികൾ" : "Three Kinds of Progress"}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
          {/* Mode 1 */}
          <div className="bg-white rounded-2xl p-3 border border-[#FFD184]/50 space-y-1">
            <span className="text-xs font-black text-[#287553] block">
              1. {lang === "ml" ? "വായന പങ്കാളിത്തം" : "Verse Explored"}
            </span>
            <p className="text-[11px] text-[#626273] font-medium leading-relaxed">
              {lang === "ml"
                ? "ഓരോ ആയത്തും ശ്രദ്ധയോടെ വായിക്കുകയും പഠിക്കുകയും ചെയ്യുമ്പോൾ ലഭിക്കുന്നത്."
                : "Earned by reading and studying the verified verse."}
            </p>
          </div>

          {/* Mode 2 */}
          <div className="bg-white rounded-2xl p-3 border border-[#FFD184]/50 space-y-1">
            <span className="text-xs font-black text-[#7857E8] block">
              2. {lang === "ml" ? "അറിവ് പരിശോധന" : "Knowledge Check"}
            </span>
            <p className="text-[11px] text-[#626273] font-medium leading-relaxed">
              {lang === "ml"
                ? "തജ്‌വീദ് അടയാളങ്ങളും നിയമങ്ങളും കൃത്യമായി തിരിച്ചറിയുമ്പോൾ ലഭിക്കുന്നത്."
                : "Earned by identifying rules such as shaddah."}
            </p>
          </div>

          {/* Mode 3 */}
          <div className="bg-white rounded-2xl p-3 border border-[#FFD184]/50 space-y-1">
            <span className="text-xs font-black text-[#E59700] block">
              3. {lang === "ml" ? "അധ്യാപക പരിശോധന" : "Teacher Assessment"}
            </span>
            <p className="text-[11px] text-[#626273] font-medium leading-relaxed">
              {lang === "ml"
                ? "ശരിയായ ഉച്ചാരണവും പാരായണവും അധ്യാപകൻ വിലയിരുത്തുമ്പോൾ മാത്രം ലഭിക്കുന്നത്."
                : "Assessed by a teacher. Automated tools cannot grade recitation."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
