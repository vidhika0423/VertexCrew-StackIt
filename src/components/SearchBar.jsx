import React, { useState } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch, placeholder = "Search questions..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.searchInputWrapper}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className={styles.clearButton}
            >
              ×
            </button>
          )}
        </div>
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar; 