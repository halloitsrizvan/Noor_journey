import React from "react";
import type { Mission } from "@/lib/noor/types";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { Clock, Target, Play, RotateCcw, X, Lock } from "lucide-react";

interface MissionOverviewModalProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
  onStartMission: (mission: Mission) => void;
}

export const MissionOverviewModal: React.FC<MissionOverviewModalProps> = ({
  mission,
  isOpen,
  onClose,
  onStartMission,
}) => {
  const { lang, getMissionStatus } = useNoor();
  const t = translations[lang];

  if (!isOpen || !mission) return null;

  const status = getMissionStatus(mission.id);
  const isLocked = status === "locked" || status === "coming-soon";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-pop">
      <div className="w-full max-w-sm bg-card border-2 border-border rounded-3xl p-5 shadow-2xl relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground tactile"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mission Order Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-black">
            {lang === "ml" ? `മിഷൻ #${mission.order}` : `Mission #${mission.order}`}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
            <Clock className="w-3.5 h-3.5" />
            {mission.minutes} {t.minutes}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-black text-foreground leading-tight mb-2">
          {mission.title[lang]}
        </h3>

        {/* Concept Box */}
        <div className="bg-sand/40 border border-border/80 rounded-2xl p-3 mb-4">
          <span className="text-[10px] font-bold text-primary-deep uppercase tracking-wider block mb-0.5">
            {t.concept}
          </span>
          <p className="text-xs font-extrabold text-foreground">
            {mission.concept[lang]}
          </p>
          <div className="mt-2 pt-2 border-t border-border/60">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">
              {t.objective}
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {mission.objective[lang]}
            </p>
          </div>
        </div>

        {/* Action Button */}
        {isLocked ? (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-2xl text-xs text-muted-foreground font-medium">
            <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
            <span>
              {lang === "ml"
                ? "ഈ മിഷൻ തുറക്കാൻ മുമ്പത്തെ മിഷൻ പൂർത്തിയാക്കുക."
                : "Complete the previous mission to unlock this adventure."}
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartMission(mission);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-primary hover:bg-primary-deep text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md tactile"
          >
            {status === "completed" ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>{t.tryAgain}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{t.start} (+20 XP)</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
