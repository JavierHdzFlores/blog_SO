import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Moon, Sun, Terminal, Menu, X } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  const [dark, setDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [dark]);

  // Default to dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const navLinks = [
    { label: "Inicio", to: "/" },
    { label: "Linux", to: "/linux" },
    { label: "Procesos & Hilos", to: "/procesos" },
    { label: "IPC", to: "/ipc" },
    { label: "Acerca de", to: "/acerca" },
  ];

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-4">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground group-hover:bg-primary/90 transition-colors">
            <Terminal className="size-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-foreground tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
              SOPortafolio
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              C. Hernández · UTM
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                isActive(link.to)
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
            className="shrink-0"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`px-3 py-2 rounded-md text-sm transition-colors ${
                isActive(link.to)
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
