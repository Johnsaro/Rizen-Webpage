import { useEffect, useState } from 'react';
import type { PlayerProfile } from '../../hooks/usePlayerProfile';

const PlayerCard = ({ profile, delay = 0.1 }: { profile: PlayerProfile, delay?: number }) => {
    const [xpFill, setXpFill] = useState(0);
    const xpMax = 1000; // Hardcoded for demo visualization
    const qi = profile.qi ?? 0;
    const spiritStones = profile.spirit_stones ?? 0;
    const hp = profile.hp ?? 100;
    const maxHp = profile.max_hp ?? 100;

    useEffect(() => {
        const timer = setTimeout(() => {
            setXpFill((qi / xpMax) * 100);
        }, 100);
        return () => clearTimeout(timer);
    }, [qi]);

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
                    <div className="player-class-badge">{profile.main_path || 'Unclassified'}</div>
                </div>
                <div className="player-rep">
                    <div className="rep-label">SPIRIT STONES</div>
                    <div className="rep-value">{spiritStones.toLocaleString()}</div>
                </div>
            </div>

            <div className="player-stats">
                {/* Qi Bar (Primary Focus) */}
                <div className="stat-group primary-stat-group" style={{ marginBottom: '1.5rem' }}>
                    <div className="stat-header">
                        <span className="stat-label" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Qi TO NEXT LEVEL</span>
                        <span className="stat-value xp-text" style={{ fontSize: '1.1rem', fontWeight: 600 }}>{qi} / {xpMax}</span>
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
                        <span className="stat-value">{hp} / {maxHp}</span>
                    </div>
                    <div className="stat-bar-bg hp-bg">
                        <div
                            className="stat-bar-fill hp-fill"
                            style={{ width: `${maxHp > 0 ? (hp / maxHp) * 100 : 0}%` }}
                        ></div>
                    </div>
                </div>

                {/* Path Qi Breakdown */}
                <div className="class-xp-breakdown">
                    {Object.entries(profile.path_qi || {}).slice(0, 3).map(([path, xp]) => (
                        <div className="mini-stat" key={path}>
                            <div className="mini-label">{path.toUpperCase()}</div>
                            <div className="mini-bar-bg"><div className="mini-bar-fill" style={{ width: `${Math.min(((xp as number) / 1000) * 100, 100)}%` }}></div></div>
                        </div>
                    ))}
                </div>

                <div className="streak-badge">
                    <span className="streak-icon">🔥</span>
                    <span className="streak-text">{profile.dao_heart_streak ?? 0}-DAY DAO HEART</span>
                </div>
            </div>
        </div>
    );
};

export default PlayerCard;
