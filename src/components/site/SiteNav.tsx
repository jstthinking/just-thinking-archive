import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sun, Search, Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/essays", label: "Essays" },
  { to: "/podcast", label: "Podcast" },
  { to: "/artwork", label: "Artwork" },
  { to: "/notebook", label: "Notebook" },
  { to: "/about", label: "About" },
] as const;

export function SiteNav() {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("jt-theme");
    const isDark = saved ? saved === "dark" : false;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("jt-theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/75 border-b border-border/60">
      <div className="container-wide flex items-center justify-between h-16">
        <Link to="/" className="flex items-baseline gap-2 group">
          <span className="font-serif text-xl tracking-tight">Just Thinking</span>
          <span className="font-hand text-base text-[color:var(--forest)] hidden sm:inline opacity-80 group-hover:opacity-100 transition">— notes & ideas</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          {links.slice(1).map((l) => {
            const active = pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to));
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`ink-link transition-colors ${active ? "text-[color:var(--forest)]" : "text-foreground/80 hover:text-foreground"}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link to="/search" aria-label="Search" className="p-2 rounded-md hover:bg-muted transition">
            <Search className="w-4 h-4" />
          </Link>
          <button onClick={toggle} aria-label="Toggle theme" className="p-2 rounded-md hover:bg-muted transition">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setOpen((v) => !v)} aria-label="Menu" className="md:hidden p-2 rounded-md hover:bg-muted transition">
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95">
          <nav className="container-wide py-4 flex flex-col gap-3 text-base">
            {links.slice(1).map((l) => (
              <Link key={l.to} to={l.to} className="py-1 ink-link w-fit">{l.label}</Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
