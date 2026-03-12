import { useState } from 'react';
import CodeBlock from './CodeBlock';

function SnippetCard({ snippet, onDelete, onEdit, onToggleFavorite, onDuplicate, viewMode = 'list' }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const codeBlocks = snippet.codeBlocks || [{
    code: snippet.code,
    language: snippet.language
  }];

  const handleCopy = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalLines = codeBlocks.reduce((acc, block) => acc + (block.code?.split('\n').length || 0), 0);

  return (
    <div className={`snippet-card snippet-card-${viewMode}`}>
      <div className="snippet-header">
        <div className="snippet-info">
          <h3>{snippet.title}</h3>
          <div className="snippet-meta">
            {codeBlocks.map((block, i) => (
              <span key={i} className="language-badge">{block.language}</span>
            ))}
            {snippet.category && (
              <span className="category-badge">{snippet.category}</span>
            )}
            <span className="meta-stat">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              </svg>
              {totalLines} lines
            </span>
          </div>
        </div>
        <div className="snippet-actions">
          <button
            onClick={() => onToggleFavorite(snippet.id)}
            className={`icon-btn favorite-btn ${snippet.isFavorite ? 'is-favorite' : ''}`}
            aria-label={snippet.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={snippet.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={snippet.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
          {onDuplicate && (
            <button
              onClick={() => onDuplicate(snippet.id)}
              className="icon-btn"
              aria-label="Duplicate snippet"
              title="Duplicate"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            </button>
          )}
          <button
            onClick={() => onEdit(snippet)}
            className="icon-btn"
            aria-label="Edit snippet"
            title="Edit"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(snippet.id)}
            className="icon-btn icon-btn-danger"
            aria-label="Delete snippet"
            title="Delete"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {snippet.description && (
        <p className="snippet-description">{snippet.description}</p>
      )}

      {snippet.tags && snippet.tags.length > 0 && (
        <div className="snippet-tags">
          {snippet.tags.map(tag => (
            <span key={tag} className="tag-display">#{tag}</span>
          ))}
        </div>
      )}

      <div className={`code-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {codeBlocks.map((block, index) => (
          <div key={index} className="code-block-wrapper">
            <div className="code-block-label">
              <span className="language-badge">{block.language}</span>
              <button
                onClick={() => handleCopy(block.code, index)}
                className={`code-copy-btn ${copiedIndex === index ? 'copied' : ''}`}
                aria-label="Copy code"
                title="Copy to clipboard"
              >
                {copiedIndex === index ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <CodeBlock code={block.code} language={block.language} />
          </div>
        ))}
      </div>

      <div className="snippet-footer">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="expand-btn"
        >
          {isExpanded ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
              Show Less
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              Show More
            </>
          )}
        </button>
        <span className="snippet-date">
          {formatDate(snippet.createdAt)}
        </span>
      </div>
    </div>
  );
}

export default SnippetCard;
