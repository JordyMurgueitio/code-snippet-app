function SearchBar({ searchTerm, onSearchChange, filterLanguage, onFilterChange, languages }) {
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
    </div>
  );
}

export default SearchBar;
