export type EventStatus = 'upcoming' | 'live' | 'ended';
export type SubmissionStatus = 'received' | 'confirmed' | 'fixed' | 'rewarded' | 'rejected';

export interface RizenEvent {
    id: string;
    slug: string;
    title: string;
    tagline: string;
    description: string;
    status: EventStatus;
    startDate: string;
    endDate: string;
    rewards: string[]; // e.g., ["Elite Badge", "10,000 REP", "Discord Role"]
    rules: string[];
    eligibility: string;
    submissionFields: string[]; // e.g., ["Title", "Description", "Steps to Reproduce", "Proof"]
    scoringRules: string;
    featured: boolean;
    icon: string;
    ctaLabel: string;
    createdAt: string;
}

export interface EventSubmission {
    id: string;
    eventId: string;
    userId: string;
    title: string;
    description: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    affectedArea: string;
    proofLinks: string;
    stepsToReproduce: string;
    expected: string;
    actual: string;
    status: SubmissionStatus;
    score?: number;
    createdAt: string;
}

export const rizenEvents: RizenEvent[] = [
    {
        id: 'bb-v1',
        slug: 'bug-bounty-v1',
        title: 'Project Zero: Bug Bounty',
        tagline: 'Help secure the Guild. Hunt bugs, earn Rep.',
        description: 'The Rizen Guild network is expanding rapidly, and vulnerability testing is crucial. Participate in our first official bug bounty program to identify stability, calculation, or security issues within the Alpha release. Every confirmed bug strengthens the protocol. Help us secure the environment, and be richly rewarded.',
        status: 'live',
        startDate: '2026-03-01T00:00:00Z',
        endDate: '2026-04-01T00:00:00Z',
        rewards: [
            "Bug Hunter Badge (Profile Cosmetic)",
            "10,000 REP per Critical execution",
            "5,000 REP per High",
            "2,500 REP per Medium",
            "1,000 REP per Low",
            "'The Exterminator' Discord Role for Top 5"
        ],
        rules: [
            "Do not perform DDoS or automated brute-force attacks against the Supabase backend.",
            "Issues must be reproducible on the latest client version.",
            "Duplicates will only reward the first reporter.",
            "Do not exfiltrate or manipulate data belonging to other operatives.",
            "Provide video or reproducible steps for UI bugs."
        ],
        eligibility: 'All registered Rizen Alpha users with an active Operative ID are eligible.',
        submissionFields: ['title', 'severity', 'affectedArea', 'description', 'stepsToReproduce', 'expected', 'actual', 'proofLinks'],
        scoringRules: 'Submissions are graded by the core dev team within 48 hours. Severity is classified based on CVSS standard equivalence for web apps.',
        featured: true,
        icon: '🪲',
        ctaLabel: 'Enter the Hunt',
        createdAt: '2026-02-28T12:00:00Z'
    },
    {
        id: 'cc-s1',
        slug: 'consistency-challenge-s1',
        title: '7-Day Ascendancy',
        tagline: 'Prove your commitment. Never break the streak.',
        description: 'A pure consistency challenge. Log into the protocol, complete your baseline objectives, and maintain a 7-day unbroken chain of progress. The path to power starts with showing up.',
        status: 'ended',
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-01-08T00:00:00Z',
        rewards: [
            "Ascendant Badge",
            "5,000 Flat REP",
            "3x XP Surge Consumable"
        ],
        rules: [
            "Check-ins must be consecutive.",
            "Minimum 100 XP earned per day.",
            "Timezone defaults to UTC."
        ],
        eligibility: 'Open to all.',
        submissionFields: [],
        scoringRules: 'Pass/Fail based on system logs.',
        featured: false,
        icon: '🔗',
        ctaLabel: 'View Results',
        createdAt: '2025-12-25T12:00:00Z'
    }
];

// Mock Top Submissions Data for the Bug Bounty Leaderboard
export const mockBugSubmissions: EventSubmission[] = [
    {
        id: 'sub-001',
        eventId: 'bb-v1',
        userId: 'V0idWalker',
        title: 'Auth Token Leakage on Deep Link Re-entry',
        description: 'Mock',
        severity: 'Critical',
        affectedArea: 'Auth Service',
        proofLinks: 'Mock',
        stepsToReproduce: 'Mock',
        expected: 'Mock',
        actual: 'Mock',
        status: 'rewarded',
        score: 10000,
        createdAt: '2026-03-02T10:00:00Z'
    },
    {
        id: 'sub-002',
        eventId: 'bb-v1',
        userId: 'NeoConstruct',
        title: 'XP Duplication exploit during network rollback',
        description: 'Mock',
        severity: 'High',
        affectedArea: 'GameService Sync',
        proofLinks: 'Mock',
        stepsToReproduce: 'Mock',
        expected: 'Mock',
        actual: 'Mock',
        status: 'rewarded',
        score: 5000,
        createdAt: '2026-03-03T14:30:00Z'
    },
    {
        id: 'sub-003',
        eventId: 'bb-v1',
        userId: 'GhostWire',
        title: 'Leaderboard fails to render on small screens',
        description: 'Mock',
        severity: 'Medium',
        affectedArea: 'UI / Guild Board',
        proofLinks: 'Mock',
        stepsToReproduce: 'Mock',
        expected: 'Mock',
        actual: 'Mock',
        status: 'rewarded',
        score: 2500,
        createdAt: '2026-03-04T09:15:00Z'
    }
];
