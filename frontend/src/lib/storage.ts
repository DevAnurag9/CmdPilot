import type { HistoryItem, Settings } from "./types";

export const HISTORY_KEY = "cmdpilot.history";
export const SETTINGS_KEY = "cmdpilot.settings";

export const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  autoCopy: false,
  saveHistory: true,
  preferredPlatform: "windows",
};

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function categorizePrompt(prompt: string) {
  const value = prompt.toLowerCase();

  if (value.includes("ip") || value.includes("network")) return "Network";
  if (value.includes("large") || value.includes("disk")) return "Disk";
  if (value.includes("process") || value.includes("running")) return "Process";
  if (value.includes("python") || value.includes("node_modules")) return "Search";
  if (value.includes("hidden") || value.includes("list")) return "Files";

  return "General";
}

export function createHistoryItem(
  prompt: string,
  platform: HistoryItem["platform"],
  suggestionsCount: number,
  blockedCount: number,
): HistoryItem {
  return {
    id: crypto.randomUUID(),
    prompt,
    platform,
    timestamp: new Date().toISOString(),
    suggestionsCount,
    blockedCount,
    category: categorizePrompt(prompt),
    favorite: false,
    pinned: false,
  };
}
