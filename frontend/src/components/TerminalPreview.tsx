import { X } from "lucide-react";
import { Button } from "./ui/button";

type TerminalPreviewProps = {
  command: string;
  open: boolean;
  onClose: () => void;
};

function mockOutput(command: string) {
  const normalized = command.toLowerCase();

  if (normalized.includes("ipconfig") || normalized.includes("ip addr")) {
    return ["Ethernet adapter Wi-Fi:", "IPv4 Address . . . . . . . . . . : 192.168.1.24", "Default Gateway . . . . . . . . : 192.168.1.1"];
  }

  if (normalized.includes("process") || normalized.includes("tasklist") || normalized.includes("ps")) {
    return ["PID    NAME              CPU", "1024   node.exe          2.1%", "2216   chrome.exe        8.4%", "3840   python.exe        0.7%"];
  }

  if (normalized.includes("find") || normalized.includes("dir") || normalized.includes("ls") || normalized.includes("tree")) {
    return ["file1.txt", "file2.py", "Documents/", "Downloads/"];
  }

  return ["Command queued for review.", "No real command was executed."];
}

export function TerminalPreview({ command, open, onClose }: TerminalPreviewProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6" role="dialog" aria-modal="true" aria-label="Terminal preview">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-white/10 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-300" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <Button variant="ghost" className="min-h-9 px-3" onClick={onClose} aria-label="Close preview">
            <X size={18} />
          </Button>
        </div>
        <pre className="max-h-[70vh] overflow-auto p-5 text-sm leading-7 text-cyan-100">
          <code>
            {`$ ${command}\n\n${mockOutput(command).join("\n")}`}
          </code>
        </pre>
      </div>
    </div>
  );
}
