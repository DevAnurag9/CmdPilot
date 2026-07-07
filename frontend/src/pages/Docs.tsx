import { Card } from "../components/ui/card";

const sections = [
  {
    title: "Installation",
    body: "Install backend dependencies, configure environment variables, and run the FastAPI and Vite servers in separate terminals.",
    code: `# Backend
cd backend
pip install -r requirements.txt

# Create .env
CMDPILOT_GROQ_API_KEY=your_groq_api_key

# Start API
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev`,
  },
  {
    title: "Usage",
    body: "Open the playground, enter a natural-language task, choose your platform, review the generated commands, and confirm or reject them.",
    code: `Examples:

find all python files
show current IP address
list hidden files
find files larger than 100MB
show running processes`,
  },
  {
    title: "API Reference",
    body: "The backend exposes command generation, explanations, and history management endpoints.",
    code: `POST   /generate-command
POST   /explain-command
GET    /history
DELETE /history
GET    /health`,
  },
  {
    title: "Environment Variables",
    body: "CmdPilot uses environment variables for configuration.",
    code: `# Backend (.env)
CMDPILOT_GROQ_API_KEY=your_groq_api_key
CMDPILOT_DATABASE_URL=./cmdpilot.db
CMDPILOT_ALLOWED_ORIGINS=["http://localhost:5173","https://cmd-pilot.vercel.app"]

# Frontend (.env)
VITE_API_URL=http://localhost:8000`,
  },
  {
    title: "Deployment",
    body: "Deploy the frontend on Vercel and the backend on Render.",
    code: `Frontend
Platform: Vercel
Root Directory: frontend
Build Command: npm run build
Output Directory: dist

Backend
Platform: Render
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command:
uvicorn app.main:app --host 0.0.0.0 --port $PORT`,
  },
];

export default function Docs() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold">Docs</h1>

      <p className="mt-3 text-slate-400">
        Everything needed to run, integrate, and deploy CmdPilot.
      </p>

      <div className="mt-8 space-y-5">
        {sections.map((section) => (
          <Card key={section.title}>
            <h2 className="text-2xl font-semibold">
              {section.title}
            </h2>

            <p className="mt-3 text-slate-400">
              {section.body}
            </p>

            <pre className="mt-4 overflow-x-auto rounded-md border border-white/10 bg-black/40 p-4 text-sm text-cyan-100">
              <code>{section.code}</code>
            </pre>
          </Card>
        ))}
      </div>
    </main>
  );
}