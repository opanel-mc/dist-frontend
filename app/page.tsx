"use client";

import Image from "next/image";
import { Download, FileDigit } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BrandIcon from "@/assets/brand-light.svg";
import { api, filterFilesByPlatform, filterFilesByGameVersion, filterFilesByOpanelVersion, getAvailablePlatforms, getAvailableOpanelVersions, getSupportedVersions } from "@/lib/api";
import { DownloadSource, FileInfo, FilterOptions } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";
import supportedVersionList from "@/data/supported-version-list.json";
import AcmeCloudLogo from "@/assets/acmecloud-logo.png";
import { copyToClipboard } from "@/lib/utils";

export default function Home() {
  // 状态管理
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileInfo[]>([]);
  const [downloadSource, setDownloadSource] = useState<DownloadSource>("opanel");
  const availableGameVersions = useMemo(() => {
    const list: string[] = [];
    for(const versionMap of Object.values(supportedVersionList)) {
      for(const versions of Object.values(versionMap)) {
        for(const version of versions) {
          if(!list.includes(version)) {
            list.push(version);
          }
        }
      }
    }
    return list.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  }, [supportedVersionList]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 筛选选项状态
  const [filters, setFilters] = useState<FilterOptions>({
    server: "all",
    gameVersion: "all",
    opanelVersion: "all"
  });

  // 可用选项
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([]);
  const [availableOpanelVersions, setAvailableOpanelVersions] = useState<string[]>([]);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 获取所有缓存文件
        const response = await api.getAllCachedFiles();
        setFiles(response.files);
        
        // 设置可用选项
        setAvailablePlatforms(getAvailablePlatforms(response.files));
        setAvailableOpanelVersions(getAvailableOpanelVersions(response.files));
        
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据失败');
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 应用筛选
  useEffect(() => {
    let filtered = files;
    
    // 按平台筛选
    filtered = filterFilesByPlatform(filtered, filters.server);
    
    // 按游戏版本筛选
    filtered = filterFilesByGameVersion(filtered, filters.gameVersion);
    
    // 按OPanel版本筛选
    filtered = filterFilesByOpanelVersion(filtered, filters.opanelVersion);
    
    setFilteredFiles(filtered);
  }, [files, filters]);

  const handleCopyDigest = async (digest: string) => {
    await copyToClipboard(digest);
    alert(`复制成功\nsha256:${digest}`);
  }

  // 处理下载
  const handleDownload = async (file: FileInfo) => {
    try {
      await api.downloadFile(file.version, file.name, downloadSource);
    } catch (err) {
      console.error('Download failed:', err);
      // 可以添加错误提示
    }
  };

  // 更新筛选器
  const updateFilter = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // 格式化文件大小
  const formatFileSize = (sizeMb: number): string => {
    if (sizeMb < 1) {
      return `${(sizeMb * 1024).toFixed(1)} KB`;
    }
    return `${sizeMb.toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-14 border-b-1 pb-3">
          <Image src={BrandIcon} alt="brand" width={300}/>
          <div className="text-center flex items-center gap-2">
            <Spinner />
            加载中...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-14 border-b-1 pb-3">
          <Image src={BrandIcon} alt="brand" width={300}/>
          <div className="text-center text-red-500">
            <p>加载失败: {error}</p>
            <p className="text-sm text-gray-500 mt-2">请确保后端服务正在运行 (http://localhost:8000)</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-4 border-b-1 pb-3">
        <span className="mb-10">
          <a href="https://opanel.cn" target="_blank">
            <Image src={BrandIcon} alt="brand" width={300}/>
          </a>
        </span>
        <span className="w-full text-sm text-muted-foreground">如果下载速度缓慢或者无法下载，可以尝试切换下载源。</span>
        <span className="w-full text-sm text-muted-foreground">
          AcmeCloud下载源由云上极致提供：
          <a className="inline-block align-middle" href="https://acmecloud.cn" target="_blank">
            <Image src={AcmeCloudLogo} alt="acmecloud-logo" width={100}/>
          </a>
        </span>
        <div className="w-full flex gap-2 max-sm:grid grid-cols-2 grid-rows-2 [&_label]:text-sm [&>*]:flex-1">
          <div className="flex flex-col gap-2">
            <Label>服务端</Label>
            <Select value={filters.server} onValueChange={(value) => updateFilter('server', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择服务端..."/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {availablePlatforms.map(platform => (
                  <SelectItem key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>游戏版本</Label>
            <Select value={filters.gameVersion} onValueChange={(value) => updateFilter('gameVersion', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择游戏版本..."/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {availableGameVersions.map(version => (
                  <SelectItem key={version} value={version}>
                    {version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>OPanel 版本</Label>
            <Select value={filters.opanelVersion} onValueChange={(value) => updateFilter('opanelVersion', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择OPanel版本..."/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {availableOpanelVersions.map(version => (
                  <SelectItem key={version} value={version}>
                    {version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>下载源</Label>
            <Select value={downloadSource} onValueChange={(value: DownloadSource) => setDownloadSource(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="选择下载源..."/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opanel">OPanel</SelectItem>
                <SelectItem value="acmecloud">AcmeCloud</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex-1 h-full">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            没有找到匹配的文件
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>文件名</TableHead>
                <TableHead className="text-center">平台</TableHead>
                <TableHead>游戏版本</TableHead>
                <TableHead className="text-center">文件大小</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file, index) => (
                <TableRow key={`${file.name}-${index}`}>
                  <TableCell className="font-medium">
                    <Button
                      variant="link"
                      className="cursor-pointer p-0"
                      onClick={() => handleDownload(file)}
                    >
                      {file.name}
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">
                      {file.platform.charAt(0).toUpperCase() + file.platform.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="[&>*]:inline-block w-44 wrap-anywhere whitespace-pre-wrap">
                    {getSupportedVersions(file).map(version => (
                      <Badge key={version} variant="secondary" className="mr-1 mb-1">
                        {version}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell className="text-center text-sm text-gray-600">
                    {formatFileSize(file.size_mb)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => handleCopyDigest(file.digest)}
                      title={`复制sha256摘要`}
                    >
                      <FileDigit />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => handleDownload(file)}
                      title={`下载 ${file.name}`}
                    >
                      <Download />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
