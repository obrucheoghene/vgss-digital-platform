import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createRangeArray = (start: number, end: number, step = 1) => {
  // Calculate the length of the array based on the range and step
  const length = Math.ceil((end - start) / step) + 1;

  // Use Array.from to create the array
  return Array.from({ length }, (_, index) => start + index * step);
};
