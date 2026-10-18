import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { useNoor } from "@/lib/noor/state";
import { api } from "@/lib/api/api-client";
import { akhlaqMissions } from "@/content/chapter-akhlaq";
import { getFatihahProgress } from "@/features/tajweed/progress";
import fatihahData from "@/features/tajweed/data/al-fatihah.json";
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronRight,
  Heart,
  Droplets,
  Moon,
  Volume2,
  Check,
  X,
} from "lucide-react";
import {
  getCompletedSubjectRoadmaps,
  setSubjectRoadmapCompleted,
  type SubjectRoadmapStatus,
} from "@/lib/noor/curriculumRoadmap";
import { sfx } from "@/lib/sound/sfx";

interface MadrasaSubjectsProps {
  onOpenTajweed: () => void;
  onOpenAkhlaq: () => void;
}

export type SubjectKey = "aqeedah" | "fiqh" | "lisanul-quran" | "akhlaq" | "tajweed";

interface SubjectDetail {
  key: SubjectKey;
  englishTitle: string;
  malayalamTitle: string;
  arabicName: string;
  icon: string;
  badge: { en: string; ml: string };
  shortDesc: { en: string; ml: string };
  bgGradient: string;
  borderColor: string;
  textColor: string;
  accentBg: string;
  curriculumTopics: {
    title: { en: string; ml: string };
    desc: { en: string; ml: string };
    icon: string;
  }[];
}

