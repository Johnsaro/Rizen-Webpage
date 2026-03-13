import React from 'react';
import './ArticleContent.css';

interface ArticleContentProps {
    content: string;
}

/**
 * Enhanced Markdown Formatter for Rizen Blog
 * Handles block-level elements and inline formatting with safety
 */
const formatMarkdown = (text: string) => {
    if (!text) return null;

    // 1. Pre-process inline formatting (Bold, Italic, Code, Links)
    let processedText = text;

    // Bold: **text**
    processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic: *text*
    processedText = processedText.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Inline Code: `text`
    processedText = processedText.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Links: [text](url)
    processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="article-a" target="_blank" rel="noopener noreferrer">$1</a>');

    // 2. Line-by-line block parsing
    const lines = processedText.split('\n');
    const blocks: React.ReactNode[] = [];
    
    let currentType: 'p' | 'ul' | 'quote' | null = null;
    let currentBuffer: string[] = [];

    const flushBuffer = () => {
        if (currentBuffer.length === 0) return;
        const content = currentBuffer.join('\n');
        const key = `block-${blocks.length}`;

        if (currentType === 'p') {
            blocks.push(<p key={key} className="article-p" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />);
        } else if (currentType === 'ul') {
            const listItems = currentBuffer.map((line, i) => {
                const itemContent = line.replace(/^- /, '').trim();
                return `<li class="article-li" key="${i}">${itemContent}</li>`;
            }).join('');
            blocks.push(<ul key={key} className="article-ul" dangerouslySetInnerHTML={{ __html: listItems }} />);
        } else if (currentType === 'quote') {
            const quoteContent = currentBuffer.map(line => line.replace(/^>\s*/, '')).join('<br />');
            blocks.push(<blockquote key={key} className="article-quote" dangerouslySetInnerHTML={{ __html: quoteContent }} />);
        }
        
        currentBuffer = [];
        currentType = null;
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trimEnd();
        const trimmed = line.trim();

        // Empty line triggers a block flush
        if (trimmed === '') {
            flushBuffer();
            continue;
        }

        // H2 Header: ## Title
        if (trimmed.startsWith('## ')) {
            flushBuffer();
            const title = trimmed.replace(/^##\s*/, '');
            const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            blocks.push(
                <div key={`block-${blocks.length}`} className="article-section-anchor" id={id}>
                    <h2 className="article-h2" dangerouslySetInnerHTML={{ __html: title }} />
                </div>
            );
            continue;
        }

        // H3 Header: ### Title
        if (trimmed.startsWith('### ')) {
            flushBuffer();
            const title = trimmed.replace(/^###\s*/, '');
            const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            blocks.push(
                <div key={`block-${blocks.length}`} className="article-section-anchor" id={id}>
                    <h3 className="article-h3" dangerouslySetInnerHTML={{ __html: title }} />
                </div>
            );
            continue;
        }

        // Roadmap Block: >>> text
        if (trimmed.startsWith('>>> ')) {
            flushBuffer();
            blocks.push(
                <div key={`block-${blocks.length}`} className="article-roadmap-block">
                    <div className="roadmap-line"></div>
                    <div className="roadmap-content">
                        <span className="roadmap-tag" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-purple)', marginBottom: '0.5rem', fontFamily: '"Fira Code", monospace', letterSpacing: '1px' }}>PATH_AHEAD</span>
                        <p dangerouslySetInnerHTML={{ __html: trimmed.replace(/^>>>\s*/, '') }} />
                    </div>
                </div>
            );
            continue;
        }

        // Milestone Block: [M] text
        if (trimmed.startsWith('[M] ')) {
            flushBuffer();
            blocks.push(
                <div key={`block-${blocks.length}`} className="article-milestone-block">
                    <div className="milestone-badge" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginBottom: '1rem', letterSpacing: '2px' }}>MILESTONE</div>
                    <p dangerouslySetInnerHTML={{ __html: trimmed.replace(/^\[M\]\s*/, '') }} />
                </div>
            );
            continue;
        }

        // Highlight/Warning Block: !!! text
        if (trimmed.startsWith('!!! ')) {
            flushBuffer();
            blocks.push(
                <div key={`block-${blocks.length}`} className="article-highlight-block">
                    <div className="highlight-icon">⚡</div>
                    <p dangerouslySetInnerHTML={{ __html: trimmed.replace(/^!!!\s*/, '') }} />
                </div>
            );
            continue;
        }

        // Bullet List: - item
        if (trimmed.startsWith('- ')) {
            if (currentType !== 'ul') {
                flushBuffer();
                currentType = 'ul';
            }
            currentBuffer.push(trimmed);
            continue;
        }

        // Quote Block: > text
        if (trimmed.startsWith('> ')) {
            if (currentType !== 'quote') {
                flushBuffer();
                currentType = 'quote';
            }
            currentBuffer.push(trimmed);
            continue;
        }

        // Standard Paragraph Text
        if (currentType === 'ul' || currentType === 'quote') {
            // A non-list/non-quote line breaks the list/quote block unless empty (handled above)
            flushBuffer();
        }
        
        currentType = 'p';
        currentBuffer.push(trimmed);
    }

    flushBuffer(); // Final flush

    return blocks;
};

const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
    return (
        <div className="article-content-renderer">
            {formatMarkdown(content)}
        </div>
    );
};

export default ArticleContent;
