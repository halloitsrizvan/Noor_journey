import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useNoor } from "@/lib/noor/state";
import { api } from "@/lib/api/api-client";
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  Volume2,
  Star,
  Check,
  Compass,
  Lightbulb,
  Heart,
  Shield,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  getCompletedSubjectRoadmaps,
  setSubjectRoadmapCompleted,
  type SubjectRoadmapStatus,
} from "@/lib/noor/curriculumRoadmap";

export type SubjectKey = "tajweed" | "aqeedah" | "fiqh" | "lisanul-quran" | "akhlaq";

export interface CurriculumTopic {
  titleEn: string;
  titleMl: string;
  arabicTitle?: string;
  descriptionEn: string;
  descriptionMl: string;
  icon: string;
  durationMinutes: number;
  xpReward: number;
  learningPoints: { en: string; ml: string }[];
}

export interface SubjectFullDetail {
  key: SubjectKey;
  englishTitle: string;
  malayalamTitle: string;
  arabicName: string;
  icon: string;
  badge: { en: string; ml: string };
  shortDesc: { en: string; ml: string };
  syllabusLevel: { en: string; ml: string };
  bgGradient: string;
  borderColor: string;
  textColor: string;
  accentBg: string;
  accentColor: string;
  topics: CurriculumTopic[];
}

