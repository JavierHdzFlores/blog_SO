import { useState } from "react";
import { Cpu, ChevronDown, ChevronRight } from "lucide-react";
import { PracticeCard } from "../components/PracticeCard";

/* --- Diagrama SVG: Modelo de 5 estados ---- */
function ProcessStateDiagram() {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-violet-500/20 bg-muted/30 p-4">
      <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        // diagrama · modelo de cinco estados
      </p>
      <svg viewBox="0 0 700 260" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl mx-auto">
        <defs>
          <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#8b5cf6" />
          </marker>
          <marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#6b7280" />
          </marker>
        </defs>
        <ellipse cx="80" cy="130" rx="55" ry="28" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="1.5"/>
        <text x="80" y="126" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontFamily="Inter">Nuevo</text>
        <text x="80" y="140" textAnchor="middle" fill="#7c3aed" fontSize="9" fontFamily="JetBrains Mono">NEW</text>
        <ellipse cx="270" cy="60" rx="60" ry="28" fill="#1a1f36" stroke="#8b5cf6" strokeWidth="1.5"/>
        <text x="270" y="56" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontFamily="Inter">Listo</text>
        <text x="270" y="70" textAnchor="middle" fill="#7c3aed" fontSize="9" fontFamily="JetBrains Mono">READY</text>
        <ellipse cx="450" cy="130" rx="65" ry="28" fill="#1a1f36" stroke="#10b981" strokeWidth="2"/>
        <text x="450" y="126" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontFamily="Inter">Ejecución</text>
        <text x="450" y="140" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="JetBrains Mono">RUNNING</text>
        <ellipse cx="270" cy="200" rx="65" ry="28" fill="#1a1f36" stroke="#f59e0b" strokeWidth="1.5"/>
        <text x="270" y="196" textAnchor="middle" fill="#fcd34d" fontSize="11" fontFamily="Inter">Bloqueado</text>
        <text x="270" y="210" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="JetBrains Mono">BLOCKED</text>
        <ellipse cx="620" cy="130" rx="62" ry="28" fill="#1f1a1a" stroke="#ef4444" strokeWidth="1.5"/>
        <text x="620" y="126" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily="Inter">Terminado</text>
        <text x="620" y="140" textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="JetBrains Mono">EXIT</text>
        <line x1="132" y1="112" x2="212" y2="72" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#arr)"/>
        <text x="163" y="83" fill="#a78bfa" fontSize="9" fontFamily="Inter">admitir</text>
        <line x1="330" y1="67" x2="385" y2="110" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#arr)"/>
        <text x="343" y="88" fill="#a78bfa" fontSize="9" fontFamily="Inter">despachar</text>
        <line x1="400" y1="108" x2="327" y2="72" stroke="#6b7280" strokeWidth="1.2" markerEnd="url(#arr2)"/>
        <text x="348" y="86" fill="#9ca3af" fontSize="9" fontFamily="Inter">expulsion</text>
        <line x1="438" y1="158" x2="335" y2="188" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arr)"/>
        <text x="370" y="183" fill="#fbbf24" fontSize="9" fontFamily="Inter">E/S</text>
        <line x1="225" y1="185" x2="227" y2="88" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#arr)"/>
        <text x="185" y="140" fill="#a78bfa" fontSize="9" fontFamily="Inter">evento</text>
        <line x1="515" y1="130" x2="558" y2="130" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arr)"/>
        <text x="524" y="122" fill="#f87171" fontSize="9" fontFamily="Inter">exit()</text>
      </svg>
    </div>
  );
}

/* ─── Diagrama SVG: exit() vs _exit() ─────────────────────────── */
function ExitVsExitDiagram() {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-orange-500/20 bg-muted/30 p-4">
      <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        // diagrama · exit() vs _exit()
      </p>
      <svg viewBox="0 0 620 280" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl mx-auto">
        <defs>
          <marker id="earr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#f97316" />
          </marker>
        </defs>

        <rect x="50" y="40" width="180" height="80" rx="10" fill="#1e40af" stroke="#f97316" strokeWidth="2"/>
        <text x="140" y="65" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily="JetBrains Mono">exit(status)</text>
        <text x="140" y="80" textAnchor="middle" fill="#fcd34d" fontSize="8" fontFamily="Inter">fflush + atexit()</text>
        <text x="140" y="95" textAnchor="middle" fill="#fcd34d" fontSize="8" fontFamily="Inter">_exit(status)</text>

        <rect x="390" y="40" width="180" height="80" rx="10" fill="#166534" stroke="#22c55e" strokeWidth="2"/>
        <text x="480" y="65" textAnchor="middle" fill="#d9f99d" fontSize="11" fontFamily="JetBrains Mono">_exit(status)</text>
        <text x="480" y="80" textAnchor="middle" fill="#bef264" fontSize="8" fontFamily="Inter">termina proceso</text>
        <text x="480" y="95" textAnchor="middle" fill="#bef264" fontSize="8" fontFamily="Inter">sin limpiar buffers</text>

        <rect x="220" y="160" width="180" height="60" rx="10" fill="#1f2937" stroke="#f97316" strokeWidth="2"/>
        <text x="310" y="180" textAnchor="middle" fill="#fcd34d" fontSize="10" fontFamily="JetBrains Mono">Estado de salida</text>
        <text x="310" y="195" textAnchor="middle" fill="#fcd34d" fontSize="8" fontFamily="Inter">status (8 bits)</text>

        <line x1="230" y1="110" x2="230" y2="160" stroke="#f97316" strokeWidth="2" markerEnd="url(#earr)"/>
        <line x1="430" y1="110" x2="430" y2="160" stroke="#22c55e" strokeWidth="2" markerEnd="url(#earr)"/>
      </svg>
    </div>
  );
}

/* ─── Diagrama SVG: estado zombi ─────────────────────────────── */
function ZombieProcessDiagram() {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-red-500/20 bg-muted/30 p-4">
      <p className="text-xs font-semibold text-red-500 uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        // diagrama · estado zombi
      </p>
      <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl mx-auto">
        <defs>
          <marker id="zarr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#f87171" />
          </marker>
        </defs>
        <rect x="70" y="40" width="140" height="70" rx="10" fill="#1e40af" stroke="#ef4444" strokeWidth="2"/>
        <text x="140" y="65" textAnchor="middle" fill="#fecaca" fontSize="11" fontFamily="JetBrains Mono">PADRE</text>
        <text x="140" y="80" textAnchor="middle" fill="#fca5a5" fontSize="8" fontFamily="Inter">fork()</text>

        <rect x="390" y="40" width="140" height="70" rx="10" fill="#166534" stroke="#f87171" strokeWidth="2"/>
        <text x="460" y="65" textAnchor="middle" fill="#fed7aa" fontSize="11" fontFamily="JetBrains Mono">HIJO</text>
        <text x="460" y="80" textAnchor="middle" fill="#fdba74" fontSize="8" fontFamily="Inter">exit()/ _exit()</text>

        <rect x="250" y="150" width="120" height="70" rx="10" fill="#111827" stroke="#f87171" strokeWidth="2"/>
        <text x="310" y="175" textAnchor="middle" fill="#fecaca" fontSize="11" fontFamily="JetBrains Mono">ZOMBI</text>
        <text x="310" y="190" textAnchor="middle" fill="#fca5a5" fontSize="8" fontFamily="Inter">sin wait()</text>

        <line x1="210" y1="80" x2="250" y2="170" stroke="#f87171" strokeWidth="2" markerEnd="url(#zarr)"/>
        <text x="230" y="120" fill="#f87171" fontSize="8" fontFamily="Inter">terminado</text>

        <line x1="310" y1="120" x2="310" y2="150" stroke="#f87171" strokeWidth="2" markerEnd="url(#zarr)"/>
        <text x="330" y="140" fill="#f87171" fontSize="8" fontFamily="Inter">estado retenido</text>
      </svg>
    </div>
  );
}

