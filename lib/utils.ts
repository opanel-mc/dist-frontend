import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import supportedVersionList from "@/data/supported-version-list.json";

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

export type Platform = keyof typeof supportedVersionList;

export function getMinVersionForMcVersion(platform: Platform, mcVersion: string): string | null {
  const platformData = supportedVersionList[platform];
  for(const [minVersion, supportedVersions] of Object.entries(platformData)) {
    if(supportedVersions.includes(mcVersion)) {
      return minVersion;
    }
  }
  return null;
}

export function formatDataSize(bytes: number): string {
  const kb = bytes / 1024;
  const mb = kb / 1024;
  const gb = mb / 1024;
  const tb = gb / 1024;
  const pb = tb / 1024;

  if(tb >= 1024) return `${pb.toFixed(2)} PB`;
  if(gb >= 1024) return `${tb.toFixed(2)} TB`;
  if(mb >= 1024) return `${gb.toFixed(2)} GB`;
  if(kb >= 1024) return `${mb.toFixed(2)} MB`;
  return `${kb.toFixed(2)} KB`;
}
