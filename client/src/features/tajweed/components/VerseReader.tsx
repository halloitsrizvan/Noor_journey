import React from "react";
import type { FatihahVerse } from "../types";
import { deriveVerseWords } from "../types";
import { ChevronRight, ChevronLeft, BookOpen, Volume2 } from "lucide-react";

interface VerseReaderProps {
  verse: FatihahVerse;
  lang: "ml" | "en";
  selectedWordIndex?: number | null;
  onSelectWord?: (wordIndex: number) => void;
  onPrevVerse?: () => void;
  onNextVerse?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const VerseReader: React.FC<VerseReaderProps> = ({
  verse,
  lang,
  selectedWordIndex,
  onSelectWord,
  onPrevVerse,
  onNextVerse,
  hasPrev = false,
  hasNext = false,
}) => {
  const words = deriveVerseWords(verse.textUthmani, verse.id);

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      {/* Verse Number & Badge */}
      <div className="flex items-center justify-between w-full px-2">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#7857E8] bg-[#F0E9FF] border border-[#E3D4FF] px-3 py-1 rounded-full shadow-2xs">
          {lang === "ml" ? `ആയത്ത് ${verse.number} / 7` : `Verse ${verse.number} of 7`}
        </span>

        <span className="text-[11px] font-bold text-[#626273]">
          {verse.verseKey} • Uthmani Script
        </span>
      </div>

      {/* Main Arabic Card */}
      <div className="w-full bg-white border border-[#E3D4FF] rounded-[28px] p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col items-center text-center">
        {/* Soft Lavender Background Glow */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-[#F0E9FF]/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-[#FFF0D6]/40 rounded-full blur-2xl pointer-events-none" />

        {/* Verse Number Decorative Marker */}
        <div className="w-9 h-9 rounded-full bg-[#F0E9FF] border border-[#E3D4FF] text-[#7857E8] font-black text-xs flex items-center justify-center mb-4 shadow-2xs">
          <span>{verse.number}</span>
        </div>

        {/* Arabic Verified Text - Using intact words preserving Arabic Shaping and Diacritics */}
        <div
          dir="rtl"
          lang="ar"
          className="text-2xl sm:text-3xl md:text-4xl text-[#141426] leading-[2.2] tracking-normal max-w-full font-serif my-2 selection:bg-[#FFD184]"
          style={{
            fontFamily: "'Noto Naskh Arabic', 'Amiri', 'Traditional Arabic', serif",
            wordSpacing: "0.25rem",
          }}
        >
          {words.map((w) => {
            const isSelected = selectedWordIndex === w.wordIndex;
            return (
              <span
                key={w.id}
                onClick={() => onSelectWord && onSelectWord(w.wordIndex)}
                className={`inline-block mx-1 px-1.5 py-0.5 rounded-xl transition-all ${
                  onSelectWord ? "cursor-pointer tactile" : ""
                } ${
                  isSelected
                    ? "bg-[#FFD184] text-[#141426] ring-2 ring-[#E59700] shadow-2xs"
                    : "hover:bg-[#F0E9FF]"
                }`}
              >
                {w.text}
              </span>
            );
          })}
        </div>

        {/* Translation / Meaning */}
        {verse.translation && (
          <div className="mt-5 pt-4 border-t border-[#F3F1F4] w-full text-center">
            <p className="text-xs sm:text-sm text-[#141426]/80 font-medium leading-relaxed max-w-md mx-auto">
              "{verse.translation[lang]}"
            </p>
          </div>
        )}
      </div>

      {/* Navigation Controls: Previous / Next Verse */}
      {(onPrevVerse || onNextVerse) && (
        <div className="flex items-center justify-between w-full pt-1 px-1">
          <button
            type="button"
            onClick={onPrevVerse}
            disabled={!hasPrev}
            className="px-4 py-2 rounded-2xl bg-white border border-[#E4E0E9] text-xs font-black text-[#141426] hover:bg-[#F3F1F4] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 tactile transition-all shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{lang === "ml" ? "മുമ്പത്തെ ആയത്ത്" : "Previous Verse"}</span>
          </button>

          <button
            type="button"
            onClick={onNextVerse}
            disabled={!hasNext}
            className="px-4 py-2 rounded-2xl bg-[#191A22] text-white hover:bg-black text-xs font-black disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 tactile transition-all shadow-2xs"
          >
            <span>{lang === "ml" ? "അടുത്ത ആയത്ത്" : "Next Verse"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
