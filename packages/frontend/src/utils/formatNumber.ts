/**
 * Format a number with commas as thousand separators.
 */
export function fNumberWithCommas(value: number): string {
  return value.toLocaleString('en-US');
}
