import React, { useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useNoor } from "@/lib/noor/state";
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Star,
  Gamepad2,
  Brain,
  ThumbsUp,
  ThumbsDown,
  Layers,
  ArrowRight,
  Flame,
  Award,
} from "lucide-react";
import { sfx } from "@/lib/sound/sfx";
import { NoorDinoRunner } from "./NoorDinoRunner";

// ================= TYPES =================
export type GameKey = "quiz" | "word-match" | "sunnah-catcher" | "dino-runner";
type GameMode = "menu" | GameKey;

interface QuizQuestion {
  question: { en: string; ml: string };
  options: { en: string; ml: string }[];
  correctIndex: number;
  explanation: { en: string; ml: string };
}

interface MatchPair {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: { en: string; ml: string };
}

interface SunnahItem {
  id: string;
  title: { en: string; ml: string };
  isSunnah: boolean;
  explanation: { en: string; ml: string };
}

// ================= DATA =================
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: {
      en: "Which Prophet built the Ark by Allah's command to protect believers?",
      ml: "അല്ലാഹുവിന്റെ കൽപ്പനപ്രകാരം വിശ്വാസികളെ രക്ഷിക്കാൻ കപ്പൽ നിർമ്മിച്ച പ്രവാചകൻ ആര്?",
    },
    options: [
      { en: "Prophet Nuh (AS)", ml: "നൂഹ് നബി (അ)" },
      { en: "Prophet Musa (AS)", ml: "മൂസാ നബി (അ)" },
      { en: "Prophet Yunus (AS)", ml: "യൂനുസ് നബി (അ)" },
      { en: "Prophet Adam (AS)", ml: "ആദം നബി (അ)" },
    ],
    correctIndex: 0,
    explanation: {
      en: "Prophet Nuh (Noah) built the Ark with patience over many years.",
      ml: "നൂഹ് നബി (അ) അല്ലാഹുവിന്റെ കൽപ്പനപ്രകാരം കപ്പൽ നിർമ്മിച്ച് ജീവജാലങ്ങളെ രക്ഷിച്ചു.",
    },
  },
  {
    question: {
      en: "Which Prophet was protected by Allah when thrown into the cool fire?",
      ml: "തീക്കുണ്ഡത്തിലേക്ക് എറിയപ്പെട്ടപ്പോൾ തീയെ തണുപ്പും സമാധാനവുമാക്കപ്പെട്ട പ്രവാചകൻ?",
    },
    options: [
      { en: "Prophet Isa (AS)", ml: "ഈസാ നബി (അ)" },
      { en: "Prophet Ibrahim (AS)", ml: "ഇബ്രാഹിം നബി (അ)" },
      { en: "Prophet Yusuf (AS)", ml: "യൂസുഫ് നബി (അ)" },
      { en: "Prophet Dawud (AS)", ml: "ദാവൂദ് നബി (അ)" },
    ],
    correctIndex: 1,
    explanation: {
      en: "Allah commanded the fire: 'O fire, be coolness and peace upon Ibrahim.'",
      ml: "അല്ലാഹു തീയോട് പറഞ്ഞു: 'തീയേ, നീ ഇബ്രാഹിമിന് തണുപ്പും സമാധാനവുമായി മാറുക.'",
    },
  },
  {
    question: {
      en: "Which Prophet could understand the language of birds, wind, and ants?",
      ml: "പക്ഷികളുടെയും ഉറുമ്പുകളുടെയും സംസാരം മനസ്സിലാക്കാൻ അല്ലാഹു അനുഗ്രഹിച്ച പ്രവാചകൻ?",
    },
    options: [
      { en: "Prophet Sulaiman (AS)", ml: "സുലൈമാൻ നബി (അ)" },
      { en: "Prophet Harun (AS)", ml: "ഹാറൂൻ നബി (അ)" },
      { en: "Prophet Ayyub (AS)", ml: "അയ്യൂബ് നബി (അ)" },
      { en: "Prophet Yahya (AS)", ml: "യഹ്‌യ നബി (അ)" },
    ],
    correctIndex: 0,
    explanation: {
      en: "Prophet Sulaiman (Solomon) was blessed with wisdom and understood animal speech.",
      ml: "സുലൈമാൻ നബി (അ) മൃഗങ്ങളുടെയും പക്ഷികളുടെയും സംസാരം തിരിച്ചറിഞ്ഞ് നന്ദി ചെയ്തു.",
    },
  },
  {
    question: {
      en: "To which final Prophet was the Holy Quran revealed in Cave Hira?",
      ml: "ഹിറാ ഗുഹയിൽ വെച്ച് വിശുദ്ധ ഖുർആൻ അവതരിപ്പിക്കപ്പെട്ട അന്ത്യപ്രവാചകൻ ആര്?",
    },
    options: [
      { en: "Prophet Musa (AS)", ml: "മൂസാ നബി (അ)" },
      { en: "Prophet Ibrahim (AS)", ml: "ഇബ്രാഹിം നബി (അ)" },
      { en: "Prophet Muhammad ﷺ", ml: "മുഹമ്മദ് നബി ﷺ" },
      { en: "Prophet Isa (AS)", ml: "ഈസാ നബി (അ)" },
    ],
    correctIndex: 2,
    explanation: {
      en: "Prophet Muhammad ﷺ received the first verses 'Iqra' in the Cave of Hira.",
      ml: "മുഹമ്മദ് നബി ﷺ ക്ക് ഹിറാ ഗുഹയിൽ വെച്ചാണ് ജിബ്‌രീൽ (അ) വഴി ആദ്യ വചനങ്ങൾ ലഭിച്ചത്.",
    },
  },
  {
    question: {
      en: "Which Prophet was swallowed by the great whale and made sincere Dua in its belly?",
      ml: "വലിയ മത്സ്യത്തിന്റെ വയറ്റിൽ വെച്ച് പശ്ചാത്തപിച്ച് പ്രാർത്ഥിച്ച പ്രവാചകൻ ആര്?",
    },
    options: [
      { en: "Prophet Yunus (AS)", ml: "യൂനുസ് നബി (അ)" },
      { en: "Prophet Zakariyya (AS)", ml: "സകരിയ്യാ നബി (അ)" },
      { en: "Prophet Idris (AS)", ml: "ഇദ്‌രീസ് നബി (അ)" },
      { en: "Prophet Lut (AS)", ml: "ലൂത്വ് നബി (അ)" },
    ],
    correctIndex: 0,
    explanation: {
      en: "Prophet Yunus prayed: 'Lā ilāha illā anta subḥānaka innī kuntu minaẓ-ẓālimīn'.",
      ml: "യൂനുസ് നബി (അ) പ്രാർത്ഥിച്ചു: 'നിന്നെയല്ലാതെ യാതൊരു ദൈവവുമില്ല, നീ എത്ര പരിശുദ്ധൻ.'",
    },
  },
];

