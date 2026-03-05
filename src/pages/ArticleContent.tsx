import React from 'react';
import './ArticleContent.css';

interface ArticleContentProps {
    content: string;
}

const formatMarkdown = (text: string) => {
    // Basic Markdown formatting for the blog posts
    let formattedText = text;

    // Bold: **text**
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic: *text*
    formattedText = formattedText.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Code ticks: `text`
    formattedText = formattedText.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Split by paragraphs
    const paragraphs = formattedText.split('\n\n');

    return paragraphs.map((p, index) => {
        // Check if paragraph is a bullet list
        if (p.trim().startsWith('- ')) {
            const listItems = p.split('\n').map(item => {
                const itemContent = item.replace(/^- /, '').trim();
                return `<li class="article-li">${itemContent}</li>`;
            }).join('');
            return <ul key={index} className="article-ul" dangerouslySetInnerHTML={{ __html: listItems }} />;
        }

        // Handle standalone lines in a single paragraph string
        const lines = p.split('\n');
        if (lines.length > 1 && lines.some(line => line.trim().startsWith('- '))) {
            const listItems = lines.filter(line => line.trim().startsWith('- ')).map(item => {
                return `<li class="article-li">${item.replace(/^- /, '').trim()}</li>`;
            }).join('');

            const textContent = lines.filter(line => !line.trim().startsWith('- ')).join('<br />');

            return (
                <div key={index}>
                    {textContent && <p className="article-p" dangerouslySetInnerHTML={{ __html: textContent }} />}
                    <ul className="article-ul" dangerouslySetInnerHTML={{ __html: listItems }} />
                </div>
            );
        }

        // Check if paragraph is a single quote block
        if (p.trim().startsWith('> ')) {
            return <blockquote key={index} className="article-quote" dangerouslySetInnerHTML={{ __html: p.replace(/^> /, '') }} />
        }

        // Standard paragraph
        return <p key={index} className="article-p" dangerouslySetInnerHTML={{ __html: p.replace(/\n/g, '<br />') }} />;
    });
};

const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
    return (
        <div className="article-content-renderer">
            {formatMarkdown(content)}
        </div>
    );
};

export default ArticleContent;
