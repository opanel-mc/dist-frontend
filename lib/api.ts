import axios from "axios";
import { isPreviewVersion } from "./utils";
import { isVersionAtLeast } from "./version";

const BASE_URL = process.env["NEXT_PUBLIC_SERVICE_BASE_URL"] ?? "";
const PAPER_MIGRATION_VERSION = "2.2.0-pre1";

export interface ReleaseAsset {
  id: number;
  name: string;
  server: string;
  gameVersion: string;
  opanelVersion: string;
  size: number;
  createdAt: string;
  digest?: string;
}

export interface Release {
  id: number;
  name: string;
  publishedAt: string;
  assets: ReleaseAsset[];
}

export type ReleasesResponse = Record<string, Release>;

export function getAssetServer(platform: string, opanelVersion: string): string {
  if(platform !== "paper") return platform;
  return isVersionAtLeast(opanelVersion, PAPER_MIGRATION_VERSION) ? "paper" : "bukkit";
}

export async function fetchReleases(): Promise<ReleasesResponse> {
  const res = await axios.get<ReleasesResponse>(`${BASE_URL}/api/releases`);
  return res.data;
}

export function getLatestStableVersion(releases: ReleasesResponse): string | null {
  const sorted = Object.entries(releases)
    .filter(([v]) => !isPreviewVersion(v))
    .sort(([, a], [, b]) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return sorted[0]?.[0] ?? null;
}

export function getLatestPreviewVersion(releases: ReleasesResponse): string | null {
  const sorted = Object.entries(releases)
    .filter(([v]) => isPreviewVersion(v))
    .sort(([, a], [, b]) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return sorted[0]?.[0] ?? null;
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
  return release.assets.find(a => a.server === server && a.gameVersion === gameVersion) ?? null;
}

export function getAssetListByGameVersion(releases: ReleasesResponse, platform: string, gameVersion: string): ReleaseAsset[] {
  const assets: ReleaseAsset[] = [];
  for(const [opanelVersion, release] of Object.entries(releases)) {
    const server = getAssetServer(platform, opanelVersion);
    const asset = release.assets.find(a => a.server === server && a.gameVersion === gameVersion);
    if(asset) {
      assets.push(asset);
    }
  }
  return assets;
}

export function getDownloadUrl(assetId: number): string {
  return `${BASE_URL}/api/download/${assetId}`;
}
