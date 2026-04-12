import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

export function DownloadButton({
  version,
  label,
  isStable = false,
  link,
}: {
  version: string
  label: string
  isStable?: boolean
  link: string
}) {
  return (
    <Button className="h-fit justify-between" variant={isStable ? "default" : "outline"} asChild>
      <Link href={link} target="_blank" className="no-underline">
        <Download />
        <div className="flex flex-col items-center gap-0.5">
          <span>OPanel <code>{version}</code></span>
          <span className={cn("text-xs", !isStable && "text-destructive")}>{label}</span>
        </div>
        <Download className="opacity-0"/>
      </Link>
    </Button>
  );
}
