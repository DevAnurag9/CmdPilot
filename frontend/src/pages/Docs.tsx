import { Card } from "../components/ui/card";

const sections = [
  {
    title: "Installation",
    body: "Install Ollama, pull qwen3:4b, install backend requirements, then run FastAPI and Vite in separate terminals.",
    code: "ollama pull qwen3:4b\ncd backend\npip install -r requirements.txt\nuvicorn app.main:app --reload",
  },
  {
    title: "Usage",
    body: "Open the playground, enter a natural-language task, choose your platform, review suggestions, then confirm or reject.",
    code: "cd frontend\nnpm install\nnpm run dev",
  },
  {
    title: "API Reference",
    body: "The backend exposes command generation, explanation, history listing, and history clearing endpoints.",
    code: "POST /generate-command\nPOST /explain-command\nGET /history\nDELETE /history",
  },
];

export default function Docs() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold">Docs</h1>
      <p className="mt-3 text-slate-400">Everything needed to run, integrate, and deploy CmdPilot.</p>
      <div className="mt-8 space-y-5">
        {sections.map((section) => (
          <Card key={section.title}>
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            <p className="mt-3 text-slate-400">{section.body}</p>
            <pre className="mt-4 overflow-x-auto rounded-md bg-black/40 p-4 text-sm text-cyan-100">
              <code>{section.code}</code>
            </pre>
          </Card>
        ))}
      </div>
    </main>
  );
}
