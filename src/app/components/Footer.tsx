import { Terminal, Github, BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-foreground">
                <Terminal className="size-3.5" />
              </div>
              <span className="font-semibold text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                SOPortafolio
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Portafolio de evidencias de la materia Sistemas Operativos,
              desarrollado como parte del proceso de evaluación académica.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              Temas
            </p>
            <ul className="flex flex-col gap-2">
              {[
                { label: "Introducción a Linux", href: "/linux" },
                { label: "Procesos e Hilos", href: "/procesos" },
                { label: "Mecanismos IPC", href: "/ipc" },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* University */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              Institución
            </p>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                Universidad Tecnológica de la Mixteca
              </p>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                Huajuapan de León, Oaxaca
              </p>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                Ingeniería en Computación
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            © 2026 — J. Hernández, Marlen Hernández · UTM · Sistemas Operativos
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <BookOpen className="size-3" />
              6to Semestre · 2024–2025
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <Github className="size-3" />
              C · Linux · POSIX
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
