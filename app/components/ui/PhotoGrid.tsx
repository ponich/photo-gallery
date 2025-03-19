import React from 'react';
import { Photo, Tag } from '@/app/types';
import { PhotoCard } from './PhotoCard';
import { cn } from '@/app/lib/utils';

export interface PhotoGridProps {
    photos: Photo[];
    tags: Tag[];
    onPhotoSelect: (photo: Photo) => void;
    className?: string;
}

/**
 * PhotoGrid component for displaying a grid of photos
 *
 * @param photos - Array of photos to display
 * @param tags - Array of all available tags
 * @param onPhotoSelect - Handler for selecting a photo
 * @param className - Additional CSS classes
 */
const PhotoGrid = React.forwardRef<HTMLDivElement, PhotoGridProps>(
    ({ photos, tags, onPhotoSelect, className }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
                    'auto-rows-[200px] gap-4',
                    className,
                )}
                style={{ gridAutoFlow: 'dense' }}
            >
                {photos.map((photo) => (
                    <PhotoCard key={photo.id} photo={photo} tags={tags} onClick={onPhotoSelect} />
                ))}
            </div>
        );
    },
);

export default PhotoGrid;

PhotoGrid.displayName = 'PhotoGrid';
