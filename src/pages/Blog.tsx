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

    // Hash parsing to determine if a specific post is loaded
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#/blog/')) {
                const id = hash.replace('#/blog/', '');
                setSelectedPostId(id);
                window.scrollTo({ top: 0, behavior: 'instant' });
            } else if (hash === '#/community' || hash === '#/blog') {
                setSelectedPostId(null);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Check on mount
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handlePostClick = (id: string) => {
        window.location.hash = `#/blog/${id}`;
    };

    const handleBackToList = () => {
        window.location.hash = `#/community`;
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

        return (
            <div className="article-content reveal visible">
                <button onClick={handleBackToList} className="article-back-btn">
                    ← Back to Dev Blog
                </button>

                <header className="article-header">
                    <div className="article-meta">
                        <span className="article-icon">{post.icon}</span>
                        <span className={`blog-category cat-${post.category.toLowerCase().replace(' ', '-')}`}>
                            {post.category}
                        </span>
                        <span className="blog-date" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: '"Fira Code", monospace', fontSize: '0.8rem' }}>
                            {post.date}
                        </span>
                        {post.version && <span className="blog-version">{post.version}</span>}
                    </div>
                    <h1>{post.title}</h1>
                    <div className="article-summary-box">
                        <p>{post.summary}</p>
                    </div>
                </header>

                <main>
                    <ArticleContent content={post.content} />
                </main>
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
                <div className="status-tag pulse-border" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>SYS_LOGS</div>
                <h1 className="glitch-title" data-text="Rizen Dev Blog">Rizen Dev Blog</h1>
                <p className="blog-subtitle">
                    Updates, build logs, and system deep dives from the architects of the Guild.
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
