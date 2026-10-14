# Children Islamic Learning Platform Product Requirements

Version 1.0 • 14 October 2026 • Team Pradhibasa

Status: proposed implementation baseline. Product name remains open.

## 1 Product decision

Build a Malayalam-first Islamic learning adventure for children, based on the intended Samastha Kerala Islam Matha Vidyabhyasa Board curriculum. Children learn through short missions, story decisions, practical exercises and revision. A visible journey, levels, XP and collectible rewards make progress understandable and inviting. Parents support learning; qualified educators control curriculum accuracy.

The product must connect knowledge with everyday decisions. Completing a video or collecting points is insufficient evidence of understanding. The platform complements madrasa education and supports children returning to learning; it does not claim to replace teachers or certify completion of the board curriculum.

## 2 Problem and assumptions

The team reports that some Muslim children in Kerala stop attending madrasa before completing their curriculum and subsequently lack structured, age-appropriate learning. The prevalence and causes have not yet been established. Time pressure, learning difficulty, access constraints and engagement are hypotheses to investigate, not confirmed explanations.

Validate the concept with at least five children, five parents and two teachers. Ask about attendance history, difficult topics, preferred language, device access, existing learning routines and willingness to use short missions. Observe children completing a prototype rather than relying only on stated enthusiasm.

## 3 Audience and outcomes

The initial design assumption is ages 9–12, with previous madrasa exposure and different knowledge levels. Age and syllabus standard are separate: an older child may need foundational lessons. Do not expose a public label such as behind or failed.

Primary outcomes are continued participation, understanding of reviewed curriculum objectives and retention after revision. Practical activities encourage reflection and family discussion. Improved character or religious commitment is a longer-term research question, not a metric inferred from XP.

Secondary users are parents or guardians, curriculum authors and religious reviewers. Teacher assignment and classroom management are later features.

## 4 Curriculum foundation and source status

The intended authority is SKIMVB, as specified by the team. The supplied source is https://samastha.in/syllabus.php, accessed on 14 October 2026. It describes broad curriculum areas but does not provide a complete current standard-by-standard chapter specification. The retrieved page title identifies Samastha Kerala Sunni Vidyabhyasa Board and the text also mentions IEBI. Confirm the correct board source, syllabus edition and textbook set before representing material as SKIMVB-aligned. This is a source-identity check, not a change to the team's intended authority.

Obtain the exact standards, book titles, editions, chapters and learning objectives for the first release. Confirm permitted use of textbook text, scans, illustrations and audio. Prefer original reviewed activities linked to syllabus objectives. Do not display board logos or imply board endorsement without authorization.

Maintain two connected structures:

- Curriculum: board → edition → standard → subject → book → chapter → objective.
- Child experience: world → chapter → mission → activity → checkpoint.

Every published mission must map to at least one curriculum objective. Modern applications such as digital responsibility may be supplementary; label them as reviewed extensions rather than exact textbook chapters. The following mapping is a proposed product organization, not an official board classification.

| Child world | Curriculum connection | Experience |
|---|---|---|
| Akhlaq and Character | Taskiya and Akhlaq | Story decisions about honesty, kindness, promises and respect |
| Islamic Foundations | Aqaid, introductory Fiqh and Quran studies | Guided concepts, matching and foundational practice |
| Stories and Lessons | Thariq and Taskiya | Reviewed narrative episodes and reflection |
| Everyday Muslim Life | Fiqh, Akhlaq and relevant language content | Practical sequencing, etiquette and daily scenarios |
| Faith in Practice | Application across subjects | New situations, reflection and optional family missions |

Language and Script, Quran Studies, and Nahv and Saraf must remain visible learning strands across the worlds. They must not disappear because they do not fit the five-world navigation. Provide a subject filter in the journey; introduce a dedicated language or Quran practice destination when the content library warrants it.

For Arabic learning use reviewed Naskh typography; for Quran passages use verified Uthmani text appropriate to the curriculum. Preserve diacritics and RTL order. Teach grammar through the relevant language lesson context. Preserve the intended Aqaid framework and explicitly identify the relevant Fiqh track when textbooks distinguish Shafi and Hanafi material. Never silently combine different rulings.