const MATCH_PAIRS: MatchPair[] = [
  {
    id: "p1",
    arabic: "بِسْمِ اللهِ",
    transliteration: "Bismillah",
    meaning: { en: "In the Name of Allah", ml: "അല്ലാഹുവിന്റെ നാമത്തിൽ" },
  },
  {
    id: "p2",
    arabic: "الْحَمْدُ لِلَّهِ",
    transliteration: "Alhamdulillah",
    meaning: { en: "All Praise to Allah", ml: "സർവ്വസ്തുതിയും അല്ലാഹുവിന്" },
  },
  {
    id: "p3",
    arabic: "سُبْحَانَ اللهِ",
    transliteration: "SubhanAllah",
    meaning: { en: "Glory be to Allah", ml: "അല്ലാഹു എത്ര പരിശുദ്ധൻ" },
  },
  {
    id: "p4",
    arabic: "أَسْتَغْفِرُ اللهَ",
    transliteration: "Astaghfirullah",
    meaning: { en: "I seek Allah's forgiveness", ml: "ഞാൻ പാപമോചനം തേടുന്നു" },
  },
  {
    id: "p5",
    arabic: "السَّلَامُ عَلَيْكُمْ",
    transliteration: "Assalamu Alaykum",
    meaning: { en: "Peace be upon you", ml: "നിങ്ങൾക്ക് സമാധാനമുണ്ടാകട്ടെ" },
  },
];

