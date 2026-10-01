/**
 * Format price in Indian currency format
 *
 * @param price - Price in INR (number)
 * @returns Formatted price string (e.g., "₹2.50 Cr", "₹75.0 L", "₹50,000")
 *
 * @example
 * formatPrice(25000000)  // "₹2.50 Cr"
 * formatPrice(7500000)   // "₹75.0 L"
 * formatPrice(50000)     // "₹50,000"
 */
export function formatPrice(price: number): string {
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(2)}M MAD`;
  }
  if (price >= 1_000) {
    return `${(price / 1_000).toFixed(1)}K MAD`;
  }
  return `${price.toLocaleString('fr-MA')} MAD`;
}
