import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import type { PlayerProfile } from '../../hooks/usePlayerProfile';
import './UserManagement.css';

const PAGE_SIZE = 20;

interface ProfileUpdatePayload {
  account_status?: 'active' | 'banned' | 'suspended';
  ban_reason?: string;
  suspended_until?: string;
}

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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // New states for search and sort
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortField, setSortField] = useState('level');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(0); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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

  const [syncFlash, setSyncFlash] = useState(false);

  const fetchUsers = useCallback(async (isManual = false, page = currentPage) => {
    setLoading(true);
    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .or('is_admin.eq.false,is_admin.is.null');

      // Apply search filter if present
      if (debouncedSearch) {
        // Sanitize search to prevent PostgREST syntax errors (remove commas, parens)
        const safeSearch = debouncedSearch.replace(/[,()]/g, '');
        let orQuery = `name.ilike.%${safeSearch}%`;

        // Check if search could be a UUID prefix (hex characters only)
        const cleanHex = safeSearch.replace(/-/g, '').toLowerCase();
        if (cleanHex && /^[0-9a-f]+$/.test(cleanHex) && cleanHex.length <= 32) {
          const minHex = cleanHex.padEnd(32, '0');
          const maxHex = cleanHex.padEnd(32, 'f');
          const formatUuid = (h: string) => `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20,32)}`;
          
          orQuery += `,and(user_id.gte.${formatUuid(minHex)},user_id.lte.${formatUuid(maxHex)})`;
        }

        query = query.or(orQuery);
      }

      // Apply sorting
      query = query.order(sortField, { ascending: sortOrder === 'asc' }).range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;
      setUsers(data as PlayerProfile[] || []);
      if (count !== null) setTotalCount(count);

      if (isManual) {
        setSyncFlash(true);
        setTimeout(() => setSyncFlash(false), 2000);
      }
    } catch (err: unknown) {
      console.error('Error fetching users:', err);
      if (err instanceof Error) setError(err.message);
      else setError('UNKNOWN_ERROR_FETCHING_USERS');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sortField, sortOrder, currentPage]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const goToPage = (page: number) => {
    setCurrentPage(page);
    fetchUsers(false, page);
  };

  // Re-fetch on search or sort change
  useEffect(() => {
    fetchUsers(false, 0);
  }, [debouncedSearch, sortField, sortOrder, fetchUsers]);

  const handleAction = async () => {
    if (!selectedUser || !actionModal) return;
    
    setUpdating(true);
    const updates: ProfileUpdatePayload = {
      account_status: actionModal === 'ban' ? 'banned' : 'suspended',
      ban_reason: reason || '',
    };

    if (actionModal === 'suspend' && suspendUntil) {
      updates.suspended_until = new Date(suspendUntil).toISOString();
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', selectedUser.user_id);

      if (error) throw error;
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.user_id === selectedUser.user_id ? { ...u, ...updates } : u
      ));
      
      setActionModal(null);
      setSelectedUser(null);
      setReason('');
      setSuspendUntil('');
    } catch (err: unknown) {
      console.error('Error updating user:', err);
      alert('FAILED TO UPDATE USER PROTOCOL');
    } finally {
      setUpdating(false);
    }
  };

  const liftRestriction = async (user: PlayerProfile) => {
    if (!window.confirm(`LIFT RESTRICTIONS: Re-authorize Operative ${user.name}?`)) return;
    
    try {
      const updates: ProfileUpdatePayload = {
        account_status: 'active',
        ban_reason: '',
        suspended_until: undefined
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.user_id);

      if (error) throw error;
      
      setUsers(prev => prev.map(u => 
        u.user_id === user.user_id ? { ...u, ...updates } : u
      ));
    } catch (err: unknown) {
      console.error('Error lifting restriction:', err);
      alert('FAILED TO RESTORE ACCESS');
    }
  };

  return (
    <div className="admin-section">
      <div className="abc-header-row">
        <div className="abc-title-area">
          <h2 className="abc-h1">Registered <span>Operatives</span></h2>
          <div className="abc-count-badge">
            <span className="count-val">{totalCount}</span>
            <span className="count-label">TOTAL_ROSTER</span>
          </div>
        </div>
        
        <button className="abc-sync-btn" onClick={() => fetchUsers(true)}>
          {syncFlash ? (
            <>DATABASE SYNCED ✓</>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              REFRESH DATABASE
            </>
          )}
        </button>
      </div>

      <div className="abc-sticky-controls">
        <div className="abc-search-container">
          <span className="abc-search-icon">🔍</span>
          <input 
            type="text" 
            className="abc-search-input" 
            placeholder="Search by operative name or identifier..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="abc-sort-group">
          <span className="abc-filter-label">SORT_ORDER:</span>
          <div className="abc-select-wrapper">
            <select 
              className="abc-select-minimal"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="level">LEVEL (REALM)</option>
              <option value="main_path">DAO_PATH (CLASS)</option>
              <option value="name">OPERATIVE_NAME</option>
              <option value="created_at">JOIN_DATE</option>
            </select>
          </div>
          <button 
            className={`abc-sort-toggle-btn ${sortOrder === 'asc' ? 'asc' : 'desc'}`}
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            title={sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
          >
            {sortOrder === 'asc' ? 'ASC ↑' : 'DESC ↓'}
          </button>
        </div>
      </div>

      {error && (
        <div className="abc-error-banner" style={{ margin: '1rem 0' }}>
          <span className="abc-error-icon">⚠️</span>
          <span className="abc-error-msg">{error}</span>
          <button className="abc-error-close" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {loading && users.length === 0 ? (
        <div className="abc-loading">// DECRYPTING USER REGISTRY...</div>
      ) : (
        <div className="abc-user-table" style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
          <div className="abc-user-row header">
            <div className="abc-user-cell">OPERATIVE</div>
            <div className="abc-user-cell">DAO_PATH</div>
            <div className="abc-user-cell">REALM</div>
            <div className="abc-user-cell">STATUS</div>
            <div className="abc-user-cell" style={{ textAlign: 'right' }}>ACTIONS</div>
          </div>
          {users.length === 0 && !loading ? (
            <div className="abc-empty">// NO OPERATIVES MATCHING CRITERIA //</div>
          ) : (
            users.map((user, i) => (
              <div key={i} className={`abc-user-row ${user.account_status && user.account_status !== 'active' ? 'restricted' : ''}`}>
                <div className="abc-user-cell abc-user-name-cell">
                  <span className="abc-user-name">{user.name || 'UNKNOWN'}</span>
                  <span className="abc-user-id">ID: {user.user_id.slice(0, 8)}</span>
                </div>
                <div className="abc-user-cell abc-user-class-cell">
                  <span className={`abc-user-class-pill ${!user.main_path ? 'unassigned' : ''}`}>{user.main_path || 'UNASSIGNED'}</span>
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
                        onClick={() => { setSelectedUser(user); setActionModal('suspend'); }}
                      >SUSPEND</button>
                      <button 
                        className="abc-filter-btn f-critical" 
                        onClick={() => { setSelectedUser(user); setActionModal('ban'); }}
                      >BAN</button>
                    </>
                  ) : (
                    <button 
                      className="abc-filter-btn f-fixed" 
                      onClick={() => liftRestriction(user)}
                    >RESTORE</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="abc-pagination">
          <button
            className="abc-page-btn"
            disabled={currentPage === 0}
            onClick={() => goToPage(currentPage - 1)}
          >
            ◄ PREV
          </button>
          <div className="abc-page-numbers">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`abc-page-num ${currentPage === i ? 'active' : ''}`}
                onClick={() => goToPage(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            className="abc-page-btn"
            disabled={currentPage >= totalPages - 1}
            onClick={() => goToPage(currentPage + 1)}
          >
            NEXT ►
          </button>
          <span className="abc-page-info">
            {currentPage * PAGE_SIZE + 1}–{Math.min((currentPage + 1) * PAGE_SIZE, totalCount)} OF {totalCount}
          </span>
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
                Target: {selectedUser.name} // ID: {selectedUser.user_id.slice(0, 8)}
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
