import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function AnimatedTerminal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="glass overflow-hidden rounded-lg"
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-rose-400" />
        <span className="h-3 w-3 rounded-full bg-amber-300" />
        <span className="h-3 w-3 rounded-full bg-emerald-300" />
      </div>
      <div className="space-y-4 p-5 font-mono text-sm">
        <p className="text-slate-400">Ask</p>
        <p className="text-white">how to list all files with details</p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.5, duration: 1.1 }}
          className="h-px bg-cyan-300"
        />
        <p className="text-slate-400">Suggested command</p>
        <p className="text-cyan-200">ls -la</p>
        <div className="flex items-center gap-2 rounded-md border border-emerald-300/30 bg-emerald-300/10 p-3 text-emerald-100">
          <ShieldCheck size={18} />
          Requires confirmation before execution
        </div>
      </div>
    </motion.div>
  );
}
