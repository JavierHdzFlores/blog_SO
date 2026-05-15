import { useState } from "react";
import { Network, ChevronDown, ChevronRight } from "lucide-react";
import { PracticeCard } from "../components/PracticeCard";

/* ─── Diagrama SVG: Flujo de tuberías ───────────────────────────── */
function PipeFlowDiagram() {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-blue-500/20 bg-muted/30 p-4">
      <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        // diagrama · flujo de comunicación con pipe()
      </p>
      <svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl mx-auto">
        <defs>
          <marker id="parr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* Proceso Padre */}
        <rect x="50" y="70" width="120" height="60" rx="8" fill="#1e40af" stroke="#3b82f6" strokeWidth="2"/>
        <text x="110" y="95" textAnchor="middle" fill="#dbeafe" fontSize="10" fontFamily="JetBrains Mono">PADRE</text>
        <text x="110" y="110" textAnchor="middle" fill="#93c5fd" fontSize="8" fontFamily="Inter">PID=1000</text>

        {/* Tubería */}
        <rect x="250" y="85" width="100" height="30" rx="15" fill="#1f2937" stroke="#6b7280" strokeWidth="2"/>
        <text x="300" y="103" textAnchor="middle" fill="#d1d5db" fontSize="9" fontFamily="JetBrains Mono">PIPE</text>
        <text x="300" y="115" textAnchor="middle" fill="#9ca3af" fontSize="7" fontFamily="Inter">fd[0] fd[1]</text>

        {/* Proceso Hijo */}
        <rect x="430" y="70" width="120" height="60" rx="8" fill="#166534" stroke="#10b981" strokeWidth="2"/>
        <text x="490" y="95" textAnchor="middle" fill="#d1fae5" fontSize="10" fontFamily="JetBrains Mono">HIJO</text>
        <text x="490" y="110" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontFamily="Inter">PID=1001</text>

        {/* Flechas de flujo */}
        <line x1="170" y1="100" x2="250" y2="100" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#parr)"/>
        <text x="200" y="90" fill="#3b82f6" fontSize="8" fontFamily="Inter">write(fd[1])</text>

        <line x1="350" y1="100" x2="430" y2="100" stroke="#10b981" strokeWidth="2" markerEnd="url(#parr)"/>
        <text x="380" y="90" fill="#10b981" fontSize="8" fontFamily="Inter">read(fd[0])</text>

        {/* Descriptores cerrados */}
        <text x="110" y="140" fill="#ef4444" fontSize="8" fontFamily="JetBrains Mono">close(fd[0])</text>
        <text x="490" y="140" fill="#ef4444" fontSize="8" fontFamily="JetBrains Mono">close(fd[1])</text>
      </svg>
    </div>
  );
}

/* ─── Diagrama SVG: Inspección IPC ─────────────────────────────── */
function IPCInspectionDiagram() {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-cyan-500/20 bg-muted/30 p-4">
      <p className="text-xs font-semibold text-cyan-500 uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        // diagrama · inspección de objetos ipc
      </p>
      <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xl mx-auto">
        {/* Kernel IPC Objects */}
        <rect x="150" y="60" width="200" height="80" rx="8" fill="#1f2937" stroke="#06b6d4" strokeWidth="2"/>
        <text x="250" y="85" textAnchor="middle" fill="#cffafe" fontSize="10" fontFamily="JetBrains Mono">OBJETOS IPC</text>
        <text x="250" y="100" textAnchor="middle" fill="#67e8f9" fontSize="8" fontFamily="Inter">KERNEL</text>

        {/* IPC Types */}
        <rect x="170" y="110" width="60" height="20" rx="4" fill="#166534" stroke="#10b981" strokeWidth="1"/>
        <text x="200" y="122" textAnchor="middle" fill="#d1fae5" fontSize="7" fontFamily="Inter">MSG</text>

        <rect x="240" y="110" width="60" height="20" rx="4" fill="#7c2d12" stroke="#ea580c" strokeWidth="1"/>
        <text x="270" y="122" textAnchor="middle" fill="#fed7aa" fontSize="7" fontFamily="Inter">SHM</text>

        <rect x="310" y="110" width="60" height="20" rx="4" fill="#7c3aed" stroke="#a855f7" strokeWidth="1"/>
        <text x="340" y="122" textAnchor="middle" fill="#e9d5ff" fontSize="7" fontFamily="Inter">SEM</text>

        {/* ipcs command */}
        <rect x="50" y="20" width="80" height="30" rx="6" fill="#1e40af" stroke="#3b82f6" strokeWidth="2"/>
        <text x="90" y="38" textAnchor="middle" fill="#dbeafe" fontSize="9" fontFamily="JetBrains Mono">ipcs</text>

        {/* /proc/sysvipc */}
        <rect x="370" y="20" width="80" height="30" rx="6" fill="#7c2d12" stroke="#ea580c" strokeWidth="2"/>
        <text x="410" y="35" textAnchor="middle" fill="#fed7aa" fontSize="8" fontFamily="JetBrains Mono">/proc</text>
        <text x="410" y="45" textAnchor="middle" fill="#fdba74" fontSize="7" fontFamily="Inter">sysvipc</text>

        {/* ipcrm command */}
        <rect x="50" y="150" width="80" height="30" rx="6" fill="#dc2626" stroke="#ef4444" strokeWidth="2"/>
        <text x="90" y="168" textAnchor="middle" fill="#fecaca" fontSize="9" fontFamily="JetBrains Mono">ipcrm</text>

        {/* Arrows */}
        <defs>
          <marker id="iarr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#06b6d4" />
          </marker>
        </defs>

        <line x1="130" y1="35" x2="150" y2="85" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#iarr)"/>
        <line x1="350" y1="35" x2="350" y2="60" stroke="#ea580c" strokeWidth="2" markerEnd="url(#iarr)"/>
        <line x1="130" y1="165" x2="150" y2="115" stroke="#ef4444" strokeWidth="2" markerEnd="url(#iarr)"/>
      </svg>
    </div>
  );
}

