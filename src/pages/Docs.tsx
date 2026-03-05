import React, { useState, useEffect } from 'react';
import './Docs.css';
import { rizenDocs } from '../data/rizenDocs';
import type { DocSection } from '../data/rizenDocs';

const Docs: React.FC = () => {
    const [activeSectionId, setActiveSectionId] = useState<string>(rizenDocs[0].id);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const activeSection = rizenDocs.find(s => s.id === activeSectionId) || rizenDocs[0];

    // Scroll to section when activeSection changes or anchor is clicked
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeSectionId]);

    const handleSectionClick = (id: string) => {
        setActiveSectionId(id);
        setMobileDrawerOpen(false);
    };

    return (
        <div className="docs-layout reveal visible">
            {/* Mobile Drawer Toggle */}
            <div className="docs-mobile-header">
                <button
                    className="docs-drawer-toggle"
                    onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                >
                    {mobileDrawerOpen ? '✕ Close Index' : '☰ Open Index'}
                </button>
                <span className="docs-mobile-current">{activeSection.title}</span>
            </div>

            {/* Sidebar Navigation */}
            <aside className={`docs-sidebar ${mobileDrawerOpen ? 'open' : ''}`}>
                <div className="docs-sidebar-header">
                    <div className="status-tag pulse-border">OFFICIAL INTEL</div>
                    <h3>Rizen Protocol</h3>
                </div>

                <nav className="docs-nav">
                    {rizenDocs.map((section: DocSection) => (
                        <button
                            key={section.id}
                            className={`docs-nav-link ${activeSectionId === section.id ? 'active' : ''}`}
                            onClick={() => handleSectionClick(section.id)}
                        >
                            <span className="docs-nav-icon">{section.icon}</span>
                            {section.title}
                        </button>
                    ))}
                </nav>

                <div className="docs-sidebar-footer">
                    <a href="#/community" className="community-back-btn">
                        ← Back to Hub
                    </a>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="docs-content">
                <div className="docs-content-inner">
                    <header className="docs-section-header">
                        <div className="section-title">
                            <span className="section-icon">{activeSection.icon}</span>
                            <h1>{activeSection.title}</h1>
                        </div>
                        <p className="section-summary">{activeSection.summary}</p>
                    </header>

                    <div className="docs-subsections">
                        {activeSection.subsections.map((sub) => (
                            <section key={sub.id} id={sub.id} className="docs-subsection">
                                <a href={`#${sub.id}`} className="docs-anchor-link">
                                    <h3>{sub.title} <span className="anchor-icon">#</span></h3>
                                </a>
                                <div className="docs-subsection-content">
                                    <p>{sub.content}</p>

                                    {sub.items && (
                                        <ul className="docs-list">
                                            {sub.items.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    )}

                                    {sub.code && (
                                        <div className="docs-code-block">
                                            <code>{sub.code}</code>
                                        </div>
                                    )}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </main>

            {/* Mobile overlay */}
            {mobileDrawerOpen && (
                <div
                    className="docs-mobile-overlay"
                    onClick={() => setMobileDrawerOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Docs;
