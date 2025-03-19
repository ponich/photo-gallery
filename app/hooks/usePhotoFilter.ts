import { useState, useEffect } from 'react';
import { Photo } from '@/app/types';

/**
 * Hook for filtering photos based on album, tag, and search term
 *
 * @param photos - Array of photos to filter
 * @returns Object containing filtered photos and filter state management functions
 */
export default function usePhotoFilter(photos: Photo[]) {
    const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>(photos);

    // Update filtered photos when filters or photos change
    useEffect(() => {
        const filtered = photos.filter((photo) => {
            // Filter by album
            const matchesAlbum =
                selectedAlbum === 'all' || photo.albumId === selectedAlbum;

            // Filter by tag
            const matchesTag =
                !selectedTag || (photo.tags && photo.tags.includes(selectedTag));

            // Filter by search term
            const photoName = photo.name || '';
            const photoDesc = photo.description || '';
            const photoAlbumId = photo.albumId || '';

            const matchesSearch =
                !searchTerm ||
                photoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                photoDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                photoAlbumId.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesAlbum && matchesTag && matchesSearch;
        });

        setFilteredPhotos(filtered);
    }, [photos, selectedAlbum, selectedTag, searchTerm]);

    // Reset to defaults
    const resetFilters = () => {
        setSelectedAlbum('all');
        setSelectedTag(null);
        setSearchTerm('');
    };

    return {
        filteredPhotos,
        filters: {
            selectedAlbum,
            selectedTag,
            searchTerm,
        },
        setSelectedAlbum,
        setSelectedTag,
        setSearchTerm,
        resetFilters,
    };
}
