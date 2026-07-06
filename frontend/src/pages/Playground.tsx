import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  Copy,
  Check,
} from "lucide-react";

import { generateCommand, type Platform, type Suggestion } from "../lib/api";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function Playground() {
  const [prompt, setPrompt] = useState("show all files");
  const [platform, setPlatform] = useState<Platform>("windows");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  async function submit() {
    setLoading(true);
    setError("");

    try {
      const data = await generateCommand(prompt, platform);
      setSuggestions(data.suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function copyCommand(command: string) {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(command);

      setTimeout(() => {
        setCopied("");
      }, 1500);
    } catch {
      setError("Failed to copy command.");
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold">Playground</h1>

        <p className="mt-3 max-w-2xl text-slate-400">
          Generate command suggestions, inspect safety warnings, and choose
          whether to execute. CmdPilot never runs a command without
          confirmation.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* LEFT PANEL */}
        <Card>
          <label
            htmlFor="prompt"
            className="text-sm font-medium text-slate-300"
          >
            Ask
          </label>

          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-3 min-h-32 w-full resize-none rounded-md border border-white/10 bg-black/30 p-4 text-white outline-none ring-cyan-300/40 focus:ring-2"
          />

          <div className="mt-5 grid grid-cols-3 gap-2">
            {(["windows", "linux", "macos"] as Platform[]).map((item) => (
              <button
                key={item}
                onClick={() => setPlatform(item)}
                className={`rounded-md border px-3 py-2 text-sm capitalize transition ${
                  platform === item
                    ? "border-cyan-300 bg-cyan-300 text-slate-950"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <Button
            onClick={submit}
            disabled={loading || prompt.trim().length < 2}
            className="mt-6 w-full"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            Generate suggestions
          </Button>

          {error && (
            <p className="mt-4 text-sm text-rose-300">
              {error}
            </p>
          )}
        </Card>

        {/* RIGHT PANEL */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Suggested commands
              </h2>

              {suggestions.length > 0 && (
                <p className="mt-1 text-sm text-slate-400">
                  {suggestions.length} suggestion
                  {suggestions.length > 1 ? "s" : ""}
                </p>
              )}
            </div>

            <span
              className={`rounded-md px-3 py-1 text-xs uppercase tracking-wide ${
                suggestions.some((s) => s.blocked)
                  ? "bg-rose-500/20 text-rose-300"
                  : "bg-white/10 text-slate-300"
              }`}
            >
              {suggestions.some((s) => s.blocked)
                ? "dangerous command detected"
                : "confirmation required"}
            </span>
          </div>

          <div className="space-y-4">
            {suggestions.length === 0 ? (
              <div className="rounded-md border border-dashed border-white/15 p-8 text-center text-slate-400">
                Generated commands will appear here.
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion.command}-${index}`}
                  className="rounded-lg border border-white/10 bg-black/30 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <code className="text-lg text-cyan-200">
                      {suggestion.command}
                    </code>

                    {suggestion.blocked ? (
                      <span className="inline-flex items-center gap-2 rounded-md bg-rose-500/20 px-3 py-1 text-sm text-rose-300">
                        <ShieldAlert size={16} />
                        Dangerous
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-md bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">
                        <CheckCircle2 size={16} />
                        Review required
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {suggestion.explanation}
                  </p>

                  {suggestion.blocked && (
                    <div className="mt-4 rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
                      ⚠ Dangerous command blocked. This command cannot be
                      executed.
                    </div>
                  )}

                  {suggestion.warnings.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {suggestion.warnings.map((warning) => (
                        <div
                          key={warning}
                          className="flex items-center gap-2 rounded-md bg-amber-500/10 p-3 text-sm text-amber-200"
                        >
                          <AlertTriangle size={16} />
                          {warning}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button
  disabled={suggestion.blocked}
  className={`min-w-24 ${
    suggestion.blocked
      ? "pointer-events-none opacity-40"
      : ""
  }`}
  onClick={() => {
    copyCommand(suggestion.command);
    alert("Command copied to clipboard!");
  }}
>
  Execute
</Button>
                    <Button
                      variant="secondary"
                      className="min-w-24"
                    >
                      No
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() =>
                        copyCommand(suggestion.command)
                      }
                    >
                      {copied === suggestion.command ? (
                        <>
                          <Check size={16} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}