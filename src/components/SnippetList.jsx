import SnippetCard from './SnippetCard';

function SnippetList({ snippets, onDelete, onEdit }) {
  if (snippets.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-icon">📝</p>
        <h3>No snippets found</h3>
        <p>Start adding your favorite code snippets to build your collection!</p>
      </div>
    );
  }

  return (
    <div className="snippet-list">
      {snippets.map(snippet => (
        <SnippetCard
          key={snippet.id}
          snippet={snippet}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default SnippetList;
