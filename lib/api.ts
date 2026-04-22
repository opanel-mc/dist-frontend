import axios from "axios";
import { isPreviewVersion } from "./utils";

const BASE_URL = process.env["NEXT_PUBLIC_SERVICE_BASE_URL"] ?? "";

export interface ReleaseAsset {
  id: number;
  name: string;
  server: string;
  gameVersion: string;
  opanelVersion: string;
  size: number;
  createdAt: string;
}

export interface Release {
  id: number;
  name: string;
  publishedAt: string;
  assets: ReleaseAsset[];
}

export type ReleasesResponse = Record<string, Release>;

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
  server: string,
  gameVersion: string
): ReleaseAsset | null {
  const release = releases[opanelVersion];
  if (!release) return null;
  return release.assets.find(a => a.server === server && a.gameVersion === gameVersion) ?? null;
}

export function getDownloadUrl(assetId: number): string {
  return `${BASE_URL}/api/download/${assetId}`;
}
