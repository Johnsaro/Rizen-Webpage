import type { DemoPlayer } from '../../data/demoPlayer';

const PersonalRecordsTeaser = ({ delay = 0.5 }: { currentUser: DemoPlayer, delay?: number }) => {
    // Mock Personal Records data
    const personalBests = [
        { label: 'Best Daily Spirit Stones', value: '1,240 SS', date: '2026-03-08', icon: '🏆' },
        { label: 'Most Trials/Day', value: '7 trials', date: '2026-03-05', icon: '⚔️' },
        { label: 'Longest Dao Heart', value: '12 days', detail: 'Current: 5 days', icon: '🔥' },
    ];

    const weeklyPulse = [
        { label: 'Spirit Stones', value: '+340', trend: 'up' },
        { label: 'Trials', value: '-2', trend: 'down' },
    ];

    const milestones = [
        { label: 'Realm 10', date: '2026-03-01' },
        { label: 'Realm 5', date: '2026-02-22' },
        { label: 'First Trial', date: '2026-02-20' },
    ];

    return (
        <div id="dashboard-records" className="dash-card personal-records-teaser fade-in-up" style={{ animationDelay: `${delay}s` }}>
            <div className="card-header">
                <h3 className="card-title">PERSONAL RECORDS</h3>
                <div className="header-action">VIEW ALL</div>
            </div>

            <div className="records-sections">
                <div className="records-group">
                    <div className="group-label">PERSONAL BESTS</div>
                    <div className="bests-list">
                        {personalBests.map((best, index) => (
                            <div key={index} className="best-item premium-hover">
                                <div className="best-icon">{best.icon}</div>
                                <div className="best-info">
                                    <div className="best-label">{best.label}</div>
                                    <div className="best-value">{best.value}</div>
                                    <div className="best-detail">{best.date || best.detail}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="records-group">
                    <div className="group-label">WEEKLY PULSE</div>
                    <div className="pulse-card">
                        <div className="pulse-metrics">
                            {weeklyPulse.map((pulse, index) => (
                                <div key={index} className="pulse-metric">
                                    <span className="pulse-label">{pulse.label}</span>
                                    <span className={`pulse-value ${pulse.trend}`}>
                                        {pulse.trend === 'up' ? '▲' : '▼'} {pulse.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="pulse-footer">vs last week</div>
                    </div>
                </div>

                <div className="records-group">
                    <div className="group-label">MILESTONES</div>
                    <div className="milestone-timeline">
                        {milestones.map((milestone, index) => (
                            <div key={index} className="milestone-item">
                                <div className="milestone-dot"></div>
                                <div className="milestone-info">
                                    <span className="milestone-label">{milestone.label}</span>
                                    <span className="milestone-date">{milestone.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="records-footer">
                "Your only rival is yesterday's version of yourself."
            </div>
        </div>
    );
};

export default PersonalRecordsTeaser;
