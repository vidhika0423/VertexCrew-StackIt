import React from 'react';
import styles from './FilterBar.module.css';

const FilterBar = ({ filters, onFilterChange }) => {
  const timeOptions = [
    { value: 'all', label: 'All time' },
    { value: '24h', label: 'Last 24 hours' },
    { value: 'week', label: 'Last week' },
    { value: 'month', label: 'Last month' },
    { value: 'year', label: 'Last year' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'most_voted', label: 'Most voted' },
    { value: 'least_voted', label: 'Least voted' }
  ];

  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      ...filters,
      [filterType]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      timeFilter: 'all',
      sortBy: 'newest',
      unansweredOnly: false
    });
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Time:</label>
        <select
          value={filters.timeFilter}
          onChange={(e) => handleFilterChange('timeFilter', e.target.value)}
          className={styles.filterSelect}
        >
          {timeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Sort by:</label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className={styles.filterSelect}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterCheckbox}>
          <input
            type="checkbox"
            checked={filters.unansweredOnly}
            onChange={(e) => handleFilterChange('unansweredOnly', e.target.checked)}
            className={styles.checkbox}
          />
          <span className={styles.checkboxLabel}>Unanswered only</span>
        </label>
      </div>

      <button
        onClick={clearFilters}
        className={styles.clearButton}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterBar; 