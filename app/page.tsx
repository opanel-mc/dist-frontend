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
  getPumpkinTargets,
  findAsset,
  getDownloadUrl,
  type ReleasesResponse,
} from "@/lib/api";
import { ReleasesContext } from "@/contexts/releases";
import { HistoryVersionsDialog } from "./history-versions-dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, HandCoins } from "lucide-react";
import { cn, formatPumpkinTarget, getMinVersionForMcVersion, Platform } from "@/lib/utils";
import { compareVersions } from "@/lib/version";
import Link from "next/link";
import { googleSansCode } from "@/lib/fonts";
import { PLATFORM_OPTIONS, SUPPORTED_PUMPKIN_VERSION } from "@/lib/global";

export default function Home() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [mcVersion, setMcVersion] = useState<string | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [releases, setReleases] = useState<ReleasesResponse | null>(null);
  const [releasesLoading, setReleasesLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedPlatformData = platform && platform !== "pumpkin" ? supportedVersionList[platform] : null;
  const minVersion = platform && platform !== "pumpkin" && mcVersion ? getMinVersionForMcVersion(platform, mcVersion) : null;
  const versionOrTarget = platform === "pumpkin" ? target : minVersion;
  const pumpkinTargets = releases ? getPumpkinTargets(releases) : [];

  const latestStableVersion = releases ? getLatestStableVersion(releases) : null;
  const latestPreviewVersion = releases ? getLatestPreviewVersion(releases) : null;
  const shouldShowPreview = latestPreviewVersion && compareVersions(latestPreviewVersion, latestStableVersion ?? "0.0.0") > 0;

  const stableAsset = releases && platform && versionOrTarget && latestStableVersion
    ? findAsset(releases, latestStableVersion, platform, versionOrTarget)
    : null;
  const previewAsset = releases && platform && versionOrTarget && latestPreviewVersion
    ? findAsset(releases, latestPreviewVersion, platform, versionOrTarget)
    : null;

  const handlePlatformChange = (value: Platform) => {
    setPlatform(value);
    setMcVersion("");
    setTarget("");
  };

  useEffect(() => {
    setReleasesLoading(true);
    fetchReleases()
      .then(setReleases)
      .catch(() => setErrorMessage("下载站服务维护中，暂时不可用"))
      .finally(() => setReleasesLoading(false));
  }, []);

  return (
    <ReleasesContext.Provider value={{ releases, platform, mcVersion, target }}>
      <main className="flex flex-col items-center gap-2">
        <img
          src={LogoIcon.src}
          alt="opanel-logo"
          className="w-32 drop-shadow-2xl"
          style={{ imageRendering: "pixelated" }}/>
        <h1 className="text-xl font-semibold">OPanel 资源库</h1>

        {errorMessage && (
          <span className="text-sm text-destructive">{errorMessage}</span>
        )}

        <div className="w-72 mt-4 flex flex-col gap-2 *:w-full">
          <Select value={platform ?? undefined} onValueChange={handlePlatformChange}>
            <SelectTrigger>
              <SelectValue placeholder="请选择服务端平台..."/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {PLATFORM_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {platform === "pumpkin" ? (
            <Select
              key="pumpkin-target"
              value={target ?? ""}
              onValueChange={setTarget}
              disabled={releasesLoading || pumpkinTargets.length === 0}>
              <SelectTrigger aria-label="目标平台" title={target || undefined}>
                <SelectValue placeholder={
                  releasesLoading
                    ? "正在加载目标平台..."
                    : !releases
                      ? "目标平台加载失败"
                      : pumpkinTargets.length === 0
                        ? "暂无可用目标平台"
                        : "请选择目标平台..."
                }/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {pumpkinTargets.map((value) => (
                    <SelectItem key={value} value={value}>
                      <span className="truncate">{formatPumpkinTarget(value)}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : platform && (
            <Select key="mc-version" value={mcVersion ?? ""} onValueChange={setMcVersion}>
              <SelectTrigger aria-label="Minecraft 版本">
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

        {platform && versionOrTarget && (
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
                {platform === "pumpkin" && (
                  <p className="text-center text-xs text-muted-foreground">
                    运行需要 Pumpkin
                    <Link
                      className="px-1 text-opanel"
                      href={`https://github.com/Pumpkin-MC/Pumpkin/releases/tag/${encodeURIComponent(SUPPORTED_PUMPKIN_VERSION)}`}
                      target="_blank"
                      rel="noopener noreferrer">
                      <code>{SUPPORTED_PUMPKIN_VERSION}</code>
                    </Link>
                    服务端
                  </p>
                )}
                <div className="mx-auto flex items-center gap-2">
                  <span className={cn("text-center text-xs", googleSansCode.className)}>
                    记得为 <Link href="https://github.com/opanel-mc/opanel" target="_blank">OPanel</Link> 点个star！
                  </span>
                  <Link href="https://github.com/opanel-mc/opanel" target="_blank">
                    <img src="https://img.shields.io/github/stars/opanel-mc/opanel.svg?label=Stars" alt="stars"/>
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
