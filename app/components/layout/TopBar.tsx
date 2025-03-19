import React, { useRef, useEffect } from 'react';

interface TopBarProps {
    isSearchOpen: boolean;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onSearchToggle: () => void;
    onSearchClose: () => void;
    onMenuToggle: () => void;
    onHomeClick: () => void;
    onAddPhoto: () => void;
}

/**
 * TopBar component for the photo gallery
 *
 * @param isSearchOpen - Whether the search input is open
 * @param searchTerm - Current search term
 * @param onSearchChange - Handler for search term changes
 * @param onSearchToggle - Handler for toggling search input visibility
 * @param onSearchClose - Handler for closing search input
 * @param onMenuToggle - Handler for toggling sidebar menu (mobile)
 * @param onHomeClick - Handler for clicking the home/title button
 * @param onAddPhoto - Handler for clicking the add photo button
 */
export default function TopBar({
    isSearchOpen,
    searchTerm,
    onSearchChange,
    onSearchToggle,
    onSearchClose,
    onMenuToggle,
    onHomeClick,
    onAddPhoto,
}: TopBarProps) {
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Focus search input when opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    return (
        <div className="fixed top-0 left-0 right-0 h-14 bg-[#1d1d1f]/90 backdrop-blur-xl z-40 flex items-center justify-between px-4 md:px-6 font-['SF Pro Display', 'Inter', 'system-ui', 'sans-serif']">
            <div className="flex items-center space-x-4">
                <button
                    onClick={onMenuToggle}
                    className="p-2 hover:bg-gray-700/50 rounded-full transition-colors md:hidden"
                    title="Toggle menu"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
                {!isSearchOpen && (
                    <button
                        onClick={onHomeClick}
                        className="text-lg font-medium tracking-tight hover:text-white transition"
                    >
                        Photo Gallery
                    </button>
                )}
            </div>
            <div className={`flex items-center ${isSearchOpen ? 'w-full' : ''}`}>
                <div className={`relative ${isSearchOpen ? 'w-full' : ''}`}>
                    {isSearchOpen && (
                        <div className="absolute inset-0 flex items-center bg-gray-800/80 backdrop-blur-sm rounded-full overflow-hidden pr-1 w-full">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder="Search photos..."
                                className="py-2 px-4 bg-transparent text-sm w-full focus:outline-none"
                                onBlur={() => {
                                    if (!searchTerm) onSearchClose();
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        onSearchChange('');
                                        onSearchClose();
                                    }
                                }}
                            />

                            {searchTerm && (
                                <button
                                    onClick={() => {
                                        onSearchChange('');
                                        searchInputRef.current?.focus();
                                    }}
                                    className="p-1 hover:bg-gray-700/50 rounded-full"
                                >
                                    <svg
                                        className="w-5 h-5"
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
                            )}
                        </div>
                    )}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={onSearchToggle}
                            className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
                            title="Search photos"
                        >
                            <svg
                                className="w-5 h-5"
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

                        {/* Add photo button */}
                        <button
                            onClick={onAddPhoto}
                            className="p-2 hover:bg-gray-700/50 rounded-full transition-colors ml-1"
                            title="Add Photo"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
