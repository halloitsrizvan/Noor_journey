import type { Chapter, World } from "@/lib/noor/types";
import { akhlaqMissions } from "./chapter-akhlaq";

export const akhlaqChapter: Chapter = {
  id: "akhlaq-small-actions",
  worldId: "akhlaq",
  title: {
    ml: "ചെറിയ പ്രവൃത്തികൾ, നല്ല സ്വഭാവം",
    en: "Small Actions, Good Character",
  },
  description: {
    ml: "ദൈനംദിന ജീവിതത്തിൽ സൗമ്യമായി സംസാരിക്കാനും, വാക്ക് പാലിക്കാനും, മറ്റുള്ളവരെ സഹായിക്കാനും പഠിക്കാം.",
    en: "Learn to speak gently, keep promises, and respect others in everyday scenarios.",
  },
  learn: [
    { ml: "ദേഷ്യം വരുമ്പോഴും നല്ല വാക്കുകൾ കണ്ടെത്തൽ", en: "Finding kind words even when upset" },
    { ml: "വാക്ക് പാലിക്കുന്നതിന്റെ പ്രാധാന്യം", en: "The importance of keeping promises" },
    { ml: "കടം വാങ്ങിയവ കൃത്യമായി തിരികെ നൽകൽ", en: "Returning borrowed items with care" },
    { ml: "വീട്ടുജോലികളിൽ സന്തോഷത്തോടെ സഹായിക്കൽ", en: "Helping cheerfully with home chores" },
    { ml: "സത്യസന്ധവും മാന്യവുമായ സൗഹൃദം", en: "Honest, respectful and supportive friendship" },
  ],
  badge: {
    id: "badge-akhlaq-guardian",
    name: {
      ml: "നന്മയുടെ കാവൽക്കാരൻ",
      en: "Guardian of Good Character",
    },
  },
  missionIds: akhlaqMissions.map((m) => m.id),
  playable: true,
};

export const worlds: World[] = [
  {
    id: "akhlaq",
    title: {
      ml: "അഖ്ലാഖും സ്വഭാവവും",
      en: "Akhlaq and Character",
    },
    blurb: {
      ml: "സത്യസന്ധത, ദയ, വാക്കുപാലിക്കൽ, ക്ഷമ, മാതാപിതാക്കളോടും കൂട്ടുകാരോടുമുള്ള മര്യാദകൾ.",
      en: "Story decisions about honesty, kindness, keeping promises, respect, and helping others.",
    },
    subjects: ["taskiya-akhlaq"],
    chapterIds: ["akhlaq-small-actions"],
    playable: true,
    previewTopics: [
      { ml: "നല്ല വാക്കുകൾ", en: "Kind Words" },
      { ml: "വാക്ക് പാലിക്കൽ", en: "Keeping Promises" },
      { ml: "കടം വാങ്ങിയവ നൽകൽ", en: "Returning Belongings" },
      { ml: "വീട്ടിൽ സഹായിക്കൽ", en: "Helping at Home" },
      { ml: "നല്ല സൗഹൃദം", en: "Respectful Friendship" },
    ],
  },
  {
    id: "foundations",
    title: {
      ml: "ഇസ്ലാമിക അടിത്തറകൾ",
      en: "Islamic Foundations",
    },
    blurb: {
      ml: "അഖാഇദ്, അടിസ്ഥാന ആരാധനാ കർമ്മങ്ങൾ, ഖുർആൻ വായനാ മര്യാദകൾ.",
      en: "Guided concepts, core worship knowledge, and foundational Quran practice.",
    },
    subjects: ["aqaid", "fiqh", "quran-studies"],
    chapterIds: [],
    playable: false,
    previewTopics: [
      { ml: "ഈമാൻ കാര്യങ്ങൾ", en: "Pillars of Faith" },
      { ml: "ശുദ്ധിയും വുളൂഉം", en: "Cleanliness & Wudu" },
      { ml: "സുന്ദരമായ ഖുർആൻ ഓത്ത്", en: "Recitation Etiquette" },
    ],
  },
  {
    id: "stories",
    title: {
      ml: "ചരിത്രങ്ങളും പാഠങ്ങളും",
      en: "Stories and Lessons",
    },
    blurb: {
      ml: "പ്രവാചകന്മാരുടെയും സ്വഹാബികളുടെയും ചരിത്രത്തിൽ നിന്നുള്ള മാതൃകകൾ.",
      en: "Reviewed narrative episodes and reflections from Islamic history.",
    },
    subjects: ["thariq", "taskiya-akhlaq"],
    chapterIds: [],
    playable: false,
    previewTopics: [
      { ml: "ഹിജ്റയുടെ പാത", en: "Path of Hijrah" },
      { ml: "സത്യസന്ധനായ കൂട്ടുകാരൻ", en: "The Honest Companion" },
      { ml: "ജീവികളോടുള്ള കാരുണ്യം", en: "Kindness to Animals" },
    ],
  },
  {
    id: "everyday",
    title: {
      ml: "ദൈനംദിന ഇസ്ലാമിക ജീവിതം",
      en: "Everyday Muslim Life",
    },
    blurb: {
      ml: "ഭക്ഷണ മര്യാദകൾ, വീട്ടിൽ പ്രവേശിക്കുമ്പോഴുള്ള മര്യാദ, ശുചിത്വം, ദിക്റുകൾ.",
      en: "Practical sequencing, daily etiquettes, greetings, and mindful choices.",
    },
    subjects: ["fiqh", "taskiya-akhlaq", "language-script"],
    chapterIds: [],
    playable: false,
    previewTopics: [
      { ml: "ഭക്ഷണ മര്യാദകൾ", en: "Dining Etiquette" },
      { ml: "ഉറങ്ങുമ്പോഴുള്ള ദിക്ർ", en: "Night Remembrance" },
      { ml: "അയൽവാസി മര്യാദകൾ", en: "Neighbor Rights" },
    ],
  },
  {
    id: "practice",
    title: {
      ml: "ജീവിതത്തിലെ വിശ്വാസം",
      en: "Faith in Practice",
    },
    blurb: {
      ml: "പഠിച്ച കാര്യങ്ങൾ യഥാർത്ഥ സാഹചര്യങ്ങളിൽ പ്രയോഗിക്കലും കുടുംബ ദൗത്യങ്ങളും.",
      en: "Applying lessons to real challenges, family reflections, and community kindness.",
    },
    subjects: ["taskiya-akhlaq", "fiqh"],
    chapterIds: [],
    playable: false,
    previewTopics: [
      { ml: "സോഷ്യൽ മീഡിയ ഉത്തരവാദിത്തം", en: "Digital Responsibility" },
      { ml: "പ്രകൃതി സംരക്ഷണം", en: "Caring for Nature" },
      { ml: "കുടുംബ സദസ്സുകൾ", en: "Family Circles" },
    ],
  },
];

