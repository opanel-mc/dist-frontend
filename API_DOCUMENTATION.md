# GitHub 缓存系统 API 文档

## 基本信息

- 基础URL: `http://localhost:8000`
- 默认仓库: `opanel-mc/opanel`

## API 接口

### 1. 系统状态

#### 根路径
```
GET /
```
返回系统基本信息和状态。

#### 健康检查
```
GET /health
```
检查系统各组件健康状态。

### 2. 版本管理

#### 获取版本列表
```
GET /api/versions?repo={repository}
```
获取GitHub仓库的所有版本信息。

**参数:**
- `repo` (可选): 仓库名称，默认为 `opanel-mc/opanel`

**响应:**
```json
{
  "repository": "opanel-mc/opanel",
  "versions": [...],
  "cached": true,
  "timestamp": "2025-10-07T15:40:21.123456"
}
```

### 3. 缓存文件管理

#### 获取所有缓存文件
```
GET /api/cached-files?repo={repository}
```
获取本地缓存的所有文件信息。

**响应:**
```json
{
  "repository": "opanel-mc/opanel",
  "total_files": 58,
  "total_size_mb": 1234.56,
  "versions": {
    "1.0.0rc7": [...],
    "1.0.0rc6": [...],
    "1.0.0rc5": [...]
  },
  "files": [...],
  "timestamp": "2025-10-07T15:40:21.123456"
}
```

#### 获取指定版本的缓存文件
```
GET /api/cached-files/{version}?repo={repository}
```
获取指定版本的所有缓存文件信息。

**参数:**
- `version`: 版本号，如 `1.0.0rc7`
- `repo` (可选): 仓库名称

**响应:**
```json
{
  "repository": "opanel-mc/opanel",
  "version": "1.0.0rc7",
  "total_files": 24,
  "total_size_mb": 531.11,
  "platforms": {
    "bukkit": [...],
    "fabric": [...],
    "forge": [...],
    "neoforge": [...],
    "folia": [...]
  },
  "files": [...],
  "timestamp": "2025-10-07T15:40:21.123456"
}
```

### 4. 文件下载

#### 下载缓存文件
```
GET /downloads/{repo}/{filename}
```
下载指定的缓存文件。

**参数:**
- `repo`: 仓库路径
- `filename`: 文件名

#### 下载版本文件
```
GET /api/download/{version}/{filename}
```
下载指定版本的文件。

**参数:**
- `version`: 版本号
- `filename`: 文件名

**响应:** 直接返回文件内容

### 5. 下载链接获取

#### 获取下载链接
```
GET /api/download?version={version}&repo={repository}&file_type={type}
```
获取文件的下载链接信息。

**参数:**
- `version`: 版本号
- `repo` (可选): 仓库名称
- `file_type` (可选): 文件类型，默认为 `zip`

### 6. 系统管理

#### 手动触发更新检查
```
POST /api/update-check?repo={repository}
```
手动触发GitHub版本更新检查。

#### 获取系统统计
```
GET /api/stats
```
获取缓存系统的统计信息。

**响应:**
```json
{
  "cache_stats": {
    "total_files": 58,
    "total_size_mb": 1234.56,
    "repositories": 1
  },
  "system_info": {
    "uptime": "1 day, 2 hours",
    "last_update_check": "2025-10-07T15:40:21.123456"
  }
}
```

## 错误响应

所有API在出错时返回标准HTTP状态码和错误信息：

```json
{
  "detail": "错误描述信息"
}
```

常见状态码：
- `200`: 成功
- `404`: 资源未找到
- `500`: 服务器内部错误

## 文件信息格式

缓存文件信息包含以下字段：

```json
{
  "name": "opanel-bukkit-1.21-build-1.0.0rc7.jar",
  "path": "cache/opanel-bukkit-1.21-build-1.0.0rc7.jar",
  "size": 22713923,
  "size_mb": 21.66,
  "modified_time": "2025-10-07T15:23:44.170707",
  "download_url": "/api/download/1.0.0rc7/opanel-bukkit-1.21-build-1.0.0rc7.jar",
  "platform": "bukkit",
  "mc_version": "1.21",
  "version": "1.0.0rc7"
}
```

## 使用示例

### 获取最新版本文件列表
```bash
curl http://localhost:8000/api/cached-files/1.0.0rc7
```

### 下载特定文件
```bash
curl http://localhost:8000/api/download/1.0.0rc7/opanel-bukkit-1.21-build-1.0.0rc7.jar -o opanel.jar
```

### 检查系统状态
```bash
curl http://localhost:8000/health
```