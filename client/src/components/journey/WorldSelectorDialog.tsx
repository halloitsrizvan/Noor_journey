import React from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { worlds } from "@/content/worlds-data";
import { Compass, CheckCircle2, Lock, X } from "lucide-react";

interface WorldSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWorldId: string;
  onSelectWorld: (worldId: string) => void;
}

export const WorldSelectorModal: React.FC<WorldSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedWorldId,
  onSelectWorld,
}) => {
  const { lang } = useNoor();
  const t = translations[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-pop">
      <div className="w-full max-w-sm max-h-[85vh] bg-[#FFFCF8] border border-[#E4E0E9] rounded-[28px] p-6 shadow-2xl flex flex-col relative text-[#141426]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E0E9] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E3D4FF] text-[#7857E8] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h3
              className="text-lg font-black text-[#141426]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.switchWorld}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3F1F4] flex items-center justify-center text-[#626273] hover:text-[#141426] tactile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Worlds List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {worlds.map((world) => {
            const isCurrent = world.id === selectedWorldId;
            return (
              <div
                key={world.id}
                onClick={() => {
                  if (world.playable) {
                    onSelectWorld(world.id);
                    onClose();
                  }
                }}
                className={`p-4 rounded-[22px] border transition-all ${
                  world.playable
                    ? "cursor-pointer hover:border-[#7857E8]/50 bg-white tactile"
                    : "opacity-60 bg-[#F3F1F4]/60 cursor-default"
                } ${
                  isCurrent ? "border-[#7857E8] bg-[#F0E9FF] shadow-xs" : "border-[#E4E0E9]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm font-black text-[#141426]">
                        {world.title[lang]}
                      </span>
                      {world.playable ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#287553]/15 text-[#287553] font-bold text-[10px]">
                          {lang === "ml" ? "ലഭ്യമാണ്" : "Available"}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#F3F1F4] text-[#626273] font-semibold text-[10px] flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          {t.comingSoon}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#626273] leading-snug font-medium">
                      {world.blurb[lang]}
                    </p>
                  </div>
                  {isCurrent && (
                    <CheckCircle2 className="w-5 h-5 text-[#7857E8] shrink-0 mt-0.5" />
                  )}
                </div>

                {/* Preview Topics */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {world.previewTopics.map((top, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-[#F3F1F4] text-[10px] font-semibold text-[#141426]"
                    >
                      {top[lang]}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
