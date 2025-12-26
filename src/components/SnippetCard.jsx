import { useState } from 'react';
import CodeBlock from './CodeBlock';

function SnippetCard({ snippet, onDelete, onEdit, onToggleFavorite, viewMode = 'list' }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Support both old single-code format and new multi-code format
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

  return (
    <div className={`snippet-card snippet-card-${viewMode}`}>
      <div className="snippet-header">
        <div>
          <h3>{snippet.title}</h3>
          <div className="snippet-badges">
            {codeBlocks.length > 1 ? (
              codeBlocks.map((block, i) => (
                <span key={i} className="language-badge">{block.language}</span>
              ))
            ) : (
              <span className="language-badge">{codeBlocks[0].language}</span>
            )}
            {snippet.category && (
              <span className="category-badge">{snippet.category}</span>
            )}
          </div>
        </div>
        <div className="snippet-actions">
          <button 
            onClick={() => onToggleFavorite(snippet.id)} 
            className="icon-btn favorite-btn"
            aria-label={snippet.isFavorite ? "Remove from favorites" : "Add to favorites"}
            title={snippet.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {snippet.isFavorite ? '⭐' : '☆'}
          </button>
          <button 
            onClick={() => onEdit(snippet)} 
            className="icon-btn"
            aria-label="Edit snippet"
            title="Edit"
          >
            ✏️
          </button>
          <button 
            onClick={() => onDelete(snippet.id)} 
            className="icon-btn"
            aria-label="Delete snippet"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
      
      {snippet.description && (
        <p className="snippet-description">{snippet.description}</p>
      )}
      
      <div className={`code-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {codeBlocks.map((block, index) => (
          <div key={index} className="code-block-wrapper">
            <div className="code-block-label">
              <span className="language-badge">{block.language}</span>
              <button
                onClick={() => handleCopy(block.code, index)}
                className="code-copy-btn"
                aria-label="Copy code"
                title="Copy to clipboard"
              >
                {copiedIndex === index ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <CodeBlock code={block.code} language={block.language} />
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="expand-btn"
      >
        {isExpanded ? 'Show Less' : 'Show More'}
      </button>
      
      <div className="snippet-footer">
        <span className="snippet-date">
          {formatDate(snippet.createdAt)}
        </span>
      </div>
    </div>
  );
}

export default SnippetCard;
