import { useState, FC, useEffect, useRef } from 'react';
import { Tag } from '@/app/types';

// Preset tag colors for quick selection
const PRESET_COLORS = [
    '#EF4444', // red
    '#F59E0B', // amber
    '#34D399', // green
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#6B7280', // gray
    '#1F2937', // dark gray
];

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
            <div className="bg-background/95 backdrop-blur-xl rounded-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-medium mb-4 text-foreground">
                    {editingTag ? 'Edit Tag' : 'New Tag'}
                </h3>
                <div className="space-y-4">
                    <div>
                        <label
                            className="block text-sm font-medium text-muted-foreground mb-1"
                            htmlFor="tagName"
                        >
                            Name
                        </label>
                        <input
                            id="tagName"
                            ref={inputRef}
                            type="text"
                            className="w-full bg-accent/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent text-foreground placeholder:text-muted-foreground"
                            placeholder="Enter tag name"
                            value={tag.name}
                            onChange={(e) => setTag({ ...tag, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Color
                        </label>
                        <div className="grid grid-cols-9 gap-2">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color}
                                    className={`w-8 h-8 rounded-full ${
                                        tag.color === color ? 'ring-2 ring-offset-2 ring-accent' : ''
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setTag({ ...tag, color })}
                                    aria-label={`Select color ${color}`}
                                />
                            ))}
                            {/* Custom picker swatch */}
                            <label
                                key="custom"
                                className={`relative w-8 h-8 rounded-full overflow-hidden ${
                                    // highlight when current color is custom
                                    !PRESET_COLORS.includes(tag.color)
                                        ? 'ring-2 ring-offset-2 ring-accent'
                                        : ''
                                }`}
                                style={{ backgroundColor: tag.color }}
                                aria-label="Custom color picker"
                            >
                                <input
                                    type="color"
                                    value={tag.color}
                                    onChange={(e) => setTag({ ...tag, color: e.target.value })}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {/* Icon overlay to indicate picker */}
                                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <svg
                                        className="w-4 h-4 text-white"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                        />
                                    </svg>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    {editingTag && onDelete && (
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                        >
                            Delete
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-accent/50 hover:bg-accent/70 transition-colors text-accent-foreground"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
