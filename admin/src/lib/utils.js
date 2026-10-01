import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes without conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in Indian currency format
 * @param {number} price - Price in INR
 * @returns {string} Formatted price (e.g., "₹2.50 Cr", "₹75.0 L", "₹50,000")
 */
export function formatPrice(price) {
  if (price >= 1000000) return `${(price / 1000000).toFixed(2)}M MAD`;
  if (price >= 1000) return `${(price / 1000).toFixed(1)}K MAD`;
  return `${price.toLocaleString('fr-MA')} MAD`;
}

/**
 * Format date to readable string
 */
export function formatDate(date) {
  if (!date) return 'N/A';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'N/A';

  return parsed.toLocaleDateString('fr-MA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Truncate text to a given length
 */
export function truncate(text, length = 50) {
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length)}...` : text;
}
