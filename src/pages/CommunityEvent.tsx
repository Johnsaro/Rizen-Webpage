import React from 'react';
import './CommunityEvent.css';

const CommunityEvent: React.FC = () => {
    return (
        <div className="event-page">
            {/* HERO SECTION */}
            <section className="event-hero">
                <div className="status-tag pulse-border">MISSION BRIEFING</div>
                <h1 className="glitch-title" data-text="Rizen Community Challenge">
                    Rizen Community Challenge
                </h1>
                <h2 className="event-subtitle">
                    Join the Guild. Track your progress. Rise above the rest.
                </h2>
                <p className="event-description">
                    Rizen turns life and productivity into a progression system. Participate in the community challenge and climb the leaderboard.
                </p>
                <div className="event-cta-group">
                    <button className="btn-primary">Join the Challenge</button>
                    <a href="#/community" className="btn-secondary" style={{ marginLeft: '1rem' }}>Return to Hub</a>
                </div>
            </section>

            {/* REWARD SYSTEM SECTION */}
            <section className="event-section">
                <div className="centered-header">
                    <h2 className="title-large">REWARD TIERS</h2>
                    <p className="p-large" style={{ marginTop: '1rem' }}>Ascension brings privileges. Prove your consistency.</p>
                </div>
                <div className="reward-grid">
                    <div className="reward-card tilt-card">
                        <div className="reward-icon mock-rank-f" style={{ width: '48px', height: '48px', margin: '0 0 1.5rem', fontSize: '1.2rem', borderColor: 'var(--text-dim)' }}>
                            REC
                        </div>
                        <h3>Recruit</h3>
                        <p className="tier-desc">Entry level participation in the challenge.</p>
                        <ul className="reward-list">
                            <li>Community recognition</li>
                            <li>Guild Access</li>
                        </ul>
                    </div>
                    <div className="reward-card tilt-card">
                        <div className="reward-icon mock-rank-a" style={{ width: '48px', height: '48px', margin: '0 0 1.5rem', fontSize: '1.2rem' }}>
                            OPR
                        </div>
                        <h3>Operator</h3>
                        <p className="tier-desc">Consistent progress and active tracking.</p>
                        <ul className="reward-list">
                            <li>Leaderboard ranking visibility</li>
                            <li>Verified status</li>
                            <li>Beta feature access</li>
                        </ul>
                    </div>
                    <div className="reward-card tilt-card elite">
                        <div className="reward-icon mock-rank-s" style={{ width: '48px', height: '48px', margin: '0 0 1.5rem', fontSize: '1.2rem' }}>
                            ELT
                        </div>
                        <h3>Elite</h3>
                        <p className="tier-desc">Top 5% on the global leaderboard.</p>
                        <ul className="reward-list">
                            <li>Exclusive Discord Role</li>
                            <li>Custom Neon Cloak cosmetic</li>
                            <li>Direct line to Guildmaster</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="event-section threat-bg">
                <div className="centered-header">
                    <h2 className="title-large">HOW IT WORKS</h2>
                    <p className="p-large" style={{ marginTop: '1rem' }}>The path is simple. Execution is the separator.</p>
                </div>
                <div className="steps-container">
                    <div className="step-row">
                        <div className="step-number">01</div>
                        <div className="step-content">
                            <h3>Join the Guild</h3>
                            <p>Create a Rizen account and enter the community challenge. Select your initial class discipline.</p>
                        </div>
                    </div>
                    <div className="step-line"></div>
                    <div className="step-row">
                        <div className="step-number">02</div>
                        <div className="step-content">
                            <h3>Track Your Progress</h3>
                            <p>Use the Rizen system to log builds, track productivity sessions, and hit daily personal milestones.</p>
                        </div>
                    </div>
                    <div className="step-line"></div>
                    <div className="step-row">
                        <div className="step-number">03</div>
                        <div className="step-content">
                            <h3>Earn Reputation</h3>
                            <p>Your validated progress contributes to your overall Reputation Score (REP) and VLD rate.</p>
                        </div>
                    </div>
                    <div className="step-line"></div>
                    <div className="step-row">
                        <div className="step-number">04</div>
                        <div className="step-content">
                            <h3>Rise in Rank</h3>
                            <p>The most consistent builders climb the global leaderboard ranks and earn community-wide recognition.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* LEADERBOARD PREVIEW SECTION */}
            <section className="event-section">
                <div className="centered-header">
                    <h2 className="title-large">CURRENT STANDINGS</h2>
                    <p className="p-large" style={{ marginTop: '1rem' }}>The elite who refuse to stagnate.</p>
                </div>
                <div className="rankings-container">
                    <div className="ranking-row header">
                        <div>#</div>
                        <div>OPERATIVE</div>
                        <div>CLASS</div>
                        <div style={{ textAlign: 'center' }}>VLD_RATE</div>
                        <div style={{ textAlign: 'right' }}>REP_TOTAL</div>
                    </div>
                    {[
                        { rank: 1, user: 'V0idWalker', level: 'S', class: 'Sec Admin', vld: '98.2%', rep: '94,200', active: true },
                        { rank: 2, user: 'NeoConstruct', level: 'S', class: 'Software Eng', vld: '96.5%', rep: '89,450' },
                        { rank: 3, user: 'GhostWire', level: 'A', class: 'Red Team', vld: '94.1%', rep: '82,100' },
                    ].map((op) => (
                        <div key={op.rank} className={`ranking-row rank-top`}>
                            <div className="rank-num">{op.rank}</div>
                            <div className="rank-user">
                                <span className={`mock-rank-${op.level.toLowerCase()}`}>{op.level}</span>
                                {op.user}
                            </div>
                            <div><span className="rank-class">{op.class}</span></div>
                            <div style={{ textAlign: 'center', fontFamily: 'Fira Code', fontSize: '0.85rem' }}>{op.vld}</div>
                            <div className="rank-rep" style={{ textAlign: 'right', color: op.active ? 'var(--accent-cyan)' : 'inherit' }}>{op.rep}</div>
                        </div>
                    ))}
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <a href="#/" className="btn-secondary" style={{ fontSize: '0.8rem' }}>View Full Board</a>
                    </div>
                </div>
            </section>

            {/* COMMUNITY LINKS SECTION */}
            <section className="event-section" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '4rem', paddingTop: '6rem' }}>
                <div className="centered-header">
                    <h2 className="title-large" style={{ fontSize: '2.5rem' }}>COMMUNITY HUB</h2>
                    <p className="p-large" style={{ marginTop: '1rem', maxWidth: '500px' }}>
                        The Guild operates together. Join discussions, share builds, and evolve with the community.
                    </p>
                </div>

                <div className="community-grid" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <a href="#/community/docs" className="community-card compact-card">
                        <div className="community-icon" style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', letterSpacing: '1px' }}>Docs</h3>
                    </a>
                    <a href="#/community/events" className="community-card compact-card">
                        <div className="community-icon" style={{ fontSize: '2rem', marginBottom: '1rem' }}>🗓️</div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', letterSpacing: '1px' }}>Events</h3>
                    </a>
                    <a href="#/community/blog" className="community-card compact-card">
                        <div className="community-icon" style={{ fontSize: '2rem', marginBottom: '1rem' }}>✍️</div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', letterSpacing: '1px' }}>Blog</h3>
                    </a>
                    <a href="#/community/discord" className="community-card compact-card">
                        <div className="community-icon" style={{ fontSize: '2rem', marginBottom: '1rem' }}>💬</div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', letterSpacing: '1px' }}>Discord</h3>
                    </a>
                </div>
            </section>
        </div>
    );
};

export default CommunityEvent;
