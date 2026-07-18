import { compare, gte } from "semver";

const LEGACY_PRERELEASE_VERSION_PATTERN = /^(v?\d+\.\d+\.\d+)((?:pre|rc)\d+)$/i;

export function normalizeSemverVersion(version: string): string {
  const match = version.match(LEGACY_PRERELEASE_VERSION_PATTERN);
  if(!match) return version;
  return `${match[1]}-${match[2].toLowerCase()}`;
}

export function compareVersions(left: string, right: string): number {
  return compare(normalizeSemverVersion(left), normalizeSemverVersion(right));
}

export function isVersionAtLeast(version: string, minimum: string): boolean {
  return gte(normalizeSemverVersion(version), normalizeSemverVersion(minimum));
}