export const CURRICULUM_SUBJECTS_DATA: SubjectFullDetail[] = [
  {
    key: "tajweed",
    englishTitle: "Tajweed & Tilawah",
    malayalamTitle: "തജ്‌വീദ് & തിലാവത്ത്",
    arabicName: "علم التجويد والترتيل",
    icon: "🎙️",
    badge: { en: "Quran Recitation", ml: "ഖുർആൻ പാരായണം" },
    shortDesc: {
      en: "Learn Quran recitation with correct articulation points (Makharij), phonetic rules, and beautiful Tilawah.",
      ml: "വിശുദ്ധ ഖുർആൻ അക്ഷരങ്ങൾ മഖ്റജുകളിൽ നിന്ന് ശരിയായി ഉച്ചരിച്ച് തജ്‌വീദ് നിയമങ്ങളോടെ ഓതാൻ പഠിക്കാം.",
    },
    syllabusLevel: {
      en: "Samastha Madrasa Standards 1–5 • Quran Reading & Tilawah Foundation",
      ml: "സമസ്ത മദ്‌റസ സിലബസ് 1–5 ക്ലാസുകൾ • ഖുർആൻ പാരായണ പാഠങ്ങൾ",
    },
    bgGradient: "bg-gradient-to-br from-[#F0E9FF] via-[#E8DEFF] to-[#DCD0FF]",
    borderColor: "border-[#CBB5FF]",
    textColor: "text-[#5B21B6]",
    accentBg: "bg-[#7857E8]",
    accentColor: "#7857E8",
    topics: [
      {
        titleEn: "Surah Al-Fatihah Mastery",
        titleMl: "സൂറത്തുൽ ഫാതിഹ തജ്‌വീദ്",
        arabicTitle: "سورة الفاتحة وأحكامها",
        descriptionEn: "Master each of the 7 verses word-by-word with audio playback from world-renowned Qaris and pronunciation feedback.",
        descriptionMl: "7 ആയത്തുകൾ ഓരോന്നായി: പദ വിശകലനം, പ്രശസ്ത ഖാരിഉകളുടെ ഓത്ത്, തജ്‌വീദ് നിയമങ്ങൾ.",
        icon: "📜",
        durationMinutes: 15,
        xpReward: 35,
        learningPoints: [
          { en: "Clear pronunciation of Bismillah and Isti'adha", ml: "ഇസ്തിആദയും ബിസ്മിയും കൃത്യമായി ഉച്ചരിക്കൽ" },
          { en: "Distinguishing Ha (ح) from Ha (ه) and 'Ayn (ع)", ml: "ഹാഅ് (ح), ഹാഅ് (ه), ഐൻ (ع) വ്യത്യാസം മനസ്സിലാക്കൽ" },
          { en: "Madd Lazim in 'Ad-Dallin' (6 Harakahs)", ml: "വലള്ളാല്ലീൻ എന്നതിലെ മദ്ദ് ലാസിം (6 ഹറകത്) നീട്ടൽ" },
          { en: "Reflecting on the meaning of 'Ihdina As-Sirat Al-Mustaqim'", ml: "നേരായ മാർഗ്ഗത്തിലേക്കുള്ള പ്രാർത്ഥനയുടെ ആശയം ഉൾക്കൊള്ളൽ" },
        ],
      },
      {
        titleEn: "Makharij Al-Huroof (Articulation Points)",
        titleMl: "അക്ഷരങ്ങളുടെ മഖ്റജുകൾ",
        arabicTitle: "مخارج الحروف العربية",
        descriptionEn: "The 5 major areas where 29 Arabic letters originate: throat (Halq), tongue (Lisan), lips (Shafatayn), nasal cavity (Khayshum), and chest (Jawf).",
        descriptionMl: "അറബി അക്ഷരങ്ങൾ പുറപ്പെടുന്ന 5 പ്രധാന ഇടങ്ങൾ: തൊണ്ട, നാവ്, ചുണ്ടുകൾ, മൂക്ക്, വായയുടെ ശൂന്യത.",
        icon: "🗣️",
        durationMinutes: 20,
        xpReward: 30,
        learningPoints: [
          { en: "Throat letters (Al-Halq): Hamzah, Ha, 'Ayn, Haa, Ghayn, Kha", ml: "തൊണ്ടയിൽ നിന്നുള്ള അക്ഷരങ്ങൾ: ഹംസ, ഹാഅ്, ഐൻ, ഹാ, ഗൈൻ, ഖാഅ്" },
          { en: "Tongue articulation: Qaf, Kaf, Jeem, Sheen, Ya, Daad", ml: "നാവിൽ നിന്നുള്ള അക്ഷരങ്ങൾ: ഖാഫ്, കാഫ്, ജീം, ശീൻ, യാഅ്, ളാദ്" },
          { en: "Heavy vs light letters (Tafkheem & Tarqeeq)", ml: "തഫ്ഖീമും തർഖീഖും (കനം കൊടുത്തു ഓതേണ്ടതും അല്ലാത്തതുമായ അക്ഷരങ്ങൾ)" },
        ],
      },
      {
        titleEn: "Rules of Noon Sakinah & Tanween",
        titleMl: "നൂൻ സാകിനയും തൻവീനും",
        arabicTitle: "أحكام النون الساكنة والتنوين",
        descriptionEn: "Four fundamental rules when Noon Sakin or Tanween is followed by Arabic letters: Izhar, Idgham, Iqlab, and Ikhfa.",
        descriptionMl: "ഇള്ഹാർ (വ്യക്തമാക്കൽ), ഇദ്ഗാം (ചേർക്കൽ), ഇഖ്‌ലാബ് (മറിക്കൽ), ഇഖ്ഫാഅ് (മറച്ചുവെക്കൽ) എന്നീ 4 നിയമങ്ങൾ.",
        icon: "🎶",
        durationMinutes: 25,
        xpReward: 40,
        learningPoints: [
          { en: "Izhar Halqi: Clear articulation before throat letters", ml: "തൊണ്ടയുടെ അക്ഷരങ്ങൾക്ക് മുൻപിൽ വ്യക്തമായി ഉച്ചരിക്കൽ" },
          { en: "Idgham with Ghunnah (Y-M-N-W) and without Ghunnah (L-R)", ml: "ഗുന്നയോടെയും ഗുന്നയില്ലാതെയുമുള്ള ഇദ്ഗാം" },
          { en: "Iqlab: Changing Noon Sakin into Meem before Ba", ml: "ബാഇന് മുൻപിൽ നൂൻ സാകിനയെ മീം ആക്കി മാറ്റൽ" },
          { en: "Ikhfa Haqiqi: Subtle nasalization before the 15 Ikhfa letters", ml: "15 ഇഖ്ഫാഇന്റെ അക്ഷരങ്ങൾക്ക് മുൻപിൽ മറച്ചു വെച്ചു മൂക്കിലൂടെ ഓതൽ" },
        ],
      },
      {
        titleEn: "Rules of Madd (Prolongation)",
        titleMl: "മദ്ദിന്റെ നിയമങ്ങൾ",
        arabicTitle: "أحكام المد وأقسامه",
        descriptionEn: "Madd Asli (natural 2-count stretch) vs Madd Far'ee (secondary stretch caused by Hamzah or Sukun).",
        descriptionMl: "മദ്ദ് അസ്‌ലിയും (സ്വാഭാവിക മദ്ദ്) മദ്ദ് ഫർഇയ്യും (കാരണങ്ങളാലുള്ള മദ്ദ്).",
        icon: "✨",
        durationMinutes: 15,
        xpReward: 25,
        learningPoints: [
          { en: "Madd letters: Alif preceded by Fathah, Waw by Dammah, Ya by Kasrah", ml: "മദ്ദിന്റെ അക്ഷരങ്ങൾ: അലിഫ്, വാവ്, യാഅ്" },
          { en: "Madd Muttasil (Connected) & Madd Munfasil (Separated)", ml: "മദ്ദ് മുത്തസ്വിലും മദ്ദ് മുൻഫസ്വിലും" },
          { en: "Proper counts: 2 counts (Harakah), 4-5 counts, and 6 counts", ml: "2, 4-5, 6 ഹറകത്തുകളുടെ കൃത്യമായ കണക്കുകൾ" },
        ],
      },
    ],
  },
  {
    key: "aqeedah",
    englishTitle: "Aqeedah & Tawheed",
    malayalamTitle: "അഖീദ & തൗഹീദ്",
    arabicName: "العقيدة الإسلامية والإيمان",
    icon: "🌙",
    badge: { en: "Pillars of Faith", ml: "ഈമാൻ കാര്യങ്ങൾ" },
    shortDesc: {
      en: "Establish firm belief in Allah, His Beautiful Names, Angels, Divine Books, Prophets, and the Day of Judgment.",
      ml: "അല്ലാഹുവിലുള്ള വിശ്വാസം, അസ്മാഉൽ ഹുസ്ന, മലക്കുകൾ, വേദഗ്രന്ഥങ്ങൾ, പ്രവാചകന്മാർ, അന്ത്യനാൾ എന്നിവ ഹൃദയത്തിൽ ഉറപ്പിക്കാം.",
    },
    syllabusLevel: {
      en: "Samastha Madrasa Standards 1–5 • Islamic Theology & Belief",
      ml: "സമസ്ത മദ്‌റസ സിലബസ് 1–5 ക്ലാസുകൾ • വിശ്വാസകാര്യങ്ങൾ",
    },
    bgGradient: "bg-gradient-to-br from-[#EBF5FF] via-[#E1EEFF] to-[#D4E8FF]",
    borderColor: "border-[#B8DCFF]",
    textColor: "text-[#005299]",
    accentBg: "bg-[#0070D1]",
    accentColor: "#0070D1",
    topics: [
      {
        titleEn: "The 6 Pillars of Iman (Arkan al-Iman)",
        titleMl: "ഈമാൻ കാര്യങ്ങൾ 6",
        arabicTitle: "أركان الإيمان الستة",
        descriptionEn: "Belief in Allah, His Angels, His Revealed Books, His Messengers, the Last Day, and Divine Decree (Qadar).",
        descriptionMl: "അല്ലാഹുവിലും മലക്കുകളിലും വേദഗ്രന്ഥങ്ങളിലും പ്രവാചകന്മാരിലും അന്ത്യദിനത്തിലും ഖദ്റിലും ഉള്ള വിശ്വാസം.",
        icon: "✨",
        durationMinutes: 20,
        xpReward: 35,
        learningPoints: [
          { en: "What does it mean to believe in Allah without partners?", ml: "അല്ലാഹുവിൽ പങ്കുകാരില്ലാതെ വിശ്വസിക്കുക എന്നതിന്റെ അർത്ഥം" },
          { en: "The 4 Archangels: Jibreel, Mikaeel, Israfeel, and Izraeel", ml: "പ്രധാന 4 മലക്കുകളും അവരുടെ ഉത്തരവാദിത്തങ്ങളും" },
          { en: "The 4 Major Books: Tawrat, Zabur, Injeel, and the Holy Quran", ml: "നാല് പ്രധാന വേദഗ്രന്ഥങ്ങൾ" },
          { en: "Belief that everything happens by Allah's divine wisdom (Qadar)", ml: "എല്ലാം അല്ലാഹുവിന്റെ അറിവും നിശ്ചയവും പ്രകാരമാണെന്ന ബോധ്യം" },
        ],
      },
      {
        titleEn: "Tawheed & Asma'ul Husna",
        titleMl: "തൗഹീദും അസ്മാഉൽ ഹുസ്നയും",
        arabicTitle: "التوحيد وأسماء الله الحسنى",
        descriptionEn: "Understanding Tawheed ar-Rububiyyah, Uluhiyyah, and Asma wa Sifat through Allah's 99 Beautiful Names.",
        descriptionMl: "അല്ലാഹുവിന്റെ ഏകത്വവും അല്ലാഹുവിന്റെ 99 പവിത്ര നാമങ്ങളും അവയുടെ അർത്ഥ വ്യാപ്തിയും.",
        icon: "🌟",
        durationMinutes: 20,
        xpReward: 30,
        learningPoints: [
          { en: "Ar-Rahman (The Most Merciful) and Ar-Raheem (The Bestower of Mercy)", ml: "റഹ്‌മാൻ, റഹീം എന്നീ നാമങ്ങളുടെ കാരുണ്യം" },
          { en: "Al-Khaliq (The Creator) and Al-Alim (The All-Knowing)", ml: "സൃഷ്ടാവായ, സർവ്വജ്ഞനായ അല്ലാഹു" },
          { en: "How knowing Allah's names brings peace to a child's heart", ml: "അല്ലാഹുവിന്റെ നാമങ്ങൾ ജീവിതത്തിൽ നൽകുന്ന സമാധാനം" },
        ],
      },
      {
        titleEn: "Love for Prophet Muhammad ﷺ",
        titleMl: "നബി ﷺ യോടുള്ള സ്നേഹം",
        arabicTitle: "محبة النبي محمد صلى الله عليه وسلم",
        descriptionEn: "The life, noble character, and blessed mission of the final Messenger of Allah for all mankind.",
        descriptionMl: "അന്ത്യപ്രവാചകൻ മുഹമ്മദ് നബി ﷺ യുടെ മാതൃകാ ജീവിതവും അവിടുത്തോടുള്ള സ്നേഹവും.",
        icon: "❤️",
        durationMinutes: 15,
        xpReward: 25,
        learningPoints: [
          { en: "Sending Salawat (Darood) upon the Prophet daily", ml: "ദിനേന നബി ﷺ യുടെ മേൽ സ്വലാത്ത് ചൊല്ലൽ" },
          { en: "Following the Sunnah in eating, speaking, sleeping, and smiling", ml: "ഭക്ഷണം കഴിക്കൽ, ഉറങ്ങൽ, പുഞ്ചിരിക്കൽ എന്നിവയിലെ സുന്നത്തുകൾ" },
          { en: "The Seal of the Prophets (Khatam an-Nabiyyin)", ml: "പ്രവാചകന്മാരുടെ അന്ത്യമുദ്ര" },
        ],
      },
    ],
  },
  {
    key: "fiqh",
    englishTitle: "Fiqh & Worship (Salah & Taharah)",
    malayalamTitle: "ഫിഖ്ഹ് & ഇബാദത്ത്",
    arabicName: "الفقه الإسلامي وأحكام العبادات",
    icon: "💧",
    badge: { en: "Worship & Rules", ml: "ശുദ്ധിയും നമസ്കാരവും" },
    shortDesc: {
      en: "Master Islamic rulings on ritual purity (Wudu), the 5 daily prayers (Salah), fasting, and everyday halal practices.",
      ml: "വുളൂഅ്, 5 നേരത്തെ നമസ്കാരം, ആരാധനാ ക്രമങ്ങൾ, ശുചിത്വം, നിത്യജീവിതത്തിലെ ഇസ്ലാമിക വിധിവിലക്കുകൾ.",
    },
    syllabusLevel: {
      en: "Samastha Madrasa Standards 1–5 • Practical Islamic Worship & Rules",
      ml: "സമസ്ത മദ്‌റസ സിലബസ് 1–5 ക്ലാസുകൾ • നമസ്കാരവും ശുദ്ധിയും",
    },
    bgGradient: "bg-gradient-to-br from-[#EAF8E8] via-[#DFF5DC] to-[#D0F0CD]",
    borderColor: "border-[#B7E8B1]",
    textColor: "text-[#1C6918]",
    accentBg: "bg-[#287553]",
    accentColor: "#287553",
    topics: [
      {
        titleEn: "Complete Steps of Wudu (Ablution)",
        titleMl: "വുളൂഇന്റെ പൂർണ്ണ രൂപം",
        arabicTitle: "صفة الوضوء وشروطه وفرائضه",
        descriptionEn: "Step-by-step guidance on intentions (Niyyah), washing limbs in sequence, Sunnah etiquettes, and invalidators.",
        descriptionMl: "നിയ്യത്ത്, മുഖം, കൈകൾ, തല തടവൽ, കാലുകൾ കഴുകൽ, വുളൂഇന്റെ സുന്നത്തുകൾ, മുറിയുന്ന കാര്യങ്ങൾ.",
        icon: "💧",
        durationMinutes: 15,
        xpReward: 30,
        learningPoints: [
          { en: "Saying Bismillah and making sincere Niyyah in the heart", ml: "ബിസ്മി ചൊല്ലി മനസ്സിൽ നിയ്യത്ത് വെക്കൽ" },
          { en: "Washing hands 3 times, rinsing mouth and nose", ml: "കൈപ്പത്തി, വായ, മൂക്ക് എന്നിവ 3 തവണ കഴുകൽ" },
          { en: "Washing the complete face from hairline to chin", ml: "മുഖം മുഴുവനായി കഴുകൽ" },
          { en: "Washing arms including elbows and feet including ankles", ml: "കൈമുട്ടുകളും ഞെരിയാണികളും ഉൾപ്പെടെ കഴുകൽ" },
        ],
      },
      {
        titleEn: "The 5 Daily Prayers (Salah)",
        titleMl: "5 നേരത്തെ നമസ്കാരങ്ങൾ",
        arabicTitle: "الصلوات الخمس وأوقاتها وكيفيتها",
        descriptionEn: "Subhi (Fajr), Dhuhr, Asr, Maghrib, and Isha: timings, number of Rak'ahs, Qiyam, Ruku, Sujood, and Tashahhud.",
        descriptionMl: "സുബ്ഹി, ദ്വുഹ്ർ, അസ്വർ, മഗ്‌രിബ്, ഇശാഅ്: സമയങ്ങൾ, റക്അത്തുകൾ, റുകൂഅ്, സുജൂദ്, അത്തഹിയ്യാത്ത്.",
        icon: "🕌",
        durationMinutes: 25,
        xpReward: 40,
        learningPoints: [
          { en: "Facing the Qiblah and Takbeeratul Ihram", ml: "ഖിബ്‌ലയിലേക്ക് തിരിഞ്ഞ് തക്ബീറതുൽ ഇഹ്റാം ചൊല്ലൽ" },
          { en: "Reciting Surah Al-Fatihah in every Rak'ah", ml: "എല്ലാ റക്അത്തിലും ഫാതിഹ ഓതൽ" },
          { en: "Perfecting Ruku with calm posture and Tasbeeh", ml: "ശാന്തതയോടെ റുകൂഅ് ചെയ്യലും തസ്ബീഹും" },
          { en: "Two Sujoods on seven limbs and concluding with Tasleem", ml: "ഏഴ് അവയവങ്ങളിൽ സുജൂദ് ചെയ്യലും സലാം വീട്ടലും" },
        ],
      },
      {
        titleEn: "Cleanliness & Taharah in Daily Life",
        titleMl: "ശുചിത്വവും ത്വാഹറത്തും",
        arabicTitle: "الطهارة والنظافة في الإسلام",
        descriptionEn: "Purity of body, clothing, and place of prayer. Types of water, removing impurities (Najasah), and bathroom manners.",
        descriptionMl: "ശരീരം, വസ്ത്രം, പരിസരം എന്നിവയുടെ ശുദ്ധി, നജസുകൾ നീക്കം ചെയ്യൽ, ശൗചാലയ മര്യാദകൾ.",
        icon: "✨",
        durationMinutes: 15,
        xpReward: 25,
        learningPoints: [
          { en: "Pure water (Ma' Mutlaq) for purification", ml: "ശുദ്ധീകരണത്തിന് ഉപയോഗിക്കുന്ന വെള്ളം" },
          { en: "Dua for entering and exiting the bathroom", ml: "ടോയ്‌ലറ്റിൽ പ്രവേശിക്കുമ്പോഴും ഇറങ്ങുമ്പോഴുമുള്ള ദുആ" },
          { en: "Etiquettes of trimming nails and brushing teeth (Miswak)", ml: "നഖം വെട്ടലും പല്ല് വൃത്തിയാക്കലും" },
        ],
      },
    ],
  },
  {
    key: "lisanul-quran",
    englishTitle: "Lisanul Quran (Quranic Arabic)",
    malayalamTitle: "ലിസാനുൽ ഖുർആൻ (അറബിക്)",
    arabicName: "لسان القرآن المجيد ولغة الضاد",
    icon: "📖",
    badge: { en: "Quranic Arabic", ml: "ഖുർആനിക ഭാഷ" },
    shortDesc: {
      en: "Build Quranic Arabic vocabulary, understand word roots, and comprehend short Surahs recited in daily prayers.",
      ml: "ഖുർആനിലെ ആവർത്തിച്ചു വരുന്ന പ്രധാന പദങ്ങൾ, അറബി വ്യാകരണത്തിന്റെ തുടക്കം, ചെറിയ സൂറത്തുകളുടെ ലളിതമായ അർത്ഥം.",
    },
    syllabusLevel: {
      en: "Samastha Madrasa Standards 1–5 • Quranic Vocabulary & Basic Grammar",
      ml: "സമസ്ത മദ്‌റസ സിലബസ് 1–5 ക്ലാസുകൾ • ഖുർആൻ പദാവലിയും ലളിത വ്യാകരണവും",
    },
    bgGradient: "bg-gradient-to-br from-[#FEF3C7] via-[#FDECA8] to-[#FCE28A]",
    borderColor: "border-[#FCD34D]",
    textColor: "text-[#92400E]",
    accentBg: "bg-[#D97706]",
    accentColor: "#D97706",
    topics: [
      {
        titleEn: "High-Frequency Quranic Words",
        titleMl: "പ്രധാന ഖുർആൻ പദങ്ങൾ",
        arabicTitle: "الكلمات الأكثر تكراراً في القرآن",
        descriptionEn: "Learn the most common words that make up over 50% of the Quran: Rabb, Kitab, Rahmah, Qalb, Jannat, Nar, and Malak.",
        descriptionMl: "ഖുർആനിൽ ധാരാളമായി വരുന്ന പ്രധാന പദങ്ങൾ: റബ്ബ്, കിതാബ്, റഹ്മത്ത്, ഖൽബ്, ജന്നത്ത്, മലക്ക്.",
        icon: "🔤",
        durationMinutes: 15,
        xpReward: 30,
        learningPoints: [
          { en: "Rabb (Lord/Cherisher), Ilah (God), and 'Abd (Servant)", ml: "റബ്ബ്, ഇലാഹ്, അബ്ദ് എന്നീ അടിസ്ഥാന പദങ്ങൾ" },
          { en: "Jannat (Gardens of Paradise) and Na'eem (Blessings)", ml: "സ്വർഗ്ഗവും അനുഗ്രഹങ്ങളും സൂചിപ്പിക്കുന്ന വാക്കുകൾ" },
          { en: "Connecting words: Fee (In), Min (From), Ila (To), 'Ala (Upon)", ml: "പ്രധാന ഹർഫുകൾ: ഫീ, മിൻ, ഇലാ, അലാ" },
        ],
      },
      {
        titleEn: "Arabic Harakaat & Word Construction",
        titleMl: "ഹറകത്തുകളും പദ നിർമ്മിതിയും",
        arabicTitle: "الحركات والتنوين وتكوين الكلمات",
        descriptionEn: "Fathah, Kasrah, Dammah, Sukun, Shaddah, and Tanween. How consonants combine with short and long vowels.",
        descriptionMl: "ഫത്ഹ്, കസ്റ്, ളമ്മ്, സുക്കൂൻ, ശദ്ദ്, തൻവീൻ എന്നിവ കൃത്യമായി വായിക്കാനും പദങ്ങൾ കൂട്ടിച്ചേർക്കാനും.",
        icon: "✍️",
        durationMinutes: 20,
        xpReward: 25,
        learningPoints: [
          { en: "Reading joined Arabic letters fluently", ml: "കൂട്ടിയക്ഷരങ്ങൾ വേഗത്തിൽ തിരിച്ചറിയൽ" },
          { en: "Pronouncing doubled letters with Shaddah", ml: "ശദ്ദുള്ള അക്ഷരങ്ങൾക്ക് ഊന്നൽ നൽകി ഓതൽ" },
          { en: "Noun vs Verb basics (Ism and Fi'l)", ml: "ഇസ്മും ഫിഅ്‌ലും (നാമവും ക്രിയയും) തിരിച്ചറിയൽ" },
        ],
      },
      {
        titleEn: "Meanings of Short Surahs (Surahs 112–114)",
        titleMl: "ചെറിയ സൂറത്തുകളുടെ ലളിതമായ അർത്ഥം",
        arabicTitle: "معاني قصار السور: الإخلاص والفلق والناس",
        descriptionEn: "Word-by-word meaning and lessons of Surah Al-Ikhlas, Surah Al-Falaq, and Surah An-Nas.",
        descriptionMl: "സൂറതുൽ ഇഖ്‌ലാസ്, സൂറതുൽ ഫലഖ്, സൂറതുന്നാസ് എന്നിവയുടെ പദാനുപദ അർത്ഥവും സന്ദേശവും.",
        icon: "💡",
        durationMinutes: 20,
        xpReward: 35,
        learningPoints: [
          { en: "Surah Al-Ikhlas: Allah is Ahad (One) and As-Samad (Self-Sufficient)", ml: "സൂറതുൽ ഇഖ്‌ലാസിലെ തൗഹീദ് സന്ദേശം" },
          { en: "Surah Al-Falaq: Seeking refuge from evil in the creation and envy", ml: "സൂറതുൽ ഫലഖിലെ സംരക്ഷണ പ്രാർത്ഥനകൾ" },
          { en: "Surah An-Nas: Seeking protection from the whisperer (Waswas)", ml: "സൂറതുന്നാസിലൂടെ പിശാചിന്റെ ദുർബോധനങ്ങളിൽ നിന്നുള്ള കാവൽ" },
        ],
      },
    ],
  },
  {
    key: "akhlaq",
    englishTitle: "Akhlaq & Adab (Islamic Ethics)",
    malayalamTitle: "അഖ്‌ലാഖ് & ആദാബ് (സ്വഭാവം)",
    arabicName: "الأخلاق الإسلامية والآداب النبوية",
    icon: "💛",
    badge: { en: "Character & Ethics", ml: "നല്ല സ്വഭാവങ്ങൾ" },
    shortDesc: {
      en: "Embody Islamic virtues of honesty, kindness to parents, respecting elders, humility, and positive community action.",
      ml: "മാതാപിതാക്കളെ ബഹുമാനിക്കൽ, സത്യസന്ധത, കൂട്ടുകാരോടുള്ള സ്നേഹം, പുഞ്ചിരി, പരിസ്ഥിതി സംരക്ഷണം.",
    },
    syllabusLevel: {
      en: "Samastha Madrasa Standards 1–5 • Moral Character & Daily Etiquettes",
      ml: "സമസ്ത മദ്‌റസ സിലബസ് 1–5 ക്ലാസുകൾ • സ്വഭാവ രൂപീകരണ പാഠങ്ങൾ",
    },
    bgGradient: "bg-gradient-to-br from-[#FFEDD5] via-[#FFE3C1] to-[#FFD5A3]",
    borderColor: "border-[#FDBA74]",
    textColor: "text-[#9A3412]",
    accentBg: "bg-[#EA580C]",
    accentColor: "#EA580C",
    topics: [
      {
        titleEn: "Kindness to Parents (Birr al-Walidayn)",
        titleMl: "മാതാപിതാക്കളോടുള്ള നന്മ",
        arabicTitle: "بر الوالدين وحقهما العظيم",
        descriptionEn: "The supreme Islamic duty of obeying parents with joy, helping with chores, speaking gently, and praying for them.",
        descriptionMl: "മാതാപിതാക്കളെ സഹായിക്കൽ, പുഞ്ചിരിയോടെ അനുസരിക്കൽ, ശബ്ദം താഴ്ത്തി സംസാരിക്കൽ, പ്രാർത്ഥന.",
        icon: "🏡",
        durationMinutes: 15,
        xpReward: 30,
        learningPoints: [
          { en: "Never saying 'Uff' (sigh of irritation) to parents", ml: "മാതാപിതാക്കളോട് ചീത്തവാക്കോ മുഷിപ്പോ കാണിക്കാതിരിക്കൽ" },
          { en: "Dua for parents: 'Rabbi irhamhuma kama rabbayani sagheera'", ml: "'റബ്ബിർഹംഹുമാ കമാ റബ്ബയാനീ സ്വഗീറാ' എന്ന പ്രാർത്ഥന" },
          { en: "Earning Allah's pleasure through parent's pleasure", ml: "അല്ലാഹുവിന്റെ തൃപ്തി മാതാപിതാക്കളുടെ തൃപ്തിയിലാണ്" },
        ],
      },
      {
        titleEn: "Greeting with Salam & Spreading Peace",
        titleMl: "സലാം പറയലും പുഞ്ചിരിയും",
        arabicTitle: "إفشاء السلام والتبسم صدقة",
        descriptionEn: "How saying 'Assalamu Alaikum wa Rahmatullahi wa Barakatuh' removes malice and unites hearts in love.",
        descriptionMl: "സലാം വ്യാപിപ്പിക്കൽ, പുഞ്ചിരി ഒരു സ്വദഖയാണ് എന്ന നബിവചനം ജീവിതത്തിൽ പകർത്തൽ.",
        icon: "😊",
        durationMinutes: 15,
        xpReward: 25,
        learningPoints: [
          { en: "Greeting both those you know and those you do not know", ml: "അറിയുന്നവർക്കും അറിയാത്തവർക്കും സലാം പറയൽ" },
          { en: "Smiling in the face of your brother is charity (Sadaqah)", ml: "സഹോദരന്റെ മുഖത്തു നോക്കി പുഞ്ചിരിക്കുന്നത് സ്വദഖയാണ്" },
          { en: "Responding with an equal or better greeting", ml: "സലാമിന് അതിലും മനോഹരമായി മറുപടി നൽകൽ" },
        ],
      },
      {
        titleEn: "Truthfulness & Trust (Sidq & Amanah)",
        titleMl: "സത്യസന്ധതയും അമാനത്തും",
        arabicTitle: "الصدق والأمانة والوفاء بالعهد",
        descriptionEn: "Being known as As-Sadiq and Al-Ameen just like Prophet Muhammad ﷺ. Speaking truth even in difficult times.",
        descriptionMl: "ഏത് പ്രതിസന്ധിയിലും സത്യം പറയൽ, കടം വാങ്ങിയ വസ്തുക്കൾ ഭദ്രമായി തിരികെ നൽകൽ.",
        icon: "🤝",
        durationMinutes: 20,
        xpReward: 35,
        learningPoints: [
          { en: "Truthfulness leads to righteousness, and righteousness leads to Paradise", ml: "സത്യം പുണ്യത്തിലേക്കും പുണ്യം സ്വർഗ്ഗത്തിലേക്കും നയിക്കുന്നു" },
          { en: "Returning things borrowed in perfect condition", ml: "വാങ്ങിയ വസ്തുക്കൾ സുരക്ഷിതമായി തിരിച്ചേൽപ്പിക്കൽ" },
          { en: "Avoiding gossip (Gheebah) and hurt feelings", ml: "പരദൂഷണവും കളവും ഒഴിവാക്കൽ" },
        ],
      },
    ],
  },
];

