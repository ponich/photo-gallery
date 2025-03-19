import { FC } from 'react';
import { Photo, Album } from '@/app/types';

interface ActionButtonsProps {
    photo: Photo;
    albums: Album[];
    isVisible: boolean;
    onShare: () => void;
    onAlbumChange: (albumId: string) => void;
    onTagsEdit: () => void;
    isAlbumDropdownOpen: boolean;
    setIsAlbumDropdownOpen: (isOpen: boolean) => void;
}

/**
 * Component for photo action buttons (like, share, album, tags)
 */
export const ActionButtons: FC<ActionButtonsProps> = ({
    photo,
    albums,
    isVisible,
    onShare,
    onAlbumChange,
    onTagsEdit,
    isAlbumDropdownOpen,
    setIsAlbumDropdownOpen,
}) => {
    return (
        <div
            className={`grid grid-cols-4 gap-2 mb-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <button
                className="flex justify-center items-center text-gray-700 dark:text-foreground bg-gray-100 dark:bg-button/10 p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-button/20 transition-colors"
                title="Like Photo"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
            </button>
            <button
                onClick={onShare}
                className="flex justify-center items-center text-gray-700 dark:text-foreground bg-gray-100 dark:bg-button/10 p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-button/20 transition-colors"
                title="Share Photo"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                </svg>
            </button>
            <div className="relative">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsAlbumDropdownOpen(!isAlbumDropdownOpen);
                    }}
                    className="flex justify-center items-center w-full text-gray-700 dark:text-foreground bg-gray-100 dark:bg-button/10 p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-button/20 transition-colors"
                    title="Move to Album"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </button>

                {isAlbumDropdownOpen && (
                    <div className="absolute bottom-full mb-2 right-0 w-48 bg-white dark:bg-modal rounded-lg shadow-lg z-[150] overflow-y-auto max-h-60 border border-gray-200 dark:border-border">
                        {albums.map((album) => (
                            <button
                                key={album.id}
                                onClick={() => onAlbumChange(album.id)}
                                className={`block w-full text-left px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-button/10 ${
                                    photo.album === album.id
                                        ? 'bg-blue-500/20 text-blue-500'
                                        : 'text-gray-700 dark:text-foreground'
                                }`}
                            >
                                {album.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <button
                onClick={onTagsEdit}
                className="flex justify-center items-center text-gray-700 dark:text-foreground bg-gray-100 dark:bg-button/10 p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-button/20 transition-colors"
                title="Edit Tags"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                </svg>
            </button>
        </div>
    );
};

export default ActionButtons;
