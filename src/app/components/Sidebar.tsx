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

/* Fragmento de Sidebar.tsx actualizado */
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
      { label: "Proyecto: MiniShell", anchor: "minishell" }, // Se añade el MiniShell aquí
    ],
  },
  {
    label: "Procesos e Hilos",
    to: "/procesos",
    icon: <Cpu className="size-4" />,
    badge: "Tema 2",
    subitems: [
      { label: "2.1 Introducción a procesos", anchor: "tema-2-1" }, //
      { label: "2.2 Creación con fork()", anchor: "tema-2-2" },
      { label: "2.4 Sistema de llamadas para crear procesos -fork()", anchor: "tema-2-4" },
      { label: "2.5 Sistema de llamada wait()", anchor: "tema-2-5" },
      { label: "2.6 Sistema de llamada _exit() y exit()", anchor: "tema-2-6" },
      { label: "2.7 Estado Zombi", anchor: "tema-2-7" },
      { label: "2.8 Hilos", anchor: "tema-2-8" },
      // { label: "2.8.2 Creación de hilos con pthread_create()", anchor: "tema-2-8-2" }


    ],
  },
  {
    label: "Mecanismos IPC",
    to: "/ipc",
    icon: <Network className="size-4" />,
    badge: "Tema 3",
    subitems: [
      { label: "3.1 Comunicación mediante tuberías", anchor: "tema-3-1" }, //
      { label: "3.1.1 Tuberías sin nombre — pipe()", anchor: "tema-3-2-1" },
      { label: "3.1.2 Tuberías con nombre — FIFO (mkfifo)s", anchor: "tema-3-2-2" },
      { label: "3.2 Mecanismos IPC derivados de System V", anchor: "tema-3-2" },
      { label: "3.2.1 Llaves — ftok()", anchor: "tema-3-2-1" },
      { label: "3.2.2 Semáforos en derivados de System V", anchor: "tema-3-2-2" },
      { label: "3.3 Memoria compartida — shmget, shmat, shmdt, shmctl", anchor: "tema-3-3" },
      { label: "3.4 Cola de mensajes — msgget, msgsnd, msgrcv, msgctl", anchor: "tema-3-4" },
      { label: "3.5 Información de IPC por medio de comandos del sistema", anchor: "tema-3-5" }
    ],
  },
  {
    label: "Administración de memoria ",
    to: "/adminMemo",
    icon: <Terminal className="size-4" />,
    badge: "Tema 5",
    subitems: [
      { label: "5.1 Introducción", anchor: "tema-5-1" },
      { label: "5.2 Administración de memoria sin intercambio o paginación", anchor: "tema-5-2" },
      { label: "5.3 Modelos de multiprogramación", anchor: "tema-5-3" },
      { label: "5.4 Multiprogramación con particiones fijas", anchor: "tema-5-4" },
      { label: "5.5 Reasignación y protección", anchor: "tema-5-5" },
      { label: "5.6 Intercambio", anchor: "tema-5-6" },
      { label: "5.7 Administración de la memoria con mapas de bits", anchor: "tema-5-7" },
      { label: "5.8 Administración de la memoria con listas ligadas", anchor: "tema-5-8" },
      { label: "5.9 Memoria virtual", anchor: "tema-5-9" },
      { label: "5.10 Funciones para conocer la memoria del sistema", anchor: "tema-5-10" },
      { label: "5.10.1 Función sysinfo", anchor: "tema-5-10-1" },
      { label: "5.10.2 Función mmap y munmap", anchor: "tema-5-10-2" },
      
    ],
  },
  {
    label: "Arquitectura del sistema de archivos ",
    to: "/arquiSistemAchr",
    icon: <Terminal className="size-4" />,
    badge: "Tema 6",
    subitems: [
      { label: "6.1 Introducción", anchor: "tema-6-1" },
      { label: "6.2 Estructura del sistema de archivos", anchor: "tema-6-2" },
      { label: "6.2.1 El superbloque", anchor: "tema-6-2-1" },
      { label: "6.2.2 Nodos índices (inodos)", anchor: "tema-6-2-2" },
      { label: "6.3 Tipos de archivos en UNIX", anchor: "tema-6-3" },
      { label: "6.3.1 Archivos tipo Directorios", anchor: "tema-6-3-1" },
      { label: "6.3.2 Archivos tipo Dispositivos", anchor: "tema-6-3-2" },
      { label: "6.3.3 Archivos tipo Comunicación", anchor: "tema-6-3-3" },
      { label: "6.4 Dispositivos de entrada y salida", anchor: "tema-6-4" },
      { label: "6.4.1 Función ioctl", anchor: "tema-6-4-1" },
      { label: "6.4.2 Unidad de disco.", anchor: "tema-6-4-2" },
    ],
  },

  {
    label: "MiniShell",
    to: "/minishell",
    icon: <Terminal className="size-4" />,
    badge: "Proyecto",
    subitems: [
      { label: "Introducción", anchor: "introduccion" },
      { label: "Funcionalidades", anchor: "funcionalidades" },
      { label: "Implementación", anchor: "implementacion" },
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
          <span className="font-semibold text-foreground">Semestre:</span> 6to — 2025
          <br />
          <span className="font-semibold text-foreground">Docente:</span> Dr. Gabriel Gerónimo Castillo
        </p>
      </div>
    </aside>
  );
}
