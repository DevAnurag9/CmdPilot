import { Sparkles } from "lucide-react";

const examples = [
  "find files larger than 100MB",
  "show current IP address",
  "search for python files",
  "list hidden files",
  "find node_modules folders",
];

type EmptySuggestionsProps = {
  onPick: (prompt: string) => void;
};

export function EmptySuggestions({ onPick }: EmptySuggestionsProps) {
  return (
    <div className="rounded-lg border border-dashed border-white/15 bg-white/5 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-cyan-300/15 text-cyan-200">
        <Sparkles size={22} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">No commands yet</h3>
      <p className="mt-2 text-sm text-slate-400">Try asking:</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onPick(example)}
            className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-300/60 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300/50"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
