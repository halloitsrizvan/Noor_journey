import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Heart,
  Trophy,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Flame,
  X,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { sfx } from "@/lib/sound/sfx";

// ================= WISDOM REPOSITORY =================
export interface WisdomItem {
  id: number;
  hadith: { en: string; ml: string };
  source: { en: string; ml: string };
  action: { en: string; ml: string };
}

export const WISDOM_CARDS: WisdomItem[] = [
  {
    id: 1,
    hadith: {
      en: "Cleanliness is half of faith (Al-Tahuru shatrul-iman).",
      ml: "ശുചിത്വം ഈമാനിന്റെ (വിശ്വാസത്തിന്റെ) പകുതിയാകുന്നു.",
    },
    source: { en: "Sahih Muslim", ml: "സ്വഹീഹ് മുസ്ലിം" },
    action: {
      en: "Keep your body, clothes, room, and heart pure and clean.",
      ml: "ശരീരവും വസ്ത്രവും പരിസരവും എപ്പോഴും വൃത്തിയായി സൂക്ഷിക്കുക.",
    },
  },
  {
    id: 2,
    hadith: {
      en: "Smiling at your brother is an act of charity (Sadaqah).",
      ml: "സഹോദരന്റെ മുഖത്തുനോക്കി പുഞ്ചിരിക്കുന്നത് സ്വദഖയാണ് (ദാനധർമ്മം).",
    },
    source: { en: "Jami at-Tirmidhi", ml: "ജാമിഉത്തിർമിദി" },
    action: {
      en: "Greet everyone with a warm, joyful smile and spread happiness.",
      ml: "എല്ലാവരെയും പുഞ്ചിരിയോടെ അഭിവാദ്യം ചെയ്യുക, സലാം പറയുക.",
    },
  },
  {
    id: 3,
    hadith: {
      en: "The best among you are those who learn the Quran and teach it.",
      ml: "നിങ്ങളിൽ ഏറ്റവും ഉത്തമർ ഖുർആൻ പഠിക്കുകയും അത് മറ്റുള്ളവർക്ക് പഠിപ്പിക്കുകയും ചെയ്യുന്നവരാണ്.",
    },
    source: { en: "Sahih al-Bukhari", ml: "സ്വഹീഹ് അൽ ബുഖാരി" },
    action: {
      en: "Read a portion of the Quran every single day with understanding.",
      ml: "ദിവസവും വിശുദ്ധ ഖുർആൻ അർത്ഥം ഗ്രഹിച്ച് പാരായണം ചെയ്യുക.",
    },
  },
  {
    id: 4,
    hadith: {
      en: "Say Bismillah before eating, and eat with your right hand.",
      ml: "ഭക്ഷണത്തിനു മുമ്പ് ബിസ്മി ചൊല്ലുക, വലതുകൈ കൊണ്ട് കഴിക്കുക.",
    },
    source: { en: "Sahih al-Bukhari & Muslim", ml: "ബുഖാരിയും മുസ്ലിമും" },
    action: {
      en: "Honor the food Allah provides by eating mindfully with your right hand.",
      ml: "അല്ലാഹുവിന്റെ അനുഗ്രഹമായ ഭക്ഷണത്തെ ആദരിച്ച് സുന്നത്ത് പ്രകാരം കഴിക്കുക.",
    },
  },
  {
    id: 5,
    hadith: {
      en: "A true Muslim is the one from whose tongue and hands others are safe.",
      ml: "മറ്റു മനുഷ്യർ തന്റെ നാവിൽ നിന്നും കയ്യിൽ നിന്നും സുരക്ഷിതരായവനാണ് യഥാർത്ഥ മുസ്ലിം.",
    },
    source: { en: "Sahih al-Bukhari", ml: "സ്വഹീഹ് അൽ ബുഖാരി" },
    action: {
      en: "Never hurt anyone with bad words, gossip, or hurtful actions.",
      ml: "മോശം വാക്കുകൾ കൊണ്ടോ പ്രവൃത്തികൾ കൊണ്ടോ ആരെയും വേദനിപ്പിക്കരുത്.",
    },
  },
  {
    id: 6,
    hadith: {
      en: "Paradise lies under the feet of mothers (Honor your parents).",
      ml: "സ്വർഗ്ഗം മാതാക്കളുടെ കാൽക്കീഴിലാകുന്നു (മാതാപിതാക്കളെ ആദരിക്കുക).",
    },
    source: { en: "Sunan an-Nasa'i", ml: "സുനൻ അന്നസാഈ" },
    action: {
      en: "Obey your mother and father with tenderness, love, and respect.",
      ml: "മാതാപിതാക്കളെ സ്നേഹത്തോടെയും ബഹുമാനത്തോടെയും പരിചരിക്കുക.",
    },
  },
  {
    id: 7,
    hadith: {
      en: "Whoever takes a path seeking knowledge, Allah makes easy for him a path to Paradise.",
      ml: "വിജ്ഞാനം തേടി ഒരാൾ യാത്ര ചെയ്യുമ്പോൾ, അല്ലാഹു അവന് സ്വർഗ്ഗത്തിലേക്കുള്ള വഴി എളുപ്പമാക്കുന്നു.",
    },
    source: { en: "Sahih Muslim", ml: "സ്വഹീഹ് മുസ്ലിം" },
    action: {
      en: "Always be eager to study, ask questions, and learn beneficial knowledge.",
      ml: "സദാ നല്ല അറിവുകൾ പഠിക്കാനും മനസ്സിരുത്താനും ഉത്സാഹം കാണിക്കുക.",
    },
  },
  {
    id: 8,
    hadith: {
      en: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
      ml: "അല്ലാഹുവിലും അന്ത്യദിനത്തിലും വിശ്വസിക്കുന്നവൻ നല്ലത് സംസാരിക്കട്ടെ, അല്ലെങ്കിൽ മിണ്ടാതിരിക്കട്ടെ.",
    },
    source: { en: "Sahih al-Bukhari", ml: "സ്വഹീഹ് അൽ ബുഖാരി" },
    action: {
      en: "Think before speaking: choose kind, helpful, and truthful words.",
      ml: "സംസാരിക്കുന്നതിന് മുമ്പ് ചിന്തിക്കുക, നല്ല വാക്കുകൾ മാത്രം ഉപയോഗിക്കുക.",
    },
  },
  {
    id: 9,
    hadith: {
      en: "The strong person is the one who controls himself when angry.",
      ml: "കോപം വരുമ്പോൾ മനസ്സിനെ നിയന്ത്രിക്കുന്നവനാണ് യഥാർത്ഥ ശക്തൻ.",
    },
    source: { en: "Sahih al-Bukhari", ml: "സ്വഹീഹ് അൽ ബുഖാരി" },
    action: {
      en: "When feeling upset, seek refuge in Allah (Say A'udhu Billah) and stay calm.",
      ml: "ദേഷ്യം വരുമ്പോൾ 'അഊദു ബില്ലാഹ്' ചൊല്ലി മനസ്സ് ശാന്തമാക്കുക.",
    },
  },
  {
    id: 10,
    hadith: {
      en: "Spread peace (Salam) among yourselves.",
      ml: "നിങ്ങൾ പരസ്പരം സലാം വ്യാപിപ്പിക്കുക.",
    },
    source: { en: "Sahih Muslim", ml: "സ്വഹീഹ് മുസ്ലിം" },
    action: {
      en: "Say 'Assalamu Alaikum' to people you know and those you do not know.",
      ml: "അറിയുന്നവർക്കും അറിയാത്തവർക്കും സ്നേഹത്തോടെ സലാം ചൊല്ലുക.",
    },
  },
];

// ================= DAILY LIVES SYSTEM =================
export const STORAGE_KEY_LIVES = "noor_runner_daily_lives_v1";
export const MAX_DAILY_LIVES = 3;

interface DailyLivesData {
  date: string;
  lives: number;
}

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getStoredDailyLives(): number {
  if (typeof window === "undefined") return MAX_DAILY_LIVES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LIVES);
    if (!raw) return MAX_DAILY_LIVES;
    const parsed: DailyLivesData = JSON.parse(raw);
    if (parsed.date === getTodayDateString() && typeof parsed.lives === "number") {
      return Math.max(0, Math.min(MAX_DAILY_LIVES, parsed.lives));
    }
    // New day! Automatically refresh to 3 full lives for the day
    saveDailyLives(MAX_DAILY_LIVES);
    return MAX_DAILY_LIVES;
  } catch {
    return MAX_DAILY_LIVES;
  }
}

