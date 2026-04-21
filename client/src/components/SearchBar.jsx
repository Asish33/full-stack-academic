import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative">
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
      <input
        type="text"
        placeholder="Search by title, subject, or subject code..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field pl-11 pr-10 text-sm"
        id="search-notes"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors p-1 rounded"
        >
          <FiX size={15} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
