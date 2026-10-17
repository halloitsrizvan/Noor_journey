import React, { useState } from "react";
import { createPortal } from "react-dom";
import type { TajweedCurriculumItem } from "../data/tajweedRoadmapData";
import {
  X,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Star,
  BookOpen,
  Award,
} from "lucide-react";

interface TajweedCurriculumModalProps {
  curriculum: TajweedCurriculumItem;
  isOpen: boolean;
  isCompleted: boolean;
  lang: "ml" | "en";
  onClose: () => void;
  onQuizPassed: (curriculumId: string, xpEarned: number) => void;
}

export const TajweedCurriculumModal: React.FC<TajweedCurriculumModalProps> = ({
  curriculum,
  isOpen,
  isCompleted,
  lang,
  onClose,
  onQuizPassed,
}) => {
  // Modes: "learn" | "quiz" | "passed"
  const [activeStep, setActiveStep] = useState<"learn" | "quiz" | "passed">("learn");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [quizStatus, setQuizStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [showHint, setShowHint] = useState(false);

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  const handleOptionSelect = (optionId: string) => {
    if (quizStatus === "correct") return;
    setSelectedOptionId(optionId);
    setQuizStatus("idle");
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId) return;
    const option = curriculum.quiz.options.find((opt) => opt.id === selectedOptionId);
    if (option?.isCorrect) {
      setQuizStatus("correct");
      onQuizPassed(curriculum.id, curriculum.xpReward);
      setTimeout(() => {
        setActiveStep("passed");
      }, 700);
    } else {
      setQuizStatus("incorrect");
    }
  };

  const handleResetQuiz = () => {
    setSelectedOptionId(null);
    setQuizStatus("idle");
    setShowHint(false);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg max-h-[92vh] bg-[#FFFCF8] border-2 border-[#E4E0E9] rounded-[32px] p-5 sm:p-6 shadow-2xl flex flex-col relative text-[#141426] animate-pop overflow-hidden">
        {/* Soft Ambient Glow */}
        <div className="absolute -top-14 -right-14 w-40 h-40 bg-[#7857E8]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E0E9] mb-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#E4E0E9] flex items-center justify-center text-2xl shadow-2xs">
              {curriculum.icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#7857E8] bg-[#F0E9FF] px-2.5 py-0.5 rounded-full border border-[#E3D4FF]">
                  {lang === "ml" ? `പാഠം ${curriculum.order}` : `Lesson ${curriculum.order}`}
                </span>
                {isCompleted && (
                  <span className="text-[10px] font-black text-[#287553] bg-[#287553]/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#287553]" />
                    <span>{lang === "ml" ? "പൂർത്തിയായി" : "Completed"}</span>
                  </span>
                )}
              </div>
              <h3
                className="text-base sm:text-lg font-black text-[#141426] leading-tight mt-0.5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {lang === "ml" ? curriculum.malayalamTitle : curriculum.englishTitle}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3F1F4] hover:bg-[#E4E0E9] flex items-center justify-center text-[#626273] hover:text-[#141426] tactile transition-all"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Navigation Tabs: Learn vs Quiz */}
        <div className="flex bg-[#F3F1F4] p-1 rounded-2xl mb-3 text-xs font-black shadow-inner relative z-10">
          <button
            type="button"
            onClick={() => setActiveStep("learn")}
            className={`flex-1 py-1.5 rounded-xl transition-all tactile flex items-center justify-center gap-1.5 ${
              activeStep === "learn"
                ? "bg-[#191A22] text-white shadow-2xs"
                : "text-[#626273] hover:text-[#141426]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === "ml" ? "പാഠം പഠിക്കാം" : "Learn Concept"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep("quiz")}
            className={`flex-1 py-1.5 rounded-xl transition-all tactile flex items-center justify-center gap-1.5 ${
              activeStep === "quiz" || activeStep === "passed"
                ? "bg-[#191A22] text-[#FFD184] shadow-2xs"
                : "text-[#626273] hover:text-[#141426]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === "ml" ? "പരിശോധനാ ക്വിസ് 🎯" : "Unlock Quiz 🎯"}</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs relative z-10">
          {/* ========================================================
              STAGE 1: LEARN STEP
             ======================================================== */}
          {activeStep === "learn" && (
            <div className="space-y-3.5 animate-fade-in">
              {/* Arabic Banner */}
              <div className="bg-[#191A22] rounded-[22px] p-4 text-center text-white relative overflow-hidden shadow-xs">
                <span className="text-[10px] font-bold text-[#FFD184] uppercase tracking-wider block mb-1">
                  {curriculum.badge[lang]}
                </span>
                <span
                  dir="rtl"
                  className="text-2xl sm:text-3xl font-serif text-white tracking-wide block py-1"
                  style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
                >
                  {curriculum.arabicTitle}
                </span>
                <p className="text-xs text-white/80 font-medium max-w-sm mx-auto mt-1 leading-relaxed">
                  {curriculum.shortDesc[lang]}
                </p>
              </div>

              {/* Lesson Points */}
              {curriculum.conceptLessons.map((lesson, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#E4E0E9] rounded-[24px] p-4 shadow-2xs space-y-2.5"
                >
                  <h4 className="text-xs font-black text-[#7857E8] uppercase tracking-wider">
                    {lesson.title[lang]}
                  </h4>

                  <ul className="space-y-2">
                    {lesson.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-xs font-medium text-[#141426] leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7857E8] mt-1.5 shrink-0" />
                        <span>{pt[lang]}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Arabic Examples Pills */}
                  {lesson.arabicExamples && lesson.arabicExamples.length > 0 && (
                    <div className="pt-2 border-t border-[#F3F1F4] space-y-1.5">
                      <span className="text-[10px] font-bold text-[#626273] uppercase tracking-wider block">
                        {lang === "ml" ? "ഖുർആനിക ഉദാഹരണങ്ങൾ:" : "Quranic Examples:"}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {lesson.arabicExamples.map((ex, exIdx) => (
                          <div
                            key={exIdx}
                            className="bg-[#F0E9FF]/60 border border-[#E3D4FF] rounded-xl p-2 text-center"
                          >
                            <span
                              dir="rtl"
                              className="text-base font-serif font-bold text-[#141426] block"
                              style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
                            >
                              {ex.text}
                            </span>
                            <span className="text-[9px] font-semibold text-[#626273] block mt-0.5">
                              {ex.label[lang]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Move to Quiz CTA */}
              <button
                type="button"
                onClick={() => setActiveStep("quiz")}
                className="w-full h-12 bg-gradient-to-r from-[#191A22] to-[#2E2050] hover:from-black hover:to-[#191A22] text-[#FFD184] hover:text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md tactile transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#FFD184]" />
                <span>
                  {lang === "ml"
                    ? "പഠിച്ചു കഴിഞ്ഞു! ക്വിസ് എടുത്ത് അടുത്തത് അൺലോക്ക് ചെയ്യാം →"
                    : "Ready! Take Quiz to Unlock Next Topic →"}
                </span>
              </button>
            </div>
          )}

          {/* ========================================================
              STAGE 2: QUIZ STEP
             ======================================================== */}
          {activeStep === "quiz" && (
            <div className="space-y-4 animate-fade-in">
              {/* Question Header Card */}
              <div className="bg-[#FFF8EE] border border-[#FFD184] rounded-[24px] p-4 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#E59700] bg-white px-2.5 py-0.5 rounded-full border border-[#FFD184]">
                    {lang === "ml" ? "അറിവ് പരിശോധന" : "Knowledge Check"}
                  </span>
                  <span className="text-[10px] font-black text-[#7857E8] bg-[#F0E9FF] px-2 py-0.5 rounded-full">
                    +{curriculum.xpReward} XP
                  </span>
                </div>
                <h4 className="text-sm font-black text-[#141426] leading-snug">
                  {curriculum.quiz.question[lang]}
                </h4>
              </div>

              {/* Option Cards */}
              <div className="space-y-2">
                {curriculum.quiz.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  let cardStyles = "bg-white border-[#E4E0E9] hover:border-[#7857E8]";

                  if (isSelected) {
                    if (quizStatus === "correct") {
                      cardStyles = "bg-[#EAF8E8] border-[#287553] text-[#287553]";
                    } else if (quizStatus === "incorrect") {
                      cardStyles = "bg-[#FFE5E8] border-[#B93848] text-[#B93848]";
                    } else {
                      cardStyles = "bg-[#F0E9FF] border-[#7857E8] text-[#141426]";
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleOptionSelect(option.id)}
                      className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all tactile flex items-center justify-between gap-3 shadow-2xs ${cardStyles}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            isSelected
                              ? "bg-[#191A22] text-white"
                              : "bg-[#F3F1F4] text-[#626273]"
                          }`}
                        >
                          {option.id.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold leading-relaxed">
                          {option.text[lang]}
                        </span>
                      </div>

                      {isSelected && quizStatus === "correct" && (
                        <CheckCircle2 className="w-5 h-5 text-[#287553] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback messages */}
              {quizStatus === "incorrect" && (
                <div className="p-3 rounded-2xl bg-[#FFE5E8] border border-[#FFCCD3] text-[#B93848] text-xs font-bold flex items-center justify-between animate-pop">
                  <span>
                    {lang === "ml"
                      ? "വീണ്ടും ശ്രമിക്കൂ! ശരിയായ ഉത്തരം കണ്ടെത്താം."
                      : "Almost! Try again to unlock the next curriculum."}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowHint(true)}
                    className="underline text-[11px] ml-2 shrink-0 font-extrabold"
                  >
                    {lang === "ml" ? "സൂചന" : "Hint"}
                  </button>
                </div>
              )}

              {/* Hint Box */}
              {showHint && (
                <div className="p-3 rounded-2xl bg-[#F0E9FF] border border-[#E3D4FF] text-[#7857E8] text-xs font-semibold flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{curriculum.quiz.hint[lang]}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={!selectedOptionId}
                  onClick={handleCheckAnswer}
                  className="flex-1 h-12 bg-[#191A22] hover:bg-black disabled:opacity-40 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md tactile transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#FFD184]" />
                  <span>{lang === "ml" ? "ഉത്തരം പരിശോധിക്കുക" : "Check Answer & Unlock"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="w-12 h-12 rounded-2xl bg-[#F3F1F4] hover:bg-[#E4E0E9] text-[#626273] flex items-center justify-center tactile transition-all"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              STAGE 3: QUIZ PASSED / CONGRATULATIONS
             ======================================================== */}
          {activeStep === "passed" && (
            <div className="py-6 text-center space-y-4 animate-pop">
              <div className="w-20 h-20 rounded-full bg-[#EAF8E8] text-[#287553] mx-auto flex items-center justify-center text-3xl shadow-sm border-2 border-[#287553]/30">
                🎉
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#287553] bg-[#EAF8E8] px-3 py-1 rounded-full inline-block mb-1.5">
                  {lang === "ml" ? "മാഷാ അല്ലാഹ്! വിജയം" : "Masha'Allah! Perfect"}
                </span>
                <h4
                  className="text-xl font-black text-[#141426] leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {lang === "ml" ? "അടുത്ത പാഠം അൺലോക്കായി!" : "Next Curriculum Unlocked!"}
                </h4>
                <p className="text-xs text-[#626273] font-medium max-w-sm mx-auto mt-1 leading-relaxed">
                  {curriculum.quiz.explanation[lang]}
                </p>
              </div>

              {/* XP Award Pill */}
              <div className="inline-flex items-center gap-1.5 bg-[#FFF0D6] border border-[#FFD184] text-[#E59700] px-4 py-1.5 rounded-full font-black text-sm shadow-2xs">
                <Star className="w-4 h-4 fill-current" />
                <span>+{curriculum.xpReward} Noor Stars (XP)</span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full h-12 bg-[#191A22] hover:bg-black text-[#FFD184] hover:text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md tactile transition-all"
                >
                  <span>{lang === "ml" ? "റോഡ്മാപ്പിലേക്ക് മടങ്ങാം 🚀" : "Continue Roadmap 🚀"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