/* ─── Sección de teoría enriquecida ─────────────────────────────── */
interface TheorySection {
  label: string;
  content: React.ReactNode;
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

/* ─── Badge de item de lista ─────────────────────────────────────── */
function Item({ code, label, color = "blue" }: { code: string; label: string; color?: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    red: "bg-red-500/10 text-red-400 border-red-500/30",
    gray: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };
  return (
    <li className="flex items-start gap-2 py-0.5">
      <span className={`mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono border shrink-0 ${colors[color]}`}>{code}</span>
      <span>{label}</span>
    </li>
  );
}

const practices = [
  {
    id: "ipc-practica-1",
    number: 1,
    title: "Tuberías sin nombre — pipe()",
    difficulty: "Básico" as const,
    tags: ["pipe", "IPC", "fork", "comunicación", "POSIX"],
    objective:
      "Crear tuberías sin nombre con pipe() para comunicar un proceso padre con su hijo, comprender el flujo unidireccional de datos y el manejo correcto de los descriptores de lectura y escritura.",
    theory: "",
    theoryNode: (
      <div className="flex flex-col gap-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
        <p className="text-muted-foreground leading-relaxed">
          Las <strong className="text-foreground">tuberías sin nombre (pipes)</strong> son el mecanismo IPC más básico en UNIX. Permiten comunicación unidireccional entre procesos emparentados, donde los datos fluyen desde el descriptor de escritura hacia el de lectura.
        </p>

        <RichTheory sections={[
          {
            label: "Flujo de comunicación con pipe()",
            content: (
              <>
                <PipeFlowDiagram />
                <ul className="flex flex-col gap-1.5 mt-2">
                  <Item code="pipe(fd)"     label="Crea dos descriptores: fd[0] (lectura) y fd[1] (escritura)." color="blue"/>
                  <Item code="fork()"       label="Duplica el proceso; ambos heredan los descriptores." color="blue"/>
                  <Item code="close(fd[0])" label="Hijo cierra lectura; padre cierra escritura." color="red"/>
                  <Item code="write(fd[1])" label="Hijo escribe datos en la tubería." color="green"/>
                  <Item code="read(fd[0])"  label="Padre lee datos de la tubería." color="green"/>
                  <Item code="EOF"         label="Padre recibe fin de archivo cuando hijo cierra fd[1]." color="gray"/>
                </ul>
              </>
            ),
          },
          {
            label: "Limitaciones de pipe()",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="Unidireccional" label="Datos fluyen solo en una dirección (half-duplex)." color="amber"/>
                <Item code="Emparentados"   label="Solo funciona entre procesos que comparten ancestro." color="amber"/>
                <Item code="Temporal"      label="La tubería desaparece cuando se cierran todos los descriptores." color="amber"/>
                <Item code="Sin nombre"    label="No tiene representación en el sistema de archivos." color="gray"/>
              </ul>
            ),
          },
          {
            label: "Prototipos y flags",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="int pipe(int fd[2])" label="Crea tubería; retorna 0 o -1 en error." color="blue"/>
                <Item code="int pipe2(int fd[2], int flags)" label="Versión con flags (O_CLOEXEC, O_NONBLOCK)." color="blue"/>
                <Item code="O_CLOEXEC" label="Cierra descriptores al ejecutar exec()." color="purple"/>
                <Item code="O_NONBLOCK" label="Lectura/escritura no bloqueante." color="purple"/>
              </ul>
            ),
          },
        ]} />
      </div>
    ),
    code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

#define MAXLINE 128

int main(void) {
    int    fd[2];
    pid_t  hijo;
    char   buf[MAXLINE];
    int    n;

    /* 1. Crear la tubería ANTES de fork */
    if (pipe(fd) < 0) {
        perror("pipe"); exit(1);
    }

    printf("[MAIN] Tubería creada: fd[0]=%d (lectura) fd[1]=%d (escritura)\\n",
           fd[0], fd[1]);

    if ((hijo = fork()) < 0) {
        perror("fork"); exit(1);
    }

    /* ---- HIJO: escribe en la tubería ---- */
    if (hijo == 0) {
        close(fd[0]);  // El hijo no necesita leer
        const char *msg = "Hola desde el proceso hijo!\\n";
        printf("[HIJO]  PID=%ld | Escribiendo en la tubería...\\n",
               (long)getpid());
        write(fd[1], msg, strlen(msg));
        close(fd[1]);
        exit(EXIT_SUCCESS);
    }

    /* ---- PADRE: lee desde la tubería ---- */
    close(fd[1]);  // El padre no necesita escribir
    printf("[PADRE] PID=%ld | Leyendo desde la tubería...\\n",
           (long)getpid());
    n = read(fd[0], buf, MAXLINE - 1);
    buf[n] = '\\0';
    printf("[PADRE] Recibido (%d bytes): %s", n, buf);
    close(fd[0]);

    wait(NULL);  // Evitar zombi
    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "pipe_demo.c",
    terminalLines: [
      "$ gcc pipe_demo.c -o pipe_demo",
      "$ ./pipe_demo",
      "",
      "[MAIN] Tubería creada: fd[0]=3 (lectura) fd[1]=4 (escritura)",
      "[PADRE] PID=9000 | Leyendo desde la tubería...",
      "[HIJO]  PID=9001 | Escribiendo en la tubería...",
      "[PADRE] Recibido (28 bytes): Hola desde el proceso hijo!",
    ],
    terminalTitle: "Terminal — bash · pipe_demo",
    conclusion:
      "Cerrar el extremo no utilizado en cada proceso es fundamental: si el padre no cierra fd[1], el read() nunca detecta EOF aunque el hijo cierre su extremo, porque el kernel solo envía EOF cuando todos los descriptores de escritura están cerrados. El orden de ejecución entre padre e hijo depende del planificador, pero read() bloquea al padre hasta que haya datos disponibles.",
    improvements:
      "Para comunicación bidireccional crearía dos tuberías (una para cada dirección). También implementaría un shell pipeline (ls | grep) conectando stdout de un proceso con stdin del siguiente usando dup2() para redirigir los descriptores estándar hacia los extremos de la tubería.",
  },
  {
    id: "ipc-practica-2",
    number: 2,
    title: "Tuberías con nombre — mkfifo()",
    difficulty: "Básico" as const,
    tags: ["fifo", "mkfifo", "IPC", "named pipe", "POSIX"],
    objective:
      "Crear tuberías con nombre (FIFO) usando mkfifo() para comunicar procesos no emparentados, comprendiendo que el archivo FIFO persiste en el sistema de archivos y que su apertura bloquea hasta que ambos extremos estén listos.",
    theory: "",
    theoryNode: (
      <div className="flex flex-col gap-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
        <p className="text-muted-foreground leading-relaxed">
          Las <strong className="text-foreground">tuberías con nombre (FIFOs)</strong> resuelven la limitación principal de los pipes: permiten comunicación entre procesos que no comparten ancestro, ya que el archivo FIFO persiste en el sistema de archivos.
        </p>

        <RichTheory sections={[
          {
            label: "pipe() vs mkfifo()",
            content: (
              <>
                <FifoVsPipeDiagram />
              </>
            ),
          },
          {
            label: "Comportamiento de apertura",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="open(O_RDONLY)" label="Bloquea hasta que otro proceso abra para escritura." color="amber"/>
                <Item code="open(O_WRONLY)" label="Bloquea hasta que otro proceso abra para lectura." color="amber"/>
                <Item code="Sincronización" label="La apertura mutua sincroniza automáticamente el inicio." color="green"/>
                <Item code="unlink()"      label="Elimina el archivo FIFO del sistema de archivos." color="red"/>
              </ul>
            ),
          },
          {
            label: "Prototipos y funciones",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="int mkfifo(const char *pathname, mode_t mode)" label="Crea archivo FIFO especial." color="purple"/>
                <Item code="umask(~0666)" label="Ajusta máscara de permisos antes de crear." color="purple"/>
                <Item code="O_RDONLY/O_WRONLY" label="Modos de apertura para lectura/escritura." color="blue"/>
                <Item code="ls -la /tmp/fifo" label="Ver archivo FIFO en el sistema de archivos." color="gray"/>
              </ul>
            ),
          },
        ]} />
      </div>
    ),
    code: `#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <unistd.h>

#define FIFO_PATH "mi_tuberia"
#define MSG_SIZE  64

int main(void) {
    pid_t hijo;
    int   fd;
    char  mensaje[MSG_SIZE];

    /* Eliminar FIFO previo si existe */
    unlink(FIFO_PATH);

    /* Ajustar máscara y crear el FIFO */
    umask(~0666);
    if (mkfifo(FIFO_PATH, 0666) == -1) {
        perror("mkfifo"); exit(1);
    }
    printf("[MAIN] FIFO '%s' creado en el sistema de archivos.\\n", FIFO_PATH);

    if ((hijo = fork()) < 0) {
        perror("fork"); exit(1);
    }

    /* ---- HIJO: escribe en el FIFO ---- */
    if (hijo == 0) {
        printf("[HIJO]  PID=%ld | Abriendo FIFO para escritura...\\n",
               (long)getpid());
        fd = open(FIFO_PATH, O_WRONLY);  // Bloqueará hasta que padre abra O_RDONLY
        if (fd == -1) { perror("open FIFO escritura"); exit(1); }

        snprintf(mensaje, MSG_SIZE, "Mensaje del HIJO PID=%ld", (long)getpid());
        write(fd, mensaje, MSG_SIZE);
        printf("[HIJO]  Escribió: '%s'\\n", mensaje);
        close(fd);
        exit(EXIT_SUCCESS);
    }

    /* ---- PADRE: lee del FIFO ---- */
    printf("[PADRE] PID=%ld | Abriendo FIFO para lectura...\\n",
           (long)getpid());
    fd = open(FIFO_PATH, O_RDONLY);      // Bloqueará hasta que hijo abra O_WRONLY
    if (fd == -1) { perror("open FIFO lectura"); exit(1); }

    read(fd, mensaje, MSG_SIZE);
    printf("[PADRE] Recibió: '%s'\\n", mensaje);
    close(fd);

    wait(NULL);

    /* Limpiar el archivo FIFO del sistema de archivos */
    unlink(FIFO_PATH);
    printf("[MAIN] FIFO eliminado.\\n");

    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "fifo_demo.c",
    terminalLines: [
      "$ gcc fifo_demo.c -o fifo_demo",
      "$ ./fifo_demo",
      "",
      "[MAIN] FIFO 'mi_tuberia' creado en el sistema de archivos.",
      "[PADRE] PID=10000 | Abriendo FIFO para lectura...",
      "[HIJO]  PID=10001 | Abriendo FIFO para escritura...",
      "[HIJO]  Escribió: 'Mensaje del HIJO PID=10001'",
      "[PADRE] Recibió: 'Mensaje del HIJO PID=10001'",
      "[MAIN] FIFO eliminado.",
      "",
      "$ ls mi_tuberia",
      "ls: cannot access 'mi_tuberia': No such file or directory",
    ],
    terminalTitle: "Terminal — bash · fifo_demo",
    conclusion:
      "El bloqueo mutuo en la apertura es una característica importante: open(O_RDONLY) bloquea hasta que alguien abra el otro extremo, lo que sincroniza implícitamente el inicio de la comunicación. Esto lo hace diferente de un archivo normal. Para comunicación entre procesos no emparentados en terminal separadas, uno ejecutaría el escritor y el otro el lector usando el mismo nombre de FIFO.",
    improvements:
      "Implementaría el escenario real: dos programas independientes (escritor.c y lector.c) que se comunican abriendo el mismo FIFO desde terminales distintas. También probaría la comunicación sin fork() para demostrar que los FIFOs sirven para procesos completamente independientes.",
  },
  {
    id: "ipc-practica-3",
    number: 3,
    title: "Semáforos System V — semget(), semop(), semctl()",
    difficulty: "Avanzado" as const,
    tags: ["semáforos", "System V", "semget", "semop", "semctl", "ftok", "sincronización"],
    objective:
      "Implementar sincronización entre procesos usando semáforos de System V: crear la llave con ftok(), obtener el conjunto de semáforos con semget(), realizar operaciones atómicas con semop() y administrarlos con semctl().",
    theory: "",
    theoryNode: (
      <div className="flex flex-col gap-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
        <p className="text-muted-foreground leading-relaxed">
          Los <strong className="text-foreground">semáforos System V</strong> son conjuntos de valores enteros no negativos mantenidos por el kernel. Cada operación es atómica, garantizando sincronización sin condiciones de carrera.
        </p>

        <RichTheory sections={[
          {
            label: "Flujo de sincronización con semáforos",
            content: (
              <>
                <SemaphoreSyncDiagram />
                <ul className="flex flex-col gap-1.5 mt-2">
                  <Item code="ftok()"       label="Genera llave única de 32 bits a partir de pathname + proj_id." color="blue"/>
                  <Item code="semget()"     label="Crea/obtiene conjunto de semáforos con permisos IPC_CREAT|0600." color="blue"/>
                  <Item code="semctl(SETVAL)" label="Inicializa valores de los semáforos en el conjunto." color="green"/>
                  <Item code="semop(-1)"    label="Decrementa semáforo (bloquea si valor = 0)." color="amber"/>
                  <Item code="semop(+1)"    label="Incrementa semáforo (despierta procesos esperando)." color="green"/>
                  <Item code="semctl(IP_RMID)" label="Elimina el conjunto de semáforos del kernel." color="red"/>
                </ul>
              </>
            ),
          },
          {
            label: "Estructura sembuf para operaciones",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="sem_num" label="Índice del semáforo dentro del conjunto (0, 1, 2...)." color="blue"/>
                <Item code="sem_op"  label="Operación: negativo (decrementar), positivo (incrementar), 0 (esperar a cero)." color="amber"/>
                <Item code="sem_flg" label="Flags: 0 (bloqueante) o IPC_NOWAIT (no bloqueante)." color="purple"/>
              </ul>
            ),
          },
          {
            label: "Comandos del sistema",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="ipcs -s"      label="Lista todos los conjuntos de semáforos activos." color="gray"/>
                <Item code="ipcrm -s semid" label="Elimina un conjunto de semáforos específico." color="red"/>
              </ul>
            ),
          },
        ]} />
      </div>
    ),
    code: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>
#include <unistd.h>
#include <errno.h>

#define SEM_HIJO  0
#define SEM_PADRE 1
#define ITERACIONES 5

/* Función auxiliar para realizar una operación sobre el semáforo */
void sem_op(int semid, int sem_num, int operacion) {
    struct sembuf op;
    op.sem_num = sem_num;
    op.sem_op  = operacion;
    op.sem_flg = 0;
    if (semop(semid, &op, 1) == -1) {
        perror("semop"); exit(1);
    }
}

int main(int argc, char *argv[]) {
    int    semid;
    pid_t  pid;
    key_t  llave;

    /* Generar llave a partir del ejecutable */
    llave = ftok(argv[0], 'a');
    if (llave == -1) { perror("ftok"); exit(1); }

    /* Crear conjunto de 2 semáforos */
    semid = semget(llave, 2, IPC_CREAT | 0600);
    if (semid == -1) { perror("semget"); exit(1); }

    printf("=== Sincronización con semáforos System V ===\\n");
    printf("semid=%d | llave=0x%x\\n\\n", semid, llave);

    /* Inicializar: hijo bloqueado (0), padre desbloqueado (1) */
    semctl(semid, SEM_HIJO,  SETVAL, 0);
    semctl(semid, SEM_PADRE, SETVAL, 1);

    if ((pid = fork()) < 0) {
        perror("fork"); exit(1);
    }

    if (pid == 0) {
        /* ---- PROCESO HIJO ---- */
        for (int i = 1; i <= ITERACIONES; i++) {
            sem_op(semid, SEM_HIJO, -1);    // Esperar turno del hijo
            printf("[HIJO]  iteración %d | PID=%ld\\n", i, (long)getpid());
            sem_op(semid, SEM_PADRE, +1);   // Ceder turno al padre
        }
        semctl(semid, 0, IPC_RMID, 0);     // Eliminar semáforos
        exit(EXIT_SUCCESS);

    } else {
        /* ---- PROCESO PADRE ---- */
        for (int i = 1; i <= ITERACIONES; i++) {
            sem_op(semid, SEM_PADRE, -1);   // Esperar turno del padre
            printf("[PADRE] iteración %d | PID=%ld\\n", i, (long)getpid());
            sem_op(semid, SEM_HIJO, +1);    // Ceder turno al hijo
        }
    }

    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "semaforos_sysv.c",
    terminalLines: [
      "$ gcc semaforos_sysv.c -o semaforos_sysv",
      "$ ./semaforos_sysv",
      "",
      "=== Sincronización con semáforos System V ===",
      "semid=1 | llave=0x6100050e",
      "",
      "[PADRE] iteración 1 | PID=11000",
      "[HIJO]  iteración 1 | PID=11001",
      "[PADRE] iteración 2 | PID=11000",
      "[HIJO]  iteración 2 | PID=11001",
      "[PADRE] iteración 3 | PID=11000",
      "[HIJO]  iteración 3 | PID=11001",
      "[PADRE] iteración 4 | PID=11000",
      "[HIJO]  iteración 4 | PID=11001",
      "[PADRE] iteración 5 | PID=11000",
      "[HIJO]  iteración 5 | PID=11001",
      "",
      "$ ipcs -s",
      "------ Matrices semáforo ------",
      "key        semid  propietario  perms  nsems",
      "(vacío: semáforos ya eliminados con IPC_RMID)",
    ],
    terminalTitle: "Terminal — bash · semaforos_sysv",
    conclusion:
      "El uso de dos semáforos (uno por proceso) garantiza alternancia estricta: el padre siempre va primero porque SEM_PADRE se inicializa en 1 y SEM_HIJO en 0. La atomicidad de semop() es el punto clave: el kernel garantiza que el decremento de un semáforo en cero sea indivisible, eliminando las condiciones de carrera. Es crucial eliminar los semáforos con IPC_RMID al final; de lo contrario, persisten en el kernel incluso después de que el proceso termine.",
    improvements:
      "Probaría los semáforos POSIX (sem_init, sem_wait, sem_post) que no requieren llave y son más simples para uso entre hilos. También implementaría un semáforo como mutex (valor inicial = 1) para proteger una sección crítica, y compararía el rendimiento entre semáforos System V y POSIX.",
  },
  {
    id: "ipc-practica-4",
    number: 4,
    title: "Memoria compartida — shmget(), shmat(), shmdt()",
    difficulty: "Avanzado" as const,
    tags: ["memoria compartida", "shmget", "shmat", "shmdt", "shmctl", "System V", "IPC"],
    objective:
      "Implementar comunicación entre procesos mediante un segmento de memoria compartida de System V, comprendiendo el ciclo de vida completo: crear, adjuntar, usar, desadjuntar y eliminar el segmento.",
    theory: "",
    theoryNode: (
      <div className="flex flex-col gap-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
        <p className="text-muted-foreground leading-relaxed">
          La <strong className="text-foreground">memoria compartida System V</strong> es el mecanismo IPC más rápido porque permite acceso directo a la misma región de memoria sin copias. Sin embargo, requiere sincronización externa para evitar condiciones de carrera.
        </p>

        <RichTheory sections={[
          {
            label: "Ciclo de vida completo de memoria compartida",
            content: (
              <>
                <SharedMemoryDiagram />
                <ul className="flex flex-col gap-1.5 mt-2">
                  <Item code="shmget()"      label="Crea/obtiene segmento con tamaño y permisos IPC_CREAT|0600." color="blue"/>
                  <Item code="shmat()"       label="Adjunta segmento al espacio de direcciones del proceso." color="green"/>
                  <Item code="*ptr = data"   label="Acceso directo a memoria compartida (lectura/escritura)." color="green"/>
                  <Item code="shmdt()"       label="Desadjunta segmento (no lo elimina del kernel)." color="amber"/>
                  <Item code="shmctl(IP_RMID)" label="Elimina definitivamente el segmento del kernel." color="red"/>
                </ul>
              </>
            ),
          },
          {
            label: "Comandos de control shmctl()",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="IPC_STAT"  label="Lee información del segmento (shmid_ds)." color="gray"/>
                <Item code="IPC_SET"   label="Modifica permisos y propietario." color="purple"/>
                <Item code="SHM_LOCK"  label="Fija segmento en memoria RAM (no swap)." color="amber"/>
                <Item code="SHM_UNLOCK" label="Libera segmento para swap." color="amber"/>
              </ul>
            ),
          },
          {
            label: "Comandos del sistema",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="ipcs -m"         label="Lista segmentos de memoria compartida activos." color="gray"/>
                <Item code="cat /proc/sysvipc/shm" label="Estado detallado en el kernel." color="gray"/>
              </ul>
            ),
          },
          {
            label: "Limitaciones críticas",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="Sin sincronización" label="Requiere semáforos/mutex externos para evitar race conditions." color="red"/>
                <Item code="Direcciones virtuales" label="Cada proceso ve el segmento en dirección diferente." color="amber"/>
                <Item code="Persistencia" label="Segmentos sobreviven a procesos si no se eliminan." color="amber"/>
              </ul>
            ),
          },
        ]} />
      </div>
    ),
    code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <sys/wait.h>
#include <unistd.h>

#define SHM_SIZE 4096
#define MSG_MAX  256

/* Estructura que vivirá en la memoria compartida */
typedef struct {
    int   contador;
    char  mensaje[MSG_MAX];
    int   listo;        // bandera de sincronización simple
} DatosCompartidos;

int main(void) {
    int             shmid;
    DatosCompartidos *datos;
    pid_t           hijo;

    /* 1. Crear el segmento de memoria compartida */
    shmid = shmget(IPC_PRIVATE, SHM_SIZE, IPC_CREAT | 0600);
    if (shmid == -1) { perror("shmget"); exit(1); }
    printf("=== Memoria Compartida System V ===\\n");
    printf("[MAIN] Segmento creado: shmid=%d | tamaño=%d bytes\\n\\n",
           shmid, SHM_SIZE);

    /* 2. Adjuntar al espacio de direcciones */
    datos = (DatosCompartidos *)shmat(shmid, NULL, 0);
    if (datos == (void *)-1) { perror("shmat"); exit(1); }

    /* Inicializar la región compartida */
    datos->contador = 0;
    datos->listo    = 0;
    memset(datos->mensaje, 0, MSG_MAX);

    if ((hijo = fork()) < 0) { perror("fork"); exit(1); }

    /* ---- HIJO: escribe en la memoria compartida ---- */
    if (hijo == 0) {
        printf("[HIJO]  PID=%ld | Escribiendo en memoria compartida...\\n",
               (long)getpid());
        datos->contador = 42;
        snprintf(datos->mensaje, MSG_MAX,
                 "Hola desde el hijo PID=%ld!", (long)getpid());
        datos->listo = 1;   // Señal simple (en producción: usar semáforo)
        printf("[HIJO]  contador=%d | mensaje='%s'\\n",
               datos->contador, datos->mensaje);
        shmdt(datos);
        exit(EXIT_SUCCESS);
    }

    /* ---- PADRE: espera y lee de la memoria compartida ---- */
    while (!datos->listo) usleep(1000);  // Espera activa (simplificada)
    printf("[PADRE] PID=%ld | Leyendo desde memoria compartida...\\n",
           (long)getpid());
    printf("[PADRE] contador=%d | mensaje='%s'\\n",
           datos->contador, datos->mensaje);

    wait(NULL);

    /* 4. Desadjuntar y 5. Eliminar el segmento */
    shmdt(datos);
    shmctl(shmid, IPC_RMID, NULL);
    printf("\\n[MAIN] Segmento shmid=%d eliminado.\\n", shmid);

    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "shm_demo.c",
    terminalLines: [
      "$ gcc shm_demo.c -o shm_demo",
      "$ ./shm_demo",
      "",
      "=== Memoria Compartida System V ===",
      "[MAIN] Segmento creado: shmid=884743 | tamaño=4096 bytes",
      "",
      "[HIJO]  PID=12001 | Escribiendo en memoria compartida...",
      "[HIJO]  contador=42 | mensaje='Hola desde el hijo PID=12001!'",
      "[PADRE] PID=12000 | Leyendo desde memoria compartida...",
      "[PADRE] contador=42 | mensaje='Hola desde el hijo PID=12001!'",
      "",
      "[MAIN] Segmento shmid=884743 eliminado.",
      "",
      "$ ipcs -m",
      "------ Segmentos memoria compartida ------",
      "clave      shmid  propietario  perms  bytes   nattch  estado",
      "(vacío: segmento eliminado con IPC_RMID)",
    ],
    terminalTitle: "Terminal — bash · shm_demo",
    conclusion:
      "La espera activa (while(!datos->listo)) es solo una simplificación didáctica; en aplicaciones reales se deben usar semáforos para sincronizar el acceso a la memoria compartida. shmat() retorna un puntero ordinario en C, lo que permite acceder a la región compartida con la misma sintaxis que cualquier estructura. Es fundamental eliminar el segmento con IPC_RMID; de lo contrario, persiste en el kernel incluso después de que todos los procesos terminen.",
    improvements:
      "Combinaría la memoria compartida con semáforos System V (o POSIX) para sincronización correcta sin espera activa. Implementaría un buffer circular en la región compartida para el problema Productor-Consumidor. También exploraría mmap() con MAP_SHARED como alternativa POSIX más moderna a shmget/shmat.",
  },
  {
    id: "ipc-practica-5",
    number: 5,
    title: "Cola de mensajes — msgget(), msgsnd(), msgrcv()",
    difficulty: "Avanzado" as const,
    tags: ["cola de mensajes", "msgget", "msgsnd", "msgrcv", "msgctl", "System V", "IPC"],
    objective:
      "Implementar comunicación asíncrona entre procesos usando colas de mensajes de System V: crear la cola con msgget(), enviar mensajes tipados con msgsnd() y recibirlos selectivamente con msgrcv().",
    theory: "",
    theoryNode: (
      <div className="flex flex-col gap-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
        <p className="text-muted-foreground leading-relaxed">
          Las <strong className="text-foreground">colas de mensajes System V</strong> permiten comunicación asíncrona entre procesos con filtrado por tipo. Los mensajes quedan en la cola del kernel hasta ser consumidos, a diferencia de los pipes que son síncronos.
        </p>

        <RichTheory sections={[
          {
            label: "Flujo de comunicación con colas de mensajes",
            content: (
              <>
                <MessageQueueDiagram />
                <ul className="flex flex-col gap-1.5 mt-2">
                  <Item code="msgget()"      label="Crea/obtiene cola con llave ftok() + IPC_CREAT." color="blue"/>
                  <Item code="msgsnd()"      label="Envía mensaje tipado a la cola (mtype > 0)." color="green"/>
                  <Item code="msgrcv()"      label="Recibe mensaje filtrando por tipo (0=FIFO, >0=tipo exacto, <0=menor igual)." color="green"/>
                  <Item code="msgctl(IP_RMID)" label="Elimina la cola del kernel." color="red"/>
                </ul>
              </>
            ),
          },
          {
            label: "Estructura del mensaje msgbuf",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="long mtype"     label="Tipo del mensaje (debe ser > 0 para filtrado)." color="blue"/>
                <Item code="char mtext[]"   label="Cuerpo del mensaje (tamaño variable)." color="blue"/>
                <Item code="msgsz"         label="Tamaño de mtext (excluyendo mtype)." color="purple"/>
              </ul>
            ),
          },
          {
            label: "Modos de recepción msgrcv()",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="msgtyp = 0"    label="Primer mensaje de la cola (FIFO)." color="gray"/>
                <Item code="msgtyp > 0"    label="Primer mensaje de tipo exacto." color="amber"/>
                <Item code="msgtyp < 0"    label="Primer mensaje con tipo ≤ |msgtyp| (prioridades)." color="amber"/>
                <Item code="MSG_NOERROR"   label="Trunca mensaje si es mayor que msgsz." color="red"/>
              </ul>
            ),
          },
          {
            label: "Comandos del sistema",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="ipcs -q"       label="Lista colas de mensajes activas." color="gray"/>
                <Item code="ipcrm -q msqid" label="Elimina cola específica." color="red"/>
              </ul>
            ),
          },
        ]} />
      </div>
    ),
    code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>
#include <errno.h>
#include <sys/msg.h>
#include <sys/wait.h>

#define TIPO_NORMAL  1
#define TIPO_URGENTE 2
#define TEXTO_MAX    80

struct msgbuf {
    long mtype;
    char mtext[TEXTO_MAX];
};

int main(int argc, char *argv[]) {
    int   msqid;
    key_t llave;

    llave = ftok(argv[0], 'q');
    if (llave == -1) { perror("ftok"); exit(1); }

    msqid = msgget(llave, IPC_CREAT | 0666);
    if (msqid == -1) { perror("msgget"); exit(1); }

    printf("=== Cola de mensajes System V ===\\n");
    printf("[MAIN] Cola creada: msqid=%d\\n\\n", msqid);

    pid_t hijo = fork();
    if (hijo < 0) { perror("fork"); exit(1); }

    /* ---- HIJO: envía mensajes a la cola ---- */
    if (hijo == 0) {
        struct msgbuf msg;
        time_t t;

        /* Mensaje urgente */
        msg.mtype = TIPO_URGENTE;
        time(&t);
        snprintf(msg.mtext, TEXTO_MAX,
                 "[URGENTE] Alerta del hijo PID=%ld a las %s",
                 (long)getpid(), ctime(&t));
        msg.mtext[strlen(msg.mtext)-1] = '\\0'; // quitar \\n de ctime
        msgsnd(msqid, &msg, sizeof(msg.mtext), 0);
        printf("[HIJO]  Envió tipo=%ld: '%s'\\n", msg.mtype, msg.mtext);

        /* Mensaje normal */
        msg.mtype = TIPO_NORMAL;
        snprintf(msg.mtext, TEXTO_MAX,
                 "[NORMAL] Reporte del hijo PID=%ld", (long)getpid());
        msgsnd(msqid, &msg, sizeof(msg.mtext), 0);
        printf("[HIJO]  Envió tipo=%ld: '%s'\\n", msg.mtype, msg.mtext);

        exit(EXIT_SUCCESS);
    }

    /* ---- PADRE: recibe mensajes filtrando por tipo ---- */
    wait(NULL); // Asegurarse de que el hijo envió ambos mensajes

    struct msgbuf recibido;

    printf("[PADRE] Recibiendo primero el mensaje URGENTE (tipo=%d)...\\n",
           TIPO_URGENTE);
    msgrcv(msqid, &recibido, sizeof(recibido.mtext), TIPO_URGENTE, 0);
    printf("[PADRE] Recibió tipo=%ld: '%s'\\n\\n",
           recibido.mtype, recibido.mtext);

    printf("[PADRE] Recibiendo ahora el mensaje NORMAL (tipo=%d)...\\n",
           TIPO_NORMAL);
    msgrcv(msqid, &recibido, sizeof(recibido.mtext), TIPO_NORMAL, 0);
    printf("[PADRE] Recibió tipo=%ld: '%s'\\n",
           recibido.mtype, recibido.mtext);

    /* Eliminar la cola */
    msgctl(msqid, IPC_RMID, NULL);
    printf("\\n[MAIN] Cola msqid=%d eliminada.\\n", msqid);

    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "msgqueue_demo.c",
    terminalLines: [
      "$ gcc msgqueue_demo.c -o msgqueue_demo",
      "$ ./msgqueue_demo",
      "",
      "=== Cola de mensajes System V ===",
      "[MAIN] Cola creada: msqid=3",
      "",
      "[HIJO]  Envió tipo=2: '[URGENTE] Alerta del hijo PID=13001 a las Thu May 14 ...'",
      "[HIJO]  Envió tipo=1: '[NORMAL] Reporte del hijo PID=13001'",
      "[PADRE] Recibiendo primero el mensaje URGENTE (tipo=2)...",
      "[PADRE] Recibió tipo=2: '[URGENTE] Alerta del hijo PID=13001 a las Thu May 14 ...'",
      "",
      "[PADRE] Recibiendo ahora el mensaje NORMAL (tipo=1)...",
      "[PADRE] Recibió tipo=1: '[NORMAL] Reporte del hijo PID=13001'",
      "",
      "[MAIN] Cola msqid=3 eliminada.",
    ],
    terminalTitle: "Terminal — bash · msgqueue_demo",
    conclusion:
      "El filtrado por tipo es la característica distintiva de las colas de mensajes frente a los pipes: el receptor puede elegir qué tipo de mensaje leer independientemente del orden en que llegaron. En el ejemplo, aunque el padre espera hasta que el hijo envíe ambos mensajes, recibe primero el URGENTE aunque llegó primero a la cola. Esto es imposible con pipes o FIFOs, que son estrictamente FIFO sin filtrado.",
    improvements:
      "Implementaría un servidor concurrente que despache diferentes tipos de mensajes a diferentes workers, usando msgrcv() con msgtyp=-N (leer el de menor tipo ≤ N) para implementar prioridades. También mediría el throughput con clock_gettime() y lo compararía con pipes y memoria compartida.",
  },
  {
    id: "ipc-practica-6",
    number: 6,
    title: "Inspección de objetos IPC con ipcs e /proc/sysvipc",
    difficulty: "Básico" as const,
    tags: ["ipcs", "ipcrm", "proc", "System V", "diagnóstico", "comandos"],
    objective:
      "Inspeccionar los mecanismos IPC activos en el sistema usando el comando ipcs y los archivos virtuales del directorio /proc/sysvipc, y eliminar objetos IPC huérfanos con ipcrm.",
    theory: "",
    theoryNode: (
      <div className="flex flex-col gap-3 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
        <p className="text-muted-foreground leading-relaxed">
          GNU/Linux ofrece herramientas para <strong className="text-foreground">inspeccionar y gestionar</strong> los objetos IPC System V activos en el sistema. Los objetos IPC persisten en el kernel hasta ser eliminados explícitamente.
        </p>

        <RichTheory sections={[
          {
            label: "Herramientas de inspección",
            content: (
              <>
                <IPCInspectionDiagram />
                <ul className="flex flex-col gap-1.5 mt-2">
                  <Item code="ipcs"          label="Muestra todos los objetos IPC activos (mensajes, memoria, semáforos)." color="blue"/>
                  <Item code="ipcs -q/-m/-s" label="Filtra por tipo: colas, memoria compartida, semáforos." color="blue"/>
                  <Item code="ipcs -l"       label="Muestra límites del sistema para cada mecanismo IPC." color="purple"/>
                  <Item code="/proc/sysvipc/" label="Archivos virtuales con información detallada del kernel." color="gray"/>
                </ul>
              </>
            ),
          },
          {
            label: "Límites del sistema",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="/proc/sys/kernel/shmmax" label="Tamaño máximo de segmento de memoria compartida." color="green"/>
                <Item code="/proc/sys/kernel/sem"    label="Parámetros de semáforos (SEMMSL, SEMMNS, SEMOPM, SEMMNI)." color="amber"/>
                <Item code="/proc/sys/kernel/msgmax" label="Tamaño máximo de un mensaje individual." color="purple"/>
                <Item code="/proc/sys/kernel/msgmnb" label="Tamaño máximo total de una cola de mensajes." color="purple"/>
              </ul>
            ),
          },
          {
            label: "Eliminación de objetos huérfanos",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="ipcrm -q msqid" label="Elimina cola de mensajes específica." color="red"/>
                <Item code="ipcrm -m shmid" label="Elimina segmento de memoria compartida." color="red"/>
                <Item code="ipcrm -s semid" label="Elimina conjunto de semáforos." color="red"/>
                <Item code="IPC_RMID"       label="Flag para eliminación programática desde código." color="red"/>
              </ul>
            ),
          },
          {
            label: "Archivos de estado detallado",
            content: (
              <ul className="flex flex-col gap-1.5">
                <Item code="/proc/sysvipc/msg" label="Información detallada de colas de mensajes." color="gray"/>
                <Item code="/proc/sysvipc/shm" label="Información detallada de memoria compartida." color="gray"/>
                <Item code="/proc/sysvipc/sem" label="Información detallada de semáforos." color="gray"/>
              </ul>
            ),
          },
        ]} />
      </div>
    ),
    code: `#!/bin/bash
