import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conditionally join classNames and merge Tailwind CSS classes cleanly.
 * @param  {...any} inputs - Class names, arrays, objects or expressions
 * @returns {string} Merged class list
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
