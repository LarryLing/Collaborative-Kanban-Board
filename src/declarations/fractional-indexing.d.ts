declare module "fractional-indexing" {
  /**
   * Generate a fractional index between two given indices
   * @param a - Lower bound index (can be null for beginning)
   * @param b - Upper bound index (can be null for end)
   * @param digits - Optional custom digits string
   * @returns A fractional index string between a and b
   */
  export function generateKeyBetween(a?: null | string, b?: null | string, digits?: string): string;

  /**
   * Generate n fractional indices between two given indices
   * @param a - Lower bound index (can be null for beginning)
   * @param b - Upper bound index (can be null for end)
   * @param n - Number of indices to generate
   * @param digits - Optional custom digits string
   * @returns An array of n fractional index strings between a and b
   */
  export function generateNKeysBetween(a: null | string, b: null | string, n: number, digits?: string): string[];
}
