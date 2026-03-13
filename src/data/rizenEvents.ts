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
    howItWorks?: { step: string; title: string; desc: string }[];
    faqs?: { q: string; a: string }[];
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
        id: 'v1-launch',
        slug: 'v1-launch-celebration',
        title: 'v1.0.0 Launch Celebration',
        tagline: 'The protocol is live. Secure your first trial to unlock the Launch Badge.',
        description: 'Celebrating the official release of Rizen v1.0.0. All cultivators who complete at least one S-rank trial during the launch window will receive exclusive rewards. The sect is open, the board is set, and the time for stagnation is over.',
        status: 'live',
        startDate: '2026-03-08T00:00:00Z',
        endDate: '2026-03-15T23:59:59Z',
        rewards: [
            "v1.0.0 Founder Badge (Profile Cosmetic)",
            "5,000 Bonus Spirit Stones",
            "1x Focus Boost (1.5x Qi for 2 hours)"
        ],
        rules: [
            "Trial must be assigned by the System AI.",
            "Trial must be completed within the 24-hour window it was created.",
            "Only one badge per Cultivator ID.",
            "Must be on v1.0.0 or higher."
        ],
        eligibility: 'All registered Rizen cultivators.',
        submissionFields: [],
        scoringRules: 'Automatic verification via cultivator system logs upon trial completion.',
        featured: true,
        icon: '🚀',
        ctaLabel: 'Claim Your Trial',
        createdAt: '2026-03-08T00:00:00Z'
    },
    {
        id: 'bb-v1',
        slug: 'bug-bounty-v1',
        title: 'Project Zero: Bug Bounty',
        tagline: 'SYSTEM STATUS: BOUNTY IS LIVE',
        description: 'The Rizen Sect network is expanding rapidly, and vulnerability testing is crucial. Participate in our first official bug bounty program to identify stability, calculation, or security issues within the Alpha release. Every confirmed bug strengthens the protocol. Help us secure the environment, and be richly rewarded.',
        status: 'live',
        startDate: '2026-03-01T00:00:00Z',
        endDate: '2026-04-01T00:00:00Z',
        rewards: [
            "SSS-Tier (Critical): 15,000 Spirit Stones",
            "S-Tier (High): 7,500 Spirit Stones",
            "A-Tier (Medium): 3,500 Spirit Stones",
            "B-Tier (Low): 1,500 Spirit Stones",
            "Exclusive 'The Exterminator' Discord Role for top contributors"
        ],
        rules: [
            "Do not perform DDoS or automated brute-force attacks against the Supabase backend.",
            "Issues must be reproducible on the latest client version.",
            "Duplicates will only reward the first reporter.",
            "Do not exfiltrate or manipulate data belonging to other cultivators.",
            "Provide video or reproducible steps for UI bugs."
        ],
        howItWorks: [
            { step: '01', title: 'Identification', desc: 'Discover a bug, exploit, or visual inconsistency in the Rizen mobile app or showcase site.' },
            { step: '02', title: 'Reproduction', desc: 'Document clear, step-by-step instructions to reproduce the issue reliably.' },
            { step: '03', title: 'Transmission', desc: 'Submit your findings via the secure uplink on this page.' },
            { step: '04', title: 'Validation', desc: 'Our core architects will review the report and assign a tier reward within 48 hours.' }
        ],
        faqs: [
            { q: 'Who is eligible to participate?', a: 'Any registered cultivator with an active Rizen account can submit findings.' },
            { q: 'How are rewards distributed?', a: 'Spirit Stones are added directly to your Cultivator Profile once a finding is confirmed.' },
            { q: 'Can I submit multiple bugs?', a: 'Yes, there is no limit to the number of unique findings a cultivator can report.' },
            { q: 'What is considered a Critical (SSS-Tier) bug?', a: 'Anything involving unauthorized data access, reward calculation exploits, or server-side vulnerabilities.' }
        ],
        eligibility: 'All registered Rizen Alpha users with an active Cultivator ID are eligible.',
        submissionFields: ['title', 'severity', 'affectedArea', 'description', 'stepsToReproduce', 'expected', 'actual', 'proofLinks'],
        scoringRules: 'Submissions are graded by the core dev team based on impact and complexity.',
        featured: true,
        icon: '🪲',
        ctaLabel: 'Enter the Hunt',
        createdAt: '2026-02-28T12:00:00Z'
    },
    {
        id: 'cc-s1',
        slug: 'consistency-challenge-s1',
        title: '7-Day Ascendancy',
        tagline: 'Prove your commitment. Never break your Dao Heart.',
        description: 'A pure Dao Heart challenge. Log into the protocol, complete your baseline mandates, and maintain a 7-day unbroken chain of progress. The path to power starts with showing up.',
        status: 'ended',
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-01-08T00:00:00Z',
        rewards: [
            "Ascendant Badge",
            "5,000 Flat Spirit Stones",
            "3x Qi Surge Consumable"
        ],
        rules: [
            "Check-ins must be consecutive.",
            "Minimum 100 Qi earned per day.",
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
        title: 'Qi Duplication exploit during network rollback',
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
        affectedArea: 'UI / Sect Board',
        proofLinks: 'Mock',
        stepsToReproduce: 'Mock',
        expected: 'Mock',
        actual: 'Mock',
        status: 'rewarded',
        score: 2500,
        createdAt: '2026-03-04T09:15:00Z'
    }
];
