import { useEffect } from "react";
import { DEFAULT_SETTINGS, SETTINGS_KEY } from "../lib/storage";
import { useLocalStorage } from "./useLocalStorage";

export function useSettings() {
  const [settings, setSettings] = useLocalStorage(SETTINGS_KEY, DEFAULT_SETTINGS);

  useEffect(() => {
    document.documentElement.classList.toggle("light", settings.theme === "light");
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
  }, [settings.theme]);

  return { settings, setSettings };
}
