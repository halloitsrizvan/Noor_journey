import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { StudentAppShell } from "@/components/layout/StudentAppShell";
import { useNoor } from "@/lib/noor/state";
import fatihahModuleData from "@/features/tajweed/data/al-fatihah.json";
import type { FatihahModuleData } from "@/features/tajweed/types";
import { getFatihahProgress } from "@/features/tajweed/progress";
import { FatihahOverview } from "@/features/tajweed/components/FatihahOverview";
import { FatihahMissionPlayer } from "@/features/tajweed/components/FatihahMissionPlayer";
import { FullSurahReader } from "@/features/tajweed/components/FullSurahReader";
import { TajweedCurriculumRoadmap } from "@/features/tajweed/components/TajweedCurriculumRoadmap";
import { Illustration } from "@/components/common/Illustration";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Play,
} from "lucide-react";
import { sfx } from "@/lib/sound/sfx";

export const Route = createFileRoute("/tajweed")({
  component: TajweedRoute,
});

function TajweedRoute() {
  const navigate = useNavigate();
  const { lang, activeProfile, awardXp } = useNoor();

  const childId = activeProfile?.id || "default-child";
  const moduleData = fatihahModuleData as FatihahModuleData;

  // View Mode: "roadmap" (default hub) | "fatihah-journey" (7 verse missions) | "mission-player" | "full-reading"
  const [viewMode, setViewMode] = useState<
    "roadmap" | "fatihah-journey" | "mission-player" | "full-reading"
  >("roadmap");
  const [activeVerseId, setActiveVerseId] = useState<string>("fatihah-1");

  // Re-read progress
  const [progressVersion, setProgressVersion] = useState(0);
  const progress = getFatihahProgress(childId);

  const exploredCount = Object.values(progress.verses).filter((v) => v.isExplored).length;
  const knowledgePassedCount = Object.values(progress.verses).filter(
    (v) => v.knowledgeCheckPassed
  ).length;

  const nextVerseToContinue =
    moduleData.verses.find((v) => !progress.verses[v.id]?.isExplored) ||
    moduleData.verses[0];

  const activeVerse =
    moduleData.verses.find((v) => v.id === activeVerseId) || moduleData.verses[0];

  const handleOpenVerse = (verseId: string) => {
    setActiveVerseId(verseId);
    setViewMode("mission-player");
  };

  const handleFinishVerse = () => {
    setProgressVersion((v) => v + 1);
    setViewMode("fatihah-journey");
  };

  return (
    <StudentAppShell currentTab="journey">
      {/* ========================================================
          MODE 1: TAJWEED MAIN HUB (Al-Fatihah + 10 Curriculum Roadmap)
         ======================================================== */}
      {viewMode === "roadmap" && (
        <div className="w-full flex flex-col space-y-5 animate-pop pb-8">
          {/* Top Navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                sfx.click();
                navigate({ to: "/journey" });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#626273] hover:text-[#141426] px-3 py-1.5 rounded-full hover:bg-[#F3F1F4] tactile transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>
                {lang === "ml"
                  ? "← മദ്‌റസ വിഷയങ്ങളിലേക്ക് മടങ്ങുക"
                  : "Back to Madrasa Subjects"}
              </span>
            </button>

            <span className="text-[11px] font-black text-[#7857E8] bg-[#F0E9FF] border border-[#E3D4FF] px-3 py-1 rounded-full shadow-2xs">
              {lang === "ml" ? "ഖുർആൻ പഠനം • തജ്‌വീദ്" : "Quran Studies • Tajweed"}
            </span>
          </div>

          {/* 1. Al-Fatihah Featured Card with direct navigation to Fatihah Journey */}
          <div className="bg-[#E3D4FF] rounded-[32px] p-5 sm:p-6 shadow-2xs relative overflow-hidden flex flex-col justify-between gap-4 border border-[#CBB5FF]">
            {/* Soft Decorative Ambient Glow */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/40 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div className="max-w-md text-center sm:text-left space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#7857E8] bg-white/80 px-3 py-1 rounded-full inline-block shadow-2xs">
                  {lang === "ml" ? "സവിശേഷ പാഠം • സൂറത്തുൽ ഫാതിഹ" : "Featured Foundation • Surah Al-Fatihah"}
                </span>

                <h1
                  className="text-2xl sm:text-3xl font-black text-[#141426] leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {moduleData.titles[lang]}
                </h1>

                <p className="text-xs text-[#141426]/80 font-medium leading-relaxed">
                  {lang === "ml"
                    ? "7 ആയത്തുകൾ ഓരോന്നായി പഠിക്കാം: പദ വിശകലനം, തജ്‌വീദ് നിയമങ്ങൾ, ഓത്ത് കേൾക്കലും പരിശീലനവും."
                    : "7 verses step-by-step: word analysis, Tajweed rules, audio check, and practice."}
                </p>

                {/* Progress Indicators */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1.5">
                  <span className="text-[11px] font-black text-[#141426] bg-white/90 px-3 py-1 rounded-xl shadow-2xs">
                    {exploredCount} / 7 {lang === "ml" ? "ആയത്തുകൾ പഠിച്ചു" : "Verses Explored"}
                  </span>

                  {knowledgePassedCount > 0 && (
                    <span className="text-[11px] font-black text-[#287553] bg-white/90 px-3 py-1 rounded-xl shadow-2xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#287553]" />
                      <span>{knowledgePassedCount} {lang === "ml" ? "പരിശോധനകൾ പാസായി" : "Checks Passed"}</span>
                    </span>
                  )}
                </div>

                {/* 7 Verses Progress Dots */}
                <div className="flex items-center gap-1.5 pt-2 max-w-xs mx-auto sm:mx-0">
                  {moduleData.verses.map((verse, idx) => {
                    const isExplored = progress.verses[verse.id]?.isExplored;
                    const isPassed = progress.verses[verse.id]?.knowledgeCheckPassed;
                    return (
                      <div
                        key={verse.id}
                        className={`flex-1 h-2 rounded-full transition-all ${isPassed
                            ? "bg-[#287553]"
                            : isExplored
                              ? "bg-[#7857E8]"
                              : "bg-white/60"
                          }`}
                        title={`Verse ${idx + 1}: ${isPassed ? "Mastered" : isExplored ? "Explored" : "Not yet explored"
                          }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* 3D Reading Companion Illustration */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 pointer-events-none relative flex items-center justify-center">
                <Illustration
                  role="login"
                  className="w-full h-full object-contain animate-float"
                  alt="Lantern reading companion"
                />
              </div>
            </div>

            {/* Navigation Actions for Al-Fatihah */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 relative z-10">
              <button
                type="button"
                onClick={() => setViewMode("fatihah-journey")}
                className="h-13 bg-[#191A22] hover:bg-black text-[#FFD184] hover:text-white rounded-[20px] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md tactile transition-all"
              >
                <Play className="w-4 h-4 fill-current text-[#FFD184]" />
                <span>
                  {lang === "ml"
                    ? `ഫാതിഹ യാത്ര ആരംഭിക്കുക (ആയത്ത് ${nextVerseToContinue.number}) →`
                    : `Open Fatihah Journey (Verse ${nextVerseToContinue.number}) →`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setViewMode("full-reading")}
                className="h-13 bg-white/90 hover:bg-white text-[#141426] border border-[#CBB5FF] rounded-[20px] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs tactile transition-all"
              >
                <BookOpen className="w-4 h-4 text-[#7857E8]" />
                <span>
                  {lang === "ml" ? "മുഴുവൻ സൂറത്തും വായിക്കുക" : "Full Surah Reading View"}
                </span>
              </button>
            </div>
          </div>

          {/* 2. Tajweed Roadmap Curriculums Section (10 Interactive Levels with Quizzes) */}
          <TajweedCurriculumRoadmap
            childId={childId}
            lang={lang}
            onAwardXp={(amount, currId) => {
              awardXp(amount, "tajweed", `tajweed-quiz-${childId}-${currId}`);
            }}
          />
        </div>
      )}

      {/* ========================================================
          MODE 2: FATIHAH JOURNEY (7 Verse Exploration Missions)
         ======================================================== */}
      {viewMode === "fatihah-journey" && (
        <FatihahOverview
          moduleData={moduleData}
          progress={progress}
          lang={lang}
          onSelectVerse={handleOpenVerse}
          onOpenFullReading={() => setViewMode("full-reading")}
          onBackToJourney={() => setViewMode("roadmap")}
        />
      )}

      {/* ========================================================
          MODE 3: VERSE MISSION PLAYER
         ======================================================== */}
      {viewMode === "mission-player" && (
        <FatihahMissionPlayer
          verse={activeVerse}
          childId={childId}
          lang={lang}
          draftActivities={moduleData.draftKnowledgeActivities}
          onFinishVerse={handleFinishVerse}
          onBackToOverview={() => {
            setProgressVersion((v) => v + 1);
            setViewMode("fatihah-journey");
          }}
        />
      )}

      {/* ========================================================
          MODE 4: FULL SURAH READING VIEW
         ======================================================== */}
      {viewMode === "full-reading" && (
        <FullSurahReader
          verses={moduleData.verses}
          lang={lang}
          onBack={() => setViewMode("roadmap")}
          onSelectVerse={handleOpenVerse}
        />
      )}
    </StudentAppShell>
  );
}
