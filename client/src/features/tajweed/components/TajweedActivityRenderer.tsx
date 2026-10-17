import React, { useState } from "react";
import type { DraftKnowledgeActivity, FatihahVerse } from "../types";
import { deriveVerseWords } from "../types";
import { CheckCircle2, AlertCircle, Sparkles, HelpCircle } from "lucide-react";

interface TajweedActivityRendererProps {
  activity: DraftKnowledgeActivity;
  verse: FatihahVerse;
  lang: "ml" | "en";
  onPassed: () => void;
}

export const TajweedActivityRenderer: React.FC<TajweedActivityRendererProps> = ({
  activity,
  verse,
  lang,
  onPassed,
}) => {
  const words = deriveVerseWords(verse.textUthmani, verse.id);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectOption = (optionId: string) => {
    if (isAnswered && isCorrect) return;

    setSelectedOptionId(optionId);
    const correct = activity.correctOptionIds.includes(optionId);
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      onPassed();
    }
  };

  return (
    <div className="w-full bg-[#FFF0D6] border border-[#FFD184] rounded-[26px] p-5 shadow-2xs space-y-4">
      {/* Activity Header with Draft Preview Tag */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FFD184] text-[#141426] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-black text-[#141426] block">
              {lang === "ml" ? "തജ്‌വീദ് ചോദ്യം" : "Tajweed Practice Check"}
            </span>
            <span className="text-[10px] text-[#626273] font-bold uppercase tracking-wider">
              {activity.reviewStatus === "draft"
                ? lang === "ml"
                  ? "ഡ്രാഫ്റ്റ് പ്രിവ്യൂ • അധ്യാപക പരിശോധനയിൽ"
                  : "Draft Preview • In Review"
                : "Approved"}
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold text-[#E59700] bg-white px-2.5 py-1 rounded-full border border-[#FFD184]">
          Verse {verse.number}
        </span>
      </div>

      {/* Activity Prompt */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#FFD184]/60">
        <p className="text-sm font-black text-[#141426] leading-snug">
          {activity.prompt[lang]}
        </p>
      </div>

      {/* Interactive Word Options (Large Arabic Buttons) */}
      <div className="grid grid-cols-2 gap-2.5" dir="rtl">
        {activity.options.map((opt) => {
          const wordObj = words[opt.wordIndex ?? 0];
          const isSelected = selectedOptionId === opt.id;
          const isThisCorrect = activity.correctOptionIds.includes(opt.id);

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelectOption(opt.id)}
              className={`p-3.5 rounded-2xl border-2 font-serif text-2xl text-center transition-all tactile leading-loose ${
                isSelected
                  ? isCorrect
                    ? "bg-[#287553]/15 border-[#287553] text-[#287553] shadow-xs"
                    : "bg-[#B93848]/15 border-[#B93848] text-[#B93848]"
                  : "bg-white border-[#E4E0E9] text-[#141426] hover:border-[#FFD184] hover:bg-[#FFF8EE]"
              }`}
              style={{
                fontFamily: "'Noto Naskh Arabic', 'Amiri', serif",
              }}
            >
              <span>{wordObj?.text || ""}</span>
            </button>
          );
        })}
      </div>

      {/* Answer Feedback */}
      {isAnswered && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-semibold animate-pop flex items-start gap-2.5 ${
            isCorrect
              ? "bg-[#287553]/10 border-[#287553]/30 text-[#287553]"
              : "bg-[#B93848]/10 border-[#B93848]/30 text-[#B93848]"
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#287553]" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#B93848]" />
          )}

          <div className="space-y-0.5">
            <span className="font-black block">
              {isCorrect
                ? lang === "ml"
                  ? "മികച്ച ഉത്തരം!"
                  : "Correct!"
                : lang === "ml"
                ? "വീണ്ടും ശ്രമിക്കൂ"
                : "Not quite, try another word:"}
            </span>
            <p className="text-[11px] leading-relaxed text-[#141426]/80 font-medium">
              {activity.feedback[lang]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
