import React from "react";
import type { Mission } from "@/lib/noor/types";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { Clock, Play, RotateCcw, X, Lock, ArrowRight } from "lucide-react";

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
      <div className="w-full max-w-sm bg-[#FFFCF8] border border-[#E4E0E9] rounded-[28px] p-6 shadow-2xl relative text-[#141426]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F3F1F4] flex items-center justify-center text-[#626273] hover:text-[#141426] tactile"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mission Order Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full bg-[#F0E9FF] text-[#7857E8] text-xs font-black">
            {lang === "ml" ? `മിഷൻ #${mission.order}` : `Mission #${mission.order}`}
          </span>
          <span className="flex items-center gap-1 text-xs text-[#626273] font-semibold">
            <Clock className="w-3.5 h-3.5" />
            {mission.durationMinutes} {t.minutes}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-xl font-black text-[#141426] leading-tight mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {mission.title[lang]}
        </h3>

        {/* Concept Box in Neutral Surface */}
        <div className="bg-[#F3F1F4] rounded-[22px] p-4 mb-5 border border-[#E4E0E9]">
          <span className="text-[10px] font-black text-[#7857E8] uppercase tracking-wider block mb-1">
            {t.concept}
          </span>
          <p className="text-sm font-extrabold text-[#141426] mb-2">
            {mission.concept[lang]}
          </p>
          <div className="pt-2 border-t border-[#E4E0E9]">
            <span className="text-[10px] font-bold text-[#626273] uppercase tracking-wider block mb-0.5">
              {t.objective}
            </span>
            <p className="text-xs text-[#626273] leading-relaxed font-medium">
              {mission.objective[lang]}
            </p>
          </div>
        </div>

        {/* Action Button */}
        {isLocked ? (
          <div className="flex items-center gap-2.5 p-3.5 bg-[#F3F1F4] rounded-[20px] text-xs text-[#626273] font-medium border border-[#E4E0E9]">
            <Lock className="w-4 h-4 text-[#626273] shrink-0" />
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
            className="w-full h-14 rounded-full bg-[#191A22] hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md tactile transition-all"
          >
            {status === "completed" ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>{t.tryAgain}</span>
              </>
            ) : (
              <>
                <span>{t.start}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
