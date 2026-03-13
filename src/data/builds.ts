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
    oneLineSummary: 'Cross-platform mobile system for real-world trial tracking.',
    description: 'The primary cultivator engagement interface for real-world trial tracking.',
    tags: ['Flutter', 'Supabase', 'Dart'],
    status: 'Live',
    systemStatus: 'online',
    image: '/assets/builds/rizen-mobile.png',
    created_date: '2026-03-08',
    intel: {
      brief: 'The official v1.0.0 release of the Rizen mobile cultivator interface. A cross-platform mobile application built with Flutter that gamifies life, featuring a full combat system, AI trial generation, and real-time synchronization.',
      patchNotes: [
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
      download: 'https://drive.google.com/uc?export=download&id=1ZDqUhyvSqRQK1M9MC2p4l-DVlC7siOMf'
    }
  },
  {
    id: 'pulse-agent',
    title: 'Pulse Agent 2.0',
    oneLineSummary: 'Autonomous desktop enforcer and health-monitoring agent for the Rizen ecosystem.',
    description: 'A professional desktop utility that acts as a resident agent, enforcing cultivator health protocols and productivity focus through real-time analytics.',
    tags: ['Python', 'PyQt6', 'Win32 API', 'Automation'],
    status: 'Live',
    systemStatus: 'online',
    image: '/assets/builds/pulse-agent.png',
    created_date: '2026-03-04',
    intel: {
      brief: 'Pulse Agent 2.0 is the desktop-side extension of the Rizen Mobile Protocol. It functions as an autonomous "Guardian" that monitors cultivator activity, enforces hydration/posture breaks, and provides a centralized Hub for productivity analytics.',
      patchNotes: [
        'v2.0: Full PyQt6 Dashboard Hub integration with Live Sync.',
        'v1.5: Activity Pulse engine for background monitoring.',
        'v1.2: SystemWatcher and Guardian Alert mascot implementation.',
        'v1.0: Core Win32 timer and overlay logic.'
      ],
      lessons: [
        'Resident agents require minimal CPU footprint to remain non-intrusive.',
        'PyQt6 provides a professional, hardware-accelerated interface for complex data visualization.',
        'Integrating with the Rizen brand identity (Pulse) creates a cohesive multi-platform experience.'
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
