export interface RoadmapItem {
    id: string;
    title: string;
    description: string;
    themeTranslation?: string;
    status: 'now' | 'next' | 'later';
    category: 'Core' | 'Feature' | 'Expansion' | 'System';
}

export const roadmapData: RoadmapItem[] = [
    // NOW - Currently in Development
    {
        id: 'now-1',
        title: 'Offline Local Storage',
        description: 'Play Rizen without an internet connection. Your data saves locally and syncs when you reconnect.',
        themeTranslation: 'Independent Cultivation (No Sect Uplink required)',
        status: 'now',
        category: 'Core'
    },
    {
        id: 'now-2',
        title: 'Guest Sessions',
        description: 'Try the app immediately without creating an account.',
        status: 'now',
        category: 'Core'
    },
    {
        id: 'now-3',
        title: 'Merchant\'s Log',
        description: 'A local-only daily expense tracker with fast entry, tag management, weekly receipt storage, and a "shred the ledger" reset mechanic.',
        themeTranslation: 'Merchant\'s Log',
        status: 'now',
        category: 'Feature'
    },

    // NEXT - Tier 2 (Depth)
    {
        id: 'next-1',
        title: 'Punishment & Consistency Events',
        description: 'High-stakes survival events that replace inactivity timers. Dropping your streak triggers negative consequences.',
        themeTranslation: 'Heavenly Tribulations & Qi Deviation',
        status: 'next',
        category: 'Feature'
    },
    {
        id: 'next-2',
        title: 'Breakthrough Challenges',
        description: 'Special milestone tasks and trials required to level up past major progression caps.',
        themeTranslation: 'Enlightenment Trials',
        status: 'next',
        category: 'Feature'
    },
    {
        id: 'next-3',
        title: 'Mental Barrier Debuffs',
        description: 'Failure or inconsistency adds debuffs that you must overcome through specific tasks to maintain progress.',
        themeTranslation: 'Inner Demons',
        status: 'next',
        category: 'System'
    },
    {
        id: 'next-4',
        title: 'Innate Affinities',
        description: 'Base modifiers that define your growth speed in different progression paths.',
        themeTranslation: 'Spirit Roots',
        status: 'next',
        category: 'System'
    },

    // LATER - Tier 3 (Richness) & Tier 4 (Endgame)
    {
        id: 'later-1',
        title: 'Deep Focus Mode',
        description: 'A dedicated high-focus mode and timer for deep work sessions with doubled reward gains.',
        themeTranslation: 'Closed-Door Cultivation',
        status: 'later',
        category: 'Feature'
    },
    {
        id: 'later-2',
        title: 'Prestige System',
        description: 'Reset your progress for permanent account-wide bonuses after reaching the maximum level.',
        themeTranslation: 'Reincarnation',
        status: 'later',
        category: 'Core'
    },
    {
        id: 'later-3',
        title: 'Community Guilds',
        description: 'Transition from solo tracking to social organizations, shared resources, and communal trials.',
        themeTranslation: 'Sect System (V3)',
        status: 'later',
        category: 'Expansion'
    },
    {
        id: 'later-4',
        title: 'Consequence Engine',
        description: 'A system where your everyday actions influence fortune and negative event frequency.',
        themeTranslation: 'Karma System',
        status: 'later',
        category: 'System'
    }
];