Build a complete, interactive, mobile-first frontend for a child-focused Islamic learning platform.

Working product name: **Noor Journey**. Keep the name configurable.

This is a gamified learning adventure for Muslim children in Kerala, especially ages 9–12 who attend madrasa irregularly or have stopped attending. It helps them continue structured Islamic learning through short missions, interactive activities, revision and optional family tasks.

Our intended curriculum foundation is Samastha Kerala Islam Matha Vidyabhyasa Board, abbreviated SKIMVB. Exact textbook and chapter mapping will be provided separately.

Build the working frontend now. Do not stop at a plan, landing page, or static dashboard.

## 1 Framework and implementation scope

The eventual target is Next.js App Router with TypeScript.

If this Lovable environment cannot generate Next.js, use its supported React and TypeScript framework. Clearly identify the actual framework in the README. Do not pretend the generated project is Next.js.

Make later migration straightforward:

- Keep learning components independent of the router.
- Isolate navigation and persistence behind small adapters.
- Separate types, content fixtures, business rules, UI components and pages.
- Use Tailwind CSS, reusable accessible primitives and Lucide icons.
- Customize components so the interface has its own visual identity.
- Keep all content outside page components.
- Avoid unnecessary dependencies.

This phase is frontend only.

Use a typed mock service with local persistence. Do not connect a database, Supabase, paid service, real authentication or an AI API. Do not require secrets to run.

All demonstrated accounts, review statuses and curriculum mappings must be clearly identified as demo data in the adult area and README.

## 2 Product identity

The experience should feel like entering a welcoming illustrated learning world.

Design for children aged 9–12, not toddlers. Make it playful, thoughtful and easy to understand.

The product should offer:

- A clear next mission.
- A visible learning journey.
- Short interactive lessons.
- Helpful feedback after mistakes.
- Learning levels and mastery.
- XP and collectible chapter badges.
- Scheduled revision.
- Optional family activities.
- A parent view of learning progress.

Use the short-session and visible-progression ideas of Duolingo, but create an original interface, mascot and visual system.

## 3 Child-optimized visual design

Use a cohesive illustrated “garden of learning” direction:

- Warm ivory background.
- Deep teal for primary actions.
- Leaf green for progress.
- Golden yellow for rewards.
- Coral and sky blue as occasional accents.
- Dark readable text.
- Rounded cards and generous spacing.
- Tactile buttons with subtle depth.
- Small, purposeful decorative details.

Check text contrast instead of assuming pastel combinations are accessible.

Create a friendly original lantern companion using local SVG or CSS. Give it a small set of expressions for welcome, encouragement and completion.

The companion must support learning without dominating the screen. Do not put every instruction inside a mascot speech bubble.

Use lightweight original illustrations of gardens, books, paths, homes and everyday objects. Do not depend on hotlinked stock images, emoji illustrations or external image URLs.

Do not depict prophets. Historical content can use maps, architecture, objects and typography.

Avoid:

- Corporate dashboard styling.
- Generic purple gradients.
- Glassmorphism.
- Excessive cards inside cards.
- Dense tables in the child interface.
- Tiny controls.
- Constant confetti.
- Preschool-style baby language.
- Visual clutter and decorative Arabic that is difficult to read.

## 4 Mobile-first layout

Design first for 360–430px-wide phones.

Requirements:

- No horizontal overflow at 360px.
- Main touch targets at least 48px.
- Comfortable thumb access.
- A bottom navigation bar with Journey, Practice and Collection.
- Account avatar and parent access in the header.
- Respect device safe-area insets.
- Fixed navigation must not obscure content.
- Lesson actions use a sticky bottom area with sufficient content padding.
- Support short phone screens and landscape orientation.
- Never require hover to discover information.
- Matching and sequencing support tapping, not only dragging.

On tablets and desktop, adapt deliberately:

- Use a compact navigation rail.
- Keep lessons in a readable centered column.
- Allow more space around the journey illustration.
- Do not stretch a phone interface across the entire monitor.

## 5 Language and accessibility

Malayalam is the primary child-interface language. Include an English toggle for demonstrations.

Use translation dictionaries rather than embedding text throughout components. Switching language must update the entire UI and persist the preference.

Suggested labels:

- Start: “തുടങ്ങാം”
- Continue: “തുടരാം”
- Journey: “പഠനയാത്ര”
- Practice: “പരിശീലനം”
- Collection: “എന്റെ ശേഖരം”
- Try again: “വീണ്ടും ശ്രമിക്കാം”

Use a legible Malayalam font such as Noto Sans Malayalam with reliable fallbacks. Use an appropriate Arabic font with proper diacritic support.

Arabic passages must use RTL direction independently of the surrounding Malayalam or English page.

Additional requirements:

- Keyboard operation and visible focus.
- Semantic headings.
- Accessible names for icon buttons.
- Dialog focus management.
- Feedback announced to screen readers.
- Feedback includes text and icons, not colour alone.
- Support reduced motion.
- Audio always has a text equivalent.
- No autoplay audio.
- Text enlargement must not clip content.
- Motion should be brief and purposeful.

