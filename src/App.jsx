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

  // Save snippets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('codeSnippets', JSON.stringify(snippets));
  }, [snippets]);

  const addSnippet = (snippetData) => {
    if (editingSnippet) {
      // Update existing snippet
      setSnippets(prev => prev.map(s => 
        s.id === editingSnippet.id 
          ? { ...snippetData, id: s.id, createdAt: s.createdAt }
          : s
      ));
      setEditingSnippet(null);
    } else {
      // Add new snippet
      const newSnippet = {
        ...snippetData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      setSnippets(prev => [newSnippet, ...prev]);
    }
    setShowForm(false);
  };

  const deleteSnippet = (id) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      setSnippets(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleEdit = (snippet) => {
    setEditingSnippet(snippet);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingSnippet(null);
    setShowForm(false);
  };

  // Filter snippets based on search and language filter
  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (snippet.description && snippet.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLanguage = !filterLanguage || snippet.language === filterLanguage;
    return matchesSearch && matchesLanguage;
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
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="toggle-form-btn"
          >
            {showForm ? '✕ Close' : '+ New Snippet'}
          </button>

          {showForm && (
            <SnippetForm 
              onSubmit={addSnippet}
              editingSnippet={editingSnippet}
              onCancel={handleCancelEdit}
            />
          )}

          {snippets.length > 0 && (
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterLanguage={filterLanguage}
              onFilterChange={setFilterLanguage}
              languages={languages}
            />
          )}

          <SnippetList
            snippets={filteredSnippets}
            onDelete={deleteSnippet}
            onEdit={handleEdit}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
