import { Link, useLocation } from "react-router";
import {
  Terminal,
  Cpu,
  Network,
  ChevronRight,
  BookOpen,
} from "lucide-react";

interface SubItem {
  label: string;
  anchor: string;
}

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  badge: string;
  subitems: SubItem[];
}

const navItems: NavItem[] = [
  {
    label: "Introducción a Linux",
    to: "/linux",
    icon: <Terminal className="size-4" />,
    badge: "Tema 1",
    subitems: [
      { label: "Comandos del Sistema de Archivos", anchor: "practica-1" },
      { label: "Usuarios y Permisos", anchor: "practica-2" },
      { label: "Scripts de Shell", anchor: "practica-3" },
    ],
  },
  {
    label: "Procesos e Hilos",
    to: "/procesos",
    icon: <Cpu className="size-4" />,
    badge: "Tema 2",
    subitems: [
      { label: "Creación de Procesos (fork)", anchor: "practica-1" },
      { label: "Creación de Hilos (pthread)", anchor: "practica-2" },
      { label: "Sincronización con Mutex", anchor: "practica-3" },
    ],
  },
  {
    label: "Mecanismos IPC",
    to: "/ipc",
    icon: <Network className="size-4" />,
    badge: "Tema 3",
    subitems: [
      { label: "Pipes Anónimos", anchor: "practica-1" },
      { label: "Memoria Compartida", anchor: "practica-2" },
      { label: "Semáforos POSIX", anchor: "practica-3" },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col gap-1 py-6 px-3">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 pb-3 mb-2 border-b border-border">
        <BookOpen className="size-4 text-muted-foreground" />
        <span
          className="text-sm font-semibold text-muted-foreground uppercase tracking-widest"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem" }}
        >
          Contenido
        </span>
      </div>

      {navItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <div key={item.to} className="mb-1">
            <Link
              to={item.to}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all group ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <span className={isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"}>
                {item.icon}
              </span>
              <span className="flex-1 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                {item.label}
              </span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${
                  isActive
                    ? "bg-white/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}
              >
                {item.badge}
              </span>
            </Link>

            {/* Subitems */}
            {isActive && (
              <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l-2 border-primary/30 pl-3">
                {item.subitems.map((sub) => (
                  <a
                    key={sub.anchor}
                    href={`#${sub.anchor}`}
                    className="flex items-center gap-1.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <ChevronRight className="size-3 shrink-0" />
                    {sub.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Info box */}
      <div className="mt-auto mx-1 p-3 rounded-lg border border-border bg-muted/40">
        <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span className="font-semibold text-foreground">Materia:</span> Sistemas Operativos
          <br />
          <span className="font-semibold text-foreground">Semestre:</span> 4to — 2025
          <br />
          <span className="font-semibold text-foreground">Docente:</span> Dr. López Martínez
        </p>
      </div>
    </aside>
  );
}
