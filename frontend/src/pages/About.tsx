import { Card } from "../components/ui/card";

export default function About() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold">About CmdPilot</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
        CmdPilot is designed as a practical open-source portfolio project: local AI command
        generation, REST APIs, safety controls, persistence, CI, Docker, and deployment-ready
        frontend and backend services.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {["Human-in-the-loop", "Cross-platform", "Deployable"].map((item) => (
          <Card key={item}>
            <h2 className="text-xl font-semibold">{item}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Built to demonstrate engineering judgment, product thinking, and system design.
            </p>
          </Card>
        ))}
      </div>
    </main>
  );
}
