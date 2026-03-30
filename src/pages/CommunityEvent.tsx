import React, { useState, useEffect } from 'react';
import './CommunityEvent.css';

const CommunityEvent: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`event-page ${visible ? 'entered' : ''}`}>
            {/* HERO SECTION */}
            <section className="event-hero">
                <div className="status-tag pulse-border">MISSION BRIEFING</div>
                <h1 className="glitch-title" data-text="Rizen Community Challenge">
                    Rizen Community Challenge
                </h1>
                <h2 className="event-subtitle">
                    Join the Sect. Track your progress. Rise above the rest.
                </h2>
                <p className="event-description">
                    Rizen turns life and productivity into a cultivation system. Participate in the community challenge and climb the leaderboard.
                </p>
                <div className="event-cta-group">
                    <button className="btn-primary">Join the Challenge</button>
                    <a href="#/community" className="btn-secondary" style={{ marginLeft: '1rem' }}>Return to Hub</a>
                </div>
            </section>

            {/* REWARD SYSTEM SECTION */}
            <section className="event-section">
                <div className="centered-header">
                    <h2 className="title-large">CULTIVATION TIERS</h2>
                    <p className="p-large" style={{ marginTop: '1rem' }}>Ascension brings privileges. Prove your consistency.</p>
                </div>
                <div className="reward-grid">
                    {[
                        {
                            abbr: 'MTL', name: 'Mortal', tier: 'base',
                            desc: 'Entry level participation in the challenge.',
                            perks: ['Community recognition', 'Sect Access']
                        },
                        {
                            abbr: 'FND', name: 'Foundation', tier: 'mid',
                            desc: 'Consistent progress and active tracking.',
                            perks: ['Leaderboard ranking visibility', 'Verified status', 'Beta feature access']
                        },
                        {
                            abbr: 'NAS', name: 'Nascent Soul', tier: 'elite',
                            desc: 'Top 5% on the global leaderboard.',
                            perks: ['Exclusive Discord Role', 'Custom Neon Cloak cosmetic', 'Direct line to The System']
                        }
                    ].map((t, idx) => (
                        <div key={idx} className={`reward-card ${t.tier === 'elite' ? 'elite' : ''}`} style={{ '--card-idx': idx } as React.CSSProperties}>
                            <div className={`reward-icon mock-rank-${t.tier === 'elite' ? 's' : t.tier === 'mid' ? 'a' : 'f'}`}>
                                {t.abbr}
                            </div>
                            <h3>{t.name}</h3>
                            <p className="tier-desc">{t.desc}</p>
                            <ul className="reward-list">
                                {t.perks.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="event-section threat-bg">
                <div className="centered-header">
                    <h2 className="title-large">HOW IT WORKS</h2>
                    <p className="p-large" style={{ marginTop: '1rem' }}>The path is simple. Execution is the separator.</p>
                </div>
                <div className="steps-container">
                    {[
                        { num: '01', title: 'Join the Sect', desc: 'Create a Rizen account and enter the community challenge. Select your initial Dao Path.' },
                        { num: '02', title: 'Track Your Progress', desc: 'Use the Rizen system to log builds, track productivity sessions, and hit daily personal milestones.' },
                        { num: '03', title: 'Earn Spirit Stones', desc: 'Your validated progress contributes to your overall Spirit Stones and VLD rate.' },
                        { num: '04', title: 'Rise in Rank', desc: 'The most consistent builders climb the global leaderboard ranks and earn community-wide recognition.' }
                    ].map((step, idx) => (
                        <React.Fragment key={idx}>
                            <div className="step-row" style={{ '--step-idx': idx } as React.CSSProperties}>
                                <div className="step-number">{step.num}</div>
                                <div className="step-content">
                                    <h3>{step.title}</h3>
                                    <p>{step.desc}</p>
                                </div>
                            </div>
                            {idx < 3 && <div className="step-line"></div>}
                        </React.Fragment>
                    ))}
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
                        <div>CULTIVATOR</div>
                        <div>DAO PATH</div>
                        <div style={{ textAlign: 'center' }}>VLD_RATE</div>
                        <div style={{ textAlign: 'right' }}>SPIRIT_STONES</div>
                    </div>
                    {[
                        { rank: 1, user: 'V0idWalker', level: 'S', class: 'Shadow Arts', vld: '98.2%', rep: '94,200', active: true },
                        { rank: 2, user: 'NeoConstruct', level: 'S', class: 'Formation Master', vld: '96.5%', rep: '89,450' },
                        { rank: 3, user: 'GhostWire', level: 'A', class: 'Shadow Arts', vld: '94.1%', rep: '82,100' },
                    ].map((op, idx) => (
                        <div key={op.rank} className="ranking-row rank-top" style={{ '--row-idx': idx } as React.CSSProperties}>
                            <div className="rank-num">
                                {idx < 3 ? <span className="rank-medal">{['🥇', '🥈', '🥉'][idx]}</span> : op.rank}
                            </div>
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
            <section className="event-section community-links-section">
                <div className="centered-header">
                    <h2 className="title-large" style={{ fontSize: '2.5rem' }}>COMMUNITY HUB</h2>
                    <p className="p-large" style={{ marginTop: '1rem', maxWidth: '500px' }}>
                        The Sect operates together. Join discussions, share builds, and evolve with the community.
                    </p>
                </div>

                <div className="community-links-grid">
                    {[
                        { id: 'docs', icon: '📚', label: 'Docs' },
                        { id: 'events', icon: '🗓️', label: 'Events' },
                        { id: 'blog', icon: '✍️', label: 'Blog' },
                        { id: 'discord', icon: '💬', label: 'Discord' },
                    ].map((link, idx) => (
                        <a key={link.id} href={`#/community/${link.id}`} className="community-link-card" style={{ '--link-idx': idx } as React.CSSProperties}>
                            <div className="clc-icon">{link.icon}</div>
                            <h3>{link.label}</h3>
                            <span className="clc-arrow">→</span>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default CommunityEvent;