/* ─── Diagrama SVG: creación de hilos POSIX ───────────────────── */
function ThreadCreationDiagram() {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-sky-500/20 bg-muted/30 p-4">
      <p className="text-xs font-semibold text-sky-500 uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        // diagrama · creación de hilos POSIX
      </p>
      <svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl mx-auto">
        <defs>
          <marker id="tarr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#38bdf8" />
          </marker>
        </defs>
        <rect x="230" y="40" width="140" height="80" rx="10" fill="#1f2937" stroke="#38bdf8" strokeWidth="2"/>
        <text x="300" y="65" textAnchor="middle" fill="#e0f2fe" fontSize="11" fontFamily="JetBrains Mono">PROCESO</text>
        <text x="300" y="80" textAnchor="middle" fill="#bae6fd" fontSize="8" fontFamily="Inter">pthread_create()</text>

        <rect x="70" y="160" width="110" height="60" rx="8" fill="#0f766e" stroke="#2dd4bf" strokeWidth="2"/>
        <text x="125" y="185" textAnchor="middle" fill="#ccfbf1" fontSize="9" fontFamily="JetBrains Mono">HILO 1</text>
        <text x="125" y="198" textAnchor="middle" fill="#a7f3d0" fontSize="7" fontFamily="Inter">pthread_join()</text>

        <rect x="245" y="160" width="110" height="60" rx="8" fill="#134e4a" stroke="#2dd4bf" strokeWidth="2"/>
        <text x="300" y="185" textAnchor="middle" fill="#ccfbf1" fontSize="9" fontFamily="JetBrains Mono">HILO 2</text>
        <text x="300" y="198" textAnchor="middle" fill="#a7f3d0" fontSize="7" fontFamily="Inter">pthread_join()</text>

        <rect x="420" y="160" width="110" height="60" rx="8" fill="#115e59" stroke="#2dd4bf" strokeWidth="2"/>
        <text x="475" y="185" textAnchor="middle" fill="#ccfbf1" fontSize="9" fontFamily="JetBrains Mono">HILO 3</text>
        <text x="475" y="198" textAnchor="middle" fill="#a7f3d0" fontSize="7" fontFamily="Inter">pthread_join()</text>

        <line x1="245" y1="80" x2="245" y2="160" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#tarr)"/>
        <text x="260" y="120" fill="#38bdf8" fontSize="8" fontFamily="Inter">crea</text>
      </svg>
    </div>
  );
}

interface TheorySection {
  label: string;
  content: React.ReactNode;
}

function TaskStructDiagram() {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-violet-500/20 bg-muted/30 p-4">
      <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        // diagrama · estados task_struct en GNU/Linux
      </p>
      <svg viewBox="0 0 680 200" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl mx-auto">
        <defs>
          <marker id="tarr" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill="#8b5cf6" />
          </marker>
        </defs>
        <rect x="10" y="75" width="130" height="50" rx="8" fill="#1a1f36" stroke="#10b981" strokeWidth="1.8"/>
        <text x="75" y="97" textAnchor="middle" fill="#6ee7b7" fontSize="9.5" fontFamily="JetBrains Mono">TASK_RUNNING</text>
        <text x="75" y="113" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter">Ejecut. / Listo</text>
        <rect x="190" y="20" width="155" height="50" rx="8" fill="#1a1f36" stroke="#f59e0b" strokeWidth="1.8"/>
        <text x="267" y="42" textAnchor="middle" fill="#fcd34d" fontSize="9.5" fontFamily="JetBrains Mono">TASK_INTERRUPTIBLE</text>
        <text x="267" y="58" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter">Dormido (despertable)</text>
        <rect x="190" y="130" width="165" height="50" rx="8" fill="#1a1f36" stroke="#f59e0b" strokeWidth="1.8"/>
        <text x="272" y="152" textAnchor="middle" fill="#fcd34d" fontSize="9.5" fontFamily="JetBrains Mono">TASK_UNINTERRUPTIBLE</text>
        <text x="272" y="168" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter">Dormido (no senalizable)</text>
        <rect x="405" y="75" width="130" height="50" rx="8" fill="#1a1f36" stroke="#6b7280" strokeWidth="1.8"/>
        <text x="470" y="97" textAnchor="middle" fill="#d1d5db" fontSize="9.5" fontFamily="JetBrains Mono">TASK_STOPPED</text>
        <text x="470" y="113" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter">Detenido / Trazado</text>
        <rect x="580" y="40" width="90" height="40" rx="8" fill="#1f1a1a" stroke="#ef4444" strokeWidth="1.8"/>
        <text x="625" y="56" textAnchor="middle" fill="#fca5a5" fontSize="9" fontFamily="JetBrains Mono">EXIT_ZOMBIE</text>
        <text x="625" y="70" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter">Zombi</text>
        <rect x="580" y="120" width="90" height="40" rx="8" fill="#1f1a1a" stroke="#6b7280" strokeWidth="1.5"/>
        <text x="625" y="136" textAnchor="middle" fill="#9ca3af" fontSize="9" fontFamily="JetBrains Mono">EXIT_DEAD</text>
        <text x="625" y="150" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter">Eliminado</text>
        <line x1="140" y1="90" x2="188" y2="50" stroke="#8b5cf6" strokeWidth="1.2" markerEnd="url(#tarr)"/>
        <line x1="140" y1="110" x2="188" y2="150" stroke="#8b5cf6" strokeWidth="1.2" markerEnd="url(#tarr)"/>
        <line x1="345" y1="45" x2="403" y2="90" stroke="#8b5cf6" strokeWidth="1.2" markerEnd="url(#tarr)"/>
        <line x1="355" y1="155" x2="403" y2="120" stroke="#8b5cf6" strokeWidth="1.2" markerEnd="url(#tarr)"/>
        <line x1="345" y1="40" x2="578" y2="55" stroke="#ef4444" strokeWidth="1.2" markerEnd="url(#tarr)"/>
        <line x1="535" y1="100" x2="578" y2="140" stroke="#6b7280" strokeWidth="1.2" markerEnd="url(#tarr)"/>
/* ─── Diagrama SVG: wait() y sincronización ────────────────────── */
function WaitSynchronizationDiagram() {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-rose-500/20 bg-muted/30 p-4">
      <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        // diagrama · wait() y sincronización padre-hijo
      </p>
      <svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl mx-auto">
        <defs>
          <marker id="warr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#f43f5e" />
          </marker>
        </defs>

        {/* Proceso Padre */}
        <rect x="50" y="40" width="140" height="80" rx="8" fill="#1e40af" stroke="#3b82f6" strokeWidth="2"/>
        <text x="120" y="65" textAnchor="middle" fill="#dbeafe" fontSize="10" fontFamily="JetBrains Mono">PROCESO PADRE</text>
        <text x="120" y="80" textAnchor="middle" fill="#93c5fd" fontSize="8" fontFamily="Inter">PID: 1000</text>
        <text x="120" y="95" textAnchor="middle" fill="#93c5fd" fontSize="8" fontFamily="Inter">fork()</text>
        <text x="120" y="110" textAnchor="middle" fill="#93c5fd" fontSize="8" fontFamily="Inter">wait(&status)</text>

        {/* Proceso Hijo */}
        <rect x="410" y="40" width="140" height="80" rx="8" fill="#166534" stroke="#10b981" strokeWidth="2"/>
        <text x="480" y="65" textAnchor="middle" fill="#d1fae5" fontSize="10" fontFamily="JetBrains Mono">PROCESO HIJO</text>
        <text x="480" y="80" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontFamily="Inter">PID: 1001</text>
        <text x="480" y="95" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontFamily="Inter">trabajo...</text>
        <text x="480" y="110" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontFamily="Inter">exit(42)</text>

        {/* Estado de terminación */}
        <rect x="230" y="160" width="140" height="60" rx="8" fill="#1f2937" stroke="#f43f5e" strokeWidth="2"/>
        <text x="300" y="180" textAnchor="middle" fill="#fecaca" fontSize="9" fontFamily="JetBrains Mono">ESTADO HIJO</text>
        <text x="300" y="195" textAnchor="middle" fill="#fca5a5" fontSize="8" fontFamily="Inter">status = 42 << 8</text>
        <text x="300" y="210" textAnchor="middle" fill="#fca5a5" fontSize="8" fontFamily="Inter">WIFEXITED = true</text>

        {/* Macros de análisis */}
        <rect x="50" y="250" width="120" height="80" rx="6" fill="#7c2d12" stroke="#ea580c" strokeWidth="2"/>
        <text x="110" y="270" textAnchor="middle" fill="#fed7aa" fontSize="8" fontFamily="JetBrains Mono">MACROS</text>
        <text x="110" y="285" textAnchor="middle" fill="#fdba74" fontSize="7" fontFamily="Inter">WIFEXITED()</text>
        <text x="110" y="295" textAnchor="middle" fill="#fdba74" fontSize="7" fontFamily="Inter">WEXITSTATUS()</text>
        <text x="110" y="305" textAnchor="middle" fill="#fdba74" fontSize="7" fontFamily="Inter">WIFSIGNALED()</text>
        <text x="110" y="315" textAnchor="middle" fill="#fdba74" fontSize="7" fontFamily="Inter">WTERMSIG()</text>

        {/* Funciones wait */}
        <rect x="430" y="250" width="120" height="80" rx="6" fill="#7c3aed" stroke="#a855f7" strokeWidth="2"/>
        <text x="490" y="270" textAnchor="middle" fill="#e9d5ff" fontSize="8" fontFamily="JetBrains Mono">FUNCIONES</text>
        <text x="490" y="285" textAnchor="middle" fill="#d8b4fe" fontSize="7" fontFamily="Inter">wait()</text>
        <text x="490" y="295" textAnchor="middle" fill="#d8b4fe" fontSize="7" fontFamily="Inter">waitpid(pid, &status, opts)</text>
        <text x="490" y="305" textAnchor="middle" fill="#d8b4fe" fontSize="7" fontFamily="Inter">WNOHANG</text>
        <text x="490" y="315" textAnchor="middle" fill="#d8b4fe" fontSize="7" fontFamily="Inter">WEXITED</text>

        {/* Flechas */}
        <line x1="190" y1="80" x2="230" y2="130" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#warr)"/>
        <text x="200" y="100" fill="#3b82f6" fontSize="8" fontFamily="Inter">crea</text>

        <line x1="300" y1="130" x2="300" y2="160" stroke="#10b981" strokeWidth="2" markerEnd="url(#warr)"/>
        <text x="320" y="140" fill="#10b981" fontSize="8" fontFamily="Inter">termina</text>

        <line x1="300" y1="220" x2="120" y2="250" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#warr)"/>
        <text x="280" y="235" fill="#f43f5e" fontSize="8" fontFamily="Inter">recupera</text>

        {/* Proceso zombi */}
        <rect x="230" y="40" width="100" height="30" rx="6" fill="#dc2626" stroke="#ef4444" strokeWidth="2"/>
        <text x="280" y="58" textAnchor="middle" fill="#fecaca" fontSize="8" fontFamily="JetBrains Mono">ZOMBI</text>
        <text x="280" y="68" textAnchor="middle" fill="#fca5a5" fontSize="7" fontFamily="Inter">sin wait()</text>
      </svg>
    </div>
  );
}

