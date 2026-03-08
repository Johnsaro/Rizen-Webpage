export interface BlogPost {
    id: string;
    title: string;
    summary: string;
    content: string; // the full markdown or html text
    category: 'Update' | 'Build Log' | 'Dev Insight' | 'Feature Spotlight' | 'Patch Note';
    version?: string;
    date: string;
    icon: string;
    featured?: boolean;
}

export const rizenBlogPosts: BlogPost[] = [
    {
        id: 'rizen-v1-release',
        title: 'Rizen v1.0.0: The Protocol is Live',
        summary: 'After 17 days and 37 sessions of intensive development, Rizen v1.0.0 has officially launched. The transition from prototype to production-ready operative interface is complete.',
        content: `Today marks a major milestone. **Rizen v1.0.0 is officially live.**

What started 17 days ago as a conceptual framework for gamifying life has evolved into a stable, feature-complete mobile application. We've moved past the "Beta" tag and into full operational status.

### The Journey to v1.0.0
Spanning 37 documented development sessions, the road to release involved:
- **Core RPG Loop:** Implementing a Guild Master AI that translates real-life effort into game progress.
- **Combat System:** A 4-phase build-out of a knowledge-based battle engine.
- **Economy & Items:** A balanced system of consumables and buffs that drive strategic play.
- **Architecture:** A clean, package-free state management system built on \`ValueNotifier\`.

### What's New in the Release
The v1.0.0 build focuses on **Stability and Finality**:
1. **Physical Hardware Validation:** The app has been successfully deployed and tested on physical Android devices, moving beyond the emulator.
2. **Asset Polishing:** Final UI refinements to the Neural Breach theme to ensure a cohesive "Cyber-Noir" experience.
3. **Bug Squashing:** A final sweep of the QA_REPORT to resolve all high-priority blockers.

### The Numbers
- **17 Days** of development.
- **37 Sessions** logged.
- **1.0.0+1** Build version.
- **Zero** third-party state management packages.

### What's Next?
The protocol is established, but the guild is just beginning. Post-launch focus will shift toward **Content Expansion**—new weapon classes, more complex encounter logic, and enhanced social features via the Showcase portal.

The choice remains yours, Recruit. Rise or Stagnate.

*The v1.0.0 APK is now distributed to core operatives.*`,
        category: 'Update',
        version: 'v1.0.0',
        date: '2026-03-08',
        icon: '🚀',
        featured: true
    },
    {
        id: 'guild-master-ai',
        title: 'The Guild Master: How an AI Creates Your Quests',
        summary: 'Rizen\'s Guild Master is an AI-powered quest creator backed by OpenAI\'s gpt-4o-mini. Players describe their real-life activities, and the GM translates them into ranked quests with XP rewards, deadlines, and class routing.',
        content: `The core loop of Rizen is: *do real things, earn game rewards*. But who decides what's worth rewarding?

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
An AI quest creator turns *any* real-life activity into game progress. You don't need a predefined task list. You describe your life, and the game adapts.`,
        category: 'Feature Spotlight',
        date: '2026-03-05',
        icon: '🤖',
        featured: true
    },
    {
        id: 'combat-system-zero-to-full',
        title: 'Rizen Combat System: From Zero to Full Fight Loop in 5 Sessions',
        summary: 'Rizen\'s combat system went from an empty concept to a fully wired knowledge-based fight loop — complete with XP rewards, death penalties, weapon-specific questions, and a flee mechanic — across Sessions 22–27. Here\'s how we built it.',
        content: `Combat in Rizen isn't about reflexes. It's about what you *know*.

When you enter a fight, you face a monster — the Procrastination Specter, for example — and the only way to deal damage is to answer questions correctly. Get it right? Free hit. Get it wrong or let the 15-second timer expire? The monster hits *you* for 30 HP.

**Phase 0–1: The Foundation (Session 22)**
We started with the basics: HP fields in the player model, a \`CombatService\` that owns the fight loop as a \`ChangeNotifier\`, and a hardcoded question bank with 15 questions across three class tracks (Sec Analyst, Mobile Dev, Web Dev). The fight screen uses animated HP bars with \`TweenAnimationBuilder\` — the monster bar shrinks as you land hits, while yours changes color from green to yellow to red as you take damage.

**Phase 2: Real Consequences (Session 23)**
Winning feels good only when losing hurts. Victory awards XP routed to your class track. Defeat costs you \`floor(currentXP × (0.05 + level × 0.005))\` — a scaling penalty that stings more as you level up. And fleeing? You can run, but it costs a flat 50 XP. Oh, and once the monster drops below 25% HP, the FLEE button locks. You finish the fight.

**Phase 3: Flashcard System (Session 24)**
We replaced the hardcoded questions with a dynamic Supabase-backed flashcard system. Each weapon type has its own question bank — equip the Recon Blade and you'll face reconnaissance questions in combat. Two training modes let you prepare outside of fights: **Study** (reveal and self-grade) and **Repair** (timed quiz with recycling wrong answers until you get 3 right or exhaust 9 attempts).

**Phase 4: Weapon Pipeline (Session 26)**
The final piece: equipping a weapon actually *changes your combat experience*. The system fetches questions matching your equipped weapon from Supabase, falling back to the hardcoded bank only when needed. Your loadout isn't cosmetic — it defines what knowledge you're tested on.

**Why This Matters:**
Rizen's combat proves that gamification doesn't have to be shallow. Every fight is a study session in disguise. The weapon-question pipeline means your gear choices reflect what you're *learning*, not just what looks cool.`,
        category: 'Feature Spotlight',
        version: 'v1.0.0',
        date: '2026-03-04',
        icon: '⚔️'
    },
    {
        id: 'consumables-buffs-economy',
        title: 'Consumables, Buffs, and the Economy That Actually Works',
        summary: 'Rizen\'s shop isn\'t cosmetic filler. Five consumable items create real strategic decisions with timed buffs, stacking rules, and quest-triggered effects.',
        content: `Most gamified apps give you points. Rizen gives you *choices*.

**The Five Active Consumables:**
- Health Potion: +300 HP (capped at max), Instant
- Shield Charge: +1 streak shield (max 3), Permanent until consumed
- Focus Boost: 1.5× XP multiplier, 2 hours
- Double Rep: 2× Rep multiplier, 1 hour
- XP Surge: 2× XP on next quest only, Until used (7-day TTL)

**The Design Decisions:**

*Stacking prevention:* You can't activate Focus Boost while one is already running. The ACTIVE badge replaces the USE button — no wasted items.

*XP Surge is unique:* It doesn't expire on a timer. It waits for your next quest completion, then consumes itself. But it does have a 7-day TTL to prevent permanent lock-in. This was a bug we caught in QA (QA-S28-001) — originally, a surge could live forever if you never completed a quest.

*Buff multipliers stack:* Focus Boost (1.5×) and XP Surge (2×) can be active simultaneously. \`_awardXPAndRep()\` applies both before the final XP calc. This creates a strategic window — activate both, then complete a quest for 3× XP.

*Check-in protection:* XP Surge only fires on quest completion and combat victory — not on daily check-ins. This prevents your surge from being wasted on a +50 XP check-in when you meant to save it for a 200 XP quest.

**Why This Matters:**
An economy without trade-offs is just a number going up. Consumables force players to *think* about timing, stacking, and when to spend Rep versus save it.`,
        category: 'Feature Spotlight',
        date: '2026-03-02',
        icon: '🧪'
    },
    {
        id: 'achievements-and-badges',
        title: 'Achievements, Badges, and the Psychology of Progress',
        summary: 'Rizen now tracks 18 achievements across four categories — Consistency, Combat, Quests, and Knowledge — each with Rep rewards and unlockable titles. Here\'s how the badge system was designed and built.',
        content: `Leveling up is satisfying. But *recognition* of specific milestones is what builds long-term engagement.

**18 Achievements, 4 Categories:**
- Consistency: First Step, The Consistent (7d), Unwavering (30d), The Relentless (100d), Ascendant (365d)
- Combat: First Blood, Monster Slayer (10 kills), Boss Killer, Raid Cleared, Perfect Fight
- Quests: Quest Taker, Grinder (50 complete), SSS Cleared
- Knowledge: Scholar, Librarian (10 items), Living Encyclopedia (25 items)

Plus two level milestones: **Rising Star** (Level 10) and **Veteran** (Level 25).

**How It Works Under the Hood:**
Every key action — quest completion, combat victory, check-in, item purchase — calls \`_checkAndUnlockAchievements()\` in GameService. The method evaluates all 18 conditions against the current player state. When an achievement unlocks, it awards Rep, fires a notification, and optionally grants a title.

**Featured Achievement:**
Your profile has a spotlight slot. Tap it to open a bottom sheet picker showing all unlocked badges. Locked badges appear as grey question marks — mystery drives curiosity.

**Why This Matters:**
Achievements bridge the gap between "I'm using an app" and "I'm building something." A 30-day streak badge isn't just a pixel — it's proof.`,
        category: 'Feature Spotlight',
        date: '2026-03-01',
        icon: '🏆'
    },
    {
        id: 'neural-breach-theme',
        title: 'The Neural Breach Theme: How Rizen Got Its Cyber-Noir Identity',
        summary: 'Rizen\'s visual identity — Overclock Cyan, System Violet, Obsidian backgrounds — wasn\'t born from a template. It was designed collaboratively and implemented as a full Material3 theme system.',
        content: `Every productivity app looks the same. Clean whites, gentle blues, rounded cards. Rizen is an RPG. It should feel like one.

**The Palette: Neural Breach**
The dark theme is built around five core colors:
- **Overclock Cyan (#00D2E0)** — primary actions, XP bars, headers
- **System Violet (#BC13FE)** — secondary elements, accents
- **Logic Lime (#39FF14)** — success states, tertiary highlights
- **Obsidian (#0D0D0F)** — background, the void behind everything
- **Kernel Panic Red (#FF3131)** — errors, defeat, danger

**Typography as UI:**
Headers use **Orbitron** — a geometric, sci-fi typeface that immediately signals "this isn't a regular to-do app." Body text uses **Inter** for readability, and stats/numbers use **JetBrains Mono** to give data a terminal feel. Three fonts, three purposes.

**Dark/Light, Not Dark-Only:**
A global \`ValueNotifier<ThemeMode>\` drives the toggle — no packages, no boilerplate. The light theme inverts intelligently without losing the cyber-noir identity.

**Why This Matters:**
Theme isn't decoration. It's the first thing users feel when they open the app. Neural Breach says: *this is a game, you are a player, this matters.*`,
        category: 'Dev Insight',
        version: 'v1.0.0',
        date: '2026-02-28',
        icon: '🎨'
    },
    {
        id: 'no-package-state-management',
        title: 'How We Handle State Without Redux, Bloc, or Riverpod',
        summary: 'Rizen\'s entire state architecture runs on Flutter\'s built-in ValueNotifier and a single GameService class. No third-party state management. Here\'s why — and what the rollback pattern looks like.',
        content: `When you start a Flutter project, the first question is always: "Which state management?"

For Rizen, the answer is: **none of them.**

The Architecture:
Five global \`ValueNotifier\`s hold all app state (PlayerData, Quest lists, Notifications, etc). Screens read them via \`ValueListenableBuilder\` — pure reactive rendering with no \`setState\` calls. All mutations go through \`GameService\`, which is the *only* thing that writes to notifiers.

**The Rollback Pattern:**
Every GameService method follows the same template:
1. **Snapshot** the current notifier value
2. **Mutate** the notifier optimistically
3. **Try** to persist to Supabase
4. **Catch** failure → restore the snapshot, log the error

This gives us optimistic UI updates (instant feedback) with server-side safety (no orphaned state). If Supabase is down, the UI snaps back to the pre-mutation state.

**Why Not Provider/Bloc/Riverpod?**
Rizen is single-player with one user. The state graph is flat — five notifiers, no nested dependencies, no computed selectors needed. Adding a state management package would mean: more boilerplate, more files, more abstraction for zero practical benefit.

\`ValueNotifier\` is 12 lines of Flutter source code. It does exactly what we need.

**Why This Matters:**
Simplicity isn't a compromise. It's a feature. Every line of state management code in Rizen does exactly one thing, and you can trace any mutation from button press to database write in under 60 seconds.`,
        category: 'Dev Insight',
        date: '2026-02-25',
        icon: '⚙️'
    },
    {
        id: '32-sessions-3-bugs',
        title: '32 Sessions, 3 Open Bugs: The Rizen QA Process',
        summary: 'Rizen has been built across 32 documented sessions with a formal QA process, mandatory bug handoff rules, and 5 explicit triggers for audit passes. Here\'s how we keep quality tight on a solo dev project.',
        content: `Building alone doesn't mean shipping without quality. Rizen runs a QA process that would feel familiar in a professional team — because the "team" includes specialized AI agents.

**The Agent Team:**
- **Alex**: Writes all code. Owns PROGRESS.md and CHECKLIST.md
- **QA Agent**: Formal audits. Owns QA_REPORT.md
- **Game-Dev-Mentor**: Design review and architectural guidance
- **Aizzen**: Personal discipline (doesn't touch code)

**5 QA Triggers:**
QA runs automatically before any new feature when *any* of these are true:
1. Previous session had a \`[Critical]\` change
2. Previous session had 2+ \`[Major]\` changes
3. A new system was added (screen, service, or model)
4. 3+ sessions since last formal QA
5. Open bugs exist in QA_REPORT with no resolution

**The Bug Handoff Rule:**
Every bug found by *any* agent goes into \`QA_REPORT.md\` immediately. Not just PROGRESS.md (which is build log only). QA_REPORT is the single source of truth. This rule was born from Session 25 when we discovered that Sessions 22–24 (the entire combat system) shipped without a QA pass because bugs from code reviews were only logged in PROGRESS.md.

**Current State:**
32 sessions. 3 open bugs (2 deferred, 1 partial). Every change tagged \`[Critical]\`, \`[Major]\`, or \`[Minor]\`. Every session logged.

**Why This Matters:**
Process scales down. You don't need a 10-person team to have accountability. You need rules that trigger automatically and a single source of truth for bugs.`,
        category: 'Build Log',
        date: '2026-02-20',
        icon: '📋'
    }
];
