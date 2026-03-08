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
}

export function usePlayerProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setQuests([]);
      setLoading(false);
      return;
    }

    async function fetchProfileData() {
      setLoading(true);
      try {
        // Fetch Profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user?.id)
          .maybeSingle();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch Quests
        const { data: questData, error: questError } = await supabase
          .from('quests')
          .select('*')
          .eq('user_id', user?.id)
          .eq('is_completed', false);

        if (questError) throw questError;
        setQuests(questData || []);

      } catch (err: any) {
        console.error('Error fetching profile/quests:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();

    // Subscribe to changes
    const profileSubscription = supabase
      .channel('profile-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `user_id=eq.${user.id}` }, 
        (payload) => setProfile(payload.new as PlayerProfile))
      .subscribe();

    return () => {
      supabase.removeChannel(profileSubscription);
    };
  }, [user]);

  return { profile, quests, loading, error };
}
