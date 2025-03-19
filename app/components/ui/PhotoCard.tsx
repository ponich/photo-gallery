import React from 'react';
import { cn } from '@/app/lib/utils';
import { Photo, Tag } from '@/app/types';

interface PhotoCardProps {
    photo: Photo;
    tags: Tag[];
    onClick: (photo: Photo) => void;
    className?: string;
}

/**
 * PhotoCard component for displaying a photo with its metadata
 *
 * @param photo - Photo object to display
 * @param tags - Array of all available tags
 * @param onClick - Click handler for the photo
 * @param className - Additional CSS classes
 */
export const PhotoCard = React.forwardRef<HTMLDivElement, PhotoCardProps>(
    ({ photo, tags, onClick, className }, ref) => {
        const isPortrait = photo.orientation === 'portrait';
        const isWide = photo.orientation === 'wide';

        // Determine grid span based on orientation
        const spanClass = isPortrait ? 'row-span-2' : isWide ? 'col-span-2' : '';

        // Determine object position for better image display
        const objectPosition = isPortrait
            ? 'object-top'
            : isWide
              ? 'object-center'
              : 'object-center';

        return (
            <div
                ref={ref}
                onClick={() => onClick(photo)}
                className={cn(
                    'group relative overflow-hidden rounded-xl bg-accent/30 shadow-sm',
                    'transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer',
                    spanClass,
                    className,
                )}
            >
                <img
                    src={photo.url}
                    alt={photo.title}
                    className={cn(
                        'w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]',
                        objectPosition,
                    )}
                    loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-white text-sm font-medium truncate pr-2">
                                {photo.title}
                            </h3>
                        </div>

                        {photo.tags && photo.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {photo.tags.map((tagId) => {
                                    const tag = tags.find((t) => t.id === tagId);
                                    if (!tag) return null;
                                    return (
                                        <span
                                            key={tag.id}
                                            className="px-2 py-1 rounded-full text-xs text-white backdrop-blur-lg"
                                            style={{
                                                backgroundColor: `${tag.color}80`,
                                                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                                            }}
                                        >
                                            {tag.name}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    },
);

PhotoCard.displayName = 'PhotoCard';
