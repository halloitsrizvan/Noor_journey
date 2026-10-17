import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNoor } from "@/lib/noor/state";
import { translations } from "@/lib/noor/i18n";
import { akhlaqChapter, avatarOptions, type AvatarOption } from "@/content/worlds-data";
import { Check, Lock, Sparkles, Star, Award, ShieldAlert, ChevronRight, User, X } from "lucide-react";
import { Illustration } from "@/components/common/Illustration";

export const CollectionScreen: React.FC = () => {
  const { lang, activeProfile, activeProgress, getTotalXp, updateAvatar, updateProfileImage } = useNoor();
  const t = translations[lang];

  const currentPoints = getTotalXp();
  const hasAkhlaqBadge = Boolean(activeProgress?.badges?.includes(akhlaqChapter.badge.id));

  const [selectedLockedAvatar, setSelectedLockedAvatar] = useState<AvatarOption | null>(null);
  const [filterTab, setFilterTab] = useState<"all" | "unlocked" | "locked">("all");

  // Calculate unlocked stats
  const unlockedAvatars = avatarOptions.filter((av) => currentPoints >= av.requiredPoints);
  const lockedAvatars = avatarOptions.filter((av) => currentPoints < av.requiredPoints);

  // Find next avatar to unlock
  const nextAvatarToUnlock = lockedAvatars.sort((a, b) => a.requiredPoints - b.requiredPoints)[0] || null;

  const filteredAvatars = avatarOptions.filter((av) => {
    const isUnlocked = currentPoints >= av.requiredPoints;
    if (filterTab === "unlocked") return isUnlocked;
    if (filterTab === "locked") return !isUnlocked;
    return true;
  });

  return (
    <div className="flex flex-col w-full space-y-6 animate-pop pb-6">
      {/* Locked Avatar Explanatory Modal via Portal to cover full viewport */}
      {selectedLockedAvatar && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLockedAvatar(null);
          }}
        >
          <div className="bg-white rounded-[32px] max-w-sm w-full p-6 sm:p-7 border-2 border-[#E4E0E9] shadow-2xl text-center animate-pop space-y-4 relative overflow-hidden">
            {/* Ambient Top Glow */}
            <div
              className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-2xl opacity-40 pointer-events-none"
              style={{ backgroundColor: selectedLockedAvatar.color }}
            />

            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setSelectedLockedAvatar(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F3F1F4] hover:bg-[#E4E0E9] text-[#626273] hover:text-[#141426] flex items-center justify-center tactile transition-all"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div
              className="w-18 h-18 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-md relative z-10 border-2 border-white"
              style={{ backgroundColor: selectedLockedAvatar.color }}
            >
              <span>{selectedLockedAvatar.emoji}</span>
            </div>

            <div className="space-y-1 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#E59700] bg-[#FFF0D6] px-3 py-1 rounded-full border border-[#FDE68A] inline-block shadow-2xs">
                {lang === "ml" ? "അവതാർ പൂട്ടിയിരിക്കുന്നു" : "Avatar Locked"}
              </span>
              <h3
                className="text-xl font-black text-[#141426] mt-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {selectedLockedAvatar.name[lang]}
              </h3>
              <p className="text-xs text-[#626273] font-medium leading-relaxed px-2">
                {selectedLockedAvatar.description[lang]}
              </p>
            </div>

            {/* Points required box */}
            <div className="bg-[#F8F7FA] rounded-2xl p-3.5 border border-[#E4E0E9] text-left relative z-10 space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-[#141426]">
                <span>{lang === "ml" ? "ആവശ്യമായ പോയിന്റ്" : "Points Required"}</span>
                <span className="text-[#7857E8] flex items-center gap-1 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current text-[#E59700]" />
                  <span>{currentPoints} / {selectedLockedAvatar.requiredPoints} XP</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-[#E4E0E9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FFD184] to-[#7857E8] transition-all duration-500 rounded-full"
                  style={{
                    width: `${Math.min(100, Math.round((currentPoints / selectedLockedAvatar.requiredPoints) * 100))}%`,
                  }}
                />
              </div>

              <span className="text-[11px] font-bold text-[#E59700] block text-center">
                {currentPoints >= selectedLockedAvatar.requiredPoints
                  ? lang === "ml"
                    ? "അൺലോക്ക് ചെയ്യാൻ തയ്യാറാണ്!"
                    : "Ready to unlock!"
                  : lang === "ml"
                  ? `ഇത് തുറക്കാൻ ${selectedLockedAvatar.requiredPoints - currentPoints} പോയിന്റുകൾ കൂടി നേടണം!`
                  : `Earn ${selectedLockedAvatar.requiredPoints - currentPoints} more points to unlock!`}
              </span>
            </div>

            <div className="pt-1 relative z-10">
              <button
                type="button"
                onClick={() => setSelectedLockedAvatar(null)}
                className="w-full py-3 rounded-full bg-[#191A22] text-[#FFD184] font-black text-xs sm:text-sm hover:bg-black tactile shadow-md transition-all"
              >
                {lang === "ml" ? "ശരി, മനസ്സിലായി 🚀" : "Got it! Continue Journey 🚀"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Apricot Feature Header with 3D Award Badge */}
      <div className="bg-[#FFD184] rounded-[28px] p-5 shadow-2xs relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10 max-w-[65%]">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#141426]/70 block mb-1">
            {lang === "ml" ? "സമ്മാനങ്ങൾ & അവതാറുകൾ" : "Milestones & Avatars"}
          </span>
          <h1
            className="text-2xl font-black text-[#141426] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.badgesTitle}
          </h1>
          <p className="text-xs text-[#141426]/80 font-medium mt-1 leading-relaxed">
            {lang === "ml"
              ? "പഠനത്തിൽ മുന്നേറി പോയിന്റുകൾ നേടുമ്പോൾ പുതിയ സുഹൃത്ത് അവതാറുകൾ തുറക്കപ്പെടും."
              : "Collectible honor badges and child companion avatars unlocked by earning points."}
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

      {/* Real-time Points & Unlock Progress Banner */}
      <div className="bg-gradient-to-r from-[#F0E9FF] to-[#E3D4FF] border border-[#7857E8]/20 rounded-[26px] p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-[#191A22] text-[#FFD184] flex items-center justify-center shrink-0 shadow-xs">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#141426] leading-none">
                {currentPoints}
              </span>
              <span className="text-xs font-black text-[#7857E8]">
                {lang === "ml" ? "പോയിന്റുകൾ" : "Points (XP)"}
              </span>
            </div>
            <span className="text-[11px] text-[#626273] font-medium block mt-0.5">
              {lang === "ml"
                ? `${unlockedAvatars.length} / ${avatarOptions.length} അവതാറുകൾ തുറന്നു`
                : `${unlockedAvatars.length} of ${avatarOptions.length} avatars unlocked`}
            </span>
          </div>
        </div>

        {/* Next Unlock Goal */}
        {nextAvatarToUnlock ? (
          <div className="w-full sm:w-64 bg-white/80 backdrop-blur-xs rounded-2xl p-2.5 border border-white/60 shadow-2xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#141426] mb-1">
              <span className="truncate flex items-center gap-1">
                <span>{nextAvatarToUnlock.emoji}</span>
                <span>{nextAvatarToUnlock.name[lang]}</span>
              </span>
              <span className="text-[#E59700] shrink-0">
                {currentPoints} / {nextAvatarToUnlock.requiredPoints}
              </span>
            </div>
            <div className="w-full h-2 bg-[#E4E0E9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7857E8] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((currentPoints / nextAvatarToUnlock.requiredPoints) * 100))}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-[#626273] block mt-1 text-right">
              {lang === "ml"
                ? `${nextAvatarToUnlock.requiredPoints - currentPoints} പോയിന്റ് കൂടി വേണം`
                : `${nextAvatarToUnlock.requiredPoints - currentPoints} pts to unlock`}
            </span>
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded-xl bg-[#EAF8E8] text-[#20721E] text-xs font-black flex items-center gap-1.5 shadow-2xs">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{lang === "ml" ? "എല്ലാ അവതാറുകളും നേടി!" : "All Avatars Unlocked!"}</span>
          </div>
        )}
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

      {/* Avatar Companions Locker (Unlocked by Points) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2
              className="text-base font-black text-[#141426]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.avatarsTitle}
            </h2>
            <p className="text-xs text-[#626273]">
              {lang === "ml"
                ? "പോയിന്റുകൾ അനുസരിച്ച് അൺലോക്ക് ചെയ്യപ്പെടുന്ന കൂട്ടുകാർ"
                : "Companion avatars unlocked based on your learning points"}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex bg-[#F3F1F4] p-1 rounded-2xl w-fit">
            <button
              type="button"
              onClick={() => setFilterTab("all")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filterTab === "all"
                  ? "bg-[#191A22] text-white shadow-2xs"
                  : "text-[#626273] hover:text-[#141426]"
              }`}
            >
              {lang === "ml" ? "എല്ലാം" : "All"} ({avatarOptions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("unlocked")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filterTab === "unlocked"
                  ? "bg-[#7857E8] text-white shadow-2xs"
                  : "text-[#626273] hover:text-[#141426]"
              }`}
            >
              {lang === "ml" ? "തുറന്നവ" : "Unlocked"} ({unlockedAvatars.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("locked")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filterTab === "locked"
                  ? "bg-[#E59700] text-white shadow-2xs"
                  : "text-[#626273] hover:text-[#141426]"
              }`}
            >
              {lang === "ml" ? "പൂട്ടിയവ" : "Locked"} ({lockedAvatars.length})
            </button>
          </div>
        </div>

        {/* Custom Uploaded Photo Card (if child has one) */}
        {activeProfile?.avatarUrl && (
          <div className="mb-3 p-4 rounded-[24px] bg-[#EAF8E8] border border-[#C5EEC2] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xs">
                <img
                  src={activeProfile.avatarUrl}
                  alt={activeProfile.nickname}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-black text-[#141426] block">
                  {lang === "ml" ? "സ്വന്തം ഫോട്ടോ (ക്ലൗഡിനറി)" : "Custom Photo (Cloudinary)"}
                </span>
                <span className="text-[11px] text-[#20721E] font-medium block">
                  {lang === "ml" ? "നിലവിലെ പ്രൊഫൈൽ ചിത്രമായി നൽകിയിരിക്കുന്നു" : "Active profile picture"}
                </span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#20721E] text-white text-[11px] font-black flex items-center gap-1 shadow-2xs">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>{lang === "ml" ? "സജീവം" : "Equipped"}</span>
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredAvatars.map((av) => {
            const isUnlocked = currentPoints >= av.requiredPoints;
            const isSelected = activeProfile?.avatarId === av.id && !activeProfile?.avatarUrl;

            return (
              <div
                key={av.id}
                onClick={() => {
                  if (isUnlocked) {
                    updateAvatar(av.id);
                  } else {
                    setSelectedLockedAvatar(av);
                  }
                }}
                className={`p-4 rounded-[24px] border text-left transition-all tactile relative overflow-hidden flex flex-col justify-between min-h-[110px] cursor-pointer ${
                  isSelected
                    ? "bg-[#F0E9FF] border-[#7857E8] shadow-xs ring-2 ring-[#7857E8]/20"
                    : isUnlocked
                    ? "bg-white border-[#E4E0E9] hover:border-[#7857E8]/50 shadow-2xs"
                    : "bg-[#F8F7F9] border-[#E4E0E9]/70 hover:border-[#FFD184] opacity-80"
                }`}
                role="button"
                tabIndex={0}
                aria-label={`${av.name[lang]}: ${isUnlocked ? "Unlocked" : "Locked"}`}
              >
                {/* Header row: Avatar Icon + Name + Status Badge */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-2xl shrink-0 shadow-2xs overflow-hidden relative"
                    style={{ backgroundColor: av.color }}
                  >
                    {av.id === "lantern-noor" ? (
                      <Illustration
                        role="avatar-amina"
                        className="w-full h-full object-cover"
                        alt="Amina avatar"
                      />
                    ) : (
                      <span>{av.emoji}</span>
                    )}

                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center text-white">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-sm font-black text-[#141426] truncate">
                        {av.name[lang]}
                      </h3>
                      {isSelected ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#7857E8] text-white text-[10px] font-black flex items-center gap-1 shrink-0 shadow-2xs">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                          <span>{lang === "ml" ? "ഉപയോഗിക്കുന്നു" : "Equipped"}</span>
                        </span>
                      ) : isUnlocked ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#EAF8E8] text-[#20721E] text-[10px] font-black shrink-0">
                          {lang === "ml" ? "സജ്ജം" : "Unlocked"}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#FFF0D6] text-[#E59700] text-[10px] font-black flex items-center gap-1 shrink-0">
                          <Lock className="w-2.5 h-2.5" />
                          <span>{av.requiredPoints} XP</span>
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-[#626273] font-medium mt-0.5 line-clamp-2 leading-tight">
                      {av.description[lang]}
                    </p>
                  </div>
                </div>

                {/* Footer status row */}
                <div className="mt-3 pt-2.5 border-t border-[#F3F1F4] flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#7857E8] bg-white/80 px-2 py-0.5 rounded-md border border-[#E4E0E9]">
                    {av.badge}
                  </span>

                  {isUnlocked ? (
                    <span className="text-[11px] font-bold text-[#7857E8] hover:underline flex items-center gap-0.5">
                      {isSelected
                        ? lang === "ml"
                          ? "സജീവം"
                          : "Active"
                        : lang === "ml"
                        ? "തിരഞ്ഞെടുക്കൂ"
                        : "Tap to equip"}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#E59700]">
                        {lang === "ml"
                          ? `${av.requiredPoints - currentPoints} പോയിന്റ് ബാക്കി`
                          : `${av.requiredPoints - currentPoints} pts left`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

