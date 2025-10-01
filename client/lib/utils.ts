import { twMerge } from "tailwind-merge";

// Minimal implementation of clsx-like behavior to avoid external dependency in tests
type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | { [k: string]: any }
  | ClassValue[];

function clsx(inputs: ClassValue[]) {
  const classes: string[] = [];

  function handle(item: ClassValue) {
    if (!item) return;
    if (typeof item === "string" || typeof item === "number") {
      classes.push(String(item));
      return;
    }
    if (Array.isArray(item)) {
      item.forEach(handle);
      return;
    }
    if (typeof item === "object") {
      Object.keys(item).forEach((k) => {
        if ((item as any)[k]) classes.push(k);
      });
      return;
    }
  }

  inputs.forEach(handle);
  return classes.join(" ");
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
