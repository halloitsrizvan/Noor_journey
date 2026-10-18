/**
 * Curriculum Lesson Quizzes for all 5 Madrasa Subjects
 * Provides dual-language (Malayalam & English) interactive questions for each lesson.
 */

export interface QuizOption {
  id: string;
  text: { en: string; ml: string };
  isCorrect: boolean;
}

export interface TopicQuiz {
  question: { en: string; ml: string };
  options: QuizOption[];
  explanation: { en: string; ml: string };
  hint?: { en: string; ml: string };
}

export const SUBJECT_TOPIC_QUIZZES: Record<string, Record<number, TopicQuiz>> = {
  tajweed: {
    0: {
      question: {
        en: "In Surah Al-Fatihah, which word contains a Madd Lazim that must be stretched for 6 Harakahs?",
        ml: "സൂറത്തുൽ ഫാതിഹയിൽ 6 ഹറകത് നീട്ടി ഓതേണ്ട മദ്ദ് ലാസിം അടങ്ങിയ പദം ഏതാണ്?",
      },
      options: [
        {
          id: "a",
          text: { en: "Ad-Dallin (الضَّالِّينَ)", ml: "ളല്ലീൻ (الضَّالِّينَ)" },
          isCorrect: true,
        },
        {
          id: "b",
          text: { en: "Al-Hamdu (الْحَمْدُ)", ml: "അൽഹംദു (الْحَمْدُ)" },
          isCorrect: false,
        },
        {
          id: "c",
          text: { en: "Iyyaka (إِيَّاكَ)", ml: "ഇയ്യാക (إِيَّاكَ)" },
          isCorrect: false,
        },
      ],
      explanation: {
        en: "Correct! 'Ad-Dallin' contains a Madd letter followed by a Shaddah in the same word, making it Madd Lazim Kalimi Muthaqqal (6 counts).",
        ml: "ശരിയാണ്! മദ്ദിന്റെ അക്ഷരത്തിന് ശേഷം ശദ്ദുള്ള അക്ഷരം വന്നതിനാൽ 'വലള്ളാല്ലീൻ' എന്നത് 6 ഹറകത് നീട്ടി ഓതേണ്ട മദ്ദ് ലാസിം ആണ്.",
      },
      hint: {
        en: "Look for the final verse ending with a heavy Shaddah on the Lam!",
        ml: "അവസാന ആയത്തിലെ ലാമിൽ ശദ്ദുള്ള പദം ശ്രദ്ധിക്കൂ!",
      },
    },
    1: {
      question: {
        en: "From which articulation area do the throat letters (Hamzah, Ha, 'Ayn, Haa, Ghayn, Kha) originate?",
        ml: "ഹംസ, ഹാഅ്, ഐൻ, ഹാ, ഗൈൻ, ഖാഅ് എന്നീ 6 അക്ഷരങ്ങൾ ഏത് സ്ഥാനത്തു നിന്നാണ് പുറപ്പെടുന്നത്?",
      },
      options: [
        {
          id: "a",
          text: { en: "Al-Halq (The Throat)", ml: "അൽ-ഹൽഖ് (തൊണ്ട)" },
          isCorrect: true,
        },
        {
          id: "b",
          text: { en: "Ash-Shafatayn (The Lips)", ml: "അശ്-ശഫതൈൻ (ചുണ്ടുകൾ)" },
          isCorrect: false,
        },
        {
          id: "c",
          text: { en: "Al-Khayshum (Nasal Passage)", ml: "അൽ-ഖൈശൂം (മൂക്കിന്റെ ഉൾഭാഗം)" },
          isCorrect: false,
        },
      ],
      explanation: {
        en: "Correct! The 6 letters of Izhar Halqi originate from the 3 levels of the throat (Halq).",
        ml: "ശരിയാണ്! തൊണ്ടയുടെ മൂന്ന് ഭാഗങ്ങളിൽ (താഴ്ഭാഗം, മധ്യഭാഗം, മേൽഭാഗം) നിന്നാണ് ഹൽഖിന്റെ 6 അക്ഷരങ്ങൾ പുറപ്പെടുന്നത്.",
      },
      hint: {
        en: "These letters are pronounced from the throat without nasal humming.",
        ml: "തൊണ്ടയിൽ നിന്ന് നേരിട്ട് ഉച്ചരിക്കുന്ന അക്ഷരങ്ങളാണിവ.",
      },
    },
    2: {
      question: {
        en: "What rule applies when a Noon Sakinah is followed by the letter Ba (ب)?",
        ml: "നൂൻ സാകിനക്കോ തൻവീന്നോ ശേഷം 'ബാഅ്' (ب) വന്നാൽ ഏത് നിയമമാണ് ബാധകമാകുന്നത്?",
      },
      options: [
        {
          id: "a",
          text: { en: "Iqlab (Changing to Meem with Ghunnah)", ml: "ഇഖ്‌ലാബ് (മീം ആക്കി മാറ്റി ഓതൽ)" },
          isCorrect: true,
        },
        {
          id: "b",
          text: { en: "Izhar (Clear pronunciation)", ml: "ഇള്ഹാർ (വ്യക്തമാക്കൽ)" },
          isCorrect: false,
        },
        {
          id: "c",
          text: { en: "Idgham without Ghunnah", ml: "ഗുന്നയില്ലാത്ത ഇദ്ഗാം" },
          isCorrect: false,
        },
      ],
      explanation: {
        en: "Correct! In Iqlab, Noon Sakin turns into a hidden Meem with Ghunnah before Ba (e.g. Min Ba'di -> Mim-ba'di).",
        ml: "ശരിയാണ്! 'ബാ'ഇന് മുൻപിൽ നൂൻ സാകിനയെ അല്ലെങ്കിൽ തൻവീനിനെ മീം ആക്കി മാറ്റി ഗുണ്ണയോടെ ഓതുന്നതിനാണ് ഇഖ്‌ലാബ് എന്ന് പറയുന്നത്.",
      },
      hint: {
        en: "Look for the small Meem (مـ) sign written in the Mushaf above the Noon!",
        ml: "മുസ്ഹഫിൽ നൂനിന് മുകളിൽ ചെറിയൊരു 'മീം' (مـ) അടയാളം കാണാറില്ലേ?",
      },
    },
    3: {
      question: {
        en: "How many counts (Harakahs) is Madd Asli (natural stretch) held for?",
        ml: "മദ്ദ് അസ്‌ലി (സ്വാഭാവിക മദ്ദ്) എത്ര ഹറകത് നീട്ടണം?",
      },
      options: [
        {
          id: "a",
          text: { en: "2 Harakahs (Counts)", ml: "2 ഹറകത്" },
          isCorrect: true,
        },
        {
          id: "b",
          text: { en: "6 Harakahs (Counts)", ml: "6 ഹറകത്" },
          isCorrect: false,
        },
        {
          id: "c",
          text: { en: "10 Harakahs (Counts)", ml: "10 ഹറകത്" },
          isCorrect: false,
        },
      ],
      explanation: {
        en: "Correct! Madd Asli / Tabee'ee is stretched for exactly 2 counts (the time to open or close a finger normally).",
        ml: "ശരിയാണ്! സ്വാഭാവിക മദ്ദ് (മദ്ദ് അസ്‌ലി) 2 ഹറകത് അളവിലാണ് നീട്ടേണ്ടത്.",
      },
      hint: {
        en: "Think of words like 'Qala' or 'Qeela' - a gentle 2-count stretch.",
        ml: "ഖാല, ഖീല എന്ന് പറയുമ്പോൾ നീട്ടുന്ന സ്വാഭാവിക അളവ് ഓർക്കുക.",
      },
    },
  },
  aqeedah: {
    0: {
      question: {
        en: "Which Archangel was entrusted by Allah with delivering divine revelation (Wahy) to the Prophets?",
        ml: "പ്രവാചകന്മാർക്ക് അല്ലാഹുവിന്റെ വഹ്‌യ് (ദിവ്യസന്ദേശം) എത്തിച്ചുകൊടുക്കാൻ നിയോഗിക്കപ്പെട്ട മലക്ക് ആരാണ്?",
      },
      options: [
        {
          id: "a",
          text: { en: "Jibreel (Gabriel) عليه السلام", ml: "ജിബ്‌രീൽ (അ)" },
          isCorrect: true,
        },
        {
          id: "b",
          text: { en: "Mikaeel (Michael) عليه السلام", ml: "മീക്കാഈൽ (അ)" },
          isCorrect: false,
        },
        {
          id: "c",
          text: { en: "Israfeel عليه السلام", ml: "ഇസ്റാഫീൽ (അ)" },
          isCorrect: false,
        },
      ],
      explanation: {
        en: "Correct! Angel Jibreel (Al-Rooh Al-Ameen) brought the Holy Quran to Prophet Muhammad ﷺ and divine scriptures to earlier messengers.",
        ml: "ശരിയാണ്! റൂഹുൽ അമീനായ ജിബ്‌രീൽ (അ) ആണ് പ്രവാചകന്മാർക്ക് ദിവ്യസന്ദേശങ്ങൾ എത്തിച്ചു നൽകിയത്.",
      },
      hint: {
        en: "He appeared to the Prophet ﷺ in the Cave of Hira with 'Iqra'.",
        ml: "ഹിറാ ഗുഹയിൽ നബി ﷺ ക്ക് 'ഇഖ്‌റഅ്' എന്ന ആദ്യ വചനം എത്തിച്ചു നൽകിയത് ഇദ്ദേഹമാണ്.",
      },
    },
    1: {
      question: {
        en: "What does Allah's Beautiful Name 'Al-Khaliq' (الْخَالِقُ) mean?",
        ml: "അല്ലാഹുവിന്റെ തിരുനാമങ്ങളിൽ ഒന്നായ 'അൽ-ഖാലിഖ്' (الْخَالِقُ) എന്നതിന്റെ അർത്ഥം എന്താണ്?",
      },
      options: [
        {
          id: "a",
          text: { en: "The Creator of all things", ml: "എല്ലാറ്റിന്റെയും സ്രഷ്ടാവ്" },
          isCorrect: true,
        },
        {
          id: "b",
          text: { en: "The All-Hearing", ml: "എല്ലാം കേൾക്കുന്നവൻ" },
          isCorrect: false,
        },
        {
          id: "c",
          text: { en: "The Provider of sustenance", ml: "ഭക്ഷണം നൽകുന്നവൻ" },
          isCorrect: false,
        },
      ],
      explanation: {
        en: "Correct! Al-Khaliq means The Creator who brought everything in the universe into existence from nothing.",
        ml: "ശരിയാണ്! ഒന്നുമില്ലായ്മയിൽ നിന്ന് സർവ്വ പ്രപഞ്ചത്തെയും സൃഷ്ടിച്ചവനാണ് 'അൽ-ഖാലിഖ്' ആയ അല്ലാഹു.",
      },
      hint: {
        en: "He created the skies, the earth, and all humans.",
        ml: "ആകാശഭൂമികളെയും മനുഷ്യരെയും സൃഷ്ടിച്ചവൻ എന്ന അർത്ഥം ഓർക്കുക.",
      },
    },
    2: {
      question: {
        en: "What title is Prophet Muhammad ﷺ known by, denoting the finality of Prophethood?",
        ml: "പ്രവാചക പരമ്പരയുടെ പൂർത്തീകരണമായി നബി ﷺ യെ വിശേഷിപ്പിക്കുന്ന പദവി ഏതാണ്?",
      },
      options: [
        {
          id: "a",
          text: { en: "Khatam an-Nabiyyin (Seal of the Prophets)", ml: "ഖാതമുന്നുബുവ്വത്ത് (അന്ത്യപ്രവാചകൻ)" },
          isCorrect: true,
        },
        {
          id: "b",
          text: { en: "Kalimullah", ml: "കലീമുള്ളാഹ്" },
          isCorrect: false,
        },
        {
          id: "c",
          text: { en: "Dhun-Noorayn", ml: "ദുന്നൂറൈൻ" },
          isCorrect: false,
        },
      ],
      explanation: {
        en: "Correct! Prophet Muhammad ﷺ is Khatam an-Nabiyyin — the last and final Messenger sent by Allah to all mankind.",
        ml: "ശരിയാണ്! നബി ﷺ അല്ലാഹു മനുഷ്യകുലത്തിന് നൽകിയ അന്ത്യപ്രവാചകനാണ് (ഖാതമുന്നുബുവ്വത്ത്).",
      },
      hint: {
        en: "No prophet will come after him until the Day of Judgment.",
        ml: "നബി ﷺ ക്ക് ശേഷം ലോകാവസാനം വരെ മറ്റൊരു പ്രവാചകനില്ല.",
      },
    },
  },
  fiqh: {
    0: {
      question: {
        en: "Which of the following is one of the obligatory (Fard) pillars of Wudu in Islamic jurisprudence?",
        ml: "വുളൂഇന്റെ ഫർളുകളിൽ (നിർബന്ധ ഘടകങ്ങളിൽ) പെട്ടത് ഏതാണ്?",
      },
      options: [
        {
          id: "a",
          text: { en: "Washing the complete face with intention (Niyyah)", ml: "നിയ്യത്തോടുകൂടി മുഖം മുഴുവനായി കഴുകൽ" },
          isCorrect: true,
        },
        {
          id: "b",
          text: { en: "Using fragrance before prayer", ml: "സുഗന്ധം പൂശൽ" },
          isCorrect: false,
        },
        {
          id: "c",
          text: { en: "Washing limbs four times", ml: "നാല് തവണ കഴുകൽ" },
          isCorrect: false,
        },
      ],
      explanation: {
        en: "Correct! The Fard of Wudu include: Niyyah, washing the face, washing arms up to elbows, wiping part of head, washing feet up to ankles, and Tartib (sequence).",
        ml: "ശരിയാണ്! നിയ്യത്ത് വെക്കലും മുഖം കഴുകലും കൈമുട്ടുകൾ ഉൾപ്പെടെ കഴുകലും തല തടവലും കാൽ ഞെരിയാണി ഉൾപ്പെടെ കഴുകലും വുളൂഇന്റെ ഫർളുകളാണ്.",
      },
      hint: {
        en: "Wudu starts with pure intention and purifying the face from hairline to chin.",
        ml: "വുളൂഅ് ആരംഭിക്കുമ്പോൾ മനസ്സിൽ നിയ്യത്ത് വെച്ച് മുഖം കഴുകണം.",
      },
    },
    1: {
      question: {
        en: "How many obligatory (Fard) Rak'ahs are performed in the Subhi (Fajr) prayer?",
        ml: "സുബ്ഹി നമസ്കാരത്തിലെ ഫർളായ റക്അത്തുകൾ എത്രയാണ്?",
      },
      options: [
        {
          id: "a",
          text: { en: "2 Rak'ahs", ml: "2 റക്അത്ത്" },
          isCorrect: true,
        },
        {
          id: "b",
          text: { en: "3 Rak'ahs", ml: "3 റക്അത്ത്" },
          isCorrect: false,
        },
        {
          id: "c",
          text: { en: "4 Rak'ahs", ml: "4 റക്അത്ത്" },
          isCorrect: false,
        },
      ],
      explanation: {
        en: "Correct! The morning prayer Subhi consists of 2 obligatory Rak'ahs recited aloud (Jahri).",
        ml: "ശരിയാണ്! പ്രഭാത നമസ്കാരമായ സുബ്ഹി 2 റക്അത്താണ് നിർവ്വഹിക്കേണ്ടത്.",
      },
      hint: {
        en: "It is the shortest of the 5 daily obligatory prayers.",
        ml: "അഞ്ച് നേരത്തെ നമസ്കാരങ്ങളിൽ ഏറ്റവും കുറഞ്ഞ റക്അത്തുള്ള നമസ്കാരം.",
      },
    },
    2: {
      question: {
        en: "What special tool did Prophet Muhammad ﷺ strongly encourage using to keep teeth and breath clean?",
        ml: "പല്ലുകളും വായും വൃത്തിയായി സൂക്ഷിക്കാൻ നബി ﷺ ഏറ്റവും കൂടുതൽ പ്രോത്സാഹിപ്പിച്ച സുന്നത്ത് ഏതാണ്?",
      },
      options: [
        {
          id: "a",
          text: { en: "Miswak (Arak twig toothstick)", ml: "മിസ്‌വാക്ക് ചെയ്യൽ" },
          isCorrect: true,
        },
        {
          id: "b",
          text: { en: "Scented smoke", ml: "സുഗന്ധ പുക" },
          isCorrect: false,
        },
        {
          id: "c",
          text: { en: "Cold water compress", ml: "തണുത്ത വെള്ളം തളിക്കൽ" },
          isCorrect: false,
        },
      ],
      explanation: {
        en: "Correct! Using the Miswak before Salah and Wudu purifies the mouth and pleases Allah Almighty.",
        ml: "ശരിയാണ്! മിസ്‌വാക്ക് ചെയ്യുന്നത് വായക്ക് ശുദ്ധിയും അല്ലാഹുവിന് തൃപ്തിയും നൽകുന്ന പുണ്യമായ സുന്നത്താണ്.",
      },
      hint: {
        en: "A natural wooden twig praised in multiple Hadiths for oral hygiene.",
        ml: "വുളൂഇന് മുൻപും നമസ്കാരത്തിന് മുൻപും ഉപയോഗിക്കുന്ന പല്ലുതേപ്പ് കമ്പ്.",
      },
    },
  },
  "lisanul-quran": {
    0: {
      question: {
        en: "What does the frequently repeated Quranic word 'Al-Kitab' (الْكِتَابُ) mean?",
        ml: "വിശുദ്ധ ഖുർആനിൽ ധാരാളമായി കാണുന്ന 'അൽ-കിതാബ്' (الْكِتَابُ) എന്ന പദത്തിന്റെ അർത്ഥം എന്താണ്?",
      },
      options: [
        {
          id: "a",
          text: { en: "The Book / Divine Scripture", ml: "ഗ്രന്ഥം / വേദഗ്രന്ഥം" },
          isCorrect: true,
        },
        {
          id: "b",
          text: { en: "The Mountain", ml: "പർവ്വതം" },
          isCorrect: false,
        },
        {
          id: "c",
          text: { en: "The Garden", ml: "തോട്ടം" },
          isCorrect: false,
        },
      ],
      explanation: {
        en: "Correct! 'Al-Kitab' refers to the Book (The Holy Quran and Divine Scriptures revealed by Allah).",
        ml: "ശരിയാണ്! 'അൽ-കിതാബ്' എന്നാൽ വിശുദ്ധ ഗ്രന്ഥം (ഖുർആൻ) എന്നാണ് അർത്ഥം.",
      },
      hint: {
        en: "Think of 'Dhalikal Kitabu la rayba feeh' in Surah Al-Baqarah.",
        ml: "സൂറതുൽ ബഖറയിലെ 'ദാലികൽ കിതാബു ലാ റൈബ ഫീഹ്' ഓർക്കുക.",
      },
    },
    1: {
      question: {
        en: "Which vowel mark (Harakah) placed above an Arabic letter produces the 'oo' / 'u' vowel sound?",
        ml: "അറബി അക്ഷരത്തിന് മുകളിൽ ഇടുമ്പോൾ 'ഉ' എന്ന ശബ്ദം നൽകുന്ന ഹറകത് ഏതാണ്?",
      },
      options: [
        {
          id: "a",
          text: { en: "Dammah ( ُ )", ml: "ളമ്മ് ( ُ )" },
          isCorrect: true,
        },
        {
          id: "b",
          text: { en: "Kasrah ( ِ )", ml: "കസ്റ് ( ِ )" },
          isCorrect: false,
        },
        {
          id: "c",
          text: { en: "Fathah ( َ )", ml: "ഫത്ഹ് ( َ )" },
          isCorrect: false,
        },
      ],
      explanation: {
        en: "Correct! Dammah produces the 'u' sound (e.g. ب tulip sound 'Bu'), while Fathah produces 'a' and Kasrah produces 'i'.",
        ml: "ശരിയാണ്! 'ളമ്മ്' ( ُ ) അക്ഷരങ്ങൾക്ക് 'ഉ' ശബ്ദവും, ഫത്ഹ് 'അ' ശബ്ദവും, കസ്റ് 'ഇ' ശബ്ദവുമാണ് നൽകുന്നത്.",
      },
      hint: {
        en: "It looks like a tiny Waw (و) placed above the letter!",
        ml: "അക്ഷരത്തിന് മുകളിൽ കാണുന്ന ചെറിയൊരു 'വാവ്' (و) പോലെയുള്ള അടയാളം.",
      },
    },
    2: {
      question: {
        en: "In Surah Al-Ikhlas, what does 'Allahu As-Samad' (اللَّهُ الصَّمَدُ) teach us?",
        ml: "സൂറത്തുൽ ഇഖ്‌ലാസിലെ 'അല്ലാഹുസ്സ്വമദ്' (اللَّهُ الصَّمَدُ) എന്ന വാക്യം നമ്മെ എന്ത് പഠിപ്പിക്കുന്നു?",
      },
      options: [
        {
          id: "a",
          text: {
            en: "Allah is the Self-Sufficient upon Whom all creation depends",
            ml: "അല്ലാഹു ഏവർക്കും ആശ്രയമായവനാണ്, അവന് യാതൊരു ആശ്രയവും ആവശ്യമില്ല",
          },
          isCorrect: true,
        },
        {
          id: "b",
          text: { en: "Allah has children and parents", ml: "അല്ലാഹുവിന് സന്താനങ്ങളുണ്ട്" },
          isCorrect: false,
        },
        {
          id: "c",
          text: { en: "Allah needs rest", ml: "അല്ലാഹുവിന് വിശ്രമം ആവശ്യമാണ്" },
          isCorrect: false,
        },
      ],
      explanation: {
        en: "Correct! As-Samad means the Eternal, Self-Sufficient Lord who needs nothing, while everything in creation needs Him.",
        ml: "ശരിയാണ്! സർവ്വരും ആശ്രയിക്കുന്നവനും എന്നാൽ ആരുടെയും ഒന്നിന്റെയും ആശ്രയമില്ലാത്തവനുമാണ് അല്ലാഹു (അസ്സ്വമദ്).",
      },
      hint: {
        en: "Everyone turns to Him for help in times of need.",
        ml: "എല്ലാ ജീവജാലങ്ങളും സഹായത്തിനായി കൈനീട്ടുന്നത് അവനിലേക്കാണ്.",
      },
    },
  },
  akhlaq: {
    0: {
      question: {
        en: "What expression of irritation or annoyance does the Quran strictly forbid saying to parents?",
        ml: "മാതാപിതാക്കളോട് ഉപയോഗിക്കാൻ പാടില്ല എന്ന് വിശുദ്ധ ഖുർആൻ പ്രത്യേകം വിലക്കിയ പദം ഏതാണ്?",
      },
      options: [
        {
          id: "a",
          text: { en: "'Uff' (sigh of irritation/contempt)", ml: "'ഛെ' (ഉഫ്ഫ്) എന്ന് പോലും പറയരുത്" },
          isCorrect: true,
        },
        {
          id: "b",
          text: { en: "'Marhaban' (Welcome)", ml: "മർഹബൻ (സ്വാഗതം)" },
          isCorrect: false,
        },
        {
          id: "c",
          text: { en: "'Jazakallahu Khair'", ml: "ജസാക്കല്ലാഹു ഖൈർ" },
          isCorrect: false,
        },
      ],
      explanation: {
        en: "Correct! Allah says in Surah Al-Isra (17:23): 'Do not say to them so much as 'Uff' and do not repel them, but speak to them noble words.'",
        ml: "ശരിയാണ്! മാതാപിതാക്കളോട് 'ഛെ' എന്ന് പോലും പറയരുതെന്നും അവരോട് ആദരവോടെ നല്ല വാക്കുകൾ സംസാരിക്കണമെന്നും ഖുർആൻ കൽപ്പിക്കുന്നു.",
      },
      hint: {
        en: "Even a small grumble or sigh of anger is forbidden.",
        ml: "ചെറിയൊരു ദേഷ്യപ്പെടലോ മുഷിപ്പോ പോലും മാതാപിതാക്കളോട് കാണിക്കാൻ പാടില്ല.",
      },
    },
    1: {
      question: {
        en: "What did Prophet Muhammad ﷺ say about smiling in the face of your brother?",
        ml: "സഹോദരന്റെ മുഖത്തുനോക്കി പുഞ്ചിരിക്കുന്നതിനെക്കുറിച്ച് നബി ﷺ പഠിപ്പിച്ചത് എന്താണ്?",
      },
      options: [
        {
          id: "a",
          text: { en: "It is an act of charity (Sadaqah)", ml: "അത് ഒരു സ്വദഖയാണ് (ധർമ്മമാണ്)" },
          isCorrect: true,
        },
        {
          id: "b",
          text: { en: "It reduces good deeds", ml: "അത് നന്മകൾ കുറക്കും" },
          isCorrect: false,
        },
        {
          id: "c",
          text: { en: "It has no spiritual reward", ml: "അതിന് പ്രതിഫലമില്ല" },
          isCorrect: false,
        },
      ],
      explanation: {
        en: "Correct! The Prophet ﷺ said: 'Your smiling in the face of your brother is charity for you' (Tirmidhi).",
        ml: "ശരിയാണ്! 'നിന്റെ സഹോദരന്റെ മുഖത്തു നോക്കി പുഞ്ചിരിക്കുന്നത് നിനക്ക് ഒരു സ്വദഖയാണ്' എന്ന് നബി ﷺ പഠിപ്പിച്ചു.",
      },
      hint: {
        en: "It costs nothing, but brings great reward like giving charity!",
        ml: "പണം ചിലവാക്കാതെ തന്നെ വലിയ പ്രതിഫലം തരുന്ന ഒരു പുണ്യം.",
      },
    },
    2: {
      question: {
        en: "Before receiving prophecy, what trustworthy noble title did the people of Makkah give to Prophet Muhammad ﷺ?",
        ml: "പ്രവാചകത്വത്തിന് മുൻപ് തന്നെ മക്കയിലെ ജനങ്ങൾ നബി ﷺ ക്ക് നൽകിയ വിശ്വസ്തതയുടെ വിശേഷണം എന്തായിരുന്നു?",
      },
      options: [
        {
          id: "a",
          text: { en: "Al-Ameen (The Trustworthy) and As-Sadiq (The Truthful)", ml: "അൽ-അമീൻ (വിശ്വസ്തൻ), അസ്സ്വാദിഖ് (സത്യസന്ധൻ)" },
          isCorrect: true,
        },
        {
          id: "b",
          text: { en: "Al-Hakim", ml: "അൽ-ഹാകിം" },
          isCorrect: false,
        },
        {
          id: "c",
          text: { en: "Al-Ghani", ml: "അൽ-ഗനിയ്യ്" },
          isCorrect: false,
        },
      ],
      explanation: {
        en: "Correct! Even before Islam, everyone in Makkah trusted Muhammad ﷺ completely due to his unwavering truthfulness and honesty.",
        ml: "ശരിയാണ്! കളവ് പറയാത്ത, അമാനത്തുകൾ കൃത്യമായി പാലിക്കുന്ന ഉത്തമ സ്വഭാവം കാരണം മക്കക്കാർ നബി ﷺ യെ 'അൽ-അമീൻ' എന്നാണ് വിളിച്ചിരുന്നത്.",
      },
      hint: {
        en: "People would keep their most precious belongings with him for safekeeping.",
        ml: "ജനങ്ങൾക്ക് തങ്ങളുടെ വിലപിടിപ്പുള്ള വസ്തുക്കൾ സൂക്ഷിക്കാൻ ഏൽപ്പിക്കാൻ ഏറ്റവും വിശ്വാസമുണ്ടായിരുന്ന ആൾ.",
      },
    },
  },
};