export function saveDailyLives(lives: number): void {
  if (typeof window === "undefined") return;
  try {
    const state: DailyLivesData = {
      date: getTodayDateString(),
      lives: Math.max(0, Math.min(MAX_DAILY_LIVES, lives)),
    };
    localStorage.setItem(STORAGE_KEY_LIVES, JSON.stringify(state));
  } catch {
    // Ignore storage issues
  }
}

export function getTimeUntilMidnight(): { hours: number; minutes: number } {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diffMs = Math.max(0, midnight.getTime() - now.getTime());
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return { hours, minutes };
}

export interface BonusQuizItem {
  id: number;
  q: { en: string; ml: string };
  options: { text: { en: string; ml: string }; isCorrect: boolean }[];
}

export const BONUS_QUESTIONS: BonusQuizItem[] = [
  {
    id: 1,
    q: {
      en: "What do we say before eating or drinking?",
      ml: "ഭക്ഷണം കഴിക്കുന്നതിനോ കുടിക്കുന്നതിനോ മുമ്പ് എന്ത് പറയണം?",
    },
    options: [
      { text: { en: "Bismillah", ml: "ബിസ്മില്ലാഹ്" }, isCorrect: true },
      { text: { en: "Alhamdulillah", ml: "അൽഹംദുലില്ലാഹ്" }, isCorrect: false },
      { text: { en: "Astaghfirullah", ml: "അസ്തഗ്ഫിറുല്ലാഹ്" }, isCorrect: false },
    ],
  },
  {
    id: 2,
    q: {
      en: "What does 'Assalamu Alaikum' mean?",
      ml: "'അസ്സലാമു അലൈക്കും' എന്ന സലാമിന്റെ അർത്ഥമെന്ത്?",
    },
    options: [
      { text: { en: "Peace be upon you", ml: "നിങ്ങൾക്ക് സമാധാനമുണ്ടാകട്ടെ" }, isCorrect: true },
      { text: { en: "Good morning", ml: "സുപ്രഭാതം" }, isCorrect: false },
      { text: { en: "Goodbye", ml: "വിട" }, isCorrect: false },
    ],
  },
  {
    id: 3,
    q: {
      en: "What word do we say to thank Allah for blessings?",
      ml: "അല്ലാഹുവിന് നന്ദി രേഖപ്പെടുത്താൻ നാം പറയുന്ന വാക്കേത്?",
    },
    options: [
      { text: { en: "Alhamdulillah", ml: "അൽഹംദുലില്ലാഹ്" }, isCorrect: true },
      { text: { en: "SubhanAllah", ml: "സുബ്ഹാനല്ലാഹ്" }, isCorrect: false },
      { text: { en: "Allahu Akbar", ml: "അല്ലാഹു അക്ബർ" }, isCorrect: false },
    ],
  },
  {
    id: 4,
    q: {
      en: "Smiling at parents and friends is which good deed?",
      ml: "മാതാപിതാക്കളോടും കൂട്ടുകാരോടും പുഞ്ചിരിക്കുന്നത് എന്തായി കണക്കാക്കപ്പെടുന്നു?",
    },
    options: [
      { text: { en: "Sadaqah (Charity)", ml: "സ്വദഖ (ദാനം)" }, isCorrect: true },
      { text: { en: "A chore", ml: "ഒരു ഭാരം" }, isCorrect: false },
      { text: { en: "Wasting time", ml: "സമയം കളയൽ" }, isCorrect: false },
    ],
  },
];

// ================= GAME ENGINE CONSTANTS =================
const TARGET_DISTANCE = 500; // Goal meters to reach Madinah Oasis
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 320;
const GROUND_Y = 250;

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "cactus-small" | "cactus-cluster" | "boulder" | "falcon";
  passed: boolean;
}

