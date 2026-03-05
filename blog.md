# Rizen Blog Posts — Ready to Publish

*Owner: Alex | Last updated by: Alex, 2026-03-05*

---

## Blog Post 1

**Title:** Rizen Combat System: From Zero to Full Fight Loop in 5 Sessions
**Category:** Feature Spotlight
**Milestone:** v1.0 — Phases 0–4 Complete

**Summary:** Rizen's combat system went from an empty concept to a fully wired knowledge-based fight loop — complete with XP rewards, death penalties, weapon-specific questions, and a flee mechanic — across Sessions 22–27. Here's how we built it.

### Full Blog Content

Combat in Rizen isn't about reflexes. It's about what you *know*.

When you enter a fight, you face a monster — the Procrastination Specter, for example — and the only way to deal damage is to answer questions correctly. Get it right? Free hit. Get it wrong or let the 15-second timer expire? The monster hits *you* for 30 HP.

**Phase 0–1: The Foundation (Session 22)**
We started with the basics: HP fields in the player model, a `CombatService` that owns the fight loop as a `ChangeNotifier`, and a hardcoded question bank with 15 questions across three class tracks (Sec Analyst, Mobile Dev, Web Dev). The fight screen uses animated HP bars with `TweenAnimationBuilder` — the monster bar shrinks as you land hits, while yours changes color from green to yellow to red as you take damage.

**Phase 2: Real Consequences (Session 23)**
Winning feels good only when losing hurts. Victory awards XP routed to your class track. Defeat costs you `floor(currentXP × (0.05 + level × 0.005))` — a scaling penalty that stings more as you level up. And fleeing? You can run, but it costs a flat 50 XP. Oh, and once the monster drops below 25% HP, the FLEE button locks. You finish the fight.

**Phase 3: Flashcard System (Session 24)**
We replaced the hardcoded questions with a dynamic Supabase-backed flashcard system. Each weapon type has its own question bank — equip the Recon Blade and you'll face reconnaissance questions in combat. Two training modes let you prepare outside of fights: **Study** (reveal and self-grade) and **Repair** (timed quiz with recycling wrong answers until you get 3 right or exhaust 9 attempts).

**Phase 4: Weapon Pipeline (Session 26)**
The final piece: equipping a weapon actually *changes your combat experience*. The system fetches questions matching your equipped weapon from Supabase, falling back to the hardcoded bank only when needed. Your loadout isn't cosmetic — it defines what knowledge you're tested on.

**Why This Matters:**
Rizen's combat proves that gamification doesn't have to be shallow. Every fight is a study session in disguise. The weapon-question pipeline means your gear choices reflect what you're *learning*, not just what looks cool.

**Screenshots to Include:**
- Combat screen with monster HP bar, question card, and countdown timer
- Flee button in LOCKED state (red border, greyed out)
- Victory overlay showing +XP earned
- Flashcard Repair mode with progress bar
- Inventory screen showing STUDY/REPAIR buttons on weapons

---

## Blog Post 2

**Title:** The Neural Breach Theme: How Rizen Got Its Cyber-Noir Identity
**Category:** Dev Insight
**Milestone:** v1.0

**Summary:** Rizen's visual identity — Overclock Cyan, System Violet, Obsidian backgrounds — wasn't born from a template. It was designed collaboratively and implemented as a full Material3 theme system with dark/light toggle.

### Full Blog Content

Every productivity app looks the same. Clean whites, gentle blues, rounded cards. Rizen is an RPG. It should feel like one.

**The Palette: Neural Breach**
The dark theme is built around five core colors:
- **Overclock Cyan (`#00D2E0`)** — primary actions, XP bars, headers
- **System Violet (`#BC13FE`)** — secondary elements, accents
- **Logic Lime (`#39FF14`)** — success states, tertiary highlights
- **Obsidian (`#0D0D0F`)** — background, the void behind everything
- **Kernel Panic Red (`#FF3131`)** — errors, defeat, danger

