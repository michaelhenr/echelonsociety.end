/**
 * Shared Business Logic Utilities
 * Reusable calculations and business logic
 */

/**
 * Calculate shipping cost based on city
 * Cairo & Alexandria: 70 EGP
 * Other cities: 100 EGP
 */
export function calculateShipping(city: string): number {
  const CAIRO_ALEXANDRIA_COST = 70;
  const OTHER_CITIES_COST = 100;

  const normalizedCity = city.toLowerCase();
  return normalizedCity === 'cairo' || normalizedCity === 'alexandria'
    ? CAIRO_ALEXANDRIA_COST
    : OTHER_CITIES_COST;
}

/**
 * Calculate order total from items and shipping
 */
export function calculateOrderTotal(
  items: Array<{ quantity: number; price: number }>,
  shippingCost: number
): number {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  return subtotal + shippingCost;
}

/**
 * Apply newsletter discount (10% off)
 */
export function applyNewsletterDiscount(total: number): number {
  const DISCOUNT_PERCENTAGE = 0.10;
  return total * (1 - DISCOUNT_PERCENTAGE);
}

/**
 * Generate discount code for newsletter
 */
export function getNewsletterDiscountCode(): string {
  return 'ECHELON10'; // 10% discount
}
