import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Where do you want to live?', onSearch, className = '' }) => {
  const [query, setQuery] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form onSubmit={submit} className={`flex items-center bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
      <div className="px-3 text-slate-500">
        <Search className="h-5 w-5" />
      </div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-3 outline-none"
      />
      <button type="submit" className="bg-slate-900 text-white px-4 py-3 hover:bg-slate-800 transition-colors">Search</button>
    </form>
  );
};

export default SearchBar;
