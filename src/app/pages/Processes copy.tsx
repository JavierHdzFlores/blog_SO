import { Cpu } from "lucide-react";
import { PracticeCard } from "../components/PracticeCard";

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
    theory: `Todos los sistemas de multiprogramación están construidos en torno al concepto de proceso. En un instante determinado un proceso puede encontrarse ejecutándose en el procesador o fuera de él, a la espera de ser ejecutado.

Para administrar los procesos, el sistema operativo debe identificar a cada uno y mantener información asociada: estado actual, ubicación en memoria y datos de control.

Modelo de cinco estados:
• Nuevo. Proceso recién creado, aún no admitido en el conjunto de procesos ejecutables.
• Listo. Proceso preparado para ejecutar, espera asignación del procesador.
• Ejecución. Proceso siendo ejecutado actualmente por la CPU.
• Bloqueado. Proceso que no puede continuar hasta que ocurra un evento específico (p. ej. finalización de E/S).
• Terminado. Proceso retirado del conjunto de procesos ejecutables.

En sistemas UNIX el diagrama es más complejo. Un proceso puede estar:
• Ejecutándose en modo usuario (código de aplicación).
• Ejecutándose en modo kernel (atendiendo llamada al sistema o interrupción).
• Listo para ejecutarse pero sin procesador.
• Dormido en memoria (bloqueado, a la espera de un evento).
• En transición (proceso recién creado, no completamente preparado).
• Finalizando (ejecuta la llamada exit).
• Zombi (terminó, conserva entrada en tabla de procesos para que el padre recupere el código de salida).

En GNU/Linux el kernel representa a cada proceso con la estructura task_struct. El campo p->state puede tomar los valores principales:
• TASK_RUNNING       → ejecutándose o listo para ejecutarse.
• TASK_INTERRUPTIBLE → dormido, puede ser despertado por señal.
• TASK_UNINTERRUPTIBLE → dormido, no puede ser despertado por señales.
• TASK_STOPPED       → proceso detenido.
• TASK_TRACED        → proceso siendo rastreado (p. ej. por depurador).

Al finalizar, el kernel asigna:
• EXIT_ZOMBIE → terminó, padre no ha recogido su estado de salida.
• EXIT_DEAD   → completamente eliminado del sistema.`,
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
    theory: `En GNU/Linux la creación de procesos se realiza principalmente a través de la llamada al sistema fork(). Esta llamada permite que un proceso existente (proceso padre) cree un nuevo proceso (proceso hijo).

PROTOTIPO:
  #include <sys/types.h>
  #include <unistd.h>
  pid_t fork(void);

Tras la ejecución de fork(), el sistema operativo crea un nuevo descriptor de proceso y establece una relación de parentesco. Desde el punto de vista lógico, el hijo recibe una copia del espacio de direcciones del padre. Sin embargo, las implementaciones modernas usan copy-on-write (COW): las páginas de memoria no se duplican físicamente hasta que alguno de los procesos intenta modificarlas.

Valores de retorno de fork():
• En el proceso hijo:  devuelve 0.
• En el proceso padre: devuelve el PID del hijo (entero > 0).
• En caso de error:    devuelve -1, no se crea ningún proceso hijo.

El proceso hijo hereda del padre:
• Entorno de ejecución, privilegios y credenciales.
• Descriptores de archivos y dispositivos abiertos.
• Prioridad y atributos de planificación.

Lo que el hijo NO hereda:
• Recibe un PID distinto (nuevo).
• Sus tiempos de CPU se inicializan en cero.
• No hereda bloqueos mantenidos por el padre.
• Las alarmas del padre no se propagan al hijo.
• El hijo comienza sin señales pendientes.

Copy-on-write: ambos procesos comparten las páginas de memoria hasta que uno de ellos escribe, momento en que el kernel crea una copia física de esa página únicamente para el proceso que escribe. Esto hace que fork() sea eficiente incluso con espacios de direcciones grandes.`,
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
    theory: `Todo proceso en UNIX tiene un identificador único (PID) y mantiene referencia al proceso que lo creó (PPID).

PROTOTIPOS:
  #include <sys/types.h>
  #include <unistd.h>

  pid_t getpid(void);   → PID del proceso que la invoca
  pid_t getppid(void);  → PID del proceso padre
  pid_t getpgrp(void);  → PGID (Process Group ID) del proceso actual
  pid_t setpgrp(void);  → convierte al proceso en líder de su propio grupo

El tipo pid_t es un entero con signo. En arquitecturas de 64 bits, el máximo de PIDs es 4 194 303 (/proc/sys/kernel/pid_max).

Si el proceso padre termina antes que sus hijos, el kernel los reasigna automáticamente al proceso con PID 1 (init / systemd), que los adopta y recoge su estado de terminación.

Descriptores estándar heredados por fork():
• stdin  (descriptor 0) → teclado.
• stdout (descriptor 1) → pantalla.
• stderr (descriptor 2) → pantalla (canal de error).

Estructuras clásicas de procesos:
• Cadena: P0 → P1 → P2 → ... → Pn. Cada proceso crea exactamente un hijo; el padre deja de crear más procesos (break tras fork()).
• Abanico: un único padre crea N hijos con un bucle; cada hijo ejecuta break y no genera más procesos.`,
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
    theory: `Tras fork(), padre e hijo se ejecutan concurrentemente. El padre puede terminar antes que el hijo, o viceversa.

Si el proceso padre desea esperar a que uno de sus hijos termine, invoca wait() o waitpid(). Estas llamadas permiten al sistema operativo notificar al padre la finalización de sus hijos y recuperar su estado de terminación, evitando procesos zombi.

PROTOTIPOS:
  #include <sys/types.h>
  #include <sys/wait.h>

  pid_t wait(int *stat_loc);
  pid_t waitpid(pid_t pid, int *wstatus, int options);

wait() suspende el proceso que la invoca hasta que:
  • Uno de sus hijos termina su ejecución.
  • Un proceso hijo se detiene.
  • El proceso que invoca wait() recibe una señal.

Retorna inmediatamente si el proceso no tiene hijos.

Macros de análisis de estado (<sys/wait.h>):
• WIFEXITED(*stat_loc)   → verdadero si el hijo terminó de forma normal.
• WEXITSTATUS(*stat_loc) → obtiene los 8 bits del valor pasado a exit() / _exit().
• WIFSIGNALED(*stat_loc) → verdadero si el hijo terminó por señal no capturada.
• WTERMSIG(*stat_loc)    → número de la señal que terminó al hijo.

Parámetro pid de waitpid():
  pid = -1 → espera cualquier proceso hijo.
  pid > 0  → espera al hijo cuyo PID sea exactamente ese valor.
  pid = 0  → espera cualquier hijo del mismo grupo de procesos.
  pid < 0  → espera cualquier hijo cuyo PGID sea igual al valor absoluto de pid.

Opciones (options) de waitpid():
• WEXITED    → espera hijos que hayan terminado.
• WSTOPPED   → espera hijos detenidos por señal.
• WNOHANG    → retorna inmediatamente si ningún hijo ha terminado.
• WNOWAIT    → no elimina al hijo de la tabla de procesos.
• WUNTRACED  → retorna si un hijo se detuvo (aunque no esté siendo trazado).
• WCONTINUED → retorna si un hijo reanudó ejecución tras SIGCONT.

El uso correcto de wait()/waitpid() es esencial para: sincronizar procesos, recuperar códigos de terminación, evitar zombis e implementar servidores concurrentes.`,
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
    theory: `Un proceso debe terminar de alguna manera. Lo deseable es una terminación normal, para la cual el proceso invoca _exit() o exit().

_exit() — llamada directa al sistema:
  PROTOTIPO:
    #include <unistd.h>
    void _exit(int status);

  • Termina el proceso inmediatamente.
  • El argumento status define el estado de terminación disponible para el padre cuando invoca wait().
  • Solo los 8 bits menos significativos de status están disponibles para el padre.
  • Por convención: status = 0 indica éxito, distinto de 0 indica error.

exit() — función de biblioteca estándar:
  PROTOTIPO:
    #include <stdlib.h>
    void exit(int status);

  exit() realiza varias acciones antes de llamar a _exit():
    1. Vacía y cierra los buffers de E/S (fflush).
    2. Ejecuta las funciones registradas con atexit() en orden inverso.
    3. Libera recursos de la biblioteca estándar.
    4. Llama a _exit(status) internamente.

  Flujo tras exit():
    • El proceso pasa a un estado transitorio llamado zombi.
    • El kernel envía la señal SIGCHLD al proceso padre.
    • El padre debe invocar wait() / waitpid() para eliminar la entrada zombi.
    • Si el padre ya terminó, el proceso es adoptado por init/systemd (PID 1), que ejecuta wait() automáticamente.

Desde GNU/Linux, se puede consultar el código de retorno del último proceso:
  echo $?`,
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
    theory: `Un proceso zombi es un proceso que ya terminó su ejecución pero cuyo proceso padre no ha recogido su estado de salida mediante wait() o waitpid().

El proceso zombi:
• NO consume CPU ni memoria de usuario.
• SÍ ocupa una entrada en la tabla de procesos del kernel.
• Conserva: PID, código de salida e información estadística mínima.
• Aparece en ps con la letra Z en la columna de estado.
• Desaparece únicamente cuando el padre ejecuta wait() / waitpid().

Cómo se produce:
  1. El proceso padre crea un hijo con fork().
  2. El hijo finaliza con exit() o _exit().
  3. El kernel marca al hijo como EXIT_ZOMBIE y conserva su entrada.
  4. Si el padre NO ejecuta wait(), el hijo queda zombi indefinidamente.

Cómo observar un zombi (desde otra terminal):
  ps -el | grep Z

Cómo evitarlo:
  • Llamar a wait() o waitpid() en el proceso padre.
  • Manejar la señal SIGCHLD con sigaction() para recoger hijos asincrónicamente.

Si el padre termina antes que el hijo (proceso huérfano):
  • El hijo se vuelve huérfano y es adoptado por init/systemd (PID 1).
  • PID 1 ejecuta wait() automáticamente → no queda zombi.`,
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
    theory: `Los hilos (threads) representan un mecanismo de ejecución concurrente dentro de un mismo proceso y constituyen una alternativa más ligera que la creación de procesos independientes.

Diferencia hilo vs proceso:
• Los procesos NO comparten la misma memoria entre sí.
• Los hilos SÍ comparten totalmente el espacio de direcciones del proceso.

Lo que comparten hilos del mismo proceso:
• Espacio de direcciones (heap y variables globales).
• Archivos abiertos y otros recursos.
• Código del programa.

Lo que cada hilo tiene de forma privada:
• Su propio stack (variables locales).
• Su propio contador de programa (PC).
• Sus propios registros del CPU.

En GNU/Linux se utiliza la librería pthreads (POSIX Threads), estándar IEEE POSIX 1003.1-2008.
Compilación: gcc archivo.c -lpthread -o ejecutable

PROTOTIPO pthread_create():
  #include <pthread.h>
  int pthread_create(pthread_t *thread, const pthread_attr_t *attr,
                     void *(*start_routine)(void *), void *arg);

  • thread       → puntero donde se almacena el ID del hilo creado.
  • attr         → atributos del hilo (NULL = valores por defecto).
  • start_routine → función que ejecutará el hilo (void *f(void *)).
  • arg          → argumento pasado a la función.

  Retorna 0 en caso de éxito, o código de error (EAGAIN, EINVAL, EPERM).

Otras funciones fundamentales:
  pthread_t pthread_self(void)              → ID del hilo actual.
  void pthread_exit(void *value_ptr)        → termina el hilo actual.
  int  pthread_join(pthread_t t, void **vp) → espera terminación de hilo t.
  int  pthread_attr_init(pthread_attr_t *)  → inicializa atributos.
  int  pthread_attr_destroy(pthread_attr_t *)→ destruye atributos.

Un hilo termina cuando:
  • Llama a pthread_exit().
  • Retorna de su función start_routine (equivalente a pthread_exit()).
  • Es cancelado con pthread_cancel().
  • El hilo principal retorna de main() (termina todo el proceso).`,
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
