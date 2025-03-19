import { useState } from 'react';

interface PhotoMetadata {
    title: string;
    description: string;
    tags: string[];
}

/**
 * Custom hook for managing upload state
 */
export function useUploadState(initialImages: string[] = []) {
    const [uploadedImages, setUploadedImages] = useState<string[]>(initialImages);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [photoMetadata, setPhotoMetadata] = useState<PhotoMetadata[]>(() =>
        initialImages.map(() => ({
            title: '',
            description: '',
            tags: [],
        })),
    );

    // Update metadata when images are added or removed
    const updateUploadedImages = (newImages: string[]) => {
        setUploadedImages(newImages);

        // Adjust metadata array length to match image count
        setPhotoMetadata((prev) => {
            if (newImages.length > prev.length) {
                // Add new entries
                const newEntries = Array(newImages.length - prev.length)
                    .fill(0)
                    .map(() => ({
                        title: '',
                        description: '',
                        tags: [],
                    }));
                return [...prev, ...newEntries];
            }
            // Remove entries if there are fewer images
            else if (newImages.length < prev.length) {
                return prev.slice(0, newImages.length);
            }
            return prev;
        });
    };

    // Update tags for a specific photo
    const updatePhotoTags = (photoIndex: number, tags: string[]) => {
        if (photoIndex >= 0 && photoIndex < photoMetadata.length) {
            setPhotoMetadata((prev) => {
                const updated = [...prev];
                updated[photoIndex] = {
                    ...updated[photoIndex],
                    tags: tags,
                };
                return updated;
            });
        }
    };

    return {
        uploadedImages,
        setUploadedImages: updateUploadedImages,
        currentImageIndex,
        setCurrentImageIndex,
        photoMetadata,
        setPhotoMetadata,
        updatePhotoTags,
    };
}
