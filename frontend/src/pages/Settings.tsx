import type { Platform } from "../lib/api";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useSettings } from "../hooks/useSettings";

const platforms: Platform[] = ["windows", "linux", "macos"];

export default function Settings() {
  const { settings, setSettings } = useSettings();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold sm:text-4xl">Settings</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Tune CmdPilot defaults for theme, copying, history, and platform preferences.
        </p>
      </div>

      <div className="space-y-5">
        <Card>
          <h2 className="text-xl font-semibold">Appearance</h2>
          <div className="mt-4 grid grid-cols-2 gap-2" role="group" aria-label="Theme">
            {(["dark", "light"] as const).map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => setSettings((current) => ({ ...current, theme }))}
                className={`rounded-md border px-4 py-3 text-sm capitalize transition focus:outline-none focus:ring-2 focus:ring-cyan-300/50 ${
                  settings.theme === theme
                    ? "border-cyan-300 bg-cyan-300 text-slate-950"
                    : "border-white/10 bg-white/5 text-slate-200"
                }`}
                aria-pressed={settings.theme === theme}
              >
                {theme} mode
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Workflow</h2>
          <div className="mt-5 space-y-4">
            <label className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-black/20 p-4">
              <span>
                <span className="block font-medium">Auto-copy first safe command</span>
                <span className="text-sm text-slate-400">Copy the first generated command after each search.</span>
              </span>
              <input
                type="checkbox"
                checked={settings.autoCopy}
                onChange={(event) => setSettings((current) => ({ ...current, autoCopy: event.target.checked }))}
                className="h-5 w-5 accent-cyan-300"
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-black/20 p-4">
              <span>
                <span className="block font-medium">Save history</span>
                <span className="text-sm text-slate-400">Persist prompt, platform, timestamp, and safety metadata locally.</span>
              </span>
              <input
                type="checkbox"
                checked={settings.saveHistory}
                onChange={(event) => setSettings((current) => ({ ...current, saveHistory: event.target.checked }))}
                className="h-5 w-5 accent-cyan-300"
              />
            </label>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold">Preferred platform</h2>
          <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Preferred platform">
            {platforms.map((platform) => (
              <button
                key={platform}
                type="button"
                onClick={() => setSettings((current) => ({ ...current, preferredPlatform: platform }))}
                className={`rounded-md border px-4 py-3 text-sm capitalize transition focus:outline-none focus:ring-2 focus:ring-cyan-300/50 ${
                  settings.preferredPlatform === platform
                    ? "border-cyan-300 bg-cyan-300 text-slate-950"
                    : "border-white/10 bg-white/5 text-slate-200"
                }`}
                aria-pressed={settings.preferredPlatform === platform}
              >
                {platform}
              </button>
            ))}
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            variant="secondary"
            onClick={() =>
              setSettings({
                theme: "dark",
                autoCopy: false,
                saveHistory: true,
                preferredPlatform: "windows",
              })
            }
          >
            Reset settings
          </Button>
        </div>
      </div>
    </main>
  );
}