Do not fabricate Quran verses, hadith, textbook quotations or religious audio. If approved audio is unavailable, show a truthful unavailable state with readable text.

## 6 Curriculum structure and worlds

Maintain two connected structures.

Curriculum structure:
Board → edition → standard → subject → chapter → learning objective.

Child structure:
World → chapter → mission → activity → checkpoint.

Create these five worlds:

1. **Akhlaq and Character**
   Honesty, kindness, keeping promises, patience, respect and helping others.

2. **Islamic Foundations**
   Aqaid, introductory worship knowledge and Quran learning.

3. **Stories and Lessons**
   Reviewed history and stories with reflection.

4. **Everyday Muslim Life**
   Cleanliness, etiquette, greetings, friendship and practical decisions.

5. **Faith in Practice**
   Applying knowledge to everyday situations and optional family activities.

Also represent these curriculum subjects in filters and metadata:

- Language and Script.
- Aqaid.
- Fiqh.
- Taskiya and Akhlaq.
- Thariq.
- Quran Studies.
- Nahv and Saraf.

Worlds are navigation themes, not invented official board subjects.

Keep syllabus standard separate from age and game level.

Do not claim official board endorsement, display an unauthorized board logo, invent textbook page references or label unreviewed fixtures as approved curriculum.

For this frontend, use “Curriculum mapping pending” in the adult content details.

## 7 Screens and routes

Implement equivalent routes in the supported framework.

### Welcome

A concise illustrated introduction with:

- Product identity.
- “Begin learning” action.
- “Explore demo” action.
- Language selection.
- A brief parent explanation.

Keep this focused on entering the learning experience, not marketing sections.

### Parent setup and child onboarding

A short, step-by-step flow:

1. Demo parent setup.
2. Child nickname.
3. Age band.
4. Approximate previous madrasa standard, including “Not sure.”
5. Avatar selection.
6. Weekly goal: 2, 3 or 5 sessions.
7. Optional starting check.

Provide skip and back controls where appropriate.

Do not request the child’s full name, precise birth date, school, address, photograph or location.

The optional starting check should recommend a starting point. It must not publicly label the child weak or behind.

### Journey home

This is the main child home screen.

Show:

- Friendly greeting.
- Current world and chapter.
- One prominent “Continue your mission” action.
- An estimated session duration.
- Weekly goal progress.
- Revision availability.
- A vertical illustrated mission path.

Mission states:

- Completed.
- Available.
- Current.
- Locked by prerequisite.
- Coming soon.

Completed nodes show clear status. Locked nodes explain the prerequisite when selected. Coming-soon content must not pretend to be playable.

Provide a world selector and subject filter without overwhelming the main screen.

### Chapter overview

Show:

- Short chapter description.
- What the child will learn.
- Five mission nodes.
- Chapter reward.
- Progress.
- Main action for the next available mission.

### Mission player

A focused full-screen learning experience:

- Exit control.
- Activity progress.
- Short explanation or story.
- One interaction at a time.
- Sticky Check or Continue button.
- Optional audio controls.
- Clear answer feedback.

The primary action remains disabled until the required interaction is completed.

After checking an answer, lock that attempt’s answer selection and show the explanation before continuing.

Wrong answers must receive helpful feedback rather than a red-screen punishment.

### Checkpoint

Four questions, one at a time.

Passing requires at least three correct answers.

If the child does not pass:

- Explain the missed concepts.
- Offer supported practice.
- Provide an equivalent checkpoint.
- Permit unlimited retries.

Do not award completion XP before passing.

### Completion

Show:

- The concept learned.
- XP earned.
- Chapter progress.
- A brief optional celebration.
- Optional family activity.
- “Finish for today” and “Back to journey.”

Do not automatically start another lesson.

### Practice

Show:

- Due revision.
- Concepts currently being learned.
- Completed review status.
- A friendly empty state when nothing is due.

Revision uses different scenarios from the original mission.

### Collection

Show:

- Earned chapter badges.
- Locked badges with clear requirements.
- Cosmetic avatar items.
- A functioning avatar selection control.

Locked collectibles must not look earned.

### Parent area

A calmer interface with:

- Child profile selector.
- Weekly activity summary.
- Completed concepts.
- Concepts needing revision.
- Weekly-goal settings.
- Language and sound preferences.
- Optional family reflections.
- Demo reset.
- Demo child-profile deletion.

Protect entry with a clearly labelled demo adult gate. State that this gate is not production authentication.

Do not display a faith score, goodness score or worship ranking.

### Demo content preview

Provide a small adult-only content preview showing:

- World and subject.
- Learning objective.
- Mission version.
- Curriculum mapping status.
- Review status.
- Draft, published-demo and archived states.

Draft and archived missions must not appear in the child journey.

This is a frontend demonstration of publishing states, not a secure production CMS.

## 8 Fully playable demo chapter

Implement one complete chapter with five missions in Akhlaq and Character.

Suggested chapter: **Small Actions, Good Character**.

Missions:

1. Speaking kindly.
2. Keeping a promise.
3. Returning borrowed belongings.
4. Helping at home.
5. Respectful friendship.

