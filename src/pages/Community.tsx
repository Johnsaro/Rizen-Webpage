import React, { useState, useEffect } from 'react';
import './Community.css';
import Blog from './Blog';
import Docs from './Docs';
import CommunityEvents from './CommunityEvents';
import CommunityEventDetail from './CommunityEventDetail';

interface CommunityProps {
    subView: 'hub' | 'docs' | 'events' | 'blog' | 'discord';
}

const CommunityHub: React.FC = () => {
    const cards = [
        {
            id: 'docs',
            title: 'Docs',
            desc: 'Technical documentation, APIs, and implementation guides.',
            icon: '📚',
            activity: 'Updated Today'
        },
        {
            id: 'events',
            title: 'Events',
            desc: 'Join upcoming project sharing sessions and builder meetups.',
            icon: '🗓️',
            activity: 'Live: Bug Bounty'
        },
        {
            id: 'blog',
            title: 'Blog',
            desc: 'Updates, build logs, and comprehensive patch notes.',
            icon: '✍️',
            activity: 'Latest: v2.0 Release'
        },
        {
            id: 'discord',
            title: 'Discord',
            desc: 'Connect with operatives. Coordinate, learn, and ascend together.',
            icon: '💬',
            activity: '1,204 Online'
        }
    ];

    return (
        <div className="community-page reveal visible">
            <div className="community-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="status-tag pulse-border">GUILD NETWORK</div>
                <h1 className="glitch-title" data-text="COMMUNITY" style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>COMMUNITY</h1>
                <p>A rising tide lifts all operatives. Share tactics, collaborate on builds, and ascend together.</p>
            </div>

            <div className="community-grid">
                {cards.map(card => (
                    <a key={card.id} href={`#/community/${card.id}`} className="community-card">
                        <div className="community-icon">{card.icon}</div>
                        <h2>{card.title}</h2>
                        <p>{card.desc}</p>
                        <div className="community-activity">{card.activity}</div>
                    </a>
                ))}
            </div>
        </div>
    );
};

const CommunitySubpage: React.FC<{ subView: string }> = ({ subView }) => {
    const titles: Record<string, string> = {
        discord: 'Discord Server'
    };


    return (
        <div className="community-subpage reveal visible">
            <h1>{titles[subView] || 'Subpage'}</h1>
            <p>Protocol intel under construction. Current node: [{subView}]</p>
            <a href="#/community" className="community-back-btn">
                ← Back to Hub
            </a>
        </div>
    );
};

const Community: React.FC<CommunityProps> = ({ subView }) => {

    // Hash parsing to determine if a specific EVENT detail is loaded
    const [selectedEventSlug, setSelectedEventSlug] = useState<string | null>(null);
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#/community/events/')) {
                const slug = hash.replace('#/community/events/', '');
                setSelectedEventSlug(slug);
                window.scrollTo({ top: 0, behavior: 'instant' });
            } else {
                setSelectedEventSlug(null);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Check on mount
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // If an event detail is selected, force render the Event Detail component
    if (selectedEventSlug && subView === 'events') {
        return <CommunityEventDetail slug={selectedEventSlug} />
    }

    return (
        <>
            {subView === 'hub' ? <CommunityHub /> :
                subView === 'blog' ? <Blog /> :
                    subView === 'docs' ? <Docs /> :
                        subView === 'events' ? <CommunityEvents /> :
                            <CommunitySubpage subView={subView} />}
        </>
    );
};

export default Community;
