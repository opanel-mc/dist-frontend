"use client";

import { useEffect, useState } from "react";
import LogoIcon from "@/assets/logo.png";
import { DownloadButton } from "@/components/download-button";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import supportedVersionList from "@/data/supported-version-list.json";
import {
  fetchReleases,
  getLatestStableVersion,
  getLatestPreviewVersion,
  findAsset,
  getDownloadUrl,
  type ReleasesResponse,
} from "@/lib/api";

type Platform = keyof typeof supportedVersionList;

function getMinVersionForMcVersion(platform: Platform, mcVersion: string): string | null {
  const platformData = supportedVersionList[platform];
  for(const [minVersion, supportedVersions] of Object.entries(platformData)) {
    if(supportedVersions.includes(mcVersion)) {
      return minVersion;
    }
  }
  return null;
}

export default function Home() {
  const [platform, setPlatform] = useState<Platform | "">("");
  const [mcVersion, setMcVersion] = useState<string>("");
  const [releases, setReleases] = useState<ReleasesResponse | null>(null);
  const [releasesLoading, setReleasesLoading] = useState(true);

  const selectedPlatformData = platform ? supportedVersionList[platform] : null;
  const minVersion = platform && mcVersion ? getMinVersionForMcVersion(platform, mcVersion) : null;

  const latestStableVersion = releases ? getLatestStableVersion(releases) : null;
  const latestPreviewVersion = releases ? getLatestPreviewVersion(releases) : null;

  const stableAsset = releases && platform && minVersion && latestStableVersion
    ? findAsset(releases, latestStableVersion, platform, minVersion)
    : null;
  const previewAsset = releases && platform && minVersion && latestPreviewVersion
    ? findAsset(releases, latestPreviewVersion, platform, minVersion)
    : null;

  const handlePlatformChange = (value: Platform) => {
    setPlatform(value);
    setMcVersion("");
  };

  useEffect(() => {
    setReleasesLoading(true);
    fetchReleases()
      .then(setReleases)
      .catch(console.error)
      .finally(() => setReleasesLoading(false));
  }, []);

  return (
    <main className="flex flex-col items-center gap-2">
      <img
        src={LogoIcon.src}
        alt="opanel-logo"
        className="w-32 drop-shadow-2xl"
        style={{ imageRendering: "pixelated" }}/>
      <h1 className="text-xl font-semibold">OPanel 资源库</h1>

      <div className="w-72 mt-4 flex flex-col gap-2 *:w-full">
        <Select value={platform} onValueChange={handlePlatformChange}>
          <SelectTrigger>
            <SelectValue placeholder="请选择服务端平台..."/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bukkit">Bukkit / Spigot / Paper / Leaves</SelectItem>
            <SelectItem value="folia">Folia</SelectItem>
            <SelectItem value="fabric">Fabric</SelectItem>
            <SelectItem value="forge">Forge</SelectItem>
            <SelectItem value="neoforge">NeoForge</SelectItem>
          </SelectContent>
        </Select>

        {platform && (
          <Select value={mcVersion} onValueChange={setMcVersion}>
            <SelectTrigger>
              <SelectValue placeholder="请选择Minecraft版本..."/>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(selectedPlatformData ?? {}).flatMap(([, versions]) =>
                versions.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
      </div>

      {platform && mcVersion && (
        <div className="w-full mt-4 flex flex-col gap-4 [&_code]:font-(family-name:--font-google-sans-code)! [&_code]:text-xs">
          {releasesLoading ? (
            <div className="flex justify-center py-2">
              <Spinner className="size-5"/>
            </div>
          ) : (
            <>
              {stableAsset && latestStableVersion && (
                <DownloadButton
                  version={latestStableVersion}
                  label="稳定版"
                  isStable
                  link={getDownloadUrl(stableAsset.id)}
                  digest={stableAsset.digest}/>
              )}
              {previewAsset && latestPreviewVersion && (
                <DownloadButton
                  version={latestPreviewVersion}
                  label="预览版"
                  link={getDownloadUrl(previewAsset.id)}
                  digest={previewAsset.digest}/>
              )}
              {!stableAsset && !previewAsset && (
                <p className="text-center text-sm text-muted-foreground">此平台暂无可用下载</p>
              )}
            </>
          )}
        </div>
      )}
    </main>
  );
}
