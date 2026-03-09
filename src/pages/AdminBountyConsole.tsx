import React, { useState, useEffect } from 'react';
import './AdminBountyConsole.css';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { usePlayerProfile } from '../hooks/usePlayerProfile';

interface PatchIntel {
    patch_code: string;
    app_version: string;
    fixed_at: string;
    fixed_by: string;
}

interface Submission {
    id: string;
    operative_name: string;
    title: string;
    severity: string;
    component: string;
    description: string;
    steps: string;
    status: string;
    created_at: string;
    patch_intel?: PatchIntel | null;
}

const SyncIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
);

const RepIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const ShieldIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const STATUS_FILTERS = ['all', 'Critical', 'High', 'Medium', 'Low', 'fixed'];
const STATUS_OPTIONS = ['received', 'confirmed', 'fixed', 'rewarded', 'rejected'];

const DEFAULT_PATCH: PatchIntel = {
    patch_code: '',
    app_version: '',
    fixed_at: new Date().toISOString(),
    fixed_by: '',
};

const AdminBountyConsole: React.FC = () => {
    const { user } = useAuth();
    const { profile, loading: profileLoading } = usePlayerProfile();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [repLoading, setRepLoading] = useState<Record<string, boolean>>({});

    // Patch intel modal state
    const [patchModal, setPatchModal] = useState<{ submissionId: string; form: PatchIntel } | null>(null);
    const [patchSaving, setPatchSaving] = useState(false);

    // Expanded patch detail
    const [expandedPatch, setExpandedPatch] = useState<string | null>(null);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('bug_bounty_submissions')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setSubmissions(data || []);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (profile?.is_admin) {
            fetchSubmissions();
            const channel = supabase
                .channel('public:bug_bounty_submissions')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'bug_bounty_submissions' }, fetchSubmissions)
                .subscribe();
            return () => { supabase.removeChannel(channel); };
        }
    }, [profile]);

    const updateStatus = async (id: string, newStatus: string) => {
        // Intercept: open patch modal when marking as fixed
        if (newStatus === 'fixed') {
            const adminHandle = user?.email?.split('@')[0] || 'ADMIN';
            setPatchModal({
                submissionId: id,
                form: { ...DEFAULT_PATCH, fixed_by: adminHandle, fixed_at: new Date().toISOString() }
            });
            return;
        }
        try {
            const { error } = await supabase
                .from('bug_bounty_submissions')
                .update({ status: newStatus })
                .eq('id', id);
            if (error) throw error;
            setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
        } catch (err) {
            console.error('Update error:', err);
        }
    };

    const savePatchIntel = async () => {
        if (!patchModal) return;
        setPatchSaving(true);
        try {
            const { error } = await supabase
                .from('bug_bounty_submissions')
                .update({ status: 'fixed', patch_intel: patchModal.form })
                .eq('id', patchModal.submissionId);
            if (error) throw error;
            setSubmissions(prev => prev.map(s =>
                s.id === patchModal.submissionId
                    ? { ...s, status: 'fixed', patch_intel: patchModal.form }
                    : s
            ));
            setPatchModal(null);
        } catch (err) {
            console.error('Patch save error:', err);
        } finally {
            setPatchSaving(false);
        }
    };

    const handleAssignRep = async (sub: Submission) => {
        setRepLoading(prev => ({ ...prev, [sub.id]: true }));
        await updateStatus(sub.id, 'rewarded');
        setRepLoading(prev => ({ ...prev, [sub.id]: false }));
    };

    const filteredSubmissions = filter === 'fixed'
        ? submissions.filter(s => s.status === 'fixed')
        : filter === 'all'
            ? submissions
            : submissions.filter(s => s.severity === filter);

    const statCritical = submissions.filter(s => s.severity === 'Critical').length;
    const statOpen = submissions.filter(s => s.status === 'received' || s.status === 'confirmed').length;
    const statFixed = submissions.filter(s => s.status === 'fixed').length;

    if (profileLoading) return (
        <div className="abc-gate">SYNCHRONIZING ADMIN CLEARANCE...</div>
    );

    if (!profile?.is_admin) return (
        <div className="abc-gate">UNAUTHORIZED — ADMINISTRATOR PRIVILEGES REQUIRED</div>
    );

    return (
        <div className="abc-page">
            {/* ── HEADER ── */}
            <header className="abc-header">
                <div className="abc-title-block">
                    <span className="abc-sys-tag">SYS_CONSOLE // BOUNTY_OPS // LIVE_FEED</span>
                    <span className="abc-badge">ADMIN CONTROL</span>
                    <h1 className="abc-h1">Bounty Operation <span>Console</span></h1>
                </div>
                <div className="abc-stats">
                    <div className="abc-stat" style={{ '--stat-accent': 'var(--hk-cyan)' } as React.CSSProperties}>
                        <span className="abc-stat-label">Total Findings</span>
                        <span className="abc-stat-value">{submissions.length}</span>
                    </div>
                    <div className="abc-stat" style={{ '--stat-accent': 'var(--hk-red)' } as React.CSSProperties}>
                        <span className="abc-stat-label">Critical Path</span>
                        <span className="abc-stat-value">{statCritical}</span>
                    </div>
                    <div className="abc-stat" style={{ '--stat-accent': 'var(--hk-amber)' } as React.CSSProperties}>
                        <span className="abc-stat-label">Open Intel</span>
                        <span className="abc-stat-value">{statOpen}</span>
                    </div>
                    <div className="abc-stat" style={{ '--stat-accent': 'var(--hk-green)' } as React.CSSProperties}>
                        <span className="abc-stat-label">Patched</span>
                        <span className="abc-stat-value">{statFixed}</span>
                    </div>
                </div>
            </header>

            {/* ── CONTROLS ── */}
            <div className="abc-controls">
                <div className="abc-filters">
                    {STATUS_FILTERS.map(f => (
                        <button
                            key={f}
                            className={`abc-filter-btn f-${f.toLowerCase()} ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'all' ? 'ALL' : f === 'fixed' ? '✓ FIXED' : f.toUpperCase()}
                        </button>
                    ))}
                </div>
                <button className="abc-sync-btn" onClick={fetchSubmissions}>
                    <SyncIcon /> SYNC FEED
                </button>
            </div>

            {/* ── FEED ── */}
            {loading ? (
                <div className="abc-loading">// SCANNING DATA UPLINK...</div>
            ) : (
                <div className="abc-feed">
                    {filteredSubmissions.length === 0 ? (
                        <div className="abc-empty">// NO FINDINGS DETECTED IN THIS SECTOR //</div>
                    ) : (
                        filteredSubmissions.map(sub => (
                            <div
                                className={`abc-card status-${sub.status}`}
                                key={sub.id}
                            >
                                {/* Card top bar */}
                                <div className="abc-card-header">
                                    <span className={`abc-severity ${sub.severity.toLowerCase()}`}>
                                        {sub.severity}
                                    </span>
                                    <span className="abc-card-id">#{sub.id.slice(0, 8)}</span>
                                    <span className={`abc-status-indicator ${sub.status}`}>
                                        {sub.status}
                                    </span>
                                    <span className="abc-card-date">
                                        {new Date(sub.created_at).toLocaleString()}
                                    </span>
                                </div>

                                {/* Body */}
                                <div className="abc-card-body">
                                    <h3 className="abc-card-title">{sub.title}</h3>
                                    <div className="abc-card-meta">
                                        <span>OPERATIVE: <span className="hl">{sub.operative_name}</span></span>
                                        <span>•</span>
                                        <span>TARGET: <span className="hl">{sub.component}</span></span>
                                    </div>
                                    <div className="abc-sections">
                                        <div>
                                            <div className="abc-section-label">Description</div>
                                            <div className="abc-section-text">{sub.description}</div>
                                        </div>
                                        <div>
                                            <div className="abc-section-label">Steps to Reproduce</div>
                                            <div className="abc-section-text">{sub.steps}</div>
                                        </div>
                                    </div>

                                    {/* ── PATCH INTEL PANEL (Fixed only) ── */}
                                    {sub.status === 'fixed' && sub.patch_intel && (
                                        <div className="patch-intel-panel">
                                            <button
                                                className="patch-intel-toggle"
                                                onClick={() => setExpandedPatch(expandedPatch === sub.id ? null : sub.id)}
                                            >
                                                <ShieldIcon />
                                                PATCH INTEL
                                                <span className="patch-version-chip">v{sub.patch_intel.app_version || '—'}</span>
                                                <span className="patch-toggle-arrow">{expandedPatch === sub.id ? '▲' : '▼'}</span>
                                            </button>

                                            {expandedPatch === sub.id && (
                                                <div className="patch-intel-body">
                                                    {/* Metadata row */}
                                                    <div className="patch-meta-row">
                                                        <div className="patch-meta-item">
                                                            <span className="patch-meta-label">FIXED AT</span>
                                                            <span className="patch-meta-value">{new Date(sub.patch_intel.fixed_at).toLocaleString()}</span>
                                                        </div>
                                                        <div className="patch-meta-item">
                                                            <span className="patch-meta-label">APP VERSION</span>
                                                            <span className="patch-meta-value hl">v{sub.patch_intel.app_version}</span>
                                                        </div>
                                                        <div className="patch-meta-item">
                                                            <span className="patch-meta-label">SIGNATURE</span>
                                                            <span className="patch-meta-value sig">// {sub.patch_intel.fixed_by}</span>
                                                        </div>
                                                    </div>

                                                    {/* Patch code */}
                                                    <div className="patch-code-block">
                                                        <div className="patch-code-header">
                                                            <span>PATCH.DIFF</span>
                                                            <span className="patch-code-dots"><span /><span /><span /></span>
                                                        </div>
                                                        <pre className="patch-code-body">{sub.patch_intel.patch_code || '// No patch code provided'}</pre>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Footer / actions */}
                                <div className="abc-card-footer">
                                    <select
                                        className="abc-status-select"
                                        value={sub.status}
                                        onChange={(e) => updateStatus(sub.id, e.target.value)}
                                    >
                                        {STATUS_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>
                                                {opt.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        className="abc-rep-btn"
                                        onClick={() => handleAssignRep(sub)}
                                        disabled={repLoading[sub.id]}
                                    >
                                        <RepIcon />
                                        {repLoading[sub.id] ? 'ASSIGNING...' : 'ASSIGN REP'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* ── PATCH INTEL MODAL ── */}
            {patchModal && (
                <div className="patch-modal-overlay" onClick={() => setPatchModal(null)}>
                    <div className="patch-modal" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="patch-modal-header">
                            <div className="patch-modal-title-wrap">
                                <span className="patch-modal-icon">🔧</span>
                                <div>
                                    <div className="patch-modal-label">PATCH PROTOCOL</div>
                                    <h2 className="patch-modal-title">Log Fix Intel</h2>
                                </div>
                            </div>
                            <button className="patch-modal-close" onClick={() => setPatchModal(null)}>✕</button>
                        </div>

                        <div className="patch-modal-body">
                            {/* App version */}
                            <div className="patch-field">
                                <label className="patch-label">APP VERSION <span className="patch-required">*</span></label>
                                <input
                                    className="patch-input"
                                    placeholder="e.g. 1.0.1"
                                    value={patchModal.form.app_version}
                                    onChange={e => setPatchModal(prev => prev ? { ...prev, form: { ...prev.form, app_version: e.target.value } } : prev)}
                                />
                            </div>

                            {/* Fixed at */}
                            <div className="patch-field">
                                <label className="patch-label">FIXED TIMESTAMP</label>
                                <input
                                    className="patch-input"
                                    type="datetime-local"
                                    value={patchModal.form.fixed_at.slice(0, 16)}
                                    onChange={e => setPatchModal(prev => prev ? { ...prev, form: { ...prev.form, fixed_at: new Date(e.target.value).toISOString() } } : prev)}
                                />
                            </div>

                            {/* Signature */}
                            <div className="patch-field">
                                <label className="patch-label">ADMIN SIGNATURE</label>
                                <input
                                    className="patch-input"
                                    placeholder="e.g. V0idWalker"
                                    value={patchModal.form.fixed_by}
                                    onChange={e => setPatchModal(prev => prev ? { ...prev, form: { ...prev.form, fixed_by: e.target.value } } : prev)}
                                />
                            </div>

                            {/* Patch code / diff */}
                            <div className="patch-field">
                                <label className="patch-label">PATCH CODE / DIFF <span className="patch-required">*</span></label>
                                <textarea
                                    className="patch-textarea"
                                    placeholder={"// Describe or paste the fix\n- removed vulnerable handler\n+ added input sanitization\n+ added auth guard"}
                                    value={patchModal.form.patch_code}
                                    onChange={e => setPatchModal(prev => prev ? { ...prev, form: { ...prev.form, patch_code: e.target.value } } : prev)}
                                />
                            </div>
                        </div>

                        <div className="patch-modal-footer">
                            <button className="patch-btn-ghost" onClick={() => setPatchModal(null)}>Abort</button>
                            <button
                                className="patch-btn-commit"
                                onClick={savePatchIntel}
                                disabled={patchSaving || !patchModal.form.app_version || !patchModal.form.patch_code}
                            >
                                {patchSaving ? '// COMMITTING...' : '⚡ COMMIT PATCH'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBountyConsole;
