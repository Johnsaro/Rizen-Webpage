import React, { useState, useEffect } from 'react';
import './Blog.css';
import { rizenBlogPosts } from '../data/rizenBlog';
import type { BlogPost } from '../data/rizenBlog';
import ArticleContent from './ArticleContent';

const BlogCard: React.FC<{ post: BlogPost, onClick: (id: string) => void }> = ({ post, onClick }) => {
    return (
        <a href={`#/blog/${post.id}`} onClick={(e) => { e.preventDefault(); onClick(post.id); }} className={`blog-card ${post.featured ? 'featured' : ''}`}>
            <div className="blog-card-header">
                <div className="blog-icon-wrapper">
                    <span className="blog-icon">{post.icon}</span>
                </div>
                <div className="blog-badges">
                    <span className={`blog-category cat-${post.category.toLowerCase().replace(' ', '-')}`}>
                        {post.category}
                    </span>
                    {post.version && <span className="blog-version">{post.version}</span>}
                </div>
            </div>

            <div className="blog-card-content">
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-summary">{post.summary}</p>
            </div>

            <div className="blog-card-footer">
                <span className="blog-date">{post.date}</span>
                <span className="blog-read-btn">Read Article <span>→</span></span>
            </div>
        </a>
    );
};

const Blog: React.FC = () => {
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string | null>(null);

    // Hash parsing to determine if a specific post is loaded
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#/blog/')) {
                // Parse out potential anchor from the hash
                // e.g. #/blog/my-post#section-1
                const parts = hash.replace('#/blog/', '').split('#');
                const id = parts[0];
                const anchor = parts[1];
                
                setSelectedPostId(id);
                
                if (anchor) {
                    setActiveSection(anchor);
                } else {
                    window.scrollTo({ top: 0, behavior: 'instant' });
                }
            } else if (hash === '#/community' || hash === '#/blog') {
                setSelectedPostId(null);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Check on mount
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Active Section Tracking (Intersection Observer)
    useEffect(() => {
        if (!selectedPostId) return;

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px', // Target the top part of the viewport
            threshold: 0
        };

        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        
        // Wait for content to render
        const timeoutId = setTimeout(() => {
            const sections = document.querySelectorAll('.article-section-anchor');
            sections.forEach(section => observer.observe(section));
        }, 100);

        return () => {
            observer.disconnect();
            clearTimeout(timeoutId);
        };
    }, [selectedPostId]);

    // Reading progress calculation
    useEffect(() => {
        let rafId: number;
        const handleScroll = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
                if (totalHeight <= 0) {
                    setScrollProgress(0);
                    return;
                }
                const progress = (window.scrollY / totalHeight) * 100;
                setScrollProgress(Math.min(100, Math.max(0, progress)));
            });
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [selectedPostId]);

    const handlePostClick = (id: string) => {
        window.location.hash = `#/blog/${id}`;
    };

    const handleBackToList = () => {
        window.location.hash = `#/community`;
    };

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            // Smooth scroll
            element.scrollIntoView({ behavior: 'smooth' });
            
            // Add "arrival" class for visual feedback
            element.classList.add('is-arriving');
            setTimeout(() => {
                element.classList.remove('is-arriving');
            }, 1500);

            // Update hash without triggering reload
            window.history.replaceState(null, '', `#/blog/${selectedPostId}#${id}`);
            setActiveSection(id);
        }
    };

    // If a post is selected, render the article view
    if (selectedPostId) {
        const post = rizenBlogPosts.find(p => p.id === selectedPostId);

        if (!post) {
            return (
                <div className="blog-page">
                    <div className="blog-hero">
                        <h1>Post not found</h1>
                        <button onClick={handleBackToList} className="article-back-btn">
                            ← Back to Blog
                        </button>
                    </div>
                </div>
            );
        }

        // Extract headings for TOC
        const headings = post.content.split('\n')
            .filter(line => line.trim().startsWith('### ') || line.trim().startsWith('## '))
            .map(line => {
                const isH3 = line.trim().startsWith('### ');
                const title = line.replace(isH3 ? '### ' : '## ', '').trim();
                const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                return { id, title, level: isH3 ? 3 : 2 };
            });

        const activeIndex = headings.findIndex(h => h.id === activeSection);
        const progressText = headings.length > 0 
            ? `${activeIndex + 1} of ${headings.length} Sections`
            : 'Reading...';

        const relatedPosts = rizenBlogPosts
            .filter(p => p.id !== post.id && (p.category === post.category || p.featured))
            .slice(0, 3);

        return (
            <div className="article-container reveal visible">
                <main className="article-main-column">
                    <button onClick={handleBackToList} className="article-back-btn">
                        ← Back to Dev Blog
                    </button>

                    <header className="article-header">
                        <div className="article-compact-meta">
                            <span className="meta-dot"></span>
                            <span className="meta-category">{post.category}</span>
                            <span className="meta-divider">·</span>
                            <span className="meta-version">{post.version || 'v1.0.0'}</span>
                            <span className="meta-divider">·</span>
                            <span className="meta-date">{post.date}</span>
                        </div>
                        <h1>{post.title}</h1>
                        <div className="article-summary-card">
                            <p>{post.summary}</p>
                        </div>
                    </header>

                    <section className="article-body">
                        <ArticleContent content={post.content} />
                    </section>

                    <footer className="article-footer-nav">
                        <div style={{ width: '100%' }}>
                            <div className="section-header" style={{ marginBottom: '2rem' }}>
                                <h2>Related Updates</h2>
                                <div className="header-line"></div>
                            </div>
                            <div className="related-updates-grid">
                                {relatedPosts.map(p => (
                                    <a key={p.id} href={`#/blog/${p.id}`} onClick={(e) => { e.preventDefault(); handlePostClick(p.id); }} className="related-update-card">
                                        <div className="ru-card-meta">
                                            <span className={`blog-category cat-${p.category.toLowerCase().replace(' ', '-')}`}>{p.category}</span>
                                            <span className="ru-card-date">{p.date}</span>
                                        </div>
                                        <h3 className="ru-card-title">{p.title}</h3>
                                        <p className="ru-card-summary">{p.summary}</p>
                                        <div className="ru-card-footer">
                                            <span className="blog-read-btn">Read <span>→</span></span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </footer>
                </main>

                <aside className="article-sidebar">
                    <div className="sidebar-sticky-content">
                        {headings.length > 0 && (
                            <div className="sidebar-section">
                                <span className="sidebar-section-title">Navigation Grid</span>
                                <nav className="sidebar-toc">
                                    {headings.map(h => (
                                        <a 
                                            key={h.id} 
                                            href={`#${h.id}`} 
                                            className={`toc-link ${h.level === 3 ? 'h3-link' : ''} ${activeSection === h.id ? 'active' : ''}`}
                                            onClick={(e) => scrollToSection(e, h.id)}
                                        >
                                            {h.title}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        )}

                        <div className="sidebar-section">
                            <span className="sidebar-section-title">Reading Progress</span>
                            <div className="section-progress-display">
                                <div className="progress-indicator-track">
                                    <div className="progress-indicator-fill" style={{ width: `${scrollProgress}%` }}></div>
                                </div>
                                <span className="progress-section-count">{progressText}</span>
                            </div>
                        </div>

                        {relatedPosts.length > 0 && (
                            <div className="sidebar-section">
                                <span className="sidebar-section-title">Sync Next</span>
                                <div className="sidebar-related">
                                    {relatedPosts.slice(0, 2).map(p => (
                                        <a key={p.id} href={`#/blog/${p.id}`} onClick={(e) => { e.preventDefault(); handlePostClick(p.id); }} className="related-card">
                                            <h4>{p.title}</h4>
                                            <span className="related-date">{p.date}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        );
    }

    // Default Grid view
    const featuredPost = rizenBlogPosts.find(p => p.featured);
    const regularPosts = rizenBlogPosts.filter(p => !p.featured);

    const devInsights = rizenBlogPosts.filter(p => p.category === 'Dev Insight');
    const logsAndNotes = rizenBlogPosts.filter(p => p.category === 'Build Log' || p.category === 'Patch Note');

    return (
        <div className="blog-page reveal visible">
            <div className="blog-hero">
                <div className="status-tag pulse-border" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>CULTIVATION_CHRONICLES</div>
                <h1 className="glitch-title" data-text="Rizen Cultivation Log">Rizen Cultivation Log</h1>
                <p className="blog-subtitle">
                    Updates, build logs, and cultivation deep dives from the architects of the Sect.
                </p>
            </div>

            {featuredPost && (
                <section className="blog-section featured-section">
                    <div className="section-header">
                        <h2>Featured Transmission</h2>
                        <div className="header-line"></div>
                    </div>
                    <BlogCard post={featuredPost} onClick={handlePostClick} />
                </section>
            )}

            <section className="blog-section">
                <div className="section-header">
                    <h2>Latest Updates</h2>
                    <div className="header-line"></div>
                </div>
                <div className="blog-grid">
                    {regularPosts.slice(0, 3).map(post => (
                        <BlogCard key={post.id} post={post} onClick={handlePostClick} />
                    ))}
                </div>
            </section>

            <div className="blog-split-section">
                <section className="blog-section half">
                    <div className="section-header">
                        <h2>Dev Insights</h2>
                        <div className="header-line"></div>
                    </div>
                    <div className="blog-grid dev-insights">
                        {devInsights.map(post => (
                            <BlogCard key={post.id} post={post} onClick={handlePostClick} />
                        ))}
                    </div>
                </section>

                <section className="blog-section half">
                    <div className="section-header">
                        <h2>Build Logs</h2>
                        <div className="header-line"></div>
                    </div>
                    <div className="blog-grid build-logs">
                        {logsAndNotes.map(post => (
                            <BlogCard key={post.id} post={post} onClick={handlePostClick} />
                        ))}
                    </div>
                </section>
            </div>

            <div className="blog-footer">
                <a href="#/community" className="community-back-btn">
                    ← Back to Hub
                </a>
            </div>
        </div>
    );
};

export default Blog;