/**
 * Returns the quiz for a given subject and topic index.
 * Falls back to an auto-generated learning check question if not found.
 */
export function getTopicQuiz(
  subjectKey: string,
  topicIndex: number,
  topic: { titleEn: string; titleMl: string; learningPoints?: { en: string; ml: string }[] }
): TopicQuiz {
  const found = SUBJECT_TOPIC_QUIZZES[subjectKey]?.[topicIndex];
  if (found) return found;

  // Fallback for custom DB topics
  const point1 = topic.learningPoints?.[0];
  return {
    question: {
      en: `Which of the following is a key lesson from "${topic.titleEn}"?`,
      ml: `"${topic.titleMl}" എന്ന പാഠത്തിൽ നിന്നുള്ള പ്രധാന ആശയം ഏതാണ്?`,
    },
    options: [
      {
        id: "a",
        text: {
          en: point1?.en || "Understanding and applying the lesson with sincerity",
          ml: point1?.ml || "ആത്മാർത്ഥതയോടെ ആശയം മനസ്സിലാക്കി ജീവിതത്തിൽ പകർത്തൽ",
        },
        isCorrect: true,
      },
      {
        id: "b",
        text: {
          en: "Ignoring the spiritual etiquettes and rushing",
          ml: "ആത്മീയ മര്യാദകൾ അവഗണിച്ച് തിടുക്കം കൂട്ടൽ",
        },
        isCorrect: false,
      },
      {
        id: "c",
        text: {
          en: "Leaving righteous actions for tomorrow without trying",
          ml: "ശ്രമിക്കാതെ നല്ല കാര്യങ്ങൾ നാളത്തേക്ക് മാറ്റിവെക്കൽ",
        },
        isCorrect: false,
      },
    ],
    explanation: {
      en: `Correct! Practicing "${topic.titleEn}" brings continuous reward and spiritual growth.`,
      ml: `ശരിയാണ്! "${topic.titleMl}" ജീവിതത്തിൽ പകർത്തുന്നത് വലിയ പ്രതിഫലവും നന്മയും നൽകുന്നു.`,
    },
    hint: {
      en: "Choose the option that emphasizes sincere practice and faith.",
      ml: "നന്മയും സൽപ്രവർത്തിയും ഊന്നിപ്പറയുന്ന ഓപ്ഷൻ തിരഞ്ഞെടുക്കൂ.",
    },
  };
}
