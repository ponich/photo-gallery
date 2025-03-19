import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with Tailwind's utility
 * @param inputs - Array of class names or conditional objects
 * @returns Merged class names string
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
