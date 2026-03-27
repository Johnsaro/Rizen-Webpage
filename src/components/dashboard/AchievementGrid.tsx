

// Common achievement list based on app's 18-badge system
const ALL_ACHIEVEMENTS = [
    { id: 'first_step', name: 'First Step', icon: '👣' },
    { id: 'trial_seeker', name: 'Trial Seeker', icon: '📜' },
    { id: 'first_blood', name: 'First Blood', icon: '⚔️' },
    { id: 'early_bird', name: 'Early Bird', icon: '🌅' },
    { id: 'night_owl', name: 'Night Owl', icon: '🦉' },
    { id: 'bug_hunter', name: 'Bug Hunter', icon: '🐛' },
    { id: 'sentinel', name: 'Sentinel', icon: '🛡️' },
    { id: 'data_miner', name: 'Data Miner', icon: '💎' },
    { id: 'alpha_tester', name: 'Alpha Tester', icon: 'λ' },
    { id: 'dao_heart_master', name: 'Dao Heart Master', icon: '👑' },
];

const AchievementGrid = ({ achievements = {}, featuredAchievement = '', delay = 0.6, onAchievementClick }: { achievements?: Record<string, string>, featuredAchievement?: string, delay?: number, onAchievementClick?: () => void }) => {

    const unlockedCount = Object.keys(achievements).length;
    const totalCount = ALL_ACHIEVEMENTS.length;

    // Merge real unlocked data with the master list
    const achievementItems = ALL_ACHIEVEMENTS.map(ach => ({
        ...ach,
        isUnlocked: !!achievements[ach.id],
        unlockDate: achievements[ach.id]
    }));

    const featured = achievementItems.find(a => a.id === featuredAchievement) || achievementItems.find(a => a.isUnlocked);

    return (
        <div id="dashboard-achievements" className="dash-card achievements-card fade-in-up" style={{ animationDelay: `${delay}s` }}>
            <div className="card-header">
                <h3 className="card-title">HEAVENLY_MERITS</h3>
                <div className="header-status">{unlockedCount}/{totalCount}_UNLOCKED</div>
            </div>

            {featured && (
                <button 
                    className="featured-achievement premium-glow-gold" 
                    onClick={onAchievementClick} 
                    style={{ 
                        cursor: onAchievementClick ? 'pointer' : 'default',
                        background: 'none',
                        border: '1px solid var(--accent-yellow)',
                        padding: '1rem',
                        textAlign: 'left',
                        display: 'flex',
                        gap: '1rem',
                        width: '100%',
                        alignItems: 'center',
                        color: 'inherit'
                    }}
                >
                    <div className="feat-icon">{featured.icon}</div>
                    <div className="feat-info">
                        <div className="feat-title">{featured.name.toUpperCase()}</div>
                        <div className="feat-desc">Featured Cultivator Merit</div>
                    </div>
                </button>
            )}

            <div className="achievement-grid">
                {achievementItems.map((item, index) => (
                    item.isUnlocked ? (
                        <button 
                            key={item.id} 
                            className="ach-badge unlocked premium-hover" 
                            title={`${item.name} - Unlocked ${new Date(item.unlockDate!).toLocaleDateString()}`} 
                            style={{ 
                                animationDelay: `${delay + 0.1 + (index * 0.05)}s`, 
                                cursor: onAchievementClick ? 'pointer' : 'default',
                                background: 'none',
                                border: '1px solid var(--accent-cyan)',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0
                            }} 
                            onClick={onAchievementClick}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                        </button>
                    ) : (
                        <button 
                            key={item.id} 
                            className="ach-badge locked premium-locked" 
                            title="???" 
                            style={{ 
                                animationDelay: `${delay + 0.1 + (index * 0.05)}s`, 
                                cursor: onAchievementClick ? 'pointer' : 'default',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0,
                                color: 'inherit'
                            }} 
                            onClick={onAchievementClick}
                        >
                            {index === 2 ? <span style={{ fontSize: '0.6rem', lineHeight: 1, textAlign: 'center', opacity: 0.5 }}>RLM<br />20</span> : '?'}
                        </button>
                    )
                ))}
            </div>
        </div>
    );
};

export default AchievementGrid;
