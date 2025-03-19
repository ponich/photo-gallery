import { FC } from 'react';
import { Photo, Album } from '@/app/types';

interface AlbumInfoProps {
    photo: Photo;
    albums: Album[];
}

/**
 * Component for displaying photo album information
 */
export const AlbumInfo: FC<AlbumInfoProps> = ({ photo, albums }) => {
    return (
        <>
            <div className="mb-2 text-gray-600 dark:text-gray-400 text-sm">Album</div>
            <div className="mb-4 text-gray-900 dark:text-white">
                {albums.find((a) => a.id === photo.album)?.name || photo.album}
            </div>
        </>
    );
};

export default AlbumInfo;
