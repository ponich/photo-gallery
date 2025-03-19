import React, { FC, useEffect, useRef, useState } from 'react';
import { Album } from '@/app/types';

interface AlbumCreationModalProps {
    onClose: () => void;
    onSave: (album: Album) => void;
}

/**
 * Modal component for creating a new album
 * Handles album name input and creation
 */
const AlbumCreationModal: FC<AlbumCreationModalProps> = ({ onClose, onSave }) => {
    const [albumName, setAlbumName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus the input field when the modal opens
    useEffect(() => {
        if (inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, []);

    /**
     * Creates a new album from the current input value
     */
    const createAlbum = () => {
        if (albumName.trim()) {
            // Create a new album with a simple ID based on the name
            const id = albumName.toLowerCase().replace(/\s+/g, '-');
            const newAlbum = { id, name: albumName.trim() };
            onSave(newAlbum);
            onClose();
        }
    };

    /**
     * Handles Enter key press for form submission
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && albumName.trim()) {
            createAlbum();
        }
    };

    return (
        <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#2d2d2f] rounded-xl p-6 w-full max-w-md">
                <h3 className="text-xl font-medium mb-4 text-gray-100">Create New Album</h3>
                <div className="space-y-4">
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-400 mb-1"
                            htmlFor="albumName"
                        >
                            Album Name
                        </label>
                        <input
                            id="albumName"
                            ref={inputRef}
                            type="text"
                            className="w-full bg-[#1d1d1f] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200"
                            placeholder="Enter album name"
                            value={albumName}
                            onChange={(e) => setAlbumName(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={createAlbum}
                        className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:bg-blue-500/70 disabled:cursor-not-allowed"
                        disabled={!albumName.trim()}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlbumCreationModal;
