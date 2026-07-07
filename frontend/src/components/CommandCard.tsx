import { AlertTriangle, Check, CheckCircle2, Copy, Play, Share2, ShieldAlert, Star, Pin } from "lucide-react";
import type { Suggestion } from "../lib/api";
import { Button } from "./ui/button";
import { CommandCode } from "./CommandCode";

type CommandCardProps = {
  suggestion: Suggestion;
  copied: boolean;
  favorite: boolean;
  pinned: boolean;
  onCopy: () => void;
  onExecute: () => void;
  onShare: () => void;
  onFavorite: () => void;
  onPin: () => void;
};

export function CommandCard({
  suggestion,
  copied,
  favorite,
  pinned,
  onCopy,
  onExecute,
  onShare,
  onFavorite,
  onPin,
}: CommandCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-black/30 p-4 transition hover:border-cyan-300/30">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <CommandCode command={suggestion.command} />
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm ${
            suggestion.blocked
              ? "bg-rose-500/20 text-rose-200"
              : "bg-emerald-400/10 text-emerald-200"
          }`}
        >
          {suggestion.blocked ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
          {suggestion.blocked ? "Blocked" : "Review required"}
        </span>
      </div>

      <div className="mt-4 rounded-md border border-white/10 bg-white/[0.03] p-4">
        <h3 className="text-sm font-semibold text-slate-200">Explanation</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{suggestion.explanation}</p>
      </div>

      {(suggestion.blocked || suggestion.warnings.length > 0) && (
        <div className="mt-4 space-y-2" aria-label="Warnings">
          {suggestion.blocked && (
            <div className="flex items-center gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
              <ShieldAlert size={16} />
              Dangerous command blocked. This command cannot be executed.
            </div>
          )}
          {suggestion.warnings.map((warning) => (
            <div key={warning} className="flex items-center gap-2 rounded-md bg-amber-500/10 p-3 text-sm text-amber-100">
              <AlertTriangle size={16} />
              {warning}
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Button disabled={suggestion.blocked} onClick={onExecute} aria-label={`Preview execution for ${suggestion.command}`}>
          <Play size={16} />
          Execute
        </Button>
        <Button variant="secondary" onClick={onCopy} aria-label={`Copy ${suggestion.command}`}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button variant="secondary" onClick={onShare} aria-label={`Share ${suggestion.command}`}>
          <Share2 size={16} />
          Share
        </Button>
        <Button variant="ghost" onClick={onFavorite} aria-pressed={favorite} aria-label="Toggle favorite">
          <Star size={16} className={favorite ? "fill-amber-300 text-amber-300" : ""} />
        </Button>
        <Button variant="ghost" onClick={onPin} aria-pressed={pinned} aria-label="Toggle pinned command">
          <Pin size={16} className={pinned ? "fill-cyan-300 text-cyan-300" : ""} />
        </Button>
      </div>
    </article>
  );
}