**Typography as UI:**
Headers use **Orbitron** — a geometric, sci-fi typeface that immediately signals "this isn't a regular to-do app." Body text uses **Inter** for readability, and stats/numbers use **JetBrains Mono** to give data a terminal feel. Three fonts, three purposes.

**Dark/Light, Not Dark-Only:**
A global `ValueNotifier<ThemeMode>` drives the toggle — no packages, no boilerplate. The light theme inverts intelligently without losing the cyber-noir identity.

**Why This Matters:**
Theme isn't decoration. It's the first thing users feel when they open the app. Neural Breach says: *this is a game, you are a player, this matters.*

**Screenshots to Include:**
- Home screen in dark mode showing the full Neural Breach palette
- Light mode comparison
- Settings screen with theme toggle
- Profile screen showing Orbitron headers + JetBrains Mono stats

---

## Blog Post 3

**Title:** Achievements, Badges, and the Psychology of Progress
**Category:** Feature Spotlight
**Milestone:** v1.0 — Phase B Complete (Session 30)

**Summary:** Rizen now tracks 18 achievements across four categories — Consistency, Combat, Quests, and Knowledge — each with Rep rewards and unlockable titles. Here's how the badge system was designed and built.

### Full Blog Content

Leveling up is satisfying. But *recognition* of specific milestones is what builds long-term engagement.

**18 Achievements, 4 Categories:**

| Category | Achievements | What They Track |
|----------|-------------|-----------------|
| Consistency | First Step, The Consistent (7d), Unwavering (30d), The Relentless (100d), Ascendant (365d) | Daily streaks |
| Combat | First Blood, Monster Slayer (10 kills), Boss Killer, Raid Cleared, Perfect Fight | Monster kills, flawless rounds |
| Quests | Quest Taker, Grinder (50 complete), SSS Cleared | Quest completion milestones |
| Knowledge | Scholar, Librarian (10 items), Living Encyclopedia (25 items) | Shop knowledge purchases |

Plus two level milestones: **Rising Star** (Level 10) and **Veteran** (Level 25).

**How It Works Under the Hood:**
Every key action — quest completion, combat victory, check-in, item purchase — calls `_checkAndUnlockAchievements()` in GameService. The method evaluates all 18 conditions against the current player state. When an achievement unlocks, it awards Rep, fires a notification, and optionally grants a title.

**Featured Achievement:**
Your profile has a spotlight slot. Tap it to open a bottom sheet picker showing all unlocked badges. Locked badges appear as grey question marks — mystery drives curiosity.

**Why This Matters:**
Achievements bridge the gap between "I'm using an app" and "I'm building something." A 30-day streak badge isn't just a pixel — it's proof.

**Screenshots to Include:**
- Profile screen badge grid (mix of unlocked and locked "???")
- Featured achievement card on profile
- Achievement unlock notification
- Bottom sheet badge picker

---

## Blog Post 4

**Title:** Consumables, Buffs, and the Economy That Actually Works
**Category:** Feature Spotlight
**Milestone:** v1.0 — Session 28

**Summary:** Rizen's shop isn't cosmetic filler. Five consumable items — Health Potions, Shield Charges, Focus Boost, Double Rep, and XP Surge — create real strategic decisions with timed buffs, stacking rules, and quest-triggered effects.

### Full Blog Content

Most gamified apps give you points. Rizen gives you *choices*.

**The Five Active Consumables:**

| Item | Effect | Duration |
|------|--------|----------|
| Health Potion | +300 HP (capped at max) | Instant |
| Shield Charge | +1 streak shield (max 3) | Permanent until consumed |
| Focus Boost | 1.5× XP multiplier | 2 hours |
| Double Rep | 2× Rep multiplier | 1 hour |
| XP Surge | 2× XP on next quest only | Until used (7-day TTL) |

**The Design Decisions:**

