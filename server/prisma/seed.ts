import { PrismaClient, PublishState, ReviewStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Noor Journey database seed...");

  if (process.env.NODE_ENV === "production" && process.env.ENABLE_DEMO_CONTENT !== "true") {
    console.error("Refusing to seed demo fixtures in production environment.");
    process.exit(1);
  }

  // 1. Seed Curriculum Board & Edition (Draft mapping)
  const board = await prisma.curriculumBoard.upsert({
    where: { code: "SKIMVB" },
    update: {},
    create: {
      name: "Samastha Kerala Islam Matha Vidyabhyasa Board",
      code: "SKIMVB",
      website: "https://samastha.in",
    },
  });

  const edition = await prisma.curriculumEdition.upsert({
    where: { id: "edition-skimvb-2026" },
    update: {},
    create: {
      id: "edition-skimvb-2026",
      boardId: board.id,
      year: "2026",
      title: "SKIMVB Syllabus Baseline (Mapping Pending)",
    },
  });

  const subject = await prisma.curriculumSubject.upsert({
    where: { editionId_code: { editionId: edition.id, code: "taskiya-akhlaq" } },
    update: {},
    create: {
      editionId: edition.id,
      code: "taskiya-akhlaq",
      name: "Taskiya and Akhlaq",
    },
  });

  // 2. Seed Worlds
  const worldsData = [
    {
      slug: "akhlaq",
      titleMl: "അഖ്ലാഖും സ്വഭാവവും",
      titleEn: "Akhlaq and Character",
      blurbMl: "സത്യസന്ധത, ദയ, വാക്കുപാലിക്കൽ, ക്ഷമ, മാതാപിതാക്കളോടും കൂട്ടുകാരോടുമുള്ള മര്യാദകൾ.",
      blurbEn: "Story decisions about honesty, kindness, keeping promises, respect, and helping others.",
      playable: true,
      displayOrder: 1,
    },
    {
      slug: "foundations",
      titleMl: "ഇസ്ലാമിക അടിത്തറകൾ",
      titleEn: "Islamic Foundations",
      blurbMl: "അഖാഇദ്, അടിസ്ഥാന ആരാധനാ കർമ്മങ്ങൾ, ഖുർആൻ വായനാ മര്യാദകൾ.",
      blurbEn: "Guided concepts, core worship knowledge, and foundational Quran practice.",
      playable: false,
      displayOrder: 2,
    },
    {
      slug: "stories",
      titleMl: "ചരിത്രങ്ങളും പാഠങ്ങളും",
      titleEn: "Stories and Lessons",
      blurbMl: "പ്രവാചകന്മാരുടെയും സ്വഹാബികളുടെയും ചരിത്രത്തിൽ നിന്നുള്ള മാതൃകകൾ.",
      blurbEn: "Reviewed narrative episodes and reflections from Islamic history.",
      playable: false,
      displayOrder: 3,
    },
    {
      slug: "everyday",
      titleMl: "ദൈനംദിന ഇസ്ലാമിക ജീവിതം",
      titleEn: "Everyday Muslim Life",
      blurbMl: "ഭക്ഷണ മര്യാദകൾ, വീട്ടിൽ പ്രവേശിക്കുമ്പോഴുള്ള മര്യാദ, ശുചിത്വം, ദിക്റുകൾ.",
      blurbEn: "Practical sequencing, daily etiquettes, greetings, and mindful choices.",
      playable: false,
      displayOrder: 4,
    },
    {
      slug: "practice",
      titleMl: "ജീവിതത്തിലെ വിശ്വാസം",
      titleEn: "Faith in Practice",
      blurbMl: "പഠിച്ച കാര്യങ്ങൾ യഥാർത്ഥ സാഹചര്യങ്ങളിൽ പ്രയോഗിക്കലും കുടുംബ ദൗത്യങ്ങളും.",
      blurbEn: "Applying lessons to real challenges, family reflections, and community kindness.",
      playable: false,
      displayOrder: 5,
    },
  ];

  const worldMap = new Map<string, string>();
  for (const w of worldsData) {
    const world = await prisma.world.upsert({
      where: { slug: w.slug },
      update: w,
      create: w,
    });
    worldMap.set(w.slug, world.id);
  }

  // 3. Seed Chapter 1: Small Actions, Good Character
  const akhlaqWorldId = worldMap.get("akhlaq")!;
  const chapter = await prisma.learningChapter.upsert({
    where: { slug: "akhlaq-small-actions" },
    update: {
      worldId: akhlaqWorldId,
      titleMl: "ചെറിയ പ്രവൃത്തികൾ, നല്ല സ്വഭാവം",
      titleEn: "Small Actions, Good Character",
      descriptionMl: "ദൈനംദിന ജീവിതത്തിൽ സൗമ്യമായി സംസാരിക്കാനും, വാക്ക് പാലിക്കാനും, മറ്റുള്ളവരെ സഹായിക്കാനും പഠിക്കാം.",
      descriptionEn: "Learn to speak gently, keep promises, and respect others in everyday scenarios.",
      playable: true,
      displayOrder: 1,
    },
    create: {
      worldId: akhlaqWorldId,
      slug: "akhlaq-small-actions",
      titleMl: "ചെറിയ പ്രവൃത്തികൾ, നല്ല സ്വഭാവം",
      titleEn: "Small Actions, Good Character",
      descriptionMl: "ദൈനംദിന ജീവിതത്തിൽ സൗമ്യമായി സംസാരിക്കാനും, വാക്ക് പാലിക്കാനും, മറ്റുള്ളവരെ സഹായിക്കാനും പഠിക്കാം.",
      descriptionEn: "Learn to speak gently, keep promises, and respect others in everyday scenarios.",
      playable: true,
      displayOrder: 1,
    },
  });

  // Chapter Reward Badge
  await prisma.badgeDefinition.upsert({
    where: { slug: "badge-akhlaq-guardian" },
    update: { chapterId: chapter.id },
    create: {
      chapterId: chapter.id,
      slug: "badge-akhlaq-guardian",
      nameMl: "നന്മയുടെ കാവൽക്കാരൻ",
      nameEn: "Guardian of Good Character",
      descriptionMl: "നല്ല സ്വഭാവ പാഠങ്ങൾ വിജയകരമായി പൂർത്തിയാക്കിയതിന് ലഭിച്ച ബാഡ്ജ്",
      descriptionEn: "Milestone badge for completing all 5 missions in Chapter 1",
    },
  });

  // 4. Seed 5 Missions
  const missionsData = [
    {
      slug: "m1-kind-words",
      order: 1,
      titleMl: "നല്ല വാക്കുകൾ",
      titleEn: "Kind Words",
      conceptMl: "സൗമ്യമായ സംസാരം",
      conceptEn: "Speaking kindly",
      objectiveMl: "ദേഷ്യം വരുമ്പോഴും മറ്റുള്ളവരോട് മാന്യമായി സംസാരിക്കാൻ കുട്ടി പഠിക്കുന്നു.",
      objectiveEn: "The child practises speaking respectfully, even when upset.",
      minutes: 6,
      subjectId: "taskiya-akhlaq",
      teaching: {
        title: { ml: "വാക്കുകൾക്ക് ശക്തിയുണ്ട്", en: "Words have power" },
        body: [
          { ml: "നമ്മുടെ വാക്കുകൾ മറ്റൊരാളെ സന്തോഷിപ്പിക്കാം, വേദനിപ്പിക്കാം.", en: "Our words can make someone happy — or hurt them." },
          { ml: "ദേഷ്യം വന്നാൽ ഒന്നു നിർത്തി, ശ്വാസമെടുത്ത്, ശാന്തമായി പറയാം.", en: "When upset, pause, breathe, then speak calmly." },
          { ml: "കണ്ടുമുട്ടുമ്പോൾ സലാം പറയുന്നത് സൗഹൃദത്തിന്റെ തുടക്കമാണ്.", en: "Greeting with salam when we meet is a warm way to begin." },
        ],
        arabic: {
          text: "السَّلَامُ عَلَيْكُمْ",
          transliteration: { ml: "അസ്സലാമു അലൈക്കും", en: "As-salāmu ʿalaykum" },
          meaning: { ml: "നിങ്ങൾക്ക് സമാധാനമുണ്ടാകട്ടെ", en: "Peace be upon you" },
        },
      },
      activities: [
        {
          id: "m1a1",
          kind: "choice",
          prompt: { ml: "റിയയുടെ ചിത്രത്തിൽ സഹോദരൻ അബദ്ധത്തിൽ വെള്ളം തട്ടി. റിയ എന്ത് പറയണം?", en: "Riya's brother spills water on her drawing by accident. What should she say?" },
          choices: [
            { id: "m1a1-0", text: { ml: "“സാരമില്ല, അടുത്ത തവണ ശ്രദ്ധിക്കണേ.”", en: "“It's okay, please be careful next time.”" } },
            { id: "m1a1-1", text: { ml: "“നീ എല്ലാം നശിപ്പിക്കും!”", en: "“You ruin everything!”" } },
            { id: "m1a1-2", text: { ml: "ഒന്നും പറയാതെ തള്ളിമാറ്റുക.", en: "Push him away without a word." } },
          ],
          correctId: "m1a1-0",
          explainCorrect: { ml: "ശരി! ഇത് അബദ്ധമാണെന്ന് മനസ്സിലാക്കി, ശാന്തമായി കാര്യം പറഞ്ഞു.", en: "Right! She understood it was an accident and spoke calmly." },
          explainWrong: { ml: "മുറിവേൽപ്പിക്കുന്ന വാക്കുകൾ പ്രശ്നം വലുതാക്കും. ശാന്തമായ വാക്ക് നോക്കാം.", en: "Hurtful words make it worse. Look for the calm option." },
        },
        {
          id: "m1a2",
          kind: "match",
          prompt: { ml: "പരുഷമായ വാക്കിനെ മൃദുവായ വാക്കുമായി ചേർക്കൂ", en: "Match each harsh phrase with a kinder way to say it" },
          pairs: [
            { id: "p1", left: { ml: "“മാറി നിൽക്ക്!”", en: "“Move!”" }, right: { ml: "“ഒന്ന് വഴി തരാമോ?”", en: "“Could you let me pass, please?”" } },
            { id: "p2", left: { ml: "“ഇത് എനിക്ക് താ!”", en: "“Give me that!”" }, right: { ml: "“എനിക്കൊന്ന് തരാമോ?”", en: "“May I have it, please?”" } },
          ],
          explainCorrect: { ml: "മികച്ചത്! അതേ കാര്യം, പക്ഷേ ബഹുമാനത്തോടെ.", en: "Great! Same message, said with respect." },
          explainWrong: { ml: "ചില ജോഡികൾ മാറിപ്പോയി. വീണ്ടും നോക്കൂ.", en: "Check which phrases match politely." },
        },
        {
          id: "m1a3",
          kind: "sequence",
          prompt: { ml: "ദേഷ്യം വരുമ്പോൾ ചെയ്യേണ്ട ക്രമം ഒരുക്കൂ", en: "Put the steps for handling anger in order" },
          steps: [
            { id: "s1", text: { ml: "ഒന്ന് നിർത്തുക", en: "Pause" } },
            { id: "s2", text: { ml: "ആഴത്തിൽ ശ്വാസമെടുക്കുക", en: "Take a deep breath" } },
            { id: "s3", text: { ml: "ശാന്തമായി സംസാരിക്കുക", en: "Speak calmly" } },
          ],
          explainCorrect: { ml: "ശരിയായ ക്രമം! ആദ്യം നിർത്തിയാൽ നല്ല വാക്കുകൾ കണ്ടെത്താൻ എളുപ്പം.", en: "Correct order! Pausing first helps find kind words." },
          explainWrong: { ml: "സംസാരിക്കുന്നതിന് മുമ്പ് നിർത്തി ശ്വാസമെടുക്കണം.", en: "Pause and breathe before speaking." },
        },
      ],
      checkpointPool: [
        {
          id: "m1c1",
          prompt: { ml: "കളിയിൽ തോറ്റപ്പോൾ എന്ത് പറയാം?", en: "You lost a game. What can you say?" },
          choices: [
            { id: "m1c1-0", text: { ml: "“നന്നായി കളിച്ചു!”", en: "“Well played!”" } },
            { id: "m1c1-1", text: { ml: "“ഇത് കള്ളക്കളിയാണ്!”", en: "“You cheated!”" } },
          ],
          correctId: "m1c1-0",
          explainCorrect: { ml: "തോൽവിയിലും നല്ല വാക്ക് പറഞ്ഞു.", en: "Kind words even in defeat." },
          explainWrong: { ml: "മറ്റുള്ളവരെ കുറ്റപ്പെടുത്തുന്നത് വേദനിപ്പിക്കും.", en: "Blaming others hurts." },
        },
        {
          id: "m1c2",
          prompt: { ml: "കൂട്ടുകാരനെ കണ്ടുമുട്ടുമ്പോൾ ആദ്യം എന്ത് ചെയ്യാം?", en: "What do you do first when meeting a friend?" },
          choices: [
            { id: "m1c2-0", text: { ml: "സലാം പറയുക", en: "Greet with salam" } },
            { id: "m1c2-1", text: { ml: "മുഖം തിരിക്കുക", en: "Look away" } },
          ],
          correctId: "m1c2-0",
          explainCorrect: { ml: "സലാം സൗഹൃദം തുടങ്ങുന്നു.", en: "A warm greeting starts things well." },
          explainWrong: { ml: "സ്നേഹത്തോടെയുള്ള അഭിവാദ്യമാണ് നല്ല തുടക്കം.", en: "Look for the kind greeting." },
        },
        {
          id: "m1c3",
          prompt: { ml: "ദേഷ്യം വരുമ്പോൾ ആദ്യപടി?", en: "First step when feeling angry?" },
          choices: [
            { id: "m1c3-0", text: { ml: "ഒന്ന് നിർത്തുക", en: "Pause" } },
            { id: "m1c3-1", text: { ml: "ഉറക്കെ വിളിച്ചുകൂവുക", en: "Shout loudly" } },
          ],
          correctId: "m1c3-0",
          explainCorrect: { ml: "നിർത്തുന്നത് ചിന്തിക്കാൻ സമയം തരുന്നു.", en: "Pausing gives you time to think." },
          explainWrong: { ml: "ആദ്യം നിർത്താം, പിന്നെ സംസാരിക്കാം.", en: "Pause first, then speak." },
        },
        {
          id: "m1c4",
          prompt: { ml: "ആരെങ്കിലും സഹായിച്ചാൽ എന്ത് പറയണം?", en: "When someone helps you, what do you say?" },
          choices: [
            { id: "m1c4-0", text: { ml: "“നന്ദി” പറയുക", en: "Say “thank you”" } },
            { id: "m1c4-1", text: { ml: "ഒന്നും പറയാതിരിക്കുക", en: "Say nothing" } },
          ],
          correctId: "m1c4-0",
          explainCorrect: { ml: "നന്ദി പറയുന്നത് സന്തോഷം നൽകും.", en: "Thanks makes people feel valued." },
          explainWrong: { ml: "ചെറിയ “നന്ദി”ക്ക് വലിയ വിലയുണ്ട്.", en: "A small “thank you” matters." },
        },
      ],
      revision: [
        {
          id: "m1r1",
          prompt: { ml: "ബസ്സിൽ സീറ്റ് വേണം. എങ്ങനെ ചോദിക്കാം?", en: "You need to pass in a crowded bus. How?" },
          choices: [
            { id: "m1r1-0", text: { ml: "“ഒന്ന് മാറിത്തരാമോ, പ്ലീസ്?”", en: "“Excuse me, may I pass?”" } },
            { id: "m1r1-1", text: { ml: "തള്ളിക്കയറുക", en: "Push through" } },
          ],
          correctId: "m1r1-0",
          explainCorrect: { ml: "മര്യാദയുള്ള വാക്കുകൾ!", en: "Polite words!" },
          explainWrong: { ml: "തള്ളലും അലറലും മറ്റുള്ളവരെ വിഷമിപ്പിക്കും.", en: "Pushing upsets others." },
        },
      ],
      family: {
        ml: "ഇന്ന് വീട്ടിൽ ആരോടെങ്കിലും ഒരു നല്ല വാക്ക് പറയൂ. അവർക്ക് എങ്ങനെ തോന്നി എന്ന് ഒരുമിച്ച് സംസാരിക്കൂ.",
        en: "Say one kind sentence to someone at home today. Talk together about how it felt.",
      },
    },
    {
      slug: "m2-promise",
      order: 2,
      titleMl: "വാക്ക് പാലിക്കൽ",
      titleEn: "Keeping a Promise",
      conceptMl: "വാക്ക് പാലിക്കൽ",
      conceptEn: "Keeping promises",
      objectiveMl: "നൽകിയ വാക്ക് പാലിക്കാനുള്ള ഉത്തരവാദിത്തം കുട്ടി മനസ്സിലാക്കുന്നു.",
      objectiveEn: "The child learns the value and trust in fulfilling commitments.",
      minutes: 6,
      subjectId: "taskiya-akhlaq",
      teaching: {
        title: { ml: "വാക്ക് ഒരു വിശ്വസ്തതയാണ്", en: "A promise is trust" },
        body: [
          { ml: "ഒരു കാര്യം ചെയ്യാമെന്ന് പറഞ്ഞാൽ അത് പൂർത്തിയാക്കാൻ പരമാവധി ശ്രമിക്കണം.", en: "When you promise something, try your best to follow through." },
          { ml: "പറ്റാത്ത കാര്യങ്ങൾ വാക്ക് കൊടുക്കാതിരിക്കാൻ ശ്രദ്ധിക്കുക.", en: "Avoid promising things you cannot reasonably do." },
        ],
      },
      activities: [],
      checkpointPool: [
        {
          id: "m2c1",
          prompt: { ml: "കൂട്ടുകാരന് 5 മണിക്ക് കളിക്കാൻ വരാമെന്ന് പറഞ്ഞു. നിങ്ങൾ?", en: "You promised a friend to meet at 5 PM. You…" },
          choices: [
            { id: "m2c1-0", text: { ml: "സമയത്തിന് എത്തുക", en: "Arrive on time" } },
            { id: "m2c1-1", text: { ml: "മറന്നുപോയി വേറെ കളി കളിക്കുക", en: "Forget and play elsewhere" } },
          ],
          correctId: "m2c1-0",
          explainCorrect: { ml: "വാക്ക് പാലിച്ചു!", en: "You kept your word!" },
          explainWrong: { ml: "നൽകിയ വാക്ക് ഓർക്കുക.", en: "Remember your promises." },
        },
        {
          id: "m2c2",
          prompt: { ml: "പറ്റാത്ത കാര്യമാണെങ്കിൽ എന്ത് ചെയ്യണം?", en: "What if you cannot do what is asked?" },
          choices: [
            { id: "m2c2-0", text: { ml: "മാന്യമായി ‘പറ്റില്ല’ എന്ന് പറയുക", en: "Honestly say you cannot" } },
            { id: "m2c2-1", text: { ml: "കള്ള വാക്ക് കൊടുക്കുക", en: "Make a fake promise" } },
          ],
          correctId: "m2c2-0",
          explainCorrect: { ml: "സത്യസന്ധതയാണ് പ്രധാനം.", en: "Honesty comes first." },
          explainWrong: { ml: "കള്ളവാക്ക് വിശ്വാസം തകർക്കും.", en: "False promises break trust." },
        },
        {
          id: "m2c3",
          prompt: { ml: "അബദ്ധത്തിൽ വാക്ക് പാലിക്കാൻ കഴിഞ്ഞില്ലെങ്കിൽ?", en: "If an emergency broke your promise?" },
          choices: [
            { id: "m2c3-0", text: { ml: "ക്ഷമ ചോദിച്ച് കാരണം പറയുക", en: "Apologize and explain" } },
            { id: "m2c3-1", text: { ml: "കൂട്ടുകാരനോട് ദേഷ്യപ്പെടുക", en: "Snap at your friend" } },
          ],
          correctId: "m2c3-0",
          explainCorrect: { ml: "ക്ഷമ ചോദിക്കുന്നത് നല്ല ശീലമാണ്.", en: "Apologizing respectfully is noble." },
          explainWrong: { ml: "ദേഷ്യപ്പെടരുത്.", en: "Don't snap." },
        },
        {
          id: "m2c4",
          prompt: { ml: "വാക്ക് പാലിക്കുന്നവരെ എല്ലാവരും?", en: "People who keep promises are…" },
          choices: [
            { id: "m2c4-0", text: { ml: "വിശ്വസിക്കുന്നു", en: "Trusted" } },
            { id: "m2c4-1", text: { ml: "കളിയാക്കുന്നു", en: "Mocked" } },
          ],
          correctId: "m2c4-0",
          explainCorrect: { ml: "വിശ്വാസ്യതയാണ് ഏറ്റവും വലിയ സമ്പത്ത്.", en: "Trust is the greatest wealth." },
          explainWrong: { ml: "വിശ്വസ്തതയെ എല്ലാവരും ബഹുമാനിക്കുന്നു.", en: "Trust is respected." },
        },
      ],
      revision: [],
      family: {
        ml: "കുടുംബത്തിൽ നൽകിയ ഒരു വാഗ്ദാനം ഇന്ന് പൂർത്തിയാക്കൂ.",
        en: "Fulfill one family commitment today.",
      },
    },
    {
      slug: "m3-borrow",
      order: 3,
      titleMl: "കടം വാങ്ങിയവ നൽകൽ",
      titleEn: "Returning Belongings",
      conceptMl: "അമാനത്ത് സംരക്ഷണം",
      conceptEn: "Returning borrowed items",
      objectiveMl: "മറ്റുള്ളവരുടെ സാധനങ്ങൾ സൂക്ഷ്മതയോടെ ഉപയോഗിച്ച് തിരികെ നൽകാൻ കുട്ടി പഠിക്കുന്നു.",
      objectiveEn: "The child learns care and responsibility for borrowed belongings.",
      minutes: 6,
      subjectId: "taskiya-akhlaq",
      teaching: {
        title: { ml: "അമാനത്ത് സംരക്ഷിക്കാം", en: "Trust with belongings" },
        body: [
          { ml: "കടം വാങ്ങിയ പുസ്തകമോ കളിക്കോപ്പോ സൂക്ഷിച്ചുപയോഗിച്ച് ഉടനെ തിരികെ നൽകണം.", en: "Take good care of borrowed items and return them promptly." },
        ],
      },
      activities: [],
      checkpointPool: [
        {
          id: "m3c1",
          prompt: { ml: "കൂട്ടുകാരന്റെ പുസ്തകം വായിച്ചു കഴിഞ്ഞു. നിങ്ങൾ?", en: "You finished reading a borrowed book. You…" },
          choices: [
            { id: "m3c1-0", text: { ml: "ഉടനെ നന്ദിയോടെ തിരികെ നൽകുക", en: "Return it promptly with thanks" } },
            { id: "m3c1-1", text: { ml: "സ്വന്തം വീട്ടിൽ സൂക്ഷിക്കുക", en: "Keep it as your own" } },
          ],
          correctId: "m3c1-0",
          explainCorrect: { ml: "ശരിയുത്തരം!", en: "Correct!" },
          explainWrong: { ml: "മറ്റുള്ളവരുടെ വസ്തുക്കൾ തിരികെ നൽകണം.", en: "Return others' belongings." },
        },
        {
          id: "m3c2",
          prompt: { ml: "കടം വാങ്ങിയ പേന നഷ്ടപ്പെട്ടാൽ?", en: "If you lost a borrowed pen?" },
          choices: [
            { id: "m3c2-0", text: { ml: "കാര്യം പറഞ്ഞ് പുതിയത് വാങ്ങി നൽകുക", en: "Explain and replace it" } },
            { id: "m3c2-1", text: { ml: "അറിയില്ലെന്ന് പറയുക", en: "Pretend you know nothing" } },
          ],
          correctId: "m3c2-0",
          explainCorrect: { ml: "ഉത്തരവാദിത്തമുള്ള പെരുമാറ്റം!", en: "Responsible choice!" },
          explainWrong: { ml: "സത്യസന്ധത കാണിക്കുക.", en: "Show honesty." },
        },
        {
          id: "m3c3",
          prompt: { ml: "മറ്റൊരാളുടെ സാധനം എടുക്കുന്നതിന് മുമ്പ്?", en: "Before taking someone's item?" },
          choices: [
            { id: "m3c3-0", text: { ml: "അനുവാദം ചോദിക്കുക", en: "Ask permission" } },
            { id: "m3c3-1", text: { ml: "ചോദിക്കാതെ എടുക്കുക", en: "Take without asking" } },
          ],
          correctId: "m3c3-0",
          explainCorrect: { ml: "അനുവാദം മര്യാദയാണ്.", en: "Permission is manners." },
          explainWrong: { ml: "ചോദിക്കാതെ എടുക്കരുത്.", en: "Don't take without asking." },
        },
        {
          id: "m3c4",
          prompt: { ml: "കടം വാങ്ങിയ കളിക്കോപ്പ് കേടുവരുത്താതെ?", en: "Handle borrowed toys…" },
          choices: [
            { id: "m3c4-0", text: { ml: "സൂക്ഷ്മതയോടെ ഉപയോഗിക്കുക", en: "With great care" } },
            { id: "m3c4-1", text: { ml: "വലിച്ചെറിയുക", en: "Throw them around" } },
          ],
          correctId: "m3c4-0",
          explainCorrect: { ml: "സൂക്ഷ്മത അമാനത്താണ്.", en: "Care is a sacred trust." },
          explainWrong: { ml: "ശ്രദ്ധയോടെ കൈകാര്യം ചെയ്യുക.", en: "Handle carefully." },
        },
      ],
      revision: [],
      family: {
        ml: "വീട്ടിൽ ആരോടെങ്കിലും എടുത്ത സാധനങ്ങൾ ഉണ്ടെങ്കിൽ ഇന്ന് തിരികെ നൽകൂ.",
        en: "Return any borrowed household items today.",
      },
    },
    {
      slug: "m4-home",
      order: 4,
      titleMl: "വീട്ടിൽ സഹായിക്കൽ",
      titleEn: "Helping at Home",
      conceptMl: "സഹായമനസ്ഥിതി",
      conceptEn: "Helping at home",
      objectiveMl: "വീട്ടുജോലികളിൽ മാതാപിതാക്കളെ സഹായിക്കുന്നതിന്റെ മൂല്യം കുട്ടി തിരിച്ചറിയുന്നു.",
      objectiveEn: "The child realizes the reward and joy of helping parents cheerfully.",
      minutes: 6,
      subjectId: "taskiya-akhlaq",
      teaching: {
        title: { ml: "കുടുംബത്തിന് ഒരു താങ്ങ്", en: "Support your family" },
        body: [
          { ml: "വീട്ടിലെ ചെറിയ ജോലികളിൽ സഹായിക്കുന്നത് പുണ്യവും സ്നേഹവുമാണ്.", en: "Helping at home with small chores brings joy and love." },
        ],
      },
      activities: [],
      checkpointPool: [
        {
          id: "m4c1",
          prompt: { ml: "ഭക്ഷണം കഴിച്ച ശേഷം പാത്രം എന്ത് ചെയ്യാം?", en: "After eating, what do you do with your plate?" },
          choices: [
            { id: "m4c1-0", text: { ml: "കഴുകാൻ സിങ്കിൽ കൊണ്ടുപോയി വെക്കുക", en: "Carry it to the sink" } },
            { id: "m4c1-1", text: { ml: "അവിടെത്തന്നെ ഇട്ടിട്ട് പോവുക", en: "Leave it on the table" } },
          ],
          correctId: "m4c1-0",
          explainCorrect: { ml: "നല്ല ശീലം!", en: "Good habit!" },
          explainWrong: { ml: "സ്വന്തം പാത്രം മാറ്റുന്നത് എളുപ്പമുള്ള സഹായമാണ്.", en: "Clear your own plate." },
        },
        {
          id: "m4c2",
          prompt: { ml: "അമ്മ ജോലികഴിഞ്ഞ് ക്ഷീണിച്ച് വന്നപ്പോൾ?", en: "When mother arrives home tired?" },
          choices: [
            { id: "m4c2-0", text: { ml: "ഒരു ഗ്ലാസ്സ് വെള്ളം കൊടുക്കുക", en: "Offer a glass of water" } },
            { id: "m4c2-1", text: { ml: "വാശിപിടിച്ച് ബഹളമുണ്ടാക്കുക", en: "Throw a tantrum" } },
          ],
          correctId: "m4c2-0",
          explainCorrect: { ml: "കാരുണ്യവും സ്നേഹവും!", en: "Kindness and care!" },
          explainWrong: { ml: "മാതാപിതാക്കളുടെ ക്ഷീണം മനസ്സിലാക്കുക.", en: "Care for tired parents." },
        },
        {
          id: "m4c3",
          prompt: { ml: "കളിച്ചു കഴിഞ്ഞാൽ കളിക്കോപ്പുകൾ?", en: "After playing, put your toys…" },
          choices: [
            { id: "m4c3-0", text: { ml: "യഥാസ്ഥാനത്ത് ഒതുക്കിവെക്കുക", en: "Back in their place" } },
            { id: "m4c3-1", text: { ml: "തറയിൽ വിതറിയിടുക", en: "Scattered on the floor" } },
          ],
          correctId: "m4c3-0",
          explainCorrect: { ml: "ശുചിത്വവും ക്രമവും!", en: "Cleanliness and order!" },
          explainWrong: { ml: "തറയിൽ കിടന്നാൽ മറ്റുള്ളവർ തട്ടി വീഴാം.", en: "Toys on floor can trip others." },
        },
        {
          id: "m4c4",
          prompt: { ml: "ചെറിയ ജോലികൾ സ്വയം ചെയ്യുന്നത്?", en: "Doing small chores yourself makes you…" },
          choices: [
            { id: "m4c4-0", text: { ml: "ഉത്തരവാദിത്തമുള്ള കുട്ടിയാക്കുന്നു", en: "Responsible" } },
            { id: "m4c4-1", text: { ml: "മോശക്കാരനാക്കുന്നു", en: "Worse" } },
          ],
          correctId: "m4c4-0",
          explainCorrect: { ml: "തീർച്ചയായും!", en: "Indeed!" },
          explainWrong: { ml: "സഹായം മഹത്തായ ഗുണമാണ്.", en: "Helpfulness is a virtue." },
        },
      ],
      revision: [],
      family: {
        ml: "ഇന്ന് വീട്ടിൽ ഒരു ചെറിയ ജോലി മാതാപിതാക്കളെ സഹായിക്കൂ.",
        en: "Help with one small chore at home today.",
      },
    },
    {
      slug: "m5-friendship",
      order: 5,
      titleMl: "നല്ല സൗഹൃദം",
      titleEn: "Respectful Friendship",
      conceptMl: "സൗഹൃദ മര്യാദ",
      conceptEn: "True friendship",
      objectiveMl: "സത്യസന്ധവും മാന്യവുമായ സൗഹൃദം കാത്തുസൂക്ഷിക്കാൻ കുട്ടി പഠിക്കുന്നു.",
      objectiveEn: "The child learns mutual respect, empathy, and forgiveness in friendship.",
      minutes: 6,
      subjectId: "taskiya-akhlaq",
      teaching: {
        title: { ml: "സൗഹൃദത്തിന്റെ സൗന്ദര്യം", en: "Beauty of friendship" },
        body: [
          { ml: "നല്ല കൂട്ടുകാരൻ സത്യം പറയും, വിഷമങ്ങളിൽ സഹായിക്കും, വഴക്കുണ്ടായാൽ ക്ഷമിക്കും.", en: "A true friend is honest, helps in sorrow, and forgives quickly." },
        ],
      },
      activities: [],
      checkpointPool: [
        {
          id: "m5c1",
          prompt: { ml: "നല്ല കൂട്ടുകാരൻ എങ്ങനെയായിരിക്കും?", en: "A good friend…" },
          choices: [
            { id: "m5c1-0", text: { ml: "കേൾക്കുകയും സഹായിക്കുകയും ചെയ്യുന്നു", en: "listens and helps" } },
            { id: "m5c1-1", text: { ml: "രഹസ്യങ്ങൾ എല്ലാവരോടും പറയുന്നു", en: "spreads secrets" } },
          ],
          correctId: "m5c1-0",
          explainCorrect: { ml: "കൃത്യം!", en: "Exactly!" },
          explainWrong: { ml: "സൗഹൃദത്തിൽ വിശ്വാസം പ്രധാനം.", en: "Trust is key in friendship." },
        },
        {
          id: "m5c2",
          prompt: { ml: "കൂട്ടുകാരനുമായി വഴക്കുണ്ടായാൽ?", en: "After a quarrel with a friend?" },
          choices: [
            { id: "m5c2-0", text: { ml: "ശാന്തമായി സംസാരിച്ച് രമ്യതയിലെത്തുക", en: "Calm down and make up" } },
            { id: "m5c2-1", text: { ml: "പ്രതികാരം ചെയ്യുക", en: "Seek revenge" } },
          ],
          correctId: "m5c2-0",
          explainCorrect: { ml: "ശാന്തതയിൽ തുടക്കം.", en: "Calm comes first." },
          explainWrong: { ml: "പ്രതികാരം വഴക്ക് കൂട്ടും.", en: "Revenge worsens quarrels." },
        },
        {
          id: "m5c3",
          prompt: { ml: "കൂട്ടുകാരൻ തെറ്റ് ചെയ്ത് ക്ഷമ ചോദിച്ചാൽ?", en: "When a friend apologizes for a mistake?" },
          choices: [
            { id: "m5c3-0", text: { ml: "ക്ഷമിച്ച് സൗഹൃദം തുടരുക", en: "Forgive and move forward" } },
            { id: "m5c3-1", text: { ml: "എപ്പോഴും കളിയാക്കുക", en: "Mock them forever" } },
          ],
          correctId: "m5c3-0",
          explainCorrect: { ml: "ക്ഷമ സൗഹൃദം കാക്കുന്നു.", en: "Forgiveness protects friendship." },
          explainWrong: { ml: "ക്ഷമിക്കുന്നത് പുതിയ തുടക്കമാണ്.", en: "Forgiving offers a fresh start." },
        },
        {
          id: "m5c4",
          prompt: { ml: "കൂട്ടുകാരന് വിഷമം വന്നാൽ?", en: "When a friend is sad?" },
          choices: [
            { id: "m5c4-0", text: { ml: "അടുത്തിരുന്ന് ആശ്വസിപ്പിക്കുക", en: "Sit with them and comfort" } },
            { id: "m5c4-1", text: { ml: "ചിരിക്കുക", en: "Laugh at them" } },
          ],
          correctId: "m5c4-0",
          explainCorrect: { ml: "കേൾക്കുന്നതാണ് വലിയ സഹായം.", en: "Listening is great support." },
          explainWrong: { ml: "സങ്കടത്തിൽ കൂടെ നിൽക്കാം.", en: "Stand by friends in sorrow." },
        },
      ],
      revision: [],
      family: {
        ml: "കുടുംബത്തിലെ എല്ലാവരും അവരുടെ ഒരു നല്ല കൂട്ടുകാരനെക്കുറിച്ച് പറയൂ.",
        en: "Share about one good friend in your family circle.",
      },
    },
  ];

  const missionIdMap = new Map<string, string>();

  for (const m of missionsData) {
    const mission = await prisma.mission.upsert({
      where: { slug: m.slug },
      update: {
        learningChapterId: chapter.id,
        order: m.order,
        titleMl: m.titleMl,
        titleEn: m.titleEn,
        conceptMl: m.conceptMl,
        conceptEn: m.conceptEn,
        objectiveMl: m.objectiveMl,
        objectiveEn: m.objectiveEn,
        minutes: m.minutes,
        subjectId: m.subjectId,
      },
      create: {
        learningChapterId: chapter.id,
        slug: m.slug,
        order: m.order,
        titleMl: m.titleMl,
        titleEn: m.titleEn,
        conceptMl: m.conceptMl,
        conceptEn: m.conceptEn,
        objectiveMl: m.objectiveMl,
        objectiveEn: m.objectiveEn,
        minutes: m.minutes,
        subjectId: m.subjectId,
      },
    });

    missionIdMap.set(m.slug, mission.id);

    // Create published version (Explicitly labelled DEMO_UNREVIEWED)
    await prisma.missionVersion.upsert({
      where: {
        missionId_versionString: {
          missionId: mission.id,
          versionString: "1.0.0-demo",
        },
      },
      update: {
        publishState: PublishState.PUBLISHED,
        reviewStatus: ReviewStatus.APPROVED,
        teachingJson: m.teaching,
        activitiesJson: m.activities,
        checkpointPoolJson: m.checkpointPool,
        revisionJson: m.revision,
        familyPromptMl: m.family.ml,
        familyPromptEn: m.family.en,
        supplementary: true,
      },
      create: {
        missionId: mission.id,
        versionString: "1.0.0-demo",
        publishState: PublishState.PUBLISHED,
        reviewStatus: ReviewStatus.APPROVED,
        teachingJson: m.teaching,
        activitiesJson: m.activities,
        checkpointPoolJson: m.checkpointPool,
        revisionJson: m.revision,
        familyPromptMl: m.family.ml,
        familyPromptEn: m.family.en,
        supplementary: true,
      },
    });
  }

  // 5. Connect Prerequisites
  // Mission 2 requires Mission 1
  const m1Id = missionIdMap.get("m1-kind-words")!;
  const m2Id = missionIdMap.get("m2-promise")!;
  const m3Id = missionIdMap.get("m3-borrow")!;
  const m4Id = missionIdMap.get("m4-home")!;
  const m5Id = missionIdMap.get("m5-friendship")!;

  const prereqs = [
    { missionId: m2Id, prerequisiteMissionId: m1Id },
    { missionId: m3Id, prerequisiteMissionId: m2Id },
    { missionId: m4Id, prerequisiteMissionId: m3Id },
    { missionId: m5Id, prerequisiteMissionId: m4Id },
  ];

  for (const p of prereqs) {
    await prisma.missionPrerequisite.upsert({
      where: {
        missionId_prerequisiteMissionId: {
          missionId: p.missionId,
          prerequisiteMissionId: p.prerequisiteMissionId,
        },
      },
      update: {},
      create: p,
    });
  }

  console.log("Database seeded successfully with 5 worlds, Chapter 1, and 5 missions!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
