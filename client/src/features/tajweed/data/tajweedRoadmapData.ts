/**
 * Noor Journey - 10 Core Tajweed Curriculums
 * Designed for children with engaging visuals, clear letter examples,
 * dual-language support (English & Malayalam + Arabic), and interactive quizzes.
 */

export interface TajweedQuizQuestion {
  question: { en: string; ml: string };
  options: {
    id: string;
    text: { en: string; ml: string };
    isCorrect: boolean;
  }[];
  explanation: { en: string; ml: string };
  hint: { en: string; ml: string };
}

export interface TajweedCurriculumItem {
  id: string;
  order: number;
  englishTitle: string;
  malayalamTitle: string;
  arabicTitle: string;
  badge: { en: string; ml: string };
  icon: string;
  bgGradient: string;
  borderColor: string;
  accentColor: string;
  textColor: string;
  shortDesc: { en: string; ml: string };
  conceptLessons: {
    title: { en: string; ml: string };
    points: { en: string; ml: string }[];
    arabicExamples?: { text: string; label: { en: string; ml: string } }[];
  }[];
  quiz: TajweedQuizQuestion;
  xpReward: number;
}

export const TAJWEED_CURRICULUMS: TajweedCurriculumItem[] = [
  {
    id: "makharij-al-huruf",
    order: 1,
    englishTitle: "Makharij al-Huruf",
    malayalamTitle: "അക്ഷരങ്ങളുടെ മഖ്റജുകൾ",
    arabicTitle: "مخارج الحروف",
    badge: { en: "Articulation Points", ml: "ഉച്ചാരണ സ്ഥാനങ്ങൾ" },
    icon: "🗣️",
    bgGradient: "bg-gradient-to-br from-[#EBF5FF] to-[#D6EBFF]",
    borderColor: "border-[#B8DCFF]",
    accentColor: "bg-[#0070D1]",
    textColor: "text-[#005299]",
    shortDesc: {
      en: "Discover the 5 major bodily areas from which every Arabic letter originates.",
      ml: "ഓരോ അറബി അക്ഷരവും കൃത്യമായി പുറപ്പെടുന്ന 5 പ്രധാന ഉച്ചാരണ സ്ഥാനങ്ങൾ പഠിക്കാം.",
    },
    conceptLessons: [
      {
        title: {
          en: "The 5 Main Makharij (Homes of Letters)",
          ml: "5 പ്രധാന മഖ്റജുകൾ (അക്ഷരങ്ങളുടെ കേന്ദ്രങ്ങൾ)",
        },
        points: [
          {
            en: "1. Al-Jawf (The Empty Space in throat & mouth) - for Madd letters (ا, و, ي).",
            ml: "1. അൽ-ജൗഫ് (തൊണ്ടയിലെയും വായിലെയും ശൂന്യത) - മദ്ദ് അക്ഷരങ്ങൾ (ا, و, ي).",
          },
          {
            en: "2. Al-Halq (The Throat) - 6 letters: Hamzah, Ha, 'Ayn, Haa, Ghayn, Kha (ء هـ ع ح غ خ).",
            ml: "2. അൽ-ഹൽഖ് (തൊണ്ട) - 6 അക്ഷരങ്ങൾ: ഹംസ, ഹാഅ്, ഐൻ, ഹാഅ്, ഗൈൻ, ഖാഅ്.",
          },
          {
            en: "3. Al-Lisan (The Tongue) - the largest home, giving birth to 18 letters!",
            ml: "3. അൽ-ലിസാൻ (നാവ്) - ഏറ്റവും കൂടുതൽ അക്ഷരങ്ങൾ (18 അക്ഷരങ്ങൾ) പുറപ്പെടുന്ന സ്ഥാനം!",
          },
          {
            en: "4. Ash-Shafatayn (The Lips) - 4 letters: Fa, Waw, Ba, Meem (ف و ب م).",
            ml: "4. അശ്-ശഫതൈൻ (ചുണ്ടുകൾ) - 4 അക്ഷരങ്ങൾ: ഫാഅ്, വാവ്, ബാഅ്, മീം.",
          },
          {
            en: "5. Al-Khayshum (Nasal Passage) - produces the sweet humming Ghunnah sound.",
            ml: "5. അൽ-ഖൈശൂം (മൂക്കിന്റെ ഉൾഭാഗം) - ഘുന്നഃ ശബ്ദം പുറപ്പെടുന്ന സ്ഥാനം.",
          },
        ],
        arabicExamples: [
          { text: "أَنْعَمْتَ", label: { en: "Throat letters: Nun & 'Ayn", ml: "തൊണ്ടയിൽ നിന്ന്: ഐൻ" } },
          { text: "قُلْ", label: { en: "Tongue base: Qaf (ق)", ml: "നാവിന്റെ അടിവേര്: ഖാഫ്" } },
          { text: "بِسْمِ", label: { en: "Lips: Ba & Meem (ب, م)", ml: "ചുണ്ടുകളിൽ നിന്ന്: ബാഅ്, മീം" } },
        ],
      },
    ],
    quiz: {
      question: {
        en: "Which part of the mouth produces the letters Ba (ب) and Meem (م)?",
        ml: "ബാഅ് (ب), മീം (م) എന്നീ അക്ഷരങ്ങൾ ഏത് സ്ഥാനത്തു നിന്നാണ് പുറപ്പെടുന്നത്?",
      },
      options: [
        { id: "a", text: { en: "Ash-Shafatayn (The Lips)", ml: "അശ്-ശഫതൈൻ (ചുണ്ടുകൾ)" }, isCorrect: true },
        { id: "b", text: { en: "Al-Halq (The Throat)", ml: "അൽ-ഹൽഖ് (തൊണ്ട)" }, isCorrect: false },
        { id: "c", text: { en: "Al-Khayshum (Nose)", ml: "അൽ-ഖൈശൂം (മൂക്ക്)" }, isCorrect: false },
      ],
      explanation: {
        en: "Correct! Ba and Meem are pronounced using both lips meeting together firmly or gently.",
        ml: "ശരിയാണ്! ബാഅ്, മീം എന്നിവ രണ്ട് ചുണ്ടുകൾ തമ്മിൽ കൂട്ടിമുട്ടി പുറപ്പെടുന്ന ശഫവിയ്യായ അക്ഷരങ്ങളാണ്.",
      },
      hint: {
        en: "Say 'Baa' and 'Maa' slowly and feel what parts touch!",
        ml: "'ബാ', 'മാ' എന്ന് പതുക്കെ പറഞ്ഞു നോക്കൂ, ചുണ്ടുകളല്ലേ കൂട്ടിമുട്ടുന്നത്?",
      },
    },
    xpReward: 15,
  },
  {
    id: "sifat-al-huruf",
    order: 2,
    englishTitle: "Sifat al-Huruf",
    malayalamTitle: "അക്ഷരങ്ങളുടെ ഗുണങ്ങൾ",
    arabicTitle: "صفات الحروف",
    badge: { en: "Letter Characteristics", ml: "സിഫത്തുകൾ" },
    icon: "💎",
    bgGradient: "bg-gradient-to-br from-[#FDF2F8] to-[#FCE7F3]",
    borderColor: "border-[#FBCFE8]",
    accentColor: "bg-[#DB2777]",
    textColor: "text-[#9D174D]",
    shortDesc: {
      en: "Learn the characteristics that give each letter its distinct voice and beauty.",
      ml: "ഓരോ അക്ഷരത്തിനും സ്വന്തമായ ശബ്ദ ഭംഗിയും ഭാവവും നൽകുന്ന ഗുണവിശേഷങ്ങൾ പഠിക്കാം.",
    },
    conceptLessons: [
      {
        title: {
          en: "What are Sifat?",
          ml: "എന്താണ് സിഫത്തുകൾ?",
        },
        points: [
          {
            en: "Even if letters share the same Makhraj (home), Sifat help us tell them apart!",
            ml: "രണ്ട് അക്ഷരങ്ങൾ ഒരേ സ്ഥാനത്ത് നിന്ന് പുറപ്പെട്ടാലും അവയെ വേർതിരിക്കുന്നത് സിഫത്തുകളാണ്.",
          },
          {
            en: "Hams (Whisper): Air flows freely with letters: ف ح ث هـ ش خ ص س ك ت.",
            ml: "ഹംസ് (ശ്വാസം വിടൽ): കാറ്റ് പുറത്തേക്ക് ഒഴുകുന്ന അക്ഷരങ്ങൾ (ഫ, ഹ, സ...).",
          },
          {
            en: "Jahr (Clear Voice): Air is held back, creating a solid, bold sound.",
            ml: "ജഹ്റ് (ശബ്ദം തടയൽ): ശ്വാസം പുറത്തേക്ക് വിടാതെ മുഴക്കത്തോടെ ഉച്ചരിക്കൽ.",
          },
          {
            en: "Shiddah (Strength) vs Rakhawah (Softness): How sound stops or continues.",
            ml: "ശിദ്ദഃ (ശക്തി) vs റഖാവഃ (മൃദുത്വം): ശബ്ദം പെട്ടെന്ന് മുറിയലും ഒഴുകലും.",
          },
        ],
        arabicExamples: [
          { text: "تَسْتَعِينُ", label: { en: "Hams in Seen & Ta (whisper)", ml: "സീനിലും തായിലും കാറ്റൊഴുക്ക്" } },
          { text: "الصِّرَاطَ", label: { en: "Sad & Twa (Strong & Elevated)", ml: "സ്വാദ്, ത്വാഅ് (ഗാംഭീര്യം)" } },
        ],
      },
    ],
    quiz: {
      question: {
        en: "What is 'Hams' in Tajweed?",
        ml: "തജ്‌വീദിൽ 'ഹംസ്' എന്നാൽ എന്താണ്?",
      },
      options: [
        { id: "a", text: { en: "The flowing of breath while pronouncing the letter", ml: "അക്ഷരം ഉച്ചരിക്കുമ്പോൾ ശ്വാസം പുറത്തേക്ക് ഒഴുകൽ" }, isCorrect: true },
        { id: "b", text: { en: "Stopping all breath completely", ml: "ശ്വാസം പൂർണ്ണമായി തടഞ്ഞു നിർത്തൽ" }, isCorrect: false },
        { id: "c", text: { en: "Closing both eyes while reading", ml: "കണ്ണടച്ചു ഓതൽ" }, isCorrect: false },
      ],
      explanation: {
        en: "Bravo! Hams literally means a soft whisper where air gently escapes with the letter.",
        ml: "മാഷാ അല്ലാഹ്! ഹംസ് എന്നാൽ ശ്വാസം അല്പം പുറത്തേക്ക് വിട്ട് മൃദുവായി ഉച്ചരിക്കുന്ന ഗുണമാണ്.",
      },
      hint: {
        en: "Think of a soft breeze or gentle whisper.",
        ml: "പതുക്കെയുള്ള ഒരു ശ്വാസം വിടൽ ഓർത്തുനോക്കൂ.",
      },
    },
    xpReward: 15,
  },
  {
    id: "ahkam-nun-sakinah",
    order: 3,
    englishTitle: "Ahkam al-Nun al-Sakinah wa al-Tanween",
    malayalamTitle: "നൂൻ സാകിനയും തൻവീനും",
    arabicTitle: "أحكام النون الساكنة والتنوين",
    badge: { en: "4 Golden Rules", ml: "4 സുവർണ്ണ നിയമങ്ങൾ" },
    icon: "📜",
    bgGradient: "bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A]",
    borderColor: "border-[#FCD34D]",
    accentColor: "bg-[#D97706]",
    textColor: "text-[#92400E]",
    shortDesc: {
      en: "Master Izhar, Idgham, Iqlab, and Ikhfa whenever Nun Sakinah (نْ) or Tanween appears.",
      ml: "നൂൻ സാകിനയോ തൻവീനോ വരുമ്പോൾ പാലിക്കേണ്ട ഇള്ഹാർ, ഇദ്ഗാം, ഇഖ്‌ലാബ്, ഇഖ്ഫാഅ് നിയമങ്ങൾ.",
    },
    conceptLessons: [
      {
        title: {
          en: "The 4 Rules of Nun Sakinah (نْ) & Tanween (ـً ـٍ ـٌ)",
          ml: "നൂൻ സാകിനയുടെ 4 നിയമങ്ങൾ",
        },
        points: [
          {
            en: "1. Izhar (إظهار - Clarity): Read clearly without Ghunnah before throat letters (ء هـ ع ح غ خ).",
            ml: "1. ഇള്ഹാർ (വ്യക്തമാക്കൽ): തൊണ്ടയിലെ അക്ഷരങ്ങൾക്ക് മുമ്പ് നൂനിനെ വ്യക്തമായി ഓതുക.",
          },
          {
            en: "2. Idgham (إدغام - Merging): Merge into letters of يرملون (Yarmaloon).",
            ml: "2. ഇദ്ഗാം (ചേർത്തു ഓതൽ): ي ر م ل و ن എന്നീ അക്ഷരങ്ങളിലേക്ക് ചേർത്തു ഓതുക.",
          },
          {
            en: "3. Iqlab (إقلاب - Flipping): Turn Nun into a gentle Meem (م) before letter Ba (ب).",
            ml: "3. ഇഖ്‌ലാബ് (മാറ്റിമറിക്കൽ): ബാഅ് (ب) ന് മുമ്പ് നൂനിനെ മീം (م) ആയി മാറ്റുക.",
          },
          {
            en: "4. Ikhfa (إخفاء - Concealing): Soft nasal blend before the remaining 15 letters.",
            ml: "4. ഇഖ്ഫാഅ് (മറച്ചു ഓതൽ): ശേഷിക്കുന്ന 15 അക്ഷരങ്ങൾക്ക് മുമ്പ് മൂക്കിലൂടെ മറച്ചു ഓതുക.",
          },
        ],
        arabicExamples: [
          { text: "أَنْعَمْتَ", label: { en: "Izhar: Nun before 'Ayn", ml: "ഇള്ഹാർ: നൂനിന് ശേഷം ഐൻ" } },
          { text: "مَن يَقُولُ", label: { en: "Idgham with Ghunnah: Nun into Ya", ml: "ഇദ്ഗാം: നൂനിനെ യാഇലേക്ക് ചേർക്കൽ" } },
          { text: "مِن بَعْدِ", label: { en: "Iqlab: Nun turns into Meem before Ba", ml: "ഇഖ്‌ലാബ്: ബാഇന് മുമ്പ് മീം ആകൽ" } },
        ],
      },
    ],
    quiz: {
      question: {
        en: "What happens in Iqlab when Nun Sakinah meets the letter Ba (ب)?",
        ml: "ഇഖ്‌ലാബിൽ നൂൻ സാകിനയ്ക്ക് ശേഷം 'ബാഅ്' (ب) വന്നാൽ എന്തു സംഭവിക്കുന്നു?",
      },
      options: [
        { id: "a", text: { en: "The Nun sound is converted into a gentle Meem (م)", ml: "നൂനിന്റെ ശബ്ദം ഒരു മീം (م) ആയി മാറ്റപ്പെടുന്നു" }, isCorrect: true },
        { id: "b", text: { en: "The Nun is shouted loudly", ml: "നൂൻ ഉച്ചത്തിൽ ഒച്ചയിട്ടു ഓതുന്നു" }, isCorrect: false },
        { id: "c", text: { en: "The letter is completely skipped", ml: "അക്ഷരം ഒഴിവാക്കുന്നു" }, isCorrect: false },
      ],
      explanation: {
        en: "Spot on! In the Quran, you will often notice a tiny 'م' written above the word to guide you to Iqlab.",
        ml: "കൃത്യം! ഖുർആനിൽ ഇഖ്‌ലാബ് ഉള്ള സ്ഥലങ്ങളിൽ മുകളിൽ ചെറിയൊരു 'م' അടയാളം കാണാം.",
      },
      hint: {
        en: "Look for the tiny 'meem' floating above the letter.",
        ml: "ചെറിയൊരു 'മീം' (م) അക്ഷരത്തിന് മുകളിൽ വരുന്നത് ഓർക്കുക.",
      },
    },
    xpReward: 15,
  },
  {
    id: "ahkam-meem-sakinah",
    order: 4,
    englishTitle: "Ahkam al-Meem al-Sakinah",
    malayalamTitle: "മീം സാകിനയുടെ നിയമങ്ങൾ",
    arabicTitle: "أحكام الميم الساكنة",
    badge: { en: "3 Lip Rules", ml: "3 ചുണ്ട് നിയമങ്ങൾ" },
    icon: "👄",
    bgGradient: "bg-gradient-to-br from-[#F0E9FF] to-[#E3D4FF]",
    borderColor: "border-[#CBB5FF]",
    accentColor: "bg-[#7857E8]",
    textColor: "text-[#5B21B6]",
    shortDesc: {
      en: "Learn how to recite Meem Sakinah (مْ) before Ba, Meem, and all other letters.",
      ml: "മീം സാകിന (مْ) വരുമ്പോൾ പാലിക്കേണ്ട ഇഖ്ഫാഅ്, ഇദ്ഗാം, ഇള്ഹാർ ശഫവി നിയമങ്ങൾ.",
    },
    conceptLessons: [
      {
        title: {
          en: "The 3 Rules of Meem Sakinah (مْ)",
          ml: "മീം സാകിനയുടെ 3 നിയമങ്ങൾ",
        },
        points: [
          {
            en: "1. Ikhfa Shafawi (إخفاء شفوي): When مْ is followed by Ba (ب), hide with gentle Ghunnah.",
            ml: "1. ഇഖ്ഫാഅ് ശഫവി: മീം സാകിനയ്ക്ക് ശേഷം ബാഅ് (ب) വന്നാൽ ചുണ്ടുകൾ ചേർത്ത് മൂക്കിലൂടെ ഓതുക.",
          },
          {
            en: "2. Idgham Shafawi (إدغام شفوي): When مْ meets another Meem (م), merge with Ghunnah.",
            ml: "2. ഇദ്ഗാം ശഫവി: മീം സാകിനയ്ക്ക് ശേഷം മറ്റൊരു മീം (م) വന്നാൽ ചേർത്ത് ഘുന്നയോടെ ഓതുക.",
          },
          {
            en: "3. Izhar Shafawi (إظهار شفوي): Before all 26 other letters, recite clearly with closed lips.",
            ml: "3. ഇള്ഹാർ ശഫവി: ബാഅ്, മീം അല്ലാത്ത മറ്റ് 26 അക്ഷരങ്ങൾക്ക് മുമ്പ് മീമിനെ വ്യക്തമായി ഓതുക.",
          },
        ],
        arabicExamples: [
          { text: "تَرْمِيهِم بِحِجَارَةٍ", label: { en: "Ikhfa Shafawi: Meem before Ba", ml: "ഇഖ്ഫാഅ് ശഫവി: മീമിന് ശേഷം ബാഅ്" } },
          { text: "لَهُم مَّا يَشَاءُونَ", label: { en: "Idgham Shafawi: Meem into Meem", ml: "ഇദ്ഗാം ശഫവി: മീമിലേക്ക് മീം ലയിക്കൽ" } },
          { text: "أَنْعَمْتَ عَلَيْهِمْ", label: { en: "Izhar Shafawi: Clear Meem", ml: "ഇള്ഹാർ ശഫവി: വ്യക്തമായ മീം" } },
        ],
      },
    ],
    quiz: {
      question: {
        en: "If Meem Sakinah (مْ) is followed by the letter Ba (ب), which rule applies?",
        ml: "മീം സാകിനയ്ക്ക് (مْ) ശേഷം 'ബാഅ്' (ب) വന്നാൽ ഏതു നിയമമാണ് ബാധകമാകുന്നത്?",
      },
      options: [
        { id: "a", text: { en: "Ikhfa Shafawi (Labial Hiding with Ghunnah)", ml: "ഇഖ്ഫാഅ് ശഫവി" }, isCorrect: true },
        { id: "b", text: { en: "Qalqalah (Bouncing Sound)", ml: "ഖൽഖലഃ" }, isCorrect: false },
        { id: "c", text: { en: "No rule at all", ml: "യാതൊരു നിയമവുമില്ല" }, isCorrect: false },
      ],
      explanation: {
        en: "Excellent! When Meem Sakinah meets Ba, your lips touch gently while humming a sweet 2-count Ghunnah.",
        ml: "അസ്സലായി! മീം സാകിനയ്ക്ക് ശേഷം ബാഅ് വരുമ്പോൾ ചുണ്ടുകൾ മൃദുവായി ചേർത്ത് ഇഖ്ഫാഅ് ശഫവിയോടെ ഓതണം.",
      },
      hint: {
        en: "Remember the word 'Shafawi' means related to the lips!",
        ml: "'ശഫവി' എന്നാൽ ചുണ്ടുകളുമായി ബന്ധപ്പെട്ടത് എന്നർത്ഥം.",
      },
    },
    xpReward: 15,
  },
  {
    id: "ahkam-al-madd",
    order: 5,
    englishTitle: "Ahkam al-Madd",
    malayalamTitle: "മദ്ദിന്റെ നിയമങ്ങൾ (നീട്ടൽ)",
    arabicTitle: "أحكام المد",
    badge: { en: "Elongation Waves", ml: "നീട്ടി ഓതൽ" },
    icon: "🌊",
    bgGradient: "bg-gradient-to-br from-[#E0F2FE] to-[#BAE6FD]",
    borderColor: "border-[#7DD3FC]",
    accentColor: "bg-[#0284C7]",
    textColor: "text-[#0369A1]",
    shortDesc: {
      en: "Discover how and when to stretch sounds for 2, 4, 5, or 6 rhythmic counts.",
      ml: "ഖുർആൻ ഓതുമ്പോൾ 2, 4, 5, അല്ലെങ്കിൽ 6 ഹറകത്തുകൾ വരെ നീട്ടേണ്ട നിയമങ്ങൾ.",
    },
    conceptLessons: [
      {
        title: {
          en: "Madd: The Melodious Waves of Quran",
          ml: "മദ്ദ്: ശബ്ദം നീട്ടി ഓതൽ",
        },
        points: [
          {
            en: "Madd letters are 3: Alif (ا), Waw (و), and Ya (ي) preceded by matching harakat.",
            ml: "മദ്ദിന്റെ അക്ഷരങ്ങൾ 3: അലിഫ് (ا), വാവ് (و), യാഅ് (ي).",
          },
          {
            en: "Madd Asli (Natural): Stretched for exactly 2 counts (e.g. نُوحِيهَا).",
            ml: "മദ്ദ് അസ്‌ലി (യഥാർത്ഥ മദ്ദ്): കൃത്യം 2 ഹറകത്ത് നീട്ടുക (ഉദാ: നൂഹീഹാ).",
          },
          {
            en: "Madd Far'i (Extended): Stretched for 4, 5, or 6 counts because of Hamzah (ء) or Sukun (ـْ).",
            ml: "മദ്ദ് ഫർഈ (ശാഖാപരമായ മദ്ദ്): ഹംസയോ സുക്കൂനോ കാരണം 4, 5, അല്ലെങ്കിൽ 6 ഹറകത്ത് നീട്ടൽ.",
          },
          {
            en: "Madd Lazim: Always stretched for 6 full counts! (e.g. الضَّالِّينَ).",
            ml: "മദ്ദ് ലാസിം: നിർബന്ധമായും 6 ഹറകത്ത് പൂർണ്ണമായി നീട്ടണം (ഉദാ: അള്ളാല്ലീൻ).",
          },
        ],
        arabicExamples: [
          { text: "قَالَ", label: { en: "Madd Asli: 2 counts", ml: "മദ്ദ് അസ്‌ലി: 2 ഹറകത്ത്" } },
          { text: "جَاءَ", label: { en: "Madd Muttasil: 4-5 counts", ml: "മദ്ദ് മുത്തസിൽ: 4-5 ഹറകത്ത്" } },
          { text: "الضَّالِّينَ", label: { en: "Madd Lazim: 6 full counts", ml: "മദ്ദ് ലാസിം: 6 ഹറകത്ത്" } },
        ],
      },
    ],
    quiz: {
      question: {
        en: "How many counts must Madd Lazim (like in 'Ad-Daaalleen') be stretched?",
        ml: "'അള്ളാല്ലീൻ' പോലെയുള്ള മദ്ദ് ലാസിമിൽ എത്ര ഹറകത്ത് നീട്ടി ഓതണം?",
      },
      options: [
        { id: "a", text: { en: "6 full counts", ml: "6 ഹറകത്ത് പൂർണ്ണമായി" }, isCorrect: true },
        { id: "b", text: { en: "Only 1 count", ml: "1 ഹറകത്ത് മാത്രം" }, isCorrect: false },
        { id: "c", text: { en: "Do not stretch at all", ml: "നീട്ടാതെ വേഗത്തിൽ ഓതുക" }, isCorrect: false },
      ],
      explanation: {
        en: "Wonderful! Madd Lazim is compulsory and magnificent, held for 6 full melodic counts.",
        ml: "വളരെ ശരി! മദ്ദ് ലാസിം നിർബന്ധമായും 6 ഹറകത്തുകൾ നീട്ടി പ്രൗഢിയോടെ ഓതേണ്ടതാണ്.",
      },
      hint: {
        en: "It is the longest regular stretch in Tajweed (more than 4!).",
        ml: "തജ്‌വീദിലെ ഏറ്റവും നീളമുള്ള നീട്ടലുകളിൽ ഒന്നാണിത് (4-ൽ കൂടുതൽ!).",
      },
    },
    xpReward: 15,
  },
  {
    id: "tafkhim-tarqiq",
    order: 6,
    englishTitle: "Tafkhim and Tarqiq",
    malayalamTitle: "തഫ്ഖീമും തർഖീഖും",
    arabicTitle: "التفخيم والترقيق",
    badge: { en: "Heavy & Light", ml: "കനപ്പിച്ചും നേർത്തും" },
    icon: "⚖️",
    bgGradient: "bg-gradient-to-br from-[#FEF9C3] to-[#FEF08A]",
    borderColor: "border-[#FDE047]",
    accentColor: "bg-[#CA8A04]",
    textColor: "text-[#854D0E]",
    shortDesc: {
      en: "Learn which letters fill the mouth with boldness (Heavy) and which smile gently (Light).",
      ml: "വായ നിറച്ച് കനപ്പിച്ചു ഓതേണ്ടതും ചിരിയോടെ നേർപ്പിച്ചു ഓതേണ്ടതുമായ അക്ഷരങ്ങൾ.",
    },
    conceptLessons: [
      {
        title: {
          en: "Heavy (Tafkhim) vs Light (Tarqiq)",
          ml: "തഫ്ഖീമും (കനം) തർഖീഖും (നേർമ്മ)",
        },
        points: [
          {
            en: "7 Always Heavy letters: خ ص ض غ ط ق ظ (Mnemonic: خُصَّ ضَغْطٍ قِظْ).",
            ml: "എപ്പോഴും കനപ്പിച്ചു ഓതേണ്ട 7 അക്ഷരങ്ങൾ: ഖ, സ്വാ, ദ്വാ, ഗൈ, ത്വാ, ഖാ, ള്വാ.",
          },
          {
            en: "Light letters: All other letters are recited with a soft, smiling mouth position.",
            ml: "നേർത്ത അക്ഷരങ്ങൾ: മറ്റുള്ള അക്ഷരങ്ങൾ മൃദുവായി, ചുണ്ടുകളിൽ പുഞ്ചിരിയോടെ ഓതുന്നു.",
          },
          {
            en: "Special chameleon letters: Ra (ر) and the Lam of Allah (اللّه) can be heavy or light depending on vowels!",
            ml: "പ്രത്യേക അക്ഷരങ്ങൾ: 'റാഅ്' (ر), 'അല്ലാഹു'വിലെ ലാം എന്നിവ ഹറകത്തിനനുസരിച്ച് കനക്കുകയോ നേർക്കുകയോ ചെയ്യും.",
          },
        ],
        arabicExamples: [
          { text: "خَالِدِينَ", label: { en: "Kha is Heavy (Tafkhim)", ml: "ഖാഅ് കനപ്പിച്ചു ഓതൽ" } },
          { text: "بِسْمِ اللَّهِ", label: { en: "Lam of Allah is Light after Kasrah", ml: "കസ്റിന് ശേഷം അല്ലാഹുവിലെ ലാം നേർക്കൽ" } },
          { text: "شَهِدَ اللَّهُ", label: { en: "Lam of Allah is Heavy after Fathah", ml: "ഫത്ഹിന് ശേഷം അല്ലാഹുവിലെ ലാം കനപ്പിക്കൽ" } },
        ],
      },
    ],
    quiz: {
      question: {
        en: "Which group of letters is ALWAYS recited with heaviness (Tafkhim)?",
        ml: "എപ്പോഴും കനപ്പിച്ച് (തഫ്ഖീമോടെ) ഓതേണ്ട അക്ഷരക്കൂട്ടം ഏതാണ്?",
      },
      options: [
        { id: "a", text: { en: "خُصَّ ضَغْطٍ قِظْ (Kha, Sad, Dad, Ghayn, Ta, Qaf, Zha)", ml: "ഖുസ്വ ളഗ്തിൻ ഖിള് (خ ص ض غ ط ق ظ)" }, isCorrect: true },
        { id: "b", text: { en: "Alif, Ba, Ta, Tha", ml: "അലിഫ്, ബാഅ്, താഅ്, ഥാഅ്" }, isCorrect: false },
        { id: "c", text: { en: "Only the letter Meem", ml: "മീം മാത്രം" }, isCorrect: false },
      ],
      explanation: {
        en: "Correct! The 7 letters in 'Khussa Daghtin Qizh' always fill the mouth with boldness.",
        ml: "ശരിയാണ്! 'ഖുസ്വ ളഗ്തിൻ ഖിള്' ലെ 7 അക്ഷരങ്ങളും വായ നിറച്ച് ഗാംഭീര്യത്തോടെ കനപ്പിച്ചു ഓതണം.",
      },
      hint: {
        en: "Remember the famous mnemonic starting with 'Khu-ssa'!",
        ml: "'ഖുസ്വ...' എന്ന് തുടങ്ങുന്ന പ്രശസ്തമായ കൂട്ടക്ഷരം ഓർക്കൂ!",
      },
    },
    xpReward: 15,
  },
  {
    id: "qalqalah",
    order: 7,
    englishTitle: "Qalqalah",
    malayalamTitle: "ഖൽഖലഃ (പ്രതിധ്വനി)",
    arabicTitle: "القلقلة",
    badge: { en: "The Bouncing Sound", ml: "പ്രകമ്പനം" },
    icon: "⚡",
    bgGradient: "bg-gradient-to-br from-[#FFEDD5] to-[#FED7AA]",
    borderColor: "border-[#FDBA74]",
    accentColor: "bg-[#EA580C]",
    textColor: "text-[#9A3412]",
    shortDesc: {
      en: "Master the playful, rhythmic bouncing sound when the 5 Qalqalah letters carry a Sukun.",
      ml: "ഖൽഖലത്തിന്റെ 5 അക്ഷരങ്ങളിൽ സുക്കൂൻ വരുമ്പോൾ ഉണ്ടാകുന്ന മനോഹരമായ പ്രകമ്പനം.",
    },
    conceptLessons: [
      {
        title: {
          en: "Qalqalah: The Echoing Bounce",
          ml: "ഖൽഖലഃ ശബ്ദം വിറപ്പിച്ചു നിർത്തൽ",
        },
        points: [
          {
            en: "The 5 Qalqalah letters are combined in the phrase: قُطْبُ جَدٍّ (Qaf, Twa, Ba, Jeem, Dal).",
            ml: "ഖൽഖലത്തിന്റെ 5 അക്ഷരങ്ങൾ: ഖുത്വ്ബു ജദ്ദ് (ق ط ب ج د).",
          },
          {
            en: "When any of these letters have a Sukun (ـْ) or you stop on them, make an echo bounce!",
            ml: "ഈ അക്ഷരങ്ങളിൽ സുക്കൂൻ വരുമ്പോഴോ വഖ്ഫ് ചെയ്യുമ്പോഴോ ശബ്ദം തട്ടി പ്രതിധ്വനിക്കണം.",
          },
          {
            en: "Qalqalah Sughra (Lesser): In the middle of a word (e.g. يَطْمَعُ, أَبْوَاب).",
            ml: "ചെറിയ ഖൽഖലഃ: പദത്തിന്റെ മധ്യത്തിൽ സുക്കൂൻ വരുമ്പോൾ.",
          },
          {
            en: "Qalqalah Kubra (Greater): At the end of a verse when stopping (e.g. الْفَلَقِ ۙ, أَحَدٌ ۙ).",
            ml: "വലിയ ഖൽഖലഃ: ആയത്തിന്റെ അവസാനം നിർത്തുമ്പോൾ കൂടുതൽ വ്യക്തമായി തട്ടൽ.",
          },
        ],
        arabicExamples: [
          { text: "قُلْ هُوَ اللَّهُ أَحَدٌ ۙ", label: { en: "Echo on Dal: Ahad!", ml: "ദാലിലെ പ്രതിധ്വനി: അഹദ്!" } },
          { text: "مِن شَرِّ مَا خَلَقَ ۙ", label: { en: "Echo on Qaf: Khalaq!", ml: "ഖാഫിലെ പ്രതിധ്വനി: ഖലഖ്!" } },
          { text: "وَتَبَّ ۙ", label: { en: "Echo with Shaddah: Watabb!", ml: "തശ്ദീദോടു കൂടിയ വലിയ ഖൽഖലഃ" } },
        ],
      },
    ],
    quiz: {
      question: {
        en: "Which famous phrase contains all 5 Qalqalah letters?",
        ml: "ഖൽഖലത്തിന്റെ 5 അക്ഷരങ്ങളും അടങ്ങിയ പ്രശസ്തമായ വാക്ക് ഏതാണ്?",
      },
      options: [
        { id: "a", text: { en: "قُطْبُ جَدٍّ (Qutbu Jadd)", ml: "ഖുത്വ്ബു ജദ്ദ് (ق ط ب ج د)" }, isCorrect: true },
        { id: "b", text: { en: "يَرْمَلُونَ (Yarmaloon)", ml: "യർമലൂൻ (ي ر م ل و ن)" }, isCorrect: false },
        { id: "c", text: { en: "أَبْجَدْ (Abjad)", ml: "അബ്ജദ്" }, isCorrect: false },
      ],
      explanation: {
        en: "Superstar! Qaf, Twa, Ba, Jeem, and Dal (قطب جد) are the 5 bouncy letters of Qalqalah.",
        ml: "ഗംഭീരം! ഖാഫ്, ത്വാഅ്, ബാഅ്, ജീം, ദാൽ (ق ط ب ج د) എന്നിവയാണ് ഖൽഖലത്തിന്റെ 5 അക്ഷരങ്ങൾ.",
      },
      hint: {
        en: "It starts with the letter Qaf (ق) and Twa (ط).",
        ml: "ഖാഫും (ق) ത്വാഉം (ط) ചേർന്നു തുടങ്ങുന്ന വാക്ക് ഓർക്കുക.",
      },
    },
    xpReward: 15,
  },
  {
    id: "waqf-ibtida",
    order: 8,
    englishTitle: "Waqf wa al-Ibtida",
    malayalamTitle: "വഖ്ഫും ഇബ്തിദാഉം",
    arabicTitle: "الوقف والابتداء",
    badge: { en: "Stopping & Starting", ml: "നിർത്തലും തുടങ്ങലും" },
    icon: "🛑",
    bgGradient: "bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE]",
    borderColor: "border-[#A5B4FC]",
    accentColor: "bg-[#4F46E5]",
    textColor: "text-[#3730A3]",
    shortDesc: {
      en: "Understand Quranic punctuation signs to pause and breathe without altering meanings.",
      ml: "ഖുർആനിലെ നിർത്തൽ അടയാളങ്ങൾ മനസ്സിലാക്കി അർത്ഥവ്യത്യാസം വരാതെ ഓതാൻ പഠിക്കാം.",
    },
    conceptLessons: [
      {
        title: {
          en: "The Signs of Stopping in the Quran",
          ml: "ഖുർആനിലെ പ്രധാന വഖ്ഫ് അടയാളങ്ങൾ",
        },
        points: [
          {
            en: "مـ (Meem Lazim): Mandatory Stop. Stopping is required to preserve the meaning.",
            ml: "مـ (നിർബന്ധ വഖ്ഫ്): അർത്ഥം പൂർണ്ണമാകാൻ നിർബന്ധമായും നിർത്തണം.",
          },
          {
            en: "لا (La): Do NOT stop here! The sentence continues.",
            ml: "لا (നിർത്തരുത്): ഇവിടെ നിർത്താൻ പാടില്ല, വാചകം തുടരുകയാണ്.",
          },
          {
            en: "ج (Jeem): Permissible Stop. You may stop or continue freely.",
            ml: "ج (അനുവദനീയം): നിർത്തുകയോ മുന്നോട്ട് ഓതുകയോ ചെയ്യാം.",
          },
          {
            en: "قلى (Qala): Stopping is preferred and better.",
            ml: "قلى (നിർത്തലാണ് ഉത്തമം): നിർത്തുന്നതാണ് കൂടുതൽ നല്ലത്.",
          },
          {
            en: "صلى (Sala): Continuing is preferred and better.",
            ml: "صلى (തുടരലാണ് ഉത്തമം): നിർത്താതെ ചേർത്തു ഓതുന്നതാണ് നല്ലത്.",
          },
        ],
        arabicExamples: [
          { text: "فَلَا يَحْزُنكَ قَوْلُهُمْ ۘ إِنَّا نَعْلَمُ", label: { en: "Stop at Meem (ۘ) to separate statements", ml: "മീം കണ്ടാൽ നിർബന്ധമായും നിർത്തുക" } },
        ],
      },
    ],
    quiz: {
      question: {
        en: "What does the tiny stop sign 'لا' above a word in the Quran mean?",
        ml: "ഖുർആനിൽ ഒരു വാക്കിനു മുകളിൽ 'لا' എന്ന അടയാളം കണ്ടാൽ അതിന്റെ അർത്ഥമെന്താണ്?",
      },
      options: [
        { id: "a", text: { en: "Do NOT stop here; continue reciting", ml: "ഇവിടെ നിർത്തരുത്; ചേർത്തു ഓതുക" }, isCorrect: true },
        { id: "b", text: { en: "Must stop and close the Quran", ml: "നിർബന്ധമായും നിർത്തി ഖുർആൻ മടക്കണം" }, isCorrect: false },
        { id: "c", text: { en: "Turn the page backwards", ml: "പേജ് പിന്നിലേക്ക് മറിക്കുക" }, isCorrect: false },
      ],
      explanation: {
        en: "Spot on! 'La' means 'Do not stop' because the meaning is incomplete until the next words.",
        ml: "കൃത്യം! 'ലാ' എന്നാൽ നിർത്തരുത് എന്നർത്ഥം, കാരണം വാചകത്തിന്റെ ആശയം അടുത്ത വാക്കുകളിലാണ് പൂർത്തിയാകുന്നത്.",
      },
      hint: {
        en: "'La' in Arabic means 'No'!",
        ml: "അറബിയിൽ 'ലാ' എന്നാൽ 'ഇല്ല / അരുത്' എന്നാണല്ലോ അർത്ഥം!",
      },
    },
    xpReward: 15,
  },
  {
    id: "ghunnah",
    order: 9,
    englishTitle: "Ghunnah",
    malayalamTitle: "ഘുന്നഃ (മൂക്കിൽ നിന്നുള്ള ശബ്ദം)",
    arabicTitle: "الغنة",
    badge: { en: "Nasal Harmony", ml: "നാസികാ ശബ്ദം" },
    icon: "🎶",
    bgGradient: "bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5]",
    borderColor: "border-[#A7F3D0]",
    accentColor: "bg-[#059669]",
    textColor: "text-[#065F46]",
    shortDesc: {
      en: "Produce the resonant 2-count nasal humming tone in Noon and Meem with Shaddah.",
      ml: "നൂനിലും മീമിലും ശദ്ദ് (തശ്ദീദ്) വരുമ്പോൾ മൂക്കിലൂടെ ഉണ്ടാകുന്ന മനോഹരമായ 2 ഹറകത്ത് ശബ്ദം.",
    },
    conceptLessons: [
      {
        title: {
          en: "What is Ghunnah?",
          ml: "എന്താണ് ഘുന്നഃ?",
        },
        points: [
          {
            en: "Ghunnah is a natural melodious resonance produced exclusively from Al-Khayshum (the nasal cavity).",
            ml: "ഘുന്നഃ എന്നത് മൂക്കിന്റെ ഉൾഭാഗത്തു നിന്ന് (അൽ-ഖൈശൂം) പുറപ്പെടുന്ന മനോഹരമായ നാസികാ ശബ്ദമാണ്.",
          },
          {
            en: "Strongest Ghunnah: Noon Mushaddadah (نّ) and Meem Mushaddadah (مّ).",
            ml: "ഏറ്റവും ശക്തമായ ഘുന്നഃ: തശ്ദീദുള്ള നൂനിലും (نّ) മീമിലും (مّ).",
          },
          {
            en: "Duration: Held for 2 smooth rhythmic counts (harakatan).",
            ml: "സമയം: കൃത്യമായി 2 ഹറകത്ത് സമയം ശബ്ദം മൂക്കിൽ നിലനിർത്തണം.",
          },
        ],
        arabicExamples: [
          { text: "إِنَّ اللَّهَ", label: { en: "Inna: 2 counts Ghunnah on Noon", ml: "ഇന്ന: നൂനിൽ 2 ഹറകത്ത് ഘുന്നഃ" } },
          { text: "عَمَّ يَتَسَاءَلُونَ", label: { en: "'Amma: 2 counts Ghunnah on Meem", ml: "അമ്മ: മീമിൽ 2 ഹറകത്ത് ഘുന്നഃ" } },
        ],
      },
    ],
    quiz: {
      question: {
        en: "Which letters have mandatory 2-count Ghunnah when they have a Shaddah (ّ)?",
        ml: "തശ്ദീദ് (ّ) വരുമ്പോൾ നിർബന്ധമായും 2 ഹറകത്ത് ഘുന്നയോടെ ഓതേണ്ട അക്ഷരങ്ങൾ ഏവ?",
      },
      options: [
        { id: "a", text: { en: "Noon (نّ) and Meem (مّ)", ml: "നൂനും (نّ) മീമും (مّ)" }, isCorrect: true },
        { id: "b", text: { en: "Alif and Waw", ml: "അലിഫും വാവും" }, isCorrect: false },
        { id: "c", text: { en: "Only letter Dal", ml: "ദാൽ മാത്രം" }, isCorrect: false },
      ],
      explanation: {
        en: "Magnificent! Noon and Meem with Shaddah are called 'Harf Ghunnah Mushaddad'.",
        ml: "മാഷാ അല്ലാഹ്! തശ്ദീദുള്ള നൂനും മീമും 'ഹർഫു ഘുന്നഃ' എന്നറിയപ്പെടുന്നു, 2 ഹറകത്ത് നീട്ടണം.",
      },
      hint: {
        en: "Think of words like 'Inna' and 'Amma'.",
        ml: "'ഇന്ന' (إِنَّ), 'അമ്മ' (عَمَّ) എന്നീ പദങ്ങൾ ഓർത്തുനോക്കൂ.",
      },
    },
    xpReward: 15,
  },
  {
    id: "practical-recitation",
    order: 10,
    englishTitle: "Practical Recitation",
    malayalamTitle: "പ്രായോഗിക പാരായണം",
    arabicTitle: "التطبيق العملي والترتيل",
    badge: { en: "Master Tilawah", ml: "പൂർണ്ണ പാരായണം" },
    icon: "👑",
    bgGradient: "bg-gradient-to-br from-[#FEFCE8] to-[#FEF08A]",
    borderColor: "border-[#FACC15]",
    accentColor: "bg-[#EAB308]",
    textColor: "text-[#713F12]",
    shortDesc: {
      en: "Combine all 9 Tajweed rules into harmonious, reverent recitation of the Holy Quran.",
      ml: "പഠിച്ച എല്ലാ തജ്‌വീദ് നിയമങ്ങളും സമന്വയിപ്പിച്ച് ഖുർആൻ അതിമനോഹരമായി പാരായണം ചെയ്യാം.",
    },
    conceptLessons: [
      {
        title: {
          en: "Bringing All Tajweed Rules Together",
          ml: "എല്ലാ തജ്‌വീദ് നിയമങ്ങളും ഒന്നിച്ച് പ്രയോഗിക്കാം",
        },
        points: [
          {
            en: "Recite slowly and reflectively: 'And recite the Quran with measured recitation (Tarteel)'.",
            ml: "ഖുർആൻ സാവധാനത്തിലും ചിന്തയോടെയും തർതീലോടെ പാരായണം ചെയ്യുക.",
          },
          {
            en: "Combine Makharij + Sifat + Nun/Meem rules + Madd + Qalqalah naturally.",
            ml: "മഖ്റജ്, സിഫത്ത്, നൂൻ-മീം നിയമങ്ങൾ, മദ്ദ്, ഖൽഖലഃ എന്നിവയെല്ലാം സ്വാഭാവികമായി പാലിക്കുക.",
          },
          {
            en: "Consistency is key: 5-10 minutes of daily practice trains your tongue and ear.",
            ml: "ദിവസേനയുള്ള 5-10 മിനിറ്റ് പരിശീലനം നാവിലും മനസ്സിലും വലിയ മാറ്റം കൊണ്ടുവരും.",
          },
        ],
        arabicExamples: [
          { text: "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا", label: { en: "And recite the Quran with measured Tarteel", ml: "ഖുർആൻ തർതീലോടെ ഓതുക" } },
        ],
      },
    ],
    quiz: {
      question: {
        en: "What is the ultimate goal of learning Tajweed?",
        ml: "തജ്‌വീദ് പഠിക്കുന്നതിന്റെ പരമമായ ലക്ഷ്യം എന്താണ്?",
      },
      options: [
        { id: "a", text: { en: "To recite Allah's words with beauty, correctness, and heartfelt reverence", ml: "അല്ലാഹുവിന്റെ വചനങ്ങൾ തെറ്റുകൂടാതെ, ഭക്തിയോടെ മനോഹരമായി ഓതാൻ" }, isCorrect: true },
        { id: "b", text: { en: "To rush through verses as fast as possible", ml: "വേഗത്തിൽ ഓതി തീർക്കാൻ" }, isCorrect: false },
        { id: "c", text: { en: "To read without understanding any letters", ml: "അക്ഷരങ്ങൾ മനസ്സിലാക്കാതെ വായിക്കാൻ" }, isCorrect: false },
      ],
      explanation: {
        en: "Masha'Allah! Tajweed elevates your connection to the Quran, preserving every letter as it was revealed.",
        ml: "മാഷാ അല്ലാഹ്! ഖുർആനിലെ ഓരോ അക്ഷരവും പ്രവാചകൻ ﷺ ഓതിയതുപോലെ മനോഹരമായി സംരക്ഷിക്കുക എന്നതാണ് തജ്‌വീദിന്റെ ലക്ഷ്യം.",
      },
      hint: {
        en: "Think about honoring the words of the Almighty Allah.",
        ml: "അല്ലാഹുവിന്റെ വചനങ്ങളെ ആദരിക്കുന്നതിനെക്കുറിച്ച് ചിന്തിക്കൂ.",
      },
    },
    xpReward: 25,
  },
];
