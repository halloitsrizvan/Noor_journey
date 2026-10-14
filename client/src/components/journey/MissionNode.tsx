import React from "react";
import type { Mission } from "@/lib/noor/types";
import { useNoor } from "@/lib/noor/state";
import { Check, Lock, Play, Star } from "lucide-react";

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

  // Gentle alternating horizontal offset to create a natural meandering garden path
  const offsetClasses = [
    "translate-x-0",
    "translate-x-6",
    "translate-x-0",
    "-translate-x-6",
    "translate-x-0",
  ];
  const offsetClass = offsetClasses[index % offsetClasses.length];

  const isPlayable = status === "completed" || status === "current" || status === "available";

  return (
    <div className={`flex flex-col items-center my-3 relative ${offsetClass}`}>
      {/* Node Button */}
      <button
        type="button"
        onClick={() => onSelect(mission)}
        className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-200 tactile shadow-md ${
          status === "completed"
            ? "bg-leaf text-white border-4 border-leaf-deep"
            : status === "current"
            ? "bg-primary text-white border-4 border-primary-deep animate-pulse shadow-lg scale-105 ring-4 ring-primary/20"
            : "bg-muted text-muted-foreground border-4 border-border opacity-70"
        }`}
        aria-label={`${mission.title[lang]}, status: ${status}`}
      >
        {status === "completed" && (
          <>
            <Check className="w-8 h-8 stroke-[3]" />
            <span className="text-[10px] font-extrabold tracking-tight mt-0.5">20 XP</span>
          </>
        )}

        {status === "current" && (
          <>
            <Play className="w-8 h-8 fill-white translate-x-0.5" />
            <span className="text-[10px] font-extrabold tracking-tight mt-0.5">തുടങ്ങാം</span>
          </>
        )}

        {(status === "locked" || status === "coming-soon") && (
          <>
            <Lock className="w-6 h-6" />
            <span className="text-[10px] font-semibold mt-0.5">#{mission.order}</span>
          </>
        )}

        {/* Golden star badge for mission order */}
        {status !== "locked" && (
          <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gold text-amber-950 font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
            {mission.order}
          </span>
        )}
      </button>

      {/* Mission Label Banner */}
      <div className="mt-2 text-center max-w-[150px]">
        <span
          className={`text-xs font-bold block leading-tight px-2.5 py-1 rounded-full shadow-2xs border ${
            status === "current"
              ? "bg-primary/10 border-primary/30 text-primary"
              : status === "completed"
              ? "bg-leaf-soft border-leaf/30 text-leaf-deep"
              : "bg-muted border-border text-muted-foreground"
          }`}
        >
          {mission.title[lang]}
        </span>
        <span className="text-[10px] text-muted-foreground block mt-0.5 font-medium">
          {mission.minutes} {lang === "ml" ? "മിനിറ്റ്" : "min"}
        </span>
      </div>
    </div>
  );
};
