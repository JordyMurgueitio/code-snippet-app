import { useState } from 'react';
import SnippetCard from './SnippetCard';

function CategoryGroup({ category, snippets, onDelete, onEdit, onToggleFavorite, viewMode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const categoryIcons = {
    Frontend: '🎨',
    Backend: '⚙️',
    Database: '🗄️',
    Algorithms: '🧮',
    Utilities: '🔧'
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
          ▼
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
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryGroup;
