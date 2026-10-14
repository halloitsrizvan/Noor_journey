import React from "react";
import { useNoor } from "@/lib/noor/state";
import { translations, subjectNames } from "@/lib/noor/i18n";
import type { Mission } from "@/lib/noor/types";
import { BookOpen, ArrowRight } from "lucide-react";
import { Illustration } from "@/components/common/Illustration";

interface MissionHeroProps {
  mission: Mission;
  onContinue: (mission: Mission) => void;
}

export const MissionHero: React.FC<MissionHeroProps> = ({ mission, onContinue }) => {
  const { lang } = useNoor();
  const t = translations[lang];

  const subjectLabel =
    subjectNames[mission.subjectId]?.[lang] ||
    (lang === "ml" ? "അഖ്ലാഖ്" : "Akhlaq");

  return (
    <section
      aria-label={t.todaysMissionTag}
      className="relative overflow-hidden bg-[#E3D4FF] rounded-[28px] p-5 shadow-2xs flex flex-col justify-between min-h-[190px]"
    >
      {/* Decorative Floating Sparkles */}
      <span className="absolute top-3 right-28 text-violet-400 text-xs select-none pointer-events-none opacity-60">
        ✦
      </span>
      <span className="absolute bottom-12 right-3 text-amber-400 text-sm select-none pointer-events-none opacity-80">
        ★
      </span>

      {/* Text Content */}
      <div className="relative z-10 max-w-[58%] flex flex-col justify-between">
        <div>
          {/* Tracking Tag */}
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#7857E8] mb-1">
            {t.todaysMissionTag}
          </span>

          {/* Mission Title */}
          <h2
            className="text-xl sm:text-2xl font-black text-[#141426] leading-tight line-clamp-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {mission.title[lang]}
          </h2>

          {/* Duration & Subject Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-[#626273] font-semibold mt-1.5 mb-4">
            <BookOpen className="w-3.5 h-3.5 text-[#7857E8]" />
            <span>
              {mission.durationMinutes} {t.minutes}
            </span>
            <span className="text-[#626273]/60">•</span>
            <span>{subjectLabel}</span>
          </div>
        </div>

        {/* Continue Dark Pill Button */}
        <button
          type="button"
          onClick={() => onContinue(mission)}
          className="inline-flex items-center justify-center gap-2 bg-[#191A22] hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-sm transition-all tactile w-fit"
          aria-label={`${t.continue} ${mission.title[lang]}`}
        >
          <span>{t.continue}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3D Reading Lantern Illustration on the Right */}
      <div className="absolute -bottom-2 -right-3 w-40 h-40 sm:w-44 sm:h-44 pointer-events-none z-0">
        <Illustration
          role="mission-reading"
          className="w-full h-full object-contain drop-shadow-sm"
          alt="Noor the lantern reading a book"
        />
      </div>
    </section>
  );
};
