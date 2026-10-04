import axios from "axios";
import { isPreviewVersion } from "./utils";
import { compareVersions, isVersionAtLeast } from "./version";
import { PAPER_MIGRATION_VERSION, SERVICE_BASE_URL } from "./global";

export interface ReleaseAsset {
  name: string; // 完整文件名（包含扩展名）
  server: string; // 服务端平台
  gameVersion: string | null; // Pumpkin 为 null
  opanelVersion: string;
  target: string | null; // Java 平台为 null
  format: "jar" | "dll" | "so" | "dylib";
  size: number;
}

export type ReleasesResponse = Record<string, ReleaseAsset[]>;

export function getAssetServer(platform: string, opanelVersion: string): string {
  if(platform !== "paper") return platform;
  return isVersionAtLeast(opanelVersion, PAPER_MIGRATION_VERSION) ? "paper" : "bukkit";
}

export async function fetchReleases(): Promise<ReleasesResponse> {
  const res = await axios.get<ReleasesResponse>(`${SERVICE_BASE_URL}/releases`);
  return res.data;
}

export function getLatestStableVersion(releases: ReleasesResponse): string | null {
  const sorted = Object.keys(releases)
    .filter((version) => !isPreviewVersion(version))
    .sort((a, b) => compareVersions(b, a));
  return sorted[0] ?? null;
}

export function getLatestPreviewVersion(releases: ReleasesResponse): string | null {
  const sorted = Object.keys(releases)
    .filter((version) => isPreviewVersion(version))
    .sort((a, b) => compareVersions(b, a));
  return sorted[0] ?? null;
}

export function getPumpkinTargets(releases: ReleasesResponse): string[] {
  const targets = new Set<string>();
  for(const release of Object.values(releases)) {
    for(const asset of release) {
      if(asset.server === "pumpkin" && asset.target) {
        targets.add(asset.target);
      }
    }
  }
  return [...targets].sort();
}

export function findAsset(
  releases: ReleasesResponse,
  opanelVersion: string,
  platform: string,
  versionOrTarget: string
): ReleaseAsset | null {
  const release = releases[opanelVersion];
  if (!release) return null;
  const server = getAssetServer(platform, opanelVersion);
  return release.find(a => a.server === server && (
    platform === "pumpkin"
      ? a.target === versionOrTarget
      : a.gameVersion === versionOrTarget
  )) ?? null;
}

export function getAssetList(releases: ReleasesResponse, platform: string, versionOrTarget: string): ReleaseAsset[] {
  const assets: ReleaseAsset[] = [];
  for(const opanelVersion of Object.keys(releases)) {
    const asset = findAsset(releases, opanelVersion, platform, versionOrTarget);
    if(asset) {
      assets.push(asset);
    }
  }
  return assets.sort((a, b) => compareVersions(b.opanelVersion, a.opanelVersion));
}

export function getDownloadUrl(opanelVersion: string, fileName: string): string {
  return `${SERVICE_BASE_URL}/download/${encodeURIComponent(opanelVersion)}/${encodeURIComponent(fileName)}`;
}
