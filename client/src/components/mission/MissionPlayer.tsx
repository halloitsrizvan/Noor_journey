import React, { useState, useMemo } from "react";
import type { Activity, ChoiceActivity, MatchActivity, Mission, SequenceActivity } from "@/lib/noor/types";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { LanternMascot } from "../mascot/LanternMascot";
import {
  ArrowLeft,
  Check,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  X,
  Heart,
  Award,
  ArrowRight,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Illustration } from "@/components/common/Illustration";

interface MissionPlayerProps {
  mission: Mission;
  isReviewMode?: boolean;
  onClose: () => void;
}

export const MissionPlayer: React.FC<MissionPlayerProps> = ({
  mission,
  isReviewMode = false,
  onClose,
}) => {
  const { lang, completeMission, completeReview, saveReflection, state } = useNoor();
  const t = translations[lang];

  // Steps: 0: Teach (if not review), 1..N: Activities (or Revision), Checkpoint (4 questions), Complete
  const [phase, setPhase] = useState<"teach" | "activity" | "checkpoint" | "failed" | "complete">(
    isReviewMode ? "activity" : "teach"
  );
  const [activityIdx, setActivityIdx] = useState(0);

  // Activity answer state
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  // Matching state
  const [selectedPairLeft, setSelectedPairLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // Sequence state & Drag-and-Drop
  const [sequenceOrder, setSequenceOrder] = useState<string[]>([]);
  const [draggedSeqIdx, setDraggedSeqIdx] = useState<number | null>(null);
  const [dragOverSeqIdx, setDragOverSeqIdx] = useState<number | null>(null);
  const pointerCurrentSeqIdx = React.useRef<number | null>(null);

  const reorderSequence = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
    setSequenceOrder((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  const handleSeqDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
    setDraggedSeqIdx(index);
  };

  const handleSeqDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverSeqIdx !== index) {
      setDragOverSeqIdx(index);
    }
  };

  const handleSeqDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedSeqIdx !== null && draggedSeqIdx !== targetIndex) {
      reorderSequence(draggedSeqIdx, targetIndex);
    }
    setDraggedSeqIdx(null);
    setDragOverSeqIdx(null);
  };

  const handleSeqDragEnd = () => {
    setDraggedSeqIdx(null);
    setDragOverSeqIdx(null);
  };

  const handlePointerDown = (e: React.PointerEvent, index: number) => {
    if (isChecked) return;
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture?.(e.pointerId);
    setDraggedSeqIdx(index);
    pointerCurrentSeqIdx.current = index;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointerCurrentSeqIdx.current === null) return;
    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    const dropItem = elementBelow?.closest("[data-sequence-idx]");
    if (dropItem) {
      const targetIdx = Number(dropItem.getAttribute("data-sequence-idx"));
      if (!isNaN(targetIdx) && targetIdx !== pointerCurrentSeqIdx.current) {
        reorderSequence(pointerCurrentSeqIdx.current, targetIdx);
        pointerCurrentSeqIdx.current = targetIdx;
        setDraggedSeqIdx(targetIdx);
        setDragOverSeqIdx(targetIdx);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pointerCurrentSeqIdx.current !== null) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {}
      pointerCurrentSeqIdx.current = null;
      setDraggedSeqIdx(null);
      setDragOverSeqIdx(null);
    }
  };

  // Checkpoint state
  const checkpointQuestions = useMemo(() => {
    // Pick 4 questions from the 8-question pool
    return mission.checkpointPool.slice(0, 4);
  }, [mission]);
  const [checkpointIdx, setCheckpointIdx] = useState(0);
  const [checkpointAnswers, setCheckpointAnswers] = useState<boolean[]>([]);

  // Reflection note
  const [reflectionNote, setReflectionNote] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState(false);

  // XP Result
  const [xpAwarded, setXpAwarded] = useState(0);
  const [earnedBadge, setEarnedBadge] = useState(false);

  // Current activity list
  const currentActivities: Activity[] = isReviewMode ? mission.revision : mission.activities;
  const currentActivity = currentActivities[activityIdx];

  // Total steps for progress bar
  const totalSteps = isReviewMode
    ? currentActivities.length
    : 1 + currentActivities.length + checkpointQuestions.length;

  const currentStepNumber = useMemo(() => {
    if (phase === "teach") return 1;
    if (phase === "activity") return 1 + (isReviewMode ? 0 : 1) + activityIdx;
    if (phase === "checkpoint") return 1 + (isReviewMode ? 0 : 1) + currentActivities.length + checkpointIdx;
    return totalSteps;
  }, [phase, activityIdx, checkpointIdx, currentActivities.length, isReviewMode, totalSteps]);

  const progressPercent = Math.min(100, Math.round((currentStepNumber / totalSteps) * 100));

  // Initialize sequence activity when currentActivity changes
  React.useEffect(() => {
    if (currentActivity?.kind === "sequence") {
      // Shuffle initial order
      const initial = [...currentActivity.steps].map((s) => s.id);
      setSequenceOrder(initial.reverse());
    }
    setSelectedChoiceId(null);
    setIsChecked(false);
    setIsAnswerCorrect(false);
    setSelectedPairLeft(null);
    setMatchedPairs([]);
  }, [currentActivity]);

  // Audio simulator trigger
  const playAudioCue = () => {
    if (!state.prefs.sound) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  // Check activity answer
  const handleCheckActivity = () => {
    playAudioCue();
    if (!currentActivity) return;

    if (currentActivity.kind === "choice") {
      const correct = selectedChoiceId === currentActivity.correctId;
      setIsAnswerCorrect(correct);
      setIsChecked(true);
    } else if (currentActivity.kind === "match") {
      const allMatched = matchedPairs.length === currentActivity.pairs.length;
      setIsAnswerCorrect(allMatched);
      setIsChecked(true);
    } else if (currentActivity.kind === "sequence") {
      // Check if sequenceOrder matches original steps
      const isCorrect = currentActivity.steps.every((s, i) => s.id === sequenceOrder[i]);
      setIsAnswerCorrect(isCorrect);
      setIsChecked(true);
    }
  };

  // Next step in activities
  const handleNextActivity = () => {
    if (activityIdx + 1 < currentActivities.length) {
      setActivityIdx((prev) => prev + 1);
    } else {
      if (isReviewMode) {
        // Review completed!
        const res = completeReview(mission.id);
        setXpAwarded(res.xpAwarded);
        setPhase("complete");
      } else {
        // Move to checkpoint
        setPhase("checkpoint");
        setCheckpointIdx(0);
        setCheckpointAnswers([]);
        setSelectedChoiceId(null);
        setIsChecked(false);
      }
    }
  };

  // Checkpoint answer handler
  const handleCheckCheckpoint = () => {
    playAudioCue();
    const q = checkpointQuestions[checkpointIdx];
    const correct = selectedChoiceId === q.correctId;
    setIsAnswerCorrect(correct);
    setIsChecked(true);
  };

  const handleNextCheckpoint = () => {
    const q = checkpointQuestions[checkpointIdx];
    const correct = selectedChoiceId === q.correctId;
    const newAnswers = [...checkpointAnswers, correct];
    setCheckpointAnswers(newAnswers);

    if (checkpointIdx + 1 < checkpointQuestions.length) {
      setCheckpointIdx((prev) => prev + 1);
      setSelectedChoiceId(null);
      setIsChecked(false);
    } else {
      // Checkpoint finished! Calculate score
      const correctCount = newAnswers.filter(Boolean).length;
      if (correctCount >= 3) {
        const res = completeMission(mission.id, correctCount);
        setXpAwarded(res.xpAwarded);
        setEarnedBadge(res.newBadge);
        setPhase("complete");
      } else {
        setPhase("failed");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FFFCF8] text-[#141426] flex flex-col max-w-md md:max-w-xl mx-auto shadow-2xl animate-rise">
      {/* Top Header & Progress */}
      <div className="px-5 py-3.5 border-b border-[#E4E0E9] flex items-center justify-between gap-3 bg-white">
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-[#F3F1F4] flex items-center justify-center text-[#626273] hover:text-[#141426] tactile"
          aria-label="Exit"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Bar in Violet */}
        <div className="flex-1">
          <div className="w-full h-2.5 bg-[#F3F1F4] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#7857E8] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Concept Pill */}
        <span className="text-[10px] font-black text-[#7857E8] bg-[#F0E9FF] border border-[#E3D4FF] px-3 py-1 rounded-full truncate max-w-[120px]">
          {mission.concept[lang]}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
        {/* PHASE 1: Teaching Slide */}
        {phase === "teach" && (
          <div className="space-y-4 my-auto animate-rise">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-primary uppercase tracking-wider">
                {lang === "ml" ? "പഠന പാഠം" : "Concept Lesson"}
              </span>
              <LanternMascot mood="gentle" size="sm" />
            </div>

            <h2 className="text-xl font-black text-foreground leading-tight">
              {mission.teaching.title[lang]}
            </h2>

            {/* Arabic Calligraphy & Meaning Card */}
            {mission.teaching.arabic && (
              <div className="p-4 rounded-3xl bg-amber-500/10 border-2 border-amber-500/25 text-center my-3 shadow-2xs">
                <span
                  lang="ar"
                  dir="rtl"
                  className="block text-2xl font-bold text-amber-950 dark:text-amber-100 font-arabic mb-1 leading-loose"
                >
                  {mission.teaching.arabic.text}
                </span>
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block mb-1">
                  "{mission.teaching.arabic.transliteration[lang]}"
                </span>
                <span className="text-[11px] text-muted-foreground block font-medium">
                  {mission.teaching.arabic.meaning[lang]}
                </span>
              </div>
            )}

            {/* Teaching paragraphs */}
            <div className="space-y-2.5 bg-card border border-border/80 rounded-3xl p-4 shadow-xs">
              {mission.teaching.body.map((para, i) => (
                <p key={i} className="text-xs font-medium text-foreground leading-relaxed flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-leaf mt-1.5 shrink-0" />
                  <span>{para[lang]}</span>
                </p>
              ))}
            </div>
          </div>
        )}

        {/* PHASE 2: Interactive Activities */}
        {phase === "activity" && currentActivity && (
          <div className="space-y-4 my-auto animate-rise">
            <div>
              <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider block mb-1">
                {lang === "ml" ? `പരിശീലനം ${activityIdx + 1} / ${currentActivities.length}` : `Activity ${activityIdx + 1} of ${currentActivities.length}`}
              </span>
              <h3 className="text-base font-black text-foreground leading-snug">
                {currentActivity.prompt[lang]}
              </h3>
            </div>

            {/* Scenario if present */}
            {currentActivity.kind === "choice" && currentActivity.scenario && (
              <div className="p-3.5 bg-sand/50 border border-border/80 rounded-2xl text-xs font-semibold text-foreground leading-relaxed">
                "{currentActivity.scenario[lang]}"
              </div>
            )}

            {/* 1. Choice Activity */}
            {currentActivity.kind === "choice" && (
              <div className="space-y-2">
                {currentActivity.choices.map((choice) => {
                  const isSelected = selectedChoiceId === choice.id;
                  const isThisCorrect = choice.id === currentActivity.correctId;

                  let borderClass = "border-[#E4E0E9] bg-[#F3F1F4] text-[#141426]";
                  if (isChecked) {
                    if (isThisCorrect) borderClass = "border-2 border-[#287553] bg-[#287553]/15 text-[#287553] font-bold";
                    else if (isSelected) borderClass = "border-2 border-[#B93848] bg-[#B93848]/10 text-[#B93848] font-bold";
                  } else if (isSelected) {
                    borderClass = "border-2 border-[#7857E8] bg-[#F0E9FF] text-[#141426] font-bold shadow-xs";
                  }

                  return (
                    <button
                      key={choice.id}
                      type="button"
                      disabled={isChecked}
                      onClick={() => setSelectedChoiceId(choice.id)}
                      className={`w-full p-4 rounded-[20px] border text-left text-sm font-semibold transition-all tactile ${borderClass}`}
                    >
                      {choice.text[lang]}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. Match Activity */}
            {currentActivity.kind === "match" && (
              <div className="space-y-3">
                <span className="text-[11px] text-muted-foreground block">
                  {lang === "ml" ? "ഇടതുവശത്തെ വാക്യവും യോജിച്ച വലതുവശത്തെ വാക്യവും തൊടുക:" : "Tap a left item, then tap its matching right item:"}
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {/* Left Column */}
                  <div className="space-y-2">
                    {currentActivity.pairs.map((p) => {
                      const isMatched = matchedPairs.includes(p.id);
                      const isSelected = selectedPairLeft === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          disabled={isMatched || isChecked}
                          onClick={() => setSelectedPairLeft(p.id)}
                          className={`w-full p-2.5 rounded-xl border-2 text-[11px] font-semibold text-left transition-all ${
                            isMatched
                              ? "bg-leaf-soft border-leaf text-leaf-deep opacity-60 line-through"
                              : isSelected
                              ? "bg-primary/15 border-primary text-primary ring-2 ring-primary/20"
                              : "bg-card border-border"
                          }`}
                        >
                          {p.left[lang]}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-2">
                    {currentActivity.pairs.map((p) => {
                      const isMatched = matchedPairs.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          disabled={isMatched || isChecked}
                          onClick={() => {
                            if (selectedPairLeft === p.id) {
                              setMatchedPairs((prev) => [...prev, p.id]);
                              setSelectedPairLeft(null);
                            } else {
                              setSelectedPairLeft(null);
                            }
                          }}
                          className={`w-full p-2.5 rounded-xl border-2 text-[11px] font-semibold text-left transition-all ${
                            isMatched
                              ? "bg-leaf-soft border-leaf text-leaf-deep opacity-60"
                              : "bg-card border-border hover:border-primary/50"
                          }`}
                        >
                          {p.right[lang]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Sequence Activity with Drag and Drop */}
            {currentActivity.kind === "sequence" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#626273] font-semibold">
                  <span className="flex items-center gap-1.5">
                    <GripVertical className="w-4 h-4 text-[#7857E8]" />
                    {lang === "ml"
                      ? "ക്രമം മാറ്റാൻ വലിച്ച് മാറ്റുക (Drag to reorder):"
                      : "Drag and drop to put the steps in order:"}
                  </span>
                  <span className="text-[11px] font-extrabold text-[#7857E8] bg-[#F0E9FF] px-2.5 py-0.5 rounded-full border border-[#E3D4FF]">
                    {lang === "ml" ? "വലിച്ചിടുക" : "Drag & Drop"}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {sequenceOrder.map((stepId, index) => {
                    const stepObj = currentActivity.steps.find((s) => s.id === stepId);
                    if (!stepObj) return null;

                    const isBeingDragged = draggedSeqIdx === index;
                    const isDragOver = dragOverSeqIdx === index && !isBeingDragged;
                    const isCorrectStep = isChecked && currentActivity.steps[index]?.id === stepId;

                    return (
                      <div
                        key={stepId}
                        data-sequence-idx={index}
                        draggable={!isChecked}
                        onDragStart={(e) => handleSeqDragStart(e, index)}
                        onDragOver={(e) => handleSeqDragOver(e, index)}
                        onDrop={(e) => handleSeqDrop(e, index)}
                        onDragEnd={handleSeqDragEnd}
                        className={`p-3.5 rounded-[22px] border-2 flex items-center justify-between gap-3 shadow-2xs transition-all select-none ${
                          isBeingDragged
                            ? "opacity-60 scale-102 border-[#7857E8] bg-[#F0E9FF] shadow-md z-30"
                            : isDragOver
                            ? "border-t-4 border-[#7857E8] bg-[#F0E9FF]/50"
                            : isChecked
                            ? isCorrectStep
                              ? "bg-[#287553]/10 border-[#287553]"
                              : "bg-[#B93848]/10 border-[#B93848]"
                            : "bg-white border-[#E4E0E9] hover:border-[#7857E8]/50"
                        }`}
                      >
                        {/* Drag Handle, Step Number & Text */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Tactile drag handle */}
                          {!isChecked && (
                            <div
                              onPointerDown={(e) => handlePointerDown(e, index)}
                              onPointerMove={handlePointerMove}
                              onPointerUp={handlePointerUp}
                              onPointerCancel={handlePointerUp}
                              className="p-1 rounded-lg text-[#626273] hover:text-[#141426] hover:bg-[#F3F1F4] cursor-grab active:cursor-grabbing touch-none shrink-0"
                              title="Drag to reorder"
                              aria-label="Drag handle"
                            >
                              <GripVertical className="w-5 h-5 text-[#7857E8]" />
                            </div>
                          )}

                          {/* Step Number Circle */}
                          <span
                            className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center shrink-0 shadow-2xs ${
                              isChecked
                                ? isCorrectStep
                                  ? "bg-[#287553] text-white"
                                  : "bg-[#B93848] text-white"
                                : "bg-[#7857E8] text-white"
                            }`}
                          >
                            {index + 1}
                          </span>

                          {/* Step Content */}
                          <span
                            className={`text-sm font-bold leading-snug truncate ${
                              isChecked
                                ? isCorrectStep
                                  ? "text-[#287553]"
                                  : "text-[#B93848]"
                                : "text-[#141426]"
                            }`}
                          >
                            {stepObj.text[lang]}
                          </span>
                        </div>

                        {/* Accessibility Up/Down Buttons */}
                        {!isChecked && (
                          <div className="flex gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => reorderSequence(index, index - 1)}
                              className="w-7 h-7 rounded-xl bg-[#F3F1F4] hover:bg-[#E4E0E9] text-[#141426] flex items-center justify-center text-xs font-bold disabled:opacity-20 tactile"
                              aria-label="Move up"
                              title="Move up"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              disabled={index === sequenceOrder.length - 1}
                              onClick={() => reorderSequence(index, index + 1)}
                              className="w-7 h-7 rounded-xl bg-[#F3F1F4] hover:bg-[#E4E0E9] text-[#141426] flex items-center justify-center text-xs font-bold disabled:opacity-20 tactile"
                              aria-label="Move down"
                              title="Move down"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PHASE 3: Checkpoint (4 Questions) */}
        {phase === "checkpoint" && (
          <div className="space-y-4 my-auto animate-rise">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">
                {t.checkpointTitle} ({checkpointIdx + 1} / 4)
              </span>
              <span className="text-xs font-bold text-muted-foreground">
                {t.score}: {checkpointAnswers.filter(Boolean).length} / {checkpointIdx}
              </span>
            </div>

            <h3 className="text-base font-black text-foreground leading-snug">
              {checkpointQuestions[checkpointIdx].prompt[lang]}
            </h3>

            <div className="space-y-2">
              {checkpointQuestions[checkpointIdx].choices.map((choice) => {
                const isSelected = selectedChoiceId === choice.id;
                const isThisCorrect = choice.id === checkpointQuestions[checkpointIdx].correctId;

                let borderClass = "border-[#E4E0E9] bg-[#F3F1F4] text-[#141426]";
                if (isChecked) {
                  if (isThisCorrect) borderClass = "border-2 border-[#287553] bg-[#287553]/15 text-[#287553] font-bold";
                  else if (isSelected) borderClass = "border-2 border-[#B93848] bg-[#B93848]/10 text-[#B93848] font-bold";
                } else if (isSelected) {
                  borderClass = "border-2 border-[#7857E8] bg-[#F0E9FF] text-[#141426] font-bold shadow-xs";
                }

                return (
                  <button
                    key={choice.id}
                    type="button"
                    disabled={isChecked}
                    onClick={() => setSelectedChoiceId(choice.id)}
                    className={`w-full p-4 rounded-[20px] border text-left text-sm font-semibold transition-all tactile ${borderClass}`}
                  >
                    {choice.text[lang]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PHASE 4: Checkpoint Failed - Supported Retry */}
        {phase === "failed" && (
          <div className="space-y-4 text-center my-auto animate-rise">
            <div className="w-24 h-24 mx-auto pointer-events-none">
              <Illustration
                role="mission-reading"
                className="w-full h-full object-contain"
                alt="Noor encouraging retry"
              />
            </div>
            <h3
              className="text-xl font-black text-[#141426]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.checkpointRetry}
            </h3>
            <p className="text-xs text-[#626273] max-w-xs mx-auto leading-relaxed">
              {lang === "ml"
                ? "വിഷമിക്കേണ്ട! തെറ്റുകൾ സ്വാഭാവികമാണ്. പ്രധാന പാഠങ്ങൾ ഓർത്തെടുത്ത് നമുക്ക് വീണ്ടും ശ്രമിക്കാം."
                : "Making mistakes is how we learn! Review the key idea and retry without pressure."}
            </p>

            <div className="bg-[#F3F1F4] border border-[#E4E0E9] rounded-[22px] p-4 text-left">
              <span className="text-[10px] font-black text-[#7857E8] uppercase block mb-1">
                {t.concept}: {mission.concept[lang]}
              </span>
              <p className="text-xs text-[#141426] font-semibold leading-relaxed">
                {mission.objective[lang]}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setPhase("teach");
                setActivityIdx(0);
                setCheckpointIdx(0);
                setCheckpointAnswers([]);
              }}
              className="w-full h-14 rounded-full bg-[#191A22] hover:bg-black text-white font-bold text-sm tactile shadow-md flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.tryAgain}</span>
            </button>
          </div>
        )}

        {/* PHASE 5: Completion & Reflection */}
        {phase === "complete" && (
          <div className="space-y-4 text-center my-auto animate-rise">
            {/* 3D Soft Celebrating Lantern Mascot */}
            <div className="w-32 h-32 mx-auto pointer-events-none">
              <Illustration
                role="celebration"
                className="w-full h-full object-contain drop-shadow-sm"
                alt="Noor celebrating gently"
              />
            </div>

            <h2
              className="text-2xl font-black text-[#141426]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.congratulations}
            </h2>

            {/* XP Award Pill in Apricot */}
            {xpAwarded > 0 && (
              <div className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#FFD184] text-[#141426] font-black text-sm shadow-xs animate-pop">
                <Sparkles className="w-4 h-4 fill-[#141426]" />
                <span>+{xpAwarded} XP {lang === "ml" ? "നേടി!" : "Earned!"}</span>
              </div>
            )}

            {/* Chapter Badge Earned Notification */}
            {earnedBadge && (
              <div className="p-4 bg-[#FFF0D6] border border-[#FFD184] rounded-[24px] flex items-center gap-3 text-left">
                <div className="w-12 h-12 pointer-events-none shrink-0">
                  <Illustration role="collection" className="w-full h-full object-contain" alt="Badge" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-[#7857E8] uppercase block">
                    {lang === "ml" ? "പുതിയ ബാഡ്ജ് അൺലോക്ക് ആയി!" : "New Badge Unlocked!"}
                  </span>
                  <span className="text-xs font-black text-[#141426]">
                    {lang === "ml" ? "നന്മയുടെ കാവൽക്കാരൻ" : "Guardian of Good Character"}
                  </span>
                </div>
              </div>
            )}

            {/* Family Reflection Prompt */}
            {!isReviewMode && mission.family && (
              <div className="bg-[#F0E9FF] border border-[#E3D4FF] rounded-[24px] p-4 text-left space-y-2">
                <div className="flex items-center gap-1.5 text-[#7857E8]">
                  <Heart className="w-4 h-4 fill-[#7857E8]" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    {t.familyPromptTitle}
                  </span>
                </div>
                <p className="text-xs text-[#141426] font-semibold leading-relaxed">
                  "{mission.family[lang]}"
                </p>

                {/* Reflection input note */}
                <div className="pt-2">
                  <input
                    type="text"
                    value={reflectionNote}
                    onChange={(e) => setReflectionNote(e.target.value)}
                    placeholder={lang === "ml" ? "കുടുംബത്തിന്റെ അഭിപ്രായം ഇവിടെ കുറിക്കാം..." : "Record family thoughts here..."}
                    className="w-full text-xs p-3 rounded-[16px] border border-[#E4E0E9] bg-white focus:border-[#7857E8] outline-none"
                  />
                  {reflectionNote && !reflectionSaved && (
                    <button
                      type="button"
                      onClick={() => {
                        saveReflection(mission.id, reflectionNote);
                        setReflectionSaved(true);
                      }}
                      className="mt-2 text-xs font-bold text-[#7857E8] hover:underline"
                    >
                      {lang === "ml" ? "കുറിപ്പ് സേവ് ചെയ്യുക" : "Save note"}
                    </button>
                  )}
                  {reflectionSaved && (
                    <span className="text-[11px] font-bold text-[#287553] block mt-1.5">
                      {lang === "ml" ? "കുറിപ്പ് രേഖപ്പെടുത്തി!" : "Saved to parent summary!"}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Finish Action Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full h-14 rounded-full bg-[#191A22] hover:bg-black text-white font-bold text-sm tactile shadow-md transition-all"
            >
              {t.finishForToday}
            </button>
          </div>
        )}

        {/* Sticky Explanation Card after checking answer */}
        {isChecked && (phase === "activity" || phase === "checkpoint") && (
          <div
            className={`p-4 rounded-[22px] border my-3 animate-pop shadow-xs ${
              isAnswerCorrect
                ? "bg-[#287553]/15 border-[#287553] text-[#287553]"
                : "bg-[#B93848]/10 border-[#B93848] text-[#B93848]"
            }`}
          >
            <div className="flex items-center gap-1.5 font-black text-xs mb-1">
              {isAnswerCorrect ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{t.correctAnswer}</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4" />
                  <span>{t.needsReview}</span>
                </>
              )}
            </div>
            <p className="text-xs leading-relaxed opacity-95 font-medium">
              {phase === "activity" && currentActivity
                ? isAnswerCorrect
                  ? currentActivity.explainCorrect[lang]
                  : currentActivity.explainWrong[lang]
                : isAnswerCorrect
                ? checkpointQuestions[checkpointIdx].explainCorrect[lang]
                : checkpointQuestions[checkpointIdx].explainWrong[lang]}
            </p>
          </div>
        )}

        {/* Bottom Action Controls */}
        {phase === "teach" && (
          <button
            type="button"
            onClick={() => setPhase("activity")}
            className="w-full h-14 rounded-full bg-[#191A22] hover:bg-black text-white font-bold text-sm tactile shadow-md flex items-center justify-center gap-2 mt-4"
          >
            <span>{t.continue}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {phase === "activity" && (
          <div className="mt-4">
            {!isChecked ? (
              <button
                type="button"
                disabled={
                  (currentActivity.kind === "choice" && !selectedChoiceId) ||
                  (currentActivity.kind === "match" && matchedPairs.length < currentActivity.pairs.length)
                }
                onClick={handleCheckActivity}
                className="w-full h-14 rounded-full bg-[#191A22] hover:bg-black text-white font-bold text-sm tactile shadow-md disabled:opacity-40"
              >
                {t.checkAnswer}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextActivity}
                className="w-full h-14 rounded-full bg-[#191A22] hover:bg-black text-white font-bold text-sm tactile shadow-md flex items-center justify-center gap-2"
              >
                <span>{t.continue}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {phase === "checkpoint" && (
          <div className="mt-4">
            {!isChecked ? (
              <button
                type="button"
                disabled={!selectedChoiceId}
                onClick={handleCheckCheckpoint}
                className="w-full h-14 rounded-full bg-[#191A22] hover:bg-black text-white font-bold text-sm tactile shadow-md disabled:opacity-40"
              >
                {t.checkAnswer}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextCheckpoint}
                className="w-full h-14 rounded-full bg-[#191A22] hover:bg-black text-white font-bold text-sm tactile shadow-md flex items-center justify-center gap-2"
              >
                <span>{t.continue}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