const MADRASA_SUBJECTS: SubjectDetail[] = [
  {
    key: "tajweed",
    englishTitle: "Tajweed",
    malayalamTitle: "തജ്‌വീദ്",
    arabicName: "علم التجويد والترتيل",
    icon: "🎙️",
    badge: { en: "Quran Recitation", ml: "ഖുർആൻ പാരായണം" },
    shortDesc: {
      en: "Recite the Holy Quran with correct Makharij, Madd, and melodious Tilawah.",
      ml: "ഖുർആൻ അക്ഷരങ്ങൾ മഖ്റജുകളിൽ നിന്ന് ശരിയായി ഉച്ചരിച്ച് ഓതാൻ പഠിക്കാം.",
    },
    bgGradient: "bg-gradient-to-br from-[#F0E9FF] to-[#E3D4FF]",
    borderColor: "border-[#CBB5FF]",
    textColor: "text-[#5B21B6]",
    accentBg: "bg-[#7857E8]",
    curriculumTopics: [
      {
        title: { en: "Surah Al-Fatihah Journey", ml: "സൂറത്തുൽ ഫാതിഹ തജ്‌വീദ്" },
        desc: {
          en: "7 verses step-by-step: word analysis, Tajweed rules, audio check, and practice.",
          ml: "7 ആയത്തുകൾ ഓരോന്നായി: പദ വിശകലനം, തജ്‌വീദ് നിയമങ്ങൾ, ഓത്ത് പരിശീലനം.",
        },
        icon: "📜",
      },
      {
        title: { en: "Makharij (Articulation Points)", ml: "അക്ഷരങ്ങളുടെ മഖ്റജുകൾ" },
        desc: {
          en: "Throat, tongue, lips, and nasal sounds pronounced correctly.",
          ml: "തൊണ്ട, നാവ്, ചുണ്ടുകൾ, മൂക്ക് എന്നിവയിൽ നിന്നുള്ള അക്ഷരങ്ങളുടെ കൃത്യമായ ഉച്ചാരണം.",
        },
        icon: "🗣️",
      },
      {
        title: { en: "Rules of Madd & Noon Sakin", ml: "മദ്ദും നൂൻ സാകിനയും" },
        desc: {
          en: "Idgham, Ikhfa, Izhar, and stretching letters according to Tajweed rules.",
          ml: "ഇദ്ഗാം, ഇഖ്ഫാഅ്, ഇള്ഹാർ, മദ്ദ് തുടങ്ങിയ പ്രധാന തജ്‌വീദ് നിയമങ്ങൾ.",
        },
        icon: "🎶",
      },
    ],
  },
  {
    key: "aqeedah",
    englishTitle: "Aqeedah",
    malayalamTitle: "അഖീദ",
    arabicName: "العقيدة والإيمان",
    icon: "🌙",
    badge: { en: "Pillars of Faith", ml: "ഈമാൻ കാര്യങ്ങൾ" },
    shortDesc: {
      en: "Belief in Allah, His Angels, Prophets, Books, and the Day of Judgment.",
      ml: "അല്ലാഹുവിലുള്ള വിശ്വാസം, മലക്കുകൾ, പ്രവാചകന്മാർ, ഗ്രന്ഥങ്ങൾ, അന്ത്യനാൾ.",
    },
    bgGradient: "bg-gradient-to-br from-[#EBF5FF] to-[#D6EBFF]",
    borderColor: "border-[#B8DCFF]",
    textColor: "text-[#005299]",
    accentBg: "bg-[#0070D1]",
    curriculumTopics: [
      {
        title: { en: "6 Pillars of Iman", ml: "ഈമാൻ കാര്യങ്ങൾ 6" },
        desc: {
          en: "Belief in Allah, Angels, Divine Books, Messengers, Day of Resurrection, and Qadar.",
          ml: "അല്ലാഹു, മലക്കുകൾ, വേദഗ്രന്ഥങ്ങൾ, പ്രവാചകന്മാർ, അന്ത്യദിനം, ഖദ്ർ എന്നിവയിലുള്ള വിശ്വാസം.",
        },
        icon: "✨",
      },
      {
        title: { en: "Tawheed & Allah's Names", ml: "തൗഹീദും അസ്മാഉൽ ഹുസ്നയും" },
        desc: {
          en: "Learning the beautiful names and perfect attributes of Allah.",
          ml: "അല്ലാഹുവിന്റെ 99 നാമങ്ങളും ഉത്തമ ഗുണങ്ങളും മനസ്സിലാക്കൽ.",
        },
        icon: "🌟",
      },
      {
        title: { en: "Love for Prophet Muhammad ﷺ", ml: "നബി ﷺ യോടുള്ള സ്നേഹം" },
        desc: {
          en: "Following the final Messenger and his noble teachings in our daily life.",
          ml: "അന്ത്യപ്രവാചകനെ ജീവനേക്കാൾ സ്നേഹിക്കലും ചര്യകൾ ജീവിതത്തിൽ പകർത്തലും.",
        },
        icon: "❤️",
      },
    ],
  },
  {
    key: "fiqh",
    englishTitle: "Fiqh",
    malayalamTitle: "ഫിഖ്ഹ്",
    arabicName: "الفقه الإسلامي",
    icon: "💧",
    badge: { en: "Worship & Rules", ml: "ശുദ്ധിയും നമസ്കാരവും" },
    shortDesc: {
      en: "How to perform Wudu, offer 5 daily prayers, and practice Islamic etiquette.",
      ml: "വുളൂഅ്, 5 വഖ്ത് നമസ്കാരം, ആരാധനാ രീതികൾ, ഇസ്ലാമിക വിധിവിലക്കുകൾ.",
    },
    bgGradient: "bg-gradient-to-br from-[#EAF8E8] to-[#D5F2D2]",
    borderColor: "border-[#B7E8B1]",
    textColor: "text-[#1C6918]",
    accentBg: "bg-[#287553]",
    curriculumTopics: [
      {
        title: { en: "Steps of Wudu (Ablution)", ml: "വുളൂഇന്റെ ക്രമങ്ങൾ" },
        desc: {
          en: "Washing hands, mouth, face, arms, wiping head, and feet with pure intention.",
          ml: "കൈ കഴുകൽ, വായ കഴുകൽ, മുഖം, കൈകൾ, തല തടവൽ, കാലുകൾ കഴുകൽ എന്നിവ ക്രമത്തിൽ.",
        },
        icon: "💧",
      },
      {
        title: { en: "5 Daily Prayers (Salah)", ml: "5 നേരത്തെ നമസ്കാരങ്ങൾ" },
        desc: {
          en: "Subhi, Dhuhr, Asr, Maghrib, and Isha: timings, rak'ahs, and posture.",
          ml: "സുബ്ഹി, ദ്വുഹ്ർ, അസ്വർ, മഗ്‌രിബ്, ഇശാഅ്: സമയങ്ങളും റക്അത്തുകളും.",
        },
        icon: "🕌",
      },
      {
        title: { en: "Cleanliness in Islam (Taharah)", ml: "ശുചിത്വവും ത്വാഹറത്തും" },
        desc: {
          en: "Purity of body, clothes, and place of worship.",
          ml: "ശരീരം, വസ്ത്രം, പരിസരം എന്നിവ വൃത്തിയായി സൂക്ഷിക്കുന്നതിന്റെ പ്രാധാന്യം.",
        },
        icon: "✨",
      },
    ],
  },
  {
    key: "lisanul-quran",
    englishTitle: "Lisanul Quran",
    malayalamTitle: "ലിസാനുൽ ഖുർആൻ",
    arabicName: "لسان القرآن المجيد",
    icon: "📖",
    badge: { en: "Quranic Arabic", ml: "ഖുർആനിക ഭാഷ" },
    shortDesc: {
      en: "Learn Arabic vocabulary, basic sentence structures, and Quranic words.",
      ml: "ഖുർആനിലെ പ്രധാന പദങ്ങൾ, അറബി അക്ഷരങ്ങൾ, പദാവലി, ലളിതമായ അർത്ഥങ്ങൾ.",
    },
    bgGradient: "bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A]",
    borderColor: "border-[#FCD34D]",
    textColor: "text-[#92400E]",
    accentBg: "bg-[#D97706]",
    curriculumTopics: [
      {
        title: { en: "Core Quranic Words", ml: "പ്രധാന ഖുർആൻ പദങ്ങൾ" },
        desc: {
          en: "High-frequency words in the Quran like Rabb, Kitab, Rahmah, and Qalb.",
          ml: "റബ്ബ്, കിതാബ്, റഹ്മത്ത്, ഖൽബ് തുടങ്ങിയ ഖുർആനിൽ ആവർത്തിച്ചു വരുന്ന പദങ്ങൾ.",
        },
        icon: "🔤",
      },
      {
        title: { en: "Arabic Letters & Vowels", ml: "അക്ഷരങ്ങളും ഹറകത്തുകളും" },
        desc: {
          en: "Mastering Fathah, Kasrah, Dammah, Sukun, and Tanween.",
          ml: "ഫത്ഹ്, കസ്റ്, ളമ്മ്, സുക്കൂൻ, തൻവീൻ എന്നിവ വ്യക്തമായി വായിക്കൽ.",
        },
        icon: "✍️",
      },
      {
        title: { en: "Simple Meanings of Surahs", ml: "സൂറത്തുകളുടെ ലളിതമായ അർത്ഥം" },
        desc: {
          en: "Word-by-word meaning of short Surahs recited in daily Salah.",
          ml: "നമസ്കാരത്തിൽ നാം പതിവായി ഓതുന്ന ചെറിയ സൂറത്തുകളുടെ ലളിതമായ അർത്ഥം.",
        },
        icon: "💡",
      },
    ],
  },
  {
    key: "akhlaq",
    englishTitle: "Akhlaq",
    malayalamTitle: "അഖ്‌ലാഖ്",
    arabicName: "الأخلاق والآداب",
    icon: "💛",
    badge: { en: "Character & Ethics", ml: "നല്ല സ്വഭാവങ്ങൾ" },
    shortDesc: {
      en: "Kindness, honesty, respecting parents and teachers, and speaking the truth.",
      ml: "സത്യസന്ധത, മാതാപിതാക്കളെ ബഹുമാനിക്കൽ, കൂട്ടുകാരോടുള്ള സ്നേഹം, പുഞ്ചിരി.",
    },
    bgGradient: "bg-gradient-to-br from-[#FFEDD5] to-[#FED7AA]",
    borderColor: "border-[#FDBA74]",
    textColor: "text-[#9A3412]",
    accentBg: "bg-[#EA580C]",
    curriculumTopics: [
      {
        title: { en: "Kindness to Parents (Birr al-Walidayn)", ml: "മാതാപിതാക്കളോടുള്ള നന്മ" },
        desc: {
          en: "Obeying with a smile, helping at home, and making Dua for them.",
          ml: "മാതാപിതാക്കളെ സഹായിക്കൽ, പുഞ്ചിരിയോടെ സംസാരിക്കൽ, അവർക്കായി പ്രാർത്ഥിക്കൽ.",
        },
        icon: "🏡",
      },
      {
        title: { en: "Greeting with Salam & Smiling", ml: "സലാം പറയലും പുഞ്ചിരിയും" },
        desc: {
          en: "Spreading peace and kindness whenever meeting friends and elders.",
          ml: "കൂട്ടുകാരെയും മുതിർന്നവരെയും കാണുമ്പോൾ സലാം പറയുക, പുഞ്ചിരിക്കുക.",
        },
        icon: "😊",
      },
      {
        title: { en: "Truthfulness & Keeping Trusts", ml: "സത്യസന്ധതയും അമാനത്തും" },
        desc: {
          en: "Always speaking the truth and returning things borrowed safely.",
          ml: "എപ്പോഴും സത്യം പറയുക, കടം വാങ്ങിയ വസ്തുക്കൾ ഭദ്രമായി തിരികെ നൽകുക.",
        },
        icon: "🤝",
      },
    ],
  },
];

