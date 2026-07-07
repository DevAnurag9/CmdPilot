import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, Wand2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { generateCommand, type Platform, type Suggestion } from "../lib/api";
import { createHistoryItem, HISTORY_KEY } from "../lib/storage";
import type { HistoryItem } from "../lib/types";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { CommandCard } from "../components/CommandCard";
import { EmptySuggestions } from "../components/EmptySuggestions";
import { ExamplePrompts } from "../components/ExamplePrompts";
import { HistorySidebar } from "../components/HistorySidebar";
import { SuggestionSkeletons, ThinkingState } from "../components/LoadingState";
import { TerminalPreview } from "../components/TerminalPreview";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useSettings } from "../hooks/useSettings";

const platforms: Platform[] = ["windows", "linux", "macos"];

export default function Playground() {
  const { settings } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const [prompt, setPrompt] = useState(searchParams.get("q") ?? "show all files");
  const [platform, setPlatform] = useState<Platform>(
    (searchParams.get("platform") as Platform | null) ?? settings.preferredPlatform,
  );
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [history, setHistory] = useLocalStorage<HistoryItem[]>(HISTORY_KEY, []);
  const [historyQuery, setHistoryQuery] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [previewCommand, setPreviewCommand] = useState("");
  const firstResultRef = useRef<HTMLDivElement | null>(null);

  const currentHistory = history.find(
    (item) => item.prompt === prompt && item.platform === platform,
  );

  const filteredHistory = useMemo(() => {
    const query = historyQuery.trim().toLowerCase();
    if (!query) return history;
    return history.filter((item) =>
      [item.prompt, item.platform, item.category].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [history, historyQuery]);

  async function copyCommand(command: string) {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(command);
      window.setTimeout(() => setCopied(""), 1500);
    } catch {
      setError("Failed to copy command.");
    }
  }

  async function submit(options: { focusResult?: boolean } = {}) {
    if (prompt.trim().length < 2 || loading) return;

    setLoading(true);
    setError("");
    setSearchParams({ q: prompt, platform });

    try {
      const data = await generateCommand(prompt, platform);
      setSuggestions(data.suggestions);

      const blockedCount = data.suggestions.filter((item) => item.blocked).length;
      if (settings.saveHistory) {
        setHistory((items) => [
          createHistoryItem(prompt, platform, data.suggestions.length, blockedCount),
          ...items.filter((item) => !(item.prompt === prompt && item.platform === platform)),
        ].slice(0, 50));
      }

      if (settings.autoCopy) {
        const firstSafeCommand = data.suggestions.find((item) => !item.blocked)?.command;
        if (firstSafeCommand) await copyCommand(firstSafeCommand);
      }

      if (options.focusResult) {
        window.setTimeout(() => firstResultRef.current?.focus(), 100);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function updateHistory(id: string, changes: Partial<HistoryItem>) {
    setHistory((items) =>
      items.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  }

  function runHistoryItem(item: HistoryItem) {
    setPrompt(item.prompt);
    setPlatform(item.platform);
    setHistoryOpen(false);
  }

  function exportHistory() {
    const blob = new Blob([JSON.stringify(history, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cmdpilot-history.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importHistory(file: File) {
    try {
      const imported = JSON.parse(await file.text()) as HistoryItem[];
      if (!Array.isArray(imported)) throw new Error("Invalid history file");
      setHistory(imported);
    } catch {
      setError("Could not import history JSON.");
    }
  }

  function shareCommand(command: string) {
    const url = new URL(window.location.href);
    url.pathname = "/playground";
    url.searchParams.set("q", prompt);
    url.searchParams.set("platform", platform);
    url.searchParams.set("command", command);
    void copyCommand(url.toString());
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPrompt("");
        setError("");
      }

      if (event.key === "Enter" && (event.target as HTMLElement).tagName === "TEXTAREA") {
        event.preventDefault();
        void submit({ focusResult: event.ctrlKey || event.metaKey });
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">Playground</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Generate command suggestions, inspect safety warnings, and preview mocked execution before anything touches a terminal.
          </p>
        </div>
        <Button variant="secondary" className="lg:hidden" onClick={() => setHistoryOpen(true)}>
          <Menu size={18} />
          History
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <HistorySidebar
          history={filteredHistory}
          query={historyQuery}
          open={historyOpen}
          onQueryChange={setHistoryQuery}
          onRun={runHistoryItem}
          onDelete={(id) => setHistory((items) => items.filter((item) => item.id !== id))}
          onClear={() => setHistory([])}
          onToggleFavorite={(id) => {
            const item = history.find((entry) => entry.id === id);
            if (item) updateHistory(id, { favorite: !item.favorite });
          }}
          onTogglePin={(id) => {
            const item = history.find((entry) => entry.id === id);
            if (item) updateHistory(id, { pinned: !item.pinned });
          }}
          onExport={exportHistory}
          onImport={importHistory}
          onClose={() => setHistoryOpen(false)}
        />

        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <Card>
            <label htmlFor="prompt" className="text-sm font-medium text-slate-300">
              Ask
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="mt-3 min-h-32 w-full resize-none rounded-md border border-white/10 bg-black/30 p-4 text-white outline-none ring-cyan-300/40 transition focus:ring-2"
              aria-describedby="prompt-help"
            />
            <p id="prompt-help" className="mt-2 text-xs text-slate-500">
              Press Enter to generate, Ctrl+Enter to focus results, or Esc to clear.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2" role="group" aria-label="Platform">
              {platforms.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPlatform(item)}
                  className={`rounded-md border px-3 py-2 text-sm capitalize transition focus:outline-none focus:ring-2 focus:ring-cyan-300/50 ${
                    platform === item
                      ? "border-cyan-300 bg-cyan-300 text-slate-950"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                  aria-pressed={platform === item}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <ExamplePrompts onPick={setPrompt} />
            </div>

            <Button
              onClick={() => void submit()}
              disabled={loading || prompt.trim().length < 2}
              className="mt-6 w-full"
            >
              <Wand2 size={18} />
              {loading ? "Generating..." : "Generate suggestions"}
            </Button>

            <div className="mt-4 min-h-20">
              {loading && <ThinkingState />}
              {error && <p className="rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Suggested commands</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {loading ? "Generating commands..." : `${suggestions.length} suggestion${suggestions.length === 1 ? "" : "s"}`}
                </p>
              </div>
              <span
                className={`rounded-md px-3 py-1 text-xs uppercase tracking-wide ${
                  suggestions.some((item) => item.blocked)
                    ? "bg-rose-500/20 text-rose-200"
                    : "bg-white/10 text-slate-300"
                }`}
              >
                {suggestions.some((item) => item.blocked) ? "blocked" : "confirmation required"}
              </span>
            </div>

            {loading ? (
              <SuggestionSkeletons />
            ) : suggestions.length === 0 ? (
              <EmptySuggestions onPick={setPrompt} />
            ) : (
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion.command}-${index}`}
                    ref={index === 0 ? firstResultRef : undefined}
                    tabIndex={index === 0 ? -1 : undefined}
                    className="rounded-lg outline-none focus:ring-2 focus:ring-cyan-300/50"
                  >
                    <CommandCard
                      suggestion={suggestion}
                      copied={copied === suggestion.command}
                      favorite={currentHistory?.favorite ?? false}
                      pinned={currentHistory?.pinned ?? false}
                      onCopy={() => void copyCommand(suggestion.command)}
                      onExecute={() => setPreviewCommand(suggestion.command)}
                      onShare={() => shareCommand(suggestion.command)}
                      onFavorite={() => currentHistory && updateHistory(currentHistory.id, { favorite: !currentHistory.favorite })}
                      onPin={() => currentHistory && updateHistory(currentHistory.id, { pinned: !currentHistory.pinned })}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <TerminalPreview
        command={previewCommand}
        open={previewCommand.length > 0}
        onClose={() => setPreviewCommand("")}
      />
    </main>
  );
}
