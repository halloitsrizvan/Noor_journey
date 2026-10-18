import React, { useState, useEffect } from "react";
import { useNoor } from "@/lib/noor/state";
import { Check, Calendar, Sparkles } from "lucide-react";
import { sfx } from "@/lib/sound/sfx";

interface IbadahHabit {
  id: string;
  nameEn: string;
  nameMl: string;
  subEn: string;
  subMl: string;
  icon: string;
}

const DAILY_HABITS: IbadahHabit[] = [
  {
    id: "fardh-swalah",
    nameEn: "5 Daily Swalah",
    nameMl: "5 നേരത്തെ ഫർള് നമസ്കാരം",
    subEn: "Subhi, Dhuhr, Asr, Maghrib & Isha",
    subMl: "സുബ്ഹി, ളുഹ്ർ, അസ്വർ, മഗ്‌രിബ്, ഇശാഅ്",
    icon: "🕌",
  },
  {
    id: "sunnah-swalah",
    nameEn: "Sunnah Swalah",
    nameMl: "സുന്നത്ത് നമസ്കാരങ്ങൾ",
    subEn: "Rawatib, Duha, or Witr",
    subMl: "റവാതിബ്, ളുഹാ, വിത്ർ",
    icon: "✨",
  },
  {
    id: "quran-tilawah",
    nameEn: "Holy Quran Recitation",
    nameMl: "വിശുദ്ധ ഖുർആൻ ഓത്ത്",
    subEn: "Today's Surah or Verses",
    subMl: "ഇന്നത്തെ സൂറത്ത് അല്ലെങ്കിൽ ആയത്തുകൾ",
    icon: "📖",
  },
  {
    id: "basic-dhikr",
    nameEn: "Basic Dhikr & Duas",
    nameMl: "അടിസ്ഥാന ദിക്റുകളും ദുആകളും",
    subEn: "SubhanAllah, Alhamdulillah, Istighfar",
    subMl: "സുബ്ഹാനല്ലാഹ്, അൽഹംദുലില്ലാഹ്, ഇസ്തിഗ്ഫാർ",
    icon: "🤲",
  },
  {
    id: "swalath-prophet",
    nameEn: "Swalath upon Prophet ﷺ",
    nameMl: "നബി ﷺ യുടെ മേൽ സ്വലാത്ത്",
    subEn: "Sending blessings upon Rasulullah ﷺ",
    subMl: "അന്ത്യപ്രവാചകന്റെ മേൽ സ്വലാത്ത് ചൊല്ലൽ",
    icon: "💚",
  },
];

