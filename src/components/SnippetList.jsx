import SnippetCard from './SnippetCard';
import CategoryGroup from './CategoryGroup';

function SnippetList({ snippets, onDelete, onEdit, onToggleFavorite, viewMode, groupByCategory }) {
  if (snippets.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-icon">📝</p>
        <h3>No snippets found</h3>
        <p>Start adding your favorite code snippets to build your collection!</p>
      </div>
    );
  }

  // Show favorites first if any exist
  const favorites = snippets.filter(s => s.isFavorite);
  const nonFavorites = snippets.filter(s => !s.isFavorite);

  if (groupByCategory) {
    // Group snippets by category
    const groupedSnippets = {};
    
    // Add favorites first if they exist
    if (favorites.length > 0) {
      groupedSnippets['⭐ Favorites'] = favorites;
    }

    // Group non-favorites by category
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
            viewMode={viewMode}
          />
        ))}
      </div>
    );
  }

  // Flat view (favorites first)
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
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}

export default SnippetList;