function RichTheory({ sections }: { sections: TheorySection[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="flex flex-col gap-2 my-4">
      {sections.map((s, i) => (
        <div key={i} className="rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-muted/40 hover:bg-muted/70 transition-colors text-left"
          >
            <span className="text-xs font-semibold text-foreground uppercase tracking-wide" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {s.label}
            </span>
            {open === i ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronRight className="size-4 text-muted-foreground" />}
          </button>
          {open === i && (
            <div className="px-4 py-3 text-sm text-muted-foreground leading-relaxed bg-card" style={{ fontFamily: "'Inter', sans-serif" }}>
              {s.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Item({ code, label, color = "violet" }: { code: string; label: string; color?: string }) {
  const colors: Record<string, string> = {
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/30",
    green:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    amber:  "bg-amber-500/10 text-amber-400 border-amber-500/30",
    red:    "bg-red-500/10 text-red-400 border-red-500/30",
    gray:   "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };
  return (
    <li className="flex items-start gap-2 py-0.5">
      <span className={`mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono border shrink-0 ${colors[color]}`}>{code}</span>
      <span>{label}</span>
    </li>
  );
}

const practices = [
  // ─────────────────────────────────────────────────────────────────
  // 2.1 Introducción a procesos
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-2-1",
    number: 1,
    title: "2.1 Introducción a procesos",
    difficulty: "Básico" as const,
    tags: ["procesos", "estados", "task_struct", "kernel", "UNIX"],
    objective:
      "Comprender el concepto de proceso, el modelo de cinco estados y cómo el kernel de Linux representa y gestiona los procesos mediante la estructura task_struct.",
    theory: "",
    theoryNode: (
      <div className="flex flex-col gap-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
        <p className="text-muted-foreground leading-relaxed">
          Todos los sistemas de multiprogramación están construidos en torno al concepto de <strong className="text-foreground">proceso</strong>: la instancia en ejecución de un programa, con su propio espacio de memoria, descriptores de archivo y contexto de CPU. El kernel mantiene una estructura <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-violet-400">task_struct</code> por cada proceso.
        </p>

        <RichTheory sections={[
          {
            label: "Modelo de cinco estados (clásico)",
            content: (
              <>
                <ProcessStateDiagram />
                <ul className="flex flex-col gap-1.5 mt-2">
                  <Item code="Nuevo"       label="Proceso recién creado, aún no admitido en el conjunto de ejecutables." color="violet"/>
                  <Item code="Listo"       label="Preparado para ejecutar, espera asignación del procesador." color="violet"/>
                  <Item code="Ejecución"   label="Siendo ejecutado actualmente por la CPU." color="green"/>
                  <Item code="Bloqueado"   label="No puede continuar hasta que ocurra un evento específico (E/S, señal…)." color="amber"/>
                  <Item code="Terminado"   label="Retirado del conjunto de procesos ejecutables." color="red"/>
                </ul>
              </>
            ),
          },
          {
            label: "Estados task_struct en GNU/Linux",
            content: (
              <>
                <TaskStructDiagram />
                <ul className="flex flex-col gap-1.5 mt-2">
                  <Item code="TASK_RUNNING"          label="Ejecutándose o listo para ejecutarse — en la run queue del planificador." color="green"/>
                  <Item code="TASK_INTERRUPTIBLE"    label="Dormido; puede ser despertado por señal o evento." color="amber"/>
                  <Item code="TASK_UNINTERRUPTIBLE"  label="Dormido; NO puede ser interrumpido por señales (p.ej. E/S de disco)." color="amber"/>
                  <Item code="TASK_STOPPED"          label="Proceso detenido por SIGSTOP / SIGTSTP." color="gray"/>
                  <Item code="TASK_TRACED"           label="Siendo trazado por un depurador (ptrace)." color="gray"/>
                  <Item code="EXIT_ZOMBIE"           label="Terminó; padre aún no ha recogido el estado con wait()." color="red"/>
                  <Item code="EXIT_DEAD"             label="Completamente eliminado del sistema." color="gray"/>
                </ul>
              </>
            ),
          },
          {
            label: "Herramientas para observar estados",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="ps -el"                   label="Lista todos los procesos con su estado (columna S: R/S/D/Z/T)." color="violet"/>
                <Item code="pstree -p"                label="Árbol jerárquico de procesos con PIDs." color="violet"/>
                <Item code="cat /proc/PID/status"     label="Estado detallado de un proceso específico en tiempo real." color="violet"/>
                <Item code="cat /proc/sys/kernel/pid_max" label="Número máximo de PIDs del sistema (64-bit: 4 194 304)." color="gray"/>
              </ul>
            ),
          },
        ]} />
      </div>
    ),
    code: `/* Consultar el estado de los procesos en GNU/Linux */

/* 1. Ver todos los procesos con su estado */
// ps -el

/* 2. Ver procesos en formato de árbol */
// pstree -p

/* 3. Ver procesos en tiempo real */
// top

/* 4. Ver el contenido del descriptor de proceso en /proc */
// cat /proc/<PID>/status

/* Ejemplo de salida de: ps -el */
/*
F S   UID   PID  PPID ...  CMD
4 S     0     1     0 ...  systemd         ← PID 1, padre de todos
1 S     0     2     0 ...  kthreadd
...
0 S  1000  5100  5000 ...  bash
0 R  1000  5101  5100 ...  ps              ← estado R = running
0 Z  1000  5102  5100 ...  zombie_proc <defunct>  ← estado Z = zombi
*/

/* Verificar el valor máximo de PID */
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(void) {
    printf("PID del proceso actual: %ld\\n", (long)getpid());
    printf("Consultar el máximo de PIDs en el sistema:\\n");
    printf("  cat /proc/sys/kernel/pid_max\\n");

    /* Estados internos del kernel (task_struct → state) */
    printf("\\nEstados task_struct en Linux:\\n");
    printf("  TASK_RUNNING         = 0\\n");
    printf("  TASK_INTERRUPTIBLE   = 1\\n");
    printf("  TASK_UNINTERRUPTIBLE = 2\\n");
    printf("  TASK_STOPPED         = 4\\n");
    printf("  TASK_TRACED          = 8\\n");
    printf("  EXIT_ZOMBIE          = 16\\n");
    printf("  EXIT_DEAD            = 32\\n");

    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "intro_procesos.c",
    terminalLines: [
      "$ ps -el | head -5",
      "F S   UID   PID  PPID C PRI  NI ADDR SZ WCHAN  TTY          TIME CMD",
      "4 S     0     1     0 0  80   0 -  4104 -      ?        00:00:02 systemd",
      "1 S     0     2     0 0  80   0 -     0 -      ?        00:00:00 kthreadd",
      "",
      "$ cat /proc/sys/kernel/pid_max",
      "4194304",
      "",
      "$ ./intro_procesos",
      "PID del proceso actual: 5100",
      "Consultar el máximo de PIDs en el sistema:",
      "  cat /proc/sys/kernel/pid_max",
      "",
      "Estados task_struct en Linux:",
      "  TASK_RUNNING         = 0",
      "  TASK_INTERRUPTIBLE   = 1",
      "  TASK_UNINTERRUPTIBLE = 2",
      "  TASK_STOPPED         = 4",
      "  TASK_TRACED          = 8",
      "  EXIT_ZOMBIE          = 16",
      "  EXIT_DEAD            = 32",
    ],
    terminalTitle: "Terminal — bash · intro_procesos",
    conclusion:
      "El modelo de cinco estados es la base conceptual de la gestión de procesos. En GNU/Linux este modelo se extiende con estados adicionales como TASK_TRACED y los estados de finalización EXIT_ZOMBIE y EXIT_DEAD. La estructura task_struct es el núcleo de la representación de un proceso en el kernel y contiene toda la información administrativa: estado, prioridad, PID, contexto de ejecución y relaciones con otros procesos.",
    improvements:
      "Explorar /proc/<PID>/status para leer el estado real de un proceso en ejecución. Usar strace para observar las llamadas al sistema que realiza un proceso y cómo transita entre estados. Complementar con la visualización del árbol de procesos con pstree -p mientras se ejecutan programas de prueba.",
  },

  // ─────────────────────────────────────────────────────────────────
  // 2.2 Sistema de llamado para crear procesos (fork)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-2-2",
    number: 2,
    title: "2.2 Sistema de llamado para crear procesos — fork()",
    difficulty: "Intermedio" as const,
    tags: ["fork", "copy-on-write", "COW", "proceso hijo", "POSIX"],
    objective:
      "Comprender el mecanismo de creación de procesos en Linux mediante la llamada al sistema fork(), entender la técnica de copy-on-write y los valores de retorno que permiten diferenciar el proceso padre del hijo.",
    theory: "",
    theoryNode: (
      <div className="flex flex-col gap-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
        <p className="text-muted-foreground leading-relaxed">
          En GNU/Linux la creación de procesos se realiza mediante la llamada al sistema <strong className="text-foreground">fork()</strong>. Esta llamada permite que un proceso padre cree un proceso hijo con una copia de su espacio de direcciones usando copy-on-write.
        </p>

        <RichTheory sections={[
          {
            label: "Mecanismo de fork() + copy-on-write",
            content: (
              <>
                <ForkCOWDiagram />
                <ul className="flex flex-col gap-1.5 mt-2">
                  <Item code="pid_t fork(void)"     label="Crea proceso hijo; retorna PID del hijo en padre, 0 en hijo, -1 en error." color="blue"/>
                  <Item code="Copy-on-Write (COW)" label="Páginas compartidas inicialmente; duplicadas solo al escribir." color="green"/>
                  <Item code="return 0 (hijo)"     label="Hijo recibe PID = 0 para distinguirse del padre." color="amber"/>
                  <Item code="return PID (padre)"  label="Padre recibe PID del hijo recién creado." color="amber"/>
                </ul>
              </>
            ),
          },
          {
            label: "Herencia del proceso hijo",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="PID único"         label="Hijo obtiene nuevo PID (getpid())." color="blue"/>
                <Item code="PPID = padre"      label="Hijo mantiene referencia al padre (getppid())." color="blue"/>
                <Item code="Descriptores"      label="Hereda archivos, pipes, sockets abiertos." color="green"/>
                <Item code="Credenciales"      label="Mantiene UID, GID, privilegios del padre." color="green"/>
                <Item code="Tiempos CPU = 0"  label="Contadores de CPU reiniciados en cero." color="amber"/>
                <Item code="Sin señales"      label="Cola de señales vacía (no hereda señales pendientes)." color="red"/>
                <Item code="Sin bloqueos"     label="No hereda bloqueos de archivos del padre." color="red"/>
              </ul>
            ),
          },
          {
            label: "Limitaciones y consideraciones",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="COW eficiente"     label="fork() es rápido gracias al compartir inicial de páginas." color="green"/>
                <Item code="Escritura = copia" label="Primera escritura en página compartida la duplica." color="amber"/>
                <Item code="Máximo PID"       label="Limitado por /proc/sys/kernel/pid_max (4M+)." color="gray"/>
                <Item code="Error handling"   label="Verificar siempre retorno -1 y manejar errno." color="red"/>
              </ul>
            ),
          },
        ]} />
      </div>
    ),
    code: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

int main(void) {
    int x = 0;
    pid_t pid;

    printf("=== Demostración fork() + copy-on-write ===\\n");
    printf("Proceso PADRE antes de fork: PID=%ld, x=%d\\n",
           (long)getpid(), x);

    pid = fork();

    if (pid == 0) {
        /* ── Código del proceso HIJO ── */
        x = 5;   /* Escritura → COW activa: se crea copia de la página */
        printf("[HIJO]  PID=%ld | PPID=%ld | x=%d (copia propia)\\n",
               (long)getpid(), (long)getppid(), x);
        exit(EXIT_SUCCESS);

    } else if (pid > 0) {
        /* ── Código del proceso PADRE ── */
        x = 10;  /* Escritura → COW activa en el padre también */
        printf("[PADRE] PID=%ld | hijo PID=%ld | x=%d (original)\\n",
               (long)getpid(), (long)pid, x);

    } else {
        /* ── Error al crear el proceso ── */
        perror("fork");
        return EXIT_FAILURE;
    }

    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "fork_cow.c",
    terminalLines: [
      "$ gcc fork_cow.c -o fork_cow",
      "$ ./fork_cow",
      "",
      "=== Demostración fork() + copy-on-write ===",
      "Proceso PADRE antes de fork: PID=5100, x=0",
      "[PADRE] PID=5100 | hijo PID=5101 | x=10 (original)",
      "[HIJO]  PID=5101 | PPID=5100 | x=5 (copia propia)",
    ],
    terminalTitle: "Terminal — bash · fork_cow",
    conclusion:
      "fork() es eficiente gracias a copy-on-write: el kernel comparte las páginas entre padre e hijo y solo las duplica físicamente cuando alguno escribe en ellas. Los valores de retorno distintos (0 para el hijo, PID > 0 para el padre) son el mecanismo fundamental para que un mismo programa ejecute código diferente en cada proceso.",
    improvements:
      "Usar execvp() en el proceso hijo para reemplazar su imagen por un programa diferente (patrón fork-exec). Combinar fork() + pipe() para que padre e hijo intercambien datos. Visualizar con pstree -p el árbol de procesos mientras el programa se ejecuta.",
  },

  // ─────────────────────────────────────────────────────────────────
  // 2.4 Sistema de llamado para identificar procesos
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-2-4",
    number: 3,
    title: "2.4 Sistema de llamado para identificar procesos",
    difficulty: "Básico" as const,
    tags: ["getpid", "getppid", "getpgrp", "setpgrp", "PID", "PPID", "cadena", "abanico"],
    objective:
      "Utilizar las llamadas al sistema getpid(), getppid(), getpgrp() y setpgrp() para identificar procesos, comprender la relación padre–hijo y los grupos de procesos, e implementar estructuras clásicas como cadena y abanico de procesos.",
    theory: "",
    theoryNode: (
      <div className="flex flex-col gap-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
        <p className="text-muted-foreground leading-relaxed">
          Todo proceso en UNIX tiene un <strong className="text-foreground">identificador único (PID)</strong> y mantiene referencia al proceso que lo creó (PPID). Las llamadas al sistema permiten identificar procesos y gestionar grupos.
        </p>

        <RichTheory sections={[
          {
            label: "Estructuras clásicas de procesos",
            content: (
              <>
                <ProcessStructuresDiagram />
                <ul className="flex flex-col gap-1.5 mt-2">
                  <Item code="Cadena"     label="P0 → P1 → P2 → Pn (cada proceso crea exactamente un hijo)." color="blue"/>
                  <Item code="Abanico"    label="P0 crea P1, P2, P3... (un padre con N hijos)." color="green"/>
                  <Item code="PPID"       label="En cadena: PPID de Pn = PID de P(n-1). En abanico: PPID de todos = PID de P0." color="amber"/>
                </ul>
              </>
            ),
          },
          {
            label: "Funciones de identificación",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="getpid()"    label="Retorna PID del proceso actual." color="blue"/>
                <Item code="getppid()"   label="Retorna PID del proceso padre." color="blue"/>
                <Item code="getpgrp()"   label="Retorna PGID (Process Group ID) del proceso." color="purple"/>
                <Item code="setpgrp()"   label="Convierte al proceso en líder de su propio grupo." color="purple"/>
                <Item code="pid_t"       label="Tipo entero con signo (máx. 4M+ en /proc/sys/kernel/pid_max)." color="gray"/>
              </ul>
            ),
          },
          {
            label: "Herencia y adopción",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="Descriptores" label="Hereda stdin(0), stdout(1), stderr(2) del padre." color="green"/>
                <Item code="Adopción"    label="Si padre termina, hijos son adoptados por init/systemd (PID=1)." color="amber"/>
                <Item code="Credenciales" label="Mantiene UID, GID y privilegios del padre." color="green"/>
                <Item code="Sesión"      label="Puede crear nueva sesión con setsid()." color="purple"/>
              </ul>
            ),
          },
        ]} />
      </div>
    ),
    code: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>

/* ── Demostración: cadena y abanico de procesos ── */

void cadena_de_procesos(int n) {
    pid_t hijo;
    for (int i = 0; i < n; i++) {
        hijo = fork();
        if (hijo > 0) break;   /* El padre sale del ciclo */
        fprintf(stderr,
            "[CADENA] PID=%ld | PPID=%ld | nivel=%d\\n",
            (long)getpid(), (long)getppid(), i + 1);
    }
}

void abanico_de_procesos(int n) {
    pid_t hijo;
    for (int i = 0; i < n; i++) {
        hijo = fork();
        if (hijo == 0) break;  /* El hijo no crea más procesos */
    }
    fprintf(stderr,
        "[ABANICO] PID=%ld | PPID=%ld\\n",
        (long)getpid(), (long)getppid());
}

int main(void) {
    printf("Proceso principal: PID=%ld | PPID=%ld | PGID=%ld\\n",
           (long)getpid(), (long)getppid(), (long)getpgrp());

    printf("\\n--- Cadena de 3 procesos ---\\n");
    cadena_de_procesos(3);

    printf("\\n--- Abanico de 3 procesos ---\\n");
    abanico_de_procesos(3);

    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "identificacion.c",
    terminalLines: [
      "$ gcc identificacion.c -o identificacion",
      "$ ./identificacion",
      "",
      "Proceso principal: PID=6000 | PPID=5900 | PGID=6000",
      "",
      "--- Cadena de 3 procesos ---",
      "[CADENA] PID=6001 | PPID=6000 | nivel=1",
      "[CADENA] PID=6002 | PPID=6001 | nivel=2",
      "[CADENA] PID=6003 | PPID=6002 | nivel=3",
      "",
      "--- Abanico de 3 procesos ---",
      "[ABANICO] PID=6004 | PPID=6000",
      "[ABANICO] PID=6005 | PPID=6000",
      "[ABANICO] PID=6006 | PPID=6000",
      "[ABANICO] PID=6000 | PPID=5900",
    ],
    terminalTitle: "Terminal — bash · identificacion",
    conclusion:
      "La diferencia entre cadena (estructura lineal, cada proceso tiene exactamente un hijo) y abanico (estructura estrella, un padre con N hijos) es evidente en los valores PPID: en la cadena el PPID de cada hijo es el PID del proceso anterior; en el abanico todos los hijos comparten el mismo PPID. getpid() y getppid() son herramientas fundamentales para depurar jerarquías de procesos.",
    improvements:
      "Agregar llamadas a getpgrp() y setpgrp() para experimentar con grupos de procesos y sesiones. Visualizar el árbol completo con pstree -p <PID> mientras los procesos están corriendo. Combinar cadena y abanico para crear árboles de procesos más complejos.",
  },

  // ─────────────────────────────────────────────────────────────────
  // 2.5 Sistema de llamada wait() + 2.5.1 Uso de waitpid()
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-2-5",
    number: 4,
    title: "2.5 Sistema de llamada wait() y 2.5.1 Uso de waitpid()",
    difficulty: "Intermedio" as const,
    tags: ["wait", "waitpid", "WIFEXITED", "WEXITSTATUS", "WIFSIGNALED", "sincronización"],
    objective:
      "Usar wait() y waitpid() para sincronizar procesos padre e hijo, recuperar códigos de terminación con los macros de <sys/wait.h> y comprender las distintas opciones de control del comportamiento de espera.",
    theory: "",
    theoryNode: (
      <div className="flex flex-col gap-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
        <p className="text-muted-foreground leading-relaxed">
          Tras <strong className="text-foreground">fork()</strong>, padre e hijo se ejecutan concurrentemente. Las llamadas <strong className="text-foreground">wait()</strong> y <strong className="text-foreground">waitpid()</strong> permiten al padre esperar la terminación de sus hijos y recuperar su estado de terminación.
        </p>

        <RichTheory sections={[
          {
            label: "Sincronización con wait()",
            content: (
              <>
                <WaitSynchronizationDiagram />
                <ul className="flex flex-col gap-1.5 mt-2">
                  <Item code="wait(&status)"    label="Espera cualquier hijo; suspende hasta que termine." color="blue"/>
                  <Item code="waitpid(pid, &status, opts)" label="Espera hijo específico con opciones avanzadas." color="blue"/>
                  <Item code="WNOHANG"         label="Retorna inmediatamente si ningún hijo terminó." color="amber"/>
                  <Item code="WEXITED"         label="Espera hijos que hayan terminado normalmente." color="green"/>
                </ul>
              </>
            ),
          },
          {
            label: "Macros de análisis de estado",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="WIFEXITED(status)"   label="Verdadero si hijo terminó normalmente con exit()." color="green"/>
                <Item code="WEXITSTATUS(status)" label="Retorna los 8 bits bajos del código de exit()." color="green"/>
                <Item code="WIFSIGNALED(status)" label="Verdadero si hijo terminó por señal no capturada." color="red"/>
                <Item code="WTERMSIG(status)"   label="Número de la señal que terminó al hijo." color="red"/>
                <Item code="WIFSTOPPED(status)" label="Verdadero si hijo fue detenido por señal." color="amber"/>
                <Item code="WSTOPSIG(status)"  label="Número de la señal que detuvo al hijo." color="amber"/>
              </ul>
            ),
          },
          {
            label: "Parámetros de waitpid()",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="pid = -1"      label="Espera cualquier proceso hijo." color="gray"/>
                <Item code="pid > 0"       label="Espera el hijo con PID específico." color="blue"/>
                <Item code="pid = 0"       label="Espera cualquier hijo del mismo grupo." color="purple"/>
                <Item code="pid < -1"      label="Espera cualquier hijo con PGID = |pid|." color="purple"/>
              </ul>
            ),
          },
          {
            label: "Estados de proceso y zombis",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="Proceso zombi" label="Hijo terminado sin wait() - permanece en tabla de procesos." color="red"/>
                <Item code="wait() evita zombis" label="Recupera estado del hijo y lo elimina de la tabla." color="green"/>
                <Item code="Señales"      label="SIGCHLD se envía al padre cuando hijo termina." color="amber"/>
                <Item code="Bloqueo"      label="wait() bloquea hasta que un hijo termine." color="gray"/>
              </ul>
            ),
          },
        ]} />
      </div>
    ),
    code: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

void mostrar_estado(pid_t pid, int status) {
    if (WIFEXITED(status))
        printf("[PADRE] Hijo PID=%ld terminó normalmente, código=%d\\n",
               (long)pid, WEXITSTATUS(status));
    else if (WIFSIGNALED(status))
        printf("[PADRE] Hijo PID=%ld terminado por señal %d\\n",
               (long)pid, WTERMSIG(status));
}

int main(void) {
    const int N = 3;
    pid_t pids[N];
    int tiempos[] = {2, 1, 3};
    int status;

    printf("=== Demostración wait() / waitpid() ===\\n");
    printf("[PADRE] PID=%ld\\n\\n", (long)getpid());

    /* Crear N hijos */
    for (int i = 0; i < N; i++) {
        pids[i] = fork();
        if (pids[i] < 0) { perror("fork"); exit(1); }

        if (pids[i] == 0) {
            printf("[HIJO %d] PID=%ld | durmiendo %ds...\\n",
                   i+1, (long)getpid(), tiempos[i]);
            sleep(tiempos[i]);
            exit(i + 10);  /* código de salida distinto para cada hijo */
        }
        printf("[PADRE] Hijo %d creado con PID=%ld\\n", i+1, (long)pids[i]);
    }

    printf("\\n[PADRE] Esperando hijos con waitpid()...\\n\\n");

    /* Esperar a cada hijo por su PID específico */
    for (int i = 0; i < N; i++) {
        pid_t ret = waitpid(pids[i], &status, 0);
        mostrar_estado(ret, status);
    }

    printf("\\n[PADRE] Todos los hijos recogidos. No hay zombis.\\n");
    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "wait_demo.c",
    terminalLines: [
      "$ gcc wait_demo.c -o wait_demo",
      "$ ./wait_demo",
      "",
      "=== Demostración wait() / waitpid() ===",
      "[PADRE] PID=7000",
      "",
      "[PADRE] Hijo 1 creado con PID=7001",
      "[PADRE] Hijo 2 creado con PID=7002",
      "[PADRE] Hijo 3 creado con PID=7003",
      "[HIJO 1] PID=7001 | durmiendo 2s...",
      "[HIJO 2] PID=7002 | durmiendo 1s...",
      "[HIJO 3] PID=7003 | durmiendo 3s...",
      "",
      "[PADRE] Esperando hijos con waitpid()...",
      "",
      "[PADRE] Hijo PID=7001 terminó normalmente, código=10",
      "[PADRE] Hijo PID=7002 terminó normalmente, código=11",
      "[PADRE] Hijo PID=7003 terminó normalmente, código=12",
      "",
      "[PADRE] Todos los hijos recogidos. No hay zombis.",
    ],
    terminalTitle: "Terminal — bash · wait_demo",
    conclusion:
      "El uso de waitpid() con el PID específico de cada hijo garantiza la recolección ordenada del estado de terminación. Los macros WIFEXITED y WEXITSTATUS son esenciales para interpretar correctamente ese estado. Sin wait()/waitpid(), los procesos terminados permanecerían como zombis ocupando entradas en la tabla de procesos, lo que en servidores concurrentes puede agotar los recursos del sistema.",
    improvements:
      "Implementar el manejo de la señal SIGCHLD con sigaction() para recoger hijos de forma asíncrona sin bloquear al padre. Probar WNOHANG para una espera no bloqueante que permita al padre continuar trabajando mientras revisa si algún hijo terminó. Combinar con un bucle de servidor que crea un hijo por conexión entrante.",
  },

  // ─────────────────────────────────────────────────────────────────
  // 2.6 Sistema de llamada _exit() y exit()
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-2-6",
    number: 5,
    title: "2.6 Sistema de llamada _exit() y exit()",
    difficulty: "Básico" as const,
    tags: ["_exit", "exit", "terminación", "SIGCHLD", "atexit"],
    objective:
      "Comprender la diferencia entre _exit() y exit(), cómo el proceso comunica su terminación al padre, y el rol de estas funciones en la prevención del estado zombi.",
    theory: "",
    theoryNode: (
      <div className="flex flex-col gap-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
        <p className="text-muted-foreground leading-relaxed">
          Un proceso debe terminar de forma controlada. <strong className="text-foreground">exit()</strong> ejecuta limpieza de biblioteca y funciones atexit() antes de llamar a <strong className="text-foreground">_exit()</strong>, que termina el proceso inmediatamente.
        </p>

        <RichTheory sections={[
          {
            label: "Diferencias clave",
            content: (
              <>
                <ExitVsExitDiagram />
                <ul className="flex flex-col gap-1.5 mt-2">
                  <Item code="exit(status)" label="Limpia buffers, ejecuta atexit() y luego llama a _exit()." color="orange"/>
                  <Item code="_exit(status)" label="Termina el proceso sin pasar por la librería estándar." color="green"/>
                  <Item code="status" label="Solo los 8 bits menos significativos llegan al padre." color="gray"/>
                  <Item code="echo $?" label="Consulta el código de retorno del último proceso en la shell." color="purple"/>
                </ul>
              </>
            ),
          },
          {
            label: "Comportamiento de exit()",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="fflush()" label="Flusha los buffers de salida antes de terminar." color="blue"/>
                <Item code="atexit()" label="Ejecuta funciones registradas en orden inverso." color="blue"/>
                <Item code="_exit()" label="Llama internamente a _exit() tras la limpieza." color="green"/>
              </ul>
            ),
          },
          {
            label: "Señal SIGCHLD",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="SIGCHLD" label="El kernel la envía al padre cuando un hijo termina." color="amber"/>
                <Item code="wait()/waitpid()" label="Recogen el estado del hijo y eliminan el zombi." color="green"/>
                <Item code="init/systemd" label="Adopta hijos huérfanos y ejecuta wait() si el padre murió." color="gray"/>
              </ul>
            ),
          },
        ]} />
      </div>
    ),
    code: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

/* Función registrada con atexit() — se ejecuta al llamar exit() */
void limpieza(void) {
    printf("[atexit] Función de limpieza ejecutada antes de _exit()\\n");
}

int main(void) {
    pid_t hijo;
    int estado;

    atexit(limpieza);  /* Registrar función de limpieza */

    printf("[PADRE] PID=%ld — invocando fork()...\\n", (long)getpid());

    if ((hijo = fork()) == -1) {
        perror("fork");
        exit(EXIT_FAILURE);
    }

    if (hijo == 0) {
        /* ── Proceso HIJO ── */
        printf("[HIJO]  PID=%ld — terminando con exit(42)\\n",
               (long)getpid());
        exit(42);   /* exit() realiza limpieza antes de _exit() */

    } else {
        /* ── Proceso PADRE ── */
        if (wait(&estado) != hijo) {
            fprintf(stderr, "Una señal interrumpió la espera\\n");
        } else {
            printf("[PADRE] PID=%ld — hijo PID=%ld terminó.\\n",
                   (long)getpid(), (long)hijo);
            if (WIFEXITED(estado))
                printf("[PADRE] Código de salida del hijo: %d\\n",
                       WEXITSTATUS(estado));
        }
    }

    exit(EXIT_SUCCESS);
}`,
    language: "c",
    filename: "exit_demo.c",
    terminalLines: [
      "$ gcc exit_demo.c -o exit_demo",
      "$ ./exit_demo",
      "",
      "[PADRE] PID=8000 — invocando fork()...",
      "[HIJO]  PID=8001 — terminando con exit(42)",
      "[atexit] Función de limpieza ejecutada antes de _exit()",
      "[PADRE] PID=8000 — hijo PID=8001 terminó.",
      "[PADRE] Código de salida del hijo: 42",
      "[atexit] Función de limpieza ejecutada antes de _exit()",
      "",
      "$ echo $?",
      "0",
    ],
    terminalTitle: "Terminal — bash · exit_demo",
    conclusion:
      "La diferencia fundamental entre _exit() y exit() es que exit() realiza limpieza (fflush de buffers, funciones atexit()) antes de llamar a _exit(). En procesos hijos creados con fork() a menudo se usa _exit() directamente para evitar que los buffers del padre sean vaciados dos veces. El código de estado de terminación (8 bits menos significativos) permite al padre conocer cómo terminó el hijo.",
    improvements:
      "Registrar múltiples funciones con atexit() y observar que se ejecutan en orden inverso al de registro (LIFO). Comparar el comportamiento de exit() vs _exit() en el hijo cuando hay buffers de salida pendientes. Usar la señal SIGCHLD con sigaction() para detectar la terminación del hijo de forma asíncrona.",
  },

  // ─────────────────────────────────────────────────────────────────
  // 2.7 Estado Zombi
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-2-7",
    number: 6,
    title: "2.7 Estado Zombi",
    difficulty: "Intermedio" as const,
    tags: ["zombi", "EXIT_ZOMBIE", "wait", "tabla de procesos", "ps"],
    objective:
      "Comprender qué es un proceso zombi, por qué se produce, cómo observarlo en el sistema y cómo evitarlo mediante el uso correcto de wait() o waitpid().",
    theory: "",
    theoryNode: (
      <div className="flex flex-col gap-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
        <p className="text-muted-foreground leading-relaxed">
          Un proceso zombi ya terminó, pero el padre no ha recogido su estado de salida. El zombi no consume CPU, pero ocupa una entrada en la tabla de procesos del kernel.
        </p>

        <RichTheory sections={[
          {
            label: "Qué conserva un zombi",
            content: (
              <>
                <ZombieProcessDiagram />
                <ul className="flex flex-col gap-1.5 mt-2">
                  <Item code="PID" label="El proceso conserva su PID incluso después de terminar." color="gray"/>
                  <Item code="código de salida" label="Se mantiene para que el padre pueda consultarlo." color="blue"/>
                  <Item code="tabla de procesos" label="Ocupa una entrada en el kernel hasta que se recoge." color="red"/>
                  <Item code="ps -el | grep Z" label="Comando típico para detectar procesos zombis." color="purple"/>
                </ul>
              </>
            ),
          },
          {
            label: "Cómo se genera",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="fork()" label="El padre crea un hijo." color="blue"/>
                <Item code="exit() / _exit()" label="El hijo termina normalmente." color="green"/>
                <Item code="sin wait()" label="El padre no recoge el estado del hijo." color="red"/>
                <Item code="EXIT_ZOMBIE" label="El kernel marca al hijo como zombi." color="red"/>
              </ul>
            ),
          },
          {
            label: "Cómo evitar zombis",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="wait() / waitpid()" label="Recogen los hijos terminados y liberan la entrada de tabla." color="green"/>
                <Item code="SIGCHLD" label="Manejar SIGCHLD permite recoger hijos sin bloquear." color="amber"/>
                <Item code="init/systemd" label="Si el padre muere, init adopta al hijo y ejecuta wait()." color="gray"/>
              </ul>
            ),
          },
        ]} />
      </div>
    ),
    code: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

/* ══════════════════════════════════════════════════
   Caso 1: Proceso zombi SIN wait()
   ══════════════════════════════════════════════════ */
void caso_zombi(void) {
    pid_t pid = fork();
    if (pid == 0) {
        printf("[CASO 1 HIJO]  PID=%ld — terminando ahora.\\n",
               (long)getpid());
        exit(0);
    } else {
        printf("[CASO 1 PADRE] PID=%ld — durmiendo 15s SIN wait()...\\n",
               (long)getpid());
        printf("               Ejecuta en otra terminal: ps -el | grep Z\\n");
        sleep(15);  /* El hijo queda zombi durante este tiempo */
        printf("[CASO 1 PADRE] Terminando sin recoger al hijo → zombi quedó.\\n");
    }
}

/* ══════════════════════════════════════════════════
   Caso 2: Sin zombi USANDO wait()
   ══════════════════════════════════════════════════ */
void caso_sin_zombi(void) {
    int status;
    pid_t pid = fork();
    if (pid == 0) {
        printf("[CASO 2 HIJO]  PID=%ld — terminando ahora.\\n",
               (long)getpid());
        exit(0);
    } else {
        wait(&status);  /* Recoge al hijo inmediatamente */
        printf("[CASO 2 PADRE] Hijo recogido con wait(). No hay zombi.\\n");
        printf("               El hijo ya NO aparece en la tabla de procesos.\\n");
    }
}

int main(void) {
    printf("\\n=== Demostración del Estado Zombi ===\\n\\n");

    printf("-- Caso 1: SIN wait() --\\n");
    caso_zombi();

    printf("\\n-- Caso 2: CON wait() --\\n");
    caso_sin_zombi();

    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "zombi_demo.c",
    terminalLines: [
      "$ gcc zombi_demo.c -o zombi_demo",
      "$ ./zombi_demo",
      "",
      "=== Demostración del Estado Zombi ===",
      "",
      "-- Caso 1: SIN wait() --",
      "[CASO 1 PADRE] PID=9000 — durmiendo 15s SIN wait()...",
      "[CASO 1 HIJO]  PID=9001 — terminando ahora.",
      "               Ejecuta en otra terminal: ps -el | grep Z",
      "",
      "# En otra terminal durante los 15s:",
      "$ ps -el | grep Z",
      "1 Z  1000  9001  9000 ...  zombi_demo <defunct>",
      "",
      "[CASO 1 PADRE] Terminando sin recoger al hijo → zombi quedó.",
      "",
      "-- Caso 2: CON wait() --",
      "[CASO 2 HIJO]  PID=9002 — terminando ahora.",
      "[CASO 2 PADRE] Hijo recogido con wait(). No hay zombi.",
      "               El hijo ya NO aparece en la tabla de procesos.",
    ],
    terminalTitle: "Terminal — bash · zombi_demo",
    conclusion:
      "El estado zombi es la forma en que el kernel preserva la información de terminación de un proceso hasta que el padre la recoge. No representa un peligro inmediato en sistemas con pocos procesos, pero en servidores de alto tráfico que crean miles de hijos, la acumulación de zombis puede agotar la tabla de procesos e impedir la creación de nuevos procesos. La solución correcta es siempre invocar wait() o manejar SIGCHLD.",
    improvements:
      "Implementar un manejador de SIGCHLD con sigaction() para recoger hijos de forma asíncrona (sin bloquear al padre). Usar WNOHANG en waitpid() para hacer sondeos no bloqueantes periódicos. Simular un servidor concurrente que crea un hijo por solicitud y verificar que no acumule zombis.",
  },

  // ─────────────────────────────────────────────────────────────────
  // 2.8 Hilos / 2.8.2 Creación de hilos
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-2-8",
    number: 7,
    title: "2.8 Hilos y 2.8.2 Creación de hilos con pthread_create()",
    difficulty: "Intermedio" as const,
    tags: ["pthread", "pthread_create", "pthread_join", "pthread_exit", "pthread_self", "pthreads", "POSIX"],
    objective:
      "Comprender el concepto de hilo, su diferencia con los procesos, e implementar programación multi-hilo en C usando la biblioteca POSIX Threads (pthreads) con pthread_create(), pthread_join() y pthread_exit().",
    theory: "",
    theoryNode: (
      <div className="flex flex-col gap-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
        <p className="text-muted-foreground leading-relaxed">
          Los hilos son ejecución concurrente dentro del mismo proceso. Compartiendo el espacio de direcciones, son más ligeros que los procesos, pero requieren sincronización propia para proteger datos compartidos.
        </p>

        <RichTheory sections={[
          {
            label: "Hilos vs procesos",
            content: (
              <>
                <ThreadCreationDiagram />
                <ul className="flex flex-col gap-1.5 mt-2">
                  <Item code="Procesos" label="No comparten memoria; tienen espacios de dirección separados." color="red"/>
                  <Item code="Hilos" label="Comparten memoria, archivos y recursos dentro del mismo proceso." color="green"/>
                  <Item code="Stack privado" label="Cada hilo tiene su propio stack y registros." color="blue"/>
                  <Item code="PC independiente" label="Cada hilo ejecuta su propia rutina." color="blue"/>
                </ul>
              </>
            ),
          },
          {
            label: "Uso de pthread_create()",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="pthread_create()" label="Crea un hilo POSIX con atributos opcionales." color="blue"/>
                <Item code="start_routine" label="Función que ejecuta el hilo (void *f(void *))." color="purple"/>
                <Item code="arg" label="Argumento pasado al hilo al momento de crear." color="purple"/>
                <Item code="pthread_self()" label="Retorna el ID del hilo actual." color="gray"/>
              </ul>
            ),
          },
          {
            label: "Finalización de hilos",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="pthread_exit()" label="Termina el hilo actual y libera sus recursos." color="green"/>
                <Item code="return" label="Retornar de start_routine equivale a pthread_exit()." color="green"/>
                <Item code="pthread_join()" label="Espera la terminación de un hilo específico." color="amber"/>
                <Item code="-lpthread" label="Librería requerida al compilar con gcc." color="gray"/>
              </ul>
            ),
          },
        ]} />
      </div>
    ),
    code: `#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

#define NUM_HILOS 4

/* Estructura para pasar múltiples argumentos al hilo */
typedef struct {
    int    id;
    long   valor;
    long   resultado;
} DatosHilo;

DatosHilo datos[NUM_HILOS];

/* Función que ejecutará cada hilo: calcula factorial */
void *factorial(void *arg) {
    DatosHilo *d = (DatosHilo *)arg;
    long prod = 1;
    printf("[Hilo %d] TID=0x%lx | calculando %ld! ...\\n",
           d->id, (unsigned long)pthread_self(), d->valor);
    for (long i = 1; i <= d->valor; i++) prod *= i;
    d->resultado = prod;
    printf("[Hilo %d] %ld! = %ld | terminando.\\n",
           d->id, d->valor, d->resultado);
    pthread_exit(NULL);
}

int main(void) {
    pthread_t      tids[NUM_HILOS];
    pthread_attr_t attr;
    long valores[] = {5, 7, 10, 3};

    printf("=== Creación de hilos POSIX ===\\n");
    printf("PID del proceso: %d\\n\\n", getpid());

    pthread_attr_init(&attr);  /* atributos por defecto */

    /* Crear hilos */
    for (int i = 0; i < NUM_HILOS; i++) {
        datos[i].id        = i + 1;
        datos[i].valor     = valores[i];
        datos[i].resultado = 0;
        if (pthread_create(&tids[i], &attr, factorial, &datos[i]) != 0) {
            perror("pthread_create"); exit(1);
        }
        printf("[MAIN] Hilo %d creado (TID=0x%lx)\\n",
               i+1, (unsigned long)tids[i]);
    }

    pthread_attr_destroy(&attr);

    /* Esperar a que todos terminen */
    printf("\\n[MAIN] Esperando hilos...\\n\\n");
    for (int i = 0; i < NUM_HILOS; i++)
        pthread_join(tids[i], NULL);

    /* Mostrar resultados */
    printf("\\n--- Resultados ---\\n");
    for (int i = 0; i < NUM_HILOS; i++)
        printf("  %ld! = %ld\\n", datos[i].valor, datos[i].resultado);

    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "pthread_factorial.c",
    terminalLines: [
      "$ gcc pthread_factorial.c -lpthread -o pthread_factorial",
      "$ ./pthread_factorial",
      "",
      "=== Creación de hilos POSIX ===",
      "PID del proceso: 8000",
      "",
      "[MAIN] Hilo 1 creado (TID=0x7f1a2b3c4d50)",
      "[MAIN] Hilo 2 creado (TID=0x7f1a2b3c3d50)",
      "[MAIN] Hilo 3 creado (TID=0x7f1a2b3c2d50)",
      "[MAIN] Hilo 4 creado (TID=0x7f1a2b3c1d50)",
      "",
      "[MAIN] Esperando hilos...",
      "",
      "[Hilo 4] TID=0x7f1a2b3c1d50 | calculando 3! ...",
      "[Hilo 1] TID=0x7f1a2b3c4d50 | calculando 5! ...",
      "[Hilo 2] TID=0x7f1a2b3c3d50 | calculando 7! ...",
      "[Hilo 3] TID=0x7f1a2b3c2d50 | calculando 10! ...",
      "[Hilo 4] 3! = 6 | terminando.",
      "[Hilo 1] 5! = 120 | terminando.",
      "[Hilo 2] 7! = 5040 | terminando.",
      "[Hilo 3] 10! = 3628800 | terminando.",
      "",
      "--- Resultados ---",
      "  5! = 120",
      "  7! = 5040",
      "  10! = 3628800",
      "  3! = 6",
    ],
    terminalTitle: "Terminal — bash · pthread_factorial",
    conclusion:
      "El uso de una estructura (typedef struct) para encapsular los argumentos es el patrón correcto cuando se necesita pasar más de un dato a un hilo. pthread_join() es el equivalente de wait() para hilos: bloquea al hilo llamador hasta que el hilo objetivo termina, garantizando que los resultados estén disponibles antes de leerlos. Los hilos se ejecutan en orden arbitrario, lo que queda evidenciado en la salida ya que el orden de terminación no corresponde al de creación.",
    improvements:
      "Agregar un mutex (pthread_mutex_t) para proteger el acceso a variables globales compartidas entre hilos. Explorar pthread_cancel() y pthread_setcancelstate() para cancelar hilos de forma segura. Comparar el rendimiento (tiempo de creación y ejecución) entre hilos y procesos para la misma carga de trabajo usando clock_gettime().",
  },
];

export function Processes() {
  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30">
            <Cpu className="size-5 text-violet-500" />
          </div>
          <div>
            <p
              className="text-xs font-medium text-muted-foreground uppercase tracking-widest"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Tema 2 · 3 Prácticas
            </p>
            <h1
              className="text-foreground"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.75rem", fontWeight: 700 }}
            >
              Procesos e Hilos
            </h1>
          </div>
        </div>
        <p
          className="text-muted-foreground leading-relaxed max-w-2xl"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {/* Esta sección explora cómo el sistema operativo gestiona la ejecución concurrente. Se estudia la creación de procesos con fork(), la programación multi-hilo con pthreads y la sincronización mediante mutex y variables de condición. */}
           Esta sección explora cómo el sistema operativo gestiona la ejecución concurrente. Se estudia la creación de procesos con fork(), la identificación con getpid()/getppid(), la sincronización con wait()/waitpid(), el estado zombi, y la programación multi-hilo con la biblioteca POSIX Threads (pthreads).
        </p>
        <div className="flex flex-wrap gap-2">
          {["fork()", "pthreads", "Mutex", "Condición de Carrera", "Sincronización"].map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full text-xs bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {practices.map((p) => (
          <PracticeCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
}
