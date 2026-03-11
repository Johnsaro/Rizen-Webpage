import { useState } from 'react';
import type { Quest } from '../../hooks/usePlayerProfile';
import QuestDetailModal from './QuestDetailModal';

const QuestBoard = ({ quests, delay = 0.2 }: { quests: Quest[], delay?: number }) => {
    const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

    const getBadgeClass = (type: string) => {
        switch (type) {
            case 'Daily': return 'badge-daily';
            case 'Main Quest': return 'badge-main';
            case 'Side Quest': return 'badge-side';
            default: return 'badge-side';
        }
    };

    return (
        <>
            <div id="dashboard-quests" className="dash-card quest-card fade-in-up" style={{ animationDelay: `${delay}s` }}>
                <div className="card-header">
                    <h3 className="card-title">ACTIVE_OBJECTIVES</h3>
                    <div className="header-action" onClick={() => window.location.hash = '#/community/hub'}>BOARD_UPLINK</div>
                </div>

                <div className="quest-list">
                    {quests.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                            NO_ACTIVE_MISSIONS_FOUND...
                        </div>
                    ) : (
                        quests.map((quest, index) => {
                            const progress = quest.total_steps ? Math.round((quest.current_step || 0) / quest.total_steps * 100) : 0;

                            return (
                                <div
                                    key={quest.id}
                                    className="quest-item premium-hover"
                                    style={{ animationDelay: `${delay + 0.1 + (index * 0.1)}s`, cursor: 'pointer' }}
                                    onClick={() => setSelectedQuest(quest)}
                                >
                                    <div className="quest-header">
                                        <span className={`quest-badge ${getBadgeClass(quest.type)}`}>{quest.type}</span>
                                        <span className="quest-time">{quest.rank}</span>
                                    </div>
                                    <h4 className="quest-title">{quest.title}</h4>
                                    <div className="quest-rewards">
                                        <span className="reward reward-xp">+{quest.xp_reward} XP</span>
                                        <span className="reward reward-rep">+{Math.round(quest.xp_reward / 10)} REP</span>
                                    </div>
                                    <div className="quest-progress-container">
                                        <div className="quest-progress-fill" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <QuestDetailModal
                quest={selectedQuest}
                onClose={() => setSelectedQuest(null)}
            />
        </>
    );
};

export default QuestBoard;
