import React, { FC, useRef, useEffect } from 'react';

interface SearchInputProps {
    isOpen: boolean;
    value: string;
    onChange: (value: string) => void;
    onClose: () => void;
    placeholder?: string;
}

/**
 * Reusable search input component with expand/collapse animation
 * Includes clear button and keyboard shortcuts
 */
const SearchInput: FC<SearchInputProps> = ({
    isOpen,
    value,
    onChange,
    onClose,
    placeholder = 'Search...',
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Clear search and maintain focus
    const handleClear = () => {
        onChange('');
        inputRef.current?.focus();
    };

    // Handle escape key for closing
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onChange('');
            onClose();
        }
    };

    // Close on blur if empty
    const handleBlur = () => {
        if (!value) onClose();
    };

    return (
        <div className={`relative ${isOpen ? 'w-full' : ''}`}>
            {isOpen && (
                <div className="absolute inset-0 flex items-center bg-gray-800/80 backdrop-blur-sm rounded-full overflow-hidden pr-1 w-full">
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="py-2 px-4 bg-transparent text-sm w-full focus:outline-none"
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                    />

                    {value && (
                        <button
                            onClick={handleClear}
                            className="p-1 hover:bg-gray-700/50 rounded-full"
                            aria-label="Clear search"
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
        </div>
    );
};

export default SearchInput;
