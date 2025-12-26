import { useState } from 'react';

function SnippetCard({ snippet, onDelete, onEdit }) {
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

  return (
    <div className="snippet-card">
      <div className="snippet-header">
        <div>
          <h3>{snippet.title}</h3>
          <span className="language-badge">{snippet.language}</span>
        </div>
        <div className="snippet-actions">
          <button onClick={handleCopy} className="icon-btn copy-btn">
            {copySuccess ? '✓' : '📋'}
          </button>
          <button onClick={() => onEdit(snippet)} className="icon-btn edit-btn">
            ✏️
          </button>
          <button onClick={() => onDelete(snippet.id)} className="icon-btn delete-btn">
            🗑️
          </button>
        </div>
      </div>
      
      {snippet.description && (
        <p className="snippet-description">{snippet.description}</p>
      )}
      
      <div className={`code-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <pre>
          <code>{snippet.code}</code>
        </pre>
      </div>
      
      <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        className="expand-btn"
      >
        {isExpanded ? 'Show Less' : 'Show More'}
      </button>
      
      <div className="snippet-footer">
        <span className="snippet-date">
          {new Date(snippet.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default SnippetCard;
