import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a fast-changing value.
 * @param {any} value - The input value to debounce
 * @param {number} [delay=500] - Debounce delay in milliseconds
 * @returns {any} Debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

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
export default useDebounce;
