import React from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { avatarOptions } from "@/content/worlds-data";
import { Star, User, Shield } from "lucide-react";
import { Illustration } from "@/components/common/Illustration";

interface ChildHeaderProps {
  onOpenParentGate: () => void;
  onOpenProfilePicker?: () => void;
}

export const ChildHeader: React.FC<ChildHeaderProps> = ({
  onOpenParentGate,
  onOpenProfilePicker,
}) => {
  const { activeProfile, lang, getTotalXp } = useNoor();
  const t = translations[lang];
  const totalXp = getTotalXp();

  const currentAvatar =
    avatarOptions.find((a) => a.id === activeProfile?.avatarId) ?? avatarOptions[0];

  const childName = activeProfile?.nickname || (lang === "ml" ? "സയാൻ" : "Amina");

  return (
    <header className="w-full flex items-center justify-between py-3 px-1">
      {/* Left: Avatar + Greeting + XP Capsule */}
      <div className="flex items-center gap-3">
        {/* Child Avatar Button */}
        <button
          type="button"
          onClick={onOpenProfilePicker}
          className="relative w-12 h-12 rounded-full overflow-hidden bg-[#E3D4FF] border-2 border-white shadow-xs tactile shrink-0 flex items-center justify-center"
          title={t.selectAvatar}
          aria-label={`Profile: ${childName}`}
        >
          {activeProfile?.avatarId === "lantern-noor" || !activeProfile ? (
            <Illustration
              role="avatar-amina"
              className="w-full h-full object-cover"
              alt="Amina avatar"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white text-base font-bold"
              style={{ backgroundColor: currentAvatar.color }}
            >
              {childName.slice(0, 1)}
            </div>
          )}
        </button>

        {/* Greeting & XP */}
        <div className="flex flex-col leading-tight">
          <div className="flex items-baseline gap-1 text-[#141426]">
            <span className="text-sm font-medium text-[#626273]">
              {t.helloWord}
            </span>
            <span
              className="text-base font-black tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {childName}!
            </span>
          </div>

          {/* Small XP Capsule */}
          <div className="mt-0.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F0E9FF] border border-[#E3D4FF] text-[#7857E8] w-fit shadow-2xs">
            <Star className="w-3 h-3 fill-[#7857E8] text-[#7857E8]" />
            <span className="text-[11px] font-extrabold tracking-tight">
              {totalXp} XP
            </span>
          </div>
        </div>
      </div>

      {/* Right: Profile / Parent Area Action */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenParentGate}
          className="w-10 h-10 rounded-full bg-[#F3F1F4] hover:bg-[#E4E0E9] text-[#141426] flex items-center justify-center tactile border border-[#E4E0E9]/80 shadow-2xs"
          title={t.parentAreaTitle}
          aria-label="Parent controls and settings"
        >
          <User className="w-5 h-5 text-[#141426]" />
        </button>
      </div>
    </header>
  );
};