export interface AvatarOption {
  id: string;
  name: { ml: string; en: string };
  badge: string;
  color: string;
  icon: string;
  emoji: string;
  requiredPoints: number;
  description: { ml: string; en: string };
}

export const avatarOptions: AvatarOption[] = [
  {
    id: "lantern-noor",
    name: { ml: "നൂർ വിളക്ക്", en: "Noor Lantern" },
    badge: "ഗൈഡ്",
    color: "#f59e0b",
    icon: "lantern",
    emoji: "🏮",
    requiredPoints: 0,
    description: {
      ml: "ആദ്യ പഠനയാത്രയിൽ സഹായിക്കുന്ന വെളിച്ചം നൽകുന്ന നൂർ വിളക്ക്.",
      en: "The friendly guiding lantern that illuminates your early learning steps.",
    },
  },
  {
    id: "olive-tree",
    name: { ml: "ഒലീവ് ഇല", en: "Olive Sprout" },
    badge: "സമാധാനം",
    color: "#10b981",
    icon: "leaf",
    emoji: "🌿",
    requiredPoints: 20,
    description: {
      ml: "സമാധാനവും ശാന്തതയും ഓർമ്മിപ്പിക്കുന്ന പച്ച ഒലീവ് ഇല.",
      en: "A gentle sprout symbolizing peace, kindness, and continuous growth.",
    },
  },
  {
    id: "crescent-star",
    name: { ml: "ചന്ദ്രക്കല", en: "Crescent Glow" },
    badge: "പ്രതീക്ഷ",
    color: "#06b6d4",
    icon: "moon",
    emoji: "🌙",
    requiredPoints: 40,
    description: {
      ml: "രാത്രിയിലെ സുന്ദരമായ ചന്ദ്രക്കലയും നക്ഷത്ര ശോഭയും.",
      en: "A serene crescent moon glowing with high hopes and devotion.",
    },
  },
  {
    id: "little-scholar",
    name: { ml: "കുഞ്ഞു പണ്ഡിതൻ", en: "Eager Reader" },
    badge: "അറിവ്",
    color: "#8b5cf6",
    icon: "book",
    emoji: "📚",
    requiredPoints: 60,
    description: {
      ml: "ജ്ഞാനം തേടുന്ന ഉത്സാഹമുള്ള കൊച്ചു പഠിതാവ്.",
      en: "Dedicated learner curious to read and understand deep concepts.",
    },
  },
  {
    id: "desert-falcon",
    name: { ml: "ധീര പരുന്ത്", en: "Brave Falcon" },
    badge: "ധൈര്യം",
    color: "#f97316",
    icon: "feather",
    emoji: "🦅",
    requiredPoints: 80,
    description: {
      ml: "ഉയരങ്ങളിൽ പറക്കുന്ന ലക്ഷ്യബോധമുള്ള ധീര പരുന്ത്.",
      en: "Sharp-eyed, courageous explorer soaring towards noble goals.",
    },
  },
  {
    id: "golden-star",
    name: { ml: "സുവർണ്ണ താരം", en: "Golden Star" },
    badge: "വിജയം",
    color: "#eab308",
    icon: "star",
    emoji: "⭐",
    requiredPoints: 100,
    description: {
      ml: "നല്ല ശീലങ്ങൾ സ്ഥിരമായി പാലിക്കുന്നവർക്കുള്ള തിളങ്ങുന്ന നക്ഷത്രം.",
      en: "Radiant star honoring consistency and mastery in character.",
    },
  },
  {
    id: "pearl-diver",
    name: { ml: "ജ്ഞാന മുത്ത്", en: "Pearl of Wisdom" },
    badge: "വിശുദ്ധി",
    color: "#ec4899",
    icon: "gem",
    emoji: "🪸",
    requiredPoints: 140,
    description: {
      ml: "ആഴത്തിലുള്ള പഠനത്തിലൂടെ കണ്ടെത്തിയ വിലയേറിയ മുത്ത്.",
      en: "A treasured jewel discovered through patient, reflective study.",
    },
  },
  {
    id: "noble-shield",
    name: { ml: "ധർമ്മ കാവൽക്കാരൻ", en: "Noble Guardian" },
    badge: "കാവൽ",
    color: "#4f46e5",
    icon: "shield",
    emoji: "🛡️",
    requiredPoints: 180,
    description: {
      ml: "തിന്മയിൽ നിന്ന് സ്വന്തം മനസ്സിനെ കാക്കുന്ന ധീരനായ കാവൽക്കാരൻ.",
      en: "Steadfast protector embodying strength, justice, and truth.",
    },
  },
];
