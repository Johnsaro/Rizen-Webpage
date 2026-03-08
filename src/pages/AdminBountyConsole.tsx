import React, { useState, useEffect } from 'react';
import './AdminBountyConsole.css';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

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

const FILTERS = ['all', 'Critical', 'High', 'Medium', 'Low'];
const STATUS_OPTIONS = ['received', 'confirmed', 'fixed', 'rewarded', 'rejected'];

const AdminBountyConsole: React.FC = () => {
    const { user } = useAuth();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [repLoading, setRepLoading] = useState<Record<string, boolean>>({});

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
        fetchSubmissions();
        const channel = supabase
            .channel('public:bug_bounty_submissions')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bug_bounty_submissions' }, fetchSubmissions)
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
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

    const handleAssignRep = async (sub: Submission) => {
        setRepLoading(prev => ({ ...prev, [sub.id]: true }));
        await updateStatus(sub.id, 'rewarded');
        setRepLoading(prev => ({ ...prev, [sub.id]: false }));
    };

    const filteredSubmissions = filter === 'all'
        ? submissions
        : submissions.filter(s => s.severity === filter);

    const statCritical = submissions.filter(s => s.severity === 'Critical').length;
    const statOpen = submissions.filter(s => s.status === 'received' || s.status === 'confirmed').length;

    if (!user) return (
        <div className="abc-gate">ACCESS DENIED — AUTHENTICATE FIRST</div>
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
                </div>
            </header>

            {/* ── CONTROLS ── */}
            <div className="abc-controls">
                <div className="abc-filters">
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            className={`abc-filter-btn f-${f.toLowerCase()} ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'all' ? 'ALL' : f.toUpperCase()}
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
        </div>
    );
};

export default AdminBountyConsole;