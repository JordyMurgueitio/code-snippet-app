import { useState, useEffect, useRef } from 'react';
import './App.css';
import SnippetForm from './components/SnippetForm';
import SearchBar from './components/SearchBar';
import SnippetList from './components/SnippetList';
import ToastContainer from './components/Toast';
import ConfirmModal from './components/ConfirmModal';
import { useToast } from './hooks/useToast';

function App() {
  // Lazy initialization - load from localStorage only once
  const [snippets, setSnippets] = useState(() => {
    const savedSnippets = localStorage.getItem('codeSnippets');
    return savedSnippets ? JSON.parse(savedSnippets) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('list');
  const [groupByCategory, setGroupByCategory] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
  const [importConfirm, setImportConfirm] = useState({ isOpen: false, data: null });

  const { toasts, addToast, removeToast } = useToast();
  const importInputRef = useRef(null);
  const searchInputRef = useRef(null);

  const handleCancelEdit = () => {
    setEditingSnippet(null);
    setShowForm(false);
  };

  // Apply dark mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Save snippets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('codeSnippets', JSON.stringify(snippets));
  }, [snippets]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e) => {
      // Ctrl/Cmd + N: New snippet
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setShowForm(true);
        setEditingSnippet(null);
      }
      // Ctrl/Cmd + K: Focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Escape: Close form
      if (e.key === 'Escape' && showForm) {
        handleCancelEdit();
      }
    };
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [showForm]);

  const addSnippet = (snippetData) => {
    if (editingSnippet) {
      setSnippets(prev => prev.map(s =>
        s.id === editingSnippet.id
          ? { ...snippetData, id: s.id, createdAt: s.createdAt, isFavorite: s.isFavorite }
          : s
      ));
      setEditingSnippet(null);
      setShowForm(false);
      addToast('Snippet updated successfully', 'success');
    } else {
      const newSnippet = {
        ...snippetData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        isFavorite: false
      };
      setSnippets(prev => [newSnippet, ...prev]);
      setShowForm(false);
      addToast('Snippet created successfully', 'success');
    }
  };

  const requestDeleteSnippet = (id) => {
    setConfirmModal({ isOpen: true, id });
  };

  const confirmDeleteSnippet = () => {
    setSnippets(prev => prev.filter(s => s.id !== confirmModal.id));
    setConfirmModal({ isOpen: false, id: null });
    addToast('Snippet deleted', 'info');
  };

  const toggleFavorite = (id) => {
    setSnippets(prev => prev.map(s =>
      s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
    ));
    const snippet = snippets.find(s => s.id === id);
    if (snippet) {
      addToast(snippet.isFavorite ? 'Removed from favorites' : 'Added to favorites', 'info', 2000);
    }
  };

  const duplicateSnippet = (id) => {
    const original = snippets.find(s => s.id === id);
    if (!original) return;
    const duplicate = {
      ...original,
      id: Date.now(),
      title: `${original.title} (copy)`,
      createdAt: new Date().toISOString(),
      isFavorite: false
    };
    setSnippets(prev => [duplicate, ...prev]);
    addToast('Snippet duplicated', 'success');
  };

  const exportSnippets = () => {
    const dataStr = JSON.stringify(snippets, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `snipstash-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast(`Exported ${snippets.length} snippets`, 'success');
  };

  const importSnippets = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSnippets = JSON.parse(e.target.result);
        if (Array.isArray(importedSnippets)) {
          setImportConfirm({ isOpen: true, data: importedSnippets });
        } else {
          addToast('Invalid file format', 'error');
        }
      } catch {
        addToast('Error reading file — ensure it is valid JSON', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleImportReplace = () => {
    setSnippets(importConfirm.data);
    addToast(`Replaced with ${importConfirm.data.length} snippets`, 'success');
    setImportConfirm({ isOpen: false, data: null });
  };

  const handleImportMerge = () => {
    const maxId = snippets.length > 0 ? Math.max(...snippets.map(s => s.id)) : 0;
    const newSnippets = importConfirm.data.map((s, i) => ({
      ...s,
      id: maxId + i + 1
    }));
    setSnippets(prev => [...prev, ...newSnippets]);
    addToast(`Merged ${importConfirm.data.length} snippets`, 'success');
    setImportConfirm({ isOpen: false, data: null });
  };

  const handleEdit = (snippet) => {
    setEditingSnippet(snippet);
    setShowForm(true);
  };

  // Filter snippets
  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (snippet.description && snippet.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (snippet.tags && snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesLanguage = !filterLanguage || (snippet.codeBlocks || []).some(b => b.language === filterLanguage);
    const matchesTag = !filterTag || (snippet.tags && snippet.tags.includes(filterTag));
    const matchesFavorites = !showFavoritesOnly || snippet.isFavorite;
    return matchesSearch && matchesLanguage && matchesTag && matchesFavorites;
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

  // Get unique languages and tags
  const languages = [...new Set(snippets.flatMap(s => (s.codeBlocks || []).map(b => b.language)))].sort();
  const allTags = [...new Set(snippets.flatMap(s => s.tags || []))].sort();

  // Stats
  const totalFavorites = snippets.filter(s => s.isFavorite).length;
  const totalCategories = [...new Set(snippets.map(s => s.category))].length;

  return (
    <div className="app">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Snippet"
        message="This action cannot be undone. Are you sure you want to permanently delete this snippet?"
        confirmText="Delete"
        type="danger"
        onConfirm={confirmDeleteSnippet}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
      />

      {importConfirm.isOpen && (
        <div className="modal-overlay" onClick={() => setImportConfirm({ isOpen: false, data: null })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-icon modal-icon-info">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <h3 className="modal-title">Import {importConfirm.data?.length} Snippets</h3>
            <p className="modal-message">
              How would you like to import these snippets?
            </p>
            <div className="modal-actions modal-actions-stack">
              <button className="modal-btn modal-btn-primary" onClick={handleImportMerge}>
                Merge with existing
              </button>
              <button className="modal-btn modal-btn-danger" onClick={handleImportReplace}>
                Replace all
              </button>
              <button className="modal-btn modal-btn-cancel" onClick={() => setImportConfirm({ isOpen: false, data: null })}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="app-header">
        <div className="header-inner">
          <div className="header-top">
            <div className="header-brand">
              <div className="logo">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <div>
                <h1>SnipStash</h1>
                <p className="subtitle">Your personal code snippet library</p>
              </div>
            </div>

            <div className="header-actions">
              <button
                className="theme-toggle"
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                )}
              </button>

              <div className="header-kbd-hint">
                <kbd>⌘N</kbd> new
                <kbd>⌘K</kbd> search
              </div>
            </div>
          </div>

          {snippets.length > 0 && (
            <div className="stats-bar">
              <div className="stat-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                {snippets.length} {snippets.length === 1 ? 'snippet' : 'snippets'}
              </div>
              <div className="stat-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {totalFavorites} favorites
              </div>
              <div className="stat-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                {languages.length} languages
              </div>
              <div className="stat-chip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                </svg>
                {totalCategories} categories
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="toolbar">
            <div className="toolbar-left">
              <button
                onClick={() => { setShowForm(!showForm); if (showForm) setEditingSnippet(null); }}
                className={`toggle-form-btn ${showForm ? 'active' : ''}`}
              >
                {showForm ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Close
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New Snippet
                  </>
                )}
              </button>
            </div>

            <div className="toolbar-right">
              <button
                onClick={exportSnippets}
                className="toolbar-btn"
                title="Export all snippets to JSON file"
                disabled={snippets.length === 0}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export
              </button>

              <label className="toolbar-btn" title="Import snippets from JSON file">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Import
                <input
                  ref={importInputRef}
                  type="file"
                  accept=".json"
                  onChange={importSnippets}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {showForm && (
            <SnippetForm
              onSubmit={addSnippet}
              editingSnippet={editingSnippet}
              onCancel={handleCancelEdit}
            />
          )}

          {snippets.length > 0 && (
            <div className="view-controls">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterLanguage={filterLanguage}
                onFilterChange={setFilterLanguage}
                languages={languages}
                sortBy={sortBy}
                onSortChange={setSortBy}
                filterTag={filterTag}
                onTagFilterChange={setFilterTag}
                allTags={allTags}
                showFavoritesOnly={showFavoritesOnly}
                onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
                searchInputRef={searchInputRef}
              />

              <div className="display-controls">
                <button
                  onClick={() => setGroupByCategory(!groupByCategory)}
                  className={`control-btn ${groupByCategory ? 'active' : ''}`}
                  title={groupByCategory ? 'Show flat list' : 'Group by category'}
                >
                  {groupByCategory ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`control-btn ${viewMode === 'list' ? 'active' : ''}`}
                  title="List view"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`control-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  title="Grid view"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <SnippetList
            snippets={sortedSnippets}
            onDelete={requestDeleteSnippet}
            onEdit={handleEdit}
            onToggleFavorite={toggleFavorite}
            onDuplicate={duplicateSnippet}
            viewMode={viewMode}
            groupByCategory={groupByCategory}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
