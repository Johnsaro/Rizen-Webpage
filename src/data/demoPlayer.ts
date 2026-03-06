export interface ClassXP {
    recon: number;
    exploitation: number;
    enumeration: number;
}

export interface PlayerStats {
    hp: {
        current: number;
        max: number;
    };
    xp: {
        current: number;
        max: number;
    };
    rep: number;
    streak: number;
    classXP: ClassXP;
}

export interface Quest {
    id: string;
    title: string;
    type: 'Daily' | 'Main Quest' | 'Side Quest';
    timeRemaining: string;
    rewardXP: number;
    rewardRep?: number;
    progress: number; // 0 to 100
}

export interface Weapon {
    id: string;
    name: string;
    isUnlocked: boolean;
    isEquipped?: boolean;
}

export interface Consumable {
    id: string;
    name: string;
    count: number;
    isActive?: boolean;
    timeRemaining?: string;
}

export interface Achievement {
    id: string;
    name: string;
    isUnlocked: boolean;
}

export interface DemoPlayer {
    id: string;
    name: string;
    class: string;
    level: number;
    stats: PlayerStats;
    quests: Quest[];
    arsenal: {
        equippedRow: Weapon[];
        grid: Weapon[];
        consumables: Consumable[];
    };
    achievements: Achievement[];
}

export const demoPlayer: DemoPlayer = {
    id: 'usr_mock_001',
    name: 'SHADOW-7',
    class: 'Security Analyst',
    level: 14,
    stats: {
        hp: {
            current: 85,
            max: 100
        },
        xp: {
            current: 2450,
            max: 3000
        },
        rep: 1240,
        streak: 7,
        classXP: {
            recon: 80,
            exploitation: 40,
            enumeration: 60
        }
    },
    quests: [
        {
            id: 'q_001',
            title: 'Deploy Nmap Scan on Target Network',
            type: 'Daily',
            timeRemaining: '4h remaining',
            rewardXP: 120,
            progress: 60
        },
        {
            id: 'q_002',
            title: 'Complete OWASP Top 10 Module',
            type: 'Main Quest',
            timeRemaining: '3 days remaining',
            rewardXP: 500,
            progress: 30
        },
        {
            id: 'q_003',
            title: 'Review Burp Suite Intercept Logs',
            type: 'Side Quest',
            timeRemaining: '8h remaining',
            rewardXP: 80,
            progress: 90
        }
    ],
    arsenal: {
        equippedRow: [
            { id: 'w_001', name: 'Recon Blade', isUnlocked: true, isEquipped: true },
            { id: 'w_002', name: 'Debug Shield', isUnlocked: true, isEquipped: true }
        ],
        grid: [
            { id: 'wg_001', name: 'Payload Injector', isUnlocked: true },
            { id: 'wg_002', name: 'Network Sniffer', isUnlocked: true },
            { id: 'wg_003', name: 'Kernel Exploit', isUnlocked: false },
            { id: 'wg_004', name: 'Zero-Day Module', isUnlocked: false }
        ],
        consumables: [
            { id: 'c_001', name: 'Health Potion', count: 3 },
            { id: 'c_002', name: 'Shield Charge', count: 1 },
            { id: 'c_003', name: 'Focus Boost', count: 1, isActive: true, timeRemaining: '1h 23m' }
        ]
    },
    achievements: [
        { id: 'a_001', name: 'First Blood', isUnlocked: true },
        { id: 'a_002', name: 'Network Mapper', isUnlocked: true },
        { id: 'a_003', name: 'Script Kiddie No More', isUnlocked: true },
        { id: 'a_004', name: 'WEEK WARRIOR', isUnlocked: true },
        { id: 'a_005', name: 'Vulnerability Found', isUnlocked: true },
        { id: 'a_006', name: 'Social Engineer', isUnlocked: true },
        { id: 'a_007', name: 'Root Access', isUnlocked: true },
        { id: 'a_008', name: 'Defaced', isUnlocked: false },
        { id: 'a_009', name: 'Ghost in the Machine', isUnlocked: false },
        { id: 'a_010', name: 'Zero Trace', isUnlocked: false },
        { id: 'a_011', name: 'Master Exploiter', isUnlocked: false },
    ]
};
