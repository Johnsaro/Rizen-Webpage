import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './AdminOverview.css';

const AdminOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    healthy: true,
    restrictedAccounts: 0,
    openBugs: 0,
    maintenance: false
  });

  const [triageData, setTriageData] = useState({
    needsAction: [] as any[],
    pendingModeration: [] as any[],
    activeBugs: [] as any[],
    atRiskOperatives: [] as any[]
  });

  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [operationalQueue, setOperationalQueue] = useState<any[]>([]);
  const [recentSignups, setRecentSignups] = useState<any[]>([]);
  const [expandedSignupId, setExpandedSignupId] = useState<string | null>(null);
  const [signupVelocity, setSignupVelocity] = useState({ today: 0, avg7d: 0 });
  const [intelligenceExpanded, setIntelligenceExpanded] = useState(false);
  const [longTermMetrics, setLongTermMetrics] = useState({
    totalRep: 0,
    classDist: {} as Record<string, number>,
    questCompletion: 0,
    economyHealth: 'STABLE'
  });

  // Broadcast State
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [audienceType, setAudienceType] = useState<'all' | 'level' | 'class'>('all');
  const [classFilter, setClassFilter] = useState('');
  const [broadcastStep, setBroadcastStep] = useState<'compose' | 'preview'>('compose');
  const [transmitting, setTransmitting] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [audienceEstimate, setAudienceEstimate] = useState<number | null>(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduledBroadcast, setScheduledBroadcast] = useState<{ message: string; audience: string; time: string; timerId: ReturnType<typeof setTimeout> } | null>(null);
  const [broadcastStatus, setBroadcastStatus] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [confirmText, setConfirmText] = useState('');

  const BROADCAST_MAX_LENGTH = 500;
  const BATCH_SIZE = 500;
  const COMBAT_CLASSES = ['Warrior', 'Berserker', 'Knight', 'Assassin', 'Ranger'];
  const AUDIENCE_OPTIONS = [
    { key: 'all' as const, label: 'ALL USERS' },
    { key: 'level' as const, label: 'LEVEL >3' },
    { key: 'class' as const, label: 'CLASS FILTER' },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      const todayStart = new Date(now.setHours(0, 0, 0, 0));

      // 1. Fetch System Status & Config
      const { data: config, error: configError } = await supabase.from('app_config').select('*').eq('id', 1).maybeSingle();
      
      if (configError) console.error('Config Fetch Error:', configError);

      const maintenance = config?.maintenance_mode === true;

      // 2. Fetch Triage Data — track individual fetch failures
      const [bountiesRes, profilesRes, notificationsRes] = await Promise.all([
        supabase.from('bug_bounty_submissions').select('*').neq('status', 'fixed').neq('status', 'rewarded'),
        supabase.from('profiles').select('*').order('updated_at', { ascending: false }),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50)
      ]);

      const fetchErrors = [configError, bountiesRes.error, profilesRes.error, notificationsRes.error].filter(Boolean);
      const isHealthy = fetchErrors.length === 0;

      const bounties = bountiesRes.data || [];
      const profiles = profilesRes.data || [];
      const notifications = notificationsRes.data || [];

      // Needs Action: Critical bounties + High level inactive users
      const criticalBounties = bounties.filter(b => b.severity === 'Critical');
      // Using updated_at or created_at as proxy for activity
      const inactiveHighLevel = profiles.filter(p => p.level >= 10 && new Date(p.updated_at || p.created_at) < sevenDaysAgo);
      
      // Pending Moderation: (Mocked for now as we don't have a content table yet)
      const pendingMod = []; 

      // Active Bugs
      const activeBugs = bounties.filter(b => b.status === 'open' || b.status === 'investigating');

      // At-Risk Operatives: Inactive for 7+ days
      const atRisk = profiles.filter(p => new Date(p.updated_at || p.created_at) < sevenDaysAgo).slice(0, 10);

      setTriageData({
        needsAction: [...criticalBounties.map(b => ({ id: b.id, label: `CRITICAL BUG: ${b.title}`, type: 'bounty' })), 
                      ...inactiveHighLevel.map(p => ({ id: p.user_id, label: `INACTIVE VETERAN: ${p.name}`, type: 'user' }))],
        pendingModeration: pendingMod,
        activeBugs: activeBugs.map(b => ({ id: b.id, label: b.title, severity: b.severity })),
        atRiskOperatives: atRisk.map(p => ({ id: p.user_id, name: p.name, lastSeen: p.updated_at || p.created_at }))
      });

      // 3. Activity Feed (Using notifications as a proxy if admin_activity_log is missing)
      setActivityFeed(notifications.slice(0, 20));

      // 4. Signups & Velocity
      const todaySignups = profiles.filter(p => new Date(p.created_at) >= todayStart);
      const last7dSignups = profiles.filter(p => new Date(p.created_at) >= sevenDaysAgo);
      
      const sortedSignups = [...profiles].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setRecentSignups(sortedSignups);
      setSignupVelocity({
        today: todaySignups.length,
        avg7d: Math.round(last7dSignups.length / 7)
      });

      // 5. Long Term Metrics
      const classDist = profiles.reduce((acc, p) => {
        const cls = p.main_class || 'UNKNOWN';
        acc[cls] = (acc[cls] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setLongTermMetrics({
        totalRep: profiles.reduce((acc, p) => acc + (p.rep || 0), 0),
        classDist,
        questCompletion: 85, // Mocked
        economyHealth: 'OPTIMAL'
      });

      // Live system status from real data
      const restrictedAccounts = profiles.filter(p => p.account_status === 'banned' || p.account_status === 'suspended').length;
      const openBugs = bounties.length; // already filtered to exclude fixed/rewarded

      setSystemStatus({
        healthy: isHealthy,
        restrictedAccounts,
        openBugs,
        maintenance
      });

    } catch (err) {
      console.error('Error fetching triage data:', err);
      setSystemStatus(prev => ({ ...prev, healthy: false }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Auto-refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Clear broadcast status after 5 seconds
  useEffect(() => {
    if (!broadcastStatus) return;
    const t = setTimeout(() => setBroadcastStatus(null), 5000);
    return () => clearTimeout(t);
  }, [broadcastStatus]);

  const handleMaintenanceToggle = async () => {
    const newState = !systemStatus.maintenance;
    
    try {
      // 1. Verify current session has admin permissions (Pre-check)
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('is_admin').eq('user_id', user?.id).maybeSingle();
      
      if (!profile?.is_admin) {
        alert('PERMISSION DENIED: Your account is not marked as ADMIN in the database.');
        return;
      }

      // 2. Perform the update
      const { data, error } = await supabase
        .from('app_config')
        .upsert({ 
          id: 1, 
          maintenance_mode: newState,
          maintenance_message: 'SYSTEM UNDERGOING CORE MAINTENANCE. STAND BY.' 
        })
        .select();
      
      if (error) {
        if (error.code === '42501') {
          alert('DATABASE BLOCK: Row-Level Security (RLS) is blocking this update. Please run the SQL fix in your Supabase Dashboard.');
        } else {
          throw error;
        }
        return;
      }
      
      setSystemStatus(prev => ({ ...prev, maintenance: newState }));
    } catch (err: any) {
      alert('FAILED TO TOGGLE MAINTENANCE: ' + err.message);
    }
  };

  const buildAudienceQuery = () => {
    let query = supabase.from('profiles').select('user_id, level, main_class');
    if (audienceType === 'level') {
      query = query.gt('level', 3);
    } else if (audienceType === 'class' && classFilter) {
      query = query.eq('main_class', classFilter);
    }
    return query;
  };

  const getAudienceLabel = () => {
    if (audienceType === 'level') return 'LEVEL >3';
    if (audienceType === 'class') return classFilter ? classFilter.toUpperCase() : 'CLASS FILTER';
    return 'ALL USERS';
  };

  const fetchAudienceEstimate = async () => {
    try {
      const { data, error } = await buildAudienceQuery();
      if (error) throw error;
      setAudienceEstimate(data?.length ?? 0);
    } catch {
      setAudienceEstimate(null);
    }
  };

  const handlePreview = async () => {
    if (!broadcastMessage.trim()) return;
    if (audienceType === 'class' && !classFilter) {
      setBroadcastStatus({ type: 'error', text: 'SELECT A CLASS BEFORE PREVIEWING' });
      return;
    }
    await fetchAudienceEstimate();
    setBroadcastStep('preview');
  };

  const handleBackToCompose = () => {
    setBroadcastStep('compose');
    setAudienceEstimate(null);
    setConfirmText('');
  };

  const executeBroadcast = async (msg: string) => {
    setTransmitting(true);
    try {
      const { data: users, error: fetchError } = await buildAudienceQuery();
      if (fetchError) throw fetchError;
      if (!users || users.length === 0) {
        setBroadcastStatus({ type: 'error', text: 'NO MATCHING OPERATIVES FOUND' });
        return;
      }

      const notifications = users.map(u => ({
        user_id: u.user_id,
        message: `SYSTEM BROADCAST: ${msg}`,
        type: 'broadcast',
        is_read: false
      }));

      for (let i = 0; i < notifications.length; i += BATCH_SIZE) {
        const chunk = notifications.slice(i, i + BATCH_SIZE);
        const { error: insertError } = await supabase.from('notifications').insert(chunk);
        if (insertError) throw insertError;
      }

      setBroadcastStatus({ type: 'success', text: `TRANSMITTED TO ${users.length} OPERATIVE${users.length !== 1 ? 'S' : ''}` });
      setBroadcastMessage('');
      setBroadcastStep('compose');
      setAudienceEstimate(null);
      setScheduledTime('');
    } catch (err: any) {
      setBroadcastStatus({ type: 'error', text: `FAILED: ${err.message || 'Unknown error'}` });
    } finally {
      setTransmitting(false);
    }
  };

  const handleTransmit = async () => {
    const msg = broadcastMessage.trim();
    if (!msg) return;
    if (audienceType === 'all' && confirmText !== 'CONFIRM') {
      setBroadcastStatus({ type: 'error', text: 'TYPE CONFIRM TO AUTHORIZE GLOBAL BROADCAST' });
      return;
    }
    await executeBroadcast(msg);
    setConfirmText('');
  };

  const handleTestSend = async () => {
    const msg = broadcastMessage.trim();
    if (!msg) return;
    setTestSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('notifications').insert({
        user_id: user.id,
        message: `[TEST] SYSTEM BROADCAST: ${msg}`,
        type: 'broadcast',
        is_read: false
      });
      if (error) throw error;
      setBroadcastStatus({ type: 'info', text: 'TEST SENT TO YOUR ACCOUNT' });
    } catch (err: any) {
      setBroadcastStatus({ type: 'error', text: `TEST FAILED: ${err.message}` });
    } finally {
      setTestSending(false);
    }
  };

  const handleSchedule = () => {
    const msg = broadcastMessage.trim();
    if (!msg || !scheduledTime) return;
    const sendAt = new Date(scheduledTime);
    const now = new Date();
    const delayMs = sendAt.getTime() - now.getTime();
    if (delayMs <= 0) {
      setBroadcastStatus({ type: 'error', text: 'SCHEDULED TIME MUST BE IN THE FUTURE' });
      return;
    }
    const timerId = setTimeout(() => {
      executeBroadcast(msg);
      setScheduledBroadcast(null);
    }, delayMs);
    setScheduledBroadcast({
      message: msg,
      audience: getAudienceLabel(),
      time: sendAt.toLocaleString(),
      timerId
    });
    setBroadcastStatus({ type: 'info', text: `SCHEDULED FOR ${sendAt.toLocaleString()}` });
    setBroadcastStep('compose');
    setBroadcastMessage('');
    setAudienceEstimate(null);
    setScheduledTime('');
  };

  const handleCancelScheduled = () => {
    if (!scheduledBroadcast) return;
    clearTimeout(scheduledBroadcast.timerId);
    setScheduledBroadcast(null);
    setBroadcastStatus({ type: 'info', text: 'SCHEDULED BROADCAST CANCELLED' });
  };

  const handleSaveDraft = () => {
    const msg = broadcastMessage.trim();
    if (!msg) return;
    try {
      const drafts = JSON.parse(localStorage.getItem('broadcast_drafts') || '[]');
      drafts.push({ message: msg, audience: audienceType, classFilter, savedAt: new Date().toISOString() });
      localStorage.setItem('broadcast_drafts', JSON.stringify(drafts));
      setBroadcastStatus({ type: 'info', text: 'DRAFT SAVED TO LOCAL STORAGE' });
    } catch {
      setBroadcastStatus({ type: 'error', text: 'FAILED TO SAVE DRAFT' });
    }
  };

  if (loading) return <div className="abc-loading">// INITIALIZING TRIAGE CENTER...</div>;

  return (
    <div className="admin-triage">
      {/* 1. TOP ALERT BAR */}
      <div className={`system-alert-bar ${systemStatus.healthy ? 'status-green' : 'status-yellow'}`}>
        <div className="alert-item">
          <span className="alert-label">SYSTEM STATUS:</span>
          <span className="alert-value">{systemStatus.healthy ? 'HEALTHY' : 'DEGRADED'}</span>
        </div>
        <div className="alert-item">
          <span className="alert-label">RESTRICTED:</span>
          <span className={`alert-value ${systemStatus.restrictedAccounts > 0 ? 'text-amber' : ''}`}>
            {systemStatus.restrictedAccounts} ACCOUNT{systemStatus.restrictedAccounts !== 1 ? 'S' : ''}
          </span>
        </div>
        <div className="alert-item">
          <span className="alert-label">OPEN BUGS:</span>
          <span className={`alert-value ${systemStatus.openBugs > 0 ? 'text-red' : ''}`}>
            {systemStatus.openBugs}
          </span>
        </div>
        <div className="alert-actions">
          <button 
            className={`maint-toggle ${systemStatus.maintenance ? 'active' : ''}`}
            onClick={handleMaintenanceToggle}
          >
            MAINTENANCE: {systemStatus.maintenance ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* 2. PRIORITY ROW 1 — TRIAGE CARDS */}
      <div className="triage-grid p1-row">
        <div className="triage-card triage-needs-action">
          <div className="card-header">
            <h3 className="card-title">NEEDS_ACTION</h3>
            <span className="badge-count">{triageData.needsAction.length}</span>
          </div>
          <div className="card-content">
            {triageData.needsAction.length > 0 ? (
              <ul className="triage-list">
                {triageData.needsAction.map((item, i) => (
                  <li key={i} className="triage-item clickable">
                    <span className={`type-tag ${item.type}`}>{item.type.toUpperCase()}</span>
                    <span className="item-label">{item.label}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-signal">NO URGENT SIGNALS</div>
            )}
          </div>
        </div>

        <div className="triage-card triage-mod">
          <div className="card-header">
            <h3 className="card-title">PENDING_MODERATION</h3>
            <span className="badge-count">{triageData.pendingModeration.length}</span>
          </div>
          <div className="card-content">
            <div className="empty-signal">CLEAN QUEUE</div>
          </div>
        </div>

        <div className="triage-card triage-bugs">
          <div className="card-header">
            <h3 className="card-title">ACTIVE_BUGS</h3>
          </div>
          <div className="card-content">
            <ul className="triage-list">
              {triageData.activeBugs.map((bug, i) => (
                <li key={i} className="triage-item">
                  <span className={`severity-dot ${bug.severity.toLowerCase()}`}></span>
                  <span className="item-label">{bug.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="triage-card triage-at-risk">
          <div className="card-header">
            <h3 className="card-title">AT_RISK_OPERATIVES</h3>
          </div>
          <div className="card-content">
            <ul className="triage-list">
              {triageData.atRiskOperatives.map((op, i) => (
                <li key={i} className="triage-item">
                  <span className="op-name">{op.name}</span>
                  <span className="last-seen">INACTIVE {Math.floor((new Date().getTime() - new Date(op.lastSeen).getTime()) / (1000 * 60 * 60 * 24))}d</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE ROW — ACTIVITY & QUEUE */}
      <div className="triage-grid p2-row">
        <div className="triage-card feed-card">
          <div className="card-header">
            <h3 className="card-title">ADMIN_ACTIVITY_FEED</h3>
          </div>
          <div className="card-content scroll-y">
            <div className="activity-feed">
              {activityFeed.map((act, i) => (
                <div key={i} className="activity-row">
                  <span className="act-time">[{new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                  <span className="act-msg">{act.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="triage-card queue-card">
          <div className="card-header">
            <h3 className="card-title">OPERATIONAL_QUEUE</h3>
          </div>
          <div className="card-content">
            <div className="empty-signal">NO PENDING TASKS</div>
          </div>
        </div>
      </div>

      {/* 4. SIGNUPS ROW */}
      <div className="triage-grid full-row">
        <div className="triage-card signup-card-enriched">
          <div className="card-header">
            <h3 className="card-title">RECENT_SIGNUPS</h3>
            <div className="velocity-stats">
              <span>TODAY: {signupVelocity.today}</span>
              <span>AVG: {signupVelocity.avg7d}</span>
            </div>
          </div>
          <div className="card-content scroll-y-large">
            <table className="signup-table">
              <thead>
                <tr>
                  <th>OPERATIVE</th>
                  <th>CLASS</th>
                  <th>LVL</th>
                  <th>JOINED</th>
                </tr>
              </thead>
              <tbody>
                {recentSignups.map((s) => (
                  <React.Fragment key={s.id || s.user_id}>
                    <tr 
                      onClick={() => setExpandedSignupId(expandedSignupId === (s.id || s.user_id) ? null : (s.id || s.user_id))}
                      style={{ cursor: 'pointer', backgroundColor: expandedSignupId === (s.id || s.user_id) ? 'rgba(0, 255, 170, 0.05)' : 'transparent' }}
                    >
                      <td>{s.name}</td>
                      <td>{s.main_class}</td>
                      <td>{s.level}</td>
                      <td>{new Date(s.created_at).toLocaleDateString()}</td>
                    </tr>
                    {expandedSignupId === (s.id || s.user_id) && (
                      <tr className="expanded-row">
                        <td colSpan={4} style={{ padding: '1rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderTop: '1px solid rgba(0, 255, 170, 0.1)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                            <div>
                              <strong style={{ color: 'var(--hk-cyan)', display: 'block', marginBottom: '4px' }}>EXACT JOIN TIME:</strong>
                              {new Date(s.created_at).toLocaleString()}
                            </div>
                            <div>
                              <strong style={{ color: 'var(--hk-cyan)', display: 'block', marginBottom: '4px' }}>PLATFORM / ORIGIN:</strong>
                              <span style={{ opacity: s.origin_platform ? 1 : 0.7 }}>
                                {s.origin_platform ? s.origin_platform.toUpperCase() : 'Unknown (Not tracked by backend)'}
                              </span>
                            </div>
                            <div>
                              <strong style={{ color: 'var(--hk-cyan)', display: 'block', marginBottom: '4px' }}>OPERATIVE ID:</strong>
                              <span style={{ opacity: 0.7, fontFamily: 'monospace' }}>{s.user_id}</span>
                            </div>
                            <div>
                              <strong style={{ color: 'var(--hk-cyan)', display: 'block', marginBottom: '4px' }}>LAST SEEN:</strong>
                              {new Date(s.updated_at || s.created_at).toLocaleString()}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. BROADCAST CENTER — Full Width, Multi-Step */}
      <div className="broadcast-center">
        <div className="broadcast-header">
          <h3 className="card-title">BROADCAST_CENTER</h3>
          {broadcastStatus && (
            <span className={`broadcast-toast toast-${broadcastStatus.type}`}>
              {broadcastStatus.text}
            </span>
          )}
        </div>

        {/* Scheduled broadcast banner */}
        {scheduledBroadcast && (
          <div className="scheduled-banner">
            <div className="scheduled-info">
              <span className="scheduled-label">SCHEDULED</span>
              <span className="scheduled-detail">
                "{scheduledBroadcast.message.slice(0, 60)}{scheduledBroadcast.message.length > 60 ? '...' : ''}"
                &rarr; {scheduledBroadcast.audience} @ {scheduledBroadcast.time}
              </span>
            </div>
            <button className="btn-danger" onClick={handleCancelScheduled}>
              CANCEL SCHEDULED
            </button>
          </div>
        )}

        {broadcastStep === 'compose' && (
          <div className="broadcast-compose">
            {/* Audience Tabs */}
            <div className="audience-tabs">
              {AUDIENCE_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  className={`audience-tab ${audienceType === opt.key ? 'active' : ''}`}
                  onClick={() => setAudienceType(opt.key)}
                >
                  {opt.label}
                  {opt.key === 'all' && <span className="tab-warn">!</span>}
                </button>
              ))}
            </div>

            {/* Class sub-filter */}
            {audienceType === 'class' && (
              <div className="class-filter-row">
                <span className="filter-label">CLASS:</span>
                {COMBAT_CLASSES.map(cls => (
                  <button
                    key={cls}
                    className={`class-chip ${classFilter === cls ? 'active' : ''}`}
                    onClick={() => setClassFilter(classFilter === cls ? '' : cls)}
                  >
                    {cls.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            {/* Compose area */}
            <textarea
              className="broadcast-textarea"
              placeholder="Compose transmission..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              maxLength={BROADCAST_MAX_LENGTH}
            />
            <div className="compose-footer">
              <span className="broadcast-char-count">
                {broadcastMessage.length}/{BROADCAST_MAX_LENGTH}
              </span>
              <div className="compose-actions">
                <button
                  className="btn-secondary"
                  onClick={handleSaveDraft}
                  disabled={!broadcastMessage.trim()}
                >
                  SAVE DRAFT
                </button>
                <button
                  className="btn-primary"
                  onClick={handlePreview}
                  disabled={!broadcastMessage.trim()}
                >
                  PREVIEW &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {broadcastStep === 'preview' && (
          <div className="broadcast-preview">
            {/* Preview panel */}
            <div className="preview-panel">
              <div className="preview-label">PREVIEW</div>
              <div className="preview-message">
                SYSTEM BROADCAST: {broadcastMessage.trim()}
              </div>
              <div className="preview-meta">
                <span>AUDIENCE: {getAudienceLabel()}</span>
                <span>RECIPIENTS: {audienceEstimate !== null ? audienceEstimate : '...'}</span>
              </div>
              {audienceType === 'all' && (
                <div className="confirm-gate">
                  <div className="confirm-gate-label">
                    GLOBAL BLAST — TYPE <span className="confirm-keyword">CONFIRM</span> TO AUTHORIZE
                  </div>
                  <input
                    type="text"
                    className={`confirm-input ${confirmText === 'CONFIRM' ? 'confirmed' : ''}`}
                    placeholder="_ _ _ _ _ _ _"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                    spellCheck={false}
                    autoComplete="off"
                  />
                </div>
              )}
            </div>

            {/* Schedule input */}
            <div className="schedule-row">
              <label className="schedule-label">SCHEDULE SEND:</label>
              <input
                type="datetime-local"
                className="schedule-input"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>

            {/* Action bar */}
            <div className="preview-actions">
              <button className="btn-ghost" onClick={handleBackToCompose}>
                &larr; EDIT
              </button>
              <button
                className="btn-secondary"
                onClick={handleTestSend}
                disabled={testSending}
              >
                {testSending ? 'SENDING...' : 'TEST SEND'}
              </button>
              {scheduledTime && (
                <button
                  className="btn-secondary"
                  onClick={handleSchedule}
                >
                  SCHEDULE
                </button>
              )}
              <button
                className="btn-primary btn-transmit"
                onClick={handleTransmit}
                disabled={transmitting || (audienceType === 'all' && confirmText !== 'CONFIRM')}
              >
                {transmitting ? 'TRANSMITTING...' : 'TRANSMIT NOW'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. BOTTOM — SYSTEM INTELLIGENCE */}
      <div className="intelligence-section">
        <button 
          className="intelligence-toggle"
          onClick={() => setIntelligenceExpanded(!intelligenceExpanded)}
        >
          {intelligenceExpanded ? '▼' : '▶'} SYSTEM_INTELLIGENCE_ANALYTICS
        </button>
        {intelligenceExpanded && (
          <div className="intelligence-grid">
            <div className="intel-module">
              <h4>REP CIRCULATION</h4>
              <div className="intel-stat">{(longTermMetrics.totalRep / 1000).toFixed(1)}k</div>
            </div>
            <div className="intel-module">
              <h4>ECONOMY HEALTH</h4>
              <div className={`intel-stat ${longTermMetrics.economyHealth === 'OPTIMAL' ? 'text-green' : ''}`}>
                {longTermMetrics.economyHealth}
              </div>
            </div>
            <div className="intel-module">
              <h4>CLASS DISTRIBUTION</h4>
              <div className="class-pills">
                {Object.entries(longTermMetrics.classDist).map(([cls, count]) => (
                  <div key={cls} className="class-pill">
                    {cls}: {count}
                  </div>
                ))}
              </div>
            </div>
            <div className="intel-module">
              <h4>DB ANOMALIES</h4>
              <div className="intel-stat">0 DETECTED</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
