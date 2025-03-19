import React from 'react';
import { ThemeToggle } from '@/app/components/common/ThemeToggle';
import { cn } from '@/app/lib/utils';

interface TopBarProps {
    onMenuToggle: () => void;
    onHomeClick: () => void;
    onAddPhoto: () => void;
}

/**
 * TopBar component for the photo gallery
 *
 * @param onMenuToggle - Handler for toggling sidebar menu (mobile)
 * @param onHomeClick - Handler for clicking the home/title button
 * @param onAddPhoto - Handler for clicking the add photo button
 */
export default function TopBar({ onMenuToggle, onHomeClick, onAddPhoto }: TopBarProps) {
    const buttonClasses =
        'h-9 w-9 rounded-full bg-background/30 hover:bg-background/50 transition-all duration-200 flex items-center justify-center backdrop-blur-sm scale-100 hover:scale-105';

    return (
        <div className="fixed top-0 left-0 right-0 h-14 z-40 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={onMenuToggle}
                    className={cn(buttonClasses, 'md:hidden')}
                    title="Toggle menu"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
                <button
                    onClick={onHomeClick}
                    className="text-lg font-medium hover:text-foreground/80 transition-colors"
                >
                    Photo Gallery
                </button>
            </div>

            <div className="flex items-center space-x-3">
                <div className={buttonClasses}>
                    <ThemeToggle />
                </div>

                <button onClick={onAddPhoto} className={buttonClasses} title="Add Photo">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
