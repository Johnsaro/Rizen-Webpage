import React, { useState, useMemo } from 'react';
import './Roadmap.css';
import { roadmapData, buildMeta, buildOrder, type BuildId, type DevStatus } from '../data/rizenRoadmap';

interface RoadmapProps {
    initialBuild?: string;
}

const SHIPPED_PREVIEW_COUNT = 4;

const DEV_STATUS_CONFIG: Record<DevStatus, { label: string; icon: string }> = {
    live: { label: 'LIVE', icon: '▶' },
    maintenance: { label: 'MAINTENANCE', icon: '◆' },
    stable: { label: 'STABLE', icon: '■' },
    dev: { label: 'IN DEV', icon: '◉' },
};

const Roadmap: React.FC<RoadmapProps> = ({ initialBuild }) => {
    const defaultBuild: BuildId = buildOrder.includes(initialBuild as BuildId)
        ? (initialBuild as BuildId)
        : 'rizen-mobile';

    const [activeBuild, setActiveBuild] = useState<BuildId>(defaultBuild);
    const [shippedExpanded, setShippedExpanded] = useState(false);

    const meta = buildMeta[activeBuild];

    const filtered = useMemo(() => {
        const items = roadmapData.filter(i => i.buildId === activeBuild);
        return {
            now: items.filter(i => i.status === 'now'),
            next: items.filter(i => i.status === 'next'),
            later: items.filter(i => i.status === 'later'),
            done: items.filter(i => i.status === 'done'),
            total: items.length,
        };
    }, [activeBuild]);

    // Companion builds (no active dev) get richer shipped cards
    const isCompanion = filtered.now.length === 0 && filtered.next.length === 0;

    const visibleDone = shippedExpanded
        ? filtered.done
        : filtered.done.slice(0, isCompanion ? 6 : SHIPPED_PREVIEW_COUNT);
    const hiddenCount = filtered.done.length - (isCompanion ? 6 : SHIPPED_PREVIEW_COUNT);

    const handleTabChange = (id: BuildId) => {
        setActiveBuild(id);
        setShippedExpanded(false);
        const base = '#/community/roadmap';
        window.location.hash = id === 'rizen-mobile' ? base : `${base}?build=${id}`;
    };

    // Progress bar segments
    const progress = [
        { key: 'done', label: 'Shipped', count: filtered.done.length, color: 'var(--accent-gold, #fbbf24)' },
        { key: 'now', label: 'Building', count: filtered.now.length, color: 'var(--accent-emerald)' },
        { key: 'next', label: 'Queued', count: filtered.next.length, color: 'var(--accent-cyan)' },
        { key: 'later', label: 'Planned', count: filtered.later.length, color: 'rgba(255,255,255,0.25)' },
    ];

    return (
        <div className="roadmap-page reveal visible">
            {/* Atmospheric glow tied to active build */}
            <div
                className="roadmap-atmosphere"
                style={{ '--atmo-rgb': meta.accentRgb } as React.CSSProperties}
            />

            {/* ── Hero ── */}
            <div className="roadmap-hero">
                <div className="status-tag pulse-border">SYSTEM TRAJECTORY</div>
                <h1 className="glitch-title" data-text="Product Roadmap">Product Roadmap</h1>
                <p className="roadmap-subtitle">
                    A transparent look at upcoming features, updates, and expansions
                    <br/>across every build in the Rizen ecosystem.
                </p>
            </div>

            {/* ── Build Tab Bar ── */}
            <div className="build-tabs" role="tablist">
                {buildOrder.map(id => {
                    const m = buildMeta[id];
                    const count = roadmapData.filter(i => i.buildId === id).length;
                    const isActive = activeBuild === id;
                    return (
                        <button
                            key={id}
                            role="tab"
                            aria-selected={isActive}
                            className={`build-tab ${isActive ? 'build-tab--active' : ''}`}
                            style={{
                                '--tab-accent': m.accent,
                                '--tab-rgb': m.accentRgb,
                            } as React.CSSProperties}
                            onClick={() => handleTabChange(id)}
                        >
                            <span className={`tab-status-dot tab-status-dot--${m.devStatus}`} title={DEV_STATUS_CONFIG[m.devStatus].label} />
                            <span className="tab-name">
                                {m.shortName}
                                {m.flagship && <span className="flagship-mark" title="Flagship product">&#9733;</span>}
                            </span>
                            <span className="tab-count">{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* ── Build Identity Panel ── */}
            <div
                className="build-identity"
                key={activeBuild}
                style={{ '--id-rgb': meta.accentRgb, '--id-accent': meta.accent } as React.CSSProperties}
            >
                <div className="identity-left">
                    <div className="identity-name-row">
                        <h2 className="identity-name">{meta.name}</h2>
                        <span className="identity-version">{meta.version}</span>
                        {meta.flagship && <span className="identity-flagship">FLAGSHIP</span>}
                    </div>
                    <p className="identity-subtitle">{meta.subtitle}</p>

                    {/* ── Dev Status Beacon ── */}
                    <div className={`dev-status-beacon dev-status-beacon--${meta.devStatus}`}>
                        <span className="beacon-glow" />
                        <span className="beacon-core" />
                        <span className="beacon-label">
                            <span className="beacon-icon">{DEV_STATUS_CONFIG[meta.devStatus].icon}</span>
                            {DEV_STATUS_CONFIG[meta.devStatus].label}
                        </span>
                        {meta.devStatusNote && (
                            <span className="beacon-note">{meta.devStatusNote}</span>
                        )}
                    </div>

                    <div className="identity-tags">
                        {meta.tags.map(t => (
                            <span key={t} className="identity-tag">{t}</span>
                        ))}
                    </div>
                </div>
                <div className="identity-right">
                    <div className="identity-stats">
                        {progress.map(p => (
                            p.count > 0 && (
                                <div key={p.key} className="stat-block">
                                    <span className="stat-value" style={{ color: p.color }}>{p.count}</span>
                                    <span className="stat-label">{p.label}</span>
                                </div>
                            )
                        ))}
                    </div>
                    <div className="identity-progress-bar">
                        {progress.map(p => (
                            p.count > 0 && (
                                <div
                                    key={p.key}
                                    className="progress-segment"
                                    style={{
                                        flex: p.count,
                                        background: p.color,
                                    }}
                                    title={`${p.label}: ${p.count}`}
                                />
                            )
                        ))}
                    </div>
                </div>
            </div>

            {/* ── NOW — Spotlight ── */}
            {filtered.now.length > 0 && (
                <section className="roadmap-section roadmap-now-section">
                    <div className="section-header">
                        <div className="section-indicator">
                            <span className="indicator-dot now-dot" />
                            <span className="indicator-line" />
                        </div>
                        <div>
                            <h2 className="section-title now-title">Building Now</h2>
                            <span className="section-desc">Actively in development</span>
                        </div>
                    </div>
                    <div className="now-grid">
                        {filtered.now.map((item, i) => (
                            <div key={item.id} className="roadmap-card now-card" style={{ animationDelay: `${i * 0.08}s` }}>
                                <div className="card-top-row">
                                    <div className="card-badge now-badge">{item.category}</div>
                                    <div className="card-status-pip now-pip">In Progress</div>
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                {item.themeTranslation && (
                                    <div className="theme-translation now-theme">
                                        <span>In-Universe:</span> {item.themeTranslation}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── NEXT + LATER — Pipeline ── */}
            {(filtered.next.length > 0 || filtered.later.length > 0) && (
                <section className="roadmap-section roadmap-pipeline-section">
                    <div className={`pipeline-grid ${filtered.next.length === 0 || filtered.later.length === 0 ? 'pipeline-grid--single' : ''}`}>
                        {filtered.next.length > 0 && (
                            <div className="pipeline-column">
                                <div className="section-header">
                                    <div className="section-indicator">
                                        <span className="indicator-dot next-dot" />
                                        <span className="indicator-line" />
                                    </div>
                                    <div>
                                        <h2 className="section-title next-title">Up Next</h2>
                                        <span className="section-desc">Queued for upcoming updates</span>
                                    </div>
                                </div>
                                <div className="pipeline-cards">
                                    {filtered.next.map((item, i) => (
                                        <div key={item.id} className="roadmap-card next-card" style={{ animationDelay: `${i * 0.08}s` }}>
                                            <div className="card-top-row">
                                                <div className="card-badge next-badge">{item.category}</div>
                                            </div>
                                            <h3>{item.title}</h3>
                                            <p>{item.description}</p>
                                            {item.themeTranslation && (
                                                <div className="theme-translation next-theme">
                                                    <span>In-Universe:</span> {item.themeTranslation}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {filtered.later.length > 0 && (
                            <div className="pipeline-column">
                                <div className="section-header">
                                    <div className="section-indicator">
                                        <span className="indicator-dot later-dot" />
                                        <span className="indicator-line" />
                                    </div>
                                    <div>
                                        <h2 className="section-title later-title">On the Horizon</h2>
                                        <span className="section-desc">Strategic long-term goals</span>
                                    </div>
                                </div>
                                <div className="pipeline-cards">
                                    {filtered.later.map((item, i) => (
                                        <div key={item.id} className="roadmap-card later-card" style={{ animationDelay: `${i * 0.08}s` }}>
                                            <div className="card-top-row">
                                                <div className="card-badge later-badge">{item.category}</div>
                                            </div>
                                            <h3>{item.title}</h3>
                                            <p>{item.description}</p>
                                            {item.themeTranslation && (
                                                <div className="theme-translation later-theme">
                                                    <span>In-Universe:</span> {item.themeTranslation}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ── SHIPPED — Archive ── */}
            {filtered.done.length > 0 && (
                <section className="roadmap-section roadmap-shipped-section">
                    <div className="section-header shipped-header">
                        <div className="section-indicator">
                            <span className="indicator-dot shipped-dot" />
                            <span className="indicator-line" />
                        </div>
                        <div>
                            <h2 className="section-title shipped-title">
                                Shipped
                                <span className="shipped-count">{filtered.done.length}</span>
                            </h2>
                            <span className="section-desc">Features live in production</span>
                        </div>
                    </div>

                    <div className={`shipped-grid ${isCompanion ? 'shipped-grid--rich' : ''}`}>
                        {visibleDone.map((item, i) => (
                            <div key={item.id} className={`shipped-card ${isCompanion ? 'shipped-card--rich' : ''}`} style={{ animationDelay: `${i * 0.05}s` }}>
                                <div className="shipped-card-inner">
                                    <div className="card-top-row">
                                        <div className="card-badge shipped-badge">{item.category}</div>
                                        <svg className="shipped-check" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h3>{item.title}</h3>
                                    {isCompanion && <p className="shipped-desc">{item.description}</p>}
                                    {item.themeTranslation && (
                                        <span className="shipped-theme">{item.themeTranslation}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {hiddenCount > 0 && (
                        <button
                            className="shipped-toggle"
                            onClick={() => setShippedExpanded(!shippedExpanded)}
                        >
                            {shippedExpanded ? 'Collapse' : `Show ${hiddenCount} more`}
                            <svg
                                className={`toggle-chevron ${shippedExpanded ? 'rotated' : ''}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                width="16"
                                height="16"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </section>
            )}

            <div className="roadmap-footer">
                <a href="#/community" className="community-back-btn">
                    &#8592; Back to Hub
                </a>
            </div>
        </div>
    );
};

export default Roadmap;
