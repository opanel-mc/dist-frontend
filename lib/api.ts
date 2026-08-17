import axios from "axios";
import { isPreviewVersion } from "./utils";
import { compareVersions, isVersionAtLeast } from "./version";

const BASE_URL = process.env["NEXT_PUBLIC_SERVICE_BASE_URL"] ?? "";
const PAPER_MIGRATION_VERSION = "2.2.0-pre1";

export interface ReleaseAsset {
  name: string; // 文件名（包含.jar）
  server: string; // 服务端平台
  gameVersion: string;
  opanelVersion: string;
  size: number;
}

export type ReleasesResponse = Record<string, ReleaseAsset[]>;

export function getAssetServer(platform: string, opanelVersion: string): string {
  if(platform !== "paper") return platform;
  return isVersionAtLeast(opanelVersion, PAPER_MIGRATION_VERSION) ? "paper" : "bukkit";
}

export async function fetchReleases(): Promise<ReleasesResponse> {
  const res = await axios.get<ReleasesResponse>(`${BASE_URL}/releases`);
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

export function findAsset(
  releases: ReleasesResponse,
  opanelVersion: string,
  platform: string,
  gameVersion: string
): ReleaseAsset | null {
  const release = releases[opanelVersion];
  if (!release) return null;
  const server = getAssetServer(platform, opanelVersion);
  return release.find(a => a.server === server && a.gameVersion === gameVersion) ?? null;
}

export function getAssetListByGameVersion(releases: ReleasesResponse, platform: string, gameVersion: string): ReleaseAsset[] {
  const assets: ReleaseAsset[] = [];
  for(const [opanelVersion, release] of Object.entries(releases)) {
    const server = getAssetServer(platform, opanelVersion);
    const asset = release.find(a => a.server === server && a.gameVersion === gameVersion);
    if(asset) {
      assets.push(asset);
    }
  }
  return assets.sort((a, b) => compareVersions(b.opanelVersion, a.opanelVersion));
}

export function getDownloadUrl(opanelVersion: string, fileName: string): string {
  return `${BASE_URL}/download/${encodeURIComponent(opanelVersion)}/${encodeURIComponent(fileName)}`;
}
