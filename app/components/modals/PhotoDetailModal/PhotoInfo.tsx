import { FC } from 'react';
import { Photo } from '@/app/types';

interface PhotoInfoProps {
    photo: Photo;
}

/**
 * Component for displaying photo information like title, date and description
 */
export const PhotoInfo: FC<PhotoInfoProps> = ({ photo }) => {
    // Format date string for display
    const formattedDate = new Date(photo.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="space-y-2 pr-12">
            <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100">{photo.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{formattedDate}</p>
            {photo.description && (
                <p className="text-gray-700 dark:text-gray-300 mt-4">{photo.description}</p>
            )}
        </div>
    );
};

export default PhotoInfo;
