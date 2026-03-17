

// Weapon Icon mapping based on app's internal logic
const getWeaponIcon = (id: string) => {
    const lowerId = id.toLowerCase();
    if (lowerId.includes('blade') || lowerId.includes('sword')) return '⚔️';
    if (lowerId.includes('shield')) return '🛡️';
    if (lowerId.includes('script') || lowerId.includes('tool')) return '📜';
    if (lowerId.includes('cloak')) return '🧥';
    if (lowerId.includes('visor')) return '🥽';
    return '🛠️';
};

const ArsenalGrid = ({ inventory = {}, equippedWeapon = '', delay = 0.3, onItemClick }: { inventory?: Record<string, number>, equippedWeapon?: string, delay?: number, onItemClick?: () => void }) => {

    const inventoryItems = Object.entries(inventory).map(([id, count]) => ({
        id,
        name: id.replace(/_/g, ' ').toUpperCase(),
        count,
        icon: getWeaponIcon(id)
    }));

    const equippedItem = equippedWeapon ? {
        id: equippedWeapon,
        name: equippedWeapon.replace(/_/g, ' ').toUpperCase(),
        icon: getWeaponIcon(equippedWeapon)
    } : null;

    return (
        <div id="dashboard-arsenal" className="dash-card arsenal-card fade-in-up" style={{ animationDelay: `${delay}s` }}>
            <div className="card-header">
                <h3 className="card-title">SPIRITUAL_ARTIFACTS</h3>
                <button 
                    className="header-action" 
                    onClick={() => onItemClick ? onItemClick() : (window.location.hash = '#/arsenal')}
                    style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer' }}
                >
                    VIEW_FULL_VAULT
                </button>
            </div>

            <div className="arsenal-content">
                <div className="arsenal-section">
                    <div className="section-label">EQUIPPED_LOADOUT</div>
                    <div className="equipped-row">
                        {equippedItem ? (
                            <button className="equipped-item pulse-border-faint premium-hover" onClick={onItemClick} style={{ cursor: onItemClick ? 'pointer' : 'default', background: 'none', border: '1px solid rgba(0, 243, 255, 0.2)', padding: '0.8rem', textAlign: 'left', display: 'flex', gap: '1rem', width: '100%', alignItems: 'center' }}>
                                <div className="item-icon-placeholder">{equippedItem.icon}</div>
                                <div className="item-info">
                                    <div className="item-name">{equippedItem.name}</div>
                                    <div className="equipped-badge">PRIMARY_ARTIFACT</div>
                                </div>
                            </button>
                        ) : (
                            <div className="equipped-item locked" style={{ opacity: 0.5, borderStyle: 'dashed' }}>
                                <div className="item-icon-placeholder">🚫</div>
                                <div className="item-info">
                                    <div className="item-name">NO_ARTIFACT_EQUIPPED</div>
                                    <div className="equipped-badge">EMPTY_SLOT</div>
                                </div>
                            </div>
                        )}
                        <button className="equipped-item locked premium-locked" onClick={onItemClick} style={{ cursor: onItemClick ? 'pointer' : 'default', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.8rem', textAlign: 'left', display: 'flex', gap: '1rem', width: '100%', alignItems: 'center', color: 'inherit' }}>
                            <div className="item-icon-placeholder">🔒</div>
                            <div className="item-info">
                                <div className="item-name">RECON_VISOR</div>
                                <div className="equipped-badge">OFF_HAND [LOCKED]</div>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="arsenal-section">
                    <div className="section-label">OWNED_INVENTORY</div>
                    {inventoryItems.length === 0 ? (
                        <div className="item-grid">
                            {[1, 2, 3, 4].map(i => (
                                <button key={i} className="grid-item locked premium-locked" onClick={onItemClick} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', position: 'relative', height: '60px' }}>
                                    <div className="locked-overlay">?</div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="item-grid">
                            {inventoryItems.map((item) => (
                                <button key={item.id} className="grid-item unlocked premium-hover" title={`${item.name} (x${item.count})`} onClick={onItemClick} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', position: 'relative', height: '60px', color: 'inherit' }}>
                                    <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                                    {item.count > 1 && <span className="item-count-badge" style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--accent-cyan)', color: '#000', fontSize: '0.6rem', fontWeight: 'bold', padding: '2px 5px', borderRadius: '4px' }}>x{item.count}</span>}
                                    <span className="grid-item-name">{item.name}</span>
                                </button>
                            ))}
                            {inventoryItems.length < 4 && [...Array(4 - inventoryItems.length)].map((_, i) => (
                                <button key={`empty-${i}`} className="grid-item locked premium-locked" onClick={onItemClick} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', position: 'relative', height: '60px' }}>
                                    <div className="locked-overlay">?</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="arsenal-section">
                    <div className="section-label">ACTIVE_PILLS</div>
                    <div className="consumables-row">
                        <div className="consumable-item active-consumable premium-glow-gold">
                            <span className="gold-text">⚡</span>
                            <span className="gold-text" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>FOCUS_ELIXIR_ACTIVE</span>
                            <div className="consumable-active-badge">2H_REMAINING</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArsenalGrid;
