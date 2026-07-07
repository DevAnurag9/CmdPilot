import { Outlet } from "react-router-dom";
import { Nav } from "../components/Nav";

export default function App() {
  return (
    <div className="terminal-grid min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(135deg,rgba(34,211,238,0.12),transparent_38%),linear-gradient(180deg,rgba(15,23,42,0.84),rgba(2,6,23,0.96))]" />
      <Nav />
      <Outlet />
    </div>
  );
}
