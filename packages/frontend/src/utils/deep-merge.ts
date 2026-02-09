/**
 * Deeply merges two values of the same type.
 * - Arrays: concatenates entries from both arrays
 * - Objects: recursively merges properties, with `b` taking precedence for primitives
 * - Primitives: `b` takes precedence over `a`
 */
export const deepMerge = <T>(a: T, b: T): T => {
  // Handle null/undefined cases
  if (a === null || a === undefined) return b;
  if (b === null || b === undefined) return a;

  // Handle arrays - concatenate entries and deduplicate by referential equality
  if (Array.isArray(a) && Array.isArray(b)) {
    const merged = [...a, ...b];
    return merged.filter((item, index) => merged.indexOf(item) === index) as T;
  }

  // Handle objects - recursively merge properties
  if (isObject(a) && isObject(b)) {
    const result = { ...a } as Record<string, unknown>;

    for (const key of Object.keys(b)) {
      const aValue = (a as Record<string, unknown>)[key];
      const bValue = (b as Record<string, unknown>)[key];

      if (key in a) {
        result[key] = deepMerge(aValue, bValue);
      } else {
        result[key] = bValue;
      }
    }

    return result as T;
  }

  // Primitives - b takes precedence
  return b;
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};
