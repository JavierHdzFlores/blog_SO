import { Link } from "react-router";
import { Terminal, Cpu, Network, ArrowRight, GraduationCap, User, CalendarDays, BookOpen } from "lucide-react";
import { Button } from "../components/ui/button";

const topics = [
  {
    icon: <Terminal className="size-6" />,
    label: "Tema 1",
    title: "Introducción a Linux",
    description:
      "Comandos esenciales del sistema de archivos, gestión de usuarios y permisos, y automatización con scripts de Shell.",
    to: "/linux",
    color: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
    iconColor: "text-blue-500",
    practices: 3,
  },
  {
    icon: <Cpu className="size-6" />,
    label: "Tema 2",
    title: "Procesos e Hilos",
    description:
      "Creación y administración de procesos con fork(), programación concurrente con pthreads y sincronización mediante mutex.",
    to: "/procesos",
    color: "from-violet-500/20 to-violet-600/5 border-violet-500/30",
    iconColor: "text-violet-500",
    practices: 3,
  },
  {
    icon: <Network className="size-6" />,
    label: "Tema 3",
    title: "Mecanismos IPC",
    description:
      "Comunicación entre procesos mediante pipes anónimos, memoria compartida POSIX y semáforos para la sincronización.",
    to: "/ipc",
    color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30",
    iconColor: "text-emerald-500",
    practices: 3,
  },
  {
    icon: <Network className="size-6" />,
    label: "Tema 5",
    title: "Administración de memoria",
    description:
      "Paginación y segmentación de la memoria como herramientas clave para la administración de la memoria.",
    to: "/adminMemo",
    color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30",
    iconColor: "text-emerald-500",
    practices: 3,
  },
  {
    icon: <Network className="size-6" />,
    label: "Tema 6",
    title: "Arquitectura del sistema de archivos",
    description:
      "Paginación y segmentación de la memoria como herramientas clave para la administración de la memoria.",
    to: "/arquiSistemAchr",
    color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30",
    iconColor: "text-emerald-500",
    practices: 3,
  },

  {
    icon: <Terminal className="size-6" />,
    label: "MiniShell",
    title: "MiniShell",
    description:
      "Implementación de un intérprete de comandos básico en C.",
    to: "/minishell",
    color: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
    iconColor: "text-blue-500",
    practices: 1,
  },
];

export function Home() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero */}
      <section className="relative rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-primary/10 via-background to-background p-8 lg:p-12">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl" />
          {/* Grid lines decoration */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <GraduationCap className="size-3.5 text-primary" />
            <span className="text-xs font-medium text-primary" style={{ fontFamily: "'Inter', sans-serif" }}>
              Portafolio de Evidencias · Sistemas Operativos
            </span>
          </div>

          <h1
            className="mb-4 text-foreground max-w-3xl"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "2.25rem", fontWeight: 700, lineHeight: 1.2 }}
          >
            Portafolio de
            <span className="text-primary"> Sistemas Operativos</span>
          </h1>

          <p
            className="text-muted-foreground leading-relaxed max-w-2xl mb-8"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem" }}
          >
            Este portafolio reúne las prácticas y ejercicios desarrollados durante el semestre en la materia de Sistemas Operativos. Cada sección documenta el proceso de aprendizaje mediante código en C, capturas de terminal y reflexiones sobre los conceptos adquiridos.
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mb-8">
            {[
              { icon: <User className="size-3.5" />, label: "Carlos Hernández González" },
              { icon: <GraduationCap className="size-3.5" />, label: "Ingeniería en Computación" },
              { icon: <CalendarDays className="size-3.5" />, label: "4to Semestre · 2024–2025" },
              { icon: <BookOpen className="size-3.5" />, label: "UTM · Dr. López Martínez" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/linux">
                Comenzar a explorar <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/procesos">Ver Procesos e Hilos</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/minishell">Ver MiniShell</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Prologue */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-border" />
          <span
            className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Prólogo
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="max-w-3xl mx-auto">
            <h2
              className="mb-6 text-foreground"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.5rem", fontWeight: 600 }}
            >
              Presentación del Portafolio
            </h2>

            <div className="space-y-4 text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              <p>
                El presente portafolio de evidencias documenta el trabajo realizado a lo largo del semestre en la materia de <strong className="text-foreground">Sistemas Operativos</strong>, correspondiente al cuarto semestre de la carrera de Ingeniería en Computación de la Universidad Tecnológica de la Mixteca.
              </p>
              <p>
                A través de tres grandes bloques temáticos, se exploran los fundamentos que subyacen al funcionamiento de los sistemas computacionales modernos: desde la administración básica del entorno Linux, pasando por la comprensión de cómo el sistema operativo gestiona la ejecución concurrente mediante procesos e hilos, hasta los mecanismos que permiten que estos procesos se comuniquen y coordinen entre sí.
              </p>
              <p>
                Cada práctica sigue una estructura consistente que incluye el <strong className="text-foreground">marco teórico</strong> del concepto, la <strong className="text-foreground">implementación en código C/C++</strong>, la <strong className="text-foreground">salida real del programa</strong> en terminal y una reflexión personal sobre lo aprendido y las posibles mejoras. El objetivo es no solo demostrar la comprensión técnica, sino también desarrollar la capacidad de análisis crítico sobre el código producido.
              </p>
              <p>
                Este portafolio fue construido con el fin de servir como referencia de aprendizaje y como evidencia académica del proceso formativo del estudiante.
              </p>
            </div>

            <div
              className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Javier Hernandez Flores, Marlen
                </p>
                <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Matrícula: 2022020208 · Ing. Computación · UTM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topic cards */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-border" />
          <span
            className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Contenido del Portafolio
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topics.map((topic) => (
            <Link
              key={topic.to}
              to={topic.to}
              className={`group rounded-2xl border bg-gradient-to-br ${topic.color} p-6 flex flex-col gap-4 transition-all hover:shadow-lg hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between">
                <div className={`${topic.iconColor} p-2 rounded-lg bg-background/50`}>
                  {topic.icon}
                </div>
                <span
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {topic.practices} prácticas
                </span>
              </div>

              <div>
                <p
                  className="text-xs font-medium text-muted-foreground mb-1"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {topic.label}
                </p>
                <h3
                  className="text-foreground mb-2"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                >
                  {topic.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {topic.description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors mt-auto">
                Ver prácticas <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
