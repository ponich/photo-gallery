import React, { useState } from 'react';
import { Photo } from '@/app/types';

interface PhotoEditorProps {
    photo: Photo;
    onSave: (updatedPhoto: Photo) => void;
    onCancel: () => void;
}

/**
 * Component for editing photo title and description
 */
export function PhotoEditor({ photo, onSave, onCancel }: PhotoEditorProps) {
    const [name, setName] = useState(photo.name || '');
    const [description, setDescription] = useState(photo.description || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...photo,
            name,
            description,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label
                        htmlFor="photo-name"
                        className="block text-sm font-medium mb-2 text-muted-foreground"
                    >
                        Name
                    </label>
                    <input
                        id="photo-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-accent/5 border border-border/40 
                                 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40
                                 transition-all placeholder:text-muted-foreground/50"
                        placeholder="Enter photo name..."
                    />
                </div>

                <div>
                    <label
                        htmlFor="photo-description"
                        className="block text-sm font-medium mb-2 text-muted-foreground"
                    >
                        Description
                    </label>
                    <textarea
                        id="photo-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg bg-accent/5 border border-border/40 
                                 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40
                                 transition-all placeholder:text-muted-foreground/50 resize-none"
                        placeholder="Enter photo description..."
                    />
                </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground 
                             hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                    Save Changes
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg border border-border/40 hover:bg-accent/10 
                             transition-colors text-sm font-medium"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default PhotoEditor;