# Script de diagnóstico de IPC
# Guarda como: ipc_diagnostico.sh
# Ejecuta con: bash ipc_diagnostico.sh

echo "============================================"
echo "  Diagnóstico de mecanismos IPC System V"
echo "============================================"
echo ""

# --- Resumen general con ipcs ---
echo ">>> ipcs (resumen general):"
ipcs
echo ""

# --- Detalle de cada tipo ---
echo ">>> Colas de mensajes (ipcs -q):"
ipcs -q
echo ""

echo ">>> Memoria compartida (ipcs -m):"
ipcs -m
echo ""

echo ">>> Semáforos (ipcs -s):"
ipcs -s
echo ""

# --- Archivos virtuales /proc/sysvipc ---
echo ">>> Contenido de /proc/sysvipc/:"
ls -la /proc/sysvipc/
echo ""

echo ">>> /proc/sysvipc/sem (semáforos en el kernel):"
cat /proc/sysvipc/sem
echo ""

echo ">>> /proc/sysvipc/shm (memoria compartida en el kernel):"
cat /proc/sysvipc/shm
echo ""

# --- Límites del sistema ---
echo ">>> Límites IPC (/proc/sys/kernel/):"
echo -n "  shmmax (máx. bytes por segmento SHM): "
cat /proc/sys/kernel/shmmax
echo -n "  msgmax (máx. bytes por mensaje):      "
cat /proc/sys/kernel/msgmax
echo -n "  sem (SEMMSL SEMMNS SEMOPM SEMMNI):    "
cat /proc/sys/kernel/sem
echo ""

