import React, { useState } from "react";
import type { FatihahVerse, DraftKnowledgeActivity } from "../types";
import { useNoor } from "@/lib/noor/state";
import { VerseReader } from "./VerseReader";
import { VerseAudioPlayer } from "./VerseAudioPlayer";
import { LocalPracticeRecorder } from "./LocalPracticeRecorder";
import { TajweedActivityRenderer } from "./TajweedActivityRenderer";
import {
  markVerseExplored,
  markKnowledgePassed,
  submitRecitationForTeacherReview,
  markPracticeRecordingSaved,
} from "../progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Award,
  Send,
  Shield,
  HelpCircle,
} from "lucide-react";

interface FatihahMissionPlayerProps {
  verse: FatihahVerse;
  childId: string;
  lang: "ml" | "en";
  draftActivities: DraftKnowledgeActivity[];
  onFinishVerse: () => void;
  onBackToOverview: () => void;
}

export const FatihahMissionPlayer: React.FC<FatihahMissionPlayerProps> = ({
  verse,
  childId,
  lang,
  draftActivities,
  onFinishVerse,
  onBackToOverview,
}) => {
  const { awardXp } = useNoor();

  // Steps:
  // 0: See Verse (Read)
  // 1: Listen (if audio exists / truthful state)
  // 2: Knowledge Activity (if available for this verse)
  // 3: Record & Listen Back (optional local practice)
  // 4: Completion Summary
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);

  // Status for this session
  const [knowledgeDone, setKnowledgeDone] = useState(false);
  const [recordingDone, setRecordingDone] = useState(false);
  const [submittedForReview, setSubmittedForReview] = useState(false);
  const [xpToast, setXpToast] = useState<{ amount: number; message: string } | null>(null);

  // Check if there is an activity for this verse
  const matchingActivity = draftActivities.find((a) => a.verseId === verse.id);

  const handleNextStep = () => {
    // When finishing Step 0 (Read), mark verse explored in storage and award XP
    if (currentStep === 0) {
      markVerseExplored(childId, verse.id);
      const earned = awardXp(10, "fatihah", `fatihah-read-${childId}-${verse.id}`);
      if (earned > 0) {
        setXpToast({
          amount: earned,
          message: lang === "ml" ? "ആയത്ത് വായിച്ചു പഠിച്ചു! 🌟" : "Verse read & explored! 🌟",
        });
        setTimeout(() => setXpToast(null), 3000);
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleKnowledgePassed = () => {
    setKnowledgeDone(true);
    markKnowledgePassed(childId, verse.id);
    const earned = awardXp(15, "quiz", `fatihah-quiz-${childId}-${verse.id}`);
    if (earned > 0) {
      setXpToast({
        amount: earned,
        message: lang === "ml" ? "ക്വിസ് പാസായി! 🌟" : "Knowledge Check Mastered! 🌟",
      });
      setTimeout(() => setXpToast(null), 3000);
    }
  };

  const handleRecordingSaved = () => {
    setRecordingDone(true);
    markPracticeRecordingSaved(childId, verse.id);
    const earned = awardXp(10, "activity", `fatihah-audio-${childId}-${verse.id}`);
    if (earned > 0) {
      setXpToast({
        amount: earned,
        message: lang === "ml" ? "ഓത്ത് റെക്കോർഡ് ചെയ്തു! 🌟" : "Recitation recorded! 🌟",
      });
      setTimeout(() => setXpToast(null), 3000);
    }
  };

  const handleSubmitForTeacherReview = () => {
    submitRecitationForTeacherReview(childId, verse.id);
    setSubmittedForReview(true);
  };

  return (
    <div className="w-full flex flex-col space-y-4 animate-pop pb-8">
      {/* Real-time XP Celebration Toast */}
      {xpToast && (
        <div className="p-3 bg-[#FFF0D6] border-2 border-[#FFD184] text-[#B45309] rounded-2xl text-xs font-black flex items-center justify-between shadow-md animate-pop">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E59700]" />
            <span>+{xpToast.amount} XP • {xpToast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setXpToast(null)}
            className="text-xs hover:underline ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Bar: Back to Overview & Progress Indicator */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToOverview}
          className="inline-flex items-center gap-1.5 text-xs font-black text-[#626273] hover:text-[#141426] tactile transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === "ml" ? "ഫാതിഹ മെനു" : "Al-Fatihah Menu"}</span>
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((stepIdx) => (
            <span
              key={stepIdx}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentStep === stepIdx
                  ? "w-6 bg-[#7857E8]"
                  : stepIdx < currentStep
                  ? "w-2 bg-[#287553]"
                  : "w-2 bg-[#E4E0E9]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* STEP 0: READ THE VERSE */}
      {currentStep === 0 && (
        <div className="space-y-4">
          <VerseReader
            verse={verse}
            lang={lang}
            selectedWordIndex={selectedWordIndex}
            onSelectWord={(idx) => setSelectedWordIndex(idx)}
          />

          <button
            type="button"
            onClick={handleNextStep}
            className="w-full h-14 bg-[#191A22] hover:bg-black text-white rounded-full font-black text-sm flex items-center justify-center gap-2 shadow-md tactile transition-all"
          >
            <span>{lang === "ml" ? "ഓതി നോക്കി, അടുത്തതിലേക്ക് →" : "Read & Continue →"}</span>
          </button>
        </div>
      )}

      {/* STEP 1: LISTEN */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <VerseReader verse={verse} lang={lang} />

          <VerseAudioPlayer
            audioUrl={verse.audioUrl}
            lang={lang}
            verseNumber={verse.number}
          />

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(0)}
              className="flex-1 h-12 bg-white border border-[#E4E0E9] hover:bg-[#F3F1F4] text-[#141426] rounded-full font-bold text-xs tactile"
            >
              ← {lang === "ml" ? "തിരികെ" : "Back"}
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="flex-2 h-12 bg-[#191A22] hover:bg-black text-white rounded-full font-black text-xs flex items-center justify-center gap-1.5 shadow-md tactile"
            >
              <span>{lang === "ml" ? "അടുത്ത ഘട്ടത്തിലേക്ക് →" : "Next Step →"}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: KNOWLEDGE ACTIVITY */}
      {currentStep === 2 && (
        <div className="space-y-4">
          {matchingActivity ? (
            <TajweedActivityRenderer
              activity={matchingActivity}
              verse={verse}
              lang={lang}
              onPassed={handleKnowledgePassed}
            />
          ) : (
            <div className="bg-white border border-[#E4E0E9] rounded-[24px] p-6 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-[#7857E8] mx-auto" />
              <h3 className="text-sm font-black text-[#141426]">
                {lang === "ml" ? "ഈ ആയത്തിൽ വ്യാകരണ ചോദ്യങ്ങളില്ല" : "No Knowledge Activity For This Verse"}
              </h3>
              <p className="text-xs text-[#626273] max-w-xs mx-auto leading-relaxed">
                {lang === "ml"
                  ? "ഈ ആയത്തിന്റെ വായന വിജയകരമായി രേഖപ്പെടുത്തി. അടുത്ത ഘട്ടത്തിൽ സ്വന്തമായി ഓതി പരിശീലിക്കാം."
                  : "Verse participation is recorded. Proceed to local recitation practice."}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex-1 h-12 bg-white border border-[#E4E0E9] hover:bg-[#F3F1F4] text-[#141426] rounded-full font-bold text-xs tactile"
            >
              ← {lang === "ml" ? "തിരികെ" : "Back"}
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="flex-2 h-12 bg-[#191A22] hover:bg-black text-white rounded-full font-black text-xs flex items-center justify-center gap-1.5 shadow-md tactile"
            >
              <span>{lang === "ml" ? "പരിശീലനത്തിലേക്ക് →" : "Continue to Practice →"}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: RECORD & LISTEN BACK */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <VerseReader verse={verse} lang={lang} />

          <LocalPracticeRecorder
            lang={lang}
            verseNumber={verse.number}
            onRecordingSaved={handleRecordingSaved}
          />

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="flex-1 h-12 bg-white border border-[#E4E0E9] hover:bg-[#F3F1F4] text-[#141426] rounded-full font-bold text-xs tactile"
            >
              ← {lang === "ml" ? "തിരികെ" : "Back"}
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="flex-2 h-12 bg-[#191A22] hover:bg-black text-white rounded-full font-black text-xs flex items-center justify-center gap-1.5 shadow-md tactile"
            >
              <span>{lang === "ml" ? "പൂർത്തിയാക്കാം →" : "View Summary →"}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SUMMARY & PROGRESS REPORT */}
      {currentStep === 4 && (
        <div className="bg-white border border-[#E3D4FF] rounded-[28px] p-6 shadow-xs text-center space-y-4 animate-pop">
          <div className="w-16 h-16 rounded-full bg-[#F0E9FF] border border-[#E3D4FF] text-[#7857E8] flex items-center justify-center mx-auto shadow-sm">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#7857E8] bg-[#F0E9FF] px-2.5 py-0.5 rounded-full inline-block mb-1">
              {lang === "ml" ? "മിഷൻ പൂർത്തിയായി" : "Verse Explored"}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#141426]">
              {lang === "ml" ? `ആയത്ത് ${verse.number} പഠിച്ചു കഴിഞ്ഞു!` : `Verse ${verse.number} Explored!`}
            </h2>
            <p className="text-xs text-[#626273] font-medium mt-1 max-w-sm mx-auto leading-relaxed">
              {lang === "ml"
                ? "നിങ്ങൾ ഈ ആയത്ത് വിജയകരമായി വായിക്കുകയും പരിശീലിക്കുകയും ചെയ്തു."
                : "You have reviewed and practised this verse respectfully."}
            </p>
          </div>

          {/* Three Truthful Progress Badges */}
          <div className="space-y-2 text-left pt-2">
            {/* 1. Lesson Participation */}
            <div className="p-3 rounded-2xl bg-[#287553]/10 border border-[#287553]/20 flex items-center justify-between text-xs font-bold text-[#287553]">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === "ml" ? "പാഠ്യ പങ്കാളിത്തം (Explored)" : "Lesson Participation (Explored)"}</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-black">Recorded</span>
            </div>

            {/* 2. Knowledge Check */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-bold ${
              knowledgeDone || !matchingActivity
                ? "bg-[#287553]/10 border-[#287553]/20 text-[#287553]"
                : "bg-[#FFF0D6] border-[#FFD184] text-[#E59700]"
            }`}>
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>{lang === "ml" ? "അറിവ് പരിശോധന (Knowledge Check)" : "Knowledge Check"}</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-black">
                {knowledgeDone ? "Passed" : matchingActivity ? "Pending" : "Not Applicable"}
              </span>
            </div>

            {/* 3. Recitation Assessment By Teacher */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-bold ${
              submittedForReview
                ? "bg-[#F0E9FF] border-[#E3D4FF] text-[#7857E8]"
                : "bg-[#F3F1F4] border-[#E4E0E9] text-[#626273]"
            }`}>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>{lang === "ml" ? "അധ്യാപക പരിശോധന (Teacher Assessment)" : "Teacher Assessment"}</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-black">
                {submittedForReview ? "Awaiting Review" : "Optional"}
              </span>
            </div>
          </div>

          {/* Teacher Review Action Button (Truthful & Explicit) */}
          {!submittedForReview && (
            <button
              type="button"
              onClick={handleSubmitForTeacherReview}
              className="w-full py-2.5 px-4 rounded-2xl bg-[#F0E9FF] hover:bg-[#E3D4FF] text-[#7857E8] font-black text-xs tactile border border-[#E3D4FF] flex items-center justify-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{lang === "ml" ? "അധ്യാപക പരിശോധനയ്ക്കായി അടയാളപ്പെടുത്തുക" : "Submit for Teacher Evaluation"}</span>
            </button>
          )}

          {/* Finish & Return to Map */}
          <button
            type="button"
            onClick={onFinishVerse}
            className="w-full h-14 bg-[#191A22] hover:bg-black text-white rounded-full font-black text-sm flex items-center justify-center gap-2 shadow-md tactile transition-all mt-4"
          >
            <span>{lang === "ml" ? "ഫാതിഹ മാപ്പിലേക്ക് മടങ്ങുക →" : "Return to Al-Fatihah Map →"}</span>
          </button>
        </div>
      )}
    </div>
  );
};