## 5 Core experience

The recurring loop is learn → try → receive an explanation → apply → revisit. Target session length is 5–8 minutes, subject to child testing. A session ends clearly and does not feed into endless play.

1. A parent creates a child profile with nickname, age band, language and approximate previous standard.
2. The child selects an avatar and completes an optional gentle starting check.
3. The app recommends a starting chapter. The parent can adjust it; placement is not a certificate of competence.
4. The journey highlights one next mission and a revision option.
5. The child sees or hears a short explanation, completes activities and receives explanatory feedback.
6. A checkpoint determines whether to advance or receive supported practice.
7. The app celebrates completion, saves progress and offers an optional offline activity.
8. Later sessions revisit objectives needing practice.

For the MVP, use a reviewed rule-based placement table. Do not claim AI personalization. Placement should affect recommendations, not permanently block other age-appropriate content.

## 6 Mission design

Each mission has an objective, prerequisites, estimated duration, teaching content, activities, feedback, checkpoint and source mapping. Launch with three reusable interaction types: choose a response, match items, and order steps. All drag interactions must have a tap-based alternative.

Example mission, subject to exact curriculum mapping and review: Keeping a promise. A fictional child promises to return a borrowed item. The learner selects a response, receives a reason, and applies the principle to a different situation. A later review checks the concept using a new example. A private family prompt suggests discussing a promise at home.

Avoid invented religious quotations, unsupported historical details and depictions of prophets. Establish illustration guidance with the religious reviewers before commissioning assets. Use settings, objects, maps, text and permitted characters to support historical storytelling.

Reading and listening practice may use human-reviewed audio. A completed listening activity does not establish correct recitation, memorization or tajweed. Label those skills as requiring teacher assessment until an appropriate human review workflow exists.

## 7 Progression and gamification rules

The following numbers are configurable starting defaults, not validated learning thresholds.

| Mechanic | Initial rule |
|---|---|
| Mission completion | Finish required activities and a four-question checkpoint with at least three correct answers |
| Supported retry | Explain missed concepts and offer an equivalent reviewed checkpoint; unlimited retries |
| Chapter completion | Complete required missions and the chapter review |
| XP | 20 for first mission completion and 5 for a scheduled review completed that day |
| Repeat rewards | No additional XP for repeatedly replaying the same completed mission that day |
| Learning levels | Follow curriculum prerequisites; XP never bypasses them |
| Mastery states | Not started, learning, ready to review, retained; retained requires passing a later review |
| Review schedule | Initial defaults at 1, 3 and 7 days after completion; missed reviews remain available |
| Weekly goal | Family selects 2, 3 or 5 sessions; missed days do not erase earned progress |
| Collectibles | Chapter badges and cosmetic avatar items; no paid rewards in the MVP |

The child's profile level may summarize completed chapters, but must be distinct from syllabus standard and skill mastery. Show explanations when a mission is locked. Practice remains available after unlocks. Wrong answers never remove lives, access or earned XP.

Award learning participation rather than religious worth. Do not score prayer observance, rank children's piety or translate XP into divine reward. Offline activities are optional private reflections, carry no competitive points and never block progression. No public leaderboard or streak-loss pressure.

Rewards should be earned through purposeful learning, with brief celebrations and a clear next action. Narrative chapter completion can reveal a new scene or collectible; it must not encourage excessive sessions.

## 8 Child interface requirements

Primary navigation is My Journey, Practice and My Collection. A subject filter provides access to curriculum strands. Parent settings sit behind an adult gate. The map is a progress visualization with predictable scrolling, not a complex navigational puzzle.

The home screen shows the current world, next mission, revision availability and weekly goal. Every activity screen has one primary action, replay audio, a visible progress indicator and an exit option. Completion shows what was learned, the reward and an explicit finish button.

Use a warm illustrated visual system with readable typography, restrained colour and consistent icons. Each world can have a distinct environment while controls remain consistent. Children aged 9–12 should not receive an interface designed exclusively for preschoolers.

Acceptance requirements:

- Touch targets are at least 44 by 44 CSS pixels; primary child controls target 48 pixels.
- Text and controls meet WCAG AA contrast targets; feedback never depends solely on colour.
- Malayalam and Arabic remain legible at enlarged text sizes without clipping or broken diacritics.
- Audio has replay controls and a text equivalent; essential instructions do not require sound.
- Reduced-motion preferences disable nonessential animation; avoid flashing effects.
- Keyboard and screen-reader users can operate tasks with meaningful labels.
- Mobile screens work from 360 CSS pixels wide; desktop layouts remain usable.
- Loading, retry, empty, unavailable-audio, locked-content and connection-loss states are designed.

The external image links supplied by the team are mood references only. They do not establish asset ownership or a final UI specification.

## 9 Parent and editorial experiences

Parents see completed objectives, revision needs, weekly activity and a suggested family conversation. Show learning evidence without presenting completion as evidence of moral behaviour. Allow multiple child profiles, private settings, goal adjustment and profile deletion. Adult authentication, not merely a visual gate, protects account and privacy changes.

The editorial flow is draft → curriculum mapping → religious and language review → published → archived. Only approved versions can appear to children. Authors cannot publish by bypassing reviewer authorization. Record reviewer identity, review date and reasons for changes. Substantive changes to objectives or answer keys require a new review and explicit handling of existing progress.

## 10 Functional requirements and acceptance

| ID | Priority | Requirement and acceptance |
|---|---|---|
| F01 | P0 | Adult account and child profiles; progress remains separate for every profile |
| F02 | P0 | Curriculum mapping; publication fails when required source or objective fields are missing |
| F03 | P0 | Journey map; completed, current and locked missions agree with saved prerequisites |
| F04 | P0 | Activity engine; all three task types support feedback, retry and accessible alternatives |
| F05 | P0 | Checkpoints; server validates scoring and unlocks, with no client-only authority |
| F06 | P0 | Persistence; resume at the last saved activity after reload or sign-in on another device |
| F07 | P0 | Rewards; repeated completion requests cannot duplicate XP or badges |
| F08 | P0 | Revision; due objectives appear with reviewed practice and update mastery correctly |
| F09 | P0 | Parent summary; reports topics and revision needs accurately for the selected child |
| F10 | P0 | Editorial tools; draft or archived missions are inaccessible to child accounts |
| F11 | P0 | Malayalam and Arabic support; verified rendering and replayable approved audio |
| F12 | P1 | Family reflection; optional, private, deletable and independent of unlock rules |
| F13 | P1 | Cosmetic collection; shows only earned items and permits avatar changes |
| F14 | P2 | Full offline lesson packages and synchronization conflict handling |
| F15 | P2 | Teacher assignments, human recitation review and additional languages |

P0 is mandatory for the pilot. P1 adds depth after the complete loop works. P2 is deferred.

## 11 First release scope

Build five worlds as the product structure, but publish one complete reviewed chapter of five missions first. Other worlds display transparent coming-soon states rather than fake completed content. Select the chapter only after confirming the relevant textbook and objectives. Do not invent a class number for sample lessons.

The MVP includes parent setup, placement, the mission engine, journey, checkpoints, revision, XP, a basic collection, parent summary and editorial review. A small seed library is acceptable if it passes the same approval workflow as later content.

Exclude full standards 1–10 coverage, live classes, open chat, public competition, textbook certification, payments, open-ended AI religious answers, automatic recitation grading and complex multiplayer gameplay. Future AI tools may assist authors with drafts; child-facing content still requires human review.

## 12 Data and implementation boundaries

Suggested entities are AdultAccount, ChildProfile, CurriculumEdition, Subject, BookChapter, LearningObjective, World, MissionVersion, Activity, Attempt, ObjectiveMastery, ReviewSchedule, RewardTransaction, BadgeAward, FamilyReflection and EditorialReview.

Mission metadata includes age band, standard, book and chapter reference, objective IDs, language, Fiqh track where relevant, prerequisites, approved audio, version, review status and supplementary-content flag. Attempts reference the exact mission version. Reward transactions have an idempotency key. Family reflections are stored separately from academic scores.

