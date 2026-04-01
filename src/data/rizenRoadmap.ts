export type BuildId = 'rizen-mobile' | 'gridspace' | 'pulse-agent' | 'phantom-peel';

export interface RoadmapItem {
    id: string;
    buildId: BuildId;
    title: string;
    description: string;
    themeTranslation?: string;
    status: 'done' | 'now' | 'next' | 'later';
    category: 'Core' | 'Feature' | 'Expansion' | 'System';
}

export type DevStatus = 'live' | 'maintenance' | 'stable' | 'dev';

export interface BuildRoadmapMeta {
    name: string;
    shortName: string;
    accent: string;
    accentRgb: string;
    subtitle: string;
    version: string;
    tags: string[];
    flagship?: boolean;
    devStatus: DevStatus;
    devStatusNote?: string;
}

export const buildMeta: Record<BuildId, BuildRoadmapMeta> = {
    'rizen-mobile': {
        name: 'Rizen Mobile Protocol',
        shortName: 'Mobile',
        accent: 'var(--accent-emerald)',
        accentRgb: '16, 185, 129',
        subtitle: 'The core cultivation protocol — actively evolving.',
        version: 'v2.3.2',
        tags: ['Flutter', 'Supabase', 'Dart'],
        flagship: true,
        devStatus: 'live',
        devStatusNote: 'Active development — V2 in progress',
    },
    'gridspace': {
        name: 'GridSpace',
        shortName: 'Grid',
        accent: 'var(--accent-violet, #8b5cf6)',
        accentRgb: '139, 92, 246',
        subtitle: 'Vibe coding suite — actively in development.',
        version: 'v0.1.0',
        tags: ['Tauri v2', 'React', 'Rust', 'TypeScript'],
        devStatus: 'dev',
        devStatusNote: 'Active development — building core features',
    },
    'pulse-agent': {
        name: 'Pulse Agent 2.0',
        shortName: 'Pulse',
        accent: 'var(--accent-cyan)',
        accentRgb: '0, 228, 255',
        subtitle: 'Desktop guardian — shipped and operational.',
        version: 'v2.0',
        tags: ['Python', 'PyQt6', 'Win32'],
        devStatus: 'stable',
        devStatusNote: 'Feature-complete — no active development',
    },
    'phantom-peel': {
        name: 'Phantom Peel Forensics',
        shortName: 'Phantom',
        accent: 'var(--accent-crimson)',
        accentRgb: '244, 63, 94',
        subtitle: 'Forensics layer — shipped and stable.',
        version: 'v1.1',
        tags: ['Python', 'Forensics', 'Win32'],
        devStatus: 'stable',
        devStatusNote: 'Feature-complete — no active development',
    },
};

export const buildOrder: BuildId[] = ['rizen-mobile', 'gridspace', 'pulse-agent', 'phantom-peel'];

