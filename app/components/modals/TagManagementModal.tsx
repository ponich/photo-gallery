import { useState, FC, useEffect, useRef } from 'react';
import { Tag } from '@/app/types';

interface TagManagementModalProps {
    onClose: () => void;
    onSave: (tag: Tag) => void;
    onDelete?: (tagId: string) => void;
    editingTag?: Tag | null;
}

/**
 * Modal component for creating or editing tags
 * Includes color picker and tag name input
 */
const TagManagementModal: FC<TagManagementModalProps> = ({
    onClose,
    onSave,
    onDelete,
    editingTag = null,
}) => {
    const [tag, setTag] = useState<Tag>(
        editingTag || {
            id: Math.random().toString(36).slice(2),
            name: '',
            color: '#3B82F6',
        },
    );

    const inputRef = useRef<HTMLInputElement>(null);

    // Focus the input field when the modal opens
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSave = () => {
        if (tag.name.trim()) {
            onSave(tag);
        }
        onClose();
    };

    const handleDelete = () => {
        if (editingTag && onDelete) {
            onDelete(editingTag.id);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#2d2d2f] rounded-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-medium mb-4 text-gray-100">
                    {editingTag ? 'Edit Tag' : 'New Tag'}
                </h3>
                <div className="space-y-4">
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-400 mb-1"
                            htmlFor="tagName"
                        >
                            Name
                        </label>
                        <input
                            id="tagName"
                            ref={inputRef}
                            type="text"
                            className="w-full bg-[#1d1d1f] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                            placeholder="Enter tag name"
                            value={tag.name}
                            onChange={(e) => setTag({ ...tag, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                            Color
                        </label>
                        <div className="grid grid-cols-8 gap-2">
                            {[
                                '#EF4444', // red
                                '#F59E0B', // amber
                                '#34D399', // green
                                '#3B82F6', // blue
                                '#8B5CF6', // purple
                                '#EC4899', // pink
                                '#6B7280', // gray
                                '#1F2937', // dark gray
                            ].map((color) => (
                                <button
                                    key={color}
                                    className={`w-8 h-8 rounded-full ${
                                        tag.color === color
                                            ? 'ring-2 ring-offset-2 ring-blue-500'
                                            : ''
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setTag({ ...tag, color })}
                                    aria-label={`Select color ${color}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    {editingTag && onDelete && (
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                            Delete
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:bg-blue-500/70 disabled:cursor-not-allowed"
                        disabled={!tag.name.trim()}
                    >
                        {editingTag ? 'Save' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TagManagementModal;