*Stacking prevention:* You can't activate Focus Boost while one is already running. The ACTIVE badge replaces the USE button — no wasted items.

*XP Surge is unique:* It doesn't expire on a timer. It waits for your next quest completion, then consumes itself. But it does have a 7-day TTL to prevent permanent lock-in. This was a bug we caught in QA (QA-S28-001) — originally, a surge could live forever if you never completed a quest.

*Buff multipliers stack:* Focus Boost (1.5×) and XP Surge (2×) can be active simultaneously. `_awardXPAndRep()` applies both before the final XP calc. This creates a strategic window — activate both, then complete a quest for 3× XP.

*Check-in protection:* XP Surge only fires on quest completion and combat victory — not on daily check-ins. This prevents your surge from being wasted on a +50 XP check-in when you meant to save it for a 200 XP quest.

**Why This Matters:**
An economy without trade-offs is just a number going up. Consumables force players to *think* about timing, stacking, and when to spend Rep versus save it.

**Screenshots to Include:**
- Shop Consumables tab showing ACTIVE badge, quantity badges, and SOON items
- USE button flow
- Buff active indicator

---

## Blog Post 5

**Title:** How We Handle State Without Redux, Bloc, or Riverpod
**Category:** Dev Insight
**Milestone:** v1.0

**Summary:** Rizen's entire state architecture runs on Flutter's built-in ValueNotifier and a single GameService class. No third-party state management. Here's why — and what the rollback pattern looks like.

### Full Blog Content

When you start a Flutter project, the first question is always: "Which state management?"

For Rizen, the answer is: **none of them.**

**The Architecture:**

```
ValueNotifier<PlayerData>  ←→  GameService  ←→  SupabaseService
ValueNotifier<List<Quest>>      (mutations)      (persistence)
ValueNotifier<bool>
ValueNotifier<List<Notification>>
ValueNotifier<List<Quest>>
```

Five global notifiers hold all app state. Screens read them via `ValueListenableBuilder` — pure reactive rendering with no `setState` calls. All mutations go through `GameService`, which is the *only* thing that writes to notifiers.

**The Rollback Pattern:**

Every GameService method follows the same template:

1. **Snapshot** the current notifier value
2. **Mutate** the notifier optimistically
3. **Try** to persist to Supabase
4. **Catch** failure → restore the snapshot, log the error

This gives us optimistic UI updates (instant feedback) with server-side safety (no orphaned state). If Supabase is down, the UI snaps back to the pre-mutation state.

**Why Not Provider/Bloc/Riverpod?**

Rizen is single-player with one user. The state graph is flat — five notifiers, no nested dependencies, no computed selectors needed. Adding a state management package would mean: more boilerplate, more files, more abstraction for zero practical benefit.

`ValueNotifier` is 12 lines of Flutter source code. It does exactly what we need.

**Why This Matters:**
Simplicity isn't a compromise. It's a feature. Every line of state management code in Rizen does exactly one thing, and you can trace any mutation from button press to database write in under 60 seconds.

**Screenshots to Include:**
- Architecture diagram (text/ASCII is fine)
- GameService code showing the snapshot-rollback pattern

---

## Blog Post 6

**Title:** 32 Sessions, 3 Open Bugs: The Rizen QA Process
**Category:** Build Log
**Milestone:** v1.0

**Summary:** Rizen has been built across 32 documented sessions with a formal QA process, mandatory bug handoff rules, and 5 explicit triggers for audit passes. Here's how we keep quality tight on a solo dev project.

### Full Blog Content

Building alone doesn't mean shipping without quality. Rizen runs a QA process that would feel familiar in a professional team — because the "team" includes specialized AI agents.

**The Agent Team:**

