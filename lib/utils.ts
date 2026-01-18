import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function copyToClipboard(str: string) {
  try {
    await navigator.clipboard.writeText(str);
  } catch (err) {
    console.error('Could not copy text: ', err);
  }
}

export function isPreviewVersion(version: string) {
  return version.includes("pre") || version.includes("rc");
}
