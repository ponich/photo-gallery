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
    }, [selectedTags]);

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
        <div
            className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4 modal-backdrop-animation"
            onClick={onClose}
        >
            <div
                className="bg-[#2d2d2f] rounded-xl p-6 w-full max-w-md modal-animation"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-medium text-gray-100">Edit Tags</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
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

                <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-2">
                        Add or remove tags for &quot;{photo.title || 'New Photo'}&quot;
                    </p>

                    {selectedTags.length > 0 && (
                        <div className="mb-4 bg-gray-800/60 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-400 mb-2">Selected tags:</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedTags.map((tagId) => {
                                    const tag = tags.find((t) => t.id === tagId);
                                    if (!tag) return null;

                                    return (
                                        <div
                                            key={`selected-${tag.id}`}
                                            className="px-3 py-1 rounded-full text-sm flex items-center"
                                            style={{
                                                backgroundColor: `${tag.color}30`,
                                                color: tag.color,
                                            }}
                                        >
                                            {tag.name}
                                            <button
                                                onClick={() => handleTagToggle(tag.id)}
                                                className="ml-1.5 p-0.5 rounded-full hover:bg-black/20 transition-colors"
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
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2">
                        {tags.map((tag) => {
                            const isTagged = selectedTags.includes(tag.id);
                            return (
                                <button
                                    key={tag.id}
                                    onClick={() => handleTagToggle(tag.id)}
                                    className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                                        isTagged
                                            ? 'bg-gray-700/80'
                                            : 'bg-gray-800/40 hover:bg-gray-700/50'
                                    }`}
                                >
                                    <span
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: tag.color }}
                                    />

                                    <span className="font-medium text-gray-100">{tag.name}</span>
                                    {isTagged && (
                                        <svg
                                            className="w-5 h-5 ml-auto text-gray-100"
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
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCreateNewTag}
                        className="px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors flex items-center"
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
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        New Tag
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PhotoTagModal;
