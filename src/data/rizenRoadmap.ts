export interface RoadmapItem {
    id: string;
    title: string;
    description: string;
    themeTranslation?: string;
    status: 'done' | 'now' | 'next' | 'later';
    category: 'Core' | 'Feature' | 'Expansion' | 'System';
}

export const roadmapData: RoadmapItem[] = [
    // DONE - Shipped in V2
    {
        id: 'done-1',
        title: 'Offline Local Storage',
        description: 'Play Rizen without an internet connection. Your data saves locally and syncs when you reconnect.',
        themeTranslation: 'Independent Cultivation (No Sect Uplink required)',
        status: 'done',
        category: 'Core'
    },
    {
        id: 'done-2',
        title: 'Guest Sessions',
        description: 'Try the app immediately without creating an account. Wanderer mode with full migration path to a real account.',
        status: 'done',
        category: 'Core'
    },
    {
        id: 'done-3',
        title: 'Merchant\'s Log',
        description: 'A local-only daily expense tracker with fast entry, tag management, weekly receipt storage, and a "shred the ledger" reset mechanic.',
        themeTranslation: 'Merchant\'s Log',
        status: 'done',
        category: 'Feature'
    },
    {
        id: 'done-4',
        title: 'Dao Heart States & Qi Deviation',
        description: 'Consistency tracking with real consequences. Dropping your streak triggers Qi Deviation — narrative and mechanical penalties that must be overcome.',
        themeTranslation: 'Heavenly Tribulations & Qi Deviation',
        status: 'done',
        category: 'Feature'
    },

    // NOW - Currently in Development
    {
        id: 'now-1',
        title: 'Breakthrough Challenges',
        description: 'Special milestone tasks and trials required to level up past major progression caps.',
        themeTranslation: 'Enlightenment Trials',
        status: 'now',
        category: 'Feature'
    },
    {
        id: 'now-2',
        title: 'Mental Barrier Debuffs',
        description: 'Failure or inconsistency adds debuffs that you must overcome through specific tasks to maintain progress.',
        themeTranslation: 'Inner Demons',
        status: 'now',
        category: 'System'
    },

    // NEXT - Queued
    {
        id: 'next-1',
        title: 'Innate Affinities',
        description: 'Base modifiers that define your growth speed in different progression paths.',
        themeTranslation: 'Spirit Roots',
        status: 'next',
        category: 'System'
    },
    {
        id: 'next-2',
        title: 'Deep Focus Mode',
        description: 'A dedicated high-focus mode and timer for deep work sessions with doubled reward gains.',
        themeTranslation: 'Closed-Door Cultivation',
        status: 'next',
        category: 'Feature'
    },

    // LATER - Tier 3 (Richness) & Tier 4 (Endgame)
    {
        id: 'later-1',
        title: 'Prestige System',
        description: 'Reset your progress for permanent account-wide bonuses after reaching the maximum level.',
        themeTranslation: 'Reincarnation',
        status: 'later',
        category: 'Core'
    },
    {
        id: 'later-2',
        title: 'Community Guilds',
        description: 'Transition from solo tracking to social organizations, shared resources, and communal trials.',
        themeTranslation: 'Sect System (V3)',
        status: 'later',
        category: 'Expansion'
    },
    {
        id: 'later-3',
        title: 'Consequence Engine',
        description: 'A system where your everyday actions influence fortune and negative event frequency.',
        themeTranslation: 'Karma System',
        status: 'later',
        category: 'System'
    }
];