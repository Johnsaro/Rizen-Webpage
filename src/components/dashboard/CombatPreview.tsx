import { useState } from 'react';
import './combat-preview.css';

type HitEffect = 'none' | 'monsterHit' | 'playerHit';

const CombatPreview = ({ delay = 0.4 }: { delay?: number }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [hitEffect, setHitEffect] = useState<HitEffect>('none');
    const [isResolving, setIsResolving] = useState<boolean>(false);

    const handleOptionSelect = (optionId: string) => {
        if (isResolving) return;
        setSelectedOption(optionId);
    };

    const handleSimulationSubmit = () => {
        if (!selectedOption || isResolving) return;

        setIsResolving(true);

        // Slight thinking delay before hit triggers
        setTimeout(() => {
            // 'B' (option2) is hardcoded as correct in this simulation
            if (selectedOption === 'option2') {
                setHitEffect('monsterHit');
            } else {
                setHitEffect('playerHit');
            }

            // Clear effect and interaction lock
            setTimeout(() => {
                setHitEffect('none');
                setIsResolving(false);
                setSelectedOption(null); // Optional: clear selection after combat resolves
            }, 350); // Glitch/Hit animation duration

        }, 400); // Resolving delay
    };

    const isMonsterHit = hitEffect === 'monsterHit';
    const isPlayerHit = hitEffect === 'playerHit';

    return (
        <div id="dashboard-combat" className="dash-card combat-preview-card fade-in-up" style={{ animationDelay: `${delay}s` }}>
            <div className="card-header">
                <h3 className="card-title" style={{ color: 'var(--accent-crimson)' }}>COMBAT SIMULATION</h3>
                <span className="live-badge pulse-red">PREVIEW</span>
            </div>

            {/* MONSTER HUD PANEL */}
            <div className="monster-hud-panel">
                <div className={`monster-hologram ${isMonsterHit ? 'glitch-flicker' : ''}`}>
                    <div className="hologram-aura"></div>

                    {/* SVG Monster Blob */}
                    <svg viewBox="0 0 100 100" className="hologram-silhouette" preserveAspectRatio="xMidYMid meet">
                        <path
                            d="M 50 10 C 70 10 90 30 85 60 C 80 90 60 90 50 90 C 40 90 20 90 15 60 C 10 30 30 10 50 10 Z"
                            fill="rgba(244, 63, 94, 0.2)"
                            stroke="var(--accent-cyan)"
                            strokeWidth="2"
                        />
                        {/* Eye indicators */}
                        <circle cx="35" cy="45" r="4" fill="var(--accent-cyan)" opacity="0.8" />
                        <circle cx="65" cy="45" r="4" fill="var(--accent-cyan)" opacity="0.8" />
                    </svg>

                    <div className="scanline-overlay"></div>
                    <div className="noise-overlay"></div>

                    {/* Conditional Sparks */}
                    {isMonsterHit && (
                        <div className="sparks-container">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <span key={i} className="spark-particle" />
                            ))}
                        </div>
                    )}
                </div>

                <div className="telemetry-block">
                    <div className="telemetry-label">THREAT_SIG://</div>
                    <div className="telemetry-label" style={{ opacity: 0.4 }}>ANALYZE WAVEFORM</div>
                    <div className="waveform-container" style={{ marginTop: 'auto' }}>
                        <svg viewBox="0 0 200 40" width="100%" height="100%" preserveAspectRatio="none">
                            <path
                                className="waveform-line"
                                d="M 0 20 Q 20 0, 40 20 T 80 20 T 120 20 T 160 20 T 200 20"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="combat-mini-arena">
                {/* Monster Stats */}
                <div className={`combat-actor monster ${isMonsterHit ? 'bar-flash-monster shake-micro' : ''}`}>
                    <div className="actor-name">TIME WRAITH (LVL 25)</div>
                    <div className="mini-hp-bar">
                        <div className="mini-hp-fill monster-hp" style={{ width: '60%' }}></div>
                    </div>
                </div>

                {/* Player Stats */}
                <div className={`combat-actor player ${isPlayerHit ? 'bar-flash-player shake-micro' : ''}`}>
                    <div className="actor-name" style={{ color: 'var(--accent-cyan)' }}>SHADOW-7</div>
                    <div className="mini-hp-bar">
                        <div className="mini-hp-fill player-hp" style={{ width: '85%' }}></div>
                    </div>
                </div>
            </div>

            <div className="combat-question-preview">
                <div className="question-text">
                    What is the primary function of a reverse proxy in a modern infrastructure setup?
                </div>
                <div className={`mock-options ${isResolving ? 'resolving-lock' : ''}`}>
                    {[
                        { id: 'option1', text: 'A) Directing outbound traffic' },
                        { id: 'option2', text: 'B) Load balancing and security for inbound...' },
                        { id: 'option3', text: 'C) Encrypting local databases' },
                        { id: 'option4', text: 'D) Managing DNS records' },
                    ].map(opt => (
                        <div
                            key={opt.id}
                            className={`mock-option ${selectedOption === opt.id ? 'selected premium-selected pulse-border-faint' : ''}`}
                            onClick={() => handleOptionSelect(opt.id)}
                            style={{ opacity: isResolving && selectedOption !== opt.id ? 0.5 : 1 }}
                        >
                            {opt.text}
                        </div>
                    ))}
                </div>
            </div>

            <button
                className="btn-combat-enter"
                disabled={!selectedOption || isResolving}
                onClick={handleSimulationSubmit}
            >
                {isResolving ? 'RESOLVING INTERACTION...' : 'ENTER SIMULATION'}
            </button>
        </div>
    );
};

export default CombatPreview;

