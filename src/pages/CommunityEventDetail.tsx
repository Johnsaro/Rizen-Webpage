import React, { useState, useEffect } from 'react';
import './CommunityEventDetail.css';
import { rizenEvents, mockBugSubmissions } from '../data/rizenEvents';
import { useAuth } from '../context/AuthContext';
import { usePlayerProfile } from '../hooks/usePlayerProfile';
import { supabase } from '../lib/supabase';

interface Props {
    slug: string;
}

const CommunityEventDetail: React.FC<Props> = ({ slug }) => {
    const { user } = useAuth();
    const { profile } = usePlayerProfile();
    const event = rizenEvents.find(e => e.slug === slug);
    const [hasJoined, setHasJoined] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    const [showClearanceDenied, setShowClearanceDenied] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // New: Report Mode
    const [reportMode, setReportMode] = useState<'basic' | 'technical'>('basic');

    const MIN_XP_THRESHOLD = 500;

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        severity: 'Medium',
        component: '',
        description: '',
        steps: ''
    });

    // Check if user has already joined/participated
    useEffect(() => {
        if (user && event?.id === 'bb-v1') {
            const joined = localStorage.getItem(`joined_event_${event.id}_${user.id}`);
            if (joined) setHasJoined(true);
        }
    }, [user, event]);

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    if (!event) {
        return (
            <div className="event-detail-page reveal visible" style={{ textAlign: 'center', paddingTop: '10rem' }}>
                <h1>Event Archive Not Found</h1>
                <p>The requested operation protocol does not exist or has been redacted.</p>
                <a href="#/community/events" className="btn-secondary" style={{ marginTop: '2rem' }}>Return to Hub</a>
            </div>
        );
    }

    const handleJoinClick = () => {
        if (!user) {
            window.location.hash = '#/login';
            return;
        }

        const currentXP = profile?.current_xp || 0;
        if (currentXP < MIN_XP_THRESHOLD) {
            setShowClearanceDenied(true);
            return;
        }

        if (event.status === 'ended') return;

        setHasJoined(true);
        localStorage.setItem(`joined_event_${event.id}_${user.id}`, 'true');
        setToastMessage('✅ Participant Badge Unlocked. Welcome to the Hunt.');
    };

    const handleReportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);

        // Auto-capture metadata for the developer (the "Ghost Script")
        const metadata = {
            ua: navigator.userAgent,
            res: `${window.innerWidth}x${window.innerHeight}`,
            ver: 'v1.0.0-alpha',
            ts: new Date().toISOString(),
            mode: reportMode
        };

        const finalDescription = reportMode === 'basic'
            ? `${formData.description}\n\n[SYSTEM_AUTO_SCAN]:\nOS/Browser: ${metadata.ua}\nResolution: ${metadata.res}\nApp Version: ${metadata.ver}`
            : formData.description;

        try {
            const { error } = await supabase
                .from('bug_bounty_submissions')
                .insert([{
                    user_id: user.id,
                    operative_name: profile?.name || user.email?.split('@')[0] || 'Unknown',
                    title: formData.title || (reportMode === 'basic' ? `Glitch Report: ${formData.description.slice(0, 30)}...` : ''),
                    severity: reportMode === 'basic' ? 'Medium' : formData.severity,
                    component: reportMode === 'basic' ? 'General UI' : formData.component,
                    description: finalDescription,
                    steps: reportMode === 'basic' ? 'N/A - Quick Intel Mode' : formData.steps
                }]);

            if (error) throw error;

            setShowSubmitModal(false);
            setToastMessage('🛡️ Transmission Successful. Tech Spirits are investigating.');
            setFormData({ title: '', severity: 'Medium', component: '', description: '', steps: '' });
        } catch (err: any) {
            console.error('Submission error:', err);
            setToastMessage('❌ Transmission Failed. Signal jam detected.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const startDate = new Date(event.startDate).toLocaleDateString();
    const endDate = new Date(event.endDate).toLocaleDateString();

    const isBugBounty = event.id === 'bb-v1';

    return (
        <div className={`event-detail-page ${isBugBounty ? 'bug-bounty-theme' : ''} reveal visible`}>
            {toastMessage && (
                <div className={`toast-notification ${toastMessage ? 'show' : ''}`}>
                    {toastMessage}
                </div>
            )}

            <button onClick={() => window.location.hash = '#/community/events'} className="event-back-btn">
                ← Back to Operations
            </button>

            {isBugBounty ? (
                /* ── MODERN BUG BOUNTY HERO ── */
                <header className="bb-hero">
                    <div className="bb-hero-content">
                        <div className="bb-status-badge">
                            <span className="bb-pulse"></span>
                            SYSTEM STATUS: BOUNTY IS LIVE
                        </div>
                        <h1 className="bb-title">Project Zero <span>// Bug Bounty</span></h1>
                        <p className="bb-tagline">Identify vulnerabilities. Secure the protocol. Be rewarded in Reputation.</p>
                        
                        <div className="bb-stats-grid">
                            <div className="bb-stat-box">
                                <span className="bb-stat-label">MAX BOUNTY</span>
                                <span className="bb-stat-value">15,000 REP</span>
                            </div>
                            <div className="bb-stat-box">
                                <span className="bb-stat-label">RESPONSE TIME</span>
                                <span className="bb-stat-value">&lt; 48 HOURS</span>
                            </div>
                            <div className="bb-stat-box">
                                <span className="bb-stat-label">TOTAL PAID</span>
                                <span className="bb-stat-value">45,500 REP</span>
                            </div>
                        </div>

                        {!user ? (
                            <button className="bb-hero-btn" onClick={() => window.location.hash = '#/login'}>
                                LOGIN TO START HUNTING
                            </button>
                        ) : !hasJoined ? (
                            <button className="bb-hero-btn" onClick={handleJoinClick}>
                                JOIN THE OPERATION
                            </button>
                        ) : (
                            <div className="bb-active-status">
                                <div className="bb-operative-pill">
                                    <div className="bb-avatar">{(profile?.name || user?.email)?.charAt(0).toUpperCase()}</div>
                                    <div className="bb-op-info">
                                        <span className="bb-op-label">ACTIVE OPERATIVE</span>
                                        <span className="bb-op-name">{profile?.name || user?.email?.split('@')[0]}</span>
                                    </div>
                                </div>
                                <button className="bb-submit-btn" onClick={() => setShowSubmitModal(true)}>
                                    SUBMIT FINDINGS
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="bb-hero-visual">
                        <div className="bb-grid-bg"></div>
                        <div className="bb-scanner-line"></div>
                        <div className="bb-hacker-icon">🪲</div>
                    </div>
                </header>
            ) : (
                <header className="event-detail-header">
                    <div className="event-meta">
                        <span className="event-icon-large">{event.icon}</span>
                        <div className={`event-status status-${event.status}`} style={{ position: 'relative', top: 'auto', right: 'auto' }}>
                            {event.status}
                        </div>
                    </div>
                    <h1>{event.title}</h1>
                    <div className="event-tagline-large">{event.tagline}</div>

                    <div className="event-timeline">
                        <div className="timeline-item">
                            <span className="timeline-label">Launch Sequence</span>
                            <span className="timeline-date">{startDate}</span>
                        </div>
                        <span style={{ color: 'var(--text-dim)' }}>→</span>
                        <div className="timeline-item">
                            <span className="timeline-label">Operation End</span>
                            <span className="timeline-date">{endDate}</span>
                        </div>
                    </div>
                </header>
            )}

            <div className="bb-layout">
                <div className="bb-main-content">
                    <section className="event-detail-section">
                        <h2>Briefing</h2>
                        <div className="event-body-text">{event.description}</div>
                        
                        {isBugBounty && (
                            <div className="bb-how-it-works">
                                <h3>Operational Protocol</h3>
                                <div className="bb-steps-grid">
                                    {event.howItWorks?.map((step, idx) => (
                                        <div key={idx} className="bb-step-card">
                                            <div className="bb-step-number">{step.step}</div>
                                            <h4>{step.title}</h4>
                                            <p>{step.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {isBugBounty && (
                        <>
                            <section className="event-detail-section">
                                <h2>Rewards Structure</h2>
                                <div className="bb-rewards-table">
                                    <div className="bb-reward-row critical">
                                        <div className="bb-reward-tier">SSS // CRITICAL</div>
                                        <div className="bb-reward-desc">RCE, Unauthorized Data Access, Wallet Exploits</div>
                                        <div className="bb-reward-value">15,000 REP</div>
                                    </div>
                                    <div className="bb-reward-row high">
                                        <div className="bb-reward-tier">S // HIGH</div>
                                        <div className="bb-reward-desc">Broken Auth, Logical Exploits, XP Duplication</div>
                                        <div className="bb-reward-value">7,500 REP</div>
                                    </div>
                                    <div className="bb-reward-row medium">
                                        <div className="bb-reward-tier">A // MEDIUM</div>
                                        <div className="bb-reward-desc">Major UI Bugs, Performance Issues, Minor Logic</div>
                                        <div className="bb-reward-value">3,500 REP</div>
                                    </div>
                                    <div className="bb-reward-row low">
                                        <div className="bb-reward-tier">B // LOW</div>
                                        <div className="bb-reward-desc">Visual Glitches, Typos, Small UI Inconsistencies</div>
                                        <div className="bb-reward-value">1,500 REP</div>
                                    </div>
                                </div>
                            </section>

                            <section className="event-detail-section">
                                <h2>Program Scope</h2>
                                <div className="bb-scope-grid">
                                    <div className="bb-scope-item">
                                        <div className="bb-scope-header">
                                            <span className="bb-scope-icon">📱</span>
                                            <div>
                                                <h4>Mobile Application</h4>
                                                <small>Rizen Android Alpha</small>
                                            </div>
                                            <span className="bb-scope-tag in-scope">IN SCOPE</span>
                                        </div>
                                    </div>
                                    <div className="bb-scope-item">
                                        <div className="bb-scope-header">
                                            <span className="bb-scope-icon">🌐</span>
                                            <div>
                                                <h4>Showcase Portal</h4>
                                                <small>rizen.io Showcase Site</small>
                                            </div>
                                            <span className="bb-scope-tag in-scope">IN SCOPE</span>
                                        </div>
                                    </div>
                                    <div className="bb-scope-item out-scope">
                                        <div className="bb-scope-header">
                                            <span className="bb-scope-icon">🏢</span>
                                            <div>
                                                <h4>Third Party Infrastructure</h4>
                                                <small>Supabase, Vercel, etc.</small>
                                            </div>
                                            <span className="bb-scope-tag out-scope">OUT OF SCOPE</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}

                    <section className="event-detail-section">
                        <h2>Hall of Fame</h2>
                        <div className="bb-leaderboard">
                            {mockBugSubmissions.length > 0 ? (
                                mockBugSubmissions.map((sub, idx) => (
                                    <div key={sub.id} className="bb-leaderboard-item">
                                        <div className="bb-rank">{idx + 1}</div>
                                        <div className="bb-hunter">
                                            <span className="bb-hunter-name">{sub.userId}</span>
                                            <span className="bb-hunter-bug">{sub.title}</span>
                                        </div>
                                        <div className={`bb-severity-pill ${sub.severity.toLowerCase()}`}>
                                            {sub.severity}
                                        </div>
                                        <div className="bb-reward-pill">+{sub.score} REP</div>
                                    </div>
                                ))
                            ) : (
                                <div className="leaderboard-empty-state">
                                    <div className="radar-sweep-wrap">
                                        <div className="radar-circle-outer"></div>
                                        <div className="radar-sweep"></div>
                                    </div>
                                    <h3>Sector Status: SECURE</h3>
                                    <p>No vulnerabilities currently identified. Be the first to breach the perimeter.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {isBugBounty && (
                        <section className="event-detail-section">
                            <h2>Rules of Engagement</h2>
                            <ul className="bb-rules-list">
                                {event.rules.map((rule, idx) => (
                                    <li key={idx}>{rule}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                <aside className="bb-sidebar">
                    <div className="bb-sidebar-card">
                        <h3>Program FAQ</h3>
                        <div className="bb-faq-list">
                            {event.faqs?.map((faq, idx) => (
                                <div key={idx} className="bb-faq-item">
                                    <div className="bb-faq-q">{faq.q}</div>
                                    <div className="bb-faq-a">{faq.a}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bb-sidebar-card elite">
                        <div className="bb-elite-badge">🏆</div>
                        <h3>Top Reward</h3>
                        <p>The operative with the most critical findings will receive the <strong>"Exterminator Prime"</strong> legacy badge and 100,000 bonus REP at the end of the season.</p>
                    </div>
                </aside>
            </div>

            {/* CLEARANCE DENIED MODAL */}
            {showClearanceDenied && (
                <div className="modal-overlay" onClick={() => setShowClearanceDenied(false)}>
                    <div className="modal-content login-guard-modal" style={{ borderColor: 'var(--accent-amber)' }} onClick={e => e.stopPropagation()}>
                        <div className="guard-scan-line" style={{ background: 'var(--accent-amber)' }} />
                        <button className="guard-close-btn" onClick={() => setShowClearanceDenied(false)}>✕</button>
                        <div className="guard-icon-wrap">
                            <div className="guard-shield" style={{ color: 'var(--accent-amber)' }}>⚠️</div>
                        </div>
                        <div className="guard-label" style={{ color: 'var(--accent-amber)' }}>CLEARANCE DENIED</div>
                        <h2 className="guard-title">Insufficient Experience</h2>
                        <p className="guard-desc">
                            Operatives must possess at least <strong style={{ color: '#fff' }}>500 XP</strong> to join the Sentinel Uplink.<br />
                            Complete quests to increase your standing.
                        </p>
                        <div className="guard-code-block" style={{ background: 'rgba(245, 158, 11, 0.05)', color: 'var(--accent-amber)' }}>
                            <span className="guard-code-prefix">&gt;&nbsp;</span>
                            xp_level.verify(<span className="guard-code-hl" style={{ color: 'var(--accent-amber)' }}>{profile?.current_xp || 0}</span>) → <span className="guard-code-status" style={{ color: 'var(--accent-crimson)' }}>FAILED</span>
                        </div>
                        <div className="guard-actions">
                            <button className="guard-btn-ghost" onClick={() => setShowClearanceDenied(false)}>Return</button>
                            <button className="guard-btn-primary" style={{ background: 'var(--accent-amber)', color: '#000' }} onClick={() => window.location.hash = '#/'}>
                                Go to Quest Board
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SUBMIT REPORT MODAL (DUAL LANE) */}
            {showSubmitModal && (
                <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
                    <div className="modal-content submission-modal" onClick={e => e.stopPropagation()}>
                        <div className="sm-header">
                            <div className="sm-header-left">
                                <div className="sm-icon">📡</div>
                                <div>
                                    <div className="sm-badge">SECURE UPLINK</div>
                                    <h2 className="sm-title">Transmit Findings</h2>
                                    <p className="sm-subtitle">Direct channel → Guild Security Core</p>
                                </div>
                            </div>
                            <button className="sm-close" onClick={() => setShowSubmitModal(false)}>✕</button>
                        </div>

                        {/* MODE TOGGLE */}
                        <div className="sm-mode-toggle">
                            <button
                                className={`sm-mode-btn ${reportMode === 'basic' ? 'active' : ''}`}
                                onClick={() => setReportMode('basic')}
                            >
                                <span className="mode-icon">⚡</span>
                                QUICK INTEL
                                <small>Something is broken</small>
                            </button>
                            <button
                                className={`sm-mode-btn ${reportMode === 'technical' ? 'active' : ''}`}
                                onClick={() => setReportMode('technical')}
                            >
                                <span className="mode-icon">🧪</span>
                                TACTICAL REPORT
                                <small>Technical/Security bug</small>
                            </button>
                        </div>

                        <form onSubmit={handleReportSubmit} className="sm-form">
                            {reportMode === 'technical' ? (
                                <>
                                    <div className="sm-field">
                                        <label className="sm-label">Vulnerability Title</label>
                                        <input className="sm-input" type="text" required placeholder="e.g. Broken Access Control on Guild Board" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                                    </div>
                                    <div className="sm-row">
                                        <div className="sm-field">
                                            <label className="sm-label">Severity</label>
                                            <div className="sm-severity-pills">
                                                {['Critical', 'High', 'Medium', 'Low'].map(s => (
                                                    <button key={s} type="button" className={`sm-pill sm-pill-${s.toLowerCase()}${formData.severity === s ? ' active' : ''}`} onClick={() => setFormData({ ...formData, severity: s })}>{s}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="sm-field">
                                            <label className="sm-label">Affected Component</label>
                                            <input className="sm-input" type="text" required placeholder="e.g. Auth Service" value={formData.component} onChange={(e) => setFormData({ ...formData, component: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="sm-field">
                                        <label className="sm-label">Detailed Description</label>
                                        <textarea className="sm-textarea" required placeholder="Explain the impact and mechanics of the vulnerability." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                    </div>
                                    <div className="sm-field">
                                        <label className="sm-label">Steps to Reproduce</label>
                                        <textarea className="sm-textarea sm-textarea-steps" required placeholder={`1. Go to...\n2. Click...\n3. Observe...`} value={formData.steps} onChange={(e) => setFormData({ ...formData, steps: e.target.value })} />
                                    </div>
                                </>
                            ) : (
                                <div className="sm-field">
                                    <label className="sm-label">Describe the Glitch</label>
                                    <textarea
                                        className="sm-textarea"
                                        style={{ minHeight: '180px' }}
                                        required
                                        placeholder="I was trying to [ACTION] but instead [WHAT HAPPENED]..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                    <div className="sm-meta-hint" style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                                        🛡️ Sentinel Ghost-Script active. Browser and system metadata will be automatically attached to this report for the engineers.
                                    </div>
                                </div>
                            )}

                            <div className="sm-footer">
                                <button type="button" className="sm-btn-ghost" onClick={() => setShowSubmitModal(false)}>Discard</button>
                                <button type="submit" className="sm-btn-transmit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Transmitting...' : '⚡ Transmit Package'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityEventDetail;
