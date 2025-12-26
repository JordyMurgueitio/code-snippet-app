import { useState } from 'react';
import CodeBlock from './CodeBlock';

function SnippetCard({ snippet, onDelete, onEdit, onToggleFavorite, viewMode = 'list' }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
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
            <span className="language-badge">{snippet.language}</span>
            {snippet.category && (
              <span className="category-badge">{snippet.category}</span>
            )}
          </div>
        </div>
        <div className="snippet-actions">
          <button 
            onClick={() => onToggleFavorite(snippet.id)} 
            className="icon-btn"
            aria-label={snippet.isFavorite ? "Remove from favorites" : "Add to favorites"}
            title={snippet.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {snippet.isFavorite ? '⭐' : '☆'}
          </button>
          <button 
            onClick={handleCopy} 
            className="icon-btn"
            aria-label="Copy code"
            title="Copy to clipboard"
          >
            {copySuccess ? '✓' : '📋'}
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
        <CodeBlock code={snippet.code} language={snippet.language} />
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
