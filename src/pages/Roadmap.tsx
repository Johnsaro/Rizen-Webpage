import React from 'react';
import './Roadmap.css';
import { roadmapData } from '../data/rizenRoadmap';

const Roadmap: React.FC = () => {
    const doneItems = roadmapData.filter(i => i.status === 'done');
    const nowItems = roadmapData.filter(i => i.status === 'now');
    const nextItems = roadmapData.filter(i => i.status === 'next');
    const laterItems = roadmapData.filter(i => i.status === 'later');

    return (
        <div className="roadmap-page reveal visible">
            <div className="roadmap-hero">
                <div className="status-tag pulse-border">SYSTEM TRAJECTORY</div>
                <h1 className="glitch-title" data-text="Product Roadmap">Product Roadmap</h1>
                <p className="roadmap-subtitle">
                    A transparent look at upcoming features, updates, and expansions.
                    <br/>(We mix standard feature names with our signature Cultivation theme).
                </p>
            </div>

            <div className="roadmap-board">
                {/* DONE COLUMN */}
                <div className="roadmap-column">
                    <div className="column-header">
                        <h2>Done</h2>
                        <span className="column-desc">Shipped in V2</span>
                    </div>
                    <div className="column-content">
                        {doneItems.map(item => (
                            <div key={item.id} className="roadmap-card done-card">
                                <div className="card-badge">{item.category}</div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                {item.themeTranslation && (
                                    <div className="theme-translation">
                                        <span>In-Universe:</span> {item.themeTranslation}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* NOW COLUMN */}
                <div className="roadmap-column">
                    <div className="column-header">
                        <h2>Now</h2>
                        <span className="column-desc">Actively in development</span>
                    </div>
                    <div className="column-content">
                        {nowItems.map(item => (
                            <div key={item.id} className="roadmap-card now-card">
                                <div className="card-badge">{item.category}</div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                {item.themeTranslation && (
                                    <div className="theme-translation">
                                        <span>In-Universe:</span> {item.themeTranslation}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* NEXT COLUMN */}
                <div className="roadmap-column">
                    <div className="column-header">
                        <h2>Next</h2>
                        <span className="column-desc">Queued for upcoming updates</span>
                    </div>
                    <div className="column-content">
                        {nextItems.map(item => (
                            <div key={item.id} className="roadmap-card next-card">
                                <div className="card-badge">{item.category}</div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                {item.themeTranslation && (
                                    <div className="theme-translation">
                                        <span>In-Universe:</span> {item.themeTranslation}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* LATER COLUMN */}
                <div className="roadmap-column">
                    <div className="column-header">
                        <h2>Later</h2>
                        <span className="column-desc">Strategic long-term goals</span>
                    </div>
                    <div className="column-content">
                        {laterItems.map(item => (
                            <div key={item.id} className="roadmap-card later-card">
                                <div className="card-badge">{item.category}</div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                {item.themeTranslation && (
                                    <div className="theme-translation">
                                        <span>In-Universe:</span> {item.themeTranslation}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="roadmap-footer">
                <a href="#/community" className="community-back-btn">
                    ← Back to Hub
                </a>
            </div>
        </div>
    );
};

export default Roadmap;