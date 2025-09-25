import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "./footer";
import LogoIcon from "@/assets/logo.png";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="zh-cn">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main className="h-screen px-[400px] max-xl:px-[300px] max-lg:px-20 max-md:px-11 py-10">
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
