import { googleSansCode } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Footer() {
  return (
    <footer className={cn("py-7 flex flex-col items-center gap-2 [&>span]:text-xs [&>span]:text-muted-foreground", googleSansCode.className)}>
      <span>
        Maintained by <Link href="https://github.com/NriotHrreion" target="_blank">Norcleeh</Link> and <Link href="https://github.com/HUGO123-yg" target="_blank">Hugo</Link>
      </span>
      <span>
        Copyright (c) 2026 <Link href="https://opanel.cn" target="_blank">OPanel Project</Link>
      </span>
    </footer>
  );
}
