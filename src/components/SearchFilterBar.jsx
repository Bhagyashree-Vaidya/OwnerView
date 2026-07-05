import React, { useState } from 'react';
import './SearchFilterBar.css';

const SearchFilterBar = ({
  onSearch,
  onDateClick,
  onFilterClick,
  onStatusChange,
  buttonText = 'Action',
  onButtonClick,
  statusOptions = [],
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [status, setStatus] = useState('');

  const handleSearch = (e) => {
    setSearchVal(e.target.value);
    onSearch && onSearch(e.target.value);
  };

  const handleStatus = (e) => {
    setStatus(e.target.value);
    onStatusChange && onStatusChange(e.target.value);
  };

  return (
    <div className="sfbar">
      {/* Search */}
      <div className="sfbar__search-wrap">
        <svg className="sfbar__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          className="sfbar__search"
          placeholder="Search..."
          value={searchVal}
          onChange={handleSearch}
        />
        {searchVal && (
          <button className="sfbar__clear" onClick={() => { setSearchVal(''); onSearch && onSearch(''); }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Status filter */}
      {statusOptions.length > 0 && (
        <select className="sfbar__select form-select" value={status} onChange={handleStatus}>
          <option value="">All Status</option>
          {statusOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )}

      {/* Date button */}
      <button className="btn btn-ghost sfbar__icon-btn" onClick={onDateClick} title="Filter by date">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span>Date</span>
      </button>

      {/* Main action button */}
      <button className="btn btn-primary sfbar__action" onClick={onButtonClick}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        {buttonText}
      </button>
    </div>
  );
};

export default SearchFilterBar;