import React from 'react';

interface RealmProgressionProps {
    realm: string;
    rank: number;
    maxRank?: number;
    delay?: number;
}

const RealmProgression = ({ realm, rank, maxRank = 9, delay = 0.1 }: RealmProgressionProps) => {
    // Generate segments for the ring
    const segments = Array.from({ length: maxRank }, (_, i) => i);
    const anglePerSegment = 360 / maxRank;
    const padding = 2; // Gap between segments in degrees

    return (
        <div className="realm-ring-container fade-in" style={{ animationDelay: `${delay}s` }}>
            <svg className="realm-ring-svg" viewBox="0 0 100 100">
                <circle className="realm-ring-bg" cx="50" cy="50" r="42" />
                {segments.map((i) => {
                    const startAngle = i * anglePerSegment + padding;
                    const endAngle = (i + 1) * anglePerSegment - padding;
                    
                    // Simple SVG arc math
                    const radius = 42;
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    
                    const x1 = 50 + radius * Math.cos(startRad);
                    const y1 = 50 + radius * Math.sin(startRad);
                    const x2 = 50 + radius * Math.cos(endRad);
                    const y2 = 50 + radius * Math.sin(endRad);
                    
                    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
                    const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
                    
                    return (
                        <path
                            key={i}
                            className={`realm-segment ${i < rank ? 'filled' : 'empty'}`}
                            d={d}
                        />
                    );
                })}
            </svg>
            <div className="realm-info-center">
                <span className="realm-name">{realm.toUpperCase()}</span>
                <span className="realm-rank">RANK {rank}</span>
            </div>
        </div>
    );
};

export default RealmProgression;
