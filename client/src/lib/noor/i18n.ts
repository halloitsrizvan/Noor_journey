import type { Lang } from "./types";

export interface TranslationDictionary {
  appName: string;
  appTagline: string;
  appSub: string;
  // Nav
  navJourney: string;
  navPractice: string;
  navCollection: string;
  navParent: string;
  // Common
  start: string;
  continue: string;
  next: string;
  back: string;
  tryAgain: string;
  finish: string;
  finishForToday: string;
  completed: string;
  locked: string;
  comingSoon: string;
  available: string;
  level: string;
  xp: string;
  xpEarned: string;
  dueRevisions: string;
  weeklyGoal: string;
  minutes: string;
  concept: string;
  objective: string;
  listenAudio: string;
  audioUnavailable: string;
  checkAnswer: string;
  correctAnswer: string;
  needsReview: string;
  congratulations: string;
  // Worlds
  worldTitle: string;
  switchWorld: string;
  filterSubject: string;
  allSubjects: string;
  // Checkpoint
  checkpointTitle: string;
  checkpointDesc: string;
  checkpointPass: string;
  checkpointRetry: string;
  score: string;
  // Revision
  practiceTitle: string;
  practiceDesc: string;
  noRevisionsDue: string;
  revisionsDueCount: string;
  masteryNotStarted: string;
  masteryLearning: string;
  masteryReady: string;
  masteryRetained: string;
  // Collection
  badgesTitle: string;
  avatarsTitle: string;
  badgesEarned: string;
  selectAvatar: string;
  // Parent
  parentAreaTitle: string;
  parentGateTitle: string;
  parentGateDesc: string;
  parentGateAnswer: string;
  parentWeeklyProgress: string;
  parentCompletedConcepts: string;
  parentRevisionNeeds: string;
  parentFamilyReflections: string;
  parentDemoSettings: string;
  parentAdvanceDay: string;
  parentResetDemo: string;
  // Onboarding
  welcomeTitle: string;
  welcomeSubtitle: string;
  enterChildName: string;
  selectAgeBand: string;
  selectMadrasaStandard: string;
  weeklySessionsGoal: string;
  beginAdventure: string;
  demoModeNotice: string;
  familyPromptTitle: string;
}