export const roadmapData: RoadmapItem[] = [
    // ═══════════════════════════════════════
    //  RIZEN MOBILE — Flagship
    // ═══════════════════════════════════════

    // DONE
    {
        id: 'rm-done-1',
        buildId: 'rizen-mobile',
        title: 'Offline Local Storage',
        description: 'Play Rizen without an internet connection. Your data saves locally and syncs when you reconnect.',
        themeTranslation: 'Independent Cultivation (No Sect Uplink required)',
        status: 'done',
        category: 'Core'
    },
    {
        id: 'rm-done-2',
        buildId: 'rizen-mobile',
        title: 'Guest Sessions',
        description: 'Try the app immediately without creating an account. Wanderer mode with full migration path to a real account.',
        status: 'done',
        category: 'Core'
    },
    {
        id: 'rm-done-3',
        buildId: 'rizen-mobile',
        title: 'Merchant\'s Log',
        description: 'A local-only daily expense tracker with fast entry, tag management, weekly receipt storage, and a "shred the ledger" reset mechanic.',
        themeTranslation: 'Merchant\'s Log',
        status: 'done',
        category: 'Feature'
    },
    {
        id: 'rm-done-4',
        buildId: 'rizen-mobile',
        title: 'Dao Heart States & Streak Bonuses',
        description: 'Consistency tracking with real consequences. Dropping your streak triggers Qi Deviation. 7-day and 14-day streaks grant damage and defense bonuses.',
        themeTranslation: 'Heavenly Tribulations & Qi Deviation',
        status: 'done',
        category: 'Feature'
    },
    {
        id: 'rm-done-5',
        buildId: 'rizen-mobile',
        title: '7 Cultivation Paths',
        description: 'Choose from 7 unique paths — each with distinct stat modifiers, labels, and progression identity. New streamlined 3-step onboarding: Name → Path → Confirm.',
        themeTranslation: 'Spirit Root Awakening',
        status: 'done',
        category: 'Core'
    },
    {
        id: 'rm-done-6',
        buildId: 'rizen-mobile',
        title: 'Cultivation Grounds',
        description: 'No-stakes practice mode: 5 questions per round, 8 Qi per correct answer, daily cap of 20. Speed labels, combo streaks, and actual Qi earned display.',
        themeTranslation: 'Training Pavilion',
        status: 'done',
        category: 'Feature'
    },
    {
        id: 'rm-done-7',
        buildId: 'rizen-mobile',
        title: 'Stance Choice System',
        description: 'At 40% beast HP, choose Cultivate (+50% Qi, beast rages after 2 wrong answers) or Strike (+15% damage for the rest of the fight).',
        themeTranslation: 'Dao of War — Mercy or Execution',
        status: 'done',
        category: 'Feature'
    },
    {
        id: 'rm-done-8',
        buildId: 'rizen-mobile',
        title: 'Weekly Boss Rotation',
        description: '8 unique boss names cycle weekly on floor 10+. Each week brings a different challenge to the Sect Trial.',
        themeTranslation: 'Wandering Beast Lords',
        status: 'done',
        category: 'Feature'
    },
    {
        id: 'rm-done-9',
        buildId: 'rizen-mobile',
        title: 'Dungeon Milestone Achievements',
        description: 'Trial Survivor (1 clear), Dungeon Walker (5 clears), Abyss Conqueror (10 clears) — each with Spirit Stone rewards. Post-clear golden seal with reset countdown.',
        themeTranslation: 'Sect Trial Comprehension',
        status: 'done',
        category: 'Feature'
    },
    {
        id: 'rm-done-10',
        buildId: 'rizen-mobile',
        title: 'Sect Registry UI Overhaul',
        description: 'Full visual rework — clean gradients, Qi color palette (Deep Jade, Spirit Gold, Cyan Qi), animated particle background, glowing auth screen, and frosted glass navigation.',
        themeTranslation: 'The Immersive Cultivation Overhaul',
        status: 'done',
        category: 'Core'
    },

    // NOW
    {
        id: 'rm-now-1',
        buildId: 'rizen-mobile',
        title: 'Breakthrough Challenges',
        description: 'Special milestone tasks and trials required to level up past major progression caps.',
        themeTranslation: 'Enlightenment Trials',
        status: 'now',
        category: 'Feature'
    },
    {
        id: 'rm-now-2',
        buildId: 'rizen-mobile',
        title: 'Mental Barrier Debuffs',
        description: 'Failure or inconsistency adds debuffs that you must overcome through specific tasks to maintain progress.',
        themeTranslation: 'Inner Demons',
        status: 'now',
        category: 'System'
    },

    // NEXT
    {
        id: 'rm-next-1',
        buildId: 'rizen-mobile',
        title: 'Innate Affinities',
        description: 'Base modifiers that define your growth speed in different progression paths.',
        themeTranslation: 'Spirit Roots',
        status: 'next',
        category: 'System'
    },
    {
        id: 'rm-next-2',
        buildId: 'rizen-mobile',
        title: 'Deep Focus Mode',
        description: 'A dedicated high-focus mode and timer for deep work sessions with doubled reward gains.',
        themeTranslation: 'Closed-Door Cultivation',
        status: 'next',
        category: 'Feature'
    },

    // LATER
    {
        id: 'rm-later-1',
        buildId: 'rizen-mobile',
        title: 'Prestige System',
        description: 'Reset your progress for permanent account-wide bonuses after reaching the maximum level.',
        themeTranslation: 'Reincarnation',
        status: 'later',
        category: 'Core'
    },
    {
        id: 'rm-later-2',
        buildId: 'rizen-mobile',
        title: 'Community Guilds',
        description: 'Transition from solo tracking to social organizations, shared resources, and communal trials.',
        themeTranslation: 'Sect System (V3)',
        status: 'later',
        category: 'Expansion'
    },
    {
        id: 'rm-later-3',
        buildId: 'rizen-mobile',
        title: 'Consequence Engine',
        description: 'A system where your everyday actions influence fortune and negative event frequency.',
        themeTranslation: 'Karma System',
        status: 'later',
        category: 'System'
    },

    // ═══════════════════════════════════════
    //  PULSE AGENT 2.0 — Desktop Guardian
    // ═══════════════════════════════════════

    // DONE
    {
        id: 'pa-done-1',
        buildId: 'pulse-agent',
        title: 'Win32 Timer & Overlay Engine',
        description: 'Core timer system with native Win32 overlay rendering for non-intrusive on-screen alerts and break reminders.',
        status: 'done',
        category: 'Core'
    },
    {
        id: 'pa-done-2',
        buildId: 'pulse-agent',
        title: 'SystemWatcher & Guardian Alerts',
        description: 'Background process monitoring with a Guardian mascot that delivers context-aware alerts for hydration, posture, and break enforcement.',
        status: 'done',
        category: 'Feature'
    },
    {
        id: 'pa-done-3',
        buildId: 'pulse-agent',
        title: 'Activity Pulse Engine',
        description: 'Background activity monitoring that tracks active window time, idle periods, and session patterns for productivity analytics.',
        status: 'done',
        category: 'System'
    },
    {
        id: 'pa-done-4',
        buildId: 'pulse-agent',
        title: 'PyQt6 Dashboard Hub',
        description: 'Full desktop dashboard with hardware-accelerated UI for viewing real-time productivity data, session history, and health protocol status.',
        status: 'done',
        category: 'Core'
    },
    {
        id: 'pa-done-5',
        buildId: 'pulse-agent',
        title: 'Live Sync Integration',
        description: 'Real-time data bridge between Pulse Agent desktop and the Rizen Mobile ecosystem for cross-platform cultivator analytics.',
        status: 'done',
        category: 'Feature'
    },

    // ═══════════════════════════════════════
    //  GRIDSPACE — Vibe Coding Suite
    // ═══════════════════════════════════════

    // DONE
    {
        id: 'gs-done-1',
        buildId: 'gridspace',
        title: 'Multi-Pane Terminal Grid',
        description: 'Native PTY terminals with split pane layouts (single, vertical, horizontal, quad) powered by xterm.js and a Rust backend.',
        status: 'done',
        category: 'Core'
    },
    {
        id: 'gs-done-2',
        buildId: 'gridspace',
        title: 'Grid Launcher & Session Presets',
        description: 'Configurable session launcher with saved presets, layout picker, working directory selection, and tool permission controls.',
        status: 'done',
        category: 'Core'
    },
    {
        id: 'gs-done-3',
        buildId: 'gridspace',
        title: 'Command Center & System Pulse',
        description: 'Central dashboard with system status monitoring and real-time Claude Code token usage tracking via statusline bridge.',
        status: 'done',
        category: 'Feature'
    },
    {
        id: 'gs-done-4',
        buildId: 'gridspace',
        title: 'Journal Viewer',
        description: 'Built-in journal reader that displays daily session logs from the local filesystem.',
        status: 'done',
        category: 'Feature'
    },
    {
        id: 'gs-done-5',
        buildId: 'gridspace',
        title: 'Security Log',
        description: 'Clipboard secret scanning, git security audit, and sensitive file detection with a CRT-style alert interface.',
        status: 'done',
        category: 'Feature'
    },
    {
        id: 'gs-done-6',
        buildId: 'gridspace',
        title: 'Settings & Shell Config',
        description: 'Shell selector (PowerShell, CMD, Git Bash, custom), theme picker, and persistent user preferences.',
        status: 'done',
        category: 'Feature'
    },
    {
        id: 'gs-done-7',
        buildId: 'gridspace',
        title: 'Session Logging Integration',
        description: 'Status bar session logger that writes metadata to JSON and injects prompts into Claude Code for automated journal entries.',
        status: 'done',
        category: 'Feature'
    },

    // NOW
    {
        id: 'gs-now-1',
        buildId: 'gridspace',
        title: 'Stability & Polish Pass',
        description: 'Fixing terminal rendering issues, PTY lifecycle bugs, and overall UX refinement before daily-driver use.',
        status: 'now',
        category: 'Core'
    },

    // NEXT
    {
        id: 'gs-next-1',
        buildId: 'gridspace',
        title: 'Project Dashboard Enhancement',
        description: 'Live project status pulled from local markdown files — version tracking, open bugs, and active tasks.',
        status: 'next',
        category: 'Feature'
    },
    {
        id: 'gs-next-2',
        buildId: 'gridspace',
        title: 'Flow State Analytics',
        description: 'Session-level productivity scoring based on focus duration, idle time, and task completion patterns.',
        status: 'next',
        category: 'Feature'
    },

    // LATER
    {
        id: 'gs-later-1',
        buildId: 'gridspace',
        title: 'Plugin System',
        description: 'Extensible architecture allowing custom panels, tools, and integrations to be added to the workspace.',
        status: 'later',
        category: 'Expansion'
    },
    {
        id: 'gs-later-2',
        buildId: 'gridspace',
        title: 'Cross-Platform Support',
        description: 'Expand beyond Windows to macOS and Linux with platform-agnostic PTY and filesystem handling.',
        status: 'later',
        category: 'Expansion'
    },

    // ═══════════════════════════════════════
    //  PHANTOM PEEL — Forensics Layer
    // ═══════════════════════════════════════

    // DONE
    {
        id: 'pp-done-1',
        buildId: 'phantom-peel',
        title: 'Driver Registry Sweep',
        description: 'Core engine that enumerates kernel-level driver entries from the Windows registry, resolving ImagePath mappings across isolated namespaces.',
        status: 'done',
        category: 'Core'
    },
    {
        id: 'pp-done-2',
        buildId: 'phantom-peel',
        title: 'Entropy-Based Artifact Scanner',
        description: 'Heuristic analysis that calculates entropy scores on driver payloads to detect randomized spoofer artifacts and tampered binaries.',
        status: 'done',
        category: 'System'
    },
    {
        id: 'pp-done-3',
        buildId: 'phantom-peel',
        title: 'Secure Boot & Test Signing Detection',
        description: 'Validates Secure Boot state and detects Test Signing mode — flags systems running unsigned or self-signed kernel drivers.',
        status: 'done',
        category: 'Feature'
    },
    {
        id: 'pp-done-4',
        buildId: 'phantom-peel',
        title: 'MAC OUI Validation',
        description: 'Cross-references network adapter MAC addresses against the IEEE OUI database to flag locally administered or spoofed hardware identifiers.',
        status: 'done',
        category: 'Feature'
    },

    // LATER
    {
        id: 'pp-later-1',
        buildId: 'phantom-peel',
        title: 'Live Integrity Monitor',
        description: 'Persistent background daemon that watches for real-time driver loading events and flags unsigned or suspicious modules as they appear.',
        status: 'later',
        category: 'System'
    },
    {
        id: 'pp-later-2',
        buildId: 'phantom-peel',
        title: 'Linux Forensics Module',
        description: 'Port core scanning capabilities to Linux — kernel module enumeration, dmesg parsing, and /proc analysis for cross-platform coverage.',
        status: 'later',
        category: 'Expansion'
    },
];
