import type { DemoPlayer } from '../../data/demoPlayer';

const ArsenalGrid = ({ arsenal, delay = 0.3 }: { arsenal: DemoPlayer['arsenal'], delay?: number }) => {
    return (
        <div id="dashboard-arsenal" className="dash-card arsenal-container fade-in-up" style={{ animationDelay: `${delay}s` }}>
            <div className="card-header">
                <h3 className="card-title">ARSENAL / INVENTORY</h3>
                <div className="header-action">LOADOUT</div>
            </div>

            {/* Equipped Row */}
            <div className="arsenal-section">
                <div className="section-label">EQUIPPED</div>
                <div className="equipped-row">
                    {arsenal.equippedRow.map(item => (
                        <div key={item.id} className={`equipped-item ${item.name === 'Recon Blade' ? 'signature-weapon pulse-border-faint' : ''}`}>
                            <div className="item-icon-placeholder">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                                    <path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2" />
                                </svg>
                            </div>
                            <div className="item-info">
                                <div className="item-name">{item.name}</div>
                                <div className="equipped-badge">EQUIPPED</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="arsenal-section">
                <div className="section-label">MODULES</div>
                <div className="item-grid">
                    {arsenal.grid.map(item => (
                        <div key={item.id} className={`grid-item ${item.isUnlocked ? 'unlocked premium-hover' : 'locked premium-locked'}`}>
                            {!item.isUnlocked && <div className="locked-overlay"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>}
                            <div className="grid-item-name">{item.name}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Consumables */}
            <div className="arsenal-section">
                <div className="section-label">CONSUMABLES</div>
                <div className="consumables-row">
                    {arsenal.consumables.map(item => (
                        <div key={item.id} className={`consumable-item ${item.isActive ? 'active-consumable' : ''}`}>
                            <div className="consumable-count">x{item.count}</div>
                            <div className="consumable-name">{item.name}</div>
                            {item.isActive && (
                                <div className="consumable-active-badge">
                                    ACTIVE • {item.timeRemaining}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ArsenalGrid;
