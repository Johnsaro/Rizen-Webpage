import type { Achievement } from '../../data/demoPlayer';

const AchievementGrid = ({ achievements, delay = 0.6 }: { achievements: Achievement[], delay?: number }) => {
    const unlockedCount = achievements.filter(a => a.isUnlocked).length;

    return (
        <div id="dashboard-achievements" className="dash-card achievements-card fade-in-up" style={{ animationDelay: `${delay}s` }}>
            <div className="card-header">
                <h3 className="card-title">ACHIEVEMENTS</h3>
                <div className="header-status">{unlockedCount} / {achievements.length}</div>
            </div>

            <div className="featured-achievement premium-glow">
                <div className="feat-icon">🏆</div>
                <div className="feat-info">
                    <div className="feat-title">WEEK WARRIOR</div>
                    <div className="feat-desc">7-day progression streak achieved</div>
                </div>
            </div>

            <div className="achievement-grid">
                {achievements.map((item, index) => (
                    item.isUnlocked ? (
                        <div key={item.id} className="ach-badge unlocked premium-hover" title={item.name} style={{ animationDelay: `${delay + 0.1 + (index * 0.05)}s` }}>
                            <div className="ach-icon-inner"></div>
                        </div>
                    ) : (
                        <div key={item.id} className="ach-badge locked premium-locked" title={index === 2 ? "Requires Level 20+" : "???"}>
                            {index === 2 ? <span style={{ fontSize: '0.4rem', lineHeight: 1, textAlign: 'center', opacity: 0.5 }}>LVL<br />20</span> : '?'}
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default AchievementGrid;
