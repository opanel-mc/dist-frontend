import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Footer } from "./footer";
import LogoIcon from "@/assets/logo.png";
import "./globals.css";
import { cn } from "@/lib/utils";
import { googleSansCode, notoSansSC } from "@/lib/fonts";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "OPanel 资源库",
  description: "在此下载OPanel的插件 / 模组文件",
  icons: LogoIcon.src
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-cn" suppressHydrationWarning>
      <body className={cn("flex flex-col justify-center items-center w-screen h-screen antialiased", notoSansSC.className, googleSansCode.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem>
          {children}
          <Footer />
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
