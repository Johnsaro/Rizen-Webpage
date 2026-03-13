

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

const AchievementGrid = ({ achievements = {}, featuredAchievement = '', delay = 0.6 }: { achievements?: Record<string, string>, featuredAchievement?: string, delay?: number }) => {

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
                <div className="featured-achievement premium-glow-gold">
                    <div className="feat-icon">{featured.icon}</div>
                    <div className="feat-info">
                        <div className="feat-title">{featured.name.toUpperCase()}</div>
                        <div className="feat-desc">Featured Cultivator Merit</div>
                    </div>
                </div>
            )}

            <div className="achievement-grid">
                {achievementItems.map((item, index) => (
                    item.isUnlocked ? (
                        <div key={item.id} className="ach-badge unlocked premium-hover" title={`${item.name} - Unlocked ${new Date(item.unlockDate!).toLocaleDateString()}`} style={{ animationDelay: `${delay + 0.1 + (index * 0.05)}s` }}>
                            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                        </div>
                    ) : (
                        <div key={item.id} className="ach-badge locked premium-locked" title="???" style={{ animationDelay: `${delay + 0.1 + (index * 0.05)}s` }}>
                            {index === 2 ? <span style={{ fontSize: '0.6rem', lineHeight: 1, textAlign: 'center', opacity: 0.5 }}>RLM<br />20</span> : '?'}
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default AchievementGrid;
