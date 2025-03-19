import { useState, useMemo } from 'react';
import { Photo, FilterCriteria } from '@/app/types';

/**
 * Hook for filtering photos based on album, tag, and search term
 *
 * @param photos - Array of photos to filter
 * @returns Object containing filtered photos and filter state management functions
 */
export default function usePhotoFilter(photos: Photo[]) {
    const [selectedAlbum, setSelectedAlbum] = useState('all');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Filtered photos based on current criteria
    const filteredPhotos = useMemo(() => {
        return photos.filter((photo) => {
            const matchesAlbum = selectedAlbum === 'all' || photo.album === selectedAlbum;
            const matchesTag = !selectedTag || (photo.tags && photo.tags.includes(selectedTag));
            const matchesSearch =
                !searchTerm ||
                photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                photo.album.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesAlbum && matchesSearch && matchesTag;
        });
    }, [photos, selectedAlbum, selectedTag, searchTerm]);

    // Function to set all filter criteria at once
    const setFilterCriteria = ({ album, tag, searchTerm }: FilterCriteria) => {
        if (album !== undefined) setSelectedAlbum(album);
        if (tag !== undefined) setSelectedTag(tag);
        if (searchTerm !== undefined) setSearchTerm(searchTerm);
    };

    // Reset all filters
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
        setFilterCriteria,
        resetFilters,
    };
}
