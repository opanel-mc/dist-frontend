// API响应类型定义

export interface FileInfo {
  name: string;
  path: string;
  size: number;
  size_mb: number;
  modified_time: string;
  download_url: string;
  platform: string;
  mc_version: string;
  version: string;
  digest: string;
}

export interface VersionInfo {
  repository: string;
  versions: string[];
  cached: boolean;
  timestamp: string;
}

export interface CachedFilesResponse {
  repository: string;
  version?: string;
  total_files: number;
  total_size_mb: number;
  versions?: Record<string, FileInfo[]>;
  platforms?: Record<string, FileInfo[]>;
  files: FileInfo[];
  timestamp: string;
}

export interface SystemStats {
  cache_stats: {
    total_files: number;
    total_size_mb: number;
    repositories: number;
  };
  system_info: {
    uptime: string;
    last_update_check: string;
  };
}

export interface ApiError {
  detail: string;
}

// 筛选选项类型
export interface FilterOptions {
  server: string;
  gameVersion: string;
  opanelVersion: string;
}

export type DownloadSource = "opanel" | "acmecloud" | "github";
