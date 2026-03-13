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
        id: 'rizen-v2-cultivation-rework',
        title: 'Rizen V2: The Cultivation System Awakens',
        summary: 'Rizen is no longer a generic RPG tracker. V2 transforms the entire identity into a xianxia-inspired cultivation system — complete with Dao Paths, Cultivation Realms, Heavenly Tribulations, and a System that binds to you.',
        content: `The System has awakened.

Rizen V2 represents a complete identity rework, shifting from a generic RPG framework to a specialized **xianxia-inspired cultivation system**. This isn't just a visual reskin; it is a fundamental philosophical shift in how we track and reward real-world growth.

!!! This update marks the official transition from "Project Rizen" to the "Rizen Protocol."

## Why V2?
In V1, our "classes" were locked into IT-specific roles like Security Analyst or Web Developer. While this worked for a niche, it locked out 95% of potential cultivators. Whether you are a nursing student, a gym rat, a musician, or a researcher, the day-one vision for Rizen was always: *any real-life activity drives growth.* V2 finally delivers that vision without compromise.

!!! **Crucial Shift:** Progression is now tied to the Dao, not just your career.

## The Core Identity Shift
The entire protocol has been rethemed to align with the laws of the Dao:
- **Classes** → Dao Paths
- **XP** → Qi
- **Levels** → Cultivation Realms
- **Streaks** → Dao Heart Stability
- **Quests** → Trials or Mandates
- **Reputation** → Spirit Stones
- **Buffs** → Cultivation Pills
- **Achievements** → Heavenly Merits
- **Weapons** → Spiritual Artifacts

## The 7 Dao Paths
Cultivators can now choose from seven distinct paths, mapping to any real-world domain:
- **Shadow Arts (Cybersecurity):** Moves unseen, finds weaknesses, and infiltrates barriers.
- **Formation Master (Web Dev):** Builds the arrays and frameworks that hold digital worlds together.
- **Artifact Refiner (Mobile Dev):** Crafts powerful tools that people carry in their hands.
- **Realm Architect (Game Dev):** Creates entire worlds and defines their rules.
- **Body Cultivator (Fitness):** Refines the physical vessel through relentless training.
- **Scripture Keeper (Academics):** Absorbs knowledge and seeks to comprehend the Dao.
- **Inscription Master (Creative/Art):** Channels Qi into art, runes, sound, and creation.

## Cultivation Realms
Progression has been deepened. No longer a flat 1-50 level scale, cultivators now ascend through six major realms:
**Mortal → Qi Gathering → Foundation Establishment → Core Formation → Nascent Soul → Dao Seeking.**

Each realm contains 9 sub-ranks, providing **54 total progression points**. Every rank requires deeper focus; every realm transition requires a breakthrough.

## The System
Rizen IS the System. It binds to your soul, assigns your trials, and monitors your progress with an evolving consciousness. The System's personality adapts as you grow—dismissive at the Mortal realm, acknowledging at Core Formation, and speaking to you as a peer once you reach Dao Seeking. It rewards discipline and, through **Qi Deviation**, punishes stagnation.

## What is Coming
The V2 rollout is staged in tiers. Prepare yourselves for:
- **Breakthrough Events** and **Heavenly Tribulations**.
- **Inner Demons** that challenge your Dao Heart.
- **Spirit Roots** and **Meridian** mapping.
- **Closed-Door Cultivation** focus modes.
- **Reincarnation** (Prestige) for those who reach the peak.

Rise or Stagnate. The System is watching.`,
        category: 'Update',
        version: 'v2.0.0',
        date: '2026-03-13',
        icon: '🔮',
        featured: true
    },
    {
        id: 'session-41-bug-sweep',
        title: 'App Clean Status: The Session 41 Audit',
        summary: 'A massive stability update. Following a comprehensive formal audit, 17 critical and major bugs in the Flutter application have been neutralized. The cultivation protocol is now verified Clean.',
        content: `Following the successful launch of v1.0.0, our focus shifted to **Cultivation Base Hardening**. Session 41 marks the completion of our most rigorous internal audit to date.

## The "Clean" Mandate
We audited all 12 core model and service layers of the Rizen Flutter application. The mission was simple: identify every possible race condition, data corruption path, and UI synchronization lag.

## Key Neutralizations
1. **Race Condition Guards:** Added reentrancy protection to \`useItem()\`, \`purchaseItem()\`, and \`completeTrial()\`. Rapid-tapping exploits are now impossible.
2. **Data Integrity:** Refactored Qi Surge logic to ensure buffs are consumed *before* the save operation, preventing "immortal buff" glitches during network rollbacks.
3. **Session Hardening:** Wrapped sensitive Supabase identifiers in safety guards to prevent silent write failures on cold starts.
4. **Network Resilience:** Implemented strict 15-second timeouts across all cloud transmissions to prevent UI hanging during signal drops.

## Status Report
- **Flutter App:** 0 Known Open Bugs.
- **Showcase Site:** Undergoing active audit (ETA: Session 45).
- **Stability Rating:** EXCELLENT.

The cultivation interface is now the most stable it has ever been. Cultivators are encouraged to update their local builds immediately to benefit from these hardening measures.

*The cultivation protocol remains uncompromised.*`,
        category: 'Patch Note',
        version: 'v1.0.0+1',
        date: '2026-03-11',
        icon: '🛡️',
        featured: false
    },
    {
        id: 'rizen-v1-release',
        title: 'Rizen v1.0.0: The Protocol is Live',
        summary: 'After 17 days and 37 sessions of intensive development, Rizen v1.0.0 has officially launched. The transition from prototype to production-ready cultivator interface is complete.',
        content: `Today marks a major milestone. **Rizen v1.0.0 is officially live.**

What started 17 days ago as a conceptual framework for gamifying life has evolved into a stable, feature-complete mobile application. We've moved past the "Beta" tag and into full operational status.

## The Journey to v1.0.0
Spanning 37 documented development sessions, the road to release involved:
- **Core RPG Loop:** Implementing a System AI that translates real-life effort into cultivation progress.
- **Combat System:** A 4-phase build-out of a knowledge-based battle engine.
- **Economy & Items:** A balanced system of consumables and buffs that drive strategic play.
- **Architecture:** A clean, package-free state management system built on \`ValueNotifier\`.

## What's New in the Release
The v1.0.0 build focuses on **Stability and Finality**:
1. **Physical Hardware Validation:** The app has been successfully deployed and tested on physical Android devices, moving beyond the emulator.
2. **Asset Polishing:** Final UI refinements to the Neural Breach theme to ensure a cohesive "Neural Breach" experience.
3. **Bug Squashing:** A final sweep of the QA_REPORT to resolve all high-priority blockers.

## The Numbers
- **17 Days** of development.
- **37 Sessions** logged.
- **1.0.0+1** Build version.
- **Zero** third-party state management packages.

## What's Next?
The protocol is established, but the Sect is just beginning. Post-launch focus will shift toward **Content Expansion**—new Dao Paths, more complex encounter logic, and Sect features and the Showcase portal.

The choice remains yours, Cultivator. Rise or Stagnate.

*The v1.0.0 APK is now distributed to core cultivators.*`,
        category: 'Update',
        version: 'v1.0.0',
        date: '2026-03-08',
        icon: '🚀',
        featured: false
    },
    {
        id: 'neural-breach-design',
        title: 'Neural Breach: Designing the Cyber-Noir Experience',
        summary: 'A deep dive into the visual identity of Rizen. From the Overclock Cyan palette to the sci-fi typography that defines our atmosphere.',
        content: `Every productivity app looks the same. Clean whites, gentle blues, rounded cards. Rizen is an RPG. It should feel like one.

**The Palette: Neural Breach**
The dark theme is built around five core colors:
- **Overclock Cyan (#00D2E0)** — primary actions, Qi bars, headers
- **System Violet (#BC13FE)** — secondary elements, accents
- **Logic Lime (#39FF14)** — success states, tertiary highlights
- **Obsidian (#0D0D0F)** — background, the void behind everything

**Typography as UI:**
Headers use **Orbitron** — a geometric, sci-fi typeface that immediately signals "this isn't a regular to-do app." Body text uses **Inter** for readability, and stats/numbers use **JetBrains Mono** to give data a terminal feel.

**Why This Matters:**
Theme isn't decoration. It's the first thing users feel when they open the app. Neural Breach says: *this is a game, you are a player, this matters.*`,
        category: 'Dev Insight',
        version: 'v1.0.0',
        date: '2026-03-09',
        icon: '🎨'
    },
    {
        id: 'combat-engine-mechanics',
        title: 'Knowledge is Power: The Combat Engine',
        summary: 'Rizen\'s combat system isn\'t about reflexes—it\'s about what you know. Learn how we turned flashcards into a high-stakes battle system.',
        content: `Combat in Rizen isn't about reflexes. It's about what you *know*.

When you enter a fight, you face a monster—the Inner Demon, for example—and the only way to deal damage is to answer questions correctly. Get it right? Free hit. Get it wrong or let the 15-second timer expire? The monster hits *you*.

**The Mechanics:**
1. **Timed Questions:** You have 15 seconds to identify the correct solution.
2. **Dynamic Scaling:** Monster difficulty scales with your cultivation level.
3. **Artifact Buffs:** Equipping specific gear unlocks specialized question tracks (e.g., Python, Cybersec, Mobile Dev).
4. **Death Penalties:** Falling in combat results in a scaling Qi loss, making every engagement meaningful.

**Why This Matters:**
Rizen's combat proves that gamification doesn't have to be shallow. Every fight is a study session in disguise.`,
        category: 'Feature Spotlight',
        version: 'v1.0.0',
        date: '2026-03-07',
        icon: '⚔️'
    },
    {
        id: 'state-management-simplicity',
        title: 'State Management: Why We Chose Simplicity',
        summary: 'How Rizen maintains a complex RPG state graph using only Flutter\'s built-in ValueNotifier and zero third-party packages.',
        content: `When you start a Flutter project, the first question is always: "Which state management?" For Rizen, the answer was: **none of them.**

**The Architecture:**
Five global \`ValueNotifier\`s hold all app state (PlayerData, Trial lists, Notifications, etc). Screens read them via \`ValueListenableBuilder\`—pure reactive rendering with no \`setState\` calls. All mutations go through \`GameService\`, which is the *only* thing that writes to notifiers.

**The Benefits:**
- **Zero Boilerplate:** No actions, reducers, or complex providers.
- **Total Traceability:** You can trace any mutation from button press to database write in under 60 seconds.
- **Performance:** \`ValueNotifier\` is incredibly lightweight, ensuring fluid 60FPS animations on even entry-level devices.

Simplicity isn't a compromise. It's a feature.`,
        category: 'Dev Insight',
        date: '2026-03-06',
        icon: '⚙️'
    },
    {
        id: 'guild-master-ai-logic',
        title: 'The System: AI-Driven Trial Validation',
        summary: 'A look at how we leverage GPT-4o-mini to translate unstructured real-life logs into balanced, ranked in-game trials.',
        content: `The core loop of Rizen is: *do real things, earn game rewards*. But who decides what's worth rewarding?

The System.

**How It Works:**
The System evaluates your request against the game's rank system (F through SSS), assigns appropriate Qi, routes path Qi to the right track, and creates a trial on your sect board.

**Security & Anti-Exploit:**
The System isn't a free Qi printer. Its system prompt enforces:
- Rank/Qi validation—a 10-minute task doesn't get S-rank.
- Contextual analysis to prevent repetitive or low-effort grinding.
- Operational hours (08:00 - 23:00) to enforce a healthy lifestyle.

An AI trial creator turns *any* real-life activity into cultivation progress. You don't need a predefined task list. You describe your life, and the game adapts.`,
        category: 'Feature Spotlight',
        date: '2026-03-05',
        icon: '🤖'
    },
    {
        id: 'roadmap-2026',
        title: 'The Cultivation Roadmap: Rizen V2 and Beyond',
        summary: 'V2 transforms Rizen into a cultivation system. Here is the staged plan — from core retheme to endgame prestige mechanics.',
        content: `v1.0.0 was the foundation. V2 is the awakening. The Rizen Protocol is evolving into a comprehensive cultivation system.

## Tier 1 — Core (V2 Launch)
- **The 7 Dao Paths:** 4 IT-focused paths and 3 universal paths (Body, Scripture, Inscription) for all cultivators.
- **Cultivation Realms:** Progression via 6 major realms, each with 9 sub-stages.
- **Dao Heart:** A tiered streak system where consistency directly impacts Qi absorption and breakthrough success.
- **Evolving System:** A sentient AI interface whose personality shifts as you ascend the realms.
- **Pill System:** A full retheme of all buffs into specialized cultivation pills and elixirs.

## Tier 2 — Depth
- **Breakthrough Events:** Special enlightenment trials required to move between major realms.
- **Heavenly Tribulations:** High-stakes survival events that replace the inactivity timers.
- **Inner Demons:** Mental barriers triggered by failure or inconsistency that must be overcome to maintain progress.
- **Qi Deviation:** Meaningful narrative consequences for neglecting your cultivation base.
- **Spirit Roots:** Innate affinities that define your growth speed in different Dao paths.

## Tier 3 — Richness
- **Dao Comprehension:** A visual insight tree representing your mastery of specific path principles.
- **Meridian Mapping:** A profile visualization of your stat channels and energy flow.
- **Cultivation Techniques:** Passive bonuses discovered through your unique real-world behavior patterns.
- **Five Elements Synergy:** Bonus Qi for balancing complementary paths.

## Tier 4 — Endgame
- **Reincarnation:** A prestige system for those who reach the peak of Dao Seeking.
- **Closed-Door Cultivation:** A high-focus mode for deep work sessions with doubled Qi gains.
- **Karma System:** A consequence engine where your actions influence fortune and tribulation frequency.
- **Sect System (V3):** The transition from solo cultivation to social organizations and communal trials.

Each tier builds on the last. Nothing ships until it's stable. The Dao rewards patience.`,
        category: 'Update',
        date: '2026-03-13',
        icon: '🗺️'
    }
];
