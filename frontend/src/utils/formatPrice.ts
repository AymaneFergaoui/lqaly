/**
 * Format price in Moroccan Dirham format
 *
 * @param price - Price in MAD (number)
 * @returns Formatted price string (e.g., "2.50M MAD", "50,000 MAD")
 *
 * @example
 * formatPrice(2500000)  // "2.50M MAD"
 * formatPrice(50000)    // "50,000 MAD"
 */
export function formatPrice(price: number): string {
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(2)}M MAD`;
  }
  return `${price.toLocaleString('en-US')} MAD`;
}