Expose versioned contracts for profile setup, published missions, attempt submission, progression, review queue, rewards and summaries. The backend owns authorization, grading, prerequisites and reward accounting. The frontend owns presentation and interaction, using shared schemas and reviewed fixtures during development. Choose the actual framework and database before implementation; this PRD does not assume a provider.

Do not mark an answer or mission as saved until the server acknowledges it. On connection loss preserve the current screen and offer retry; never duplicate rewards on resubmission. Full offline synchronization is deferred and must not be advertised in the MVP.

## 13 Quality and child privacy

Collect only adult account details and child information needed for learning. Use nicknames and age bands rather than requiring full child names, exact birth dates, school, location or photographs. No public profiles, direct messaging, advertising trackers, or photo proof of religious practice. Establish guardian authorization and a clear privacy notice before a real-child pilot; review applicable requirements before public launch.

Adults may only access children attached to their account. Editorial access requires a separate role. Use HTTPS, secure session handling, server validation, login and submission rate limits, and a tested backup and restore procedure. Keep credentials out of source control.

Proposed performance targets: usable first screen within three seconds on the agreed midrange Android device and throttled test network; normal activity transitions within 500 ms after assets load. Audio loads on demand and can be retried. Test the actual device and network assumptions before release.

## 14 Success measures

Pilot targets are provisional product gates, not scientific proof of effectiveness.

| Measure | Proposed target | Method |
|---|---|---|
| Usability | At least 4 of 5 children complete a mission with no more than one adult prompt | Observe moderated sessions |
| Activation | At least 70 percent of onboarded pilot learners complete one mission | Profile and first-completion events |
| Continued participation | At least 50 percent complete three sessions in week one | Distinct completed sessions |
| Retention of learning | At least 70 percent pass a new-scenario review after seven days | Reviewed equivalent questions, report sample size |
| Editorial integrity | All published missions have approved mapping and review | Publication audit |
| Progress integrity | No duplicated rewards or cross-profile access in release checks | Integration and authorization tests |

Track explanations viewed, supported retries and mastery changes to identify difficult content. Session duration alone is not a success metric. Report small pilot results descriptively; do not claim causation or that the app reduces dropout without a suitable longer-term study.

## 15 Delivery sequence and ownership

Stage 1: Confirm source identity, textbook edition, initial age band and five mission objectives. Establish a content review and visual policy. Finish the shared data contracts.

Stage 2: Implement one mission end to end, including persistence, feedback, checkpoint, reward and parent summary. Validate the interaction with children before copying it across lessons.

Stage 3: Add the remaining missions, journey, revision and editorial workflow. Test mobile accessibility, RTL, authorization, reward idempotency and connection recovery.

Stage 4: Run a small guardian-authorized pilot, fix observed issues and prepare the demo. Broader curriculum expansion follows content approval and pilot findings.

Suggested allocation for the existing three-person team: frontend developer owns child and parent UI; backend developer owns contracts, persistence, scoring and editorial authorization; organizer owns scope, textbook mapping, reviewer coordination and usability sessions. Qualified reviewers are an external dependency. All three agree on contracts before parallel implementation.

## 16 Release demonstration and completion criteria

Demonstrate setup, a visible learning journey, an intentionally incorrect answer with helpful feedback, supported retry, saved completion, one XP award, next-mission unlock, later review and the parent summary. Demonstrate that an unpublished mission cannot be opened.

The release is ready when the five missions are approved, the complete learning loop works on the agreed phones, accessibility and progress-integrity checks pass, and critical usability defects are resolved. Content authority and permissions must be clear for any material shown publicly.

## 17 Decisions still needed

Confirm the authoritative SKIMVB source and textbook edition; the exact first standard and chapter; whether the initial Fiqh track is Shafi only or includes separate Hanafi content; reviewer availability; permissions for source assets; product name; and the implementation stack. These dependencies do not prevent building a generic mission engine, but they do prevent making unsupported curriculum-alignment claims.

## Source note

The curriculum areas and broad script requirements are grounded in the team-supplied text and https://samastha.in/syllabus.php. The five-world mapping, mechanics, MVP scope, thresholds and targets are proposed product decisions. No complete textbook-level mapping or board endorsement has been established by this document.
