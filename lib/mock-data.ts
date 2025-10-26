import { FileInfo, CachedFilesResponse } from './types';

// 模拟文件数据
export const mockFiles: FileInfo[] = [
  {
    name: "opanel-bukkit-1.21-build-1.0.0rc7.jar",
    path: "cache/opanel-bukkit-1.21-build-1.0.0rc7.jar",
    size: 22713923,
    size_mb: 21.66,
    modified_time: "2025-01-07T15:23:44.170707",
    download_url: "/api/download/1.0.0rc7/opanel-bukkit-1.21-build-1.0.0rc7.jar",
    platform: "bukkit",
    mc_version: "1.21",
    version: "1.0.0rc7",
    digest: "<digest>"
  },
  {
    name: "opanel-fabric-1.21-build-1.0.0rc7.jar",
    path: "cache/opanel-fabric-1.21-build-1.0.0rc7.jar",
    size: 18456789,
    size_mb: 17.6,
    modified_time: "2025-01-07T15:23:44.170707",
    download_url: "/api/download/1.0.0rc7/opanel-fabric-1.21-build-1.0.0rc7.jar",
    platform: "fabric",
    mc_version: "1.21",
    version: "1.0.0rc7",
    digest: "<digest>"
  },
  {
    name: "opanel-forge-1.21-build-1.0.0rc7.jar",
    path: "cache/opanel-forge-1.21-build-1.0.0rc7.jar",
    size: 25123456,
    size_mb: 23.96,
    modified_time: "2025-01-07T15:23:44.170707",
    download_url: "/api/download/1.0.0rc7/opanel-forge-1.21-build-1.0.0rc7.jar",
    platform: "forge",
    mc_version: "1.21",
    version: "1.0.0rc7",
    digest: "<digest>"
  },
  {
    name: "opanel-neoforge-1.21-build-1.0.0rc7.jar",
    path: "cache/opanel-neoforge-1.21-build-1.0.0rc7.jar",
    size: 24567890,
    size_mb: 23.43,
    modified_time: "2025-01-07T15:23:44.170707",
    download_url: "/api/download/1.0.0rc7/opanel-neoforge-1.21-build-1.0.0rc7.jar",
    platform: "neoforge",
    mc_version: "1.21",
    version: "1.0.0rc7",
    digest: "<digest>"
  },
  {
    name: "opanel-folia-1.21-build-1.0.0rc7.jar",
    path: "cache/opanel-folia-1.21-build-1.0.0rc7.jar",
    size: 22890123,
    size_mb: 21.83,
    modified_time: "2025-01-07T15:23:44.170707",
    download_url: "/api/download/1.0.0rc7/opanel-folia-1.21-build-1.0.0rc7.jar",
    platform: "folia",
    mc_version: "1.21",
    version: "1.0.0rc7",
    digest: "<digest>"
  },
  {
    name: "opanel-bukkit-1.21-build-1.0.0rc6.jar",
    path: "cache/opanel-bukkit-1.21-build-1.0.0rc6.jar",
    size: 22456789,
    size_mb: 21.42,
    modified_time: "2025-01-06T10:15:30.123456",
    download_url: "/api/download/1.0.0rc6/opanel-bukkit-1.21-build-1.0.0rc6.jar",
    platform: "bukkit",
    mc_version: "1.21",
    version: "1.0.0rc6",
    digest: "<digest>"
  }
];

// 模拟API响应
export const mockCachedFilesResponse: CachedFilesResponse = {
  repository: "opanel-mc/opanel",
  total_files: [].length,
  total_size_mb: 0,
  files: [],
  timestamp: new Date().toISOString()
};