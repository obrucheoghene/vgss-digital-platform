/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/use-debounce.ts
import { useState, useEffect } from "react";

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timeout to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if the value changes before the delay is complete
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook that debounces a callback function
 * @param callback - The callback function to debounce
 * @param delay - The delay in milliseconds
 * @param deps - Dependencies array (similar to useCallback)
 * @returns The debounced callback function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps?: React.DependencyList
): T {
  const [debouncedCallback, setDebouncedCallback] = useState<T | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const debouncedFn = ((...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T;

    setDebouncedCallback(() => debouncedFn);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [callback, delay, ...(deps || [])]);

  return debouncedCallback || callback;
}

/**
 * Custom hook for debounced search functionality
 * @param initialValue - Initial search value
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 * @returns Object with searchValue, debouncedSearchValue, setSearchValue, and isDebouncing
 */
export function useDebouncedSearch(initialValue = "", delay = 300) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const debouncedSearchValue = useDebounce(searchValue, delay);
  const isDebouncing = searchValue !== debouncedSearchValue;

  return {
    searchValue,
    debouncedSearchValue,
    setSearchValue,
    isDebouncing,
  };
}

/**
 * Custom hook for debounced state updates with loading indicator
 * @param initialValue - Initial value
 * @param delay - Debounce delay in milliseconds
 * @returns Object with value, debouncedValue, setValue, and isUpdating
 */
export function useDebouncedState<T>(initialValue: T, delay: number) {
  const [value, setValue] = useState<T>(initialValue);
  const debouncedValue = useDebounce(value, delay);
  const isUpdating = value !== debouncedValue;

  return {
    value,
    debouncedValue,
    setValue,
    isUpdating,
  };
}
