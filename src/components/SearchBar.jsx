function SearchBar({
  searchTerm,
  onSearchChange,
  filterLanguage,
  onFilterChange,
  languages,
  sortBy,
  onSortChange,
  filterTag,
  onTagFilterChange,
  allTags,
  showFavoritesOnly,
  onToggleFavorites,
  searchInputRef
}) {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search snippets..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button className="search-clear" onClick={() => onSearchChange('')} aria-label="Clear search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <div className="search-filters">
        <button
          onClick={onToggleFavorites}
          className={`filter-btn favorites-filter ${showFavoritesOnly ? 'active' : ''}`}
          title={showFavoritesOnly ? 'Show all' : 'Show favorites only'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={showFavoritesOnly ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>

        <div className="filter-wrapper">
          <select
            value={filterLanguage}
            onChange={(e) => onFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        {allTags && allTags.length > 0 && (
          <div className="filter-wrapper">
            <select
              value={filterTag}
              onChange={(e) => onTagFilterChange(e.target.value)}
              className="filter-select"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        )}

        <div className="filter-wrapper">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">A — Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
