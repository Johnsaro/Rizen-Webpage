export interface BuildMedia {
  type: 'image' | 'gif' | 'diagram' | 'video';
  url: string;
  caption: string;
}

export interface Build {
  id: string;
  title: string;
  oneLineSummary: string;
  description: string;
  tags: string[];
  status: 'Live' | 'Beta' | 'Upcoming' | 'Archived' | 'WIP';
  systemStatus?: 'online' | 'maintenance' | 'down' | 'degraded' | 'archived';
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
    oneLineSummary: 'Cross-platform mobile system for real-world quest tracking.',
    description: 'The primary operative engagement interface for real-world quest tracking.',
    tags: ['Flutter', 'Supabase', 'Dart'],
    status: 'Live',
    systemStatus: 'online',
    image: '/assets/builds/rizen-mobile.png',
    created_date: '2026-03-08',
    intel: {
      brief: 'The official v1.0.0 release of the Rizen mobile operative interface. A cross-platform mobile application built with Flutter that gamifies life, featuring a full combat system, AI quest generation, and real-time synchronization.',
      patchNotes: [
        'v1.0.0: Official production release. Stability pass and final asset integration.',
        'v0.4.0: Achievement system implemented.',
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
      { type: 'image', url: '/assets/builds/rizen-ss1.png', caption: 'Character Profile & Stats' },
      { type: 'image', url: '/assets/builds/rizen-ss2.png', caption: 'Real-time Quest Board' },
      { type: 'image', url: '/assets/builds/rizen-ss3.png', caption: 'Neural Breach Combat Interface' },
      { type: 'image', url: '/assets/builds/rizen-ss4.png', caption: 'Guild Arsenal & Loadout' }
    ],
    links: {
      download: 'https://drive.google.com/uc?export=download&id=1ZDqUhyvSqRQK1M9MC2p4l-DVlC7siOMf'
    }
  },
  {
    id: 'pulse-agent',
    title: 'PulseAgent 2.0',
    oneLineSummary: 'Autonomous health and productivity enforcer for desktop environments.',
    description: 'Autonomous health and productivity enforcer with a real-time analytics dashboard and persistent desktop widget.',
    tags: ['Python', 'Automation', 'Desktop'],
    status: 'Upcoming',
    systemStatus: 'maintenance',
    image: '/assets/builds/pulse-agent.png',
    created_date: '2026-01-10',
    intel: {
      brief: 'A Windows background utility that monitors user activity to enforce hydration breaks and posture corrections using non-intrusive overlays.',
      patchNotes: [
        'v2.0: Added Activity Pulse logic.',
        'v1.1: Multi-monitor support.',
        'v1.0: Core timer logic.'
      ],
      lessons: [
        'Windows API interaction via pywin32 is powerful but requires careful resource handling.',
        'User experience for intrusive alerts must be highly customizable to avoid annoyance.'
      ]
    },
    media: [
      { type: 'video', url: '/assets/builds/Productivity_Tool_UI_Demo.mp4', caption: 'Productivity Tool UI Demo' },
      { type: 'image', url: '/assets/builds/pulse-app-dashboard.png', caption: 'Pulse // Hub Dashboard' },
      { type: 'image', url: '/assets/builds/bot_agent-removebg-preview.png', caption: 'Bot Agent Preview' }
    ],
    links: {
      demo: '#',
      repo: 'https://github.com/example/pulse-agent'
    }
  },
  {
    id: 'phantom-peel',
    title: 'PhantomPeel Forensics',
    oneLineSummary: 'Kernel-level driver enumeration and hardware identity integrity validator.',
    description: 'Kernel-level driver enumeration and hardware identity integrity validator.',
    tags: ['Python', 'Cybersecurity', 'Forensics', 'Win32'],
    status: 'Live',
    systemStatus: 'online',
    image: '/assets/builds/phantom-peel.png',
    created_date: '2026-02-26',
    intel: {
      brief: 'A specialized forensics utility designed to detect deep-seated traces of Windows kernel drivers and spoofer artifacts. It cross-references active IDs against hardware-rooted baselines to detect identity mismatches.',
      patchNotes: [
        'v1.1: Implemented Secure Boot and Test Signing state detection.',
        'v1.1: Added MAC OUI validation to flag locally administered addresses.',
        'v1.0: Core driver registry sweep and entropy-based artifact hunting.'
      ],
      lessons: [
        'Kernel namespace resolution (\\??\\) is required for accurate ImagePath mapping.',
        'Shannon entropy is an effective heuristic for detecting random-named spoofer payloads.',
        'Batch processing PowerShell signature checks significantly reduces scan latency.'
      ]
    },
    media: [
      { type: 'video', url: '/assets/builds/phantompeel-demo.mp4', caption: 'Kernel Sweep & Execution Overview' },
      { type: 'image', url: '/assets/builds/Phantom_peel.png', caption: 'Phantom Peel Preview' }
    ],
    links: {
      repo: 'https://github.com/Johnsaro/Phantom.git'
    }
  }
];
