import { useState, FC, useRef, useEffect } from 'react';
import { Photo, Tag, Album } from '@/app/types';

interface PhotoDetailModalProps {
    photo: Photo;
    onClose: () => void;
    onNavigate: (direction: 'prev' | 'next') => void;
    albums: Album[];
    tags: Tag[];
    onAlbumChange: (photoId: number, albumId: string) => void;
    onTagsEdit: (photo: Photo) => void;
    onShare: (url: string) => void;
    onPhotoUpdate?: (photo: Photo) => void;
}

/**
 * Modal component for displaying detailed photo information
 * Includes full-size photo view, metadata, and action buttons for navigation and editing
 */
const PhotoDetailModal: FC<PhotoDetailModalProps> = ({
    photo,
    onClose,
    onNavigate,
    albums,
    tags,
    onAlbumChange,
    onTagsEdit,
    onShare,
    onPhotoUpdate,
}) => {
    const [isAlbumDropdownOpen, setIsAlbumDropdownOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(photo.title);
    const [editedDescription, setEditedDescription] = useState(photo.description || '');

    const titleInputRef = useRef<HTMLInputElement>(null);

    // Update local state when photo prop changes
    useEffect(() => {
        setEditedTitle(photo.title);
        setEditedDescription(photo.description || '');
    }, [photo]);

    // Focus title input when entering edit mode
    useEffect(() => {
        if (isEditing && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isEditing]);

    // Format date string for display
    const formattedDate = new Date(photo.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleAlbumChange = (albumId: string) => {
        onAlbumChange(photo.id, albumId);
        setIsAlbumDropdownOpen(false);
    };

    const handleSaveChanges = () => {
        if (
            onPhotoUpdate &&
            (editedTitle !== photo.title || editedDescription !== photo.description)
        ) {
            onPhotoUpdate({
                ...photo,
                title: editedTitle,
                description: editedDescription,
            });
        }
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditedTitle(photo.title);
        setEditedDescription(photo.description || '');
        setIsEditing(false);
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-8 modal-backdrop-animation"
            onClick={onClose}
        >
            <div
                className="relative max-w-6xl w-full max-h-[90vh] overflow-hidden modal-animation"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Place buttons in top-right of the modal window, but outside the content area */}
                <div className="absolute top-0 right-0 z-50 flex gap-2 p-4 bg-gradient-to-l from-black/60 to-transparent">
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                            title="Edit Title and Description"
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
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                            </svg>
                        </button>
                    )}
                    <button
                        className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                        onClick={onClose}
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
                </div>

                <div className="flex flex-col md:flex-row bg-[#1d1d1f] rounded-xl overflow-hidden">
                    <div className="md:w-3/4 relative">
                        <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-auto max-h-[80vh] object-contain"
                        />

                        {/* Navigation arrows */}
                        <button
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onNavigate('prev');
                            }}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <button
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onNavigate('next');
                            }}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="p-6 md:w-1/4 flex flex-col max-h-[80vh] overflow-y-auto">
                        <div className="flex-grow">
                            {isEditing ? (
                                <>
                                    <input
                                        ref={titleInputRef}
                                        type="text"
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                        className="text-2xl font-medium mb-2 text-gray-100 w-full bg-[#2d2d2f] rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter title"
                                    />

                                    <p className="text-gray-400 mb-4">{formattedDate}</p>
                                    <textarea
                                        value={editedDescription}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                        className="text-gray-300 mb-4 w-full bg-[#2d2d2f] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                        placeholder="Enter description"
                                    />

                                    <div className="flex space-x-2 mb-4">
                                        <button
                                            onClick={handleSaveChanges}
                                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col">
                                    <h2 className="text-2xl font-medium text-gray-100 mb-2 break-words">
                                        {photo.title}
                                    </h2>
                                    <p className="text-gray-400 mb-4">{formattedDate}</p>
                                    <p className="text-gray-300 mb-4 break-words">
                                        {photo.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-auto">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-2">
                                    <button className="text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
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
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onShare(photo.url);
                                        }}
                                        className="text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
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
                                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="relative group">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsAlbumDropdownOpen(!isAlbumDropdownOpen);
                                            }}
                                            className="text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                                            title="Change Album"
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
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </button>

                                        {isAlbumDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-[#2d2d2f] rounded-lg shadow-lg z-50 overflow-hidden">
                                                {albums.map((album) => (
                                                    <button
                                                        key={album.id}
                                                        onClick={() => handleAlbumChange(album.id)}
                                                        className={`block w-full text-left px-4 py-2 transition-colors hover:bg-gray-700 ${
                                                            photo.album === album.id
                                                                ? 'bg-gray-700'
                                                                : ''
                                                        }`}
                                                    >
                                                        {album.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => onTagsEdit(photo)}
                                        className="text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                                        title="Edit Tags"
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
                                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 text-gray-400 text-sm">Album</div>
                                <div className="mb-4 text-white">
                                    {albums.find((a) => a.id === photo.album)?.name || photo.album}
                                </div>

                                {photo.tags && photo.tags.length > 0 && (
                                    <>
                                        <div className="mb-2 text-gray-400 text-sm">Tags</div>
                                        <div className="flex flex-wrap gap-2">
                                            {photo.tags.map((tagId) => {
                                                const tag = tags.find((t) => t.id === tagId);
                                                if (!tag) return null;

                                                return (
                                                    <div
                                                        key={tag.id}
                                                        className="px-3 py-1 rounded-full text-sm"
                                                        style={{
                                                            backgroundColor: `${tag.color}30`,
                                                            color: tag.color,
                                                        }}
                                                    >
                                                        {tag.name}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoDetailModal;
