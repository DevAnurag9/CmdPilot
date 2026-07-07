import { Loader2 } from "lucide-react";

export function ThinkingState() {
  return (
    <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4" role="status" aria-live="polite">
      <div className="flex items-center gap-3 text-cyan-100">
        <Loader2 className="animate-spin" size={20} />
        <div>
          <p className="font-semibold">Thinking...</p>
          <p className="text-sm text-slate-300">Generating commands...</p>
        </div>
      </div>
    </div>
  );
}

export function SuggestionSkeletons() {
  return (
    <div className="space-y-4" aria-hidden="true">
      {[0, 1, 2].map((item) => (
        <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="h-12 animate-pulse rounded-md bg-white/10" />
          <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-white/10" />
          <div className="mt-5 flex gap-2">
            <div className="h-10 w-24 animate-pulse rounded-md bg-white/10" />
            <div className="h-10 w-24 animate-pulse rounded-md bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
