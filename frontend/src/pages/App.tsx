import { Outlet } from "react-router-dom";
import { Nav } from "../components/Nav";

export default function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.25),transparent_32%),radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.18),transparent_28%)]" />
      <Nav />
      <Outlet />
    </div>
  );
}
