import React, { FC } from 'react';
import { Photo } from '@/app/types';

interface PhotoInfoProps {
    photo: Photo;
}

/**
 * Component to display basic photo information (title, date, description)
 */
export const PhotoInfo: FC<PhotoInfoProps> = ({ photo }) => {
    // Format date string for display
    const formattedDate = photo.createdAt 
        ? new Date(photo.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }) 
        : 'Unknown date';

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{photo.name || 'Untitled Photo'}</h2>
            <div className="text-sm text-muted-foreground">{formattedDate}</div>
            
            {photo.description && (
                <p className="text-base leading-relaxed">{photo.description}</p>
            )}
        </div>
    );
};

export default PhotoInfo;
