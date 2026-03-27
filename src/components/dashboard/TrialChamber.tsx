import React from 'react';
import type { Quest } from '../../hooks/usePlayerProfile';

interface TrialChamberProps {
    quests?: Quest[];
    delay?: number;
}

const TrialChamber = ({ quests = [], delay = 0.5 }: TrialChamberProps) => {
    return (
        <div className="dash-card fade-in-up" style={{ animationDelay: `${delay}s`, width: '100%' }}>
            <span className="v2-card-title">TRIAL_CHAMBER</span>
            {quests.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', opacity: 0.5, fontStyle: 'italic', fontSize: '0.8rem' }}>
                    NO ACTIVE TRIALS DETECTED
                </div>
            ) : (
                quests.slice(0, 3).map(trial => (
                    <div key={trial.id} className="trial-card">
                        <div className="trial-header">
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{trial.title.toUpperCase()}</span>
                            <span className={`trial-difficulty diff-${trial.rank.toLowerCase()}`}>{trial.rank.toUpperCase()}</span>
                        </div>
                        <div className="trial-rewards">+{trial.xp_reward} Qi, {trial.class_tag}</div>
                        <div className="trial-penalty">Risk: Unknown</div>
                        <button className="launch-btn" title="START">LAUNCH_TRIAL</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default TrialChamber;
