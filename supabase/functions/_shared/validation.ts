/**
 * Shared Validation Utilities
 * Reusable validation functions for all backend services
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Return true/false whether an email is valid
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Throwing validator for required email fields (keeps existing calling style)
 */
export function validateEmail(email: string, fieldName: string = 'Email'): void {
  if (!isValidEmail(email)) {
    throw new Error(`${fieldName} format is invalid`);
  }
}

export function validatePrice(price: number): boolean {
  return typeof price === 'number' && price > 0;
}

export function validatePhoneNumber(phone: string): boolean {
  // Simple validation - at least 8 digits
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8;
}

export function validateRequired(value: any, fieldName: string): void {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new Error(`${fieldName} is required`);
  }
}

export function validatePositiveNumber(value: number, fieldName: string): void {
  if (typeof value !== 'number' || value <= 0) {
    throw new Error(`${fieldName} must be a positive number`);
  }
}
