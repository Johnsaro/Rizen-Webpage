import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './AdminOverview.css';

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeThisWeek: 0,
    totalBounties: 0,
    totalRep: 0,
    criticalBounties: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [topLevels, setTopLevels] = useState<any[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [transmitting, setTransmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, bountiesRes, profilesRes, topRes] = await Promise.all([
        supabase.from('profiles').select('user_id, created_at, rep'),
        supabase.from('bug_bounty_submissions').select('severity, status'),
        supabase.from('profiles').select('name, created_at, main_class').order('created_at', { ascending: false }).limit(8),
        supabase.from('profiles').select('name, level, main_class').order('level', { ascending: false }).limit(6)
      ]);

      const users = usersRes.data || [];
      const bounties = bountiesRes.data || [];
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      setStats({
        totalUsers: users.length,
        activeThisWeek: users.filter(u => new Date(u.created_at) > oneWeekAgo).length,
        totalBounties: bounties.length,
        totalRep: users.reduce((acc, curr) => acc + (curr.rep || 0), 0),
        criticalBounties: bounties.filter(b => b.severity === 'Critical' && b.status !== 'fixed' && b.status !== 'rewarded').length
      });

      setRecentActivity(profilesRes.data || []);
      setTopLevels(topRes.data || []);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    
    setTransmitting(true);
    try {
      const { data: users, error: fetchError } = await supabase
        .from('profiles')
        .select('user_id')
        .or('is_admin.eq.false,is_admin.is.null');
      
      if (fetchError) throw fetchError;
      if (!users || users.length === 0) {
        alert('NO OPERATIVES FOUND TO BROADCAST TO');
        return;
      }

      const notifications = users.map(u => ({
        user_id: u.user_id,
        message: `SYSTEM BROADCAST: ${broadcastMessage}`,
        type: 'broadcast',
        is_read: false
      }));

      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notifications);
      
      if (insertError) throw insertError;

      alert(`BROADCAST TRANSMITTED TO ${users.length} OPERATIVES`);
      setBroadcastMessage('');
    } catch (err: any) {
      console.error('Broadcast error:', err);
      alert('TRANSMISSION FAILED: ' + err.message);
    } finally {
      setTransmitting(false);
    }
  };

  if (loading) return <div className="abc-loading">// CALCULATING SITE-WIDE METRICS...</div>;

  return (
    <div className="admin-overview">
      {/* Stats Section */}
      <div className="abc-stats">
        <div className="abc-stat" style={{ '--stat-accent': 'var(--hk-cyan)', '--stat-accent-rgb': '0, 255, 200' } as React.CSSProperties}>
          <span className="abc-stat-label">Total Operatives</span>
          <span className="abc-stat-value">{stats.totalUsers}</span>
        </div>
        <div className="abc-stat" style={{ '--stat-accent': 'var(--hk-green)', '--stat-accent-rgb': '57, 217, 138' } as React.CSSProperties}>
          <span className="abc-stat-label">New This Week</span>
          <span className="abc-stat-value">+{stats.activeThisWeek}</span>
        </div>
        <div className="abc-stat" style={{ '--stat-accent': 'var(--hk-amber)', '--stat-accent-rgb': '255, 184, 0' } as React.CSSProperties}>
          <span className="abc-stat-label">Total REP Issued</span>
          <span className="abc-stat-value">{(stats.totalRep / 1000).toFixed(1)}k</span>
        </div>
        <div className="abc-stat" style={{ '--stat-accent': 'var(--hk-red)', '--stat-accent-rgb': '255, 59, 92' } as React.CSSProperties}>
          <span className="abc-stat-label">Active Criticals</span>
          <span className="abc-stat-value">{stats.criticalBounties}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        
        {/* Recent Signups */}
        <div className="dash-card signup-card">
          <div className="card-header">
            <h3 className="card-title text-cyan">RECENT_SIGNUPS</h3>
          </div>
          <div className="card-content">
            <div className="log-entries">
              {recentActivity.map((activity, i) => (
                <div key={i} className="log-entry-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span className="log-timestamp">
                      [{new Date(activity.created_at).toLocaleDateString()} {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]
                    </span>
                    <span className="log-timestamp" style={{ color: 'var(--hk-cyan)', opacity: 0.8 }}>NEW_USER</span>
                  </div>
                  <div className="log-msg">
                    <span style={{ color: '#fff', fontWeight: 600 }}>{activity.name}</span>
                    <span style={{ marginLeft: '0.5rem', opacity: 0.6 }}>({activity.main_class})</span>
                    <span style={{ marginLeft: '0.5rem', opacity: 0.8 }}>authorized for duty.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Broadcast */}
        <div className="dash-card broadcast-card">
          <div className="card-header">
            <h3 className="card-title text-amber">SYSTEM_BROADCAST</h3>
          </div>
          <div className="card-content">
            <p className="broadcast-desc">Dispatch a high-priority global notification to all registered operatives via the encrypted COORD-NET link.</p>
            <textarea 
              className="broadcast-textarea" 
              placeholder="Enter transmission content..." 
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
            />
            <button 
              className="abc-sync-btn broadcast-btn" 
              onClick={handleBroadcast}
              disabled={transmitting}
            >
              {transmitting ? 'TRANSMITTING...' : '⚡ TRANSMIT BROADCAST'}
            </button>
          </div>
        </div>

        {/* Top Level Operatives */}
        <div className="dash-card operatives-card">
          <div className="card-header">
            <h3 className="card-title text-green">TOP_LEVEL_OPERATIVES</h3>
          </div>
          <div className="card-content">
            <div className="ops-grid">
              {topLevels.map((user, i) => (
                <div key={i} className="op-row">
                  <span className="op-rank">#{i+1}</span>
                  <div className="op-name-wrap">
                    <span className="op-name">{user.name}</span>
                    <span className="op-class">{user.main_class}</span>
                  </div>
                  <span className="op-lvl-badge">LVL {user.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminOverview;

