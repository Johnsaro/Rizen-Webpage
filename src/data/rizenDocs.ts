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
    summary: 'Initialize your cultivator profile and connect to the Sect network.',
    subsections: [
      {
        id: 'installation',
        title: 'Installation',
        content: 'Rizen v2.2.0 is distributed as an Android APK. Cultivators must download the package and side-load it onto their mobile device.',
        code: `// 1. Download the v2.2.0 APK from the Builds board\n// 2. Enable "Install Unknown Apps" in Android Settings\n// 3. Open the APK file to initiate installation`,
        language: 'bash',
        items: [
          'Android 10+ recommended',
          'Minimum 150MB free storage',
          'Active data connection for profile sync'
        ]
      },
      {
        id: 'initialization',
        title: 'System Initialization',
        content: 'Upon first launch, you must authorize the application via the Sect Secure Uplink (Supabase Auth).',
        code: `Step 1: Launch Rizen App\nStep 2: Select "INITIALIZE PROFILE"\nStep 3: Enter cultivator credentials`,
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
        content: 'The application is divided into functional modules: Dashboard (Stats/Rank), Spiritual Artifacts (Inventory/Artifacts), Sect (Leaderboard/Events), and Core (Settings/Auth).'
      }
    ]
  },
  {
    id: 'tech-stack',
    title: 'Tech Stack',
    icon: '⚡',
    summary: 'The bleeding-edge technologies powering the Sect.',
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
        content: 'When multiple devices modify the same cultivator profile, Rizen uses vector clocks and deterministic conflict resolution prioritizing the most difficult earned achievements.'
      }
    ]
  },
  {
    id: 'ai-quest-gen',
    title: 'AI Trial Generation',
    icon: '🤖',
    summary: 'The AI-driven administrative layer that manages the Sect Board and trial verification.',
    subsections: [
      {
        id: 'dynamic-quests',
        title: 'Dynamic Trial Generation',
        content: 'The System AI utilizes a specialized system prompt to validate real-world tasks and convert them into balanced in-game trials with appropriate Qi weight and deadlines.',
        items: [
          'Task Validation: Prevents low-effort or duplicate entries.',
          'Context Awareness: Recognizes cultivator path and difficulty level.',
          'Verification Protocol: Requires proof of completion for high-rank rewards.'
        ]
      },
      {
        id: 'llm-integration',
        title: 'LLM Integration',
        content: 'We leverage OpenAI GPT-4o for dynamic parsing of unstructured productivity logs into structured Trial objects.',
        code: `const trial = await SystemAI.parseLog(userEntry, context);
if (trial.confidenceScore > 0.85) {
  await dispatchTrial(trial);
}`,
        language: 'typescript'
      }
    ]
  },
  {
    id: 'security-model',
    title: 'Security Model (RLS)',
    icon: '🛡️',
    summary: 'Protecting cultivator data with Row Level Security.',
    subsections: [
      {
        id: 'rls-policies',
        title: 'Row Level Security',
        content: 'All database access is gated by strict RLS policies ensuring cultivators can only mutate their own data while allowing read-only access for global leaderboards.',
        code: `create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );`,
        language: 'sql'
      }
    ]
  },
  {
    id: 'progression-system',
    title: 'Progression (Qi/Spirit Stones/VLD)',
    icon: '📈',
    summary: 'Tracking growth through Qi, spirit stones, and meaningful milestones.',
    subsections: [
      {
        id: 'metrics-defined',
        title: 'Core Metrics',
        content: 'Cultivators are measured on three primary vertical axes.',
        items: [
          'Qi: Path-specific experience points used to rank up and unlock abilities.',
          'Spirit Stones: Sect-wide currency earned through consistency.',
          'VLD (Validation Rate): The percentage of trials successfully verified by the System.'
        ]
      },
      {
        id: 'achievements',
        title: 'Heavenly Merit Catalog',
        content: 'A system of 18 unique merits across four categories: Consistency, Combat, Trials, and Knowledge.'
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
        content: 'If your local state falls out of sync with the Sect servers, navigate to Settings > Network and initiate a "Force State Reconcile".'
      },
      {
        id: 'auth-failures',
        title: 'Authentication Failures',
        content: 'Ensure your session token has not expired. The UI should prompt a re-login automatically, but clearing the application cache will force a new session if stuck.'
      }
    ]
  }
];
