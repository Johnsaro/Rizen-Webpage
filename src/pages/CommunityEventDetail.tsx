import React, { useState, useEffect } from 'react';
import './CommunityEventDetail.css';
import { rizenEvents, mockBugSubmissions } from '../data/rizenEvents';

interface Props {
    slug: string;
}

const CommunityEventDetail: React.FC<Props> = ({ slug }) => {
    const event = rizenEvents.find(e => e.slug === slug);
    const [hasJoined, setHasJoined] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Clean up toast automatically
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

    const handleJoin = () => {
        if (event.status === 'ended') return;
        setHasJoined(true);
        setToastMessage('✅ Participant Badge Unlocked. Welcome to the Hunt.');
    };

    const handleReportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSubmitModal(false);
        setToastMessage('🛡️ Report Transmitted. Awaiting validation.');
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
                        <h2>Rules of Engagement</h2>
                        <ul className="event-list rules">
                            {event.rules.map((rule, i) => (
                                <li key={i}>{rule}</li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>

            <section className="event-detail-section">
                <div className="event-actions">
                    <div style={{ flexGrow: 1 }}>
                        <h3 style={{ margin: '0 0 0.5rem', color: '#fff', fontSize: '1.2rem' }}>Participate in the Operation</h3>
                        <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                            {event.status === 'ended' ? 'This operation is concluded.' : 'Active participation is logged on the ledger.'}
                        </p>
                    </div>
                    {event.status !== 'ended' && !hasJoined && (
                        <button className="btn-primary" onClick={handleJoin} style={{ minHeight: '44px' }}>
                            {event.ctaLabel}
                        </button>
                    )}
                    {event.status !== 'ended' && hasJoined && (
                        <button className="btn-primary" onClick={() => setShowSubmitModal(true)} style={{ minHeight: '44px', background: 'var(--accent-violet)', borderColor: 'var(--accent-violet)' }}>
                            Submit Findings Report
                        </button>
                    )}
                </div>
            </section>

            {/* Leaderboard/Submissions if Event has them (e.g. Bug Bounty) */}
            {event.id === 'bb-v1' && (
                <section className="event-detail-section">
                    <h2>Confirmed Bounties LEDGER</h2>
                    <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>{event.scoringRules}</p>

                    <div className="submissions-list">
                        {mockBugSubmissions.map(sub => (
                            <div className="submission-card" key={sub.id}>
                                <div>
                                    <span className={`severity-badge severity-${sub.severity}`}>{sub.severity}</span>
                                </div>
                                <div>
                                    <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '0.3rem' }}>{sub.title}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Operative: <span style={{ color: 'var(--accent-cyan)' }}>{sub.userId}</span> • Target: {sub.affectedArea}</div>
                                </div>
                                <div className="sub-score">+{sub.score?.toLocaleString()} REP</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Submit Report Modal */}
            {showSubmitModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button
                            style={{ position: 'absolute', top: '1rem', right: '1.5rem', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
                            onClick={() => setShowSubmitModal(false)}
                        >×</button>

                        <h2 style={{ fontFamily: 'Space Grotesk', color: '#fff', marginBottom: '2rem' }}>Transmit Findings</h2>

                        <form onSubmit={handleReportSubmit}>
                            <div className="form-group">
                                <label>Vulnerability Title</label>
                                <input type="text" required placeholder="e.g. Broken Access Control on Guild Board" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label>Severity Classification</label>
                                    <select required>
                                        <option value="Critical">Critical</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Affected Component</label>
                                    <input type="text" required placeholder="e.g. Auth Service" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Detailed Description</label>
                                <textarea required placeholder="Explain the impact and mechanics of the vulnerability."></textarea>
                            </div>

                            <div className="form-group">
                                <label>Steps to Reproduce</label>
                                <textarea required placeholder="1. Go to...\n2. Click...\n3. Observe..."></textarea>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn-secondary" onClick={() => setShowSubmitModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Transmit Package</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityEventDetail;
