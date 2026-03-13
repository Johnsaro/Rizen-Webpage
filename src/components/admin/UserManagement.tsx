import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { PlayerProfile } from '../../hooks/usePlayerProfile';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<PlayerProfile | null>(null);
  const [actionModal, setActionModal] = useState<'ban' | 'suspend' | null>(null);
  const [reason, setReason] = useState('');
  const [suspendUntil, setSuspendUntil] = useState('');
  const [durationOption, setDurationOption] = useState<string>('24h');
  const [updating, setUpdating] = useState(false);

  const durationOptions = [
    { label: '1 HOUR', value: '1h' },
    { label: '24 HOURS', value: '24h' },
    { label: '3 DAYS', value: '3d' },
    { label: '7 DAYS', value: '7d' },
    { label: 'CUSTOM', value: 'custom' },
  ];

  const calculateSuspendUntil = (option: string) => {
    const now = new Date();
    let targetDate;
    if (option === '1h') targetDate = new Date(now.getTime() + 60 * 60 * 1000);
    else if (option === '24h') targetDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    else if (option === '3d') targetDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    else if (option === '7d') targetDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    else return '';

    // Format to YYYY-MM-DDTHH:mm for datetime-local input
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const hours = String(targetDate.getHours()).padStart(2, '0');
    const minutes = String(targetDate.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (actionModal === 'suspend' && durationOption !== 'custom') {
      setSuspendUntil(calculateSuspendUntil(durationOption));
    }
  }, [actionModal, durationOption]);

  const fetchUsers = async (isManual = false) => {
    setLoading(true);
    try {
      // Use .or to catch both false and NULL is_admin values
      // This ensures new users who haven't had the default 'false' applied yet are still seen
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or('is_admin.eq.false,is_admin.is.null')
        .order('level', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
      
      // Briefly show success if it's a manual refresh
      if (isManual) {
        const btn = document.querySelector('.abc-sync-btn');
        if (btn) {
          const originalText = btn.innerHTML;
          btn.innerHTML = 'DATABASE SYNCED ✓';
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2000);
        }
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(false);
  }, []);

  const handleAction = async () => {
    if (!selectedUser || !actionModal) return;
    
    setUpdating(true);
    const updates: any = {
      account_status: actionModal === 'ban' ? 'banned' : 'suspended',
      ban_reason: reason || '',
    };

    if (actionModal === 'suspend' && suspendUntil) {
      updates.suspended_until = new Date(suspendUntil).toISOString();
    } else {
      updates.suspended_until = undefined;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', (selectedUser as any).user_id);

      if (error) throw error;
      
      // Update local state
      setUsers(prev => prev.map(u => 
        (u as any).user_id === (selectedUser as any).user_id ? { ...u, ...updates } : u
      ));
      
      setActionModal(null);
      setSelectedUser(null);
      setReason('');
      setSuspendUntil('');
    } catch (err: any) {
      console.error('Error updating user:', err);
      alert('FAILED TO UPDATE USER PROTOCOL');
    } finally {
      setUpdating(false);
    }
  };

  const liftRestriction = async (user: PlayerProfile) => {
    if (!window.confirm(`LIFT RESTRICTIONS: Re-authorize Operative ${(user as any).name}?`)) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          account_status: 'active',
          ban_reason: undefined,
          suspended_until: undefined
        })
        .eq('user_id', (user as any).user_id);

      if (error) throw error;
      
      setUsers(prev => prev.map(u => 
        (u as any).user_id === (user as any).user_id ? { ...u, account_status: 'active', ban_reason: '', suspended_until: undefined } : u
      ));
    } catch (err: any) {
      console.error('Error lifting restriction:', err);
      alert('FAILED TO RESTORE ACCESS');
    }
  };

  return (
    <div className="admin-section">
      <div className="abc-controls">
        <h2 className="abc-h1" style={{ fontSize: '1.5rem', margin: 0 }}>Registered <span>Operatives</span></h2>
        <button className="abc-sync-btn" onClick={() => fetchUsers(true)}>REFRESH DATABASE</button>
      </div>

      {error && <div className="abc-error-banner">{error}</div>}

      {loading ? (
        <div className="abc-loading">// DECRYPTING USER REGISTRY...</div>
      ) : (
        <div className="abc-user-table" style={{ marginTop: '2rem' }}>
          <div className="abc-user-row header">
            <div className="abc-user-cell">OPERATIVE</div>
            <div className="abc-user-cell">CLASS</div>
            <div className="abc-user-cell">LVL</div>
            <div className="abc-user-cell">STATUS</div>
            <div className="abc-user-cell" style={{ textAlign: 'right' }}>ACTIONS</div>
          </div>
          {users.map((user, i) => (
            <div key={i} className={`abc-user-row ${user.account_status && user.account_status !== 'active' ? 'restricted' : ''}`}>
              <div className="abc-user-cell abc-user-name-cell">
                <span className="abc-user-name">{(user as any).name || 'UNKNOWN'}</span>
                <span className="abc-user-id">ID: {(user as any).user_id.slice(0, 8)}</span>
              </div>
              <div className="abc-user-cell abc-user-class-cell">
                <span className="abc-user-class-pill">{user.main_class}</span>
              </div>
              <div className="abc-user-cell abc-user-lvl-cell">
                <span className="abc-user-lvl">{user.level}</span>
              </div>
              <div className="abc-user-cell abc-user-status-cell">
                <span className={`abc-status-indicator ${user.account_status || 'active'}`}>
                  {user.account_status?.toUpperCase() || 'ACTIVE'}
                </span>
              </div>
              <div className="abc-user-cell abc-user-actions abc-user-actions-cell">
                {user.account_status === 'active' || !user.account_status ? (
                  <>
                    <button 
                      className="abc-filter-btn f-high" 
                      style={{ fontSize: '0.6rem', padding: '0.2rem 0.6rem' }}
                      onClick={() => { setSelectedUser(user); setActionModal('suspend'); }}
                    >SUSPEND</button>
                    <button 
                      className="abc-filter-btn f-critical" 
                      style={{ fontSize: '0.6rem', padding: '0.2rem 0.6rem' }}
                      onClick={() => { setSelectedUser(user); setActionModal('ban'); }}
                    >BAN</button>
                  </>
                ) : (
                  <button 
                    className="abc-filter-btn f-fixed" 
                    style={{ fontSize: '0.6rem', padding: '0.2rem 0.6rem' }}
                    onClick={() => liftRestriction(user)}
                  >RESTORE</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {actionModal && selectedUser && (
        <div className="patch-modal-overlay">
          <div className="patch-modal v2" style={{ maxWidth: '480px' }}>
            <div className={`patch-modal-header ${actionModal === 'ban' ? 'ban-header' : 'suspend-header'}`}>
              <h2 className="patch-modal-title" style={{ color: actionModal === 'ban' ? 'var(--hk-red)' : 'var(--hk-amber)' }}>
                {actionModal === 'ban' ? 'TERMINATE ACCESS' : 'SUSPEND OPERATIVE'}
              </h2>
              <div className="patch-modal-subtitle">
                Target: {(selectedUser as any).name} // ID: {(selectedUser as any).user_id.slice(0, 8)}
              </div>
            </div>
            
            <div className="patch-modal-body" style={{ padding: '1.5rem 2rem' }}>
              <div className="patch-field">
                <label className="patch-label">OFFICIAL REASON</label>
                <textarea 
                  className="patch-textarea" 
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Describe the protocol violation..."
                  style={{ minHeight: '100px' }}
                />
              </div>

              {actionModal === 'suspend' && (
                <div className="patch-field" style={{ marginTop: '0.5rem' }}>
                  <label className="patch-label">SUSPENSION TIMEFRAME</label>
                  <div className="suspend-duration-selector">
                    {durationOptions.map(opt => (
                      <button
                        key={opt.value}
                        className={`duration-chip ${durationOption === opt.value ? 'active' : ''}`}
                        onClick={() => setDurationOption(opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {durationOption === 'custom' && (
                    <div style={{ marginTop: '1rem' }}>
                      <label className="patch-label" style={{ fontSize: '0.55rem', opacity: 0.8 }}>SELECT CUSTOM EXPIRY</label>
                      <input 
                        className="patch-input" 
                        type="datetime-local"
                        value={suspendUntil}
                        onChange={e => setSuspendUntil(e.target.value)}
                        style={{ marginTop: '0.4rem' }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="patch-modal-footer" style={{ padding: '1.2rem 2rem', background: 'rgba(0,0,0,0.4)' }}>
              <button className="patch-btn-ghost v2" onClick={() => setActionModal(null)}>ABORT</button>
              <button 
                className={`patch-btn-commit v2 ${actionModal === 'ban' ? 'f-critical' : 'f-high'}`}
                onClick={handleAction}
                disabled={updating}
              >
                {updating ? 'EXECUTING...' : `CONFIRM ${actionModal.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