export const translations: Record<Lang, TranslationDictionary> = {
  ml: {
    appName: "നൂർ ജേർണി",
    appTagline: "കുട്ടികൾക്കായുള്ള ഇസ്ലാമിക പഠനയാത്ര",
    appSub: "ചെറിയ മിഷനുകളിലൂടെ നല്ല ശീലങ്ങളും അറിവും സ്വന്തമാക്കാം",
    navJourney: "പഠനയാത്ര",
    navPractice: "പരിശീലനം",
    navCollection: "ശേഖരം",
    navParent: "രക്ഷാകർത്താവ്",
    start: "തുടങ്ങാം",
    continue: "തുടരാം",
    next: "മുന്നോട്ട്",
    back: "പിന്നോട്ട്",
    tryAgain: "വീണ്ടും ശ്രമിക്കാം",
    finish: "പൂർത്തിയായി",
    finishForToday: "ഇന്നത്തേക്ക് മതി",
    completed: "വിജയിച്ചു",
    locked: "പൂട്ടിയത്",
    comingSoon: "ഉടൻ വരുന്നു",
    available: "ലഭ്യമാണ്",
    level: "നിലവാരം",
    xp: "XP",
    xpEarned: "XP നേടി",
    dueRevisions: "റിവിഷൻ സമയം",
    weeklyGoal: "പ്രതിവാര ലക്ഷ്യം",
    minutes: "മിനിറ്റ്",
    concept: "ആശയം",
    objective: "പഠന ലക്ഷ്യം",
    listenAudio: "ശബ്ദം കേൾക്കാം",
    audioUnavailable: "ശബ്ദം തയ്യാറായിവരുന്നു",
    checkAnswer: "പരിശോധിക്കാം",
    correctAnswer: "ശരിയുത്തരം! മികച്ച ചിന്ത",
    needsReview: "ഒന്നുകൂടി ചിന്തിക്കാം",
    congratulations: "അഭിനന്ദനങ്ങൾ! മികച്ച വിജയം",
    worldTitle: "പഠന ലോകം",
    switchWorld: "ലോകം മാറ്റുക",
    filterSubject: "വിഷയം",
    allSubjects: "എല്ലാ വിഷയങ്ങളും",
    checkpointTitle: "അറിവുപരിശോധന",
    checkpointDesc: "പഠിച്ച കാര്യങ്ങൾ ഓർത്തെടുക്കാൻ 4 ചോദ്യങ്ങൾ",
    checkpointPass: "അഭിനന്ദനങ്ങൾ! നിങ്ങൾ മുന്നേറാൻ തയ്യാറാണ്",
    checkpointRetry: "സാരമില്ല, പ്രധാന ആശയങ്ങൾ വീണ്ടും നോക്കി ശ്രമിക്കാം",
    score: "സ്കോർ",
    practiceTitle: "പരിശീലനവും ഓർമ്മപ്പെടുത്തലും",
    practiceDesc: "പഠിച്ച കാര്യങ്ങൾ മറന്നുപോകാതിരിക്കാൻ സമയബന്ധിതമായി ഓർത്തെടുക്കാം",
    noRevisionsDue: "ഇന്ന് റിവിഷൻ ബാക്കിയില്ല! പുതിയ മിഷൻ ചെയ്യാം",
    revisionsDueCount: "റിവിഷനുകൾ ബാക്കിയുണ്ട്",
    masteryNotStarted: "തുടങ്ങിയിട്ടില്ല",
    masteryLearning: "പഠിച്ചുകൊണ്ടിരിക്കുന്നു",
    masteryReady: "റിവിഷന് തയ്യാറാണ്",
    masteryRetained: "ഓർമ്മയിൽ ഉറച്ചു",
    badgesTitle: "നേടിയ ബാഡ്ജുകൾ",
    avatarsTitle: "സുഹൃത്ത് അവതാറുകൾ",
    badgesEarned: "ബാഡ്ജുകൾ",
    selectAvatar: "അവതാർ തിരഞ്ഞെടുക്കുക",
    parentAreaTitle: "രക്ഷാകർത്താക്കളുടെ ഇടം",
    parentGateTitle: "മുതിർന്നവർക്കുള്ള പ്രവേശനം",
    parentGateDesc: "തുടരുന്നതിന് താഴെ പറയുന്ന കണക്കുകൂട്ടൽ പൂർത്തിയാക്കുക",
    parentGateAnswer: "ശരിയായ ഉത്തരം നൽകുക",
    parentWeeklyProgress: "പ്രതിവാര പഠനവിവരം",
    parentCompletedConcepts: "പഠിച്ചുറപ്പിച്ച ആശയങ്ങൾ",
    parentRevisionNeeds: "വീണ്ടും ശ്രദ്ധിക്കേണ്ടവ",
    parentFamilyReflections: "കുടുംബ ചർച്ചാ കുറിപ്പുകൾ",
    parentDemoSettings: "ഡെമോ നിയന്ത്രണങ്ങൾ",
    parentAdvanceDay: "ദിവസം മുന്നോട്ട് മാറ്റുക",
    parentResetDemo: "ഡെമോ വിവരങ്ങൾ പുതുക്കുക",
    welcomeTitle: "നൂർ ജേർണിയിലേക്ക് സ്വാഗതം!",
    welcomeSubtitle: "നന്മയും അറിവും നിറഞ്ഞ ലോകത്തേക്ക് നമുക്ക് ഒരുമിച്ച് യാത്ര തുടങ്ങാം.",
    enterChildName: "കുട്ടിയുടെ വിളിപ്പേര്",
    selectAgeBand: "പ്രായപരിധി",
    selectMadrasaStandard: "മുമ്പ് പഠിച്ച മദ്റസാ ക്ലാസ് (ഏകദേശം)",
    weeklySessionsGoal: "ആഴ്ചയിൽ എത്ര തവണ പഠിക്കണം?",
    beginAdventure: "യാത്ര ആരംഭിക്കാം",
    demoModeNotice: "ശ്രദ്ധിക്കുക: ഇതൊരു ഡെമോ പതിപ്പാണ്. പഠന ഉള്ളടക്കങ്ങൾ വിദ്യാഭ്യാസ വിദഗ്ദ്ധരുടെ പരിശോധനക്ക് വിധേയമാണ്.",
    familyPromptTitle: "കുടുംബത്തോടൊപ്പം ചെയ്യാം",
  },
  en: {
    appName: "Noor Journey",
    appTagline: "Islamic Learning Adventure for Children",
    appSub: "Build character, knowledge, and everyday values through short interactive missions",
    navJourney: "My Journey",
    navPractice: "Practice",
    navCollection: "My Collection",
    navParent: "Parent Area",
    start: "Start",
    continue: "Continue",
    next: "Next",
    back: "Back",
    tryAgain: "Try Again",
    finish: "Completed",
    finishForToday: "Finish for today",
    completed: "Passed",
    locked: "Locked",
    comingSoon: "Coming Soon",
    available: "Available",
    level: "Level",
    xp: "XP",
    xpEarned: "XP Earned",
    dueRevisions: "Revision Due",
    weeklyGoal: "Weekly Goal",
    minutes: "min",
    concept: "Concept",
    objective: "Learning Objective",
    listenAudio: "Listen Audio",
    audioUnavailable: "Reviewed audio coming soon",
    checkAnswer: "Check Answer",
    correctAnswer: "Correct! Well reasoned",
    needsReview: "Let's review this together",
    congratulations: "Congratulations! Mission Accomplished",
    worldTitle: "Learning World",
    switchWorld: "Switch World",
    filterSubject: "Subject",
    allSubjects: "All Subjects",
    checkpointTitle: "Checkpoint Check",
    checkpointDesc: "4 questions to check your understanding before advancing",
    checkpointPass: "Great job! You are ready to advance",
    checkpointRetry: "That's okay! Review the key ideas and try again",
    score: "Score",
    practiceTitle: "Spaced Practice & Retention",
    practiceDesc: "Revisit past missions at scheduled intervals so knowledge sticks",
    noRevisionsDue: "All caught up! No reviews due today. Try the next mission!",
    revisionsDueCount: "reviews due today",
    masteryNotStarted: "Not Started",
    masteryLearning: "Learning",
    masteryReady: "Ready to Review",
    masteryRetained: "Retained",
    badgesTitle: "Earned Badges",
    avatarsTitle: "Avatar Companions",
    badgesEarned: "Badges",
    selectAvatar: "Choose Avatar",
    parentAreaTitle: "Parent Dashboard",
    parentGateTitle: "Adult Verification",
    parentGateDesc: "Please solve this quick math puzzle to enter parent settings",
    parentGateAnswer: "Enter answer",
    parentWeeklyProgress: "Weekly Activity",
    parentCompletedConcepts: "Mastered Concepts",
    parentRevisionNeeds: "Concepts Needing Practice",
    parentFamilyReflections: "Family Discussion Notes",
    parentDemoSettings: "Demo Simulation Controls",
    parentAdvanceDay: "Advance Simulated Date",
    parentResetDemo: "Reset Demo State",
    welcomeTitle: "Welcome to Noor Journey!",
    welcomeSubtitle: "An inspiring illustrated adventure designed for children aged 9–12.",
    enterChildName: "Child's Nickname",
    selectAgeBand: "Age Band",
    selectMadrasaStandard: "Approximate Prior Madrasa Standard",
    weeklySessionsGoal: "Weekly Goal (Sessions / Week)",
    beginAdventure: "Begin Adventure",
    demoModeNotice: "Notice: This is a frontend demo with fictional scenarios awaiting final educator review.",
    familyPromptTitle: "Family Reflection Prompt",
  },
};

export const subjectNames: Record<string, { ml: string; en: string }> = {
  "taskiya-akhlaq": { ml: "തസ്കിയത്ത് & അഖ്ലാഖ്", en: "Taskiya & Akhlaq" },
  aqaid: { ml: "അഖാഇദ്", en: "Aqaid" },
  fiqh: { ml: "ഫിഖ്ഹ്", en: "Fiqh" },
  thariq: { ml: "താരീഖ്", en: "Thariq" },
  "quran-studies": { ml: "ഖുർആൻ പഠനം", en: "Quran Studies" },
  "language-script": { ml: "ഭാഷയും ലിപിയും", en: "Language & Script" },
  "nahv-saraf": { ml: "നഹ്വും സ്വറഫും", en: "Nahv & Saraf" },
};
