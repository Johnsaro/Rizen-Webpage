import React, { useState, useEffect } from 'react';
import './CommunityEvents.css';
import { rizenEvents } from '../data/rizenEvents';
import type { RizenEvent } from '../data/rizenEvents';

type FilterTab = 'all' | 'live' | 'ended';

const EventCard: React.FC<{ event: RizenEvent; onClick: (slug: string) => void; index: number }> = ({ event, onClick, index }) => {
    const formDate = new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    const endDate = new Date(event.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    return (
        <a
            href={`#/community/events/${event.slug}`}
            onClick={(e) => { e.preventDefault(); onClick(event.slug); }}
            className={`event-card ${event.featured ? 'featured' : ''}`}
            style={{ '--card-idx': index } as React.CSSProperties}
        >
            {/* Accent stripe */}
            <div className="ec-accent-stripe"></div>

            <div className={`event-status status-${event.status}`}>
                {event.status === 'live' && <span className="status-dot"></span>}
                {event.status}
            </div>

            {event.featured && (
                <div className="event-icon-wrapper featured-icon">
                    <span className="event-icon">{event.icon}</span>
                    <div className="event-icon-ring"></div>
                </div>
            )}

            <div className="event-content-wrapper">
                {!event.featured && (
                    <div className="event-icon-wrapper compact-icon">
                        <span className="event-icon">{event.icon}</span>
                    </div>
                )}
                <h3>{event.title}</h3>
                <div className="event-tagline">{event.tagline}</div>
                <p className="event-desc">{event.description}</p>

                <div className="event-card-footer">
                    <div className="event-date-range">
                        <span className="event-dates">{formDate}</span>
                        <span className="date-sep">→</span>
                        <span className="event-dates">{endDate}</span>
                    </div>
                    <span className="event-cta">
                        {event.ctaLabel}
                        <span className="cta-arrow">→</span>
                    </span>
                </div>
            </div>
        </a>
    );
};

const CommunityEvents: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [filter, setFilter] = useState<FilterTab>('all');

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleEventClick = (slug: string) => {
        window.location.hash = `#/community/events/${slug}`;
    };

    const featuredEvent = rizenEvents.find(e => e.featured && e.status !== 'ended') || rizenEvents[0];
    const otherEvents = rizenEvents.filter(e => e.id !== featuredEvent?.id);

    const filteredOther = filter === 'all'
        ? otherEvents
        : otherEvents.filter(e => e.status === filter);

    const liveCount = rizenEvents.filter(e => e.status === 'live').length;
    const endedCount = rizenEvents.filter(e => e.status === 'ended').length;

    return (
        <div className={`events-hub ${visible ? 'entered' : ''}`}>

            <section className="event-hub-hero">
                <a href="#/community" className="events-back-link">← Community Hub</a>
                <div className="status-tag pulse-border">INITIATIVES</div>
                <h1 className="events-title">
                    <span className="et-main">Sect Events</span>
                    <span className="et-sub">Operations & Archives</span>
                </h1>
                <p className="event-hub-subtitle">
                    Participate in system-wide operations, hunt vulnerabilities, and climb the ranks of competitive challenge runs.
                </p>

                {/* Event stats strip */}
                <div className="event-stats-strip">
                    <div className="ess-item">
                        <span className="ess-value">{rizenEvents.length}</span>
                        <span className="ess-label">Total</span>
                    </div>
                    <div className="ess-divider"></div>
                    <div className="ess-item">
                        <span className="ess-value ess-live">{liveCount}</span>
                        <span className="ess-label">Active</span>
                    </div>
                    <div className="ess-divider"></div>
                    <div className="ess-item">
                        <span className="ess-value">{endedCount}</span>
                        <span className="ess-label">Archived</span>
                    </div>
                </div>
            </section>

            {featuredEvent && (
                <section className="events-section featured-section">
                    <div className="section-header">
                        <div className="sh-icon">◆</div>
                        <h2>Priority Operation</h2>
                        <div className="header-line"></div>
                    </div>
                    <EventCard event={featuredEvent} onClick={handleEventClick} index={0} />
                </section>
            )}

            {otherEvents.length > 0 && (
                <section className="events-section">
                    <div className="section-header">
                        <div className="sh-icon">▣</div>
                        <h2>All Archives & Mandates</h2>
                        <div className="header-line"></div>
                        {/* Filter tabs */}
                        <div className="events-filter-tabs">
                            {(['all', 'live', 'ended'] as FilterTab[]).map(tab => (
                                <button
                                    key={tab}
                                    className={`eft-btn ${filter === tab ? 'active' : ''}`}
                                    onClick={() => setFilter(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="events-grid">
                        {filteredOther.map((evt, idx) => (
                            <EventCard key={evt.id} event={evt} onClick={handleEventClick} index={idx + 1} />
                        ))}
                    </div>
                    {filteredOther.length === 0 && (
                        <div className="events-empty-filter">
                            <span className="eef-icon">∅</span>
                            <p>No {filter} operations found in archives.</p>
                        </div>
                    )}
                </section>
            )}

            {!featuredEvent && otherEvents.length === 0 && (
                <section className="events-section events-empty">
                    <div className="events-empty-state">
                        <div className="ees-radar">
                            <div className="ees-radar-ring"></div>
                            <div className="ees-radar-sweep"></div>
                        </div>
                        <h3>Sector Status: STANDBY</h3>
                        <p>[0] Active mandates identified. Return to standby.</p>
                    </div>
                </section>
            )}
        </div>
    );
};

export default CommunityEvents;
