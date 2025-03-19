import { Tag } from '@/app/types';
import React from 'react';
import { cn } from '@/app/lib/utils';

export interface TagItemProps {
    tag: Tag;
    isSelected?: boolean;
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    showActions?: boolean;
    size?: 'sm' | 'md' | 'lg';
    count?: number;
    className?: string;
}

/**
 * TagItem component for displaying a tag with its color
 *
 * @param tag - Tag object to display
 * @param isSelected - Whether the tag is currently selected
 * @param onClick - Click handler for the tag
 * @param onEdit - Handler for edit action
 * @param onDelete - Handler for delete action
 * @param showActions - Whether to show edit/delete actions
 * @param size - Size variant of the tag
 * @param count - Number count to display (optional)
 * @param className - Additional CSS classes
 */
export const TagItem = React.forwardRef<HTMLDivElement, TagItemProps>(
    (
        {
            tag,
            isSelected = false,
            onClick,
            onEdit,
            onDelete,
            showActions = false,
            size = 'md',
            count,
            className = '',
        },
        ref,
    ) => {
        const sizeClasses = {
            sm: 'py-1 px-2 text-xs',
            md: 'py-1.5 px-3 text-sm',
            lg: 'py-2 px-4 text-sm',
        };

        return (
            <div ref={ref} className="group flex items-center">
                <button
                    onClick={onClick}
                    className={cn(
                        'flex items-center space-x-2 rounded-lg transition-all duration-300',
                        sizeClasses[size],
                        isSelected
                            ? 'bg-accent text-accent-foreground shadow-lg'
                            : 'hover:bg-accent/50',
                        onClick ? 'cursor-pointer' : 'cursor-default',
                        className,
                    )}
                >
                    <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tag.color }}
                    />

                    <span className="font-medium truncate">{tag.name}</span>

                    {count !== undefined && (
                        <span className="ml-auto text-xs text-muted-foreground">{count}</span>
                    )}
                </button>

                {showActions && (
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="p-1 text-muted-foreground hover:text-foreground"
                            >
                                <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                </svg>
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="p-1 text-muted-foreground hover:text-foreground"
                            >
                                <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    },
);

TagItem.displayName = 'TagItem';
