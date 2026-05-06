import type { ReleasesResponse } from "@/lib/api";
import { Platform } from "@/lib/utils";
import { createContext } from "react";

interface ReleasesContextType {
  releases: ReleasesResponse | null;
  platform: Platform | null;
  mcVersion: string | null;
}

export const ReleasesContext = createContext<ReleasesContextType>(undefined!);
