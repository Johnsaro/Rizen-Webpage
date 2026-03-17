import { useEffect, useState } from 'react';
import type { PlayerProfile } from '../../hooks/usePlayerProfile';

const PlayerCard = ({ profile, delay = 0.1 }: { profile: PlayerProfile, delay?: number }) => {
    const [xpFill, setXpFill] = useState(0);
    const xpMax = 1000; // Hardcoded for demo visualization

    useEffect(() => {
        // Animate XP bar on mount
        const timer = setTimeout(() => {
            setXpFill((profile.current_xp / xpMax) * 100);
        }, 100);
        return () => clearTimeout(timer);
    }, [profile.current_xp]);

    return (
        <div className="dash-card player-card fade-in-up" style={{ animationDelay: `${delay}s` }}>
            <div className="player-header">
                <div className="player-avatar-container">
                    <div className="player-avatar-silhouette">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                    <div className="level-badge premium-level">REALM {profile.level}</div>
                </div>
                <div className="player-info">
                    <h2 className="player-name">{profile.name}</h2>
                    <div className="player-class-badge">{profile.main_class}</div>
                </div>
                <div className="player-rep">
                    <div className="rep-label">SPIRIT STONES</div>
                    <div className="rep-value">{profile.rep.toLocaleString()}</div>
                </div>
            </div>

            <div className="player-stats">
                {/* XP Bar (Primary Focus) */}
                <div className="stat-group primary-stat-group" style={{ marginBottom: '1.5rem' }}>
                    <div className="stat-header">
                        <span className="stat-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Qi TO NEXT LEVEL</span>
                        <span className="stat-value xp-text" style={{ fontSize: '1.1rem', fontWeight: 600 }}>{profile.current_xp} / {xpMax}</span>
                    </div>
                    <div className="stat-bar-bg xp-bg" style={{ height: '8px' }}>
                        <div
                            className="stat-bar-fill xp-fill glow-pulse"
                            style={{ width: `${xpFill}%` }}
                        >
                            <div className="progress-shimmer"></div>
                        </div>
                    </div>
                </div>

                {/* HP Bar */}
                <div className="stat-group">
                    <div className="stat-header">
                        <span className="stat-label">HP</span>
                        <span className="stat-value">{profile.hp} / {profile.max_hp}</span>
                    </div>
                    <div className="stat-bar-bg hp-bg">
                        <div
                            className="stat-bar-fill hp-fill"
                            style={{ width: `${(profile.hp / profile.max_hp) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Class XP Breakdown */}
                <div className="class-xp-breakdown">
                    <div className="mini-stat">
                        <div className="mini-label">RECON</div>
                        <div className="mini-bar-bg"><div className="mini-bar-fill" style={{ width: `${profile.class_xp?.recon || 0}%` }}></div></div>
                    </div>
                    <div className="mini-stat">
                        <div className="mini-label">EXPLOIT</div>
                        <div className="mini-bar-bg"><div className="mini-bar-fill" style={{ width: `${profile.class_xp?.exploitation || 0}%` }}></div></div>
                    </div>
                    <div className="mini-stat">
                        <div className="mini-label">ENUM</div>
                        <div className="mini-bar-bg"><div className="mini-bar-fill" style={{ width: `${profile.class_xp?.enumeration || 0}%` }}></div></div>
                    </div>
                </div>

                <div className="streak-badge">
                    <span className="streak-icon">🔥</span>
                    <span className="streak-text">{profile.streak}-DAY DAO HEART</span>
                </div>
            </div>
        </div>
    );
};

export default PlayerCard;
