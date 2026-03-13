import React from 'react';
import './CommunityEvents.css';
import { rizenEvents } from '../data/rizenEvents';
import type { RizenEvent } from '../data/rizenEvents';

const EventCard: React.FC<{ event: RizenEvent, onClick: (slug: string) => void }> = ({ event, onClick }) => {

    // Format dates cleanly
    const formDate = new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <a
            href={`#/community/events/${event.slug}`}
            onClick={(e) => { e.preventDefault(); onClick(event.slug); }}
            className={`event-card ${event.featured ? 'featured' : ''}`}
        >
            <div className={`event-status status-${event.status}`}>
                {event.status}
            </div>

            {event.featured && (
                <div className="event-icon-wrapper">
                    <span className="event-icon">{event.icon}</span>
                </div>
            )}

            <div className="event-content-wrapper">
                {!event.featured && (
                    <div className="event-icon-wrapper" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        <span className="event-icon">{event.icon}</span>
                    </div>
                )}
                <h3>{event.title}</h3>
                <div className="event-tagline">{event.tagline}</div>
                <p className="event-desc">{event.description}</p>

                <div className="event-card-footer">
                    <span className="event-dates">Launch: {formDate}</span>
                    <span className="event-cta">{event.ctaLabel} <span>→</span></span>
                </div>
            </div>
        </a>
    );
};

const CommunityEvents: React.FC = () => {

    const handleEventClick = (slug: string) => {
        window.location.hash = `#/community/events/${slug}`;
    };

    const featuredEvent = rizenEvents.find(e => e.featured && e.status !== 'ended') || rizenEvents[0];
    const otherEvents = rizenEvents.filter(e => e.id !== featuredEvent?.id);

    return (
        <div className="events-hub reveal visible">

            <section className="event-hub-hero">
                <div className="status-tag pulse-border">INITIATIVES</div>
                <h1 className="glitch-title" data-text="Sect Events">
                    Sect Events
                </h1>
                <p className="event-hub-subtitle">
                    Participate in system-wide operations, hunt vulnerabilities, and climb the ranks of competitive challenge runs.
                </p>
            </section>

            {featuredEvent && (
                <section className="events-section featured-section">
                    <div className="section-header">
                        <h2>Priority Operation</h2>
                        <div className="header-line"></div>
                    </div>
                    <EventCard event={featuredEvent} onClick={handleEventClick} />
                </section>
            )}

            {otherEvents.length > 0 && (
                <section className="events-section">
                    <div className="section-header">
                        <h2>All Archives & Mandates</h2>
                        <div className="header-line"></div>
                    </div>
                    <div className="events-grid">
                        {otherEvents.map(evt => (
                            <EventCard key={evt.id} event={evt} onClick={handleEventClick} />
                        ))}
                    </div>
                </section>
            )}

            {!featuredEvent && otherEvents.length === 0 && (
                <section className="events-section" style={{ textAlign: 'center', opacity: 0.5 }}>
                    <p style={{ fontFamily: 'Fira Code' }}>[0] Active mandates identified. Return to standby.</p>
                </section>
            )}
        </div>
    );
};

export default CommunityEvents;
