import Link from "next/link";
import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";
import { Button } from "./ui/button";
import { googleSansCode } from "@/lib/fonts";

export function DownloadButton({
  version,
  label,
  isStable = false,
  link,
  digest,
}: {
  version: string
  label: string
  isStable?: boolean
  link: string
  digest?: string
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(digest!);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-72 flex flex-col items-center gap-2">
      <Button className="w-full h-fit justify-between" variant={isStable ? "default" : "outline"} asChild>
        <Link href={link} target="_blank" className="no-underline">
          <Download />
          <div className="flex flex-col items-center gap-0.5">
            <span>OPanel <code>{version}</code></span>
            <span className={cn("text-xs", !isStable && "text-destructive")}>{label}</span>
          </div>
          <Download className="opacity-0"/>
        </Link>
      </Button>
      {digest && (
        <div className="w-7/8 flex items-center gap-1">
          <span className={cn("text-xs text-muted-foreground truncate", googleSansCode.className)}>
            {digest}
          </span>
          <button
            className="cursor-pointer"
            onClick={() => handleCopy()}>
            {
              copied
              ? <Check size={12} stroke="var(--color-muted-foreground)"/>
              : <Copy size={12} stroke="var(--color-muted-foreground)"/>
            }
          </button>
        </div>
      )}
    </div>
  );
}