const SUNNAH_ITEMS: SunnahItem[] = [
  {
    id: "s1",
    title: {
      en: "Smiling warmly at your brother and parents",
      ml: "സഹോദരങ്ങളോടും മാതാപിതാക്കളോടും പുഞ്ചിരിക്കുക",
    },
    isSunnah: true,
    explanation: {
      en: "The Prophet ﷺ said: 'Smiling in the face of your brother is charity.'",
      ml: "കൂട്ടുകാരന്റെ മുഖത്ത് നോക്കി പുഞ്ചിരിക്കുന്നത് സ്വദഖയാണ്.",
    },
  },
  {
    id: "s2",
    title: {
      en: "Wasting drinking water while washing",
      ml: "കൈ കഴുകുമ്പോൾ വെള്ളം പാഴാക്കുക",
    },
    isSunnah: false,
    explanation: {
      en: "Islam strictly prohibits wasting water, even at a flowing river.",
      ml: "വെള്ളം പാഴാക്കുന്നത് ഇസ്ലാം വിലക്കിയിട്ടുള്ള തെറ്റായ ശീലമാണ്.",
    },
  },
  {
    id: "s3",
    title: {
      en: "Saying Bismillah and drinking while sitting",
      ml: "ബിസ്മി ചൊല്ലി ഇരുന്ന് വെള്ളം കുടിക്കുക",
    },
    isSunnah: true,
    explanation: {
      en: "Drinking sitting down and in three sips is a beloved Sunnah.",
      ml: "ഇരുന്ന് മൂന്ന് ശ്വാസമായി കുടിക്കുന്നത് പ്രവാചക ചര്യയാണ്.",
    },
  },
  {
    id: "s4",
    title: {
      en: "Leaving plastic trash on public roads",
      ml: "വഴിയരികിൽ പ്ലാസ്റ്റിക് മാലിന്യങ്ങൾ വലിച്ചെറിയുക",
    },
    isSunnah: false,
    explanation: {
      en: "Removing harm from the road is part of Iman; dumping trash is forbidden.",
      ml: "വഴിയിലെ തടസ്സങ്ങൾ നീക്കലാണ് വിശ്വാസം; മാലിന്യമെറിയുന്നത് ഒഴിവാക്കണം.",
    },
  },
  {
    id: "s5",
    title: {
      en: "Saying 'Alhamdulillah' after sneezing",
      ml: "തുമ്മിയ ശേഷം 'അൽഹംദുലില്ലാഹ്' പറയുക",
    },
    isSunnah: true,
    explanation: {
      en: "Praising Allah after sneezing is a blessed Sunnah habit.",
      ml: "തുമ്മിയ ശേഷം നാഥനെ സ്തുതിക്കുന്നത് സുന്നത്തായ നല്ല കാര്യമാണ്.",
    },
  },
];

