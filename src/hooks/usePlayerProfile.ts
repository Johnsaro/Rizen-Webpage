/* 
 * Owner: Alex | Last updated by: Gemini, 2026-03-14 
 */
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface PlayerProfile {
  user_id: string;
  name: string;
  level: number;
  main_path: string;
  sect: string;
  qi: number;
  spirit_stones: number;
  dao_heart_streak: number;
  hp: number;
  max_hp: number;
  onboarding_complete: boolean;
  is_admin?: boolean;
  account_status?: 'active' | 'banned' | 'suspended';
  ban_reason?: string;
  suspended_until?: string;
  achievements?: Record<string, string>;
  featured_achievement?: string;
  path_qi?: Record<string, number>;
  path_level?: Record<string, number>;
  inventory?: Record<string, number>;
  equipped_weapon?: string;
  equipped_cosmetics?: Record<string, string>;
  talismans?: number;
  title?: string;
  realm?: string;
  realm_rank?: number;
  dao_heart_state?: string;
  trials_completed?: number;
  monsters_killed?: number;
  active_pills?: Record<string, string>;
  origin_platform?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  rank: string;
  type: string;
  xp_reward: number;
  class_tag: string;
  is_completed: boolean;
  current_step?: number;
  total_steps?: number;
  user_id?: string;
  created_at?: string;
}

export interface PlayerNotification {
  id: string;
  message: string;
  type: string;
  created_at: string;
  is_read: boolean;
}

export interface BountySubmission {
  id: string;
  title: string;
  status: string;
  severity: string;
  created_at: string;
}

export const GUEST_PREVIEW_PROFILE: PlayerProfile = {
  user_id: 'guest_preview',
  name: 'PREVIEW_CULTIVATOR',
  level: 15,
  main_path: 'Shadow Arts',
  sect: 'Shadow Arts',
  qi: 850,
  spirit_stones: 4500,
  dao_heart_streak: 12,
  hp: 100,
  max_hp: 100,
  onboarding_complete: true,
  achievements: {
    'heavenly_merit_1': '2026-03-01',
    'sect_founder': '2026-02-15',
    'anomaly_purger': '2026-03-10'
  },
  featured_achievement: 'heavenly_merit_1',
  inventory: {
    'legendary_artifact_01': 1,
    'spirit_stone_pouch': 5,
    'focus_pill': 10
  },
  equipped_weapon: 'legendary_artifact_01',
  path_qi: {
    'Shadow Arts': 1200,
    'Formation Master': 800,
    'Artifact Refiner': 1500
  }
};

export const GUEST_PREVIEW_QUESTS: Quest[] = [
  {
    id: 'preview_q1',
    title: 'Purge the Kernel Anomaly',
    description: 'A deep-seated corruption is spreading through the system core.',
    rank: 'RANK S',
    type: 'Infiltration',
    xp_reward: 500,
    class_tag: 'Shadow Arts',
    is_completed: false,
    current_step: 2,
    total_steps: 5
  },
  {
    id: 'preview_q2',
    title: 'Refine the Void Array',
    description: 'Construct a multi-layered formation to stabilize the sector.',
    rank: 'RANK A',
    type: 'Architecture',
    xp_reward: 350,
    class_tag: 'Formation Master',
    is_completed: false
  }
];

export const GUEST_PREVIEW_NOTIFICATIONS: PlayerNotification[] = [
  {
    id: 'n1',
    message: 'HEAVENLY TRIBULATION SURVIVED: +1,500 QI',
    type: 'system',
    created_at: new Date().toISOString(),
    is_read: false
  },
  {
    id: 'n2',
    message: 'NEW ARTIFACT DETECTED IN INVENTORY',
    type: 'item',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    is_read: true
  }
];

export const GUEST_PREVIEW_BOUNTIES: BountySubmission[] = [
  {
    id: 'b1',
    title: 'Buffer Overflow in Sect Gate',
    status: 'Validating',
    severity: 'CRITICAL',
    created_at: new Date().toISOString()
  }
];

export function usePlayerProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [notifications, setNotifications] = useState<PlayerNotification[]>([]);
  const [bounties, setBounties] = useState<BountySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(GUEST_PREVIEW_PROFILE);
      setQuests(GUEST_PREVIEW_QUESTS);
      setNotifications(GUEST_PREVIEW_NOTIFICATIONS);
      setBounties(GUEST_PREVIEW_BOUNTIES);
      setLoading(false);
      return;
    }

    async function fetchProfileData() {
      if (!user) return;
      setLoading(true);
      setError(null);
      
      try {
        // Fetch everything concurrently for better performance
        const [profileRes, questRes, notifRes, bountyRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
          supabase.from('quests').select('*').eq('user_id', user.id).eq('is_completed', false),
          supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
          supabase.from('bug_bounty_submissions').select('id, title, status, severity, created_at').eq('user_id', user.id).order('created_at', { ascending: false })
        ]);

        if (profileRes.error) throw profileRes.error;
        if (questRes.error) throw questRes.error;
        if (notifRes.error) throw notifRes.error;
        if (bountyRes.error) throw bountyRes.error;

        setProfile(profileRes.data);
        setQuests(questRes.data || []);
        setNotifications(notifRes.data || []);
        setBounties(bountyRes.data || []);

      } catch (err: any) {
        console.error('Error fetching profile data:', err);
        setError(err.message || 'FAILED TO SYNC WITH COORD-NET');
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();

    // Subscribe to profile changes - Ensure unique channel names and proper cleanup (W14)
    const profileChannel = `profile-updates-${user.id}-${Math.random().toString(36).slice(2, 9)}`;
    const profileSubscription = supabase
      .channel(profileChannel)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'profiles', 
        filter: `user_id=eq.${user.id}` 
      }, (payload) => {
        if (payload.new) setProfile(payload.new as PlayerProfile);
      })
      .subscribe();

    const notifChannel = `notif-updates-${user.id}-${Math.random().toString(36).slice(2, 9)}`;
    const notifSubscription = supabase
      .channel(notifChannel)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications', 
        filter: `user_id=eq.${user.id}` 
      }, () => fetchProfileData()) 
      .subscribe();

    const bountyChannel = `bounty-updates-${user.id}-${Math.random().toString(36).slice(2, 9)}`;
    const bountySubscription = supabase
      .channel(bountyChannel)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'bug_bounty_submissions', 
        filter: `user_id=eq.${user.id}` 
      }, () => fetchProfileData())
      .subscribe();

    return () => {
      supabase.removeChannel(profileSubscription);
      supabase.removeChannel(notifSubscription);
      supabase.removeChannel(bountySubscription);
    };
  }, [user]);

  return { profile, quests, notifications, bounties, loading, error };
}
