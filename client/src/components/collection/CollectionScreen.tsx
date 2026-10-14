import React from "react";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { akhlaqChapter, avatarOptions } from "@/content/worlds-data";
import { LanternMascot } from "../mascot/LanternMascot";
import { Award, Check, Lock, Sparkles, User } from "lucide-react";

export const CollectionScreen: React.FC = () => {
  const { lang, activeProfile, activeProgress, updateAvatar } = useNoor();
  const t = translations[lang];

  const hasAkhlaqBadge = activeProgress?.badges.includes(akhlaqChapter.badge.id);

  return (
    <div className="flex flex-col w-full p-4 space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-gold/10 to-card border border-border/80 rounded-3xl p-4 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-black text-foreground">{t.badgesTitle}</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {lang === "ml"
              ? "പഠനത്തിൽ മുന്നേറുമ്പോൾ ലഭിക്കുന്ന അമൂല്യ സമ്മാനങ്ങൾ"
              : "Collectible milestone badges earned through completed chapters"}
          </p>
        </div>
        <LanternMascot mood="celebrate" size="sm" />
      </div>

      {/* Badges Showcase */}
      <div>
        <span className="text-xs font-black text-foreground uppercase tracking-wider block mb-2.5">
          {t.badgesTitle}
        </span>

        <div className="grid grid-cols-2 gap-3">
          {/* Chapter 1 Badge */}
          <div
            className={`p-3.5 rounded-3xl border-2 flex flex-col items-center text-center transition-all ${
              hasAkhlaqBadge
                ? "bg-amber-400/15 border-amber-400 shadow-md animate-pop"
                : "bg-muted/40 border-border opacity-70"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-xs ${
                hasAkhlaqBadge ? "bg-amber-400 text-amber-950" : "bg-muted text-muted-foreground"
              }`}
            >
              <Award className="w-8 h-8" />
            </div>

            <h4 className="text-xs font-black text-foreground leading-tight mb-1">
              {akhlaqChapter.badge.name[lang]}
            </h4>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                hasAkhlaqBadge
                  ? "bg-amber-400 text-amber-950"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {hasAkhlaqBadge ? "നേടി!" : "ലോക്ക് ചെയ്തത്"}
            </span>

            {!hasAkhlaqBadge && (
              <span className="text-[9px] text-muted-foreground mt-1.5 leading-tight">
                {lang === "ml" ? "അധ്യായം 1 പൂർത്തിയാക്കുക" : "Complete Chapter 1"}
              </span>
            )}
          </div>

          {/* Locked Future Badge Preview */}
          <div className="p-3.5 rounded-3xl border-2 border-border/60 bg-muted/30 flex flex-col items-center text-center opacity-60">
            <div className="w-14 h-14 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mb-2">
              <Lock className="w-6 h-6" />
            </div>

            <h4 className="text-xs font-bold text-muted-foreground leading-tight mb-1">
              {lang === "ml" ? "അടിത്തറകളുടെ ദീപം" : "Pillar of Knowledge"}
            </h4>

            <span className="text-[10px] font-semibold text-muted-foreground">
              {t.comingSoon}
            </span>
          </div>
        </div>
      </div>

      {/* Avatar Companions Locker */}
      <div>
        <span className="text-xs font-black text-foreground uppercase tracking-wider block mb-2.5">
          {t.avatarsTitle}
        </span>

        <div className="grid grid-cols-2 gap-2.5">
          {avatarOptions.map((av) => {
            const isSelected = activeProfile?.avatarId === av.id;

            return (
              <button
                key={av.id}
                type="button"
                onClick={() => updateAvatar(av.id)}
                className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all text-left tactile ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/20"
                    : "border-border/80 bg-card hover:border-primary/40"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-base font-extrabold shadow-2xs shrink-0 relative"
                  style={{ backgroundColor: av.color }}
                >
                  {av.name[lang].slice(0, 1)}
                  {isSelected && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                <div className="overflow-hidden">
                  <h5 className="text-xs font-bold text-foreground truncate">
                    {av.name[lang]}
                  </h5>
                  <span className="text-[10px] text-muted-foreground block truncate">
                    {av.badge}
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
