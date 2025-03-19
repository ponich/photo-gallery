import { FC, useEffect, useState } from 'react';
import { Photo, Tag } from '@/app/types';

interface PhotoTagModalProps {
    photo: Photo;
    tags: Tag[];
    onClose: () => void;
    onUpdateTags: (photo: Photo) => void;
    onCreateNewTag: () => void;
}

/**
 * Modal component for managing tags assigned to a photo
 * Allows adding and removing tags from a photo
 */
const PhotoTagModal: FC<PhotoTagModalProps> = ({
    photo,
    tags,
    onClose,
    onUpdateTags,
    onCreateNewTag,
}) => {
    // Local state to track selected tags
    const [selectedTags, setSelectedTags] = useState<string[]>(photo.tags || []);

    // Update photo when tags change
    useEffect(() => {
        const updatedPhoto = {
            ...photo,
            tags: selectedTags,
        };
        onUpdateTags(updatedPhoto);
    }, [onUpdateTags, photo, selectedTags]);

    const handleTagToggle = (tagId: string) => {
        const isTagged = selectedTags.includes(tagId);

        // Create a copy of the current tags
        let updatedTags;
        if (isTagged) {
            updatedTags = selectedTags.filter((t) => t !== tagId);
        } else {
            updatedTags = [...selectedTags, tagId];
        }

        setSelectedTags(updatedTags);
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
            <div className="bg-modal rounded-xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-medium text-foreground">Edit Tags</h3>
                    <button
                        onClick={onClose}
                        className="p-2 bg-button/10 rounded-full text-foreground hover:bg-button/20 transition-colors"
                        title="Close"
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

                <p className="text-sm text-foreground/60 mb-4">
                    Add or remove tags for &quot;{photo.title}&quot;
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag) => (
                        <button
                            key={tag.id}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors flex items-center ${
                                selectedTags.includes(tag.id)
                                    ? 'opacity-100'
                                    : 'opacity-50 hover:opacity-80'
                            }`}
                            style={{
                                backgroundColor: `${tag.color}20`,
                                color: tag.color,
                            }}
                            onClick={() => handleTagToggle(tag.id)}
                        >
                            {tag.name}
                            {selectedTags.includes(tag.id) && (
                                <svg
                                    className="w-4 h-4 ml-1.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex justify-between items-center">
                    <button
                        onClick={onCreateNewTag}
                        className="flex items-center gap-2 bg-button/10 hover:bg-button/20 px-4 py-2 rounded-full text-sm text-foreground transition-colors"
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
                        Create New Tag
                    </button>

                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-sm text-white transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PhotoTagModal;