export const DailyIbadahRevisionTracker: React.FC = () => {
  const { lang, activeProfile, awardXp } = useNoor();

  // Format today's date key: YYYY-MM-DD
  const todayDate = new Date();
  const todayKey = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}`;

  const childId = activeProfile?.id || "default";
  const storageKey = `noor_ibadah_tracker_${childId}_${todayKey}`;

  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [justAwardedId, setJustAwardedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setCompletedMap(JSON.parse(raw));
      } else {
        setCompletedMap({});
      }
    } catch {}
  }, [storageKey]);

  const toggleHabit = (id: string) => {
    const isNowDone = !completedMap[id];
    setCompletedMap((prev) => {
      const updated = {
        ...prev,
        [id]: isNowDone,
      };
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (isNowDone) {
      sfx.xp();
      // Award 2 XP per marked worship/revision habit for today (deduplicated per child, date & habit)
      const dedupeKey = `ibadah-${childId}-${todayKey}-${id}`;
      awardXp(2, "activity", dedupeKey);
      setJustAwardedId(id);
      setTimeout(() => {
        setJustAwardedId((curr) => (curr === id ? null : curr));
      }, 2500);
    } else {
      sfx.click();
    }
  };

  const completedCount = DAILY_HABITS.filter((h) => !!completedMap[h.id]).length;
  const totalCount = DAILY_HABITS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Human friendly today label
  const formattedDate = todayDate.toLocaleDateString(lang === "ml" ? "ml-IN" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white border border-[#E4E0E9] rounded-[26px] p-5 shadow-2xs space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F3F1F4]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#191A22]" />
            <h3
              className="text-base sm:text-lg font-black text-[#141426]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {lang === "ml" ? "ഇന്നത്തെ ഇബാദത്ത് റിവിഷൻ" : "Today's Worship & Revision"}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#626273] font-medium mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-[#626273]" />
            <span>{lang === "ml" ? `ഇന്ന്: ${formattedDate}` : `Today: ${formattedDate}`}</span>
            <span className="text-[#626273]/40">•</span>
            <span className="text-[#141426] font-bold">
              {lang === "ml" ? "ഓരോന്നിനും +2 XP" : "+2 XP for each"}
            </span>
          </div>
        </div>

        {/* Calm Completion Pill */}
        <div className="text-right shrink-0">
          <span className="text-xs font-black text-[#141426] bg-[#F3F1F4] border border-[#E4E0E9] px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span>{completedCount} / {totalCount}</span>
            <span className="text-[#626273]/40">•</span>
            <span className="text-[#5B21B6] font-black">+{completedCount * 2} XP</span>
          </span>
        </div>
      </div>

      {/* Subtle Minimalist Progress Line */}
      <div className="w-full bg-[#F3F1F4] h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-[#191A22] h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Habit Items Grid - Simple, Clean, Non-colorful UI */}
      <div className="space-y-2.5">
        {DAILY_HABITS.map((habit) => {
          const isDone = !!completedMap[habit.id];

          return (
            <div
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`p-3.5 rounded-2xl border transition-all tactile cursor-pointer flex items-center justify-between gap-3 ${
                isDone
                  ? "bg-[#F7F7F9] border-[#191A22]/30 shadow-2xs"
                  : "bg-white border-[#E4E0E9] hover:bg-[#FAFAFC]"
              }`}
              role="checkbox"
              aria-checked={isDone}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleHabit(habit.id);
                }
              }}
            >
              {/* Left: Icon + Titles */}
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl shrink-0 opacity-90 select-none">
                  {habit.icon}
                </span>
                <div className="min-w-0">
                  <h4
                    className={`text-xs sm:text-sm font-black leading-tight transition-colors ${
                      isDone ? "text-[#141426] line-through opacity-70" : "text-[#141426]"
                    }`}
                  >
                    {lang === "ml" ? habit.nameMl : habit.nameEn}
                  </h4>
                  <p className="text-[11px] text-[#626273] font-medium truncate mt-0.5">
                    {lang === "ml" ? habit.subMl : habit.subEn}
                  </p>
                </div>
              </div>

              {/* Right: +2 XP Badge & "Yes" Button */}
              <div className="flex items-center gap-2 shrink-0">
                {justAwardedId === habit.id ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#FFD184] text-[#191A22] text-[10px] font-black animate-bounce shadow-2xs">
                    +2 XP! 🌟
                  </span>
                ) : (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black border transition-all ${
                      isDone
                        ? "bg-[#EAF8E8] text-[#1C6918] border-[#B7E8B1]"
                        : "bg-[#F0E9FF] text-[#5B21B6] border-[#E3D4FF]"
                    }`}
                  >
                    {isDone ? "+2 XP ✓" : "+2 XP"}
                  </span>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleHabit(habit.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all tactile shrink-0 ${
                    isDone
                      ? "bg-[#191A22] text-white shadow-2xs"
                      : "bg-[#F3F1F4] hover:bg-[#EAE8ED] text-[#626273] border border-[#E4E0E9]"
                  }`}
                  aria-label={`${lang === "ml" ? habit.nameMl : habit.nameEn}: ${isDone ? "Yes" : "Mark Yes"}`}
                >
                  {isDone ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{lang === "ml" ? "പൂർത്തിയായി" : "Yes"}</span>
                    </>
                  ) : (
                    <span>{lang === "ml" ? "രേഖപ്പെടുത്തൂ" : "Mark Yes"}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Encouragement Footer */}
      {completedCount === totalCount && (
        <div className="p-3.5 bg-gradient-to-r from-[#EAF8E8] to-[#D5F2D2] border border-[#B7E8B1] rounded-2xl text-center shadow-2xs animate-fade-in space-y-0.5">
          <p className="text-xs font-black text-[#1C6918] flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span>
              {lang === "ml"
                ? "മാശാ അല്ലാഹ്! ഇന്നത്തെ എല്ലാ ഇബാദത്തുകളും പൂർത്തിയാക്കി +10 XP നേടി 🌟"
                : "MashaAllah! You completed all of today's worship and daily revisions (+10 XP earned) 🌟"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
