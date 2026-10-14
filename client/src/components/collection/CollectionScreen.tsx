import React from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { akhlaqChapter, avatarOptions } from "@/content/worlds-data";
import { Check, Lock, Sparkles } from "lucide-react";
import { Illustration } from "@/components/common/Illustration";

export const CollectionScreen: React.FC = () => {
  const { lang, activeProfile, activeProgress, updateAvatar } = useNoor();
  const t = translations[lang];

  const hasAkhlaqBadge = activeProgress?.badges.includes(akhlaqChapter.badge.id);

  return (
    <div className="flex flex-col w-full space-y-6 animate-pop pb-6">
      {/* Apricot Feature Header with 3D Award Badge */}
      <div className="bg-[#FFD184] rounded-[28px] p-5 shadow-2xs relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10 max-w-[65%]">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#141426]/70 block mb-1">
            {lang === "ml" ? "സമ്മാനങ്ങൾ" : "Milestones"}
          </span>
          <h1
            className="text-2xl font-black text-[#141426] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.badgesTitle}
          </h1>
          <p className="text-xs text-[#141426]/80 font-medium mt-1 leading-relaxed">
            {lang === "ml"
              ? "പഠനത്തിൽ മുന്നേറുമ്പോൾ ലഭിക്കുന്ന അമൂല്യ ബാഡ്ജുകളും സുഹൃത്ത് അവതാറുകളും."
              : "Collectible honor badges and child companion avatars earned through learning."}
          </p>
        </div>

        {/* 3D Award Badge Illustration */}
        <div className="w-24 h-24 shrink-0 -mr-2 pointer-events-none">
          <Illustration
            role="collection"
            className="w-full h-full object-contain drop-shadow-2xs"
            alt="Gold honor star badge"
          />
        </div>
      </div>

      {/* Badges Showcase */}
      <div>
        <h2
          className="text-base font-black text-[#141426] mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t.badgesTitle}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {/* Chapter 1 Akhlaq Badge */}
          <div
            className={`p-4 rounded-[26px] border flex flex-col items-center text-center transition-all ${
              hasAkhlaqBadge
                ? "bg-[#FFF0D6] border-[#FFD184] shadow-xs"
                : "bg-white border-[#E4E0E9]"
            }`}
          >
            <div className="w-16 h-16 mb-2 pointer-events-none flex items-center justify-center">
              {hasAkhlaqBadge ? (
                <Illustration
                  role="collection"
                  className="w-full h-full object-contain"
                  alt="Earned star badge"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#F3F1F4] border border-[#E4E0E9] flex items-center justify-center text-[#626273]">
                  <Lock className="w-5 h-5" />
                </div>
              )}
            </div>

            <h3
              className="text-xs font-black text-[#141426] leading-tight mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {akhlaqChapter.badge.name[lang]}
            </h3>

            <span
              className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                hasAkhlaqBadge
                  ? "bg-[#7857E8] text-white"
                  : "bg-[#F3F1F4] text-[#626273]"
              }`}
            >
              {hasAkhlaqBadge ? (lang === "ml" ? "നേടി!" : "Earned!") : t.locked}
            </span>

            {!hasAkhlaqBadge && (
              <span className="text-[10px] text-[#626273] mt-1.5 leading-tight">
                {lang === "ml" ? "അധ്യായം 1 പൂർത്തിയാക്കുക" : "Complete Chapter 1"}
              </span>
            )}
          </div>

          {/* Locked Future Milestone Badge */}
          <div className="p-4 rounded-[26px] border border-[#E4E0E9] bg-[#F3F1F4]/50 flex flex-col items-center text-center opacity-70">
            <div className="w-12 h-12 rounded-full bg-[#E4E0E9] flex items-center justify-center text-[#626273] my-2">
              <Lock className="w-5 h-5" />
            </div>

            <h3
              className="text-xs font-black text-[#626273] leading-tight mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {lang === "ml" ? "അടിത്തറകളുടെ ദീപം" : "Pillar of Knowledge"}
            </h3>

            <span className="text-[10px] font-bold text-[#626273]">
              {t.comingSoon}
            </span>
          </div>
        </div>
      </div>

      {/* Avatar Companions Locker */}
      <div>
        <h2
          className="text-base font-black text-[#141426] mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t.avatarsTitle}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {avatarOptions.map((av) => {
            const isSelected = activeProfile?.avatarId === av.id;

            return (
              <button
                key={av.id}
                type="button"
                onClick={() => updateAvatar(av.id)}
                className={`p-3.5 rounded-[22px] border text-left transition-all tactile flex items-center gap-3 ${
                  isSelected
                    ? "bg-[#F0E9FF] border-[#7857E8] shadow-xs"
                    : "bg-white border-[#E4E0E9] hover:border-[#7857E8]/40"
                }`}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0 shadow-2xs overflow-hidden"
                  style={{ backgroundColor: av.color }}
                >
                  {av.id === "lantern-noor" ? (
                    <Illustration
                      role="avatar-amina"
                      className="w-full h-full object-cover"
                      alt="Amina avatar"
                    />
                  ) : (
                    av.name[lang].slice(0, 1)
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#141426] truncate">
                      {av.name[lang]}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#7857E8] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#626273] block truncate">
                    {av.description[lang]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
