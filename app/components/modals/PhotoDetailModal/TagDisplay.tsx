import { FC } from 'react';
import { Photo, Tag } from '@/app/types';

interface TagDisplayProps {
    photo: Photo;
    tags: Tag[];
}

/**
 * Component for displaying photo tags
 */
export const TagDisplay: FC<TagDisplayProps> = ({ photo, tags }) => {
    if (!photo.tags || photo.tags.length === 0) return null;

    return (
        <>
            <div className="mb-2 text-gray-600 dark:text-gray-400 text-sm">Tags</div>
            <div className="flex flex-wrap gap-2">
                {photo.tags.map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId);
                    if (!tag) return null;

                    return (
                        <div
                            key={tag.id}
                            className="px-3 py-1 rounded-full text-sm"
                            style={{
                                backgroundColor: `${tag.color}20`,
                                color: tag.color,
                            }}
                        >
                            {tag.name}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default TagDisplay;
