import React, { useState, useEffect } from 'react';
import './CommunityEventDetail.css';
import { rizenEvents } from '../data/rizenEvents';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface Props {
    slug: string;
}

const CommunityEventDetail: React.FC<Props> = ({ slug }) => {
    const { user } = useAuth();
    const event = rizenEvents.find(e => e.slug === slug);
    const [hasJoined, setHasJoined] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            setShowLoginPrompt(true);
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

        try {
            const { error } = await supabase
                .from('bug_bounty_submissions')
                .insert([{
                    user_id: user.id,
                    operative_name: user.email?.split('@')[0] || 'Unknown',
                    title: formData.title,
                    severity: formData.severity,
                    component: formData.component,
                    description: formData.description,
                    steps: formData.steps
                }]);

            if (error) throw error;

            setShowSubmitModal(false);
            setToastMessage('🛡️ Report Transmitted. Awaiting validation.');
            setFormData({ title: '', severity: 'Medium', component: '', description: '', steps: '' });
        } catch (err: any) {
            console.error('Submission error:', err);
            setToastMessage('❌ Transmission Failed. Check connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const startDate = new Date(event.startDate).toLocaleDateString();
    const endDate = new Date(event.endDate).toLocaleDateString();

    return (
        <div className="event-detail-page reveal visible">
            {toastMessage && (
                <div className={`toast-notification ${toastMessage ? 'show' : ''}`}>
                    {toastMessage}
                </div>
            )}

            <button onClick={() => window.location.hash = '#/community/events'} className="event-back-btn">
                ← Back to Operations
            </button>

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

            <section className="event-detail-section">
                <h2>Briefing</h2>
                <div className="event-body-text">{event.description}</div>
                {event.eligibility && (
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--accent-violet)', marginTop: '1rem' }}>
                        <strong>Eligibility Constraint:</strong> {event.eligibility}
                    </div>
                )}
            </section>

            <div style={{ display: 'grid', gap: '3rem', gridTemplateColumns: 'minmax(0, 1fr)' }}>
                {event.rewards.length > 0 && (
                    <section className="event-detail-section" style={{ marginBottom: 0 }}>
                        <h2>Rewards & Commendations</h2>
                        <ul className="event-list rewards">
                            {event.rewards.map((reward, i) => (
                                <li key={i}>{reward}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {event.rules.length > 0 && (
                    <section className="event-detail-section" style={{ marginBottom: 0 }}>
                        <h2>Rules & Guidelines</h2>
                        <ul className="event-list rules">
                            {event.rules.map((rule, i) => (
                                <li key={i}>{rule}</li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>

            {event.howItWorks && event.howItWorks.length > 0 && (
                <section className="event-detail-section">
                    <h2>How it Works</h2>
                    <div className="steps-container">
                        {event.howItWorks.map((step, i) => (
                            <React.Fragment key={i}>
                                <div className="step-row">
                                    <div className="step-number">{step.step}</div>
                                    <div className="step-content">
                                        <h3>{step.title}</h3>
                                        <p>{step.desc}</p>
                                    </div>
                                </div>
                                {i < (event.howItWorks?.length || 0) - 1 && <div className="step-line"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </section>
            )}

            {event.faqs && event.faqs.length > 0 && (
                <section className="event-detail-section">
                    <h2>FAQ</h2>
                    <div className="faq-grid">
                        {event.faqs.map((faq, i) => (
                            <div key={i} className="faq-card">
                                <div className="faq-question">{faq.q}</div>
                                <div className="faq-answer">{faq.a}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Leaderboard/Submissions if Event has them (e.g. Bug Bounty) */}
            {event.id === 'bb-v1' && (
                <section className="event-detail-section">
                    <h2>Leaderboard</h2>
                    <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Top bug hunters by total earnings.</p>

                    <div className="leaderboard-empty-state">
                        <div className="empty-icon">🏆</div>
                        <h3>No earners yet</h3>
                        <p>Be the first to find a bug and claim your spot!</p>
                    </div>
                </section>
            )}

            <section className="event-detail-section">
                <div className="event-actions">
                    <div style={{ flexGrow: 1 }}>
                        <h3 style={{ margin: '0 0 0.5rem', color: '#fff', fontSize: '1.2rem' }}>Ready to start hunting?</h3>
                        <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                            {event.status === 'ended' ? 'This operation is concluded.' : 'Active participation is logged on the ledger.'}
                        </p>
                    </div>
                    {event.status !== 'ended' && !hasJoined && (
                        <button className="btn-primary" onClick={handleJoinClick} style={{ minHeight: '44px' }}>
                            {event.ctaLabel}
                        </button>
                    )}
                    {event.status !== 'ended' && hasJoined && (
                        <div className="operative-hunt-status">
                            {/* Left: operative chip */}
                            <div className="hunt-operative-chip">
                                <div className="hunt-avatar">
                                    {user?.email?.charAt(0).toUpperCase()}
                                </div>
                                <div className="operative-info">
                                    <span className="operative-label">OPERATIVE</span>
                                    <span className="operative-name">{user?.email?.split('@')[0]}</span>
                                </div>
                            </div>

                            {/* Centre: ON HUNT badge */}
                            <div className="hunt-badge-wrap">
                                <div className="hunt-indicator">
                                    <span className="hunt-pulse"></span>
                                    <span className="hunt-text">ON HUNT</span>
                                </div>
                                <div className="hunt-sub">Active · Bug Bounty V1</div>
                            </div>

                            {/* Right: CTA */}
                            <button
                                className="hunt-submit-btn"
                                onClick={() => setShowSubmitModal(true)}
                            >
                                <span className="hunt-submit-icon">📡</span>
                                Submit Findings Report
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* LOGIN PROMPT MODAL */}
            {showLoginPrompt && (
                <div className="modal-overlay" onClick={() => setShowLoginPrompt(false)}>
                    <div className="modal-content login-guard-modal" onClick={e => e.stopPropagation()}>
                        {/* Scan line animation */}
                        <div className="guard-scan-line" />

                        {/* Close button */}
                        <button className="guard-close-btn" onClick={() => setShowLoginPrompt(false)} aria-label="Close">✕</button>

                        <div className="guard-icon-wrap">
                            <div className="guard-shield">🔒</div>
                            <div className="guard-ring guard-ring-1" />
                            <div className="guard-ring guard-ring-2" />
                        </div>

                        <div className="guard-label">ACCESS RESTRICTED</div>

                        <h2 className="guard-title">Operative Identity Required</h2>

                        <p className="guard-desc">
                            This operation requires a verified Operative account.<br />
                            Log in to join the Hunt and submit your findings.
                        </p>

                        <div className="guard-code-block">
                            <span className="guard-code-prefix">&gt;&nbsp;</span>
                            identity.verify(<span className="guard-code-hl">operative_id</span>) → <span className="guard-code-status">PENDING</span>
                        </div>

                        <div className="guard-actions">
                            <button
                                className="guard-btn-ghost"
                                onClick={() => setShowLoginPrompt(false)}
                            >
                                Abort Mission
                            </button>
                            <button
                                className="guard-btn-primary"
                                onClick={() => {
                                    setShowLoginPrompt(false);
                                    window.dispatchEvent(new CustomEvent('open-auth-modal'));
                                    setToastMessage('Initiating Security Uplink...');
                                }}
                            >
                                <span className="guard-btn-icon">⚡</span>
                                Authenticate
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit Report Modal */}
            {showSubmitModal && (
                <div className="modal-overlay" onClick={() => setShowSubmitModal(false)}>
                    <div className="modal-content submission-modal" onClick={e => e.stopPropagation()}>

                        {/* Header */}
                        <div className="sm-header">
                            <div className="sm-header-left">
                                <div className="sm-icon">📡</div>
                                <div>
                                    <div className="sm-badge">SECURE UPLINK</div>
                                    <h2 className="sm-title">Transmit Findings</h2>
                                    <p className="sm-subtitle">Direct channel → Guild Security Core</p>
                                </div>
                            </div>
                            <button className="sm-close" onClick={() => setShowSubmitModal(false)} aria-label="Close">✕</button>
                        </div>

                        <form onSubmit={handleReportSubmit} className="sm-form">

                            {/* Vulnerability Title */}
                            <div className="sm-field">
                                <label className="sm-label">Vulnerability Title</label>
                                <input
                                    className="sm-input"
                                    type="text"
                                    required
                                    placeholder="e.g. Broken Access Control on Guild Board"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            {/* Severity pills + component */}
                            <div className="sm-row">
                                <div className="sm-field">
                                    <label className="sm-label">Severity</label>
                                    <div className="sm-severity-pills">
                                        {['Critical', 'High', 'Medium', 'Low'].map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                className={`sm-pill sm-pill-${s.toLowerCase()}${formData.severity === s ? ' active' : ''}`}
                                                onClick={() => setFormData({ ...formData, severity: s })}
                                            >{s}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="sm-field">
                                    <label className="sm-label">Affected Component</label>
                                    <input
                                        className="sm-input"
                                        type="text"
                                        required
                                        placeholder="e.g. Auth Service"
                                        value={formData.component}
                                        onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="sm-field">
                                <label className="sm-label">Detailed Description</label>
                                <textarea
                                    className="sm-textarea"
                                    required
                                    placeholder="Explain the impact and mechanics of the vulnerability."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* Steps */}
                            <div className="sm-field">
                                <label className="sm-label">Steps to Reproduce</label>
                                <textarea
                                    className="sm-textarea sm-textarea-steps"
                                    required
                                    placeholder={`1. Go to...\n2. Click...\n3. Observe...`}
                                    value={formData.steps}
                                    onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                                />
                            </div>

                            {/* Footer */}
                            <div className="sm-footer">
                                <button type="button" className="sm-btn-ghost" onClick={() => setShowSubmitModal(false)}>
                                    Discard
                                </button>
                                <button type="submit" className="sm-btn-transmit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? <><span className="sm-spinner" />Transmitting...</>
                                        : <><span>⚡</span>Transmit Package</>
                                    }
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