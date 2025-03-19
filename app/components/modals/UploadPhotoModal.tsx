import { FC, useState, useRef, useEffect } from 'react';
import { Photo, Album, Tag } from '@/app/types';

interface UploadPhotoModalProps {
    onClose: () => void;
    onUpload: (photos: Photo[]) => void;
    onAddFiles: () => void;
    onEditTags: (photo: Photo) => void;
    uploadedImages: string[];
    albums: Album[];
    tags: Tag[];
    onRemoveImage?: (index: number) => void;
    onCreateAlbum?: () => void;
    photoMetadata?: PhotoMetadata[];
    updatePhotoMetadata?: (
        index: number,
        field: keyof PhotoMetadata,
        value: string | string[],
    ) => void;
}

interface PhotoMetadata {
    title: string;
    description: string;
    tags: string[];
}

/**
 * Modal component for uploading photos with metadata
 * Supports multiple photos, tag selection, and album assignment
 */
const UploadPhotoModal: FC<UploadPhotoModalProps> = ({
    onClose,
    onUpload,
    onAddFiles,
    onEditTags,
    uploadedImages,
    albums,
    tags,
    onRemoveImage,
    onCreateAlbum,
    photoMetadata = [],
    updatePhotoMetadata,
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [sharedMetadata, setSharedMetadata] = useState({
        album: 'nature',
        date: new Date().toISOString().split('T')[0],
        orientation: 'landscape',
    });

    // Store individual metadata for each photo if not provided through props
    const [localPhotoMetadata, setLocalPhotoMetadata] = useState<PhotoMetadata[]>(() =>
        uploadedImages.map(() => ({
            title: '',
            description: '',
            tags: [],
        })),
    );

    // Use provided photoMetadata or fall back to local state
    const effectivePhotoMetadata = photoMetadata.length > 0 ? photoMetadata : localPhotoMetadata;

    const titleInputRef = useRef<HTMLInputElement>(null);

    // Focus the title input when the modal opens
    useEffect(() => {
        if (titleInputRef.current) {
            setTimeout(() => {
                titleInputRef.current?.focus();
            }, 100);
        }
    }, []);

    // Update metadata arrays when images are added or removed (only for local state)
    useEffect(() => {
        if (photoMetadata.length === 0) {
            setLocalPhotoMetadata((prev) => {
                // If we have more images than metadata entries, add new entries
                if (uploadedImages.length > prev.length) {
                    const newEntries = Array(uploadedImages.length - prev.length)
                        .fill(0)
                        .map(() => ({
                            title: '',
                            description: '',
                            tags: [],
                        }));
                    return [...prev, ...newEntries];
                }
                // If we have fewer images than metadata entries, truncate the array
                else if (uploadedImages.length < prev.length) {
                    return prev.slice(0, uploadedImages.length);
                }
                return prev;
            });
        }
    }, [uploadedImages.length, photoMetadata.length]);

    // Update when default album is changed externally, e.g. when a new album is created
    useEffect(() => {
        if (albums.length > 0) {
            // If the current album doesn't exist anymore (e.g. was deleted), reset to first album
            const albumExists = albums.some((a) => a.id === sharedMetadata.album);
            if (!albumExists && albums.length > 0) {
                setSharedMetadata((prev) => ({
                    ...prev,
                    album: albums[0].id,
                }));
            }

            // If a new album was just added (it's the last one in the list), select it
            const lastAlbum = albums[albums.length - 1];
            if (lastAlbum && albums.length > 1) {
                const prevAlbumIds = albums.slice(0, -1).map((a) => a.id);
                const isNewAlbum = !prevAlbumIds.includes(lastAlbum.id);

                if (isNewAlbum) {
                    setSharedMetadata((prev) => ({
                        ...prev,
                        album: lastAlbum.id,
                    }));
                }
            }
        }
    }, [albums, sharedMetadata.album]);

    const removeImage = (index: number) => {
        if (onRemoveImage) {
            onRemoveImage(index);

            if (currentImageIndex >= uploadedImages.length - 1) {
                setCurrentImageIndex(Math.max(0, currentImageIndex - 1));
            }
        }
    };

    const handlePrevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        } else {
            setCurrentImageIndex(uploadedImages.length - 1);
        }
    };

    const handleNextImage = () => {
        if (currentImageIndex < uploadedImages.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        } else {
            setCurrentImageIndex(0);
        }
    };

    // Update current photo's metadata
    const updateCurrentPhotoMetadata = (field: keyof PhotoMetadata, value: string | string[]) => {
        if (updatePhotoMetadata) {
            updatePhotoMetadata(currentImageIndex, field, value);
        } else {
            setLocalPhotoMetadata((prev) => {
                const updated = [...prev];
                updated[currentImageIndex] = {
                    ...updated[currentImageIndex],
                    [field]: value,
                };
                return updated;
            });
        }
    };

    // Handle photo upload with metadata
    const handleUpload = () => {
        if (uploadedImages.length > 0) {
            const photos: Photo[] = uploadedImages.map((imageUrl, index) => {
                const metadata = effectivePhotoMetadata[index] || {
                    title: '',
                    description: '',
                    tags: [],
                };

                return {
                    id: Date.now() + index, // Generate unique ID
                    url: imageUrl,
                    title: metadata.title || `Photo ${index + 1}`, // Default title if empty
                    description: metadata.description,
                    album: sharedMetadata.album,
                    date: sharedMetadata.date,
                    orientation: sharedMetadata.orientation,
                    tags: metadata.tags,
                } as unknown as Photo;
            });

            onUpload(photos);
        }
    };

    // Get current photo metadata
    const currentMetadata = effectivePhotoMetadata[currentImageIndex] || {
        title: '',
        description: '',
        tags: [],
    };

    // Handle tag editing for the current photo
    const handleEditTags = () => {
        const tempPhoto: Photo = {
            createdAt: sharedMetadata.date,
            id: currentImageIndex,
            url: uploadedImages[currentImageIndex] || '',
            title: currentMetadata.title,
            description: currentMetadata.description,
            album: sharedMetadata.album,
            date: sharedMetadata.date,
            orientation: sharedMetadata.orientation,
            tags: currentMetadata.tags,
        };

        onEditTags(tempPhoto);
    };

    // Handle when tags are updated from tag modal
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (uploadedImages.length <= 1) return;

            if (event.key === 'ArrowLeft') {
                handlePrevImage();
            } else if (event.key === 'ArrowRight') {
                handleNextImage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [uploadedImages.length]);

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 md:p-8"
            onClick={onClose}
        >
            <div
                className="relative max-w-7xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    onClick={onClose}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <div className="flex flex-col md:flex-row bg-[#1d1d1f] rounded-xl overflow-hidden">
                    <div className="md:w-3/5 relative flex flex-col bg-[#141414] min-h-[300px] md:min-h-[500px]">
                        {uploadedImages.length > 0 ? (
                            <>
                                <div className="relative flex-grow flex items-center justify-center">
                                    <img
                                        src={uploadedImages[currentImageIndex]}
                                        alt={`Upload preview ${currentImageIndex + 1}`}
                                        className="w-full h-auto max-h-[70vh] object-contain"
                                    />

                                    {/* Image navigation */}
                                    {uploadedImages.length > 1 && (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePrevImage();
                                                }}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors z-10"
                                                disabled={uploadedImages.length <= 1}
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleNextImage();
                                                }}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors z-10"
                                                disabled={uploadedImages.length <= 1}
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
                                        </>
                                    )}
                                </div>

                                {/* Thumbnail navigation */}
                                {uploadedImages.length > 1 && (
                                    <div className="flex overflow-x-auto gap-2 p-2 bg-[#0a0a0a]">
                                        {uploadedImages.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className={`relative flex-shrink-0 ${
                                                    currentImageIndex === idx
                                                        ? 'ring-2 ring-blue-500'
                                                        : ''
                                                }`}
                                                onClick={() => setCurrentImageIndex(idx)}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Thumbnail ${idx + 1}`}
                                                    className="h-16 w-16 object-cover rounded"
                                                />

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage(idx);
                                                    }}
                                                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                                                >
                                                    <svg
                                                        className="w-3 h-3"
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
                                        ))}

                                        {/* Add more button */}
                                        <div
                                            className="h-16 w-16 flex-shrink-0 flex items-center justify-center bg-[#2d2d2f] rounded cursor-pointer hover:bg-[#3d3d3f]"
                                            onClick={onAddFiles}
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
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <svg
                                        className="w-24 h-24 mx-auto text-gray-600 mb-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                        />
                                    </svg>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAddFiles();
                                        }}
                                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-colors rounded-lg"
                                    >
                                        Add Images
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="md:w-2/5 p-6 overflow-y-auto max-h-[90vh] md:max-h-none">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-medium text-gray-100">Add New Photos</h2>
                            <span className="text-sm text-gray-400 mr-8">
                                {uploadedImages.length} image
                                {uploadedImages.length !== 1 ? 's' : ''} selected
                            </span>
                        </div>

                        <div className="space-y-5">
                            {uploadedImages.length > 1 && (
                                <div className="text-sm font-medium text-gray-300 mb-2 bg-blue-500/20 p-3 rounded">
                                    Editing details for image {currentImageIndex + 1} of{' '}
                                    {uploadedImages.length}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Title
                                </label>
                                <input
                                    ref={titleInputRef}
                                    type="text"
                                    className="w-full bg-[#141414] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                                    placeholder="Enter photo title"
                                    value={currentMetadata.title}
                                    onChange={(e) =>
                                        updateCurrentPhotoMetadata('title', e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Description
                                </label>
                                <textarea
                                    className="w-full bg-[#141414] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] text-gray-200"
                                    placeholder="Enter photo description"
                                    value={currentMetadata.description}
                                    onChange={(e) =>
                                        updateCurrentPhotoMetadata('description', e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Album{' '}
                                    <span className="text-gray-500 text-xs">
                                        (shared across all photos)
                                    </span>
                                </label>
                                <div className="flex space-x-2">
                                    <select
                                        className="flex-1 bg-[#141414] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-gray-200"
                                        value={sharedMetadata.album}
                                        onChange={(e) =>
                                            setSharedMetadata({
                                                ...sharedMetadata,
                                                album: e.target.value,
                                            })
                                        }
                                    >
                                        {albums.map((album) => (
                                            <option key={album.id} value={album.id}>
                                                {album.name}
                                            </option>
                                        ))}
                                    </select>

                                    {onCreateAlbum && (
                                        <button
                                            onClick={onCreateAlbum}
                                            className="px-3 py-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors flex items-center"
                                            title="Create new album"
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
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Date{' '}
                                    <span className="text-gray-500 text-xs">
                                        (shared across all photos)
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    className="w-full bg-[#141414] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                                    value={sharedMetadata.date}
                                    onChange={(e) =>
                                        setSharedMetadata({
                                            ...sharedMetadata,
                                            date: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Tags
                                </label>
                                <div className="bg-[#141414] rounded-lg p-4">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {currentMetadata.tags && currentMetadata.tags.length > 0 ? (
                                            currentMetadata.tags.map((tagId) => {
                                                const tag = tags.find((t) => t.id === tagId);
                                                if (!tag) return null;

                                                return (
                                                    <div
                                                        key={tag.id}
                                                        className="px-3 py-1 rounded-full text-sm flex items-center"
                                                        style={{
                                                            backgroundColor: `${tag.color}30`,
                                                            color: tag.color,
                                                        }}
                                                    >
                                                        {tag.name}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-gray-500 text-sm flex items-center h-[32px]">
                                                No tags selected
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleEditTags}
                                        className="w-full px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2"
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
                                        Select Tags
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto flex justify-end pt-6">
                            <button
                                onClick={onClose}
                                className="px-5 py-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors mr-3"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onAddFiles}
                                className="px-5 py-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors mr-3"
                            >
                                Add More Images
                            </button>
                            <button
                                onClick={handleUpload}
                                className="px-5 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:bg-blue-500/70 disabled:cursor-not-allowed"
                                disabled={uploadedImages.length === 0}
                            >
                                Upload {uploadedImages.length} Photo
                                {uploadedImages.length !== 1 ? 's' : ''}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadPhotoModal;