| Agent | Role |
|-------|------|
| Alex | Writes all code. Owns PROGRESS.md and CHECKLIST.md |
| QA Agent | Formal audits. Owns QA_REPORT.md |
| Game-Dev-Mentor | Design review and architectural guidance |
| Aizzen | Personal discipline (doesn't touch code) |

**5 QA Triggers:**

QA runs automatically before any new feature when *any* of these are true:
1. Previous session had a `[Critical]` change
2. Previous session had 2+ `[Major]` changes
3. A new system was added (screen, service, or model)
4. 3+ sessions since last formal QA
5. Open bugs exist in QA_REPORT with no resolution

**The Bug Handoff Rule:**
Every bug found by *any* agent goes into `QA_REPORT.md` immediately. Not just PROGRESS.md (which is build log only). QA_REPORT is the single source of truth. This rule was born from Session 25 when we discovered that Sessions 22–24 (the entire combat system) shipped without a QA pass because bugs from code reviews were only logged in PROGRESS.md.

**Current State:**
32 sessions. 3 open bugs (2 deferred, 1 partial). Every change tagged `[Critical]`, `[Major]`, or `[Minor]`. Every session logged.

**Why This Matters:**
Process scales down. You don't need a 10-person team to have accountability. You need rules that trigger automatically and a single source of truth for bugs.

**Screenshots to Include:**
- PROGRESS.md QA Process Rules section
- QA_REPORT.md bug table
- Session log excerpt showing change tags

---

## Blog Post 7

**Title:** The Guild Master: How an AI Creates Your Quests
**Category:** Feature Spotlight
**Milestone:** v1.0

**Summary:** Rizen's Guild Master is an AI-powered quest creator backed by OpenAI's gpt-4o-mini. Players describe their real-life activities, and the GM translates them into ranked quests with XP rewards, deadlines, and class routing.

### Full Blog Content

The core loop of Rizen is: *do real things, earn game rewards*. But who decides what's worth rewarding?

The Guild Master.

**How It Works:**
Open the Guild Master screen and describe what you want to do — "I'm going to study for my OSCP exam for 2 hours" or "I need to clean my room." The GM evaluates your request against the game's rank system (F through SSS), assigns appropriate XP, routes class XP to the right track, and creates a quest on your guild board.

**The Guardrails:**
The GM isn't a free XP printer. Its system prompt enforces:
- Rank/XP validation — a 10-minute task doesn't get S-rank
- 20-turn conversation cap per session
- Quest structure requirements (title, description, rank, XP, class tag, deadline)
- Anti-exploit analysis (Session 32 documented a full security review of the GM prompt)

**Guild Hours:**
The Guild operates 8AM–11PM. Outside those hours, the screen shows "Guild is locked." This isn't arbitrary — it prevents late-night grinding and reinforces a healthy schedule.

**Daily Board Reset:**
GM-created quests are scoped to the day they were created. Tomorrow, the board clears. This keeps the quest log fresh and prevents accumulation.

**Why This Matters:**
An AI quest creator turns *any* real-life activity into game progress. You don't need a predefined task list. You describe your life, and the game adapts.

**Screenshots to Include:**
- Guild Master chat interface
- Guild screen showing daily board with GM-created quests
- Guild locked state (after 11PM)
- Quest card showing rank, XP, and class tag

---

## Recommended Publishing Order

| Priority | Post | Category | Why First |
|----------|------|----------|-----------|
| 1 | The Guild Master: AI Quest Creator | Feature Spotlight | Core differentiator — this is what makes Rizen unique |
| 2 | Combat System: Zero to Full Fight Loop | Feature Spotlight | Most complex feature, best development story |
| 3 | Consumables, Buffs, and Economy | Feature Spotlight | Shows depth of game design |
| 4 | Achievements and Badges | Feature Spotlight | Universal appeal, visual content |
| 5 | Neural Breach Theme | Dev Insight | Visual identity post, good for social media |
| 6 | State Management Without Packages | Dev Insight | Technical audience, dev community appeal |
| 7 | 32 Sessions, 3 Open Bugs | Build Log | Process transparency, builds trust |
