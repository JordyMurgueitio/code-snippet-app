import { useState, useEffect } from 'react';
import './App.css';
import SnippetForm from './components/SnippetForm';
import SearchBar from './components/SearchBar';
import SnippetList from './components/SnippetList';

function App() {
  // Lazy initialization - load from localStorage only once
  const [snippets, setSnippets] = useState(() => {
    const savedSnippets = localStorage.getItem('codeSnippets');
    return savedSnippets ? JSON.parse(savedSnippets) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, alphabetical
  const [viewMode, setViewMode] = useState('list'); // list or grid
  const [groupByCategory, setGroupByCategory] = useState(true); // group by category or flat list

  // Save snippets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('codeSnippets', JSON.stringify(snippets));
  }, [snippets]);

  const addSnippet = (snippetData) => {
    if (editingSnippet) {
      // Update existing snippet
      setSnippets(prev => prev.map(s => 
        s.id === editingSnippet.id 
          ? { ...snippetData, id: s.id, createdAt: s.createdAt, isFavorite: s.isFavorite }
          : s
      ));
      setEditingSnippet(null);
      setShowForm(false);
    } else {
      // Add new snippet
      const newSnippet = {
        ...snippetData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        isFavorite: false
      };
      setSnippets(prev => [newSnippet, ...prev]);
      setShowForm(false);
    }
  };

  const deleteSnippet = (id) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      setSnippets(prev => prev.filter(s => s.id !== id));
    }
  };

  const toggleFavorite = (id) => {
    setSnippets(prev => prev.map(s =>
      s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
    ));
  };

  const handleEdit = (snippet) => {
    setEditingSnippet(snippet);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingSnippet(null);
    setShowForm(false);
  };

  // Close form with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showForm) {
        handleCancelEdit();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showForm]);

  // Filter snippets based on search and language filter
  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (snippet.description && snippet.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLanguage = !filterLanguage || snippet.language === filterLanguage;
    return matchesSearch && matchesLanguage;
  });

  // Sort filtered snippets
  const sortedSnippets = [...filteredSnippets].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Get unique languages for filter dropdown
  const languages = [...new Set(snippets.map(s => s.language))].sort();

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 Code Snippet Manager</h1>
        <p className="subtitle">Save and organize your favorite code snippets</p>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="toolbar">
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="toggle-form-btn"
            >
              {showForm ? '✕ Close' : '+ New Snippet'}
            </button>
            
            {snippets.length > 0 && (
              <div className="snippet-count">
                {filteredSnippets.length === snippets.length ? (
                  <span>{snippets.length} {snippets.length === 1 ? 'snippet' : 'snippets'}</span>
                ) : (
                  <span>{filteredSnippets.length} of {snippets.length} snippets</span>
                )}
              </div>
            )}
          </div>

          {showForm && (
            <SnippetForm 
              onSubmit={addSnippet}
              editingSnippet={editingSnippet}
              onCancel={handleCancelEdit}
            />
          )}

          {snippets.length > 0 && (
            <>
              <div className="view-controls">
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  filterLanguage={filterLanguage}
                  onFilterChange={setFilterLanguage}
                  languages={languages}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
                
                <div className="display-controls">
                  <button
                    onClick={() => setGroupByCategory(!groupByCategory)}
                    className={`control-btn ${groupByCategory ? 'active' : ''}`}
                    title={groupByCategory ? "Show flat list" : "Group by category"}
                  >
                    {groupByCategory ? '📁' : '📄'}
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`control-btn ${viewMode === 'list' ? 'active' : ''}`}
                    title="List view"
                  >
                    ☰
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`control-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    title="Grid view"
                  >
                    ⊞
                  </button>
                </div>
              </div>
            </>
          )}

          <SnippetList
            snippets={sortedSnippets}
            onDelete={deleteSnippet}
            onEdit={handleEdit}
            onToggleFavorite={toggleFavorite}
            viewMode={viewMode}
            groupByCategory={groupByCategory}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
