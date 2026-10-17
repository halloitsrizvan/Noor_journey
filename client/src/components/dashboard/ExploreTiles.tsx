import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { akhlaqMissions } from "@/content/chapter-akhlaq";
import { ArrowRight, ChevronRight, Clock, Gamepad2, Sparkles } from "lucide-react";
import { Illustration } from "@/components/common/Illustration";

interface ExploreTilesProps {
  onOpenJourney?: () => void;
  onOpenPractice: () => void;
  onOpenTajweed?: () => void;
}

export const ExploreTiles: React.FC<ExploreTilesProps> = ({
  onOpenJourney,
  onOpenPractice,
  onOpenTajweed,
}) => {
  const navigate = useNavigate();
  const { lang, activeProgress, getDueReviews } = useNoor();
  const t = translations[lang];

  const dueReviews = getDueReviews();

  const handleOpenGame = () => {
    navigate({ to: "/games" });
  };

  return (
    <section aria-label={t.keepExploring} className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-lg font-black text-[#141426]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t.keepExploring}
        </h3>
        {onOpenJourney && (
          <button
            type="button"
            onClick={onOpenJourney}
            className="text-xs font-bold text-[#7857E8] hover:underline flex items-center gap-0.5"
          >
            <span>{t.seeAll}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Single Prominent Pastel Tile: Islamic Mini-Game (Earn XP) */}
      <div
        onClick={handleOpenGame}
        className="relative overflow-hidden bg-gradient-to-r from-[#FFD184] via-[#FFE4B5] to-[#FFD184] rounded-[26px] p-5 shadow-2xs border border-[#FFBF5F]/40 cursor-pointer tactile group flex items-center justify-between"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleOpenGame()}
        aria-label={lang === "ml" ? "ഇസ്ലാമിക് ഗെയിംസ്" : "Islamic Mini-Games"}
      >
        <div className="relative z-10 max-w-[72%]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#191A22] text-[#FFD184] text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1">
              <Gamepad2 className="w-3 h-3" />
              <span>+10 XP</span>
            </span>
            <span className="text-[10px] font-extrabold text-[#7A4B00]">
              {lang === "ml" ? "മിനി ഗെയിംസ്" : "Mini Games"}
            </span>
          </div>

          <h4
            className="text-lg font-black text-[#141426] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {lang === "ml" ? "ഇസ്ലാമിക് ഗെയിംസ്" : "Islamic Games & Quizzes"}
          </h4>

          <p className="text-xs text-[#141426]/80 font-medium mt-1 leading-relaxed">
            {lang === "ml"
              ? "പ്രവാചക ക്വിസ്, അറബിക് വേഡ് മാച്ച്, സുന്നത്ത് ശീലങ്ങൾ കളിച്ച് XP നേടാം!"
              : "Play Prophet stories quiz, Arabic word match & Sunnah catcher to earn XP!"}
          </p>

          <div className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#191A22] text-[#FFD184] text-xs font-bold shadow-xs group-hover:scale-105 transition-transform">
            <span>{lang === "ml" ? "കളിച്ചു തുടങ്ങാം" : "Play & Earn XP"}</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Joyful Game Controller Icon */}
        <div className="text-5xl sm:text-6xl -mr-1 select-none transform group-hover:scale-110 transition-transform drop-shadow-xs">
          🎮
        </div>
      </div>
    </section>
  );
};
