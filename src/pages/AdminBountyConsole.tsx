import React, { useState, useEffect, useMemo } from 'react';
import './AdminBountyConsole.css';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { usePlayerProfile } from '../hooks/usePlayerProfile';

interface PatchIntel {
    patch_code: string;
    app_version: string;
    fixed_at: string;
    fixed_by: string;
    reward_amount?: number;
}

interface Submission {
    id: string;
    user_id?: string;
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
const STATUS_OPTIONS = ['received', 'confirmed', 'fixed', 'rejected'];

const getLocalISODateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
};

const DEFAULT_PATCH: PatchIntel = {
    patch_code: '',
    app_version: '',
    fixed_at: new Date().toISOString(),
    fixed_by: '',
};

interface AdminBountyConsoleProps {
    isIntegrated?: boolean;
}

const AdminBountyConsole: React.FC<AdminBountyConsoleProps> = ({ isIntegrated = false }) => {
    const { user } = useAuth();
    const { profile, loading: profileLoading } = usePlayerProfile();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [repLoading, setRepLoading] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);

    // Patch intel modal state
    const [patchModal, setPatchModal] = useState<{ submissionId: string; form: PatchIntel } | null>(null);
    const [patchSaving, setPatchSaving] = useState(false);

    // Expanded patch detail
    const [expandedPatch, setExpandedPatch] = useState<string | null>(null);

    // Pagination
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    // Get unique app versions from existing patches
    const availableVersions = useMemo(() => {
        const versions = new Set<string>();
        submissions.forEach(s => {
            if (s.patch_intel?.app_version) versions.add(s.patch_intel.app_version);
        });
        if (versions.size === 0) {
            versions.add('1.0.0-alpha');
            versions.add('1.0.1-alpha');
        }
        return Array.from(versions).sort((a, b) => b.localeCompare(a));
    }, [submissions]);

    const fetchSubmissions = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('bug_bounty_submissions')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setSubmissions(data || []);
        } catch (err: any) {
            console.error('Fetch error:', err);
            setError(`FETCH_FAILURE: ${err.message || 'COORD-NET LINK INTERRUPTED'}`);
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
        // Whitelist validation (W12)
        if (!STATUS_OPTIONS.includes(newStatus)) {
            setError('INVALID_STATUS: OPERATION ABORTED');
            return;
        }

        if (newStatus === 'fixed') {
            const adminHandle = user?.email?.split('@')[0] || 'ADMIN';
            setPatchModal({
                submissionId: id,
                form: { 
                    ...DEFAULT_PATCH, 
                    fixed_by: adminHandle, 
                    fixed_at: new Date().toISOString(),
                    app_version: availableVersions[0] || '1.0.0-alpha'
                }
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
            setError(null);
        } catch (err: any) {
            console.error('Update error:', err);
            setError(`UPDATE_FAILURE: ${err.message || 'PERMISSION DENIED BY CORE'}`);
        }
    };

    const handleCloseModal = (force: boolean = false) => {
        if (!patchModal) return;
        const hasContent = patchModal.form.patch_code.trim() !== '' || patchModal.form.app_version.trim() !== '';
        if (force || !hasContent || window.confirm('DISCARD_INTEL: Unsaved patch data will be redacted. Proceed?')) {
            setPatchModal(null);
        }
    };

    const savePatchIntel = async () => {
        if (!patchModal) return;
        
        // Input validation (W11)
        const { app_version, fixed_by, patch_code } = patchModal.form;
        
        if (!/^[a-zA-Z0-9.-]+$/.test(app_version) || app_version.length > 20) {
            setError('INVALID_VERSION: Alpha-numeric, dots, dashes only (max 20)');
            return;
        }
        if (fixed_by.length > 50) {
            setError('INVALID_SIGNATURE: Max 50 characters');
            return;
        }
        if (patch_code.length > 10000) {
            setError('PATCH_OVERFLOW: Code exceeds 10k character limit');
            return;
        }

        setPatchSaving(true);
        setError(null);
        try {
            const submission = submissions.find(s => s.id === patchModal.submissionId);
            const { error } = await supabase
                .from('bug_bounty_submissions')
                .update({ status: 'fixed', patch_intel: patchModal.form })
                .eq('id', patchModal.submissionId);
            if (error) throw error;

            if (submission) {
                await supabase
                    .from('notifications')
                    .insert([{
                        user_id: (submission as any).user_id,
                        message: `PATCH_INTEL: Cultivator, your finding #${submission.id.slice(0, 6)} has been patched in v${patchModal.form.app_version}.`,
                        type: 'bounty'
                    }]);
            }

            setSubmissions(prev => prev.map(s =>
                s.id === patchModal.submissionId
                    ? { ...s, status: 'fixed', patch_intel: patchModal.form }
                    : s
            ));
            setPatchModal(null);
        } catch (err: any) {
            console.error('Patch save error:', err);
            setError(`COMMIT_FAILURE: ${err.message || 'DATABASE UPLINK REJECTED'}`);
        } finally {
            setPatchSaving(false);
        }
    };

    const handleAssignRep = async (sub: Submission) => {
        if (sub.status !== 'fixed') {
            setError('INVALID_STATE: Rewards can only be assigned to fixed bugs.');
            return;
        }

        // Calculate base reward based on severity
        let baseReward = 0;
        switch (sub.severity) {
            case 'Critical': baseReward = 15000; break;
            case 'High': baseReward = 7500; break;
            case 'Medium': baseReward = 3500; break;
            case 'Low': baseReward = 1500; break;
            default: baseReward = 1000; break;
        }

        const promptInput = window.prompt(`Enter reward amount in Spirit Stones for this ${sub.severity} bug:`, baseReward.toString());
        if (promptInput === null) return; // User canceled
        const finalReward = parseInt(promptInput, 10);
        if (isNaN(finalReward) || finalReward < 0) {
            setError('INVALID_REWARD: Please enter a valid positive number.');
            return;
        }

        setRepLoading(prev => ({ ...prev, [sub.id]: true }));
        setError(null);
        try {
            const newPatchIntel = sub.patch_intel 
                ? { ...sub.patch_intel, reward_amount: finalReward }
                : { ...DEFAULT_PATCH, reward_amount: finalReward };

            const { error } = await supabase
                .from('bug_bounty_submissions')
                .update({ status: 'rewarded', patch_intel: newPatchIntel })
                .eq('id', sub.id);
            if (error) throw error;

            const { data: profileData } = await supabase
                .from('profiles')
                .select('achievements, rep, spirit_stones')
                .eq('user_id', (sub as any).user_id)
                .single();

            const achievements = profileData?.achievements || {};

            const updates: any = {
                spirit_stones: (profileData?.spirit_stones || 0) + finalReward
            };

            let isFirstBlood = false;
            let firstBloodBonus = 0;
            if (!achievements['first_blood']) {
                achievements['first_blood'] = new Date().toISOString();
                updates.achievements = achievements;
                firstBloodBonus = 500;
                updates.spirit_stones += firstBloodBonus;
                isFirstBlood = true;
            }

            await supabase
                .from('profiles')
                .update(updates)
                .eq('user_id', (sub as any).user_id);

            await supabase
                .from('notifications')
                .insert([{
                    user_id: (sub as any).user_id,
                    message: isFirstBlood 
                        ? `ACHIEVEMENT: FIRST BLOOD! Bounty #${sub.id.slice(0, 6)} reward + Badge issued. +${finalReward + firstBloodBonus} Total Spirit Stones.`
                        : `REWARD: Mission Complete: Bounty #${sub.id.slice(0, 6)} reward issued. +${finalReward} Spirit Stones assigned.`,
                    type: 'reward'
                }]);

            setSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, status: 'rewarded', patch_intel: newPatchIntel } : s));
        } catch (err: any) {
            console.error('Reward error:', err);
            setError(`REWARD_FAILURE: ${err.message || 'CREDIT TRANSFER FAILED'}`);
        } finally {
            setRepLoading(prev => ({ ...prev, [sub.id]: false }));
        }
    };

    const handleClearResolved = async () => {
        const resolvedCount = submissions.filter(s => s.status === 'fixed' || s.status === 'rewarded').length;
        if (resolvedCount === 0) {
            setError('NO_RESOLVED_BUGS: Nothing to clear.');
            return;
        }

        if (!window.confirm(`WARNING: You are about to permanently delete ${resolvedCount} resolved bugs. Active bugs will not be affected. Proceed?`)) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase
                .from('bug_bounty_submissions')
                .delete()
                .in('status', ['fixed', 'rewarded']);

            if (error) throw error;
            
            // Optimistically update the UI
            setSubmissions(prev => prev.filter(s => s.status !== 'fixed' && s.status !== 'rewarded'));
        } catch (err: any) {
            console.error('Clear resolved error:', err);
            setError(`CLEAR_FAILURE: ${err.message || 'DATABASE PURGE REJECTED'}`);
        } finally {
            setLoading(false);
        }
    };

    // Reset page when filter changes
    useEffect(() => { setCurrentPage(1); }, [filter]);

    // Updated Filtering: Severity tabs only show ACTIVE bugs. Fixed tab shows RESOLVED bugs.
    const filteredSubmissions = filter === 'fixed'
        ? submissions.filter(s => s.status === 'fixed' || s.status === 'rewarded')
        : filter === 'all'
            ? submissions
            : submissions.filter(s => s.severity === filter && s.status !== 'fixed' && s.status !== 'rewarded');

    const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / ITEMS_PER_PAGE));
    const paginatedSubmissions = filteredSubmissions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const statCritical = submissions.filter(s => s.severity === 'Critical' && s.status !== 'fixed' && s.status !== 'rewarded').length;
    const statOpen = submissions.filter(s => s.status === 'received' || s.status === 'confirmed').length;
    const statFixed = submissions.filter(s => s.status === 'fixed' || s.status === 'rewarded').length;

    const filterCounts: Record<string, number> = {
        all: submissions.length,
        Critical: statCritical,
        High: submissions.filter(s => s.severity === 'High' && s.status !== 'fixed' && s.status !== 'rewarded').length,
        Medium: submissions.filter(s => s.severity === 'Medium' && s.status !== 'fixed' && s.status !== 'rewarded').length,
        Low: submissions.filter(s => s.severity === 'Low' && s.status !== 'fixed' && s.status !== 'rewarded').length,
        fixed: statFixed,
    };

    if (profileLoading && !isIntegrated) return (
        <div className="abc-gate">SYNCHRONIZING ADMIN CLEARANCE...</div>
    );

    if (!profile?.is_admin && !isIntegrated) return (
        <div className="abc-gate">UNAUTHORIZED — ADMINISTRATOR PRIVILEGES REQUIRED</div>
    );

    return (
        <div className="abc-page" style={{ padding: isIntegrated ? 0 : '100px 2rem 2rem 2rem' }}>
            {!isIntegrated && (
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
                            <span className="abc-stat-label">Critical Active</span>
                            <span className="abc-stat-value">{statCritical}</span>
                        </div>
                        <div className="abc-stat" style={{ '--stat-accent': 'var(--hk-amber)' } as React.CSSProperties}>
                            <span className="abc-stat-label">Open Intel</span>
                            <span className="abc-stat-value">{statOpen}</span>
                        </div>
                        <div className="abc-stat" style={{ '--stat-accent': 'var(--hk-green)' } as React.CSSProperties}>
                            <span className="abc-stat-label">Resolved</span>
                            <span className="abc-stat-value">{statFixed}</span>
                        </div>
                    </div>
                </header>
            )}

            <div className="abc-controls">
                <div className="abc-filters">
                    {STATUS_FILTERS.map(f => (
                        <button
                            key={f}
                            className={`abc-filter-btn f-${f.toLowerCase()} ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'all' ? 'ALL' : f === 'fixed' ? '✓ RESOLVED' : f.toUpperCase()}
                            <span className="abc-filter-count">{filterCounts[f] ?? 0}</span>
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="abc-sync-btn" onClick={handleClearResolved} style={{ borderColor: 'var(--hk-red)', color: 'var(--hk-red)' }}>
                        ✕ CLEAR RESOLVED
                    </button>
                    <button className="abc-sync-btn" onClick={fetchSubmissions}>
                        <SyncIcon /> SYNC FEED
                    </button>
                </div>
            </div>

            {error && (
                <div className="abc-error-banner">
                    <span className="abc-error-icon">⚠️</span>
                    <span className="abc-error-msg">{error}</span>
                    <button className="abc-error-close" onClick={() => setError(null)}>×</button>
                </div>
            )}

            {loading ? (
                <div className="abc-loading">// SCANNING DATA UPLINK...</div>
            ) : (
                <div className="abc-feed">
                    {filteredSubmissions.length === 0 ? (
                        <div className="abc-empty">// NO FINDINGS DETECTED IN THIS SECTOR //</div>
                    ) : (
                        paginatedSubmissions.map(sub => (
                            <div className={`abc-card status-${sub.status}`} key={sub.id}>
                                <div className="abc-card-header">
                                    <span className={`abc-severity ${sub.severity.toLowerCase()}`}>{sub.severity}</span>
                                    <span className="abc-card-id">#{sub.id.slice(0, 8)}</span>
                                    <span className={`abc-status-indicator ${sub.status}`}>
                                        {sub.status === 'rewarded' && sub.patch_intel?.reward_amount 
                                            ? `REWARDED +${sub.patch_intel.reward_amount >= 1000 ? (sub.patch_intel.reward_amount/1000).toFixed(sub.patch_intel.reward_amount % 1000 === 0 ? 0 : 1) + 'k' : sub.patch_intel.reward_amount}`
                                            : sub.status}
                                    </span>
                                    <span className="abc-card-date">{new Date(sub.created_at).toLocaleString()}</span>
                                </div>
                                <div className="abc-card-body">
                                    <h3 className="abc-card-title">{sub.title}</h3>
                                    <div className="abc-card-meta">
                                        <span>CULTIVATOR: <span className="hl">{sub.operative_name}</span></span>
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

                                    {sub.status === 'fixed' || sub.status === 'rewarded' ? (
                                        sub.patch_intel && sub.patch_intel.app_version && (
                                            <div className="patch-intel-panel">
                                                <button className="patch-intel-toggle" onClick={() => setExpandedPatch(expandedPatch === sub.id ? null : sub.id)}>
                                                    <ShieldIcon /> PATCH INTEL
                                                    <span className="patch-version-chip">v{sub.patch_intel.app_version || '—'}</span>
                                                    <span className="patch-toggle-arrow">{expandedPatch === sub.id ? '▲' : '▼'}</span>
                                                </button>
                                                {expandedPatch === sub.id && (
                                                    <div className="patch-intel-body">
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
                                        )
                                    ) : null}
                                </div>
                                <div className="abc-card-footer">
                                    <select 
                                        className="abc-status-select" 
                                        value={sub.status} 
                                        onChange={(e) => updateStatus(sub.id, e.target.value)}
                                        disabled={sub.status === 'fixed' || sub.status === 'rewarded'}
                                    >
                                        {!STATUS_OPTIONS.includes(sub.status) && <option value={sub.status}>{sub.status.toUpperCase()}</option>}
                                        {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
                                    </select>
                                    <button 
                                        className="abc-rep-btn" 
                                        onClick={() => handleAssignRep(sub)} 
                                        disabled={repLoading[sub.id] || sub.status !== 'fixed'}
                                    >
                                        <RepIcon /> {repLoading[sub.id] ? 'ASSIGNING...' : 'ASSIGN SPIRIT STONES'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="abc-pagination">
                            <button
                                className="abc-page-btn"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                ◄ PREV
                            </button>
                            <div className="abc-page-numbers">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        className={`abc-page-num ${currentPage === page ? 'active' : ''}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <span className="abc-page-info">
                                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredSubmissions.length)} of {filteredSubmissions.length}
                            </span>
                            <button
                                className="abc-page-btn"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                NEXT ►
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal for Fix Intel */}
            {patchModal && (
                <div className="patch-modal-overlay">
                    <div className="patch-modal" onClick={e => e.stopPropagation()}>
                        <div className="patch-modal-header">
                            <div className="patch-modal-title-wrap">
                                <span className="patch-modal-icon">🔧</span>
                                <div>
                                    <div className="patch-modal-label">PATCH PROTOCOL</div>
                                    <h2 className="patch-modal-title">Log Fix Intel</h2>
                                </div>
                            </div>
                            <button className="patch-modal-close" onClick={() => handleCloseModal()}>✕</button>
                        </div>

                        <div className="patch-modal-body">
                            <div className="patch-field">
                                <label className="patch-label">APP VERSION <span className="patch-required">*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        className="patch-input"
                                        style={{ appearance: 'auto' }}
                                        value={patchModal.form.app_version}
                                        onChange={e => setPatchModal(prev => prev ? { ...prev, form: { ...prev.form, app_version: e.target.value } } : prev)}
                                    >
                                        {availableVersions.map(v => <option key={v} value={v}>{v}</option>)}
                                        <option value="custom">+ New Version...</option>
                                    </select>
                                    {patchModal.form.app_version === 'custom' && (
                                        <input
                                            className="patch-input"
                                            style={{ marginTop: '0.5rem' }}
                                            placeholder="Enter version (e.g. 1.1.0)"
                                            autoFocus
                                            onBlur={e => {
                                                if (e.target.value) {
                                                    setPatchModal(prev => prev ? { ...prev, form: { ...prev.form, app_version: e.target.value } } : prev);
                                                }
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="patch-field">
                                <label className="patch-label">FIXED TIMESTAMP</label>
                                <input
                                    className="patch-input"
                                    type="datetime-local"
                                    defaultValue={getLocalISODateTime()}
                                    onChange={e => setPatchModal(prev => prev ? { ...prev, form: { ...prev.form, fixed_at: new Date(e.target.value).toISOString() } } : prev)}
                                />
                            </div>

                            <div className="patch-field">
                                <label className="patch-label">ADMIN SIGNATURE</label>
                                <input
                                    className="patch-input"
                                    placeholder="e.g. V0idWalker"
                                    value={patchModal.form.fixed_by}
                                    onChange={e => setPatchModal(prev => prev ? { ...prev, form: { ...prev.form, fixed_by: e.target.value } } : prev)}
                                />
                            </div>

                            <div className="patch-field">
                                <label className="patch-label">PATCH CODE / DIFF <span className="patch-required">*</span></label>
                                <textarea
                                    className="patch-textarea"
                                    placeholder={"// Describe or paste the fix..."}
                                    value={patchModal.form.patch_code}
                                    onChange={e => setPatchModal(prev => prev ? { ...prev, form: { ...prev.form, patch_code: e.target.value } } : prev)}
                                />
                            </div>
                        </div>

                        <div className="patch-modal-footer">
                            <button className="patch-btn-ghost" onClick={() => handleCloseModal()}>Discard Changes</button>
                            <button
                                className="patch-btn-commit"
                                onClick={savePatchIntel}
                                disabled={patchSaving || !patchModal.form.app_version || !patchModal.form.patch_code || patchModal.form.app_version === 'custom'}
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
