const prompts = [
  "Find large files",
  "Check IP address",
  "Show running processes",
  "Search for python files",
  "List hidden files",
  "Find node_modules",
];

type ExamplePromptsProps = {
  onPick: (prompt: string) => void;
};

export function ExamplePrompts({ onPick }: ExamplePromptsProps) {
  return (
    <section aria-label="Example prompts">
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPick(prompt)}
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-300/60 hover:bg-cyan-300/10 focus:outline-none focus:ring-2 focus:ring-cyan-300/50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </section>
  );
}
