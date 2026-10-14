import React from "react";
import type { Mission } from "@/lib/noor/types";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { Check, Lock, Play, Clock, Sparkles } from "lucide-react";

interface MissionNodeProps {
  mission: Mission;
  status: "completed" | "current" | "available" | "locked" | "coming-soon";
  index: number;
  onSelect: (mission: Mission) => void;
}

export const MissionNode: React.FC<MissionNodeProps> = ({
  mission,
  status,
  index,
  onSelect,
}) => {
  const { lang } = useNoor();
  const t = translations[lang];

  // Gentle alternating horizontal offset
  const offsetClasses = [
    "translate-x-0",
    "translate-x-8",
    "translate-x-0",
    "-translate-x-8",
    "translate-x-0",
  ];
  const offsetClass = offsetClasses[index % offsetClasses.length];

  const statusLabel = {
    completed: t.completed,
    current: t.start,
    available: t.available,
    locked: t.locked,
    "coming-soon": t.comingSoon,
  }[status];

  return (
    <div className={`flex flex-col items-center my-4 relative ${offsetClass}`}>
      {/* Node Button */}
      <button
        type="button"
        onClick={() => onSelect(mission)}
        className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-200 tactile shadow-sm ${
          status === "completed"
            ? "bg-[#7857E8] text-white border-4 border-white ring-4 ring-[#7857E8]/20"
            : status === "current"
            ? "bg-[#E3D4FF] text-[#141426] border-4 border-[#191A22] shadow-md scale-105"
            : status === "available"
            ? "bg-[#FFD184] text-[#141426] border-4 border-white shadow-xs"
            : "bg-[#F3F1F4] text-[#626273] border-2 border-[#E4E0E9] opacity-75"
        }`}
        aria-label={`${mission.title[lang]} — ${statusLabel}`}
      >
        {status === "completed" && (
          <>
            <Check className="w-8 h-8 stroke-[3]" />
            <span className="text-[10px] font-black tracking-tight mt-0.5">20 XP</span>
          </>
        )}

        {status === "current" && (
          <>
            <Play className="w-7 h-7 fill-[#141426] translate-x-0.5" />
            <span className="text-[10px] font-black tracking-tight mt-0.5">
              {lang === "ml" ? "തുടങ്ങാം" : "Start"}
            </span>
          </>
        )}

        {status === "available" && (
          <>
            <Sparkles className="w-6 h-6 text-[#141426]" />
            <span className="text-[10px] font-black tracking-tight mt-0.5">
              #{mission.order}
            </span>
          </>
        )}

        {status === "locked" && (
          <>
            <Lock className="w-6 h-6 text-[#626273]" />
            <span className="text-[10px] font-bold text-[#626273] mt-0.5">
              {t.locked}
            </span>
          </>
        )}

        {status === "coming-soon" && (
          <>
            <Clock className="w-6 h-6 text-[#626273]" />
            <span className="text-[9px] font-bold text-[#626273] mt-0.5">
              {t.comingSoon}
            </span>
          </>
        )}

        {/* Small index badge on top */}
        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#191A22] text-white font-black text-[11px] flex items-center justify-center border-2 border-white shadow-xs">
          {mission.order}
        </span>
      </button>

      {/* Mission Label Banner */}
      <div className="mt-2 text-center max-w-[160px]">
        <span
          className={`text-xs font-bold block leading-tight px-3 py-1.5 rounded-full shadow-2xs border ${
            status === "current"
              ? "bg-[#191A22] text-white border-transparent"
              : status === "completed"
              ? "bg-[#F0E9FF] text-[#7857E8] border-[#E3D4FF]"
              : "bg-white text-[#141426] border-[#E4E0E9]"
          }`}
        >
          {mission.title[lang]}
        </span>
        <span className="text-[11px] text-[#626273] block mt-1 font-semibold">
          {mission.durationMinutes} {t.minutes}
        </span>
      </div>
    </div>
  );
};
