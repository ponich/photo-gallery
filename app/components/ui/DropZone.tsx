import React, { FC, useState, useCallback, ReactNode } from 'react';

interface DropZoneProps {
    onFilesDropped: (files: FileList) => void;
    children?: ReactNode;
    className?: string;
}

/**
 * Component that creates a drag and drop area for file uploads
 * Displays overlay when files are being dragged over it
 */
const DropZone: FC<DropZoneProps> = ({ onFilesDropped, children, className = '' }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isDragging) {
                setIsDragging(true);
            }
        },
        [isDragging],
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                onFilesDropped(e.dataTransfer.files);
            }
        },
        [onFilesDropped],
    );

    return (
        <div className={className} onDragEnter={handleDragEnter} onDragOver={handleDragOver}>
            {children}

            {/* Drag overlay */}
            {isDragging && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center"
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <div className="bg-[#2d2d2f]/80 rounded-xl p-20 text-center border-2 border-dashed border-blue-500/50 max-w-2xl w-full">
                        <svg
                            className="w-32 h-32 mx-auto text-blue-500/70 mb-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <h3 className="text-3xl font-medium mb-4">Drop to Upload Photo</h3>
                        <p className="text-gray-400 text-xl">
                            Drop your image to add it to the gallery
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropZone;
