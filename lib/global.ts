export const SERVICE_BASE_URL = process.env["NEXT_PUBLIC_SERVICE_BASE_URL"] ?? "";

export const PAPER_MIGRATION_VERSION = "2.2.0-pre1";
export const SUPPORTED_PUMPKIN_VERSION = "0.2.0+26.3-26.51";

export const PLATFORM_OPTIONS = [
  { value: "paper", label: "Paper / Leaves" },
  { value: "folia", label: "Folia" },
  { value: "fabric", label: "Fabric" },
  { value: "forge", label: "Forge" },
  { value: "neoforge", label: "NeoForge" },
  { value: "pumpkin", label: "Pumpkin" },
] as const;

export const PUMPKIN_TARGET_LABELS: Record<string, string> = {
  "x86_64-unknown-linux-gnu": "Linux（x64）",
  "aarch64-unknown-linux-gnu": "Linux（ARM64）",
  "x86_64-pc-windows-msvc": "Windows（x64）",
  "x86_64-apple-darwin": "MacOS（Intel）",
  "aarch64-apple-darwin": "MacOS（Apple Silicon）",
} as const;

export const COPYRIGHT_YEAR = 2026;
