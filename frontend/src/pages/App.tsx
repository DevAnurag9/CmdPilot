import { Outlet } from "react-router-dom";
import { Nav } from "../components/Nav";

export default function App() {
  return (
    <div className="terminal-grid min-h-screen overflow-hidden bg-background text-foreground">
      <div className="app-ambient pointer-events-none fixed inset-0 -z-10" />
      <Nav />
      <Outlet />
    </div>
  );
}
