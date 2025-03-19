import React, { FC, useState } from 'react';
import { Photo } from '@/app/types';

interface TagManagerProps {
    photo: Photo;
    isVisible: boolean;
    onTagsUpdate: (newTags: string[]) => void;
    onClose: () => void;
}

/**
 * Component for managing photo tags
 */
export const TagManager: FC<TagManagerProps> = ({ photo, isVisible, onTagsUpdate, onClose }) => {
    const [tags, setTags] = useState<string[]>(photo.tags || []);
    const [newTag, setNewTag] = useState('');

    if (!isVisible) return null;

    const handleAddTag = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            const updatedTags = [...tags, newTag.trim()];
            setTags(updatedTags);
            onTagsUpdate(updatedTags);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const updatedTags = tags.filter((tag) => tag !== tagToRemove);
        setTags(updatedTags);
        onTagsUpdate(updatedTags);
    };

    return (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-[#1e1e20] rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Manage Tags</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
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

                <form onSubmit={handleAddTag} className="mb-4">
                    <div className="flex">
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Add a new tag"
                            className="flex-grow px-4 py-2 bg-[#2d2d2f] rounded-l-lg text-gray-100 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r-lg transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </form>

                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <div
                            key={index}
                            className="bg-[#2d2d2f] px-3 py-1 rounded-full text-sm flex items-center"
                        >
                            {tag}
                            <button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-2 text-gray-400 hover:text-white"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
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
                    {tags.length === 0 && (
                        <p className="text-gray-500 text-sm">No tags added yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TagManager;
