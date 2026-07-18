# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OPanel Resource Library - a download page for OPanel Minecraft plugin/mod. Built with Next.js 15 App Router.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build with Turbopack
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **UI**: Tailwind CSS 4, Radix UI components, class-variance-authority
- **Fonts**: Local fonts loaded via `next/font/local` (GoogleSansCode, NotoSansSC, NotoColorEmoji)

## Architecture

- `app/page.tsx` - Main page component ("use client"), contains platform/version selectors and download buttons
- `app/layout.tsx` - Root layout with metadata, fonts, and global structure
- `app/footer.tsx` - Footer component with copyright
- `app/globals.css` - Tailwind 4 theme using CSS variables, supports dark mode via `.dark` class
- `components/ui/*` - Wrappers around Radix UI primitives (button, select, label, table, badge, spinner, switch)
- `components/download-button.tsx` - Reusable download button with version display
- `lib/utils.ts` - Utilities: `cn()` (clsx+twMerge), `copyToClipboard()`, `isPreviewVersion()`
- `lib/fonts.ts` - Local font definitions exported as Next.js font objects
- `lib/global.ts` - Version constants: `latestStableVersion`, `latestPreviewVersion`
- `data/supported-version-list.json` - Supported platforms and versions data

## Download File Naming Convention

OPanel download files follow the format:
```
opanel-<服务端>-<最低支持版本>-build-<OPanel版本>.jar
```

Example: `opanel-paper-1.21.9-build-2.2.0-pre1.jar`

Paper platform assets use `bukkit` in filenames before OPanel `2.2.0-pre1`, and
`paper` starting from `2.2.0-pre1`. The frontend platform identifier is `paper`;
the API asset lookup in `lib/api.ts` handles the historical filename mapping.

In `data/supported-version-list.json`:
- **Key** = platform identifier (paper, fabric, forge, neoforge, folia)
- **Sub-key** = "最低支持版本" (minimum supported MC version) used in the filename
- **Value** = array of all MC versions that file supports

When a user selects a platform and MC version in the Select components, the app needs to find the appropriate download file by matching the MC version to the correct "最低支持版本" key.

## Important Patterns

- Path alias: `@/*` maps to root (defined in tsconfig.json)
- Tailwind 4 uses `@import "tailwindcss"` with `@theme inline` for CSS variable definitions
- Components use `cn()` from `lib/utils.ts` for conditional class merging
- Version checking: `isPreviewVersion()` returns true for versions containing "pre" or "rc"
- Semver comparisons use `lib/version.ts`, which normalizes legacy preview versions such as
  `1.0.0rc8` and `1.0.0pre1` by inserting the missing hyphen, without changing the version
  shown to users or used as an API key.
