import { useState } from 'react';
import SnippetCard from './SnippetCard';

function CategoryGroup({ category, snippets, onDelete, onEdit, onToggleFavorite, onDuplicate, viewMode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const categoryIcons = {
    Frontend: '🎨',
    Backend: '⚙️',
    Database: '🗄️',
    Algorithms: '🧮',
    Utilities: '🔧',
    DevOps: '🚀',
    Testing: '🧪',
    Security: '🔒'
  };

  return (
    <div className="category-group">
      <button
        className="category-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="category-title">
          <span className="category-icon">{categoryIcons[category] || '📁'}</span>
          <h2>{category}</h2>
          <span className="category-count">{snippets.length}</span>
        </div>
        <span className={`collapse-icon ${isCollapsed ? 'collapsed' : ''}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {!isCollapsed && (
        <div className={`category-content ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
          {snippets.map(snippet => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onDelete={onDelete}
              onEdit={onEdit}
              onToggleFavorite={onToggleFavorite}
              onDuplicate={onDuplicate}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryGroup;