interface SubjectCurriculumScreenProps {
  initialSubjectKey?: string;
}

export const SubjectCurriculumScreen: React.FC<SubjectCurriculumScreenProps> = ({
  initialSubjectKey = "tajweed",
}) => {
  const navigate = useNavigate();
  const { lang, activeProfile, activeProgress, awardXp } = useNoor();

  // Selected subject key
  const validKeys: SubjectKey[] = ["tajweed", "aqeedah", "fiqh", "lisanul-quran", "akhlaq"];
  const sanitizedKey: SubjectKey = validKeys.includes(initialSubjectKey as SubjectKey)
    ? (initialSubjectKey as SubjectKey)
    : "tajweed";

  const [currentKey, setCurrentKey] = useState<SubjectKey>(sanitizedKey);
  const [subjectsData, setSubjectsData] = useState<SubjectFullDetail[]>(CURRICULUM_SUBJECTS_DATA);
  const [dbSubjects, setDbSubjects] = useState<any[]>([]);
  const [reviewedTopics, setReviewedTopics] = useState<Record<string, boolean>>({});
  const [showXpCelebration, setShowXpCelebration] = useState<{ amount: number; title: string } | null>(null);

  const childId = activeProfile?.id || "default";
  const [roadmapStatus, setRoadmapStatus] = useState<SubjectRoadmapStatus>(() =>
    getCompletedSubjectRoadmaps(childId, activeProgress)
  );

  // Sync state if initialSubjectKey prop changes
  useEffect(() => {
    if (validKeys.includes(initialSubjectKey as SubjectKey)) {
      setCurrentKey(initialSubjectKey as SubjectKey);
    }
  }, [initialSubjectKey]);

  // Load dynamic DB topics
  useEffect(() => {
    let mounted = true;
    api.madrasa
      .getSubjects()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          setDbSubjects(data);
          // Merge dynamic topics with predefined rich topics
          const merged = CURRICULUM_SUBJECTS_DATA.map((cur) => {
            const dbMatch = data.find((d: any) => d.key === cur.key);
            if (!dbMatch) return cur;

            const dbTopics: CurriculumTopic[] =
              Array.isArray(dbMatch.topics) && dbMatch.topics.length > 0
                ? dbMatch.topics.map((t: any, idx: number) => ({
                    titleEn: t.titleEn || t.title || `Lesson ${idx + 1}`,
                    titleMl: t.titleMl || t.titleEn || `പാഠം ${idx + 1}`,
                    arabicTitle: t.arabicTitle || "",
                    descriptionEn: t.description || t.descEn || cur.topics[idx]?.descriptionEn || "",
                    descriptionMl: t.descMl || t.description || cur.topics[idx]?.descriptionMl || "",
                    icon: t.iconName || t.icon || cur.topics[idx]?.icon || "📜",
                    durationMinutes: Number(t.durationMinutes) || 15,
                    xpReward: Number(t.xpReward) || 25,
                    learningPoints: cur.topics[idx]?.learningPoints || [
                      { en: "Understanding core tenets and evidence", ml: "പ്രധാന ആശയങ്ങളും തെളിവുകളും ഗ്രഹിക്കൽ" },
                      { en: "Practical application in daily Islamic life", ml: "നിത്യജീവിതത്തിലെ പ്രായോഗിക രീതികൾ" },
                    ],
                  }))
                : cur.topics;

            return {
              ...cur,
              englishTitle: dbMatch.titleEn || cur.englishTitle,
              malayalamTitle: dbMatch.titleMl || cur.malayalamTitle,
              arabicName: dbMatch.arabicTitle || cur.arabicName,
              shortDesc: {
                en: dbMatch.descEn || cur.shortDesc.en,
                ml: dbMatch.descMl || cur.shortDesc.ml,
              },
              badge: {
                en: dbMatch.badgeText || cur.badge.en,
                ml: dbMatch.badgeText || cur.badge.ml,
              },
              topics: dbTopics,
            };
          });
          setSubjectsData(merged);
        }
      })
      .catch((err) => {
        console.warn("Could not load dynamic madrasa database topics:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const activeSubject =
    subjectsData.find((s) => s.key === currentKey) || subjectsData[0];

  const isRoadmapCompleted = !!roadmapStatus[currentKey];

  const handleToggleRoadmap = () => {
    const nextState = !isRoadmapCompleted;
    const updated = setSubjectRoadmapCompleted(childId, currentKey, nextState);
    setRoadmapStatus(updated);
    if (nextState) {
      awardXp(50, "mission", `roadmap-${currentKey}-${Date.now()}`);
      setShowXpCelebration({
        amount: 50,
        title: lang === "ml" ? `${activeSubject.malayalamTitle} റോഡ്മാപ്പ് പൂർത്തിയായി!` : `${activeSubject.englishTitle} Roadmap Completed!`,
      });
      setTimeout(() => setShowXpCelebration(null), 3500);
    }
  };

  const handleToggleTopicReview = (topicIdx: number, topic: CurriculumTopic) => {
    const topicKey = `${currentKey}-topic-${topicIdx}`;
    const currentlyReviewed = !!reviewedTopics[topicKey];
    setReviewedTopics((prev) => ({ ...prev, [topicKey]: !currentlyReviewed }));

    if (!currentlyReviewed) {
      awardXp(topic.xpReward, "review", `topic-review-${topicKey}`);
      setShowXpCelebration({
        amount: topic.xpReward,
        title: lang === "ml" ? `${topic.titleMl} പഠനം പൂർത്തിയായി!` : `${topic.titleEn} Completed!`,
      });
      setTimeout(() => setShowXpCelebration(null), 3000);
    }
  };

  const totalLessons = activeSubject.topics.length;
  const totalXp = activeSubject.topics.reduce((acc, t) => acc + (t.xpReward || 20), 0);
  const totalTime = activeSubject.topics.reduce((acc, t) => acc + (t.durationMinutes || 15), 0);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12 animate-pop">
      {/* Toast XP Celebration Notification */}
      {showXpCelebration && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 p-4 bg-[#191A22] text-white border-2 border-[#FFD184] rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FFD184] to-[#F59E0B] text-[#191A22] flex items-center justify-center font-black text-lg">
            ★
          </div>
          <div>
            <div className="text-xs font-black text-[#FFD184]">+{showXpCelebration.amount} XP AWARDED!</div>
            <div className="text-xs font-semibold text-white/90">{showXpCelebration.title}</div>
          </div>
        </div>
      )}

      {/* Top Back Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/journey" })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-[#E4E0E9] hover:bg-[#F3F1F4] text-[#141426] text-xs font-black transition-all tactile shadow-2xs group"
        >
          <ArrowLeft className="w-4 h-4 text-[#7857E8] group-hover:-translate-x-0.5 transition-transform" />
          <span>{lang === "ml" ? "← മദ്‌റസ വിഷയങ്ങളിലേക്ക് മടങ്ങുക" : "← Back to Madrasa Subjects"}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#F0E9FF] border border-[#E3D4FF] text-[#5B21B6] text-xs font-black flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#7857E8]" />
            <span>{activeSubject.syllabusLevel[lang]}</span>
          </span>
        </div>
      </div>

      {/* Horizontal Subject Switcher Pills */}
      <div className="bg-white p-2.5 rounded-[24px] border border-[#E4E0E9] shadow-2xs overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          {subjectsData.map((subj) => {
            const isActive = subj.key === currentKey;
            const isCompleted = !!roadmapStatus[subj.key];

            return (
              <button
                key={subj.key}
                type="button"
                onClick={() => setCurrentKey(subj.key)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all tactile flex items-center gap-2 ${
                  isActive
                    ? `${subj.accentBg} text-white shadow-xs scale-102`
                    : "bg-[#F7F6F9] text-[#626273] hover:text-[#141426] hover:bg-[#EAE8ED]"
                }`}
              >
                <span className="text-base">{subj.icon}</span>
                <span>{lang === "ml" ? subj.malayalamTitle : subj.englishTitle}</span>
                {isCompleted && (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#287553]"}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Subject Hero Card */}
      <div
        className={`relative overflow-hidden rounded-[32px] p-6 sm:p-8 border-2 ${activeSubject.borderColor} ${activeSubject.bgGradient} shadow-sm transition-all`}
      >
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-4xl sm:text-5xl shrink-0 p-2.5 bg-white/60 rounded-2xl shadow-2xs">
                {activeSubject.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/80 shadow-2xs ${activeSubject.textColor}`}
                  >
                    {activeSubject.badge[lang]}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/5 text-[#141426]/70">
                    Samastha Madrasa
                  </span>
                </div>
                <h1
                  className="text-2xl sm:text-3xl font-black text-[#141426] tracking-tight mt-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {lang === "ml" ? activeSubject.malayalamTitle : activeSubject.englishTitle}
                </h1>
              </div>
            </div>

            <div
              className="text-lg sm:text-xl font-bold text-[#141426]/70 font-arabic tracking-wide"
              style={{ fontFamily: "var(--font-arabic)" }}
            >
              {activeSubject.arabicName}
            </div>

            <p className="text-xs sm:text-sm text-[#4A4A5A] font-medium leading-relaxed">
              {activeSubject.shortDesc[lang]}
            </p>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 text-xs font-black text-[#141426] shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-[#7857E8]" />
                <span>{totalLessons} {lang === "ml" ? "പാഠങ്ങൾ (Lessons)" : "Core Lessons"}</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 text-xs font-black text-[#141426] shadow-2xs">
                <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>+{totalXp} XP {lang === "ml" ? "നേടാം" : "Available"}</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 text-xs font-black text-[#141426] shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#287553]" />
                <span>~{totalTime} {lang === "ml" ? "മിനിറ്റ്" : "Mins Total"}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs in Hero */}
          <div className="w-full md:w-auto shrink-0 flex flex-col gap-2.5">
            {/* Interactive Subject Dedicated Route Launchers */}
            {activeSubject.key === "tajweed" && (
              <button
                type="button"
                onClick={() => navigate({ to: "/tajweed" })}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#191A22] text-[#FFD184] hover:bg-black font-black text-xs transition-all shadow-sm tactile flex items-center justify-center gap-2"
              >
                <Volume2 className="w-4 h-4 text-[#FFD184]" />
                <span>{lang === "ml" ? "സൂറതുൽ ഫാതിഹ സ്റ്റുഡിയോ തുറക്കൂ →" : "Open Al-Fatihah Voice Studio →"}</span>
              </button>
            )}

            {activeSubject.key === "akhlaq" && (
              <button
                type="button"
                onClick={() => navigate({ to: "/practice" })}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#191A22] text-[#FFD184] hover:bg-black font-black text-xs transition-all shadow-sm tactile flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#FFD184]" />
                <span>{lang === "ml" ? "അഖ്‌ലാഖ് മിഷനുകൾ കളിക്കൂ →" : "Play Akhlaq Adventure Missions →"}</span>
              </button>
            )}

            {/* Toggle Roadmap Completion Button */}
            <button
              type="button"
              onClick={handleToggleRoadmap}
              className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-black text-xs transition-all tactile flex items-center justify-center gap-2 border-2 ${
                isRoadmapCompleted
                  ? "bg-[#EAF8E8] text-[#1C6918] border-[#B7E8B1] hover:bg-[#D8F2D4]"
                  : "bg-white text-[#141426] border-white/80 hover:bg-white/90 shadow-2xs"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-current" />
              <span>
                {isRoadmapCompleted
                  ? lang === "ml"
                    ? "റോഡ്മാപ്പ് പൂർത്തിയായി ✓"
                    : "Roadmap Complete ✓"
                  : lang === "ml"
                  ? "റോഡ്മാപ്പ് പൂർത്തിയായി എന്ന് രേഖപ്പെടുത്തുക"
                  : "Mark Roadmap Complete (+50 XP)"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum Details Section Heading */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7857E8]" />
            <h2
              className="text-lg sm:text-xl font-black text-[#141426] tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {lang === "ml" ? "സിലബസ് & പാഠ്യപദ്ധതി വിവരങ്ങൾ" : "Curriculum & Lesson Details"}
            </h2>
          </div>
          <p className="text-xs text-[#626273] font-semibold mt-0.5">
            {lang === "ml"
              ? "ഓരോ പാഠത്തിലെയും പ്രധാന വിഷയങ്ങളും പഠന ലക്ഷ്യങ്ങളും"
              : "Explore the structured lessons, key takeaways, and learning objectives"}
          </p>
        </div>

        <span className="text-xs font-black text-[#7857E8] bg-[#F0E9FF] border border-[#E3D4FF] px-3 py-1 rounded-full">
          {activeSubject.topics.length} {lang === "ml" ? "പാഠങ്ങൾ" : "Lessons"}
        </span>
      </div>

      {/* Structured Curriculum Topics List */}
      <div className="space-y-4">
        {activeSubject.topics.map((topic, index) => {
          const topicKey = `${currentKey}-topic-${index}`;
          const isReviewed = !!reviewedTopics[topicKey];

          return (
            <div
              key={index}
              className="bg-white border-2 border-[#E4E0E9] rounded-[28px] p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all space-y-4"
            >
              {/* Topic Header Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4F3F7] border border-[#E4E0E9] flex items-center justify-center text-2xl shrink-0">
                    {topic.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-[#191A22] text-[#FFD184] text-[10px] font-black uppercase">
                        {lang === "ml" ? `പാഠം ${index + 1}` : `Lesson ${index + 1}`}
                      </span>
                      {topic.arabicTitle && (
                        <span className="text-xs font-bold text-[#7857E8] font-arabic">
                          {topic.arabicTitle}
                        </span>
                      )}
                    </div>
                    <h3
                      className="text-base sm:text-lg font-black text-[#141426] mt-0.5"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {lang === "ml" ? topic.titleMl : topic.titleEn}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[#626273] bg-[#F7F6F9] px-2.5 py-1 rounded-xl">
                    <Clock className="w-3 h-3 text-[#287553]" />
                    <span>{topic.durationMinutes} {lang === "ml" ? "മിനുറ്റ്" : "mins"}</span>
                  </span>

                  <span className="flex items-center gap-1 text-[11px] font-black text-[#5B21B6] bg-[#F0E9FF] px-2.5 py-1 rounded-xl">
                    <Award className="w-3 h-3 text-[#7857E8]" />
                    <span>+{topic.xpReward} XP</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleTopicReview(index, topic)}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all tactile flex items-center gap-1.5 border ${
                      isReviewed
                        ? "bg-[#EAF8E8] text-[#1C6918] border-[#B7E8B1]"
                        : "bg-[#F3F1F4] hover:bg-[#EAE8ED] text-[#141426] border-[#E4E0E9]"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isReviewed ? (lang === "ml" ? "പൂർത്തിയായി ✓" : "Reviewed ✓") : (lang === "ml" ? "പഠിച്ചു" : "Mark Reviewed")}</span>
                  </button>
                </div>
              </div>

              {/* Detailed Explanation */}
              <p className="text-xs sm:text-sm text-[#4A4A5A] font-medium leading-relaxed pl-1">
                {lang === "ml" ? topic.descriptionMl : topic.descriptionEn}
              </p>

              {/* Key Learning Objectives Box */}
              {topic.learningPoints && topic.learningPoints.length > 0 && (
                <div className="bg-[#FAF9FC] border border-[#ECE8F2] rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-[#626273] tracking-wider">
                    <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>{lang === "ml" ? "പ്രധാന പഠന ലക്ഷ്യങ്ങൾ (Key Takeaways):" : "Core Learning Points:"}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {topic.learningPoints.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#EAF8E8] text-[#287553] flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                          ✓
                        </div>
                        <span className="text-xs text-[#20202E] font-medium leading-relaxed">
                          {lang === "ml" ? pt.ml : pt.en}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Bottom Action Card */}
      <div className="bg-[#191A22] text-white rounded-[32px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <h4
            className="text-lg font-black text-[#FFD184]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {lang === "ml" ? "മറ്റു മദ്‌റസ വിഷയങ്ങൾ കൂടി പര്യവേക്ഷണം ചെയ്യൂ" : "Explore All 5 Madrasa Curriculum Subjects"}
          </h4>
          <p className="text-xs text-white/70 max-w-lg leading-relaxed">
            {lang === "ml"
              ? "തജ്‌വീദ്, അഖീദ, ഫിഖ്ഹ്, ലിസാനുൽ ഖുർആൻ, അഖ്‌ലാഖ് എന്നിവയിലൂടെ സമഗ്രമായ ഇസ്ലാമിക വിജ്ഞാനം നേടൂ."
              : "Enhance your understanding across Quranic Recitation, Faith, Worship, Arabic Vocabulary, and Islamic Manners."}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => navigate({ to: "/journey" })}
            className="px-5 py-3 rounded-2xl bg-[#FFD184] hover:bg-[#F59E0B] text-[#191A22] font-black text-xs transition-all tactile shadow-xs flex items-center gap-1.5"
          >
            <span>{lang === "ml" ? "മദ്‌റസ യാത്രയിലേക്ക് →" : "Back to Journey →"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
