import React from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { avatarOptions } from "@/content/worlds-data";
import { Star, User, Lock, LogOut } from "lucide-react";
import { Illustration } from "@/components/common/Illustration";

interface ChildHeaderProps {
  onOpenParentGate?: () => void;
  onOpenProfilePicker?: () => void;
  onSwitchStudent?: () => void;
}

export const ChildHeader: React.FC<ChildHeaderProps> = ({
  onOpenProfilePicker,
  onSwitchStudent,
}) => {
  const { activeProfile, lang, getTotalXp, getNoorStars } = useNoor();
  const t = translations[lang];
  const totalXp = getTotalXp();

  const currentAvatar =
    avatarOptions.find((a) => a.id === activeProfile?.avatarId) ?? avatarOptions[0];

  const childName = activeProfile?.nickname || (lang === "ml" ? "സയാൻ" : "Amina");

  return (
    <div className="w-full flex items-center justify-between py-2 px-0.5">
      {/* Left: Avatar + Greeting + XP Capsule */}
      <div className="flex items-center gap-3">
        {/* Child Avatar Button: Opens Profile */}
        <button
          type="button"
          onClick={onOpenProfilePicker}
          className="relative w-12 h-12 rounded-full overflow-hidden bg-[#E3D4FF] border-2 border-white shadow-xs tactile shrink-0 flex items-center justify-center hover:scale-105 transition-transform"
          title={lang === "ml" ? "പ്രൊഫൈൽ" : "Student Profile"}
          aria-label={`Profile: ${childName}`}
        >
          {activeProfile?.avatarUrl ? (
            <img
              src={activeProfile.avatarUrl}
              alt={childName}
              className="w-full h-full object-cover"
            />
          ) : activeProfile?.avatarId === "lantern-noor" || !activeProfile ? (
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
              <span>{currentAvatar.emoji || childName.slice(0, 1)}</span>
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

          {/* Small XP & Noor Stars Capsule */}
          <div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F0E9FF] border border-[#E3D4FF] text-[#7857E8] w-fit shadow-2xs">
              <span className="text-[11px] font-extrabold tracking-tight">
                ⚡ {totalXp} XP
              </span>
            </div>
            <div
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF4DB] border border-[#FDE68A] text-[#B45309] w-fit shadow-2xs"
              title={lang === "ml" ? "നൂർ നക്ഷത്രങ്ങൾ" : "Noor Stars"}
            >
              <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
              <span className="text-[11px] font-extrabold tracking-tight">
                {getNoorStars()} {lang === "ml" ? "നക്ഷത്രങ്ങൾ" : "Stars"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">

        {/* Profile Button: ALWAYS opens Profile page */}
        <button
          type="button"
          onClick={onOpenProfilePicker}
          className="w-10 h-10 rounded-full bg-[#F0E9FF] hover:bg-[#E3D4FF] text-[#7857E8] flex items-center justify-center tactile border border-[#E3D4FF] shadow-2xs transition-all"
          title={lang === "ml" ? "വിദ്യാർത്ഥി പ്രൊഫൈൽ" : "Student Profile"}
          aria-label={lang === "ml" ? "വിദ്യാർത്ഥി പ്രൊഫൈൽ" : "Student Profile"}
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
