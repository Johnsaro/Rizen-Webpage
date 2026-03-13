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
    id: 'usr_new_cultivator',
    name: 'CULTIVATOR',
    class: 'Shadow Arts',
    level: 1,
    stats: {
        hp: {
            current: 100,
            max: 100
        },
        xp: {
            current: 0,
            max: 1000
        },
        rep: 0,
        streak: 0,
        classXP: {
            recon: 0,
            exploitation: 0,
            enumeration: 0
        }
    },
    quests: [
        {
            id: 'q_init_001',
            title: 'Initialize Sect Connection',
            type: 'Main Quest',
            timeRemaining: 'No limit',
            rewardXP: 500,
            progress: 10
        }
    ],
    arsenal: {
        equippedRow: [
            { id: 'w_001', name: 'Recon Blade', isUnlocked: true, isEquipped: true }
        ],
        grid: [
            { id: 'wg_001', name: 'Payload Injector', isUnlocked: false },
            { id: 'wg_002', name: 'Network Sniffer', isUnlocked: false },
            { id: 'wg_003', name: 'Kernel Exploit', isUnlocked: false },
            { id: 'wg_004', name: 'Zero-Day Module', isUnlocked: false }
        ],
        consumables: []
    },
    achievements: [
        { id: 'a_001', name: 'First Blood', isUnlocked: false },
        { id: 'a_002', name: 'Network Mapper', isUnlocked: false },
        { id: 'a_003', name: 'Script Kiddie No More', isUnlocked: false },
    ]
};
