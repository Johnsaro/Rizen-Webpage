import React, { useState } from 'react';
import type { PlayerProfile } from '../../hooks/usePlayerProfile';

interface ArtifactPillPanelProps {
    profile?: PlayerProfile;
    delay?: number;
}

interface Pill {
    id: string;
    name: string;
    count: number;
    icon: string;
    effect: string;
}

const ArtifactPillPanel = ({ profile, delay = 0.3 }: ArtifactPillPanelProps) => {
    const [selectedPill, setSelectedPill] = useState<Pill | null>(null);

    // Map equipped weapon or fallback
    const weaponId = profile?.equipped_weapon || 'none';
    const hasWeapon = weaponId !== 'none';
    
    // In a full implementation, we'd look up the weapon ID in an items database.
    // Here we format the ID nicely if it exists.
    const artifactName = hasWeapon ? weaponId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "No Artifact Equipped";

    // Map inventory items to pills (filtering out known non-pill items or treating all as items)
    const inventory = profile?.inventory || {};
    
    // Convert inventory map to array of items. Give them default icons based on name.
    const pills: Pill[] = Object.entries(inventory).map(([id, count]) => {
        let icon = '📦';
        if (id.includes('pill') || id.includes('pellet') || id.includes('elixir')) icon = '💊';
        else if (id.includes('stone') || id.includes('gem')) icon = '💎';
        
        return {
            id,
            name: id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            count,
            icon,
            effect: `A consumable item. Effect details for ${id} are currently encrypted in the system.`
        };
    });

    return (
        <div className="dash-card fade-in-up" style={{ animationDelay: `${delay}s`, width: '100%' }}>
            <span className="v2-card-title">SPIRITUAL_LOADOUT</span>
            
            <div className="artifact-slots-grid">
                {hasWeapon ? (
                    <div className="artifact-slot equipped" title={`Equipped: ${artifactName}`}>
                        <span className="artifact-grade grade-spirit">SPIRIT</span>
                        <span style={{ fontSize: '1.2rem' }}>🗡️</span>
                        <span style={{ fontSize: '0.6rem', marginTop: '5px', opacity: 0.8, textAlign: 'center' }}>{artifactName}</span>
                        <div className="durability-bar-container">
                            <div className="durability-bar-fill" style={{ width: `100%` }}></div>
                        </div>
                    </div>
                ) : (
                    <div className="artifact-slot locked" title="No artifact equipped">
                        <span style={{ fontSize: '1rem', opacity: 0.5 }}>🗡️</span>
                    </div>
                )}
                <div className="artifact-slot locked">
                    <span style={{ fontSize: '1rem', opacity: 0.2 }}>🔒</span>
                </div>
                <div className="artifact-slot locked">
                    <span style={{ fontSize: '1rem', opacity: 0.2 }}>🔒</span>
                </div>
            </div>

            <div className="pill-inventory">
                {pills.length > 0 ? (
                    pills.map(pill => (
                        <div 
                            key={pill.id} 
                            className="pill-item" 
                            onClick={() => setSelectedPill(pill)}
                            title={`${pill.name} (x${pill.count})`}
                        >
                            <span>{pill.icon}</span>
                            <span className="pill-count">x{pill.count}</span>
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '0.5rem', opacity: 0.5, fontSize: '0.8rem', fontStyle: 'italic', width: '100%', textAlign: 'center' }}>
                        Inventory is empty
                    </div>
                )}
            </div>

            {selectedPill && (
                <div className="pill-detail-overlay fade-in" style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0, 243, 255, 0.05)', border: '1px solid rgba(0, 243, 255, 0.2)', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{selectedPill.name.toUpperCase()}</span>
                        <button onClick={() => setSelectedPill(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>×</button>
                    </div>
                    <p style={{ fontSize: '0.7rem', opacity: 0.8, lineHeight: '1.4', marginBottom: '1rem' }}>{selectedPill.effect}</p>
                    <button className="launch-btn" style={{ margin: 0, opacity: 0.5 }}>ACTIVATE [COMING SOON]</button>
                </div>
            )}
        </div>
    );
};

export default ArtifactPillPanel;
