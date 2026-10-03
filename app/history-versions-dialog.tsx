import { useContext, type PropsWithChildren } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReleasesContext } from "@/contexts/releases";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { getAssetList, getDownloadUrl, ReleaseAsset } from "@/lib/api";
import { cn, formatDataSize, formatPumpkinTarget, getMinVersionForMcVersion, isPreviewVersion } from "@/lib/utils";
import { googleSansCode } from "@/lib/fonts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const columns: ColumnDef<ReleaseAsset>[] = [
  {
    accessorKey: "opanelVersion",
    header: "版本"
  },
  {
    id: "tag",
    header: "",
    cell: ({ row }) => (
      isPreviewVersion(row.original.opanelVersion)
      ? <Badge className="bg-background text-destructive">预览版</Badge>
      : <Badge>稳定版</Badge>
    )
  },
  {
    accessorKey: "size",
    header: "大小",
    cell: ({ row }) => (
      <span className={cn("text-xs", googleSansCode.className)}>
        {formatDataSize(row.original.size)}
      </span>
    )
  },
  {
    id: "controls",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon-xs"
          asChild>
          <Link href={getDownloadUrl(row.original.opanelVersion, row.original.name)} target="_blank">
            <Download />
          </Link>
        </Button>
      </div>
    )
  }
];

export function HistoryVersionsDialog({ children }: PropsWithChildren) {
  const { releases, platform, mcVersion, target } = useContext(ReleasesContext);
  const minVersion = platform && platform !== "pumpkin" && mcVersion ? getMinVersionForMcVersion(platform, mcVersion) : null;
  const versionOrTarget = platform === "pumpkin" ? target : minVersion;

  if(!releases || !platform || !versionOrTarget) return <></>;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>历史版本</DialogTitle>
          <DialogDescription>
            {`${platform} ${platform === "pumpkin" ? formatPumpkinTarget(versionOrTarget) : mcVersion}`}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto pr-2">
          <DataTable
            columns={columns}
            data={getAssetList(releases, platform, versionOrTarget)}/>
        </div>
      </DialogContent>
    </Dialog>
  );
}
