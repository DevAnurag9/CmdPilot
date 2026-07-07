import { BarChart3, Ban, Command, Monitor, Search } from "lucide-react";
import { Card } from "../components/ui/card";
import { HISTORY_KEY } from "../lib/storage";
import type { HistoryItem } from "../lib/types";
import { useLocalStorage } from "../hooks/useLocalStorage";

function mostCommon(values: string[]) {
  const counts = values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "None";
}

export default function Dashboard() {
  const [history] = useLocalStorage<HistoryItem[]>(HISTORY_KEY, []);
  const totalSearches = history.length;
  const commandsGenerated = history.reduce((sum, item) => sum + item.suggestionsCount, 0);
  const blockedCommands = history.reduce((sum, item) => sum + item.blockedCount, 0);
  const mostUsedPlatform = mostCommon(history.map((item) => item.platform));
  const mostSearchedQuery = mostCommon(history.map((item) => item.prompt));

  const stats = [
    { label: "Total searches", value: totalSearches, icon: Search },
    { label: "Commands generated", value: commandsGenerated, icon: Command },
    { label: "Most used platform", value: mostUsedPlatform, icon: Monitor },
    { label: "Most searched query", value: mostSearchedQuery, icon: BarChart3 },
    { label: "Blocked commands", value: blockedCommands, icon: Ban },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold sm:text-4xl">Analytics</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Local usage metrics for searches, generated commands, platforms, and safety blocks.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-cyan-300/15 text-cyan-200">
              <stat.icon size={20} />
            </div>
            <p className="mt-5 text-sm text-slate-400">{stat.label}</p>
            <p className="mt-2 break-words text-2xl font-semibold text-white">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h2 className="text-xl font-semibold">Command categories</h2>
        <div className="mt-5 space-y-3">
          {Object.entries(
            history.reduce<Record<string, number>>((acc, item) => {
              acc[item.category] = (acc[item.category] ?? 0) + 1;
              return acc;
            }, {}),
          ).map(([category, count]) => (
            <div key={category}>
              <div className="flex justify-between text-sm">
                <span>{category}</span>
                <span className="text-slate-400">{count}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-cyan-300"
                  style={{ width: `${Math.max(8, (count / Math.max(1, totalSearches)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <p className="rounded-md border border-dashed border-white/15 p-5 text-sm text-slate-400">
              Analytics will appear after you generate commands in the playground.
            </p>
          )}
        </div>
      </Card>
    </main>
  );
}
