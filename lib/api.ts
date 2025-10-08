import { VersionInfo, CachedFilesResponse, SystemStats, FileInfo } from './types';
import { mockCachedFilesResponse } from './mock-data';
import supportedVersionList from "@/data/supported-version-list.json";

// API基础配置
const API_BASE_URL = 'http://dl-1.opanel.cn:8000';
const DEFAULT_REPO = 'opanel-mc/opanel';

// 通用API请求函数
async function apiRequest<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 添加超时处理
      signal: AbortSignal.timeout(10000) // 10秒超时
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Network error' }));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// API函数集合
export const api = {
  // 获取版本列表
  async getVersions(repo: string = DEFAULT_REPO): Promise<VersionInfo> {
    try {
      return await apiRequest<VersionInfo>(`/api/versions?repo=${encodeURIComponent(repo)}`);
    } catch (error) {
      // 如果API失败，返回模拟数据中的版本信息
      const versions = Array.from(new Set(mockCachedFilesResponse.files.map(f => f.version)));
      return {
        repository: repo,
        versions: versions.sort((a, b) => b.localeCompare(a, undefined, { numeric: true })),
        cached: false,
        timestamp: new Date().toISOString()
      };
    }
  },

  // 获取所有缓存文件
  async getAllCachedFiles(repo: string = DEFAULT_REPO): Promise<CachedFilesResponse> {
    try {
      return await apiRequest<CachedFilesResponse>(`/api/cached-files?repo=${encodeURIComponent(repo)}`);
    } catch (error) {
      console.warn('API不可用，使用模拟数据:', error);
      // 返回模拟数据
      return mockCachedFilesResponse;
    }
  },

  // 获取指定版本的缓存文件
  async getCachedFilesByVersion(version: string, repo: string = DEFAULT_REPO): Promise<CachedFilesResponse> {
    try {
      return await apiRequest<CachedFilesResponse>(`/api/cached-files/${encodeURIComponent(version)}?repo=${encodeURIComponent(repo)}`);
    } catch (error) {
      // 从模拟数据中筛选指定版本的文件
      const versionFiles = mockCachedFilesResponse.files.filter(f => f.version === version);
      return {
        ...mockCachedFilesResponse,
        version,
        files: versionFiles,
        total_files: versionFiles.length,
        total_size_mb: versionFiles.reduce((sum, file) => sum + file.size_mb, 0)
      };
    }
  },

  // 获取系统统计信息
  async getSystemStats(): Promise<SystemStats> {
    try {
      return await apiRequest<SystemStats>('/api/stats');
    } catch (error) {
      // 返回模拟统计数据
      return {
        cache_stats: {
          total_files: mockCachedFilesResponse.total_files,
          total_size_mb: mockCachedFilesResponse.total_size_mb,
          repositories: 1
        },
        system_info: {
          uptime: "模拟模式",
          last_update_check: new Date().toISOString()
        }
      };
    }
  },

  // 获取下载链接
  getDownloadUrl(version: string, filename: string): string {
    return `${API_BASE_URL}/api/download/${encodeURIComponent(version)}/${encodeURIComponent(filename)}`;
  },

  // 直接下载文件
  async downloadFile(version: string, filename: string): Promise<void> {
    try {
      const url = this.getDownloadUrl(version, filename);
      
      // 检查后端是否可用
      const response = await fetch(`${API_BASE_URL}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(3000) // 3秒超时
      });
      
      if (response.ok) {
        // 后端可用，直接下载
        window.open(url, '_blank');
      } else {
        throw new Error('Backend not available');
      }
    } catch (error) {
      console.warn('后端服务不可用，无法下载文件:', error);
      // 可以显示错误提示或提供其他下载方式
      alert('下载功能需要后端服务支持。请确保后端服务正在运行 (http://localhost:8000)');
    }
  },

  // 手动触发更新检查
  async triggerUpdateCheck(repo: string = DEFAULT_REPO): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/update-check?repo=${encodeURIComponent(repo)}`, {
        method: 'POST',
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Network error' }));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.warn('无法触发更新检查:', error);
      throw error;
    }
  },

  // 健康检查
  async healthCheck(): Promise<any> {
    try {
      return await apiRequest<any>('/health');
    } catch (error) {
      return { 
        status: 'unavailable', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
};

// 工具函数：根据平台筛选文件
export function filterFilesByPlatform(files: FileInfo[], platform: string): FileInfo[] {
  if (platform === 'all') return files;
  return files.filter(file => file.platform.toLowerCase() === platform.toLowerCase());
}

// 工具函数：根据游戏版本筛选文件
export function filterFilesByGameVersion(files: FileInfo[], gameVersion: string): FileInfo[] {
  if (gameVersion === 'all') return files;
  return files.filter(file => getSupportedVersions(file).includes(gameVersion));
}

// 工具函数：根据OPanel版本筛选文件
export function filterFilesByOpanelVersion(files: FileInfo[], opanelVersion: string): FileInfo[] {
  if (opanelVersion === 'all') return files;
  return files.filter(file => file.version === opanelVersion);
}

// 工具函数：获取所有可用的平台
export function getAvailablePlatforms(files: FileInfo[]): string[] {
  const platforms = new Set(files.map(file => file.platform));
  return Array.from(platforms).sort();
}

// 工具函数：获取所有可用的游戏版本
export function getAvailableGameVersions(files: FileInfo[]): string[] {
  const versions = new Set(files.map(file => file.mc_version));
  return Array.from(versions).sort((a, b) => {
    // 简单的版本排序，可以根据需要改进
    return b.localeCompare(a, undefined, { numeric: true });
  });
}

// 工具函数：获取所有可用的OPanel版本
export function getAvailableOpanelVersions(files: FileInfo[]): string[] {
  const versions = new Set(files.map(file => file.version));
  return Array.from(versions).sort((a, b) => {
    // 简单的版本排序，可以根据需要改进
    return b.localeCompare(a, undefined, { numeric: true });
  });
}

export function getSupportedVersions(file: FileInfo): string[] {
  // @ts-ignore
  const supportedList = supportedVersionList[file.platform][file.mc_version];
  return supportedList ?? [file.mc_version];
};