export const MadrasaSubjects: React.FC<MadrasaSubjectsProps> = ({
  onOpenTajweed,
  onOpenAkhlaq,
}) => {
  const { lang, activeProfile, activeProgress } = useNoor();

  const childId = activeProfile?.id || "default";
  const [roadmapStatus, setRoadmapStatus] = useState<SubjectRoadmapStatus>(() =>
    getCompletedSubjectRoadmaps(childId, activeProgress)
  );

  useEffect(() => {
    const handleUpdate = () => {
      setRoadmapStatus(getCompletedSubjectRoadmaps(childId, activeProgress));
    };
    window.addEventListener("noor-curriculum-roadmap-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("noor-curriculum-roadmap-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [childId, activeProgress]);

  // Selected subject for curriculum overview dialog (Aqeedah, Fiqh, Lisanul Quran)
  const [activeModalSubject, setActiveModalSubject] = useState<SubjectDetail | null>(null);
  const [subjectsList, setSubjectsList] = useState<SubjectDetail[]>(MADRASA_SUBJECTS);

  useEffect(() => {
    let mounted = true;
    api.madrasa
      .getSubjects()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          const iconMap: Record<string, string> = {
            tajweed: "🎙️",
            aqeedah: "🌙",
            fiqh: "💧",
            "lisanul-quran": "📖",
            akhlaq: "💛",
          };
          const mapped: SubjectDetail[] = data.map((d: any) => {
            const fallback = MADRASA_SUBJECTS.find((m) => m.key === d.key) || MADRASA_SUBJECTS[0];
            const englishTitle = d.englishTitle || d.titleEn || fallback.englishTitle;
            const malayalamTitle = d.malayalamTitle || d.titleMl || fallback.malayalamTitle;
            const arabicName = d.arabicName || d.arabicTitle || fallback.arabicName;
            const badgeEn = d.badgeEn || d.badgeText || fallback.badge.en;
            const badgeMl = d.badgeMl || d.badgeText || fallback.badge.ml;
            const shortDescEn = d.shortDescEn || d.descEn || fallback.shortDesc.en;
            const shortDescMl = d.shortDescMl || d.descMl || fallback.shortDesc.ml;
            const bgGradient = d.bgGradient || d.gradient || fallback.bgGradient;
            const borderColor = d.borderColor || fallback.borderColor;
            const textColor = d.textColor || fallback.textColor;
            const accentBg = d.accentBg || d.accentColor || fallback.accentBg;

            const curriculumTopics =
              d.topics && d.topics.length > 0
                ? d.topics.map((t: any) => ({
                    title: {
                      en: t.titleEn || t.title || "Core Lesson",
                      ml: t.titleMl || t.titleEn || "പ്രധാന പാഠം",
                    },
                    desc: {
                      en: t.descEn || t.description || t.titleEn || "",
                      ml: t.descMl || t.description || t.titleMl || "",
                    },
                    icon: t.icon || t.iconName || "📜",
                  }))
                : fallback.curriculumTopics;

            return {
              key: (d.key as SubjectKey) || fallback.key,
              englishTitle,
              malayalamTitle,
              arabicName,
              icon: d.icon || iconMap[d.key] || fallback.icon,
              badge: { en: badgeEn, ml: badgeMl },
              shortDesc: { en: shortDescEn, ml: shortDescMl },
              bgGradient,
              borderColor,
              textColor,
              accentBg,
              curriculumTopics,
            };
          });
          setSubjectsList(mapped);
        }
      })
      .catch((err) => {
        console.warn("Could not load dynamic madrasa subjects, using fallback:", err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Real-time Tajweed progress
  const fatihahProgress = getFatihahProgress(childId);
  const totalVerses = fatihahData.verses.length || 7;
  const exploredVerses = Object.values(fatihahProgress.verses).filter((v) => v.isExplored).length;
  const passedVerses = Object.values(fatihahProgress.verses).filter((v) => v.knowledgeCheckPassed).length;

  // Real-time Akhlaq progress
  const totalAkhlaq = akhlaqMissions.length;
  const completedAkhlaq = akhlaqMissions.filter(
    (m) => activeProgress?.missions[m.id]?.passedAt
  ).length;

  const navigate = useNavigate();

  const handleSubjectClick = (subj: SubjectDetail) => {
    sfx.click();
    navigate({
      to: "/subject/$key",
      params: { key: subj.key },
    });
  };

  return (
    <section aria-label="Madrasa Subjects" className="w-full space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7857E8] animate-pulse" />
            <h3
              className="text-lg sm:text-xl font-black text-[#141426] tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {lang === "ml" ? "മദ്‌റസ വിഷയങ്ങൾ" : "Madrasa Subjects"}
            </h3>
          </div>
          <p className="text-xs text-[#626273] font-semibold mt-0.5">
            {lang === "ml"
              ? "അടിസ്ഥാന 5 പ്രധാന മദ്‌റസ വിഷയങ്ങൾ തിരഞ്ഞെടുത്ത് പഠിക്കൂ"
              : "Explore the 5 core Madrasa subjects of your learning journey"}
          </p>
        </div>

        <span className="text-[11px] font-black text-[#7857E8] bg-[#F0E9FF] border border-[#E3D4FF] px-2.5 py-1 rounded-full shadow-2xs">
          {subjectsList.length} {lang === "ml" ? "വിഷയങ്ങൾ" : "Subjects"}
        </span>
      </div>

      {/* 5 Kid-Friendly Subject Boxes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {subjectsList.map((subj) => {
          const isTajweed = subj.key === "tajweed";
          const isAkhlaq = subj.key === "akhlaq";

          return (
            <div
              key={subj.key}
              onClick={() => handleSubjectClick(subj)}
              className={`relative overflow-hidden rounded-[28px] p-4 sm:p-5 border-2 ${subj.borderColor} ${subj.bgGradient} shadow-2xs hover:shadow-md transition-all tactile cursor-pointer group flex flex-col justify-between`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleSubjectClick(subj)}
            >
              {/* Soft decorative glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/40 rounded-full blur-xl pointer-events-none" />

              <div>
                {/* Top Row: Icon + Badge + Arabic Title */}
                <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl filter drop-shadow-xs">
                      {subj.icon}
                    </span>
                    <div>
                      <h4
                        className="text-base sm:text-lg font-black text-[#141426] leading-tight"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {subj.englishTitle}
                        <span className="text-xs font-bold text-[#626273] ml-1.5 font-sans">
                          • {subj.malayalamTitle}
                        </span>
                      </h4>
                      <span className="text-[11px] font-bold text-[#626273] block leading-tight mt-0.5">
                        {subj.arabicName}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs ${subj.accentBg} text-white shrink-0`}
                  >
                    {subj.badge[lang]}
                  </span>
                </div>

                {/* Short Subtitle */}
                <p className="text-xs text-[#141426]/75 font-semibold leading-relaxed mb-3 relative z-10">
                  {subj.shortDesc[lang]}
                </p>
              </div>

              {/* Subject Footer */}
              {isTajweed ? (
                /* Tajweed Fatihah progress footer */
                <div className="relative z-10 flex items-center justify-between pt-2 border-t border-[#CBB5FF]/60">
                  <span className="text-xs font-black text-[#5B21B6]">
                    {lang === "ml"
                      ? `${exploredVerses}/${totalVerses} ഫാതിഹ ആയത്തുകൾ`
                      : `${exploredVerses}/${totalVerses} Fatihah Verses`}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#191A22] text-[#FFD184] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ) : isAkhlaq ? (
                /* Akhlaq Mission status bar */
                <div className="relative z-10 flex items-center justify-between pt-2 border-t border-[#FDBA74]/60">
                  <span className="text-xs font-black text-[#9A3412]">
                    {completedAkhlaq} / {totalAkhlaq} {lang === "ml" ? "മിഷനുകൾ പൂർത്തിയായി" : "Missions Completed"}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#191A22] text-[#FFD184] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ) : (
                /* Standard Subject footer */
                <div className="relative z-10 flex items-center justify-between pt-2 border-t border-black/5">
                  <span
                    className={`text-xs font-black ${
                      roadmapStatus[subj.key as keyof SubjectRoadmapStatus]
                        ? "text-[#1C6918]"
                        : "text-[#141426]/70"
                    }`}
                  >
                    {roadmapStatus[subj.key as keyof SubjectRoadmapStatus]
                      ? lang === "ml"
                        ? "റോഡ്മാപ്പ് പൂർത്തിയായി ✓"
                        : "Roadmap Complete ✓"
                      : lang === "ml"
                      ? "പാഠ്യപദ്ധതി കാണുക"
                      : "View Curriculum"}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#191A22] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Curriculum Preview Modal for Aqeedah, Fiqh & Lisanul Quran */}
      {activeModalSubject && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-white border-2 border-[#E4E0E9] rounded-[32px] shadow-2xl p-6 sm:p-7 relative overflow-hidden animate-pop space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeModalSubject.icon}</span>
                <div>
                  <h4
                    className="text-xl font-black text-[#141426]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {activeModalSubject.englishTitle}
                    <span className="text-sm font-bold text-[#626273] ml-2">
                      • {activeModalSubject.malayalamTitle}
                    </span>
                  </h4>
                  <span className="text-xs font-bold text-[#7857E8]">
                    {activeModalSubject.arabicName}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalSubject(null)}
                className="w-8 h-8 rounded-full bg-[#F3F1F4] hover:bg-[#E4E0E9] text-[#141426] font-bold flex items-center justify-center tactile transition-all"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#626273] font-medium leading-relaxed">
              {activeModalSubject.shortDesc[lang]}
            </p>

            {/* Curriculum Topics List */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-black uppercase text-[#626273] tracking-wider block">
                {lang === "ml" ? "പ്രധാന പാഠങ്ങൾ (Core Lessons):" : "Core Curriculum Lessons:"}
              </span>

              {activeModalSubject.curriculumTopics.map((topic, i) => (
                <div
                  key={i}
                  className="p-3 bg-[#F8F7FA] border border-[#E4E0E9] rounded-2xl flex items-start gap-3 shadow-2xs"
                >
                  <span className="text-lg shrink-0 mt-0.5">{topic.icon}</span>
                  <div>
                    <h5 className="text-xs font-black text-[#141426]">
                      {topic.title[lang]}
                    </h5>
                    <p className="text-[11px] text-[#626273] font-medium mt-0.5 leading-relaxed">
                      {topic.desc[lang]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer CTA & Roadmap Completion Action */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  const currentDone = !!roadmapStatus[activeModalSubject.key as keyof SubjectRoadmapStatus];
                  const updated = setSubjectRoadmapCompleted(childId, activeModalSubject.key as any, !currentDone);
                  setRoadmapStatus(updated);
                }}
                className={`w-full py-2.5 rounded-full font-black text-xs flex items-center justify-center gap-2 border-2 transition-all tactile ${
                  roadmapStatus[activeModalSubject.key as keyof SubjectRoadmapStatus]
                    ? "bg-[#EAF8E8] text-[#1C6918] border-[#B7E8B1]"
                    : "bg-[#F0E9FF] text-[#5B21B6] border-[#CBB5FF] hover:bg-[#E3D4FF]"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {roadmapStatus[activeModalSubject.key as keyof SubjectRoadmapStatus]
                    ? lang === "ml"
                      ? "റോഡ്മാപ്പ് പൂർത്തിയായി ✓ (മാറ്റാൻ ക്ലിക്ക് ചെയ്യുക)"
                      : "Curriculum Roadmap Completed ✓ (Click to Toggle)"
                    : lang === "ml"
                    ? "ഈ റോഡ്മാപ്പ് പൂർത്തിയായി എന്ന് രേഖപ്പെടുത്തൂ ✨"
                    : "Mark Curriculum Roadmap as Complete ✨"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalSubject(null)}
                className="w-full py-3 rounded-full bg-[#191A22] text-[#FFD184] hover:bg-black font-black text-xs flex items-center justify-center gap-2 shadow-xs tactile transition-all"
              >
                <span>{lang === "ml" ? "മനസ്സിലായി! പഠനം തുടരൂ ✨" : "Got It! Continue Learning ✨"}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
