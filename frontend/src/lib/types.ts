import type { Platform, Suggestion } from "./api";

export type ThemeMode = "dark" | "light";

export type Settings = {
  theme: ThemeMode;
  autoCopy: boolean;
  saveHistory: boolean;
  preferredPlatform: Platform;
};

export type HistoryItem = {
  id: string;
  prompt: string;
  platform: Platform;
  timestamp: string;
  suggestionsCount: number;
  blockedCount: number;
  category: string;
  favorite: boolean;
  pinned: boolean;
};

export type SearchResult = {
  prompt: string;
  platform: Platform;
  suggestions: Suggestion[];
};
