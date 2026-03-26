import React from 'react';

interface SectTransmissionsProps {
    playerName?: string;
    delay?: number;
}

const SectTransmissions = ({ playerName = 'Cultivator', delay = 0.6 }: SectTransmissionsProps) => {
    return (
        <div className="dash-card fade-in-up" style={{ animationDelay: `${delay}s`, width: '100%' }}>
            <span className="v2-card-title">SECT_TRANSMISSIONS</span>
            <div className="sect-transmission">
                <div style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>// FROM: THE SYSTEM</div>
                <p>"{playerName}, the system recognizes your presence. The Heavenly Tribulation approaches. Stagnation is your only true enemy. Refine your Qi or be consumed by the void."</p>
                <div style={{ marginTop: '1rem', opacity: 0.5, fontSize: '0.6rem' }}>LINK_STATUS: ENCRYPTED // END_OF_MESSAGE</div>
            </div>
        </div>
    );
};

export default SectTransmissions;