echo ">>> Límites formateados (ipcs -l):"
ipcs -l`,
    language: "bash",
    filename: "ipc_diagnostico.sh",
    terminalLines: [
      "$ bash ipc_diagnostico.sh",
      "",
      "============================================",
      "  Diagnóstico de mecanismos IPC System V",
      "============================================",
      "",
      ">>> ipcs (resumen general):",
      "------ Colas de mensajes ------",
      "clave      msqid  propietario  perms  bytes  mensajes",
      "",
      "------ Segmentos memoria compartida ------",
      "clave      shmid  propietario  perms  bytes    nattch  estado",
      "0x00000000 884743 gcgero       600    1048576  2       dest",
      "",
      "------ Matrices semáforo ------",
      "clave      semid  propietario  perms  nsems",
      "0x6100050e 1      gcgero       600    2",
      "",
      ">>> /proc/sysvipc/sem (semáforos en el kernel):",
      "key        semid perms nsems uid gid cuid cgid  otime   ctime",
      "1627391246 1     600   2     1000 1000 1000 1000 1772583562 1772583561",
      "",
      ">>> Límites IPC (/proc/sys/kernel/):",
      "  shmmax (máx. bytes por segmento SHM): 18446744073692774399",
      "  msgmax (máx. bytes por mensaje):      8192",
      "  sem (SEMMSL SEMMNS SEMOPM SEMMNI):    32000 1024000000 500 32000",
      "",
      "$ ipcrm -s 1",
      "$ ipcs -s",
      "------ Matrices semáforo ------",
      "clave  semid  propietario  perms  nsems",
      "(vacío)",
    ],
    terminalTitle: "Terminal — bash · ipc_diagnostico.sh",
    conclusion:
      "Los objetos IPC System V son recursos del kernel que sobreviven a los procesos que los crean. En entornos de desarrollo es común encontrar objetos huérfanos de ejecuciones anteriores que fallaron sin limpiar. ipcs e ipcrm son herramientas esenciales para diagnosticar y limpiar estos recursos. El directorio /proc/sysvipc proporciona la misma información directamente desde el kernel, útil para scripts de monitoreo.",
    improvements:
      "Escribiría un script de limpieza automática que liste todos los objetos IPC del usuario actual y los elimine con ipcrm en un solo comando. También exploraría los límites del sistema con ipcs -l y los ajustaría en /proc/sys/kernel para simular restricciones de recursos en entornos embebidos.",
  },
];

export function IPC() {
  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
            <Network className="size-5 text-emerald-500" />
          </div>
          <div>
            <p
              className="text-xs font-medium text-muted-foreground uppercase tracking-widest"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Tema 3 · 6 Prácticas
            </p>
            <h1
              className="text-foreground"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.75rem", fontWeight: 700 }}
            >
              Mecanismos IPC
            </h1>
          </div>
        </div>
        <p
          className="text-muted-foreground leading-relaxed max-w-2xl"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Esta sección explora los mecanismos de comunicación entre procesos (IPC) en GNU/Linux. Se estudian las tuberías sin nombre (pipe) y con nombre (fifo), los mecanismos derivados de System V —semáforos, memoria compartida y colas de mensajes— y las herramientas del sistema para inspeccionar y gestionar estos recursos.
        </p>
        <div className="flex flex-wrap gap-2">
          {["pipe()", "mkfifo()", "ftok()", "semget()", "semop()", "shmget()", "shmat()", "msgget()", "msgsnd()", "msgrcv()", "ipcs", "/proc/sysvipc"].map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
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
