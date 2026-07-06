import { motion } from "framer-motion";
import { ArrowRight, Boxes, Database, Github, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { Link } from "react-router-dom";

import hero from "../assets/cmdpilot-hero.png";
import { AnimatedTerminal } from "../components/AnimatedTerminal";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

type Feature = [string, string, typeof Terminal];

const features: Feature[] = [
  ["Natural language", "Convert everyday requests into terminal-ready commands.", Terminal],
  ["Safety layer", "Block destructive commands and warn on risky operations.", ShieldCheck],
  ["Explainability", "Understand what each command does before you run it.", Sparkles],
  ["History", "Store prompts, commands, timestamps, and status in SQLite.", Database],
];

export default function Home() {
  return (
    <main>
      <section className="relative min-h-[calc(100vh-73px)] overflow-hidden terminal-grid">
        <img
          src={hero}
          alt="CmdPilot AI terminal product visual"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:px-8 lg:py-28">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
              Local AI command generation with human confirmation
            </p>
            <h1 className="text-5xl font-semibold tracking-normal text-white sm:text-6xl lg:text-7xl">
              CmdPilot
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A production-ready terminal copilot that turns natural language into safe,
              explainable commands for Windows, Linux, and macOS.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/playground"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Try Playground <ArrowRight size={18} />
              </Link>
              <Button variant="secondary">
                <Github size={18} /> Star on GitHub
              </Button>
            </div>
          </motion.div>
          <AnimatedTerminal />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map(([title, body, Icon]) => (
            <Card key={title as string}>
              <Icon className="mb-4 text-cyan-200" size={24} />
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-24 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Card>
          <Boxes className="mb-4 text-emerald-200" />
          <h2 className="text-2xl font-semibold">Architecture</h2>
          <p className="mt-3 text-slate-400">
            React frontend talks to a FastAPI service. The backend uses Ollama for local AI,
            applies a safety policy, explains commands, and persists command history in SQLite.
          </p>
        </Card>
        <Card>
          <h2 className="text-2xl font-semibold">Demo flow</h2>
          <div className="mt-4 rounded-md bg-black/40 p-4 font-mono text-sm text-cyan-100">
            ask: find large files<br />
            1. find . -type f -size +100M<br />
            2. du -ah . | sort -rh | head -20<br />
            execute? [Yes] [No]
          </div>
        </Card>
      </section>
    </main>
  );
}
