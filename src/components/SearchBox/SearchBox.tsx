import React, { useState } from 'react';
import css from './SearchBox.module.css';

interface SearchBoxProps {
  globalSearch?: string;
  onSearchChange: (value: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ globalSearch = '', onSearchChange }) => {
  const [localValue, setLocalValue] = useState(globalSearch);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setLocalValue(value);
    onSearchChange(value);
  };

  return (
    <input
      key={globalSearch}
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={localValue}
      onChange={handleChange}
    />
  );
};