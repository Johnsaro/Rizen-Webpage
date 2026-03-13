export interface VaultItem {
  id: string;
  name: string;
  rank: 'S' | 'A' | 'B' | 'C' | 'F';
  type: 'ACTIVE_ARTIFACT' | 'CULTIVATION_PILL' | 'COSMETIC' | 'DAO_PATH';
  technicalSpecs: {
    label: string;
    value: string;
  }[];
  content: {
    title: string;
    description: string;
    codeBlock?: string;
    dataPoints?: string[];
  };
}

export const vaultContent: Record<string, VaultItem> = {
  'recon-script': {
    id: 'recon-script',
    name: 'AUTO-RECON SCRIPT',
    rank: 'A',
    type: 'ACTIVE_ARTIFACT',
    technicalSpecs: [
      { label: 'ENGINE', value: 'NMAP v7.92 / RUST_SCAN' },
      { label: 'THREADS', value: '256 / ADAPTIVE' },
      { label: 'EFFICIENCY', value: '+40% ENUM_SPEED' }
    ],
    content: {
      title: 'CULTIVATOR RECONNAISSANCE PROTOCOL',
      description: 'A multi-threaded automation engine for rapid network perimeter analysis. Designed to identify service banners and vulnerabilities before the target detects intrusion.',
      codeBlock: `./recon -t 10.10.10.0/24 --aggressive --no-ping --output-format json`,
      dataPoints: [
        'Port 22/tcp: Open | OpenSSH 8.2p1 Ubuntu 4ubuntu0.1',
        'Port 80/tcp: Open | Apache httpd 2.4.41 ((Ubuntu))',
        'Port 443/tcp: Open | nginx/1.18.0 (Ubuntu)',
        'Vulnerability Found: CVE-2021-41773 (Path Traversal)'
      ]
    }
  },
  'kernel-tamperer': {
    id: 'kernel-tamperer',
    name: 'THE KERNEL TAMPERER',
    rank: 'S',
    type: 'DAO_PATH',
    technicalSpecs: [
      { label: 'TARGET_OS', value: 'LINUX_KERNEL_v5.x' },
      { label: 'METHOD', value: 'LKM_INJECTION' },
      { label: 'PERSISTENCE', value: 'HIGH_STAKE' }
    ],
    content: {
      title: 'LOW-LEVEL MEMORY MANIPULATION',
      description: 'Advanced toolset for interacting directly with the OS kernel. Allows for process hiding, privilege escalation, and direct memory address overwriting.',
      codeBlock: `void* target_addr = 0xffffffff81000000;
copy_to_user(target_addr, payload, size);`,
      dataPoints: [
        'Ring 0 Access Required',
        'Memory Protection: KASLR Bypass Initialized',
        'Payload: reverse_tcp_shell (Staged)',
        'Status: Stealth Protocol Active'
      ]
    }
  },
  'focus-stim': {
    id: 'focus-stim',
    name: 'FOCUS STIM',
    rank: 'B',
    type: 'CULTIVATION_PILL',
    technicalSpecs: [
      { label: 'DURATION', value: '120 MIN' },
      { label: 'MODIFIER', value: '1.25x Qi' },
      { label: 'COOLDOWN', value: '24 HOURS' }
    ],
    content: {
      title: 'NEURAL CONCENTRATION PROTOCOL',
      description: 'Synthetic cognitive enhancement via timed deep-work sessions. Monitors heart rate and screen activity to ensure peak mental performance.',
      dataPoints: [
        'Cognitive Load: Optimized (88%)',
        'Distraction Prevention: Active',
        'Deep Work Dao Heart: 3/5 Days',
        'Next Milestone: Flow State Mastery'
      ]
    }
  }
};
