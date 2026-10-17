import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNoor } from "@/lib/noor/state";
import { api } from "@/lib/api/api-client";
import { translations } from "@/lib/noor/i18n";
import { avatarOptions, type AvatarOption } from "@/content/worlds-data";
import {
  Trophy,
  Medal,
  Crown,
  Star,
  Sparkles,
  Flame,
  Check,
  Lock,
  ChevronRight,
  User,
  ArrowUp,
  Award,
  Zap,
  X,
} from "lucide-react";

interface LeaderboardStudent {
  id: string;
  name: string;
  isCurrentUser: boolean;
  xp: number;
  streak: number;
  standard: string;
  badge: { en: string; ml: string };
  avatarEmoji: string;
  avatarBg: string;
  avatarUrl?: string | null;
}

export const LeaderboardScreen: React.FC = () => {
  const { lang, activeProfile, getTotalXp, updateAvatar, updateProfileImage } = useNoor();
  const t = translations[lang];

  // Active top-level tab: "leaderboard" (default) or "avatars"
  const [activeTab, setActiveTab] = useState<"rankings" | "avatars">("rankings");

  // Timeframe filter: "week" | "all" | "class"
  const [timeframe, setTimeframe] = useState<"week" | "all" | "class">("week");

  // Avatar rewards state
  const [selectedLockedAvatar, setSelectedLockedAvatar] = useState<AvatarOption | null>(null);
  const [avatarFilter, setAvatarFilter] = useState<"all" | "unlocked" | "locked">("all");

  // Real students loaded from Neon PostgreSQL database
  const [dbStudents, setDbStudents] = useState<any[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoadingDb(true);

    const getLeaderboardFn =
      typeof api.children?.getLeaderboard === "function"
        ? api.children.getLeaderboard.bind(api.children)
        : typeof (api as any).reviews?.getLeaderboard === "function"
        ? (api as any).reviews.getLeaderboard.bind((api as any).reviews)
        : null;

    if (getLeaderboardFn) {
      getLeaderboardFn()
        .then((data: any) => {
          if (mounted && Array.isArray(data) && data.length > 0) {
            setDbStudents(data);
          }
        })
        .catch((err: any) => {
          console.warn("Could not fetch database leaderboard:", err);
        })
        .finally(() => {
          if (mounted) setIsLoadingDb(false);
        });
    } else {
      if (mounted) setIsLoadingDb(false);
    }

    return () => {
      mounted = false;
    };
  }, []);

  const currentPoints = getTotalXp();
  const currentStudentName = activeProfile?.nickname || (lang === "ml" ? "നിങ്ങൾ" : "You");
  const currentStudentStandard =
    activeProfile?.priorStandard && activeProfile.priorStandard !== "not-sure"
      ? `Class ${activeProfile.priorStandard}`
      : "Class 3";

  // Pre-populated peer classmates for a rich, engaging Madrasa classroom experience
  const defaultPeers: Omit<LeaderboardStudent, "isCurrentUser">[] = [
    {
      id: "peer-1",
      name: "Amina K.",
      xp: 140,
      streak: 6,
      standard: "Class 3",
      badge: { en: "Tajweed Star 🎙️", ml: "തജ്‌വീദ് താരം 🎙️" },
      avatarEmoji: "🧕",
      avatarBg: "#E3D4FF",
    },
    {
      id: "peer-2",
      name: "Zayan M.",
      xp: 100,
      streak: 5,
      standard: "Class 3",
      badge: { en: "Akhlaq Champion 💛", ml: "സൽസ്വഭാവി 💛" },
      avatarEmoji: "👦",
      avatarBg: "#FFD184",
    },
    {
      id: "peer-3",
      name: "Maryam S.",
      xp: 80,
      streak: 4,
      standard: "Class 2",
      badge: { en: "Quran Reader 📖", ml: "ഖുർആൻ പഠിതാവ് 📖" },
      avatarEmoji: "🌸",
      avatarBg: "#BEDAFF",
    },
    {
      id: "peer-4",
      name: "Omar Farooq",
      xp: 60,
      streak: 3,
      standard: "Class 3",
      badge: { en: "Consistent Learner ⚡", ml: "പഠന മിടുക്കൻ ⚡" },
      avatarEmoji: "🦁",
      avatarBg: "#C7EBD1",
    },
    {
      id: "peer-5",
      name: "Aysha Noor",
      xp: 40,
      streak: 3,
      standard: "Class 3",
      badge: { en: "Kindness Hero 🌱", ml: "കാരുണ്യശീലി 🌱" },
      avatarEmoji: "🌙",
      avatarBg: "#FDE68A",
    },
    {
      id: "peer-6",
      name: "Ibrahim R.",
      xp: 20,
      streak: 2,
      standard: "Class 1",
      badge: { en: "Early Explorer 🐣", ml: "തുടക്കക്കാരൻ 🐣" },
      avatarEmoji: "⭐",
      avatarBg: "#FED7AA",
    },
  ];

  // Adjust points according to timeframe filter for realism
  const getAdjustedXp = (baseXp: number, isSelf: boolean) => {
    if (isSelf) {
      if (timeframe === "week") return Math.max(20, Math.round(currentPoints * 0.75));
      if (timeframe === "class") return currentPoints;
      return currentPoints;
    }
    if (timeframe === "week") return Math.round(baseXp * 0.7);
    if (timeframe === "class") return baseXp;
    return baseXp;
  };

  // Build current user entry
  const currentUserEntry: LeaderboardStudent = {
    id: activeProfile?.id || "current-user",
    name: currentStudentName,
    isCurrentUser: true,
    xp: getAdjustedXp(currentPoints, true),
    streak: Math.max(1, Math.round(currentPoints / 20)),
    standard: currentStudentStandard,
    badge: { en: "Noor Seeker ✨", ml: "നൂർ അൻവേഷകൻ ✨" },
    avatarEmoji: "🌟",
    avatarBg: "#7857E8",
    avatarUrl: activeProfile?.avatarUrl,
  };

  // Build dynamic student list combining DB real users and current student
  const mappedDbStudents: LeaderboardStudent[] = dbStudents.map((d, idx) => {
    const isSelf = activeProfile && (d.id === activeProfile.id || d.name === activeProfile.nickname);
    const baseXp = isSelf ? Math.max(currentPoints, d.totalXp || 0) : d.totalXp || (120 - idx * 25);
    const calculatedStars = Math.floor(baseXp / 10);
    return {
      id: d.id,
      name: isSelf ? currentStudentName : d.name,
      isCurrentUser: !!isSelf,
      xp: getAdjustedXp(baseXp, !!isSelf),
      streak: Math.max(1, d.completedCount || 1),
      standard: isSelf ? currentStudentStandard : "Class 3",
      badge: {
        en: `${calculatedStars} Noor Stars ⭐`,
        ml: `${calculatedStars} നൂർ നക്ഷത്രങ്ങൾ ⭐`,
      },
      avatarEmoji: idx % 2 === 0 ? "🧕" : "👦",
      avatarBg: idx % 2 === 0 ? "#E3D4FF" : "#FFD184",
      avatarUrl: isSelf ? activeProfile?.avatarUrl : null,
    };
  });

  const hasSelfInDb = mappedDbStudents.some((s) => s.isCurrentUser);

  const baseList: LeaderboardStudent[] = mappedDbStudents.length > 0
    ? (hasSelfInDb ? mappedDbStudents : [currentUserEntry, ...mappedDbStudents])
    : [
        currentUserEntry,
        ...defaultPeers.map((p) => ({
          ...p,
          xp: getAdjustedXp(p.xp, false),
          isCurrentUser: false,
        })),
      ];

  const allStudents: LeaderboardStudent[] = baseList
    .filter((p) => (timeframe === "class" ? p.standard === currentStudentStandard : true))
    .sort((a, b) => b.xp - a.xp);

  // Determine current user's calculated rank
  const userIndex = allStudents.findIndex((s) => s.isCurrentUser);
  const userRank = userIndex >= 0 ? userIndex + 1 : 1;
  const userAbove = userRank > 1 ? allStudents[userRank - 2] : null;
  const pointsToClimb = userAbove ? Math.max(0, userAbove.xp - currentUserEntry.xp + 5) : 0;

  // Top 3 Podium Students
  const top1 = allStudents[0] || null;
  const top2 = allStudents[1] || null;
  const top3 = allStudents[2] || null;
  const remainingStudents = allStudents.slice(3);

  // Avatar rewards filtering
  const filteredAvatars = avatarOptions.filter((av) => {
    const isUnlocked = currentPoints >= av.requiredPoints;
    if (avatarFilter === "unlocked") return isUnlocked;
    if (avatarFilter === "locked") return !isUnlocked;
    return true;
  });

  return (
    <div className="flex flex-col w-full space-y-6 animate-pop pb-8">
      {/* 1. Header & Navigation Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FFD184] to-[#F59E0B] text-[#191A22] flex items-center justify-center shadow-xs">
              <Trophy className="w-5 h-5 fill-current" />
            </div>
            <h1
              className="text-2xl sm:text-3xl font-black text-[#141426] tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {lang === "ml" ? "മദ്‌റസ ലീഡർബോർഡ്" : "Madrasa Leaderboard"}
            </h1>
          </div>
          <p className="text-xs text-[#626273] font-medium mt-1">
            {lang === "ml"
              ? "നൂർ താരങ്ങളും പഠന നേട്ടങ്ങളും ആഘോഷിക്കൂ!"
              : "Celebrate hard work, daily practice, and Noor Stars with classmates!"}
          </p>
        </div>

        {/* View Mode Switch: Leaderboard / Avatar Rewards */}
        {/* <div className="flex bg-[#F3F1F4] p-1 rounded-2xl text-xs font-black self-start sm:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("rankings")}
            className={`px-3.5 py-1.5 rounded-xl transition-all tactile flex items-center gap-1.5 ${
              activeTab === "rankings"
                ? "bg-[#191A22] text-[#FFD184] shadow-2xs"
                : "text-[#626273] hover:text-[#141426]"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{lang === "ml" ? "റാങ്കിംഗ്" : "Rankings"}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("avatars")}
            className={`px-3.5 py-1.5 rounded-xl transition-all tactile flex items-center gap-1.5 ${
              activeTab === "avatars"
                ? "bg-[#191A22] text-[#FFD184] shadow-2xs"
                : "text-[#626273] hover:text-[#141426]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === "ml" ? "അവതാർ റിവാർഡുകൾ" : "Avatar Rewards"}</span>
          </button>
        </div> */}
      </div>

      {/* ========================================================
          TAB 1: LEADERBOARD RANKINGS VIEW
         ======================================================== */}
      {activeTab === "rankings" && (
        <div className="space-y-6">
          {/* Timeframe Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setTimeframe("week")}
              className={`px-3 py-1.5 rounded-full text-xs font-black tactile transition-all whitespace-nowrap flex items-center gap-1.5 ${
                timeframe === "week"
                  ? "bg-[#7857E8] text-white shadow-xs"
                  : "bg-[#F3F1F4] text-[#626273] hover:text-[#141426]"
              }`}
            >
              <span>🌟</span>
              <span>{lang === "ml" ? "ഈ ആഴ്ച" : "This Week"}</span>
            </button>

            <button
              type="button"
              onClick={() => setTimeframe("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-black tactile transition-all whitespace-nowrap flex items-center gap-1.5 ${
                timeframe === "all"
                  ? "bg-[#7857E8] text-white shadow-xs"
                  : "bg-[#F3F1F4] text-[#626273] hover:text-[#141426]"
              }`}
            >
              <span>🏆</span>
              <span>{lang === "ml" ? "എല്ലാ കാലവും" : "All-Time"}</span>
            </button>

            <button
              type="button"
              onClick={() => setTimeframe("class")}
              className={`px-3 py-1.5 rounded-full text-xs font-black tactile transition-all whitespace-nowrap flex items-center gap-1.5 ${
                timeframe === "class"
                  ? "bg-[#7857E8] text-white shadow-xs"
                  : "bg-[#F3F1F4] text-[#626273] hover:text-[#141426]"
              }`}
            >
              <span>🎒</span>
              <span>{lang === "ml" ? `എന്റെ ക്ലാസ് (${currentStudentStandard})` : `My Class (${currentStudentStandard})`}</span>
            </button>
          </div>

          {/* 2. Top 3 Celebration Podium */}
          <div className="bg-gradient-to-b from-[#F9F7FC] to-[#F3F0F9] border-2 border-[#E4E0E9] rounded-[36px] p-5 sm:p-7 shadow-xs relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#FFD184]/30 rounded-full blur-2xl pointer-events-none" />

            {/* <div className="text-center mb-6 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#7857E8] bg-white/80 px-3 py-1 rounded-full shadow-2xs inline-block">
                {lang === "ml" ? "ആഴ്ചയിലെ ജേതാക്കൾ" : "Top Madrasa Champions"}
              </span>
            </div> */}

            {/* Podium Columns Grid (2nd, 1st, 3rd) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-lg mx-auto relative z-10 pt-4">
              {/* 2ND PLACE PODIUM (Left) */}
              {top2 && (
                <div className="flex flex-col items-center animate-pop">
                  <div className="relative mb-2 flex flex-col items-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-[#CBD5E1] bg-[#F1F5F9] shadow-sm flex items-center justify-center text-2xl overflow-hidden relative">
                      {top2.avatarUrl ? (
                        <img src={top2.avatarUrl} alt={top2.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{top2.avatarEmoji}</span>
                      )}
                    </div>
                    <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-[#CBD5E1] text-[#334155] font-black text-[10px] shadow-2xs border border-white">
                      🥈 2nd
                    </span>
                  </div>

                  <span className="text-xs font-black text-[#141426] truncate max-w-[85px] sm:max-w-[100px] text-center mt-1">
                    {top2.name}
                  </span>
                  {top2.isCurrentUser && (
                    <span className="text-[9px] font-black text-[#7857E8] uppercase tracking-wider">
                      (You)
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-[#626273] flex items-center gap-0.5 mt-0.5">
                    <Star className="w-3 h-3 text-[#E59700] fill-current" />
                    <span>{top2.xp} XP</span>
                  </span>

                  {/* Podium Base */}
                  <div className="w-full h-24 sm:h-28 bg-gradient-to-t from-[#CBD5E1]/70 to-[#E2E8F0] border-t-2 border-[#94A3B8] rounded-t-2xl mt-3 flex items-center justify-center font-black text-xl text-[#475569]">
                    2
                  </div>
                </div>
              )}

              {/* 1ST PLACE PODIUM (Center, Elevated) */}
              {top1 && (
                <div className="flex flex-col items-center animate-pop">
                  {/* Golden Crown */}
                  <div className="text-2xl animate-bounce mb-1">👑</div>

                  <div className="relative mb-2 flex flex-col items-center">
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-4 border-[#FFD184] bg-[#FFF8EB] shadow-md flex items-center justify-center text-3xl overflow-hidden ring-4 ring-[#FFD184]/40 relative">
                      {top1.avatarUrl ? (
                        <img src={top1.avatarUrl} alt={top1.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{top1.avatarEmoji}</span>
                      )}
                    </div>
                    <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-[#FFD184] text-[#191A22] font-black text-[11px] shadow-xs border-2 border-white">
                      🥇 1st
                    </span>
                  </div>

                  <span className="text-xs sm:text-sm font-black text-[#141426] truncate max-w-[95px] sm:max-w-[120px] text-center mt-1">
                    {top1.name}
                  </span>
                  {top1.isCurrentUser && (
                    <span className="text-[9px] font-black text-[#7857E8] uppercase tracking-wider">
                      (You)
                    </span>
                  )}
                  <span className="text-xs font-black text-[#E59700] flex items-center gap-0.5 mt-0.5">
                    <Star className="w-3.5 h-3.5 text-[#E59700] fill-current" />
                    <span>{top1.xp} XP</span>
                  </span>

                  {/* Podium Base (Tallest) */}
                  <div className="w-full h-32 sm:h-36 bg-gradient-to-t from-[#FFD184]/80 to-[#FFE9BE] border-t-2 border-[#F59E0B] rounded-t-2xl mt-3 flex flex-col items-center justify-center font-black text-2xl text-[#92400E] shadow-sm">
                    <span>1</span>
                    <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                </div>
              )}

              {/* 3RD PLACE PODIUM (Right) */}
              {top3 && (
                <div className="flex flex-col items-center animate-pop">
                  <div className="relative mb-2 flex flex-col items-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-3 border-[#D97706]/40 bg-[#FFF7ED] shadow-sm flex items-center justify-center text-2xl overflow-hidden relative">
                      {top3.avatarUrl ? (
                        <img src={top3.avatarUrl} alt={top3.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{top3.avatarEmoji}</span>
                      )}
                    </div>
                    <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-[#FED7AA] text-[#9A3412] font-black text-[10px] shadow-2xs border border-white">
                      🥉 3rd
                    </span>
                  </div>

                  <span className="text-xs font-black text-[#141426] truncate max-w-[85px] sm:max-w-[100px] text-center mt-1">
                    {top3.name}
                  </span>
                  {top3.isCurrentUser && (
                    <span className="text-[9px] font-black text-[#7857E8] uppercase tracking-wider">
                      (You)
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-[#626273] flex items-center gap-0.5 mt-0.5">
                    <Star className="w-3 h-3 text-[#E59700] fill-current" />
                    <span>{top3.xp} XP</span>
                  </span>

                  {/* Podium Base */}
                  <div className="w-full h-20 sm:h-24 bg-gradient-to-t from-[#FED7AA]/70 to-[#FFEDD5] border-t-2 border-[#F97316]/50 rounded-t-2xl mt-3 flex items-center justify-center font-black text-xl text-[#9A3412]">
                    3
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Sticky User Standing Card */}
          <div className="bg-[#191A22] text-white rounded-[26px] p-4 sm:p-5 shadow-lg border border-[#302B48] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#7857E8] text-white flex items-center justify-center font-black text-xl shrink-0 border-2 border-white/20 overflow-hidden shadow-xs">
                {currentUserEntry.avatarUrl ? (
                  <img src={currentUserEntry.avatarUrl} alt={currentStudentName} className="w-full h-full object-cover" />
                ) : (
                  <span>🌟</span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-black text-white">{currentStudentName}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFD184] text-[#191A22] px-2 py-0.5 rounded-full">
                    Rank #{userRank}
                  </span>
                </div>
                <p className="text-xs text-white/70 font-medium mt-0.5">
                  {userRank <= 3
                    ? lang === "ml"
                      ? "മാശാ അല്ലാഹ്! നിങ്ങൾ ടോപ്പ് 3 പോഡിയത്തിലാണ്! 🏆"
                      : "Masha Allah! You are in the Top 3 podium! 🏆"
                    : lang === "ml"
                    ? `അടുത്ത റാങ്കിലെത്താൻ ${pointsToClimb} പോയിന്റുകൾ കൂടി! 🚀`
                    : `Only ${pointsToClimb} Stars to climb to the next rank! 🚀`}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-lg sm:text-xl font-black text-[#FFD184] flex items-center justify-end gap-1">
                <Star className="w-4 h-4 fill-current text-[#FFD184]" />
                <span>{currentUserEntry.xp}</span>
              </span>
              <span className="text-[10px] text-white/60 font-bold block">Noor Stars</span>
            </div>
          </div>

          {/* 4. Full Class Ranking Table (Ranks 4+) */}
          <div className="space-y-2.5">
            <h3
              className="text-base font-black text-[#141426] px-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {lang === "ml" ? "എല്ലാ വിദ്യാർത്ഥികളും" : "All Classmates"}
            </h3>

            <div className="space-y-2">
              {allStudents.map((student, idx) => {
                const rankNumber = idx + 1;
                const isUser = student.isCurrentUser;

                return (
                  <div
                    key={student.id}
                    className={`p-3 sm:p-4 rounded-2xl flex items-center justify-between gap-3 transition-all ${
                      isUser
                        ? "bg-[#F0E9FF] border-2 border-[#7857E8] shadow-xs"
                        : "bg-white border border-[#E4E0E9] hover:bg-[#FAF9FC]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Number */}
                      <span
                        className={`w-7 text-center font-black text-sm sm:text-base ${
                          rankNumber === 1
                            ? "text-[#E59700]"
                            : rankNumber === 2
                            ? "text-[#64748B]"
                            : rankNumber === 3
                            ? "text-[#B45309]"
                            : "text-[#626273]"
                        }`}
                      >
                        #{rankNumber}
                      </span>

                      {/* Avatar */}
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg overflow-hidden shrink-0 shadow-2xs"
                        style={{ backgroundColor: student.avatarBg }}
                      >
                        {student.avatarUrl ? (
                          <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{student.avatarEmoji}</span>
                        )}
                      </div>

                      {/* Name & Standard */}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-black text-[#141426]">
                            {student.name}
                          </span>
                          {isUser && (
                            <span className="text-[9px] font-black text-[#7857E8] uppercase tracking-wider bg-white px-1.5 py-0.5 rounded-full border border-[#7857E8]/30">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-semibold text-[#626273]">
                            {student.standard}
                          </span>
                          <span className="text-[10px] text-[#626273]">•</span>
                          <span className="text-[10px] font-bold text-[#7857E8]">
                            {student.badge?.[lang] || student.badge?.en || "Noor Star"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Streak & XP */}
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#E59700] bg-[#FFF8EB] px-2.5 py-1 rounded-xl border border-[#FDE68A]">
                        <Flame className="w-3.5 h-3.5 fill-current text-[#F59E0B]" />
                        <span>{student.streak}d</span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-black text-[#141426] flex items-center justify-end gap-1">
                          <Star className="w-3.5 h-3.5 fill-current text-[#E59700]" />
                          <span>{student.xp}</span>
                        </span>
                        <span className="text-[9px] font-bold text-[#626273] block uppercase tracking-wider">
                          XP
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: AVATAR REWARDS & POINTS COLLECTION
         ======================================================== */}
      {activeTab === "avatars" && (
        <div className="space-y-6">
          {/* Points Status Banner */}
          <div className="bg-[#E3D4FF]/60 border border-[#CBB5FF] rounded-[28px] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#7857E8] text-[#FFD184] flex items-center justify-center font-black text-xl shrink-0 shadow-xs">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-[#7857E8] tracking-wider block">
                  {lang === "ml" ? "ലഭ്യമായ നൂർ സ്റ്റാറുകൾ" : "Available Noor Stars"}
                </span>
                <h3 className="text-xl font-black text-[#141426]">
                  {currentPoints} {lang === "ml" ? "പോയിന്റുകൾ" : "Points Earned"}
                </h3>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex bg-white/80 p-1 rounded-2xl text-xs font-black shadow-2xs">
              <button
                type="button"
                onClick={() => setAvatarFilter("all")}
                className={`px-3 py-1 rounded-xl transition-all ${
                  avatarFilter === "all" ? "bg-[#191A22] text-white" : "text-[#626273]"
                }`}
              >
                {lang === "ml" ? "എല്ലാം" : "All"}
              </button>
              <button
                type="button"
                onClick={() => setAvatarFilter("unlocked")}
                className={`px-3 py-1 rounded-xl transition-all ${
                  avatarFilter === "unlocked" ? "bg-[#191A22] text-white" : "text-[#626273]"
                }`}
              >
                {lang === "ml" ? "തുറന്നവ" : "Unlocked"}
              </button>
              <button
                type="button"
                onClick={() => setAvatarFilter("locked")}
                className={`px-3 py-1 rounded-xl transition-all ${
                  avatarFilter === "locked" ? "bg-[#191A22] text-white" : "text-[#626273]"
                }`}
              >
                {lang === "ml" ? "പൂട്ടിയവ" : "Locked"}
              </button>
            </div>
          </div>

          {/* Avatars Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {filteredAvatars.map((avatar) => {
              const isUnlocked = currentPoints >= avatar.requiredPoints;
              const isSelected = activeProfile?.avatarId === avatar.id && !activeProfile?.avatarUrl;

              return (
                <div
                  key={avatar.id}
                  onClick={() => {
                    if (isUnlocked) {
                      updateAvatar(avatar.id);
                      updateProfileImage(null);
                    } else {
                      setSelectedLockedAvatar(avatar);
                    }
                  }}
                  className={`p-4 rounded-[26px] border-2 text-center transition-all tactile cursor-pointer flex flex-col items-center justify-between relative ${
                    isSelected
                      ? "bg-[#F0E9FF] border-[#7857E8] shadow-md scale-102"
                      : isUnlocked
                      ? "bg-white border-[#E4E0E9] hover:border-[#7857E8]/50 shadow-2xs"
                      : "bg-[#F8F7FA] border-dashed border-[#CBD5E1] opacity-75"
                  }`}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-2 relative shadow-xs"
                    style={{ backgroundColor: avatar.color }}
                  >
                    <span>{avatar.emoji}</span>
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-black/45 rounded-2xl flex items-center justify-center text-white">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-[#141426]">{avatar.name[lang]}</h4>
                    <span className="text-[10px] font-bold text-[#E59700] flex items-center justify-center gap-0.5 mt-0.5">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{avatar.requiredPoints} XP</span>
                    </span>
                  </div>

                  <div className="mt-2 w-full">
                    {isSelected ? (
                      <span className="text-[10px] font-black text-[#7857E8] bg-white px-2 py-0.5 rounded-full border border-[#7857E8]/30 inline-block">
                        ✓ {lang === "ml" ? "തിരഞ്ഞെടുത്തു" : "Equipped"}
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] font-bold text-[#626273] hover:text-[#7857E8]">
                        {lang === "ml" ? "തിരഞ്ഞെടുക്കൂ" : "Tap to Equip"}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-[#E59700]">
                        {lang === "ml" ? "പൂട്ടിയിരിക്കുന്നു" : "Locked"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Avatar Explanatory Modal via Portal to cover 100% full screen */}
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

            {/* Avatar Icon */}
            <div
              className="w-18 h-18 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-md relative z-10 border-2 border-white"
              style={{ backgroundColor: selectedLockedAvatar.color }}
            >
              <span>{selectedLockedAvatar.emoji}</span>
            </div>

            {/* Title & Tag */}
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase text-[#E59700] bg-[#FFF8EB] px-3 py-1 rounded-full border border-[#FDE68A] inline-block shadow-2xs">
                {lang === "ml" ? "അവതാർ പൂട്ടിയിരിക്കുന്നു" : "Avatar Locked"}
              </span>
              <h3
                className="text-xl font-black text-[#141426] mt-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {selectedLockedAvatar.name[lang]}
              </h3>
              <p className="text-xs text-[#626273] font-medium mt-1 leading-relaxed px-2">
                {selectedLockedAvatar.description[lang]}
              </p>
            </div>

            {/* Progress bar to unlock */}
            <div className="p-3.5 bg-[#F8F7FA] rounded-2xl border border-[#E4E0E9] text-left relative z-10 space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-[#141426]">
                <span>{lang === "ml" ? "ആവശ്യമായ പോയിന്റ്" : "Points Required"}</span>
                <span className="text-[#7857E8] font-bold">
                  {currentPoints} / {selectedLockedAvatar.requiredPoints} XP
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#E4E0E9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FFD184] to-[#7857E8] rounded-full transition-all duration-500"
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
                  ? `ഇത് തുറക്കാൻ ${selectedLockedAvatar.requiredPoints - currentPoints} പോയിന്റുകൾ കൂടി നേടൂ!`
                  : `Earn ${selectedLockedAvatar.requiredPoints - currentPoints} more Stars to unlock!`}
              </span>
            </div>

            {/* Action Button */}
            <div className="pt-1 relative z-10">
              <button
                type="button"
                onClick={() => setSelectedLockedAvatar(null)}
                className="w-full py-3 rounded-full bg-[#191A22] text-[#FFD184] hover:bg-black font-black text-xs sm:text-sm shadow-md tactile transition-all"
              >
                {lang === "ml" ? "ശരി, മനസ്സിലായി 🚀" : "Got it! Continue Journey 🚀"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
