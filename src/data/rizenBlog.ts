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
        id: 'session-41-bug-sweep',
        title: 'App Clean Status: The Session 41 Audit',
        summary: 'A massive stability update. Following a comprehensive formal audit, 17 critical and major bugs in the Flutter application have been neutralized. The mobile protocol is now verified Clean.',
        content: `Following the successful launch of v1.0.0, our focus shifted to **Protocol Hardening**. Session 41 marks the completion of our most rigorous internal audit to date.

### The "Clean" Mandate
We audited all 12 core model and service layers of the Rizen Flutter application. The mission was simple: identify every possible race condition, data corruption path, and UI synchronization lag.

### Key Neutralizations
1. **Race Condition Guards:** Added reentrancy protection to \`useItem()\`, \`purchaseItem()\`, and \`completeQuest()\`. Rapid-tapping exploits are now impossible.
2. **Data Integrity:** Refactored XP Surge logic to ensure buffs are consumed *before* the save operation, preventing "immortal buff" glitches during network rollbacks.
3. **Session Hardening:** Wrapped sensitive Supabase identifiers in safety guards to prevent silent write failures on cold starts.
4. **Network Resilience:** Implemented strict 15-second timeouts across all cloud transmissions to prevent UI hanging during signal drops.

### Status Report
- **Flutter App:** 0 Known Open Bugs.
- **Showcase Site:** Undergoing active audit (ETA: Session 45).
- **Stability Rating:** EXCELLENT.

The mobile interface is now the most stable it has ever been. Operatives are encouraged to update their local builds immediately to benefit from these hardening measures.

*The Rizen protocol remains uncompromised.*`,
        category: 'Patch Note',
        version: 'v1.0.0+1',
        date: '2026-03-11',
        icon: '🛡️',
        featured: true
    },
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
        featured: false
    },
    {
        id: 'neural-breach-design',
        title: 'Neural Breach: Designing the Cyber-Noir Experience',
        summary: 'A deep dive into the visual identity of Rizen. From the Overclock Cyan palette to the sci-fi typography that defines our atmosphere.',
        content: `Every productivity app looks the same. Clean whites, gentle blues, rounded cards. Rizen is an RPG. It should feel like one.

**The Palette: Neural Breach**
The dark theme is built around five core colors:
- **Overclock Cyan (#00D2E0)** — primary actions, XP bars, headers
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

When you enter a fight, you face a monster—the Procrastination Specter, for example—and the only way to deal damage is to answer questions correctly. Get it right? Free hit. Get it wrong or let the 15-second timer expire? The monster hits *you*.

**The Mechanics:**
1. **Timed Questions:** You have 15 seconds to identify the correct solution.
2. **Dynamic Scaling:** Monster difficulty scales with your operative level.
3. **Weapon Buffs:** Equipping specific gear unlocks specialized question tracks (e.g., Python, Cybersec, Mobile Dev).
4. **Death Penalties:** Falling in combat results in a scaling XP loss, making every engagement meaningful.

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
Five global \`ValueNotifier\`s hold all app state (PlayerData, Quest lists, Notifications, etc). Screens read them via \`ValueListenableBuilder\`—pure reactive rendering with no \`setState\` calls. All mutations go through \`GameService\`, which is the *only* thing that writes to notifiers.

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
        title: 'The Guild Master: AI-Driven Quest Validation',
        summary: 'A look at how we leverage GPT-4o-mini to translate unstructured real-life logs into balanced, ranked in-game quests.',
        content: `The core loop of Rizen is: *do real things, earn game rewards*. But who decides what's worth rewarding?

The Guild Master.

**How It Works:**
The GM evaluates your request against the game's rank system (F through SSS), assigns appropriate XP, routes class XP to the right track, and creates a quest on your guild board.

**Security & Anti-Exploit:**
The GM isn't a free XP printer. Its system prompt enforces:
- Rank/XP validation—a 10-minute task doesn't get S-rank.
- Contextual analysis to prevent repetitive or low-effort grinding.
- Operational hours (08:00 - 23:00) to enforce a healthy lifestyle.

An AI quest creator turns *any* real-life activity into game progress. You don't need a predefined task list. You describe your life, and the game adapts.`,
        category: 'Feature Spotlight',
        date: '2026-03-05',
        icon: '🤖'
    },
    {
        id: 'roadmap-2026',
        title: 'The Road Ahead: Rizen Roadmap 2026',
        summary: 'The protocol is established. Now we expand. Social features, new weapon classes, and multi-device sync are on the horizon.',
        content: `v1.0.0 is just the beginning. The Rizen Protocol is designed to evolve alongside its operatives.

### Q2 2026: The Social Layer
- **Guild Squads:** Form teams of 3-5 operatives to tackle high-rank communal quests.
- **Rivalry Board:** Real-time XP races with designated rivals.
- **Trading Hub:** Exchange rare materials for specialized weapon components.

### Q3 2026: Content Expansion
- **Class Specializations:** Deepen your path with sub-classes (e.g., Security Analyst -> Threat Hunter).
- **New Weapon Tiers:** Legendary items with unique active capabilities.
- **World Bosses:** Monthly community combat events requiring collective coordination.

### Q4 2026: Infrastructure Hardening
- **End-to-End Encryption:** Local state encryption for privacy-conscious operatives.
- **Desktop Client:** A native Windows/Linux interface for seamless desktop tracking.

The mission continues. Stay vigilant.`,
        category: 'Update',
        date: '2026-03-04',
        icon: '🗺️'
    }
];
