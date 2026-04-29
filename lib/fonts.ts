import localFont from "next/font/local";

export const notoSansSC = localFont({
  src: [{ path: "../assets/NotoSansSC-VariableFont_wght.ttf", style: "normal" }],
  fallback: ["notoColorEmoji"]
});

export const notoColorEmoji = localFont({
  src: [{ path: "../assets/NotoColorEmoji-Regular.ttf", style: "normal" }],
  variable: "--font-noto-color-emoji"
});

export const googleSansCode = localFont({
  src: [{ path: "../assets/GoogleSansCode-VariableFont_wght.ttf", style: "normal" }],
  variable: "--font-google-sans-code"
});
