import React from 'react';
import { Album, Tag, Photo } from '@/app/types';

interface SidebarProps {
    albums: Album[];
    tags: Tag[];
    photos: Photo[];
    selectedAlbum: string;
    selectedTag: string | null;
    onAlbumSelect: (albumId: string) => void;
    onTagSelect: (tagId: string | null) => void;
    onCreateAlbum: () => void;
    onCreateTag: () => void;
    onEditTag: (tag: Tag) => void;
    onDeleteAlbum: (albumId: string) => void;
    onDeleteTag: (tagId: string) => void;
    isOpen: boolean;
    className?: string;
}

/**
 * Sidebar component for the photo gallery
 *
 * @param albums - Array of albums to display
 * @param tags - Array of tags to display
 * @param photos - Array of photos to count tags
 * @param selectedAlbum - Currently selected album ID
 * @param selectedTag - Currently selected tag ID
 * @param onAlbumSelect - Handler for selecting an album
 * @param onTagSelect - Handler for selecting a tag
 * @param onCreateAlbum - Handler for creating a new album
 * @param onCreateTag - Handler for creating a new tag
 * @param onEditTag - Handler for editing a tag
 * @param onDeleteAlbum - Handler for deleting an album
 * @param onDeleteTag - Handler for deleting a tag
 * @param isOpen - Whether the sidebar is open (for mobile)
 * @param className - Additional CSS classes
 */
export default function Sidebar({
    albums,
    tags,
    photos,
    selectedAlbum,
    selectedTag,
    onAlbumSelect,
    onTagSelect,
    onCreateAlbum,
    onCreateTag,
    onEditTag,
    onDeleteAlbum,
    onDeleteTag,
    isOpen,
    className = '',
}: SidebarProps) {
    return (
        <nav
            className={`
        fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-60 bg-[#2d2d2f]/95 text-gray-100
        transform transition-transform duration-300 ease-in-out backdrop-blur-xl
        border-r border-gray-800/50 z-30 overflow-hidden flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        ${className}
      `}
        >
            <div className="flex flex-col h-full font-['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'] overflow-y-auto">
                <div className="p-4 flex flex-col h-full">
                    {/* Albums Section */}
                    <div className="flex-1 min-h-0 mb-4">
                        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 flex justify-between items-center">
                            <span>Albums</span>
                            <button
                                onClick={onCreateAlbum}
                                className="text-gray-400 hover:text-white p-0.5 rounded-full hover:bg-gray-700/30"
                                title="Create new album"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </button>
                        </h2>

                        <ul className="space-y-1 overflow-y-auto pr-2 h-[calc(100%-28px)]">
                            {albums.map((album) => (
                                <li key={album.id} className="group flex items-center">
                                    <button
                                        onClick={() => onAlbumSelect(album.id)}
                                        className={`w-full text-left py-1.5 px-3 rounded-lg transition-all duration-300 text-sm
                                            ${
                                                selectedAlbum === album.id
                                                    ? 'bg-gray-700/50 shadow-lg'
                                                    : 'hover:bg-gray-700/30'
                                            }`}
                                    >
                                        <span className="font-medium">{album.name}</span>
                                    </button>
                                    {album.id !== 'all' && (
                                        <button
                                            onClick={() => onDeleteAlbum(album.id)}
                                            className="p-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
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
                            ))}
                        </ul>
                    </div>

                    {/* Tags Section */}
                    <div className="flex-1 min-h-0">
                        <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 flex justify-between items-center">
                            <span>Tags</span>
                            <button
                                onClick={onCreateTag}
                                className="text-gray-400 hover:text-white p-0.5 rounded-full hover:bg-gray-700/30"
                                title="Create new tag"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            </button>
                        </h2>

                        <ul className="space-y-1 overflow-y-auto pr-2 h-[calc(100%-28px)]">
                            {tags.map((tag) => (
                                <li key={tag.id} className="group flex items-center">
                                    <button
                                        onClick={() =>
                                            onTagSelect(tag.id === selectedTag ? null : tag.id)
                                        }
                                        className={`w-full text-left py-1.5 px-3 rounded-lg transition-all duration-300 hover:bg-gray-700/30 flex items-center space-x-2 text-sm
                                            ${selectedTag === tag.id ? 'bg-gray-700/50 shadow-lg' : ''}
                                        `}
                                    >
                                        <span
                                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: tag.color }}
                                        />

                                        <span className="font-medium truncate">{tag.name}</span>
                                        <span className="ml-auto text-xs text-gray-400">
                                            {
                                                photos.filter(
                                                    (p: Photo) => p.tags && p.tags.includes(tag.id),
                                                ).length
                                            }
                                        </span>
                                    </button>
                                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEditTag(tag)}
                                            className="p-1 text-gray-400 hover:text-white"
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
                                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onDeleteTag(tag.id)}
                                            className="p-1 text-gray-400 hover:text-white"
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
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}
