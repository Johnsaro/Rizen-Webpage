import React from 'react';
import type { PlayerNotification } from '../../hooks/usePlayerProfile';

interface EventFeedProps {
    notifications?: PlayerNotification[];
    delay?: number;
}

const EventFeed = ({ notifications = [], delay = 0.4 }: EventFeedProps) => {
    // If no notifications, provide a fallback
    const events = notifications.length > 0 ? notifications.slice(0, 5).map((notif, index) => {
        // Calculate a relative time string (simple version)
        const date = new Date(notif.created_at);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHrs / 24);
        
        let timeStr = "JUST NOW";
        if (diffDays > 0) timeStr = `${diffDays}D AGO`;
        else if (diffHrs > 0) timeStr = `${diffHrs}H AGO`;
        
        return {
            id: notif.id,
            text: notif.message,
            time: timeStr,
            pulse: index === 0 && !notif.is_read // Pulse if it's the newest and unread
        };
    }) : [
        { id: 'fallback-1', text: "Awaiting new cultivation updates...", time: "SYSTEM", pulse: false }
    ];

    return (
        <div className="dash-card fade-in-up" style={{ animationDelay: `${delay}s`, width: '100%' }}>
            <span className="v2-card-title">CULTIVATION_LEDGER</span>
            <div className="event-feed-container">
                {events.map((event) => (
                    <div key={event.id} className={`event-entry ${event.pulse ? 'pulse' : ''}`}>
                        <div className="event-timestamp">{event.time}</div>
                        <div className="event-text">{event.text}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventFeed;
