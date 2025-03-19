import { Album } from '@/app/types';
import React from 'react';
import { cn } from '@/app/lib/utils';

export interface AlbumItemProps {
    album: Album;
    isSelected: boolean;
    onSelect: () => void;
    onDelete?: () => void;
    showDelete?: boolean;
    className?: string;
}

/**
 * AlbumItem component for displaying an album in the sidebar
 *
 * @param album - Album object to display
 * @param isSelected - Whether the album is currently selected
 * @param onSelect - Handler for selecting the album
 * @param onDelete - Handler for delete action
 * @param showDelete - Whether to show delete button
 * @param className - Additional CSS classes
 */
export const AlbumItem = React.forwardRef<HTMLLIElement, AlbumItemProps>(
    ({ album, isSelected, onSelect, onDelete, showDelete = true, className }, ref) => {
        return (
            <li ref={ref} className={cn('group flex items-center', className)}>
                <button
                    onClick={onSelect}
                    className={cn(
                        'w-full text-left py-1.5 px-3 rounded-lg transition-all duration-300 text-sm',
                        isSelected ? 'bg-gray-700/50 shadow-lg' : 'hover:bg-gray-700/30',
                    )}
                >
                    <span className="font-medium">{album.name}</span>
                </button>
                {showDelete && album.id !== 'all' && (
                    <button
                        onClick={onDelete}
                        className="p-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete album"
                    >
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                )}
            </li>
        );
    },
);

AlbumItem.displayName = 'AlbumItem';
