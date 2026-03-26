import React from 'react';

interface DaoHeartPanelProps {
    state?: 'Wavering' | 'Stable' | 'Tempered' | 'Immovable';
    streak: number;
    delay?: number;
}

const DaoHeartPanel = ({ state, streak, delay = 0.2 }: DaoHeartPanelProps) => {
    // Calculate state dynamically if not provided
    const currentState = state || (streak < 3 ? 'Wavering' : streak < 7 ? 'Stable' : streak < 14 ? 'Tempered' : 'Immovable');

    const auraColors = {
        'Wavering': '#f43f5e',
        'Stable': '#fbbf24',
        'Tempered': '#00f3ff',
        'Immovable': '#a855f7'
    };

    return (
        <div className="dao-heart-card fade-in-up" style={{ animationDelay: `${delay}s`, '--aura-color': auraColors[currentState] } as React.CSSProperties}>
            <div className="dao-aura"></div>
            <div className="dao-state-label">DAO_HEART_STATE</div>
            <div className="dao-state-value" style={{ color: auraColors[currentState] }}>{currentState}</div>
            <div className="dao-streak">
                <span style={{ opacity: 0.6 }}>STREAK // </span>
                <span>{streak} DAYS</span>
            </div>
        </div>
    );
};

export default DaoHeartPanel;
