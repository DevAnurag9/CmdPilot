type CommandCodeProps = {
  command: string;
};

export function CommandCode({ command }: CommandCodeProps) {
  const tokens = command.split(/(\s+)/);

  return (
    <code className="block overflow-x-auto whitespace-pre rounded-md border border-white/10 bg-slate-950 px-4 py-3 font-mono text-sm leading-6 text-slate-100">
      {tokens.map((token, index) => {
        const className = token.startsWith("-") || token.startsWith("/")
          ? "text-amber-200"
          : index === 0
            ? "text-cyan-200"
            : token.includes(".") || token.includes("/")
              ? "text-emerald-200"
              : "text-slate-100";

        return (
          <span key={`${token}-${index}`} className={className}>
            {token}
          </span>
        );
      })}
    </code>
  );
}
