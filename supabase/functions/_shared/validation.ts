/**
 * Shared Validation Utilities
 * Reusable validation functions for all backend services
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
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

export function validateEmail(email: string, fieldName: string = 'Email'): void {
  if (!validateEmail(email)) {
    throw new Error(`${fieldName} format is invalid`);
  }
}
