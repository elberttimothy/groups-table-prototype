/**
 * Simple memoization function that caches results based on argument values.
 * Uses JSON.stringify for cache key generation.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function simpleMemoise<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
}

