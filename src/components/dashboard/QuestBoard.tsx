import type { Quest } from '../../data/demoPlayer';

const QuestBoard = ({ quests, delay = 0.2 }: { quests: Quest[], delay?: number }) => {
    const getBadgeClass = (type: string) => {
        switch (type) {
            case 'Daily': return 'badge-daily';
            case 'Main Quest': return 'badge-main';
            case 'Side Quest': return 'badge-side';
            default: return '';
        }
    };

    return (
        <div id="dashboard-quests" className="dash-card quest-board fade-in-up" style={{ animationDelay: `${delay}s` }}>
            <div className="card-header">
                <h3 className="card-title">ACTIVE QUESTS</h3>
                <div className="header-action">VIEW ALL</div>
            </div>

            <div className="quest-list">
                {quests.map((quest, index) => (
                    <div key={quest.id} className="quest-item premium-hover" style={{ animationDelay: `${delay + 0.1 + index * 0.1}s` }}>
                        <div className="quest-header">
                            <span className={`quest-badge ${getBadgeClass(quest.type)}`}>{quest.type}</span>
                            <span className="quest-time">{quest.timeRemaining}</span>
                        </div>

                        <h4 className="quest-title">{quest.title}</h4>

                        <div className="quest-rewards">
                            <span className="reward reward-xp">+{quest.rewardXP} XP</span>
                            {quest.rewardRep && <span className="reward reward-rep">+{quest.rewardRep} REP</span>}
                        </div>

                        <div className="quest-progress-container premium-progress">
                            <div className="quest-progress-bg">
                                <div
                                    className="quest-progress-fill fade-in-width"
                                    style={{ width: `${quest.progress}%`, animationDelay: `${delay + 0.3 + index * 0.1}s` }}
                                >
                                    <div className="progress-shimmer"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestBoard;
