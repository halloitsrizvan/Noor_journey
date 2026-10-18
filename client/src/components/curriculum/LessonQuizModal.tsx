import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import { CurriculumTopic } from "./SubjectCurriculumScreen";
import { getTopicQuiz, TopicQuiz } from "./curriculumQuizData";
import { sfx } from "@/lib/sound/sfx";

interface LessonQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectKey: string;
  topicIndex: number;
  topic: CurriculumTopic;
  lang: "en" | "ml";
  isAlreadyCompleted: boolean;
  onLessonCompleted: (topicIndex: number, xpReward: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export const LessonQuizModal: React.FC<LessonQuizModalProps> = ({
  isOpen,
  onClose,
  subjectKey,
  topicIndex,
  topic,
  lang,
  isAlreadyCompleted,
  onLessonCompleted,
  onNextLesson,
  hasNextLesson,
}) => {
  const [activeTab, setActiveTab] = useState<"learn" | "quiz">("learn");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [quizStatus, setQuizStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isPassedLocally, setIsPassedLocally] = useState<boolean>(isAlreadyCompleted);

  // Get quiz data for this topic
  const quiz: TopicQuiz = getTopicQuiz(subjectKey, topicIndex, topic);

  // Reset state when topic changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab("learn");
      setSelectedOptionId(null);
      setQuizStatus("idle");
      setShowHint(false);
      setIsPassedLocally(isAlreadyCompleted);
    }
  }, [isOpen, topicIndex, isAlreadyCompleted]);

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  const handleSelectOption = (optionId: string) => {
    if (quizStatus === "correct") return;
    sfx.select();
    setSelectedOptionId(optionId);
    setQuizStatus("idle");
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId) return;
    const selectedOption = quiz.options.find((o) => o.id === selectedOptionId);
    if (selectedOption?.isCorrect) {
      sfx.correct();
      setQuizStatus("correct");
      setIsPassedLocally(true);
      onLessonCompleted(topicIndex, topic.xpReward || 25);
    } else {
      sfx.incorrect();
      setQuizStatus("incorrect");
    }
  };

  const handleRetryQuiz = () => {
    sfx.click();
    setSelectedOptionId(null);
    setQuizStatus("idle");
    setShowHint(true);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg max-h-[92vh] bg-[#FFFCF8] border-2 border-[#E4E0E9] rounded-[32px] p-5 sm:p-6 shadow-2xl flex flex-col relative text-[#141426] animate-pop overflow-hidden">
        {/* Soft Ambient Glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#7857E8]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E4E0E9] mb-4 relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white border border-[#E4E0E9] flex items-center justify-center text-2xl shadow-2xs shrink-0">
              {topic.icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#7857E8] bg-[#F0E9FF] px-2.5 py-0.5 rounded-full border border-[#E3D4FF]">
                  {lang === "ml" ? `പാഠം ${topicIndex + 1}` : `Lesson ${topicIndex + 1}`}
                </span>
                {(isPassedLocally || isAlreadyCompleted) && (
                  <span className="text-[10px] font-black text-[#1C6918] bg-[#EAF8E8] border border-[#B7E8B1] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#1C6918]" />
                    <span>{lang === "ml" ? "പൂർത്തിയായി" : "Completed"}</span>
                  </span>
                )}
              </div>
              <h3
                className="text-base sm:text-lg font-black text-[#141426] leading-tight mt-0.5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {lang === "ml" ? topic.titleMl : topic.titleEn}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sfx.click();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#F3F1F4] hover:bg-[#EAE8ED] text-[#626273] hover:text-[#141426] flex items-center justify-center transition-all tactile shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher Pills */}
        <div className="grid grid-cols-2 gap-2 bg-[#F3F1F4] p-1.5 rounded-2xl mb-4 shrink-0">
          <button
            type="button"
            onClick={() => {
              sfx.tab();
              setActiveTab("learn");
            }}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "learn"
                ? "bg-white text-[#141426] shadow-2xs"
                : "text-[#626273] hover:text-[#141426]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#7857E8]" />
            <span>{lang === "ml" ? "പാഠം പഠിക്കാം" : "Learn Lesson"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.tab();
              setActiveTab("quiz");
            }}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "quiz"
                ? "bg-white text-[#141426] shadow-2xs"
                : "text-[#626273] hover:text-[#141426]"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{lang === "ml" ? "അറിവ് ക്വിസ്" : "Lesson Quiz"}</span>
            {isPassedLocally && <span className="text-xs text-[#1C6918]">✓</span>}
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          {activeTab === "learn" && (
            <div className="space-y-4">
              {/* Arabic title if present */}
              {topic.arabicTitle && (
                <div className="p-3 bg-gradient-to-r from-[#F0E9FF] to-[#FAF9FC] border border-[#E3D4FF] rounded-2xl text-center">
                  <div className="text-lg sm:text-xl font-bold text-[#5B21B6] font-arabic">
                    {topic.arabicTitle}
                  </div>
                </div>
              )}

              {/* Lesson Description */}
              <div className="bg-white border border-[#E4E0E9] rounded-2xl p-4 shadow-2xs">
                <div className="text-[11px] font-black uppercase tracking-wider text-[#626273] mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#7857E8]" />
                  <span>{lang === "ml" ? "വിശദീകരണം" : "Overview & Explanation"}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#383849] font-medium leading-relaxed">
                  {lang === "ml" ? topic.descriptionMl : topic.descriptionEn}
                </p>
              </div>

              {/* Key Learning Objectives / Takeaways */}
              {topic.learningPoints && topic.learningPoints.length > 0 && (
                <div className="bg-[#FAF9FC] border border-[#ECE8F2] rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-[#626273] tracking-wider">
                    <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>{lang === "ml" ? "പ്രധാന പഠന ലക്ഷ്യങ്ങൾ:" : "Key Takeaways:"}</span>
                  </div>

                  <div className="space-y-2 pt-1">
                    {topic.learningPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-[#EAF8E8] text-[#1C6918] flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                          ✓
                        </div>
                        <span className="text-xs text-[#20202E] font-medium leading-relaxed">
                          {lang === "ml" ? point.ml : point.en}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lesson Rewards & Stats Bar */}
              <div className="flex items-center justify-between p-3.5 bg-[#F7F6F9] border border-[#E4E0E9] rounded-2xl text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[#626273]">
                  <Clock className="w-4 h-4 text-[#287553]" />
                  <span>{topic.durationMinutes} {lang === "ml" ? "മിനുറ്റ്" : "mins"}</span>
                </span>

                <span className="flex items-center gap-1.5 font-black text-[#5B21B6]">
                  <Award className="w-4 h-4 text-[#7857E8]" />
                  <span>+{topic.xpReward} XP {lang === "ml" ? "സമ്മാനം" : "Reward"}</span>
                </span>
              </div>
            </div>
          )}

          {activeTab === "quiz" && (
            <div className="space-y-4">
              {/* Question Card */}
              <div className="bg-white border-2 border-[#E4E0E9] rounded-2xl p-4.5 shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-lg bg-[#FFD184]/40 text-[#92400E] text-[10px] font-black uppercase tracking-wider">
                    {lang === "ml" ? "ക്വിസ് ചോദ്യം" : "Knowledge Check"}
                  </span>
                  <span className="text-xs font-bold text-[#7857E8]">
                    +{topic.xpReward} XP
                  </span>
                </div>

                <p className="text-sm sm:text-base font-black text-[#141426] leading-snug">
                  {quiz.question[lang]}
                </p>
              </div>

              {/* Options List */}
              <div className="space-y-2.5">
                {quiz.options.map((option, oIdx) => {
                  const isSelected = selectedOptionId === option.id;
                  let optionStyle = "bg-white border-[#E4E0E9] text-[#141426] hover:border-[#7857E8]/50";

                  if (isSelected && quizStatus === "idle") {
                    optionStyle = "bg-[#F0E9FF] border-[#7857E8] text-[#5B21B6] shadow-xs";
                  } else if (quizStatus === "correct" && option.isCorrect) {
                    optionStyle = "bg-[#EAF8E8] border-[#287553] text-[#1C6918] shadow-xs";
                  } else if (isSelected && quizStatus === "incorrect" && !option.isCorrect) {
                    optionStyle = "bg-[#FEE2E2] border-[#EF4444] text-[#B91C1C]";
                  }

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={quizStatus === "correct"}
                      onClick={() => handleSelectOption(option.id)}
                      className={`w-full p-3.5 rounded-2xl border-2 text-left font-semibold text-xs sm:text-sm transition-all tactile flex items-center justify-between gap-3 ${optionStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-xl bg-black/5 flex items-center justify-center font-black text-xs shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="leading-snug">{option.text[lang]}</span>
                      </div>

                      {quizStatus === "correct" && option.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-[#287553] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Alert Banners */}
              {quizStatus === "correct" && (
                <div className="p-4 bg-[#EAF8E8] border-2 border-[#B7E8B1] rounded-2xl space-y-2 animate-pop">
                  <div className="flex items-center gap-2 text-xs font-black text-[#1C6918]">
                    <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                    <span>{lang === "ml" ? "മാഷാ അല്ലാഹ്! ഉത്തരം ശരിയാണ്! (+XP നേടി)" : "MashaAllah! Correct Answer! (+XP Earned)"}</span>
                  </div>
                  <p className="text-xs text-[#287553] leading-relaxed font-medium">
                    {quiz.explanation[lang]}
                  </p>
                </div>
              )}

              {quizStatus === "incorrect" && (
                <div className="p-4 bg-[#FEF2F2] border-2 border-[#FECACA] rounded-2xl space-y-2 animate-shake">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black text-[#B91C1C]">
                      <AlertCircle className="w-4 h-4 text-[#EF4444]" />
                      <span>{lang === "ml" ? "ഉത്തരം തെറ്റാണ്. വിഷമിക്കേണ്ട, വീണ്ടും ശ്രമിക്കൂ!" : "Not quite! Don't worry, try again!"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRetryQuiz}
                      className="text-[11px] font-black text-[#7857E8] underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{lang === "ml" ? "വീണ്ടും" : "Retry"}</span>
                    </button>
                  </div>

                  {(showHint || quiz.hint) && (
                    <div className="text-xs text-[#991B1B] font-medium bg-white/70 p-2.5 rounded-xl border border-[#FECACA] flex items-start gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" />
                      <span>{quiz.hint?.[lang] || (lang === "ml" ? "പാഠം വീണ്ടും ശ്രദ്ധയോടെ വായിക്കൂ." : "Review the lesson overview for clues.")}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-4 border-t border-[#E4E0E9] mt-3 flex items-center justify-between gap-3 shrink-0">
          {activeTab === "learn" ? (
            <>
              <button
                type="button"
                onClick={() => {
                  sfx.click();
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#626273] hover:bg-[#F3F1F4] transition-all"
              >
                {lang === "ml" ? "പിന്നീട് ചെയ്യാം" : "Close"}
              </button>

              <button
                type="button"
                onClick={() => {
                  sfx.tab();
                  setActiveTab("quiz");
                }}
                className="px-5 py-3 rounded-2xl bg-[#7857E8] hover:bg-[#6846D4] text-white font-black text-xs transition-all tactile shadow-xs flex items-center gap-2"
              >
                <span>{lang === "ml" ? "ക്വിസ് ആരംഭിക്കൂ →" : "Take Lesson Quiz →"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {quizStatus !== "correct" ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      sfx.tab();
                      setActiveTab("learn");
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#626273] hover:bg-[#F3F1F4] transition-all"
                  >
                    {lang === "ml" ? "← പാഠത്തിലേക്ക്" : "← Back to Lesson"}
                  </button>

                  <button
                    type="button"
                    disabled={!selectedOptionId}
                    onClick={handleCheckAnswer}
                    className={`px-5 py-3 rounded-2xl font-black text-xs transition-all tactile shadow-xs flex items-center gap-2 ${
                      selectedOptionId
                        ? "bg-[#287553] hover:bg-[#206043] text-white"
                        : "bg-[#E4E0E9] text-[#9A9AAB] cursor-not-allowed"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === "ml" ? "ഉത്തരം ഉറപ്പിക്കുക" : "Check Answer"}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      sfx.click();
                      onClose();
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#626273] hover:bg-[#F3F1F4] transition-all"
                  >
                    {lang === "ml" ? "പൂർത്തിയാക്കി മടങ്ങുക" : "Done"}
                  </button>

                  {hasNextLesson && onNextLesson ? (
                    <button
                      type="button"
                      onClick={() => {
                        sfx.click();
                        onNextLesson();
                      }}
                      className="px-5 py-3 rounded-2xl bg-[#7857E8] hover:bg-[#6846D4] text-white font-black text-xs transition-all tactile shadow-xs flex items-center gap-2 animate-bounce"
                    >
                      <span>{lang === "ml" ? "അടുത്ത പാഠത്തിലേക്ക് →" : "Next Lesson →"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        sfx.complete();
                        onClose();
                      }}
                      className="px-5 py-3 rounded-2xl bg-[#287553] hover:bg-[#206043] text-white font-black text-xs transition-all tactile shadow-xs flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#FFD184]" />
                      <span>{lang === "ml" ? "വിഷയം പൂർത്തിയായി! 🎉" : "Subject Completed! 🎉"}</span>
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
