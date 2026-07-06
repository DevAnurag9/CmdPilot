import { Link, NavLink } from "react-router-dom";
import { Terminal } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/playground", label: "Playground" },
  { href: "/docs", label: "Docs" },
  { href: "/about", label: "About" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-base font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-cyan-300 text-slate-950">
            <Terminal size={19} />
          </span>
          CmdPilot
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm transition ${
                  isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
