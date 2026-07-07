import { Link, NavLink } from "react-router-dom";
import { BarChart3, BookOpen, Home, Info, Menu, Settings, Terminal, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/playground", label: "Playground", icon: Terminal },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/docs", label: "Docs", icon: BookOpen },
  { href: "/about", label: "About", icon: Info },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-base font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-cyan-300 text-slate-950">
            <Terminal size={19} />
          </span>
          CmdPilot
        </Link>
        <button
          type="button"
          className="rounded-md p-2 text-slate-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className="hidden items-center gap-1 md:flex">
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
              <span className="inline-flex items-center gap-2">
                <link.icon size={16} />
                {link.label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
      {open && (
        <div className="border-t border-white/10 px-4 py-3 md:hidden">
          <div className="grid gap-1">
            {links.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm transition ${
                    isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                  }`
                }
              >
                <span className="inline-flex items-center gap-2">
                  <link.icon size={16} />
                  {link.label}
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
