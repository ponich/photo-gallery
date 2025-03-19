import React, { FC, useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isOpen: boolean;
    onToggle: () => void;
}

/**
 * Search bar component with collapsible input and debounced search functionality
 */
const SearchBar: FC<SearchBarProps> = ({ onSearch, isOpen, onToggle }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    return (
        <div className="relative flex items-center">
            {isOpen ? (
                <div className="absolute right-0 top-0 flex items-center w-[300px] md:w-[400px] lg:w-[500px] animate-in slide-in-from-right-8">
                    <input
                        type="search"
                        className="w-full rounded-full bg-button/10 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search photos..."
                        value={searchQuery}
                        onChange={handleSearch}
                        autoFocus
                    />
                    <button
                        onClick={onToggle}
                        className="absolute right-2 p-2 hover:bg-button/20 rounded-full transition-colors"
                    >
                        <svg
                            className="w-4 h-4 text-foreground/60"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            ) : (
                <button
                    onClick={onToggle}
                    className="p-2.5 rounded-full bg-button/10 hover:bg-button/20 transition-colors"
                    title="Search"
                >
                    <svg
                        className="w-5 h-5 text-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SearchBar;
