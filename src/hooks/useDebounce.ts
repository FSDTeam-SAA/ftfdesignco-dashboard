import { useEffect, useState } from "react";

/**
 * A custom hook that returns a debounced version of the provided value.
 * Useful for delaying API calls or other expensive operations during rapid changes (e.g., typing in a search box).
 *
 * @param value The value to debounce.
 * @param delay The delay in milliseconds (default is 500ms).
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
