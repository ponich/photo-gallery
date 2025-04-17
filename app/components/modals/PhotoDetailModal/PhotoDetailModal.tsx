import { useState, FC, useEffect, useCallback } from 'react';
import { Photo, Tag, Album } from '@/app/types';

// Import sub-components
import { PhotoImage } from './PhotoImage';
import { PhotoInfo } from './PhotoInfo';
import { PhotoEditor } from './PhotoEditor';
import { ActionButtons } from './ActionButtons';
import { TagDisplay } from './TagDisplay';
import { AlbumInfo } from './AlbumInfo';

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
    isTagModalOpen?: boolean;
    closeTagModal?: () => void;
    isShareModalOpen?: boolean;
    closeShareModal?: () => void;
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
    isTagModalOpen,
    closeTagModal,
    isShareModalOpen,
    closeShareModal,
}) => {
    const [isAlbumDropdownOpen, setIsAlbumDropdownOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);

    // Close album dropdown when navigating or photo changes
    useEffect(() => {
        setIsAlbumDropdownOpen(false);
        setIsEditing(false); // Close edit mode when changing photos
    }, [photo.id]); // Close dropdowns whenever photo changes

    // Handle ESC key to close edit mode instead of modal
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isEditing) {
                    e.stopPropagation(); // Prevent modal from closing
                    setIsEditing(false);
                } else if (isAlbumDropdownOpen) {
                    e.stopPropagation(); // Prevent modal from closing
                    setIsAlbumDropdownOpen(false);
                }
            }
        },
        [isEditing, isAlbumDropdownOpen],
    );

    // Add and remove keyboard event listener
    useEffect(() => {
        if (isEditing || isAlbumDropdownOpen) {
            document.addEventListener('keydown', handleKeyDown, true); // true for capturing phase
            return () => document.removeEventListener('keydown', handleKeyDown, true);
        }
    }, [isEditing, isAlbumDropdownOpen, handleKeyDown]);

    // Close dropdown on click outside
    useEffect(() => {
        if (isAlbumDropdownOpen) {
            const handleClickOutside = () => {
                setIsAlbumDropdownOpen(false);
            };

            setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
            }, 0);

            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isAlbumDropdownOpen]);

    // Handle navigation with proper modal cleanup
    const handleNavigate = (direction: 'prev' | 'next') => {
        // Close any open modals before navigation
        if (isTagModalOpen && closeTagModal) {
            closeTagModal();
        }
        if (isShareModalOpen && closeShareModal) {
            closeShareModal();
        }
        setIsAlbumDropdownOpen(false);
        setIsEditing(false);
        onNavigate(direction);
    };

    const handleSaveChanges = (updatedPhoto: Photo) => {
        if (onPhotoUpdate) {
            onPhotoUpdate(updatedPhoto);
        }
        setIsEditing(false);
    };

    const handleAlbumChange = (albumId: string) => {
        onAlbumChange(photo.id, albumId);
        setIsAlbumDropdownOpen(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-8">
            <div className="relative bg-background rounded-xl shadow-lg w-[90vw] h-[85vh] flex overflow-hidden">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-background/50 hover:bg-accent/20 transition-all backdrop-blur-sm z-10"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Main content area */}
                <div className="flex-1 relative flex items-center justify-center">
                    <PhotoImage photo={photo} onNavigate={handleNavigate} />
                </div>

                {/* Right sidebar */}
                <div
                    className="w-[320px] flex-shrink-0 bg-accent/5"
                    onMouseEnter={() => setIsSidebarHovered(true)}
                    onMouseLeave={() => setIsSidebarHovered(false)}
                >
                    <div className="h-full flex flex-col p-6">
                        {/* Edit button */}
                        <div className="absolute top-4 right-16 z-10">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="p-2 rounded-full bg-background/50 hover:bg-accent/20 transition-all backdrop-blur-sm"
                                title={isEditing ? 'Cancel editing' : 'Edit photo details'}
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
                        </div>

                        {/* Photo info section */}
                        <div className="flex-1 min-h-0 overflow-y-auto">
                            <div className="min-h-[200px]">
                                {isEditing ? (
                                    <div className="space-y-6">
                                        <PhotoEditor
                                            photo={photo}
                                            onSave={(updatedPhoto) => {
                                                onPhotoUpdate?.(updatedPhoto);
                                                setIsEditing(false);
                                            }}
                                            onCancel={() => setIsEditing(false)}
                                        />
                                    </div>
                                ) : (
                                    <PhotoInfo photo={photo} />
                                )}
                            </div>
                        </div>

                        {/* Fixed bottom section */}
                        <div className="flex-shrink-0 pt-6">
                            {/* Action buttons */}
                            <ActionButtons
                                photo={photo}
                                albums={albums}
                                isVisible={true}
                                onShare={() => onShare(photo.url)}
                                onAlbumChange={handleAlbumChange}
                                onTagsEdit={() => onTagsEdit(photo)}
                                isAlbumDropdownOpen={isAlbumDropdownOpen}
                                setIsAlbumDropdownOpen={setIsAlbumDropdownOpen}
                            />

                            <div className="mt-6 space-y-6">
                                <AlbumInfo photo={photo} albums={albums} />
                                <TagDisplay photo={photo} tags={tags} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoDetailModal;
