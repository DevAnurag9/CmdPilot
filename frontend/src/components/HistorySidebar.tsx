import { Download, Pin, Search, Star, Trash2, Upload, X } from "lucide-react";
import type { HistoryItem } from "../lib/types";
import { Button } from "./ui/button";

type HistorySidebarProps = {
  history: HistoryItem[];
  query: string;
  open: boolean;
  onQueryChange: (query: string) => void;
  onRun: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onToggleFavorite: (id: string) => void;
  onTogglePin: (id: string) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onClose: () => void;
};

export function HistorySidebar({
  history,
  query,
  open,
  onQueryChange,
  onRun,
  onDelete,
  onClear,
  onToggleFavorite,
  onTogglePin,
  onExport,
  onImport,
  onClose,
}: HistorySidebarProps) {
  const ordered = [...history].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <aside
      className={`glass fixed inset-y-0 left-0 z-40 w-[min(88vw,22rem)] overflow-y-auto p-4 transition-transform lg:static lg:block lg:w-auto lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label="Recent searches"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Recent Searches</h2>
          <p className="text-sm text-slate-400">{history.length} saved</p>
        </div>
        <Button variant="ghost" className="lg:hidden" onClick={onClose} aria-label="Close history">
          <X size={18} />
        </Button>
      </div>

      <label className="mt-4 flex items-center gap-2 rounded-md border border-white/10 bg-black/20 px-3 py-2 focus-within:ring-2 focus-within:ring-cyan-300/50">
        <Search size={16} className="text-slate-400" />
        <span className="sr-only">Search history</span>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search history"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="secondary" className="min-h-9 px-3" onClick={onExport}>
          <Download size={15} />
          Export
        </Button>
        <label className="inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
          <Upload size={15} />
          Import
          <input
            type="file"
            accept="application/json"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onImport(file);
              event.currentTarget.value = "";
            }}
          />
        </label>
        <Button variant="ghost" className="min-h-9 px-3" onClick={onClear}>
          Clear all
        </Button>
      </div>

      <div className="mt-5 space-y-3">
        {ordered.length === 0 ? (
          <p className="rounded-md border border-dashed border-white/15 p-4 text-sm text-slate-400">No matching history yet.</p>
        ) : (
          ordered.map((item) => (
            <div key={item.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
              <button
                type="button"
                onClick={() => onRun(item)}
                className="block w-full text-left text-sm font-semibold text-white hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300/50"
              >
                {item.prompt}
              </button>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="capitalize">{item.platform}</span>
                <span>{new Date(item.timestamp).toLocaleString()}</span>
                <span>{item.category}</span>
              </div>
              <div className="mt-3 flex gap-1">
                <Button variant="ghost" className="min-h-8 px-2" onClick={() => onToggleFavorite(item.id)} aria-label="Toggle favorite">
                  <Star size={15} className={item.favorite ? "fill-amber-300 text-amber-300" : ""} />
                </Button>
                <Button variant="ghost" className="min-h-8 px-2" onClick={() => onTogglePin(item.id)} aria-label="Toggle pin">
                  <Pin size={15} className={item.pinned ? "fill-cyan-300 text-cyan-300" : ""} />
                </Button>
                <Button variant="ghost" className="min-h-8 px-2 text-rose-200" onClick={() => onDelete(item.id)} aria-label="Delete history item">
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
