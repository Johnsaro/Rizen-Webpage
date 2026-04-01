export interface BuildMedia {
  type: 'image' | 'gif' | 'diagram' | 'video';
  url: string;
  caption: string;
}

export type BuildDevStatus = 'live' | 'maintenance' | 'stable' | 'dev';

export interface Build {
  id: string;
  title: string;
  oneLineSummary: string;
  description: string;
  tags: string[];
  status: 'Live' | 'Beta' | 'Upcoming' | 'Archived' | 'WIP';
  systemStatus?: 'online' | 'maintenance' | 'down' | 'degraded' | 'archived';
  version: string;
  accentRgb: string;
  devStatus: BuildDevStatus;
  flagship?: boolean;
  image: string;
  created_date: string;
  intel: {
    brief: string;
    patchNotes: string[];
    lessons: string[];
  };
  media?: BuildMedia[];
  links: {
    demo?: string;
    repo?: string;
    download?: string;
  };
}

export const builds: Build[] = [
  {
    id: 'rizen-mobile',
    title: 'Rizen Mobile Protocol',
    oneLineSummary: 'Cross-platform mobile system for real-world trial tracking.',
    description: 'The primary cultivator engagement interface for real-world trial tracking.',
    tags: ['Flutter', 'Supabase', 'Dart'],
    status: 'Live',
    systemStatus: 'online',
    version: 'v2.3.2',
    accentRgb: '16, 185, 129',
    devStatus: 'live',
    flagship: true,
    image: '/assets/builds/rizen-mobile.png',
    created_date: '2026-03-08',
    intel: {
      brief: 'The official v2.3.2 release of the Rizen mobile cultivator interface. A cross-platform mobile application built with Flutter that gamifies life, featuring a full combat system, AI trial generation, real-time synchronization, and a local-only Merchant\'s Log for expense tracking.',
      patchNotes: [
        'v2.3.2: Latest stable release with bug fixes and refinements.',
        'v2.2.0: Introduced Merchant\'s Log (local SQLite expense tracker) with Coin Purse & Ledger tabs. Earn Qi for logging expenses.',
        'v1.0.0: Official production release. Stability pass and final asset integration.',
        'v0.4.0: Heavenly Merit system implemented.',
        'v0.3.5: Combat system Phase 1-4 completed.',
        'v0.3.0: Supabase migration for cloud profiles.'
      ],
      lessons: [
        'Release cycles require rigorous APK validation across physical hardware.',
        'State management with ValueNotifier is highly efficient for small-to-medium RPG logic.',
        'Supabase Row Level Security (RLS) is critical for multi-user data integrity.'
      ]
    },
    media: [
      { type: 'video', url: 'RIZEN_MOBILE_PROTOCOL_VIDEO', caption: 'RIZEN_MOBILE_PROTOCOL_BOOT' },
      { type: 'image', url: '/assets/builds/rizen-ss1.png', caption: 'Character Profile & Stats' },
      { type: 'image', url: '/assets/builds/rizen-ss2.png', caption: 'Real-time Trial Board' },
      { type: 'image', url: '/assets/builds/rizen-ss3.png', caption: 'Neural Breach Combat Interface' },
      { type: 'image', url: '/assets/builds/rizen-ss4.png', caption: 'Spiritual Artifacts & Loadout' }
    ],
    links: {
      repo: 'https://github.com/Johnsaro/Rizen',
      download: 'dynamic'
    }
  },
  {
    id: 'gridspace',
    title: 'GridSpace',
    oneLineSummary: 'A vibe coding suite — terminal grid, session tracking, and dev cockpit.',
    description: 'A Tauri v2 desktop application built for managing coding sessions. Multi-pane terminal grid, project dashboard, journal viewer, security scanning, and Claude Code integration.',
    tags: ['Tauri v2', 'React', 'Rust', 'TypeScript', 'xterm.js'],
    status: 'WIP',
    systemStatus: 'maintenance',
    version: 'v0.1.0',
    accentRgb: '139, 92, 246',
    devStatus: 'dev',
    image: '',
    created_date: '2026-03-25',
    intel: {
      brief: 'GridSpace is the workspace where everything else gets built. A Tauri v2 desktop app with a Rust backend powering native PTY terminals, filesystem access, and clipboard interception. The React frontend provides a multi-pane terminal grid with configurable layouts, session presets, a project dashboard, journal viewer, security log, and real-time Claude Code usage monitoring.',
      patchNotes: [
        'v0.1.0: Core terminal grid with PTY spawn, multi-pane layouts, and tab support.',
        'v0.1.0: Grid Launcher with session presets, layout picker, and tool permissions.',
        'v0.1.0: Journal viewer, Project Dashboard, Command Center with System Pulse.',
        'v0.1.0: Security Log with clipboard secret scanning and git security audit.',
        'v0.1.0: Settings page with shell config, theme picker, and custom shell support.',
        'v0.1.0: Session logging integration with Claude Code via status bar.'
      ],
      lessons: [
        'Tauri v2 with Rust backend provides native-level performance for PTY management without Electron overhead.',
        'Two-phase PTY initialization (spawn → listen → start reader) eliminates output race conditions.',
        'Building your own tools teaches you what you actually need vs. what looks impressive.'
      ]
    },
    links: {}
  },
  {
    id: 'pulse-agent',
    title: 'Pulse Agent 2.0',
    oneLineSummary: 'Autonomous desktop enforcer and health-monitoring agent.',
    description: 'A desktop utility that monitors activity, enforces health protocols, and provides productivity analytics through a Guardian mascot system.',
    tags: ['Python', 'PyQt6', 'Win32 API', 'Automation'],
    status: 'Live',
    systemStatus: 'online',
    version: 'v2.0',
    accentRgb: '0, 228, 255',
    devStatus: 'stable',
    image: '/assets/builds/pulse-agent.png',
    created_date: '2026-03-04',
    intel: {
      brief: 'Pulse Agent 2.0 is a desktop productivity guardian. It monitors cultivator activity, enforces hydration and posture breaks, tracks active window time and idle periods, and provides a centralized Dashboard Hub for real-time analytics.',
      patchNotes: [
        'v2.0: Full PyQt6 Dashboard Hub integration with Live Sync.',
        'v1.5: Activity Pulse engine for background monitoring.',
        'v1.2: SystemWatcher and Guardian Alert mascot implementation.',
        'v1.0: Core Win32 timer and overlay logic.'
      ],
      lessons: [
        'Resident agents require minimal CPU footprint to remain non-intrusive.',
        'PyQt6 provides a professional, hardware-accelerated interface for complex data visualization.',
        'Win32 API integration enables deep system-level monitoring without elevated privileges.'
      ]
    },
    media: [
      { type: 'video', url: 'PULSE_AGENT_PROTOCOL_VIDEO', caption: 'PULSE_AGENT_PROTOCOL_SYNC' },
      { type: 'image', url: '/assets/builds/pulse-app-dashboard.png', caption: 'Pulse // Hub Dashboard' },
      { type: 'image', url: '/assets/builds/bot_agent-removebg-preview.png', caption: 'Guardian Mascot Interface' }
    ],
    links: {
      repo: 'https://github.com/Johnsaro/PulseAgent.git'
    }
  },
  {
    id: 'phantom-peel',
    title: 'Phantom Peel Forensics',
    oneLineSummary: 'Kernel-level driver enumeration and hardware identity integrity validator.',
    description: 'A professional-grade forensics utility designed to validate system integrity by detecting kernel-level driver artifacts and hardware identity mismatches.',
    tags: ['Python', 'Cybersecurity', 'Forensics', 'Win32 API'],
    status: 'Live',
    systemStatus: 'online',
    version: 'v1.1',
    accentRgb: '244, 63, 94',
    devStatus: 'stable',
    image: '/assets/builds/phantom-peel.png',
    created_date: '2026-02-26',
    intel: {
      brief: 'Phantom Peel functions as the forensics layer of the Rizen ecosystem. It is designed to perform deep-seated traces of Windows kernel drivers and spoofer artifacts, ensuring that cultivator hardware baselines remain untampered and authentic.',
      patchNotes: [
        'v1.1: Implemented Secure Boot and Test Signing state detection.',
        'v1.1: Added MAC OUI validation to flag locally administered addresses.',
        'v1.0: Core driver registry sweep and entropy-based artifact hunting.'
      ],
      lessons: [
        'Kernel namespace resolution is required for accurate ImagePath mapping across isolated environments.',
        'Heuristic-based entropy checks are highly effective at identifying randomized spoofer payloads.',
        'Validation of hardware-rooted baselines is the only way to ensure true system identity integrity.'
      ]
    },
    media: [
      { type: 'video', url: 'PHANTOM_PEEL_PROTOCOL_VIDEO', caption: 'PHANTOM_PEEL_FORENSICS_BOOT' },
      { type: 'image', url: '/assets/builds/Phantom_peel.png', caption: 'Phantom Peel Forensic Interface' }
    ],
    links: {
      repo: 'https://github.com/Johnsaro/Phantom.git'
    }
  }
];
