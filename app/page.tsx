"use client";

import { useEffect, useState } from "react";
import LogoIcon from "@/assets/logo.png";
import { DownloadButton } from "@/components/download-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { latestPreviewVersion, latestStableVersion } from "@/lib/global";
import supportedVersionList from "@/data/supported-version-list.json";
import { getDownloadUrl } from "@/lib/api";

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
  const [stableUrl, setStableUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const selectedPlatformData = platform ? supportedVersionList[platform] : null;
  const minVersion = platform && mcVersion ? getMinVersionForMcVersion(platform, mcVersion) : null;

  const handlePlatformChange = (value: Platform) => {
    setPlatform(value);
    setMcVersion("");
  };

  const handleMcVersionChange = (value: string) => {
    setMcVersion(value);
  };

  useEffect(() => {
    if(!platform || !minVersion) return;

    setStableUrl(getDownloadUrl(platform, minVersion, latestStableVersion));
    if(latestPreviewVersion) {
      setPreviewUrl(getDownloadUrl(platform, minVersion, latestPreviewVersion));
    }
  }, [platform, minVersion]);

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
          <Select value={mcVersion} onValueChange={handleMcVersionChange}>
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
        <div className="w-full mt-4 flex flex-col gap-2 [&_code]:font-(family-name:--font-google-sans-code)! [&_code]:text-xs">
          <DownloadButton
            version={latestStableVersion}
            label="稳定版"
            isStable
            link={stableUrl ?? ""}/>
          {latestPreviewVersion && (
            <DownloadButton
              version={latestPreviewVersion}
              label="预览版"
              link={previewUrl ?? ""}/>
          )}
        </div>
      )}
    </main>
  );
}