interface Collectible {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "scroll" | "lantern" | "date";
  wisdomIndex: number;
  bobPhase: number;
  collected: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface NoorDinoRunnerProps {
  lang: "en" | "ml";
  isClaimed: boolean;
  onComplete: () => void;
  onBackToMenu: () => void;
}

export const NoorDinoRunner: React.FC<NoorDinoRunnerProps> = ({
  lang,
  isClaimed,
  onComplete,
  onBackToMenu,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game control state
  const [gameState, setGameState] = useState<"ready" | "running" | "paused" | "gameover" | "goal-reached">("ready");
  const [distance, setDistance] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(() => getStoredDailyLives());
  const [isPracticeOnly, setIsPracticeOnly] = useState<boolean>(false);
  const [scrollsCount, setScrollsCount] = useState<number>(0);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [activeWisdom, setActiveWisdom] = useState<WisdomItem>(WISDOM_CARDS[0]);
  const [collectedWisdoms, setCollectedWisdoms] = useState<WisdomItem[]>([]);
  const [showWisdomModal, setShowWisdomModal] = useState<WisdomItem | null>(null);
  const [isEndlessMode, setIsEndlessMode] = useState<boolean>(false);

  // Daily Lives & Bonus Quiz modal state
  const [showLivesModal, setShowLivesModal] = useState<boolean>(false);
  const [showBonusQuiz, setShowBonusQuiz] = useState<boolean>(false);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean | null>(null);
  const [midnightTime, setMidnightTime] = useState(() => getTimeUntilMidnight());

  // Periodically refresh midnight countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setMidnightTime(getTimeUntilMidnight());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // References for requestAnimationFrame loop
  const animFrameId = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Player physics state
  const playerRef = useRef({
    x: 70,
    y: GROUND_Y - 48,
    width: 38,
    height: 48,
    vy: 0,
    isJumping: false,
    isDucking: false,
    invulnerableTimer: 0,
    legCycle: 0,
    dustTimer: 0,
  });

  // World physics
  const speedRef = useRef(4.8);
  const distanceRef = useRef(0);
  const heartsRef = useRef(getStoredDailyLives());
  const scrollsCountRef = useRef(0);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const collectiblesRef = useRef<Collectible[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const nextSpawnDistanceRef = useRef(80);
  const nextCollectibleDistanceRef = useRef(50);
  const groundScrollRef = useRef(0);
  const bgScrollRef = useRef(0);
  const midScrollRef = useRef(0);

  // Touch & Key flags
  const isDuckHeldRef = useRef(false);

  // Play sounds helper respecting local mute
  const playSfx = useCallback(
    (action: "jump" | "collect" | "hit" | "win" | "click") => {
      if (soundMuted) return;
      if (action === "jump") sfx.tab();
      else if (action === "collect") sfx.xp();
      else if (action === "hit") sfx.incorrect();
      else if (action === "win") sfx.complete();
      else if (action === "click") sfx.click();
    },
    [soundMuted]
  );

  // Handle answering bonus quiz question to restore +1 life
  const handleAnswerBonusQuiz = useCallback(
    (isCorrect: boolean) => {
      if (isCorrect) {
        playSfx("win");
        setQuizAnswered(true);
        const newHearts = Math.min(MAX_DAILY_LIVES, hearts + 1);
        heartsRef.current = newHearts;
        setHearts(newHearts);
        saveDailyLives(newHearts);
        setTimeout(() => {
          setShowBonusQuiz(false);
          setQuizAnswered(null);
          setQuizQuestionIndex((prev) => (prev + 1) % BONUS_QUESTIONS.length);
        }, 1300);
      } else {
        playSfx("hit");
        setQuizAnswered(false);
        setTimeout(() => {
          setQuizAnswered(null);
        }, 1100);
      }
    },
    [hearts, playSfx]
  );

  // ================= JUMP & DUCK LOGIC =================
  const triggerJump = useCallback(() => {
    const p = playerRef.current;
    if (gameState === "ready") {
      if (!isPracticeOnly && heartsRef.current <= 0) {
        setShowLivesModal(true);
        return;
      }
      setGameState("running");
      playSfx("jump");
      return;
    }
    if (gameState !== "running") return;

    if (!p.isJumping) {
      p.vy = -12.5;
      p.isJumping = true;
      playSfx("jump");

      // Spawn jump dust particles
      for (let i = 0; i < 6; i++) {
        particlesRef.current.push({
          x: p.x + 10,
          y: GROUND_Y,
          vx: -(Math.random() * 2 + 1),
          vy: -(Math.random() * 2),
          size: Math.random() * 4 + 2,
          color: "#E2BA78",
          alpha: 0.8,
          decay: 0.04,
        });
      }
    }
  }, [gameState, isPracticeOnly, playSfx]);

  const setDuckState = useCallback((ducking: boolean) => {
    isDuckHeldRef.current = ducking;
    const p = playerRef.current;
    p.isDucking = ducking;
    if (ducking) {
      p.height = 26;
      p.y = GROUND_Y - 26;
    } else {
      p.height = 48;
      if (!p.isJumping) {
        p.y = GROUND_Y - 48;
      }
    }
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        triggerJump();
      } else if (e.code === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        setDuckState(true);
      } else if (e.code === "KeyP") {
        setGameState((prev) => (prev === "running" ? "paused" : prev === "paused" ? "running" : prev));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown" || e.key === "s" || e.key === "S") {
        setDuckState(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [triggerJump, setDuckState]);

  // Restart / Reset Game
  const resetGame = useCallback(
    (forcePractice = false) => {
      const currentDaily = getStoredDailyLives();
      const usePractice = forcePractice || isPracticeOnly;
      const initialHearts = usePractice ? 3 : currentDaily;

      if (!usePractice && initialHearts <= 0) {
        setShowLivesModal(true);
        return;
      }

      if (forcePractice) {
        setIsPracticeOnly(true);
      }

      playerRef.current = {
        x: 70,
        y: GROUND_Y - 48,
        width: 38,
        height: 48,
        vy: 0,
        isJumping: false,
        isDucking: false,
        invulnerableTimer: 0,
        legCycle: 0,
        dustTimer: 0,
      };
      speedRef.current = 4.8;
      distanceRef.current = 0;
      heartsRef.current = initialHearts;
      scrollsCountRef.current = 0;
      obstaclesRef.current = [];
      collectiblesRef.current = [];
      particlesRef.current = [];
      nextSpawnDistanceRef.current = 80;
      nextCollectibleDistanceRef.current = 40;
      groundScrollRef.current = 0;
      bgScrollRef.current = 0;
      midScrollRef.current = 0;

      setDistance(0);
      setHearts(initialHearts);
      setScrollsCount(0);
      setCollectedWisdoms([]);
      setActiveWisdom(WISDOM_CARDS[0]);
      setShowWisdomModal(null);
      setIsEndlessMode(false);
      setGameState("running");
    },
    [isPracticeOnly]
  );

  // ================= MAIN GAME LOOP =================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isRunning = true;

    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      if (gameState === "running") {
        updateGame(dt);
      }
      renderGame(ctx);

      if (isRunning) {
        animFrameId.current = requestAnimationFrame(gameLoop);
      }
    };

    // Update game logic
    const updateGame = (dt: number) => {
      const p = playerRef.current;
      const currentSpeed = speedRef.current;

      // Distance increment
      const distDelta = currentSpeed * dt * 10;
      distanceRef.current += distDelta;
      setDistance(Math.floor(distanceRef.current));

      // Gradual speed acceleration
      speedRef.current = Math.min(4.8 + distanceRef.current * 0.004, 9.5);

      // Check for Goal reached (500m)
      if (!isEndlessMode && distanceRef.current >= TARGET_DISTANCE) {
        setGameState("goal-reached");
        playSfx("win");
        onComplete();
        return;
      }

      // Parallax scrolls
      groundScrollRef.current = (groundScrollRef.current + currentSpeed) % CANVAS_WIDTH;
      midScrollRef.current = (midScrollRef.current + currentSpeed * 0.45) % CANVAS_WIDTH;
      bgScrollRef.current = (bgScrollRef.current + currentSpeed * 0.18) % CANVAS_WIDTH;

      // Player jump physics
      if (p.isJumping) {
        p.vy += 28 * dt; // gravity
        p.y += p.vy;

        // Ground landing
        const targetGround = p.isDucking ? GROUND_Y - 26 : GROUND_Y - 48;
        if (p.y >= targetGround) {
          p.y = targetGround;
          p.vy = 0;
          p.isJumping = false;
        }
      } else {
        // Leg animation cycle while on ground
        p.legCycle += currentSpeed * 1.8 * dt;
        p.dustTimer += dt;
        if (p.dustTimer > 0.08) {
          p.dustTimer = 0;
          particlesRef.current.push({
            x: p.x + 8,
            y: GROUND_Y - 2,
            vx: -(Math.random() * 2 + 1),
            vy: -(Math.random() * 1),
            size: Math.random() * 3.5 + 1.5,
            color: "#D4A559",
            alpha: 0.6,
            decay: 0.05,
          });
        }
      }

      // Invulnerability blink timer
      if (p.invulnerableTimer > 0) {
        p.invulnerableTimer -= dt;
      }

      // Spawn Obstacles
      if (distanceRef.current >= nextSpawnDistanceRef.current) {
        spawnRandomObstacle();
        // Variable distance between obstacles based on speed
        const gap = Math.random() * 120 + 130 - Math.min(speedRef.current * 6, 40);
        nextSpawnDistanceRef.current = distanceRef.current + gap;
      }

      // Spawn Collectibles (Scrolls / Lanterns / Dates)
      if (distanceRef.current >= nextCollectibleDistanceRef.current) {
        spawnRandomCollectible();
        const gap = Math.random() * 90 + 70;
        nextCollectibleDistanceRef.current = distanceRef.current + gap;
      }

      // Move & Update Obstacles
      for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
        const obs = obstaclesRef.current[i];
        obs.x -= currentSpeed;

        // Collision check with player
        if (p.invulnerableTimer <= 0 && checkCollision(p, obs)) {
          // Player hit obstacle!
          heartsRef.current -= 1;
          if (!isPracticeOnly) {
            saveDailyLives(heartsRef.current);
          }
          setHearts(heartsRef.current);
          p.invulnerableTimer = 1.8; // 1.8s grace period
          playSfx("hit");

          // Hit particle explosion
          for (let k = 0; k < 12; k++) {
            particlesRef.current.push({
              x: p.x + p.width / 2,
              y: p.y + p.height / 2,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              size: Math.random() * 4 + 2,
              color: "#EF4444",
              alpha: 0.9,
              decay: 0.04,
            });
          }

          if (heartsRef.current <= 0) {
            setGameState("gameover");
            return;
          }
        }

        // Remove offscreen
        if (obs.x + obs.width < -30) {
          obstaclesRef.current.splice(i, 1);
        }
      }

      // Move & Update Collectibles
      for (let i = collectiblesRef.current.length - 1; i >= 0; i--) {
        const col = collectiblesRef.current[i];
        col.x -= currentSpeed;
        col.bobPhase += dt * 4;

        // Collect check
        if (!col.collected && checkCollectibleCollision(p, col)) {
          col.collected = true;
          playSfx("collect");

          if (col.type === "scroll" || col.type === "lantern") {
            scrollsCountRef.current += 1;
            setScrollsCount(scrollsCountRef.current);

            const pickedWisdom = WISDOM_CARDS[col.wisdomIndex % WISDOM_CARDS.length];
            setActiveWisdom(pickedWisdom);
            setCollectedWisdoms((prev) => {
              if (prev.some((w) => w.id === pickedWisdom.id)) return prev;
              return [...prev, pickedWisdom];
            });
          } else if (col.type === "date") {
            // Restore 1 heart if lost
            if (heartsRef.current < MAX_DAILY_LIVES) {
              heartsRef.current = Math.min(MAX_DAILY_LIVES, heartsRef.current + 1);
              if (!isPracticeOnly) {
                saveDailyLives(heartsRef.current);
              }
              setHearts(heartsRef.current);
            }
          }

          // Golden spark explosion
          for (let k = 0; k < 14; k++) {
            particlesRef.current.push({
              x: col.x + col.width / 2,
              y: col.y + col.height / 2,
              vx: (Math.random() - 0.5) * 7,
              vy: (Math.random() - 0.5) * 7,
              size: Math.random() * 4 + 2,
              color: col.type === "date" ? "#10B981" : "#F59E0B",
              alpha: 1,
              decay: 0.035,
            });
          }

          collectiblesRef.current.splice(i, 1);
          continue;
        }

        if (col.x + col.width < -30) {
          collectiblesRef.current.splice(i, 1);
        }
      }

      // Update Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= pt.decay;
        if (pt.alpha <= 0) {
          particlesRef.current.splice(i, 1);
        }
      }
    };

    // Render Canvas
    const renderGame = (c: CanvasRenderingContext2D) => {
      c.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 1. SKY GRADIENT
      const skyGrad = c.createLinearGradient(0, 0, 0, GROUND_Y);
      skyGrad.addColorStop(0, "#2D2054"); // Twilight purple
      skyGrad.addColorStop(0.5, "#7E4071"); // Sunset rose
      skyGrad.addColorStop(0.85, "#DF895E"); // Golden desert glow
      skyGrad.addColorStop(1, "#F7CA7A"); // Horizon gold
      c.fillStyle = skyGrad;
      c.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y);

      // Crescent Moon in sky
      drawCrescentMoon(c, 700, 45, 18);

      // Twinkling desert stars
      c.fillStyle = "rgba(255, 255, 255, 0.75)";
      [
        [80, 30],
        [150, 50],
        [280, 25],
        [420, 60],
        [540, 35],
        [630, 70],
      ].forEach(([sx, sy]) => {
        c.beginPath();
        c.arc(sx, sy, 1.5, 0, Math.PI * 2);
        c.fill();
      });

      // 2. PARALLAX DISTANT DUNES & MOSQUE SILHOUETTE
      drawDistantDunes(c, bgScrollRef.current);

      // 3. PARALLAX MID-GROUND DUNES
      drawMidDunes(c, midScrollRef.current);

      // 4. DESERT GROUND & PATH
      drawDesertGround(c, groundScrollRef.current);

      // 5. DRAW PARTICLES
      particlesRef.current.forEach((pt) => {
        c.save();
        c.globalAlpha = Math.max(0, pt.alpha);
        c.fillStyle = pt.color;
        c.beginPath();
        c.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      });

      // 6. DRAW COLLECTIBLES
      collectiblesRef.current.forEach((col) => {
        drawCollectible(c, col);
      });

      // 7. DRAW OBSTACLES
      obstaclesRef.current.forEach((obs) => {
        drawObstacle(c, obs);
      });

      // 8. DRAW PLAYER RUNNER
      drawPlayer(c, playerRef.current);
    };

    animFrameId.current = requestAnimationFrame(gameLoop);
    return () => {
      isRunning = false;
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [gameState, isEndlessMode, playSfx, onComplete]);

  // ================= SPAWN HELPERS =================
  const spawnRandomObstacle = () => {
    const types: Obstacle["type"][] = ["cactus-small", "cactus-cluster", "boulder", "falcon"];
    // Give falcons slightly lower chance
    const rand = Math.random();
    const type: Obstacle["type"] =
      rand < 0.35 ? "cactus-small" : rand < 0.65 ? "cactus-cluster" : rand < 0.85 ? "boulder" : "falcon";

    let width = 24;
    let height = 38;
    let y = GROUND_Y - height;

    if (type === "cactus-cluster") {
      width = 44;
      height = 42;
      y = GROUND_Y - height;
    } else if (type === "boulder") {
      width = 34;
      height = 28;
      y = GROUND_Y - height;
    } else if (type === "falcon") {
      width = 38;
      height = 24;
      // High obstacle that requires sliding or low timing
      y = GROUND_Y - 48;
    }

    obstaclesRef.current.push({
      x: CANVAS_WIDTH + 30,
      y,
      width,
      height,
      type,
      passed: false,
    });
  };

  const spawnRandomCollectible = () => {
    const rand = Math.random();
    const type: Collectible["type"] = rand < 0.5 ? "scroll" : rand < 0.8 ? "lantern" : "date";
    const wisdomIndex = Math.floor(Math.random() * WISDOM_CARDS.length);

    // Floating height above ground
    const y = rand < 0.5 ? GROUND_Y - 45 : GROUND_Y - 70;

    collectiblesRef.current.push({
      id: Date.now() + Math.random(),
      x: CANVAS_WIDTH + 40,
      y,
      width: 26,
      height: 26,
      type,
      wisdomIndex,
      bobPhase: Math.random() * Math.PI * 2,
      collected: false,
    });
  };

  // ================= COLLISION DETECTION =================
  const checkCollision = (p: typeof playerRef.current, obs: Obstacle): boolean => {
    // Add small forgiving padding for kids
    const padX = 6;
    const padY = 5;
    return (
      p.x + padX < obs.x + obs.width - padX &&
      p.x + p.width - padX > obs.x + padX &&
      p.y + padY < obs.y + obs.height - padY &&
      p.y + p.height - padY > obs.y + padY
    );
  };

  const checkCollectibleCollision = (p: typeof playerRef.current, col: Collectible): boolean => {
    const colY = col.y + Math.sin(col.bobPhase) * 4;
    return (
      p.x < col.x + col.width &&
      p.x + p.width > col.x &&
      p.y < colY + col.height &&
      p.y + p.height > colY
    );
  };

  // ================= CANVAS DRAWING ROUTINES =================
  const drawCrescentMoon = (c: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    c.save();
    c.fillStyle = "#FFF9D2";
    c.shadowColor = "#FFEBB7";
    c.shadowBlur = 12;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();

    // Clip inner shadow to make crescent
    c.shadowBlur = 0;
    c.fillStyle = "#46295C";
    c.beginPath();
    c.arc(x - 6, y - 4, r - 2, 0, Math.PI * 2);
    c.fill();
    c.restore();
  };

  const drawDistantDunes = (c: CanvasRenderingContext2D, offset: number) => {
    c.save();
    c.fillStyle = "#A85D6F";
    c.beginPath();
    c.moveTo(0, GROUND_Y);
    for (let x = 0; x <= CANVAS_WIDTH; x += 30) {
      const angle = ((x + offset) / CANVAS_WIDTH) * Math.PI * 4;
      const y = GROUND_Y - 55 + Math.sin(angle) * 18;
      c.lineTo(x, y);
    }
    c.lineTo(CANVAS_WIDTH, GROUND_Y);
    c.closePath();
    c.fill();

    // Distant Minarets and Oasis Palms in silhouette
    const mosqueX1 = ((340 - offset * 0.7) % (CANVAS_WIDTH + 200)) - 100;
    drawMinaretSilhouette(c, mosqueX1, GROUND_Y - 60, 0.6);

    const mosqueX2 = ((760 - offset * 0.7) % (CANVAS_WIDTH + 200)) - 100;
    drawMinaretSilhouette(c, mosqueX2, GROUND_Y - 52, 0.55);
    c.restore();
  };

  const drawMinaretSilhouette = (c: CanvasRenderingContext2D, x: number, y: number, scale: number) => {
    c.save();
    c.fillStyle = "#8F4B61";
    // Dome
    c.beginPath();
    c.arc(x, y - 24 * scale, 14 * scale, Math.PI, 0);
    c.fill();
    // Minaret Spire
    c.fillRect(x - 4 * scale, y - 42 * scale, 8 * scale, 24 * scale);
    c.beginPath();
    c.moveTo(x, y - 54 * scale);
    c.lineTo(x - 5 * scale, y - 42 * scale);
    c.lineTo(x + 5 * scale, y - 42 * scale);
    c.closePath();
    c.fill();
    c.restore();
  };

  const drawMidDunes = (c: CanvasRenderingContext2D, offset: number) => {
    c.save();
    c.fillStyle = "#C87B56";
    c.beginPath();
    c.moveTo(0, GROUND_Y);
    for (let x = 0; x <= CANVAS_WIDTH; x += 25) {
      const angle = ((x + offset) / CANVAS_WIDTH) * Math.PI * 3;
      const y = GROUND_Y - 32 + Math.sin(angle) * 12;
      c.lineTo(x, y);
    }
    c.lineTo(CANVAS_WIDTH, GROUND_Y);
    c.closePath();
    c.fill();
    c.restore();
  };

  const drawDesertGround = (c: CanvasRenderingContext2D, offset: number) => {
    c.save();
    // Warm desert sand top layer
    c.fillStyle = "#E5B162";
    c.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

    // Darker sand base
    c.fillStyle = "#C6903D";
    c.fillRect(0, GROUND_Y + 12, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y - 12);

    // Fine ground line
    c.strokeStyle = "#8A5A1B";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(0, GROUND_Y);
    c.lineTo(CANVAS_WIDTH, GROUND_Y);
    c.stroke();

    // Scrolling pebbles and texture dashes
    c.fillStyle = "#A7752B";
    for (let i = 0; i < 18; i++) {
      const px = ((i * 55 - offset) % CANVAS_WIDTH + CANVAS_WIDTH) % CANVAS_WIDTH;
      const py = GROUND_Y + 5 + (i % 3) * 6;
      c.fillRect(px, py, (i % 2 === 0 ? 8 : 4), 2);
    }
    c.restore();
  };

  // Draw Player Character (Young explorer with fluttering keffiyeh scarf)
  const drawPlayer = (c: CanvasRenderingContext2D, p: typeof playerRef.current) => {
    c.save();

    // Invulnerability blink
    if (p.invulnerableTimer > 0 && Math.floor(p.invulnerableTimer * 10) % 2 === 0) {
      c.globalAlpha = 0.35;
    }

    const px = p.x;
    const py = p.y;
    const isDucking = p.isDucking;

    // Soft ground shadow beneath feet
    c.fillStyle = "rgba(70, 40, 10, 0.28)";
    c.beginPath();
    const shadowW = isDucking ? 42 : 32;
    c.ellipse(px + p.width / 2, GROUND_Y - 1, shadowW / 2, 4, 0, 0, Math.PI * 2);
    c.fill();

    if (isDucking) {
      // ================= SLIDING / CROUCHING POSE =================
      // Tunic body (horizontal low crouch)
      c.fillStyle = "#4338CA"; // Indigo tunic
      c.beginPath();
      c.roundRect(px + 4, py + 8, 30, 16, 6);
      c.fill();

      // Head
      c.fillStyle = "#FDDFB6"; // Skin tone
      c.beginPath();
      c.arc(px + 32, py + 12, 9, 0, Math.PI * 2);
      c.fill();

      // Desert Scarf / Keffiyeh
      c.fillStyle = "#F59E0B"; // Golden amber scarf
      c.beginPath();
      c.arc(px + 30, py + 9, 9, Math.PI * 0.8, Math.PI * 2.2);
      c.fill();

      // Trailing fluttering scarf tails behind
      c.strokeStyle = "#F59E0B";
      c.lineWidth = 4;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(px + 22, py + 12);
      c.quadraticCurveTo(px + 10, py + 8, px - 6, py + 10);
      c.stroke();

      // Legs sliding forward
      c.strokeStyle = "#1E1B4B";
      c.lineWidth = 5;
      c.beginPath();
      c.moveTo(px + 14, py + 18);
      c.lineTo(px + 4, py + 24);
      c.stroke();
    } else {
      // ================= RUNNING / JUMPING POSE =================
      const legPhase = Math.sin(p.legCycle);

      // Back Arm / Shoulder
      c.strokeStyle = "#FCD34D";
      c.lineWidth = 4;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(px + 18, py + 18);
      c.lineTo(px + 10 + legPhase * 5, py + 26);
      c.stroke();

      // Legs
      c.strokeStyle = "#1E1B4B"; // Dark pants
      c.lineWidth = 5;
      c.lineCap = "round";

      if (p.isJumping) {
        // Tucked jumping legs
        c.beginPath();
        c.moveTo(px + 14, py + 34);
        c.lineTo(px + 8, py + 42);
        c.moveTo(px + 24, py + 34);
        c.lineTo(px + 28, py + 42);
        c.stroke();
      } else {
        // Running scissor legs
        // Left Leg
        c.beginPath();
        c.moveTo(px + 15, py + 34);
        c.lineTo(px + 15 - legPhase * 12, py + 46);
        c.stroke();

        // Right Leg
        c.beginPath();
        c.moveTo(px + 23, py + 34);
        c.lineTo(px + 23 + legPhase * 12, py + 46);
        c.stroke();
      }

      // Tunic Body
      c.fillStyle = "#4338CA"; // Indigo tunic
      c.beginPath();
      c.roundRect(px + 10, py + 14, 20, 22, 5);
      c.fill();

      // White sash / belt
      c.fillStyle = "#FFFFFF";
      c.fillRect(px + 10, py + 26, 20, 3);

      // Head
      c.fillStyle = "#FDDFB6"; // Skin tone
      c.beginPath();
      c.arc(px + 20, py + 9, 8, 0, Math.PI * 2);
      c.fill();

      // Head Scarf / Keffiyeh
      c.fillStyle = "#F59E0B"; // Golden amber
      c.beginPath();
      c.arc(px + 20, py + 7, 9, Math.PI * 0.9, Math.PI * 2.1);
      c.fill();

      // Agal band
      c.fillStyle = "#191A22";
      c.fillRect(px + 13, py + 4, 14, 2);

      // Trailing Scarf flutter in desert wind
      c.strokeStyle = "#F59E0B";
      c.lineWidth = 4;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(px + 13, py + 11);
      const flutter = Math.sin(p.legCycle * 1.5) * 4;
      c.quadraticCurveTo(px + 2, py + 12 + flutter, px - 12, py + 14 - flutter);
      c.stroke();

      // Front Arm pumping
      c.strokeStyle = "#FDDFB6";
      c.lineWidth = 4;
      c.beginPath();
      c.moveTo(px + 22, py + 18);
      c.lineTo(px + 30 - legPhase * 7, py + 24);
      c.stroke();
    }

    c.restore();
  };

  // Draw Obstacles (Cactus, Boulders, Flying Desert Falcon)
  const drawObstacle = (c: CanvasRenderingContext2D, obs: Obstacle) => {
    c.save();
    if (obs.type === "cactus-small") {
      // Vibrant green desert cactus with arms and thorns
      c.fillStyle = "#15803D";
      // Main trunk
      c.beginPath();
      c.roundRect(obs.x + 8, obs.y, 10, obs.height, 5);
      c.fill();
      // Left arm
      c.beginPath();
      c.roundRect(obs.x, obs.y + 12, 10, 6, 3);
      c.roundRect(obs.x, obs.y + 4, 6, 12, 3);
      c.fill();
      // Thorns
      c.strokeStyle = "#FEF08A";
      c.lineWidth = 1.5;
      c.beginPath();
      c.moveTo(obs.x + 6, obs.y + 8);
      c.lineTo(obs.x + 2, obs.y + 6);
      c.moveTo(obs.x + 20, obs.y + 16);
      c.lineTo(obs.x + 24, obs.y + 14);
      c.stroke();
    } else if (obs.type === "cactus-cluster") {
      // Double cactus cluster
      c.fillStyle = "#166534";
      c.beginPath();
      c.roundRect(obs.x + 6, obs.y + 4, 11, obs.height - 4, 5);
      c.roundRect(obs.x + 24, obs.y, 12, obs.height, 6);
      c.fill();
      // Side branches
      c.beginPath();
      c.roundRect(obs.x, obs.y + 18, 9, 6, 3);
      c.roundRect(obs.x + 33, obs.y + 14, 9, 6, 3);
      c.fill();
    } else if (obs.type === "boulder") {
      // Desert sandstone rock
      c.fillStyle = "#92400E";
      c.beginPath();
      c.moveTo(obs.x + 4, obs.y + obs.height);
      c.lineTo(obs.x + obs.width - 4, obs.y + obs.height);
      c.lineTo(obs.x + obs.width, obs.y + 10);
      c.lineTo(obs.x + obs.width * 0.6, obs.y);
      c.lineTo(obs.x + 2, obs.y + 8);
      c.closePath();
      c.fill();

      // Rock highlight
      c.fillStyle = "#B45309";
      c.beginPath();
      c.moveTo(obs.x + 6, obs.y + 10);
      c.lineTo(obs.x + obs.width * 0.55, obs.y + 2);
      c.lineTo(obs.x + obs.width * 0.45, obs.y + 14);
      c.closePath();
      c.fill();
    } else if (obs.type === "falcon") {
      // Flying Desert Falcon
      const wingPhase = Math.sin(Date.now() * 0.015) * 8;
      c.fillStyle = "#451A03"; // Dark falcon brown

      // Falcon body
      c.beginPath();
      c.ellipse(obs.x + obs.width / 2, obs.y + 12, 14, 6, -0.1, 0, Math.PI * 2);
      c.fill();

      // Falcon wings flapping
      c.beginPath();
      c.moveTo(obs.x + obs.width / 2, obs.y + 10);
      c.lineTo(obs.x + 10, obs.y + 10 + wingPhase);
      c.lineTo(obs.x + obs.width - 6, obs.y + 10 + wingPhase);
      c.closePath();
      c.fill();

      // Beak
      c.fillStyle = "#F59E0B";
      c.beginPath();
      c.moveTo(obs.x + 4, obs.y + 11);
      c.lineTo(obs.x - 2, obs.y + 13);
      c.lineTo(obs.x + 4, obs.y + 15);
      c.closePath();
      c.fill();
    }
    c.restore();
  };

  // Draw Collectibles (Scroll 📜, Lantern 🏮, Date 🌴)
  const drawCollectible = (c: CanvasRenderingContext2D, col: Collectible) => {
    c.save();
    const bobY = col.y + Math.sin(col.bobPhase) * 4;

    // Glowing halo
    const halo = c.createRadialGradient(
      col.x + col.width / 2,
      bobY + col.height / 2,
      2,
      col.x + col.width / 2,
      bobY + col.height / 2,
      22
    );
    halo.addColorStop(0, col.type === "date" ? "rgba(52, 211, 153, 0.7)" : "rgba(251, 191, 36, 0.75)");
    halo.addColorStop(1, "rgba(251, 191, 36, 0)");
    c.fillStyle = halo;
    c.beginPath();
    c.arc(col.x + col.width / 2, bobY + col.height / 2, 22, 0, Math.PI * 2);
    c.fill();

    if (col.type === "scroll") {
      // Golden Knowledge Scroll
      c.fillStyle = "#FEF3C7"; // Parchment
      c.beginPath();
      c.roundRect(col.x + 4, bobY + 4, 18, 18, 3);
      c.fill();
      c.strokeStyle = "#D97706";
      c.lineWidth = 1.5;
      c.stroke();
      // Ribbon
      c.fillStyle = "#EF4444";
      c.fillRect(col.x + 11, bobY + 4, 4, 18);
    } else if (col.type === "lantern") {
      // Glowing Noor Fanous Lantern
      c.fillStyle = "#F59E0B";
      // Lantern cap
      c.beginPath();
      c.moveTo(col.x + 13, bobY + 2);
      c.lineTo(col.x + 6, bobY + 8);
      c.lineTo(col.x + 20, bobY + 8);
      c.closePath();
      c.fill();
      // Glass body
      c.fillStyle = "#FEF08A";
      c.fillRect(col.x + 8, bobY + 8, 10, 12);
      // Flame inside
      c.fillStyle = "#F97316";
      c.beginPath();
      c.arc(col.x + 13, bobY + 14, 3, 0, Math.PI * 2);
      c.fill();
      // Base
      c.fillStyle = "#F59E0B";
      c.fillRect(col.x + 7, bobY + 20, 12, 4);
    } else if (col.type === "date") {
      // Sweet Ajwah Date (Health)
      c.fillStyle = "#059669";
      c.beginPath();
      c.ellipse(col.x + 13, bobY + 13, 10, 7, Math.PI / 4, 0, Math.PI * 2);
      c.fill();
      // Heart indicator
      c.fillStyle = "#FFFFFF";
      c.beginPath();
      c.arc(col.x + 11, bobY + 11, 2, 0, Math.PI * 2);
      c.arc(col.x + 15, bobY + 11, 2, 0, Math.PI * 2);
      c.fill();
    }
    c.restore();
  };

  return (
    <div className="space-y-3.5 animate-fade-in select-none">
      {/* Top Header Bar - Cleaned HUD without redundant Games Menu button */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Left: Playful Title & Mode Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FFF8E7] to-[#FFEBB7] border border-[#FFD184] text-[#7A4B00] text-xs font-black shadow-2xs">
            <span className="text-sm">🏃</span>
            <span>{lang === "ml" ? "ഡെസേർട്ട് റണ്ണർ" : "Desert Runner"}</span>
          </div>
          {isPracticeOnly && (
            <span className="px-2.5 py-1 rounded-full bg-[#E0E7FF] border border-[#C7D2FE] text-[#4338CA] text-[10px] font-black inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#4338CA]" />
              <span>{lang === "ml" ? "പരിശീലനം" : "Practice"}</span>
            </span>
          )}
        </div>

        {/* Right: Functional 3-Life Button, Distance, Scrolls, Sound & Pause */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Functional 3 Life Button - Clickable with Daily Info & Refill */}
          <button
            type="button"
            onClick={() => {
              playSfx("click");
              setShowLivesModal(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white hover:bg-rose-50 border-2 border-[#FECDD3] hover:border-[#FDA4AF] active:scale-95 transition-all shadow-2xs cursor-pointer group"
            title={lang === "ml" ? "ദിവസേനയുള്ള ഹൃദയങ്ങൾ (വിവരങ്ങൾ കാണാൻ ക്ലിക്ക് ചെയ്യുക)" : "Daily Hearts (Tap for info & refill)"}
          >
            <div className="flex items-center gap-0.5">
              {[1, 2, 3].map((h) => (
                <Heart
                  key={h}
                  className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                    h <= hearts
                      ? "text-[#EF4444] fill-[#EF4444] drop-shadow-[0_1px_2px_rgba(239,68,68,0.4)]"
                      : "text-[#D1D5DB] fill-[#F3F4F6]"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-black text-[#E11D48] tracking-tight">
              {hearts}/3
            </span>
          </button>

          {/* Distance Meter */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#FFEBB7] border border-[#FFD184] text-[#7A4B00] text-xs font-black shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-[#FF9800]" />
            <span>
              {distance}m {isEndlessMode ? "" : `/ ${TARGET_DISTANCE}m`}
            </span>
          </div>

          {/* Scrolls Collected */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#E3D4FF] border border-[#D0BAFF] text-[#5A35C7] text-xs font-black shadow-2xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{scrollsCount}</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundMuted((prev) => !prev)}
            className="p-1.5 rounded-full bg-white border border-[#E4E0E9] text-[#626273] hover:text-[#141426] active:scale-95 transition-all shadow-2xs"
            title={soundMuted ? "Unmute" : "Mute"}
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Pause Toggle */}
          {gameState === "running" && (
            <button
              type="button"
              onClick={() => setGameState("paused")}
              className="p-1.5 rounded-full bg-white border border-[#E4E0E9] text-[#626273] hover:text-[#141426] active:scale-95 transition-all shadow-2xs"
              title="Pause"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas Container */}
      <div className="relative rounded-[28px] overflow-hidden border-2 border-[#191A22] shadow-md bg-[#2D2054]">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={triggerJump}
          className="w-full h-auto aspect-[800/320] block cursor-pointer"
        />

        {/* READY / START SCREEN OVERLAY */}
        {gameState === "ready" && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3 animate-fade-in">
            {/* If out of daily lives and not in practice */}
            {!isPracticeOnly && hearts <= 0 ? (
              <div className="space-y-3 max-w-sm">
                <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center text-3xl">
                  💔
                </div>
                <div>
                  <h3 className="text-xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
                    {lang === "ml" ? "ഇന്നത്തെ 3 ഹൃദയങ്ങൾ തീർന്നു!" : "Out of Daily Hearts!"}
                  </h3>
                  <p className="text-xs text-[#FFD184] font-medium mt-1">
                    {lang === "ml"
                      ? `രാത്രി 12 മണിക്ക് (${midnightTime.hours}h ${midnightTime.minutes}m) 3 ഹൃദയങ്ങളും വീണ്ടും ലഭിക്കും. അല്ലെങ്കിൽ ഒരു ചോദ്യത്തിന് ഉത്തരം നൽകി +1 ഹൃദയം നേടൂ!`
                      : `Refills at midnight (in ${midnightTime.hours}h ${midnightTime.minutes}m)! Or answer a quick question to get +1 heart right now.`}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      playSfx("click");
                      setShowLivesModal(true);
                      setShowBonusQuiz(true);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#FFD184] hover:bg-[#FFBF5F] text-[#7A4B00] text-xs font-black flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-[#FF9800]" />
                    <span>{lang === "ml" ? "+1 ഹൃദയം നേടാം ✨" : "Answer Quiz for +1 Heart ✨"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => resetGame(true)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold active:scale-95 transition-all"
                  >
                    <span>{lang === "ml" ? "പരിശീലന കളി (സൗജന്യം)" : "Free Practice Run"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#FFD184] text-[#191A22] flex items-center justify-center text-3xl shadow-lg animate-bounce">
                  🏃
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
                    {lang === "ml" ? "നൂർ ഡെസേർട്ട് റണ്ണർ" : "Noor Desert Runner"}
                  </h2>
                  <p className="text-xs text-[#FFD184] font-medium max-w-md mt-1">
                    {lang === "ml"
                      ? "മദീന ഒയാസിസിലേക്ക് ഓടുക! മുള്ളുകളിൽ തട്ടാതെ ചാടുക, വിജ്ഞാന ചുരുളുകൾ ശേഖരിച്ച് ഹദീസുകൾ പഠിക്കുക."
                      : "Run to the Oasis of Madinah! Jump over thorns, duck under falcons, and collect wisdom scrolls."}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={triggerJump}
                    className="px-6 py-2.5 rounded-full bg-[#FFD184] hover:bg-[#FFBF5F] text-[#191A22] text-xs font-black flex items-center gap-2 tactile shadow-md"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{lang === "ml" ? "കളിച്ചു തുടങ്ങാം (Space / Tap)" : "Start Journey (Space / Tap)"}</span>
                  </button>
                </div>

                {/* Instruction shortcuts */}
                <div className="flex items-center gap-4 text-[11px] text-white/80 font-medium pt-1">
                  <span>⬆️ Space / Up: {lang === "ml" ? "ചാടുക" : "Jump"}</span>
                  <span>⬇️ Down / S: {lang === "ml" ? "താഴുക" : "Duck"}</span>
                  <span>🏮 {lang === "ml" ? "ഹദീസുകൾ ശേഖരിക്കുക" : "Collect Hadiths"}</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* PAUSED OVERLAY */}
        {gameState === "paused" && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3">
            <h3 className="text-xl font-black">{lang === "ml" ? "ഗെയിം താല്ക്കാലികമായി നിർത്തി" : "Game Paused"}</h3>
            <button
              type="button"
              onClick={() => setGameState("running")}
              className="px-6 py-2 rounded-full bg-[#FFD184] text-[#191A22] text-xs font-black tactile"
            >
              {lang === "ml" ? "തുടരുക" : "Resume"}
            </button>
          </div>
        )}

        {/* GAME OVER OVERLAY */}
        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-[#EF4444]/20 border border-[#EF4444] text-white flex items-center justify-center text-2xl">
              💔
            </div>
            <div>
              <h3 className="text-xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
                {!isPracticeOnly && hearts <= 0
                  ? lang === "ml"
                    ? "ഇന്നത്തെ ഹൃദയങ്ങൾ തീർന്നു!"
                    : "All 3 Daily Hearts Used!"
                  : lang === "ml"
                  ? "യാത്ര തടസ്സപ്പെട്ടു!"
                  : "Journey Interrupted!"}
              </h3>
              <p className="text-xs text-[#E4E0E9] mt-0.5">
                {lang === "ml"
                  ? `നിങ്ങൾ ${distance} മീറ്റർ പിന്നിട്ടു, ${scrollsCount} വിജ്ഞാന മുത്തുകൾ ശേഖരിച്ചു.`
                  : `You ran ${distance} meters and discovered ${scrollsCount} wisdom pearls.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {/* If daily lives left or practice mode */}
              {isPracticeOnly || hearts > 0 ? (
                <button
                  type="button"
                  onClick={() => resetGame(false)}
                  className="px-5 py-2.5 rounded-full bg-[#FFD184] hover:bg-[#FFBF5F] text-[#191A22] text-xs font-black flex items-center gap-1.5 tactile"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>
                    {lang === "ml"
                      ? `വീണ്ടും ശ്രമിക്കാം (${hearts} ജീവൻ)`
                      : `Try Again (${hearts} left)`}
                  </span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      playSfx("click");
                      setShowLivesModal(true);
                      setShowBonusQuiz(true);
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#FFD184] hover:bg-[#FFBF5F] text-[#7A4B00] text-xs font-black flex items-center gap-1.5 tactile shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-[#FF9800]" />
                    <span>{lang === "ml" ? "+1 ഹൃദയം നേടാം ✨" : "Get +1 Heart (Quiz) ✨"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => resetGame(true)}
                    className="px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold tactile"
                  >
                    <span>{lang === "ml" ? "പരിശീലനം (സൗജന്യം)" : "Practice Mode"}</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={onBackToMenu}
                className="px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold tactile"
              >
                <span>{lang === "ml" ? "മറ്റു ഗെയിമുകൾ" : "All Games"}</span>
              </button>
            </div>
          </div>
        )}

        {/* GOAL REACHED OVERLAY (500m MADINAH OASIS) */}
        {gameState === "goal-reached" && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-3 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#FFEBB7] flex items-center justify-center text-3xl shadow-lg animate-bounce">
              🏆
            </div>
            <div>
              <span className="px-3 py-1 rounded-full bg-[#D2F4DE] text-[#287553] text-xs font-black inline-flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isClaimed ? "OASIS COMPLETED • REPLAY" : "+10 XP EARNED!"}</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
                {lang === "ml" ? "മാഷാ അല്ലാഹ്! മദീന ഒയാസിസിൽ എത്തി!" : "MashaAllah! Oasis of Madinah Reached!"}
              </h3>
              <p className="text-xs text-[#FFD184] max-w-sm mx-auto mt-1">
                {lang === "ml"
                  ? "സൽപ്രവൃത്തികളും വിജ്ഞാനവും കൊണ്ട് നിങ്ങൾ വിജയകരമായി 500 മീറ്റർ മരുഭൂയാത്ര പൂർത്തിയാക്കി!"
                  : "Through patience, agility, and gathering wisdom, you safely reached the sanctuary of Madinah!"}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsEndlessMode(true);
                  setGameState("running");
                }}
                className="px-5 py-2.5 rounded-full bg-[#FFD184] hover:bg-[#FFBF5F] text-[#191A22] text-xs font-black flex items-center gap-1.5 tactile"
              >
                <Flame className="w-4 h-4 text-[#FF9800]" />
                <span>{lang === "ml" ? "തുടർന്ന് ഓടാം (Endless Run)" : "Keep Running (Endless)"}</span>
              </button>

              <button
                type="button"
                onClick={() => resetGame(false)}
                className="px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold tactile flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === "ml" ? "പുതിയ കളി" : "Restart"}</span>
              </button>

              <button
                type="button"
                onClick={onBackToMenu}
                className="px-4 py-2.5 rounded-full bg-white text-[#191A22] text-xs font-bold tactile"
              >
                <span>{lang === "ml" ? "പൂർത്തിയാക്കുക" : "Finish & Back"}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TACTILE 3D ON-SCREEN TOUCH CONTROLS - Easy & intuitive for children */}
      <div className="grid grid-cols-2 gap-3 pt-0.5">
        <button
          type="button"
          onTouchStart={() => setDuckState(true)}
          onTouchEnd={() => setDuckState(false)}
          onMouseDown={() => setDuckState(true)}
          onMouseUp={() => setDuckState(false)}
          className="py-4 px-4 rounded-2xl bg-gradient-to-b from-[#EDE9FE] to-[#DDD6FE] active:translate-y-1 border-b-4 border-[#C4B5FD] text-[#5B21B6] font-black text-sm flex items-center justify-center gap-2 select-none shadow-xs cursor-pointer transition-all"
        >
          <ArrowDown className="w-5 h-5 text-[#6D28D9]" />
          <span>{lang === "ml" ? "താഴുക (DUCK)" : "DUCK / SLIDE"}</span>
        </button>

        <button
          type="button"
          onTouchStart={triggerJump}
          onClick={triggerJump}
          className="py-4 px-4 rounded-2xl bg-gradient-to-b from-[#FCD34D] via-[#FBBF24] to-[#F59E0B] active:translate-y-1 border-b-4 border-[#B45309] text-[#78350F] font-black text-sm flex items-center justify-center gap-2 select-none shadow-md cursor-pointer transition-all"
        >
          <ArrowUp className="w-5 h-5 text-[#92400E]" />
          <span>{lang === "ml" ? "ചാടുക (JUMP) 🚀" : "JUMP 🚀"}</span>
        </button>
      </div>

      {/* LIVE INFORMATIVE WISDOM BANNER */}
      <div className="bg-gradient-to-r from-[#FFF8E7] via-[#FFFDF5] to-[#FFF8E7] border-2 border-[#FFD184] rounded-[24px] p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#FFE4B5] text-[#7A4B00] flex items-center justify-center text-sm">
              📜
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#7A4B00]">
              {lang === "ml" ? "നേടിയ വിജ്ഞാനം (Hadith of the Journey)" : "Wisdom from the Journey"}
            </span>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-[#E3D4FF] text-[#5A35C7] text-[10px] font-black">
            {activeWisdom.source[lang]}
          </span>
        </div>

        <p className="text-sm font-bold text-[#141426] leading-relaxed italic">
          "{activeWisdom.hadith[lang]}"
        </p>

        <p className="text-xs text-[#626273] font-medium flex items-center gap-1.5 pt-1 border-t border-[#FFE4B5]/60">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#287553] shrink-0" />
          <span>{activeWisdom.action[lang]}</span>
        </p>
      </div>

      {/* COLLECTED WISDOM ARCHIVE ACCORDION / LIST */}
      {collectedWisdoms.length > 0 && (
        <div className="bg-white rounded-[24px] border border-[#E4E0E9] p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-[#141426] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#7857E8]" />
              <span>
                {lang === "ml"
                  ? `ഈ കളിയിൽ നിങ്ങൾ കണ്ടെത്തിയ ഹദീസുകൾ (${collectedWisdoms.length})`
                  : `Hadith Pearls Discovered in this Run (${collectedWisdoms.length})`}
              </span>
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {collectedWisdoms.map((w) => (
              <div
                key={w.id}
                className="p-2.5 rounded-xl bg-[#F8F7FA] border border-[#E4E0E9]/60 text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-[#7857E8]">
                  <span>{w.source[lang]}</span>
                  <span className="text-[#287553]">✓ Collected</span>
                </div>
                <p className="font-semibold text-[#141426] line-clamp-2">"{w.hadith[lang]}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DAILY LIVES INTERACTIVE MODAL & QUIZ                           */}
      {/* ============================================================== */}
      {showLivesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border-2 border-[#FECDD3] animate-pop relative">
            {/* Close button */}
            <button
              type="button"
              onClick={() => {
                playSfx("click");
                setShowLivesModal(false);
                setShowBonusQuiz(false);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F3F1F4] hover:bg-[#E4E0E9] flex items-center justify-center text-[#626273] hover:text-[#141426] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-3xl shadow-inner">
              💖
            </div>

            <div>
              <h3 className="text-xl font-black text-[#141426]" style={{ fontFamily: "var(--font-display)" }}>
                {lang === "ml" ? "ദിവസേനയുള്ള 3 ഹൃദയങ്ങൾ" : "3 Daily Hearts"}
              </h3>
              <p className="text-xs text-[#626273] mt-1 leading-relaxed">
                {lang === "ml"
                  ? "കളിക്കാൻ ദിവസവും നിങ്ങൾക്ക് 3 ഹൃദയങ്ങൾ ലഭിക്കുന്നു. മുള്ളുകളിലോ പക്ഷികളിലോ തട്ടുമ്പോൾ ജീവൻ കുറയും."
                  : "You get 3 hearts every day to explore the desert and collect Hadith pearls!"}
              </p>
            </div>

            {/* Big 3 Hearts Row */}
            <div className="flex items-center justify-center gap-3 py-2.5 px-4 rounded-2xl bg-rose-50/70 border border-rose-100">
              {[1, 2, 3].map((h) => (
                <div key={h} className="flex flex-col items-center gap-1">
                  <Heart
                    className={`w-8 h-8 transition-all ${
                      h <= hearts
                        ? "text-[#EF4444] fill-[#EF4444] scale-110 drop-shadow-[0_2px_4px_rgba(239,68,68,0.3)] animate-pulse"
                        : "text-[#D1D5DB] fill-[#F3F4F6] opacity-60"
                    }`}
                  />
                  <span className="text-[10px] font-bold text-[#626273]">
                    {h <= hearts ? (lang === "ml" ? "സജീവം" : "Active") : (lang === "ml" ? "തീർന്നു" : "Used")}
                  </span>
                </div>
              ))}
            </div>

            {/* Midnight Refill Timer */}
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#7A4B00] bg-[#FFF8E7] border border-[#FFD184] rounded-xl py-2 px-3">
              <Clock className="w-4 h-4 text-[#FF9800] shrink-0" />
              <span>
                {lang === "ml"
                  ? `റീഫിൽ: രാത്രി 12 മണിക്ക് (${midnightTime.hours}h ${midnightTime.minutes}m) 🌙`
                  : `Refills at midnight (in ${midnightTime.hours}h ${midnightTime.minutes}m)! 🌙`}
              </span>
            </div>

            {/* Ajwah Date Tip */}
            <div className="text-[11px] text-[#287553] bg-[#E8F8F0] border border-[#A7F3D0] rounded-xl p-2.5 text-left flex items-start gap-2">
              <span className="text-base leading-none">🌴</span>
              <span>
                {lang === "ml"
                  ? "മരുഭൂമിയിൽ പറക്കുന്ന പച്ച അജ്‌വ ഈത്തപ്പഴങ്ങൾ പിടിച്ചാൽ നഷ്ടപ്പെട്ട 1 ജീവൻ തിരികെ കിട്ടും!"
                  : "Secret tip: Catch floating green Ajwah dates in the run to heal +1 lost heart!"}
              </span>
            </div>

            {/* Bonus Heart Quiz Trigger if hearts < 3 */}
            {hearts < MAX_DAILY_LIVES && !showBonusQuiz && (
              <button
                type="button"
                onClick={() => {
                  playSfx("click");
                  setShowBonusQuiz(true);
                  setQuizAnswered(null);
                }}
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#FFD184] to-[#FFBF5F] hover:from-[#FFBF5F] hover:to-[#FF9800] text-[#7A4B00] font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all tactile cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FF9800]" />
                <span>
                  {lang === "ml"
                    ? "+1 ഹൃദയം നേടാൻ ഒരു ചോദ്യം ഉത്തരം പറയൂ!"
                    : "Answer 1 Question for +1 Heart! ✨"}
                </span>
              </button>
            )}

            {/* Bonus Quiz Section */}
            {showBonusQuiz && (
              <div className="p-3 bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl text-left space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#7857E8] uppercase tracking-wider">
                    {lang === "ml" ? "ബോണസ് ചോദ്യം" : "Bonus Heart Quiz"}
                  </span>
                  <span className="text-[10px] font-bold text-[#626273]">+1 ❤️</span>
                </div>
                <p className="text-xs font-bold text-[#141426]">
                  {BONUS_QUESTIONS[quizQuestionIndex % BONUS_QUESTIONS.length].q[lang]}
                </p>
                <div className="space-y-1.5">
                  {BONUS_QUESTIONS[quizQuestionIndex % BONUS_QUESTIONS.length].options.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAnswerBonusQuiz(opt.isCorrect)}
                      disabled={quizAnswered !== null}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold text-left transition-all border cursor-pointer ${
                        quizAnswered === null
                          ? "bg-white hover:bg-[#F3F0FF] border-[#E9D5FF] text-[#141426]"
                          : opt.isCorrect
                          ? "bg-[#D2F4DE] border-[#287553] text-[#1E563C]"
                          : "bg-white/50 border-gray-200 text-gray-400 opacity-60"
                      }`}
                    >
                      {opt.text[lang]}
                    </button>
                  ))}
                </div>

                {quizAnswered === true && (
                  <div className="p-2 bg-[#D2F4DE] text-[#1E563C] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 animate-bounce">
                    <CheckCircle2 className="w-4 h-4 text-[#287553]" />
                    <span>
                      {lang === "ml" ? "മാശാ അല്ലാഹ്! +1 ഹൃദയം ചേർത്തു!" : "MashaAllah! +1 Heart Restored!"}
                    </span>
                  </div>
                )}
                {quizAnswered === false && (
                  <p className="text-[11px] font-bold text-[#D14343] text-center">
                    {lang === "ml"
                      ? "വീണ്ടും ശ്രമിക്കൂ! ശരിയുത്തരം തിരഞ്ഞെടുക്കൂ."
                      : "Try again! You can pick the right answer."}
                  </p>
                )}
              </div>
            )}

            {/* Close / Action Button */}
            <button
              type="button"
              onClick={() => {
                playSfx("click");
                setShowLivesModal(false);
                setShowBonusQuiz(false);
              }}
              className="w-full py-2.5 rounded-full bg-[#191A22] hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>{lang === "ml" ? "കളിക്കാം! 🚀" : "Let's Play! 🚀"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
