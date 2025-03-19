import React from 'react';
import Image from 'next/image';
import { Photo } from '@/app/types';

interface PhotoImageProps {
    photo: Photo;
    onNavigate: (direction: 'prev' | 'next') => void;
}

/**
 * Component for displaying the photo in the detail modal
 * Maximizes photo size while maintaining aspect ratio
 */
export function PhotoImage({ photo, onNavigate }: PhotoImageProps) {
    // Navigation button styles
    const navButtonClasses =
        'absolute top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/40 hover:bg-background/60 transition-all duration-200 backdrop-blur-sm z-10 opacity-80 hover:opacity-100';

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Left navigation button */}
            <button
                className={`${navButtonClasses} left-4`}
                onClick={() => onNavigate('prev')}
                aria-label="Previous photo"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            {/* Right navigation button */}
            <button
                className={`${navButtonClasses} right-4`}
                onClick={() => onNavigate('next')}
                aria-label="Next photo"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>

            {/* Photo display with maximum size */}
            <Image
                src={photo.url}
                alt={photo.name || 'Photo'}
                className="max-h-[85vh] max-w-full object-contain"
                width={1920}
                height={1080}
                priority
                quality={95}
            />
        </div>
    );
}

export default PhotoImage;
