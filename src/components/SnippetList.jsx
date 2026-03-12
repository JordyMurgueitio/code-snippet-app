import SnippetCard from './SnippetCard';
import CategoryGroup from './CategoryGroup';

function SnippetList({ snippets, onDelete, onEdit, onToggleFavorite, onDuplicate, viewMode, groupByCategory }) {
  if (snippets.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
        <h3>No snippets found</h3>
        <p>Start building your collection by creating your first code snippet.</p>
        <p className="empty-hint">Press <kbd>⌘N</kbd> to create a new snippet</p>
      </div>
    );
  }

  const favorites = snippets.filter(s => s.isFavorite);
  const nonFavorites = snippets.filter(s => !s.isFavorite);

  if (groupByCategory) {
    const groupedSnippets = {};

    if (favorites.length > 0) {
      groupedSnippets['⭐ Favorites'] = favorites;
    }

    nonFavorites.forEach(snippet => {
      const category = snippet.category || 'Uncategorized';
      if (!groupedSnippets[category]) {
        groupedSnippets[category] = [];
      }
      groupedSnippets[category].push(snippet);
    });

    return (
      <div className="snippet-list-grouped">
        {Object.entries(groupedSnippets).map(([category, categorySnippets]) => (
          <CategoryGroup
            key={category}
            category={category}
            snippets={categorySnippets}
            onDelete={onDelete}
            onEdit={onEdit}
            onToggleFavorite={onToggleFavorite}
            onDuplicate={onDuplicate}
            viewMode={viewMode}
          />
        ))}
      </div>
    );
  }

  const orderedSnippets = [...favorites, ...nonFavorites];

  return (
    <div className={`snippet-list ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
      {orderedSnippets.map(snippet => (
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
  );
}

export default SnippetList;