export const IslamicGamesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { lang, activeProfile, activeProgress, awardXp, getTotalXp, getNoorStars } = useNoor();

  const [mode, setMode] = useState<GameMode>("menu");
  const [xpWonThisSession, setXpWonThisSession] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [completionInfo, setCompletionInfo] = useState<{
    gameKey: GameKey;
    isFirstTime: boolean;
    xpAwarded: number;
  } | null>(null);

  // Check if current user profile has already claimed XP for a specific game
  const isGameClaimed = useCallback(
    (gameKey: GameKey): boolean => {
      if (!activeProfile || !activeProgress?.xp) return false;
      const targetKey = `game-reward-${activeProfile.id}-${gameKey}`;
      return activeProgress.xp.some((tx) => tx.id === targetKey);
    },
    [activeProfile, activeProgress]
  );

  // ---------- QUIZ STATE ----------
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // ---------- WORD MATCH STATE ----------
  const [selectedArabicId, setSelectedArabicId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongMatchTrigger, setWrongMatchTrigger] = useState<string | null>(null);

  // ---------- SUNNAH CATCHER STATE ----------
  const [sunnahIndex, setSunnahIndex] = useState(0);
  const [sunnahScore, setSunnahScore] = useState(0);
  const [sunnahFeedback, setSunnahFeedback] = useState<{
    correct: boolean;
    text: string;
  } | null>(null);

  // Handle XP award on game finish (strictly one-time per user profile)
  const handleGameComplete = (gameKey: GameKey, xpEarned: number = 10) => {
    sfx.complete();
    const targetKey = `game-reward-${activeProfile?.id}-${gameKey}`;
    const alreadyClaimed = isGameClaimed(gameKey);

    let awarded = 0;
    if (!alreadyClaimed) {
      awarded = awardXp(xpEarned, "quiz", targetKey);
      setXpWonThisSession((prev) => prev + (awarded || xpEarned));
    }

    setCompletionInfo({
      gameKey,
      isFirstTime: !alreadyClaimed,
      xpAwarded: awarded,
    });
    setShowCelebration(true);
  };

  // ================= QUIZ HANDLERS =================
  const handleSelectQuizOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowExplanation(true);
    const isCorrect = index === QUIZ_QUESTIONS[quizIndex].correctIndex;
    if (isCorrect) {
      sfx.correct();
      setQuizScore((prev) => prev + 1);
    } else {
      sfx.incorrect();
    }
  };

  const handleNextQuizQuestion = () => {
    sfx.click();
    if (quizIndex + 1 < QUIZ_QUESTIONS.length) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Quiz finished
      handleGameComplete("quiz", 10);
    }
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setShowExplanation(false);
    setShowCelebration(false);
  };

  // ================= WORD MATCH HANDLERS =================
  const handleSelectArabic = (id: string) => {
    if (matchedIds.includes(id)) return;
    setSelectedArabicId(id);
  };

  const handleSelectMeaning = (id: string) => {
    if (!selectedArabicId || matchedIds.includes(id)) return;
    if (selectedArabicId === id) {
      // Match found!
      const updated = [...matchedIds, id];
      setMatchedIds(updated);
      setSelectedArabicId(null);
      if (updated.length === MATCH_PAIRS.length) {
        handleGameComplete("word-match", 10);
      }
    } else {
      // Wrong match
      setWrongMatchTrigger(id);
      setTimeout(() => {
        setWrongMatchTrigger(null);
        setSelectedArabicId(null);
      }, 700);
    }
  };

  const restartWordMatch = () => {
    setSelectedArabicId(null);
    setMatchedIds([]);
    setWrongMatchTrigger(null);
    setShowCelebration(false);
  };

  // ================= SUNNAH CATCHER HANDLERS =================
  const handleSunnahDecision = (choiceSunnah: boolean) => {
    const item = SUNNAH_ITEMS[sunnahIndex];
    const isCorrect = item.isSunnah === choiceSunnah;
    if (isCorrect) {
      setSunnahScore((prev) => prev + 1);
    }
    setSunnahFeedback({
      correct: isCorrect,
      text: item.explanation[lang],
    });
  };

  const handleNextSunnahItem = () => {
    setSunnahFeedback(null);
    if (sunnahIndex + 1 < SUNNAH_ITEMS.length) {
      setSunnahIndex((prev) => prev + 1);
    } else {
      handleGameComplete("sunnah-catcher", 10);
    }
  };

  const restartSunnahCatcher = () => {
    setSunnahIndex(0);
    setSunnahScore(0);
    setSunnahFeedback(null);
    setShowCelebration(false);
  };

  return (
    <div className="w-full space-y-5 animate-pop pb-10">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (mode === "menu") {
              navigate({ to: "/journey" });
            } else {
              setMode("menu");
              setShowCelebration(false);
            }
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E4E0E9] text-[#141426] text-xs font-bold hover:bg-[#F3F1F4] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{mode === "menu" ? (lang === "ml" ? "ഡാഷ്‌ബോർഡ്" : "Home") : (lang === "ml" ? "ഗെയിംസ് ലിസ്റ്റ്" : "All Games")}</span>
        </button>

        {/* Student XP Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEBB7] border border-[#FFD184] text-[#7A4B00] text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-[#FF9800]" />
            <span>{getTotalXp()} XP</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E3D4FF] text-[#5A35C7] text-xs font-black">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{getNoorStars()}</span>
          </div>
        </div>
      </div>

      {/* Hero Banner (Shown on menu for overview, hidden during active game for clean child UX) */}
      {mode === "menu" && (
        <div className="bg-gradient-to-r from-[#FFD184] via-[#FFE4B5] to-[#FFD184] rounded-[28px] p-5 shadow-2xs border border-[#FFBF5F]/40 flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10 max-w-[70%]">
            <span className="px-2.5 py-0.5 rounded-full bg-[#191A22] text-[#FFD184] text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 mb-2">
              <Gamepad2 className="w-3 h-3" />
              <span>{lang === "ml" ? "ഇസ്ലാമിക് മിനി ഗെയിംസ്" : "Islamic Mini-Games"}</span>
            </span>
            <h1
              className="text-xl sm:text-2xl font-black text-[#141426] leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {lang === "ml" ? "കളിച്ച് അറിവും XP യും നേടാം!" : "Play, Learn & Earn XP!"}
            </h1>
            <p className="text-xs text-[#141426]/80 font-medium mt-1">
              {lang === "ml"
                ? "പ്രവാചകന്മാരുടെ ചരിത്രം, അറബിക് പദങ്ങൾ, നല്ല ശീലങ്ങൾ എന്നിവ രസകരമായി പഠിക്കാം."
                : "Explore Prophet stories, Arabic meanings, and daily Sunnah habits while winning XP rewards."}
            </p>
          </div>

          <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center text-5xl select-none">
            🎮
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW: MAIN GAMES MENU                                          */}
      {/* ============================================================== */}
      {mode === "menu" && (
        <div className="space-y-4">
          {/* One-Time XP Notice Banner */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs font-semibold shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span>
              {lang === "ml"
                ? "ഓരോ ഗെയിമിൽ നിന്നും ഒരു തവണ 10 XP വീതം നേടാം. അറിവ് കൂടുതൽ ഉറപ്പിക്കാൻ എത്ര തവണ വേണമെങ്കിലും വീണ്ടും കളിക്കാം!"
                : "Earn +10 XP once from each mini-game! Unlimited replay is always available for practice and revision."}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Card 1: Prophets Quiz */}
            <div
              onClick={() => {
                restartQuiz();
                setMode("quiz");
              }}
              className="bg-white border-2 border-[#E4E0E9] hover:border-[#7857E8] rounded-[24px] p-4.5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all cursor-pointer tactile group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E3D4FF] text-[#7857E8] flex items-center justify-center text-2xl mb-3 group-hover:scale-105 transition-transform">
                  📜
                </div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  {isGameClaimed("quiz") ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#D2F4DE] text-[#287553] text-[10px] font-black inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{lang === "ml" ? "നേടി (10 XP)" : "Claimed (+10 XP)"}</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-[#FFE4B5] text-[#7A4B00] text-[10px] font-black inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#FF9800]" />
                      <span>+10 XP</span>
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-[#626273]">5 Questions</span>
                </div>
                <h3
                  className="text-base font-black text-[#141426] group-hover:text-[#7857E8] transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {lang === "ml" ? "പ്രവാചക ക്വിസ്" : "Prophets Quest Quiz"}
                </h3>
                <p className="text-xs text-[#626273] font-medium mt-1 leading-relaxed">
                  {lang === "ml"
                    ? "പ്രവാചകന്മാരും അവരുടെ മുഅ്ജിസത്തുകളും കണ്ടെത്തി സമ്മാനം നേടുക."
                    : "Test your knowledge of the noble Prophets and their miraculous signs."}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F3F1F4] flex items-center justify-between text-xs font-bold text-[#7857E8]">
                <span>{lang === "ml" ? "കളിച്ചു തുടങ്ങാം" : "Play Now"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Arabic Word Match */}
            <div
              onClick={() => {
                restartWordMatch();
                setMode("word-match");
              }}
              className="bg-white border-2 border-[#E4E0E9] hover:border-[#287553] rounded-[24px] p-4.5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all cursor-pointer tactile group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#D2F4DE] text-[#287553] flex items-center justify-center text-2xl mb-3 group-hover:scale-105 transition-transform">
                  🧩
                </div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  {isGameClaimed("word-match") ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#D2F4DE] text-[#287553] text-[10px] font-black inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{lang === "ml" ? "നേടി (10 XP)" : "Claimed (+10 XP)"}</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-[#FFE4B5] text-[#7A4B00] text-[10px] font-black inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#FF9800]" />
                      <span>+10 XP</span>
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-[#626273]">5 Pairs</span>
                </div>
                <h3
                  className="text-base font-black text-[#141426] group-hover:text-[#287553] transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {lang === "ml" ? "അറബിക് വേഡ് മാച്ച്" : "Arabic Word Match"}
                </h3>
                <p className="text-xs text-[#626273] font-medium mt-1 leading-relaxed">
                  {lang === "ml"
                    ? "അറബിക് ദിക്റുകളും അവയുടെ അർത്ഥങ്ങളും യോജിപ്പിച്ച് മാച്ച് ചെയ്യുക."
                    : "Match beautiful daily Islamic phrases like Bismillah with their meanings."}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F3F1F4] flex items-center justify-between text-xs font-bold text-[#287553]">
                <span>{lang === "ml" ? "കളിച്ചു തുടങ്ങാം" : "Play Now"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Sunnah Habits Catcher */}
            <div
              onClick={() => {
                restartSunnahCatcher();
                setMode("sunnah-catcher");
              }}
              className="bg-white border-2 border-[#E4E0E9] hover:border-[#FF9800] rounded-[24px] p-4.5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all cursor-pointer tactile group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFE4B5] text-[#7A4B00] flex items-center justify-center text-2xl mb-3 group-hover:scale-105 transition-transform">
                  🌟
                </div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  {isGameClaimed("sunnah-catcher") ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#D2F4DE] text-[#287553] text-[10px] font-black inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{lang === "ml" ? "നേടി (10 XP)" : "Claimed (+10 XP)"}</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-[#FFE4B5] text-[#7A4B00] text-[10px] font-black inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#FF9800]" />
                      <span>+10 XP</span>
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-[#626273]">5 Scenarios</span>
                </div>
                <h3
                  className="text-base font-black text-[#141426] group-hover:text-[#FF9800] transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {lang === "ml" ? "സുന്നത്ത് ശീലങ്ങൾ" : "Sunnah Habits Rush"}
                </h3>
                <p className="text-xs text-[#626273] font-medium mt-1 leading-relaxed">
                  {lang === "ml"
                    ? "നല്ല സുന്നത്ത് ശീലങ്ങളും ഒഴിവാക്കേണ്ട കാര്യങ്ങളും വേഗത്തിൽ കണ്ടെത്തുക."
                    : "Spot lovely Sunnah practices versus habits to avoid in daily life."}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F3F1F4] flex items-center justify-between text-xs font-bold text-[#FF9800]">
                <span>{lang === "ml" ? "കളിച്ചു തുടങ്ങാം" : "Play Now"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: Noor Desert Runner (2D Dino Runner) */}
            <div
              onClick={() => {
                setMode("dino-runner");
              }}
              className="bg-white border-2 border-[#E4E0E9] hover:border-[#D97706] rounded-[24px] p-4.5 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all cursor-pointer tactile group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center text-2xl mb-3 group-hover:scale-105 transition-transform">
                  🏃
                </div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  {isGameClaimed("dino-runner") ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#D2F4DE] text-[#287553] text-[10px] font-black inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{lang === "ml" ? "നേടി (10 XP)" : "Claimed (+10 XP)"}</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-[#FFE4B5] text-[#7A4B00] text-[10px] font-black inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#FF9800]" />
                      <span>+10 XP</span>
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-[#626273]">2D Dino Runner</span>
                </div>
                <h3
                  className="text-base font-black text-[#141426] group-hover:text-[#D97706] transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {lang === "ml" ? "നൂർ ഡെസേർട്ട് റണ്ണർ" : "Noor Desert Runner"}
                </h3>
                <p className="text-xs text-[#626273] font-medium mt-1 leading-relaxed">
                  {lang === "ml"
                    ? "മരുഭൂമിയിലൂടെ ചാടി ഓടുക, വിജ്ഞാന ചുരുളുകൾ ശേഖരിച്ച് ഹദീസുകൾ പഠിക്കുക."
                    : "Classic 2D jump runner! Dodge obstacles and collect wisdom scrolls to learn authentic Hadiths."}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F3F1F4] flex items-center justify-between text-xs font-bold text-[#D97706]">
                <span>{lang === "ml" ? "കളിച്ചു തുടങ്ങാം" : "Play Now"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* GAME 1: PROPHETS QUIZ QUEST                                    */}
      {/* ============================================================== */}
      {mode === "quiz" && (
        <div className="bg-white border border-[#E4E0E9] rounded-[26px] p-5 shadow-2xs space-y-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#7857E8]">
              {lang === "ml"
                ? `ചോദ്യം ${quizIndex + 1} / ${QUIZ_QUESTIONS.length}`
                : `Question ${quizIndex + 1} of ${QUIZ_QUESTIONS.length}`}
            </span>
            <span className="text-[#626273]">
              {lang === "ml" ? `സ്കോർ: ${quizScore}` : `Score: ${quizScore}`}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#F3F1F4] overflow-hidden">
            <div
              className="h-full bg-[#7857E8] transition-all duration-300"
              style={{
                width: `${((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`,
              }}
            />
          </div>

          {/* Question Text */}
          <div className="pt-2">
            <h2
              className="text-base sm:text-lg font-black text-[#141426] leading-snug"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {QUIZ_QUESTIONS[quizIndex].question[lang]}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-2.5 pt-1">
            {QUIZ_QUESTIONS[quizIndex].options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer =
                idx === QUIZ_QUESTIONS[quizIndex].correctIndex;
              let style =
                "bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#7857E8] text-[#141426]";

              if (selectedOption !== null) {
                if (isCorrectAnswer) {
                  style =
                    "bg-[#E8F8F0] border-[#287553] text-[#1E563C] ring-1 ring-[#287553]";
                } else if (isSelected) {
                  style = "bg-[#FDF0ED] border-[#D14343] text-[#932727]";
                } else {
                  style = "bg-[#F8FAFC] border-[#E2E8F0] opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuizOption(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm flex items-center justify-between transition-all tactile ${style}`}
                >
                  <span>{opt[lang]}</span>
                  {selectedOption !== null && (
                    <span>
                      {isCorrectAnswer ? (
                        <CheckCircle2 className="w-5 h-5 text-[#287553]" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-[#D14343]" />
                      ) : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Button */}
          {showExplanation && (
            <div className="p-3.5 rounded-2xl bg-[#F4F1FA] border border-[#E3D4FF] space-y-3 animate-fade-in">
              <p className="text-xs text-[#524B66] font-medium leading-relaxed">
                💡 {QUIZ_QUESTIONS[quizIndex].explanation[lang]}
              </p>
              <button
                type="button"
                onClick={handleNextQuizQuestion}
                className="w-full py-2.5 rounded-full bg-[#191A22] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 tactile shadow-xs"
              >
                <span>
                  {quizIndex + 1 < QUIZ_QUESTIONS.length
                    ? lang === "ml"
                      ? "അടുത്ത ചോദ്യം"
                      : "Next Question"
                    : lang === "ml"
                    ? "ഫലം കാണുക & XP നേടുക"
                    : "Finish & Claim XP"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* GAME 2: ARABIC WORD MATCH                                      */}
      {/* ============================================================== */}
      {mode === "word-match" && (
        <div className="bg-white border border-[#E4E0E9] rounded-[26px] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#287553]">
              {lang === "ml" ? "യോജിച്ചവ കണ്ടെത്തി ക്ലിക്ക് ചെയ്യുക" : "Match Arabic Phrases with Meanings"}
            </span>
            <span className="text-[#626273]">
              {matchedIds.length} / {MATCH_PAIRS.length} Matched
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Left Column: Arabic Words */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-[#626273] uppercase tracking-wider block mb-1">
                {lang === "ml" ? "അറബിക് വചനങ്ങൾ" : "Arabic Words"}
              </span>
              {MATCH_PAIRS.map((pair) => {
                const isMatched = matchedIds.includes(pair.id);
                const isSelected = selectedArabicId === pair.id;

                let btnStyle =
                  "bg-white border-[#E4E0E9] hover:border-[#287553] text-[#141426]";
                if (isMatched) {
                  btnStyle =
                    "bg-[#E8F8F0] border-[#287553]/40 text-[#287553] opacity-60";
                } else if (isSelected) {
                  btnStyle =
                    "bg-[#D2F4DE] border-[#287553] text-[#1E563C] ring-2 ring-[#287553]/30";
                }

                return (
                  <button
                    key={pair.id}
                    type="button"
                    onClick={() => handleSelectArabic(pair.id)}
                    disabled={isMatched}
                    className={`w-full p-3 rounded-2xl border-2 text-left transition-all tactile flex items-center justify-between ${btnStyle}`}
                  >
                    <div>
                      <span className="text-base font-black block font-arabic text-right">
                        {pair.arabic}
                      </span>
                      <span className="text-[11px] font-bold text-[#626273]">
                        {pair.transliteration}
                      </span>
                    </div>
                    {isMatched && (
                      <CheckCircle2 className="w-4 h-4 text-[#287553]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Column: Meanings */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-[#626273] uppercase tracking-wider block mb-1">
                {lang === "ml" ? "അർത്ഥങ്ങൾ" : "Meanings"}
              </span>
              {/* Render scrambled order of meanings */}
              {[...MATCH_PAIRS].reverse().map((pair) => {
                const isMatched = matchedIds.includes(pair.id);
                const isWrong = wrongMatchTrigger === pair.id;

                let btnStyle =
                  "bg-white border-[#E4E0E9] hover:border-[#287553] text-[#141426]";
                if (isMatched) {
                  btnStyle =
                    "bg-[#E8F8F0] border-[#287553]/40 text-[#287553] opacity-60";
                } else if (isWrong) {
                  btnStyle = "bg-[#FDF0ED] border-[#D14343] text-[#932727]";
                }

                return (
                  <button
                    key={pair.id}
                    type="button"
                    onClick={() => handleSelectMeaning(pair.id)}
                    disabled={isMatched}
                    className={`w-full p-3 rounded-2xl border-2 text-left font-bold text-xs sm:text-sm transition-all tactile flex items-center justify-between min-h-[58px] ${btnStyle}`}
                  >
                    <span>{pair.meaning[lang]}</span>
                    {isMatched && (
                      <CheckCircle2 className="w-4 h-4 text-[#287553]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* GAME 3: SUNNAH HABITS RUSH                                     */}
      {/* ============================================================== */}
      {mode === "sunnah-catcher" && (
        <div className="bg-white border border-[#E4E0E9] rounded-[26px] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#FF9800]">
              {lang === "ml"
                ? `സാഹചര്യം ${sunnahIndex + 1} / ${SUNNAH_ITEMS.length}`
                : `Scenario ${sunnahIndex + 1} of ${SUNNAH_ITEMS.length}`}
            </span>
            <span className="text-[#626273]">
              {lang === "ml" ? `സ്കോർ: ${sunnahScore}` : `Score: ${sunnahScore}`}
            </span>
          </div>

          <div className="p-6 rounded-[24px] bg-[#FFF8EE] border border-[#FFE8C2] text-center space-y-2">
            <span className="text-3xl block">🌱</span>
            <h3
              className="text-base sm:text-lg font-black text-[#141426]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {SUNNAH_ITEMS[sunnahIndex].title[lang]}
            </h3>
            <p className="text-xs text-[#7A4B00] font-medium">
              {lang === "ml"
                ? "ഇത് സുന്നത്തായ നല്ല ശീലമാണോ അതോ ഒഴിവാക്കേണ്ടതാണോ?"
                : "Is this an authentic Sunnah deed or an action to avoid?"}
            </p>
          </div>

          {/* Decision Buttons */}
          {sunnahFeedback === null ? (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSunnahDecision(true)}
                className="py-3 px-4 rounded-2xl bg-[#E8F8F0] hover:bg-[#D4F4E4] border-2 border-[#287553] text-[#1E563C] font-black text-xs sm:text-sm flex items-center justify-center gap-2 tactile shadow-2xs transition-transform active:scale-95"
              >
                <ThumbsUp className="w-4 h-4 text-[#287553]" />
                <span>{lang === "ml" ? "സുന്നത്ത് / നല്ലത് 👍" : "Sunnah Deed 👍"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSunnahDecision(false)}
                className="py-3 px-4 rounded-2xl bg-[#FDF0ED] hover:bg-[#FBE2DC] border-2 border-[#D14343] text-[#932727] font-black text-xs sm:text-sm flex items-center justify-center gap-2 tactile shadow-2xs transition-transform active:scale-95"
              >
                <ThumbsDown className="w-4 h-4 text-[#D14343]" />
                <span>{lang === "ml" ? "ഒഴിവാക്കേണ്ടത് 👎" : "Avoid This 👎"}</span>
              </button>
            </div>
          ) : (
            <div
              className={`p-4 rounded-2xl border space-y-3 animate-fade-in ${
                sunnahFeedback.correct
                  ? "bg-[#E8F8F0] border-[#287553] text-[#1E563C]"
                  : "bg-[#FDF0ED] border-[#D14343] text-[#932727]"
              }`}
            >
              <div className="flex items-center gap-2 font-black text-sm">
                {sunnahFeedback.correct ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#287553]" />
                    <span>{lang === "ml" ? "ശരിയുത്തരം! മാശാ അല്ലാഹ്!" : "Correct! MashaAllah!"}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-[#D14343]" />
                    <span>{lang === "ml" ? "ശ്രദ്ധിക്കുക!" : "Check again!"}</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed font-medium">
                {sunnahFeedback.text}
              </p>
              <button
                type="button"
                onClick={handleNextSunnahItem}
                className="w-full py-2.5 rounded-full bg-[#191A22] text-white text-xs font-bold flex items-center justify-center gap-1.5 tactile shadow-xs"
              >
                <span>
                  {sunnahIndex + 1 < SUNNAH_ITEMS.length
                    ? lang === "ml"
                      ? "അടുത്ത ചോദ്യം"
                      : "Next Scenario"
                    : lang === "ml"
                    ? "ഫലം കാണുക & XP നേടുക"
                    : "Finish & Claim XP"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* GAME 4: NOOR DESERT RUNNER (2D DINO RUNNER)                   */}
      {/* ============================================================== */}
      {mode === "dino-runner" && (
        <NoorDinoRunner
          lang={lang}
          isClaimed={isGameClaimed("dino-runner")}
          onComplete={() => handleGameComplete("dino-runner", 10)}
          onBackToMenu={() => setMode("menu")}
        />
      )}

      {/* ============================================================== */}
      {/* CELEBRATION MODAL ON GAME FINISH                               */}
      {/* ============================================================== */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full text-center space-y-4 shadow-xl border border-[#E4E0E9] animate-pop">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#FFEBB7] flex items-center justify-center text-4xl shadow-inner animate-bounce">
              {completionInfo?.isFirstTime ? "🏆" : "🌟"}
            </div>

            <div>
              {completionInfo?.isFirstTime ? (
                <span className="px-3 py-1 rounded-full bg-[#E3D4FF] text-[#5A35C7] text-xs font-black inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+10 XP EARNED</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-[#D2F4DE] text-[#287553] text-xs font-black inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {lang === "ml"
                      ? "പരിശീലനം പൂർത്തിയായി (XP നേരത്തെ നേടി)"
                      : "Practice Finished • XP Already Claimed"}
                  </span>
                </span>
              )}

              <h2
                className="text-xl font-black text-[#141426] mt-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {completionInfo?.isFirstTime
                  ? lang === "ml"
                    ? "അഭിനന്ദനങ്ങൾ! മികച്ച കളി!"
                    : "MashaAllah! Great Job!"
                  : lang === "ml"
                  ? "മികച്ച കളി! മാശാ അല്ലാഹ്!"
                  : "Barakallahu Feek! Great Practice!"}
              </h2>
              <p className="text-xs text-[#626273] mt-1 leading-relaxed">
                {completionInfo?.isFirstTime
                  ? lang === "ml"
                    ? "നിങ്ങൾ വിജയകരമായി കളി പൂർത്തിയാക്കി 10 XP സ്വന്തമാക്കി!"
                    : "You completed the game and successfully added +10 XP to your score!"
                  : lang === "ml"
                  ? "ഈ കളിയിൽ നിന്നുള്ള 10 XP നിങ്ങൾ ഇതിനകം നേടിയിട്ടുണ്ട്. അറിവ് കൂടുതൽ ഉറപ്പിക്കാൻ നിങ്ങൾക്ക് എപ്പോഴും വീണ്ടും പരിശീലിക്കാം!"
                  : "You have already claimed the 10 XP reward for this game. You can play again anytime to practice and master your knowledge!"}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowCelebration(false);
                  if (mode === "quiz") restartQuiz();
                  if (mode === "word-match") restartWordMatch();
                  if (mode === "sunnah-catcher") restartSunnahCatcher();
                  // dino-runner will reset automatically when replayed
                }}
                className="w-full py-3 rounded-full bg-[#191A22] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 tactile shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === "ml" ? "വീണ്ടും കളിക്കുക" : "Play Again"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowCelebration(false);
                  setMode("menu");
                }}
                className="w-full py-2.5 rounded-full bg-[#F3F1F4] hover:bg-[#E4E0E9] text-[#141426] text-xs font-bold tactile"
              >
                <span>{lang === "ml" ? "മറ്റു ഗെയിമുകൾ നോക്കാം" : "Choose Another Game"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
