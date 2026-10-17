import React, { useState } from "react";
import type { FatihahVerse } from "../types";
import { ArrowLeft, BookOpen, Volume2, Globe } from "lucide-react";

interface FullSurahReaderProps {
  verses: FatihahVerse[];
  lang: "ml" | "en";
  onBack: () => void;
  onSelectVerse: (verseId: string) => void;
}

export const FullSurahReader: React.FC<FullSurahReaderProps> = ({
  verses,
  lang,
  onBack,
  onSelectVerse,
}) => {
  const [showTranslation, setShowTranslation] = useState(true);

  return (
    <div className="w-full flex flex-col space-y-4 animate-pop pb-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-black text-[#626273] hover:text-[#141426] tactile transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === "ml" ? "ഫാതിഹ മെനുവിലേക്ക്" : "Back to Al-Fatihah Menu"}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowTranslation(!showTranslation)}
          className="px-3 py-1.5 rounded-full bg-white border border-[#E4E0E9] text-[11px] font-black text-[#141426] hover:bg-[#F3F1F4] tactile transition-all flex items-center gap-1.5 shadow-2xs"
        >
          <Globe className="w-3.5 h-3.5 text-[#7857E8]" />
          <span>{showTranslation ? (lang === "ml" ? "അർത്ഥം മറയ്ക്കുക" : "Hide Translation") : (lang === "ml" ? "അർത്ഥം കാണിക്കുക" : "Show Translation")}</span>
        </button>
      </div>

      {/* Surah Banner */}
      <div className="bg-[#BEDAFF] rounded-[28px] p-5 text-center shadow-2xs relative overflow-hidden">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#141426]/70 bg-white/60 px-3 py-0.5 rounded-full inline-block mb-1.5">
          Surah 1 • 7 Verses
        </span>
        <h1
          className="text-3xl sm:text-4xl font-serif font-black text-[#141426]"
          style={{ fontFamily: "'Noto Naskh Arabic', serif" }}
        >
          سُورَةُ الفَاتِحَة
        </h1>
        <p className="text-xs text-[#141426]/80 font-bold mt-1">
          {lang === "ml" ? "സൂറതുൽ ഫാതിഹ — മുഴുവൻ ആയത്തുകൾ" : "Surah Al-Fatihah — Full Reading View"}
        </p>
      </div>

      {/* 7 Verses Card Deck - Notice: No duplicate basmalah above verse 1, Verse 1 is the basmalah! */}
      <div className="space-y-3">
        {verses.map((verse) => (
          <div
            key={verse.id}
            onClick={() => onSelectVerse(verse.id)}
            className="bg-white border border-[#E3D4FF] hover:border-[#7857E8] rounded-[24px] p-5 shadow-2xs transition-all tactile cursor-pointer group"
          >
            {/* Verse Header: Number Badge */}
            <div className="flex items-center justify-between mb-2">
              <span className="w-7 h-7 rounded-full bg-[#F0E9FF] text-[#7857E8] font-black text-xs flex items-center justify-center border border-[#E3D4FF]">
                {verse.number}
              </span>

              <span className="text-[10px] font-extrabold text-[#7857E8] opacity-0 group-hover:opacity-100 transition-opacity">
                {lang === "ml" ? "പരിശീലിക്കാൻ ക്ലിക്ക് ചെയ്യുക →" : "Click to practice verse →"}
              </span>
            </div>

            {/* Arabic Uthmani Text */}
            <div
              dir="rtl"
              lang="ar"
              className="text-xl sm:text-2xl text-[#141426] leading-[2.1] font-serif text-right my-1"
              style={{
                fontFamily: "'Noto Naskh Arabic', 'Amiri', serif",
              }}
            >
              {verse.textUthmani}
            </div>

            {/* Translation (if enabled) */}
            {showTranslation && verse.translation && (
              <p className="text-xs text-[#626273] font-medium leading-relaxed mt-2 pt-2 border-t border-[#F3F1F4] text-left">
                {verse.translation[lang]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
