import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface PlayerProfile {
  name: string;
  level: number;
  main_class: string;
  side_classes: string[];
  current_xp: number;
  rep: number;
  streak: number;
  hp: number;
  max_hp: number;
  onboarding_complete: boolean;
  is_admin?: boolean;
  account_status?: 'active' | 'banned' | 'suspended';
  ban_reason?: string;
  suspended_until?: string;
  achievements?: Record<string, string>; // ID: Date unlocked
  featured_achievement?: string;
  class_xp?: Record<string, number>;
  inventory?: Record<string, number>; // ItemID: Count
  equipped_weapon?: string;
  equipped_cosmetics?: Record<string, string>;
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
      setProfile(null);
      setQuests([]);
      setNotifications([]);
      setBounties([]);
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
