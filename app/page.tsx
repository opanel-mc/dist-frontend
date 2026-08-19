"use client";

import { useEffect, useState } from "react";
import LogoIcon from "@/assets/logo.png";
import { DownloadButton } from "@/components/download-button";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import supportedVersionList from "@/data/supported-version-list.json";
import {
  fetchReleases,
  getLatestStableVersion,
  getLatestPreviewVersion,
  findAsset,
  getDownloadUrl,
  type ReleasesResponse,
} from "@/lib/api";
import { ReleasesContext } from "@/contexts/releases";
import { HistoryVersionsDialog } from "./history-versions-dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, HandCoins } from "lucide-react";
import { cn, getMinVersionForMcVersion, Platform } from "@/lib/utils";
import { compareVersions } from "@/lib/version";
import Link from "next/link";
import { googleSansCode } from "@/lib/fonts";

export default function Home() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [mcVersion, setMcVersion] = useState<string | null>(null);
  const [releases, setReleases] = useState<ReleasesResponse | null>(null);
  const [releasesLoading, setReleasesLoading] = useState(true);

  const selectedPlatformData = platform ? supportedVersionList[platform] : null;
  const minVersion = platform && mcVersion ? getMinVersionForMcVersion(platform, mcVersion) : null;

  const latestStableVersion = releases ? getLatestStableVersion(releases) : null;
  const latestPreviewVersion = releases ? getLatestPreviewVersion(releases) : null;
  const shouldShowPreview = latestPreviewVersion && compareVersions(latestPreviewVersion, latestStableVersion ?? "0.0.0") > 0;

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
    <ReleasesContext.Provider value={{ releases, platform, mcVersion }}>
      <main className="flex flex-col items-center gap-2">
        <img
          src={LogoIcon.src}
          alt="opanel-logo"
          className="w-32 drop-shadow-2xl"
          style={{ imageRendering: "pixelated" }}/>
        <h1 className="text-xl font-semibold">OPanel 资源库</h1>

        <div className="w-72 mt-4 flex flex-col gap-2 *:w-full">
          <Select value={platform ?? undefined} onValueChange={handlePlatformChange}>
            <SelectTrigger>
              <SelectValue placeholder="请选择服务端平台..."/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="paper">Paper / Leaves</SelectItem>
                <SelectItem value="folia">Folia</SelectItem>
                <SelectItem value="fabric">Fabric</SelectItem>
                <SelectItem value="forge">Forge</SelectItem>
                <SelectItem value="neoforge">NeoForge</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {platform && (
            <Select value={mcVersion ?? undefined} onValueChange={setMcVersion}>
              <SelectTrigger>
                <SelectValue placeholder="请选择Minecraft版本..."/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(selectedPlatformData ?? {}).flatMap(([, versions]) => (
                    [...versions]
                      .reverse()
                      .map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))
                  ))}
                </SelectGroup>
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
                    link={getDownloadUrl(stableAsset.opanelVersion, stableAsset.name)}/>
                )}
                {previewAsset && latestPreviewVersion && shouldShowPreview && (
                  <DownloadButton
                    version={latestPreviewVersion}
                    label="预览版"
                    link={getDownloadUrl(previewAsset.opanelVersion, previewAsset.name)}/>
                )}
                {!stableAsset && !previewAsset && (
                  <p className="text-center text-sm text-muted-foreground">此平台暂无可用下载</p>
                )}
                <div className="flex justify-center gap-2">
                  <Button variant="link" size="sm" asChild>
                    <Link href="https://nocp.space/donate" target="_blank" className="text-opanel! no-underline hover:decoration-[0.5px]!">
                      <HandCoins />
                      支持作者
                    </Link>
                  </Button>
                  <HistoryVersionsDialog>
                    <Button variant="link" size="sm" className="text-opanel">
                      历史版本
                      <ArrowRight />
                    </Button>
                  </HistoryVersionsDialog>
                </div>
                <div className="mx-auto flex items-center gap-2">
                  <span className={cn("text-center text-xs", googleSansCode.className)}>
                    记得为 <Link href="https://github.com/opanel-mc/opanel" target="_blank">OPanel</Link> 点个star！
                  </span>
                  <Link href="https://github.com/opanel-mc/opanel" target="_blank">
                    <img src="https://img.shields.io/github/stars/opanel-mc/opanel.svg?label=Stars"/>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </ReleasesContext.Provider>
  );
}
