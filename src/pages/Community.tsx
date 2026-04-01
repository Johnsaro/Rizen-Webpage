import React, { useState, useEffect } from 'react';
import './Community.css';
import Blog from './Blog';
import Docs from './Docs';
import CommunityEvents from './CommunityEvents';
import CommunityEventDetail from './CommunityEventDetail';
import Roadmap from './Roadmap';

interface CommunityProps {
    subView: 'hub' | 'docs' | 'events' | 'blog' | 'discord' | 'roadmap';
    roadmapBuild?: string;
}

const CommunityHub: React.FC = () => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const cards = [
        {
            id: 'roadmap',
            title: 'Roadmap',
            desc: 'See what features and updates are currently in development for Rizen.',
            icon: '🚀',
            activity: 'Now, Next, Later',
            accent: 'violet',
            live: false
        },
        {
            id: 'docs',
            title: 'Docs',
            desc: 'Technical documentation, APIs, and implementation guides.',
            icon: '📚',
            activity: 'Updated Today',
            accent: 'emerald',
            live: false
        },
        {
            id: 'events',
            title: 'Events',
            desc: 'Join operations, hunt vulnerabilities, and climb the ranks.',
            icon: '🗓️',
            activity: 'Bug Bounty Live',
            accent: 'cyan',
            live: true
        },
        {
            id: 'blog',
            title: 'Blog',
            desc: 'Updates, build logs, and comprehensive patch notes.',
            icon: '✍️',
            activity: 'Latest: v2.0 Release',
            accent: 'amber',
            live: false
        },
        {
            id: 'discord',
            title: 'Discord',
            desc: 'Connect with cultivators. Coordinate, learn, and ascend together.',
            icon: '💬',
            activity: '1,204 Online',
            accent: 'indigo',
            live: true
        }
    ];

    return (
        <div className={`community-page ${visible ? 'entered' : ''}`}>
            {/* Atmospheric background grid */}
            <div className="community-atmosphere">
                <div className="atmo-grid"></div>
                <div className="atmo-glow atmo-glow-1"></div>
                <div className="atmo-glow atmo-glow-2"></div>
            </div>

            <div className="community-header">
                <div className="status-tag pulse-border">SECT NETWORK</div>
                <h1 className="glitch-title" data-text="COMMUNITY" style={{ marginBottom: '1.5rem', marginTop: '0.5rem' }}>COMMUNITY</h1>
                <p className="community-subtitle">
                    A rising tide lifts all cultivators. Share tactics, collaborate on builds, and ascend together.
                </p>
            </div>

            <div className="community-grid">
                {cards.map((card, idx) => (
                    <a
                        key={card.id}
                        href={`#/community/${card.id}`}
                        className={`community-card accent-${card.accent}`}
                        style={{ '--card-delay': `${idx * 0.08}s` } as React.CSSProperties}
                    >
                        <div className="cc-glow-orb"></div>
                        <div className="cc-top">
                            <div className="community-icon">{card.icon}</div>
                            <div className={`community-activity ${card.live ? 'activity-live' : ''}`}>
                                {card.live && <span className="activity-pulse"></span>}
                                {card.activity}
                            </div>
                        </div>
                        <h2>{card.title}</h2>
                        <p>{card.desc}</p>
                        <div className="cc-footer">
                            <span className="cc-enter">Enter <span className="cc-arrow">→</span></span>
                        </div>
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

const Community: React.FC<CommunityProps> = ({ subView, roadmapBuild }) => {

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
                        subView === 'roadmap' ? <Roadmap initialBuild={roadmapBuild} /> :
                            subView === 'events' ? <CommunityEvents /> :
                                <CommunitySubpage subView={subView} />}
        </>
    );
};

export default Community;