Use fictional everyday scenarios appropriate to ages 9–12.

Each mission must include:

- One short teaching segment.
- Three practice activities.
- Explanations for correct and incorrect answers.
- A four-question checkpoint.
- An optional family reflection prompt.
- Separate revision questions.

Create genuine variations in scenarios. Do not duplicate the same question with different colours.

Use three reusable interaction types:

- Choose a response.
- Match pairs.
- Arrange steps.

Keep unsupported religious rulings and quotations out of the demo content. Clearly identify these as sample activities awaiting curriculum and educator review.

The other four worlds should have polished preview screens and truthful coming-soon states.

## 9 Gamification and learning rules

Implement these deterministic demo rules:

- First successful mission completion: 20 XP.
- Scheduled revision completed: 5 XP.
- Replaying a completed mission does not award completion XP again.
- The same scheduled review cannot award XP more than once.
- XP does not bypass prerequisites.
- The next mission unlocks only after passing the current mission.
- A chapter badge unlocks after all required missions and the chapter review.
- Game level reflects completed chapters, not religious worth or syllabus standard.

Mastery states:

- Not started.
- Learning.
- Ready to review.
- Retained.

Retained requires passing a later review.

Initial review intervals: 1, 3 and 7 days. Persist timestamps and compare them consistently.

Provide an adult demo control to advance the simulated date so revision can be demonstrated immediately. Do not expose time manipulation as a normal child feature.

Use flexible weekly goals. Missing a day does not erase progress or trigger shame.

Never use:

- Limited lives.
- Public leaderboards.
- Streak-loss threats.
- Random paid rewards.
- Points for prayer compliance.
- Points presented as divine reward.
- Compulsory family tasks that block progression.

## 10 Persistence and mock service

Create a typed mock service covering:

- Profiles.
- Published demo content.
- Mission attempts.
- Progression.
- Revision.
- XP transactions.
- Badges.
- Preferences.
- Parent summaries.

Persist only fictional demo data in localStorage.

Use a versioned storage key and validate saved data. Handle unavailable or corrupt storage gracefully.

Keep progress separate for each child profile. Persist activity position so a mission can resume after refresh.

Access localStorage only in the browser. Avoid server-rendering and hydration errors.

Use transaction identifiers to prevent duplicate XP when users double-click, reload completion screens or repeat submissions.

State in the README that frontend grading, role checks and reward accounting are demonstrations and must move to the backend before production.

Expose loading and error states through the service abstraction. Include an adult demo toggle for simulated network failure.

Do not show a success state if the mock service reports a failed save.

## 11 Component structure

Create reusable components such as:

- AppShell.
- ChildHeader.
- BottomNavigation.
- WorldSelector.
- JourneyPath.
- MissionNode.
- MissionIntro.
- ActivityRenderer.
- ChoiceActivity.
- MatchingActivity.
- SequencingActivity.
- AnswerFeedback.
- CheckpointPlayer.
- CompletionSummary.
- WeeklyGoal.
- ReviewCard.
- BadgeCard.
- AvatarPicker.
- ParentGate.
- ChildProfileSwitcher.
- AudioControl.
- EmptyState.
- ErrorState.

Use a typed activity union rather than many unrelated booleans.

Store progression, checkpoint and reward rules in separate modules.

All summary screens must derive their values from the same persisted state. Do not hardcode conflicting progress numbers.

## 12 Interaction and visual polish

Make buttons feel responsive with brief press states. Use restrained transitions for mission selection and completion.

Give every world its own accent and environment while preserving control placement and interaction patterns.

Make the path easy to scan and navigate without requiring precise taps on tiny decorative objects.

Avoid continuous decorative animation that distracts from reading.

All visible controls must either work or clearly state why they are unavailable.

Do not create fake notifications, decorative charts with random data or buttons that silently do nothing.

## 13 Verification

Before finishing, verify:

- No overflow at 360, 390, 768 and 1280px.
- Malayalam and Arabic render correctly.
- Bottom navigation and sticky actions do not cover content.
- A child can complete all five missions.
- Wrong answers show useful explanations.
- Failed checkpoints lead to supported retries.
- Mission prerequisites unlock correctly.
- XP is awarded once.
- Progress survives refresh.
- Switching profiles does not mix progress.
- Revision appears when the simulated date advances.
- Locked and coming-soon content behaves honestly.
- Draft content is absent from the child journey.
- Reduced-motion settings work.
- Core interactions work with keyboard controls.
- The production build passes.
- No broken asset URLs, missing routes or console errors remain.

Add meaningful tests for progression, checkpoint scoring and reward deduplication if the environment supports them.

## 14 Delivery

Deliver the functioning frontend and a concise README covering:

- Actual framework used.
- How to run and build.
- Routes and component organization.
- Demo-data limitations.
- Persistence behaviour.
- Future backend integration points.
- Curriculum review requirements.
- How components can be migrated into Next.js App Router.

Prioritize completing the playable learning loop before adding decorative screens.

The final result should feel like a carefully designed mobile learning product for children: welcoming, easy to navigate, enjoyable to use, and clear about what the child is learning.