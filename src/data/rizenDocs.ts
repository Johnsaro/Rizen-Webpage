export interface DocSubsection {
  id: string;
  title: string;
  content: string;
  items?: string[];
  code?: string;
  language?: string;
}

export interface DocSection {
  id: string;
  title: string;
  icon: string;
  summary: string;
  subsections: DocSubsection[];
}

export const rizenDocs: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: '🚀',
    summary: 'Initialize your operative profile and connect to the Guild network.',
    subsections: [
      {
        id: 'installation',
        title: 'Installation',
        content: 'Rizen is currently available in closed alpha. To begin, clone the repository and install the required dependencies.',
        code: `git clone https://github.com/rizen-guild/rizen.git\ncd rizen\nnpm install`,
        language: 'bash',
        items: [
          'Node.js 18+ required',
          'Ensure you have access to the early-preview branch'
        ]
      },
      {
        id: 'initialization',
        title: 'System Initialization',
        content: 'After dependencies are installed, you must link your local environment to the Supabase backend.',
        code: `npm run init:env\nnpm run dev`,
        language: 'bash'
      }
    ]
  },
  {
    id: 'core-architecture',
    title: 'Core Architecture',
    icon: '🏗️',
    summary: 'The technical foundation of the Rizen mobile protocol, built for resilience and real-time state synchronization.',
    subsections: [
      {
        id: 'design-philosophy',
        title: 'Design Philosophy',
        content: 'Rizen is built to never drop a frame or lose state during connectivity fluctuations. We prioritize optimistic UI updates backed by robust remote reconciliation.'
      },
      {
        id: 'component-tree',
        title: 'Component Structure',
        content: 'The application is divided into functional modules: Dashboard (Stats/Rank), Arsenal (Inventory/Weapons), Guild (Leaderboard/Events), and Core (Settings/Auth).'
      }
    ]
  },
  {
    id: 'tech-stack',
    title: 'Tech Stack',
    icon: '⚡',
    summary: 'The bleeding-edge technologies powering the Guild.',
    subsections: [
      {
        id: 'frontend',
        title: 'Frontend Client',
        content: 'The user interface is built for maximum performance and native fluid animations.',
        items: [
          'Framework: Flutter (Dart) / React for web portal',
          'Styling: Custom CSS/Theme Engine',
          'Animations: Framer Motion / Rive'
        ]
      },
      {
        id: 'backend',
        title: 'Backend Infrastructure',
        content: 'Scalable cloud architecture designed for low-latency synchronization.',
        items: [
          'Database: PostgreSQL',
          'Auth & Realtime: Supabase',
          'Edge Computing: Deno Edge Functions'
        ]
      }
    ]
  },
  {
    id: 'data-sync',
    title: 'Data & Sync (Supabase)',
    icon: '🔄',
    summary: 'Managing state across disjointed connectivity environments.',
    subsections: [
      {
        id: 'rollback-pattern',
        title: 'Snapshot-before-Mutate Pattern',
        content: 'Rizen employs a "Snapshot-before-Mutate" pattern. Before any local state update, a snapshot of the current state is taken. If the remote (Supabase) write fails, the system rolls back to the snapshot, ensuring zero data desynchronization.',
        code: `// Example Rollback Pattern
final previousState = _playerNotifier.value;
try {
  _playerNotifier.value = newState;
  await _supabase.saveProfile(newState);
} catch (e) {
  _playerNotifier.value = previousState;
  rethrow;
}`,
        language: 'dart'
      },
      {
        id: 'conflict-resolution',
        title: 'Conflict Resolution',
        content: 'When multiple devices modify the same operative profile, Rizen uses vector clocks and deterministic conflict resolution prioritizing the most difficult earned achievements.'
      }
    ]
  },
  {
    id: 'ai-quest-gen',
    title: 'AI Quest Generation',
    icon: '🤖',
    summary: 'The AI-driven administrative layer that manages the Guild Board and quest verification.',
    subsections: [
      {
        id: 'dynamic-quests',
        title: 'Dynamic Quest Generation',
        content: 'The Guild Master (GM) utilizes a specialized system prompt to validate real-world tasks and convert them into balanced in-game quests with appropriate XP weight and deadlines.',
        items: [
          'Task Validation: Prevents low-effort or duplicate entries.',
          'Context Awareness: Recognizes operative class and difficulty level.',
          'Verification Protocol: Requires proof of completion for high-rank rewards.'
        ]
      },
      {
        id: 'llm-integration',
        title: 'LLM Integration',
        content: 'We leverage OpenAI GPT-4o for dynamic parsing of unstructured productivity logs into structured Quest objects.',
        code: `const quest = await GuildMasterAI.parseLog(userEntry, context);
if (quest.confidenceScore > 0.85) {
  await dispatchQuest(quest);
}`,
        language: 'typescript'
      }
    ]
  },
  {
    id: 'security-model',
    title: 'Security Model (RLS)',
    icon: '🛡️',
    summary: 'Protecting operative data with Row Level Security.',
    subsections: [
      {
        id: 'rls-policies',
        title: 'Row Level Security',
        content: 'All database access is gated by strict RLS policies ensuring operatives can only mutate their own data while allowing read-only access for global leaderboards.',
        code: `create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );`,
        language: 'sql'
      }
    ]
  },
  {
    id: 'progression-system',
    title: 'Progression (XP/REP/VLD)',
    icon: '📈',
    summary: 'Tracking growth through XP, reputation, and meaningful milestones.',
    subsections: [
      {
        id: 'metrics-defined',
        title: 'Core Metrics',
        content: 'Operatives are measured on three primary vertical axes.',
        items: [
          'XP: Class-specific experience points used to level up and unlock abilities.',
          'REP (Reputation): Guild-wide currency earned through consistency.',
          'VLD (Validation Rate): The percentage of quests successfully verified by the GM.'
        ]
      },
      {
        id: 'achievements',
        title: 'Achievement Catalog',
        content: 'A system of 18 unique achievements across four categories: Consistency, Combat, Quests, and Knowledge.'
      }
    ]
  },
  {
    id: 'faq-troubleshooting',
    title: 'FAQ / Troubleshooting',
    icon: '❓',
    summary: 'Common issues and their resolutions.',
    subsections: [
      {
        id: 'sync-issues',
        title: 'State Desynchronization',
        content: 'If your local state falls out of sync with the Guild servers, navigate to Settings > Network and initiate a "Force State Reconcile".'
      },
      {
        id: 'auth-failures',
        title: 'Authentication Failures',
        content: 'Ensure your session token has not expired. The UI should prompt a re-login automatically, but clearing the application cache will force a new session if stuck.'
      }
    ]
  }
];
