function SearchBar({ searchTerm, onSearchChange, filterLanguage, onFilterChange, languages, sortBy, onSortChange }) {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search snippets by title or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>
      
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

      <div className="filter-wrapper">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="filter-select"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="alphabetical">A-Z</option>
        </select>
      </div>
    </div>
  );
}

export default SearchBar;
