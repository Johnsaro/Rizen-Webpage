import React from 'react';
import './SystemArchitecture.css';

const orbitNodes = [
    { id: 'guild', title: 'The System', desc: 'Sentient cultivation guide', tag: 'CORE', path: '#/community/hub', icon: '🤖', angle: 0 },
    { id: 'combat', title: 'Combat Engine', desc: 'Knowledge-based combat system', tag: 'SIM', path: '#combat', icon: '⚔️', angle: 60 },
    { id: 'achievements', title: 'Achievement Matrix', desc: 'Badges and progression tracking', tag: 'PROG', path: '#records', icon: '🏆', angle: 120 },
    { id: 'economy', title: 'Economy System', desc: 'Consumables, buffs, and currency', tag: 'SYS', path: '#arsenal', icon: '💎', angle: 180 },
    { id: 'vault', title: 'Knowledge Vault', desc: 'Flashcards and learning system', tag: 'DATA', path: '#/community/docs', icon: '📚', angle: 240 },
    { id: 'events', title: 'Event Network', desc: 'Community challenges & bug bounties', tag: 'NET', path: '#/community/events', icon: '🌐', angle: 300 }
];

const SystemArchitecture: React.FC = () => {
    const handleNodeClick = (path: string) => {
        if (path.startsWith('#/')) {
            window.history.pushState(null, '', path);
            window.dispatchEvent(new Event('hashchange'));
        } else {
            const el = document.querySelector(path);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <section className="architecture-section section-padding threat-bg" id="architecture">
            <div className="centered-header reveal">
                <h2 className="title-large">RIZEN SYSTEM ARCHITECTURE</h2>
                <p className="p-large" style={{ marginTop: '1rem' }}>Every action flows through the core engine.</p>
            </div>

            <div className="architecture-container reveal">
                {/* Orbit System (Desktop) */}
                <div className="orbit-system-wrapper">
                    {/* SVG connecting lines (aesthetic) */}
                    <svg className="orbit-lines" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                        <circle cx="50" cy="50" r="38" className="orbit-circle fade-pulse" />
                        <circle cx="50" cy="50" r="20" className="orbit-circle fade-pulse" style={{ animationDelay: '1s' }} />

                        {/* Spoke lines */}
                        {orbitNodes.map((node) => {
                            // Calculate endpoint on the outer circle
                            const rad = node.angle * (Math.PI / 180);
                            // Center is 50,50. Radius of orbit is about 38 in the SVG's 0-100 viewBox
                            const x2 = 50 + 38 * Math.cos(rad);
                            const y2 = 50 + 38 * Math.sin(rad);
                            return (
                                <line
                                    key={`line-${node.id}`}
                                    x1="50" y1="50"
                                    x2={x2} y2={y2}
                                    className="orbit-spoke fade-pulse"
                                    style={{ animationDelay: `${node.angle / 60 * 0.5}s` }}
                                />
                            );
                        })}
                    </svg>

                    <div className="orbit-system">
                        <div className="center-node pulse-cyan">
                            <span className="core-icon">🔮</span>
                            <span className="core-text">RIZEN CORE</span>
                            <span className="core-subtitle">Core System Engine</span>
                        </div>

                        <div className="orbit-track">
                            {orbitNodes.map((node) => (
                                <div
                                    className="orbit-node-wrapper"
                                    key={node.id}
                                    style={{ '--angle': `${node.angle}deg` } as React.CSSProperties}
                                >
                                    <div className="orbit-node-anti-spin">
                                        <button className="orbit-node" onClick={() => handleNodeClick(node.path)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', display: 'block', width: '100%', height: '100%' }}>
                                            <div className="node-content">
                                                <div className="node-icon">{node.icon}</div>
                                                <div className="node-short-title">{node.title}</div>
                                            </div>
                                            <div className="node-info-card">
                                                <div className="weapon-tag">{node.tag}</div>
                                                <p className="node-desc">{node.desc}</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Stack (Only visible on small screens) */}
                <div className="mobile-arch-stack">
                    <div className="mobile-core-block pulse-cyan">
                        <span className="core-icon" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔮</span>
                        <h3>RIZEN CORE</h3>
                    </div>
                    <div className="mobile-nodes">
                        {orbitNodes.map(node => (
                            <button 
                                className="bento-item mobile-node-card tilt-card" 
                                key={`mobile-${node.id}`} 
                                onClick={() => handleNodeClick(node.path)}
                                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left', padding: '1.5rem', cursor: 'pointer', display: 'block', width: '100%' }}
                            >
                                <div className="weapon-tag">{node.tag}</div>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', marginTop: '0', fontSize: '1.2rem', color: 'inherit' }}>
                                    <span>{node.icon}</span> {node.title}
                                </h4>
                                <p style={{ color: 'var(--text-dim)', margin: 0 }}>{node.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SystemArchitecture;
