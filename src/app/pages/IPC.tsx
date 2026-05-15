import { Network } from "lucide-react";
import { PracticeCard } from "../components/PracticeCard";

const practices = [
  // ─────────────────────────────────────────────────────────────────
  // 3.1 Comunicación mediante tuberías
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-3-1",
    number: 1,
    title: "3.1 Comunicación mediante tuberías",
    difficulty: "Básico" as const,
    tags: ["IPC", "tuberías", "pipe", "fifo", "comunicación", "procesos"],
    objective:
      "Comprender los mecanismos básicos de comunicación entre procesos mediante tuberías (pipes y FIFOs), sus características, limitaciones y diferencias fundamentales.",
    theory: `Todos los procesos, parientes o no, necesitan en ocasiones comunicarse entre sí. El sistema brinda formas básicas de comunicación:
• Stream: pipe, fifo y sockets.
• Mensajes: colas de mensajes y sockets datagramas.

Si los procesos son parientes, la comunicación puede realizarse mediante una tubería (pipe). Si se necesita proteger el medio de comunicación se pueden utilizar mecanismos de sincronización.

Las tuberías son mecanismos clásicos de comunicación entre dos o más procesos emparentados en la misma máquina. La teoría está basada en las facilidades IPC de los sistemas UNIX System V y derivados.

Clasificación:
• Tuberías sin nombre (pipe): comunicación entre procesos con ancestro común.
• Tuberías con nombre (FIFO): comunicación entre procesos no emparentados, con nombre en el sistema de archivos.

La teoría de IPC de System V también agrupa tres mecanismos adicionales con características en común:
• Una tabla con entradas que describen el uso del mecanismo.
• Una llave numérica elegida por el usuario para cada entrada de la tabla.
• Cada mecanismo dispone de una llamada "get" para crear o recuperar entradas.
• Cada entrada tiene un registro de permisos: ID de usuario y grupo del proceso creador.
• Una llamada de "control" permite leer, modificar el estado o liberar la entrada.`,
    code: `/* Resumen de los mecanismos IPC disponibles en UNIX/Linux

   ┌─────────────────────┬─────────────────┬─────────────────────┐
   │ Mecanismo IPC       │ Tipo de nombre  │ Identificación      │
   ├─────────────────────┼─────────────────┼─────────────────────┤
   │ pipe                │ Sin nombre      │ Descriptor archivo  │
   │ FIFO                │ Nombre de ruta  │ Descriptor archivo  │
   │ Cola de mensajes    │ Llave key_t     │ Identificador int   │
   │ Memoria compartida  │ Llave key_t     │ Identificador int   │
   │ Semáforo            │ Llave key_t     │ Identificador int   │
   │ Socket UNIX         │ Nombre de ruta  │ Descriptor archivo  │
   └─────────────────────┴─────────────────┴─────────────────────┘

   Resumen de llamadas IPC derivadas de System V:
   ┌───────────────────────┬──────────────┬───────────────┬───────────────┐
   │ Operación             │ Semáforos    │ Memoria comp. │ Cola mensajes │
   ├───────────────────────┼──────────────┼───────────────┼───────────────┤
   │ Crear / abrir         │ semget       │ shmget        │ msgget        │
   │ Operaciones control   │ semctl       │ shmctl        │ msgctl        │
   │ Operaciones uso       │ semop        │ shmat, shmdt  │ msgsnd,msgrcv │
   │ Bibliotecas           │ <sys/sem.h>  │ <sys/shm.h>   │ <sys/msg.h>   │
   └───────────────────────┴──────────────┴───────────────┴───────────────┘

   Bibliotecas comunes a todos: <sys/types.h>, <sys/ipc.h>
*/

#include <stdio.h>
int main(void) {
    printf("Mecanismos IPC en GNU/Linux:\\n");
    printf("  1. Tuberías sin nombre (pipe)\\n");
    printf("  2. Tuberías con nombre (FIFO)\\n");
    printf("  3. Semáforos System V\\n");
    printf("  4. Semáforos POSIX\\n");
    printf("  5. Memoria compartida\\n");
    printf("  6. Cola de mensajes\\n");
    return 0;
}`,
    language: "c",
    filename: "ipc_intro.c",
    terminalLines: [
      "$ ./ipc_intro",
      "Mecanismos IPC en GNU/Linux:",
      "  1. Tuberías sin nombre (pipe)",
      "  2. Tuberías con nombre (FIFO)",
      "  3. Semáforos System V",
      "  4. Semáforos POSIX",
      "  5. Memoria compartida",
      "  6. Cola de mensajes",
    ],
    terminalTitle: "Terminal — bash · ipc_intro",
    conclusion:
      "Los mecanismos IPC se dividen en dos categorías principales: los basados en descriptores de archivo (pipe, FIFO, sockets) y los basados en llaves numéricas de System V (semáforos, memoria compartida, colas de mensajes). La elección del mecanismo depende de si los procesos son parientes, si se necesita persistencia y del tipo de datos a intercambiar.",
    improvements:
      "Estudiar los sockets de dominio UNIX como mecanismo IPC bidireccional más potente que el pipe. Analizar la diferencia de rendimiento entre memoria compartida y colas de mensajes para transferencia de grandes volúmenes de datos.",
  },

  // ─────────────────────────────────────────────────────────────────
  // 3.1.1 Tuberías sin nombre — pipe
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-3-1-1",
    number: 2,
    title: "3.1.1 Tuberías sin nombre — pipe()",
    difficulty: "Básico" as const,
    tags: ["pipe", "pipe2", "tubería", "IPC", "fork", "half-duplex"],
    objective:
      "Crear y utilizar tuberías sin nombre (pipe) para comunicar procesos padre e hijo, comprendiendo el flujo unidireccional de datos y la herencia de descriptores tras fork().",
    theory: `Las tuberías sin nombre (pipe) son las formas más antiguas de IPC y están disponibles en todos los sistemas UNIX y derivados.

Limitaciones de pipe:
  1. Los datos fluyen en una sola dirección (half-duplex).
  2. Solo pueden usarse entre procesos que tienen un ancestro en común.

PROTOTIPO pipe():
  #include <unistd.h>
  int pipe(int filedes[2]);

  • filedes[0] → extremo de lectura (read end).
  • filedes[1] → extremo de escritura (write end).
  • Retorna 0 en éxito, -1 en error.
  • La salida de filedes[1] es la entrada de filedes[0].

PROTOTIPO pipe2() (GNU/Linux ≥ 2.6.27, glibc ≥ 2.9):
  #include <unistd.h>
  int pipe2(int filedes[2], int flags);

  Banderas disponibles mediante OR bit a bit:
  • O_CLOEXEC   → establece FD_CLOEXEC en los dos descriptores.
  • O_DIRECT    → E/S en modo "paquete" (independiente por cada write).
  • O_NONBLOCK  → establece modo no bloqueante en los descriptores.

Flujo de comunicación con fork():
  1. El padre llama a pipe() → obtiene filedes[0] y filedes[1].
  2. El padre llama a fork() → el hijo hereda ambos descriptores.
  3. Para comunicación padre → hijo: padre cierra [0], hijo cierra [1].
  4. Para comunicación hijo → padre: hijo cierra [0], padre cierra [1].

Siempre cerrar el extremo no utilizado en cada proceso para que las operaciones de lectura detecten correctamente el EOF.`,
    code: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
#include <sys/wait.h>

#define MAXLINEA 80

int main(void) {
    int  n, fd[2];
    pid_t hijo;
    char linea[MAXLINEA];
    int estado;

    /* Crear la tubería ANTES de fork */
    if (pipe(fd) < 0) {
        fprintf(stderr, "error de tubería\\n");
        exit(1);
    }

    if ((hijo = fork()) == 0) {
        /* ── HIJO: escribe en la tubería ── */
        close(fd[0]);                          /* cerrar extremo de lectura */
        write(fd[1], "hola mundo \\n", 12);
        close(fd[1]);
        exit(EXIT_SUCCESS);

    } else {
        /* ── PADRE: lee de la tubería ── */
        close(fd[1]);                          /* cerrar extremo de escritura */
        n = read(fd[0], linea, MAXLINEA);
        write(STDOUT_FILENO, linea, n);
        printf("Bytes recibidos: %d\\n", n);
        wait(&estado);
    }

    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "pipe_demo.c",
    terminalLines: [
      "$ gcc pipe_demo.c -o pipe_demo",
      "$ ./pipe_demo",
      "hola mundo ",
      "Bytes recibidos: 12",
    ],
    terminalTitle: "Terminal — bash · pipe_demo",
    conclusion:
      "La tubería sin nombre es la forma más sencilla de IPC entre procesos emparentados. La clave está en cerrar el extremo no utilizado en cada proceso: si el extremo de escritura no se cierra en el lector, la llamada a read() nunca retorna EOF. La herencia de descriptores tras fork() es el mecanismo que permite compartir la tubería entre padre e hijo.",
    improvements:
      "Implementar comunicación bidireccional usando dos tuberías (una para cada dirección). Explorar pipe2() con O_NONBLOCK para lecturas no bloqueantes. Conectar la salida de un proceso con la entrada de otro (patrón de la shell: cmd1 | cmd2) usando dup2() para redirigir stdout/stdin a los extremos de la tubería.",
  },

  // ─────────────────────────────────────────────────────────────────
  // 3.1.2 Tuberías con nombre — FIFO
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-3-1-2",
    number: 3,
    title: "3.1.2 Tuberías con nombre — FIFO (mkfifo)",
    difficulty: "Básico" as const,
    tags: ["fifo", "mkfifo", "named pipe", "IPC", "sistema de archivos"],
    objective:
      "Crear y utilizar tuberías con nombre (FIFO) mediante mkfifo() para comunicar procesos que no comparten ancestro, comprendiendo la apertura bloqueante y el ciclo de vida del archivo especial.",
    theory: `Las tuberías con nombre (FIFO) permiten comunicar procesos sin necesidad de compartir un ancestro común. A diferencia de pipe, un FIFO tiene un nombre y una ruta en el sistema de archivos.

PROTOTIPO mkfifo():
  #include <sys/types.h>
  #include <sys/stat.h>
  int mkfifo(const char *pathname, mode_t mode);

  • pathname → nombre y ruta donde se creará el archivo especial FIFO.
  • mode     → permisos del archivo (igual que en open/creat, se aplica umask).
  • Retorna 0 en éxito, -1 en error (errno indica el tipo de error).

Comportamiento de apertura:
  • Un FIFO debe estar abierto en ambos extremos (lectura Y escritura) simultáneamente antes de realizar E/S.
  • Abrir un FIFO para lectura BLOQUEA hasta que otro proceso lo abra para escritura, y viceversa.
  • Una vez abierto, se opera igual que un archivo ordinario con read() y write().

Diferencia con pipe:
  • pipe: solo entre procesos emparentados, sin nombre en el sistema de archivos.
  • FIFO: entre cualquier par de procesos, tiene nombre en el sistema de archivos.

Gestión del archivo FIFO:
  • Se crea con mkfifo() o con el comando: mkfifo nombre_fifo
  • Se elimina con unlink() o rm.
  • Persiste en el sistema de archivos hasta que se elimina explícitamente.

Función umask():
  • umask(~0666) establece la máscara de permisos para que el FIFO tenga permisos 0666.`,
    code: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

#define NOMBRE_FIFO "mi_tuberia"

int main(void) {
    pid_t hijo;
    int   file;
    char  mensaje[20];

    /* Eliminar el FIFO si ya existía de una ejecución anterior */
    unlink(NOMBRE_FIFO);

    /* Ajustar máscara de permisos y crear el archivo FIFO */
    umask(~0666);
    if (mkfifo(NOMBRE_FIFO, 0666) == -1) {
        perror("error en mkfifo");
        exit(-1);
    }

    if ((hijo = fork()) == 0) {
        /* ── HIJO: abre el FIFO para escritura y envía mensaje ── */
        fprintf(stdout, "[HIJO] PID=%ld — abriendo FIFO para escritura...\\n",
                (long)getpid());

        if ((file = open(NOMBRE_FIFO, O_WRONLY)) == -1) {
            perror("error en open O_WRONLY");
            exit(-1);
        }

        write(file, "soy el hijo,ID...\\n", 20);
        close(file);
        fprintf(stdout, "[HIJO] Mensaje enviado. Terminando.\\n");
        exit(0);

    } else if (hijo > 0) {
        /* ── PADRE: abre el FIFO para lectura y recibe mensaje ── */
        fprintf(stdout, "[PADRE] PID=%ld — abriendo FIFO para lectura...\\n",
                (long)getpid());

        if ((file = open(NOMBRE_FIFO, O_RDONLY)) == -1) {
            perror("error en open O_RDONLY");
            exit(-1);
        }

        read(file, mensaje, 20);
        fprintf(stdout, "[PADRE] Mensaje recibido: %s\\n", mensaje);
        close(file);

        /* Eliminar el FIFO del sistema de archivos */
        unlink(NOMBRE_FIFO);
    }

    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "fifo_demo.c",
    terminalLines: [
      "$ gcc fifo_demo.c -o fifo_demo",
      "$ ./fifo_demo",
      "[PADRE] PID=10000 — abriendo FIFO para lectura...",
      "[HIJO]  PID=10001 — abriendo FIFO para escritura...",
      "[HIJO]  Mensaje enviado. Terminando.",
      "[PADRE] Mensaje recibido: soy el hijo,ID...",
      "",
      "# Verificar que el FIFO ya no existe",
      "$ ls -la mi_tuberia",
      "ls: cannot access 'mi_tuberia': No such file or directory",
    ],
    terminalTitle: "Terminal — bash · fifo_demo",
    conclusion:
      "Las tuberías con nombre extienden la funcionalidad de pipe al permitir la comunicación entre procesos sin parentesco. El comportamiento bloqueante durante la apertura garantiza sincronización automática: ambos extremos están listos antes de que comience la transferencia de datos. Es importante eliminar el archivo FIFO con unlink() cuando ya no se necesite, para no dejar archivos especiales huérfanos en el sistema de archivos.",
    improvements:
      "Implementar comunicación entre procesos completamente independientes (sin fork) usando dos terminales y el mismo archivo FIFO. Usar mkfifo desde la línea de comandos y probar con echo y cat. Implementar un servidor que escuche en un FIFO y varios clientes que envíen mensajes.",
  },

  // ─────────────────────────────────────────────────────────────────
  // 3.2 Mecanismos IPC derivados de System V
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-3-2",
    number: 4,
    title: "3.2 Mecanismos IPC derivados de System V",
    difficulty: "Intermedio" as const,
    tags: ["System V", "IPC", "semáforos", "memoria compartida", "colas de mensajes"],
    objective:
      "Conocer los tres mecanismos IPC derivados de UNIX System V (semáforos, memoria compartida y colas de mensajes), sus características comunes y las estructuras de datos que el kernel mantiene para cada uno.",
    theory: `El paquete IPC de UNIX System V y derivados (GNU/Linux) se compone de tres mecanismos:
  1. Semáforos       → permiten sincronizar procesos.
  2. Memoria compartida → permite que los procesos compartan su espacio de direcciones virtuales.
  3. Colas de mensajes → posibilitan el intercambio de datos con un formato determinado.

Características comunes de todos los mecanismos IPC de System V:
  • Una tabla con entradas que describen el uso del mecanismo.
  • Una llave numérica (key_t) elegida por el usuario para cada entrada.
  • Cada mecanismo dispone de una llamada "get" para crear una entrada nueva o recuperar una existente.
  • Cada entrada tiene un registro de permisos: ID de usuario y grupo del creador.
  • Cada entrada contiene información de estado: ID del último proceso que la utilizó.
  • Una llamada de "control" permite leer/modificar el estado o liberar la entrada.

Tabla de llamadas IPC de System V:
  ┌─────────────────────────┬──────────────┬───────────────┬───────────────┐
  │ Operación               │ Semáforos    │ Mem. Comp.    │ Cola mensajes │
  ├─────────────────────────┼──────────────┼───────────────┼───────────────┤
  │ Biblioteca específica   │ <sys/sem.h>  │ <sys/shm.h>   │ <sys/msg.h>   │
  │ Crear / abrir           │ semget()     │ shmget()      │ msgget()      │
  │ Operaciones de control  │ semctl()     │ shmctl()      │ msgctl()      │
  │ Operaciones de uso      │ semop()      │ shmat(),shmdt │ msgsnd(),msgrcv│
  └─────────────────────────┴──────────────┴───────────────┴───────────────┘
  Bibliotecas comunes: <sys/types.h>, <sys/ipc.h>

Permiso de acceso (modo):
  Se especifica con un número octal: 00X00 = usuario, 000X0 = grupo, 0000X = otros.
  Combinado con IPC_CREAT e IPC_EXCL en el parámetro "flag" de cada llamada "get".`,
    code: `/* Ejemplo de consulta y estructura interna de objetos IPC System V */

/* Para ver los objetos IPC activos en el sistema: */
// ipcs

/* Para ver solo semáforos: */
// ipcs -s

/* Para ver solo memoria compartida: */
// ipcs -m

/* Para ver solo colas de mensajes: */
// ipcs -q

/* Para eliminar un objeto IPC (por ejemplo un semáforo con semid=1): */
// ipcrm -s 1

/* Ejemplo de salida de ipcs: */
/*
------ Colas de mensajes ----
key        msqid    propietario perms   bytes utilizados mensajes

---- Segmentos memoria compartida ---
key        shmid    propietario perms   bytes   nattch  estado
0x00000000 884743   gcgero      600     1048576 2       dest
0x00000000 819208   gcgero      600     524288  2       dest

------ Matrices semáforo ------
key        semid    propietario perms   nsems
0x6100050e 1        gcgero      600     2
0x61000c49 2        gcgero      600     2
*/

/* Archivos del directorio /proc/sysvipc: */
// ls /proc/sysvipc        → msg  sem  shm
// cat /proc/sysvipc/sem   → información de semáforos activos
// cat /proc/sysvipc/shm   → información de memoria compartida
// cat /proc/sysvipc/msg   → información de colas de mensajes

/* Límites del sistema (en /proc/sys/kernel/): */
// cat /proc/sys/kernel/sem     → límites de semáforos
// cat /proc/sys/kernel/shmmax  → tamaño máximo de segmento de memoria compartida
// cat /proc/sys/kernel/msgmax  → tamaño máximo de mensaje`,
    language: "c",
    filename: "ipc_systemv_intro.c",
    terminalLines: [
      "$ ipcs",
      "------ Colas de mensajes ----",
      "key        msqid    propietario perms   bytes mensajes",
      "",
      "---- Segmentos memoria compartida ---",
      "key        shmid    propietario perms   bytes   nattch estado",
      "0x00000000 884743   gcgero      600     1048576 2      dest",
      "",
      "------ Matrices semáforo ------",
      "key        semid    propietario perms   nsems",
      "0x6100050e 1        gcgero      600     2",
      "",
      "$ ls /proc/sysvipc",
      "msg  sem  shm",
      "",
      "$ cat /proc/sys/kernel/shmmax",
      "18446744073692774399",
    ],
    terminalTitle: "Terminal — bash · ipc_systemv",
    conclusion:
      "Los mecanismos IPC de System V comparten una arquitectura común basada en llaves numéricas y tablas internas del kernel. Esta uniformidad facilita el aprendizaje de los tres mecanismos, ya que el patrón es siempre el mismo: generar llave con ftok(), crear/obtener el objeto con la función 'get', usarlo con las funciones de operación y eliminarlo con la función 'control' usando IPC_RMID.",
    improvements:
      "Usar ipcs y ipcrm para gestionar objetos IPC desde la línea de comandos. Explorar /proc/sysvipc para leer el estado interno de los objetos IPC. Comparar los mecanismos IPC de System V con sus equivalentes POSIX (sem_open, shm_open, mq_open).",
  },

  // ─────────────────────────────────────────────────────────────────
  // 3.2.1 Llaves
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-3-2-1",
    number: 5,
    title: "3.2.1 Llaves — ftok()",
    difficulty: "Básico" as const,
    tags: ["ftok", "key_t", "IPC_PRIVATE", "llave", "semget", "shmget", "msgget"],
    objective:
      "Comprender el rol de las llaves (key_t) en los mecanismos IPC de System V y usar la función ftok() para generar llaves únicas de forma reproducible a partir de un archivo y un identificador de proyecto.",
    theory: `Todas las formas de IPC de System V (excepto las tuberías sin nombre) tienen asociado un espacio de nombres para llevar a cabo el intercambio de mensajes.

Una llave es una variable del tipo key_t (entero de 32 bits) que se usa para acceder a los mecanismos IPC previamente reservados o nuevos. Los mecanismos que forman parte de un mismo proyecto comparten la misma llave.

PROTOTIPO ftok():
  #include <sys/types.h>
  #include <sys/ipc.h>
  key_t ftok(const char *pathname, int proj_id);

  • pathname → ruta de un archivo ordinario existente y accesible.
  • proj_id  → identificador del proyecto (8 bits menos significativos se usan).
  • Retorna la llave generada, o -1 en caso de error.

Implementación interna de ftok():
  La llave se construye combinando:
    • Los 8 bits menos significativos de proj_id.
    • El número de i-nodo del archivo pathname.
    • El número menor del dispositivo del sistema de archivos donde reside el archivo.
  El resultado es una llave única de 32 bits.

Uso de la llave generada:
  key_t llave = ftok("/ruta/archivo", 'a');
  int semid = semget(llave, nsems, IPC_CREAT | 0600);
  int shmid = shmget(llave, size, IPC_CREAT | 0600);
  int msgid = msgget(llave, IPC_CREAT | 0600);

Valor especial IPC_PRIVATE:
  Si se usa IPC_PRIVATE como llave, siempre se crea un nuevo objeto IPC privado (no compartible por nombre con otros procesos).`,
    code: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>

int main(int argc, char *argv[]) {
    key_t llave;
    int   semid;

    /* Generar llave usando el ejecutable actual como pathname */
    llave = ftok(argv[0], 'a');
    if (llave == -1) {
        perror("ftok");
        exit(-1);
    }

    printf("Llave generada: 0x%x (%d)\\n", (unsigned)llave, llave);
    printf("Archivo usado : %s\\n", argv[0]);
    printf("proj_id usado : 'a' = %d\\n", (int)'a');

    /* Usar la llave para crear un semáforo */
    semid = semget(llave, 1, IPC_CREAT | IPC_EXCL | 0600);
    if (semid == -1) {
        perror("semget (puede que ya exista; usa ipcrm para eliminarlo)");
        /* Intentar acceder al semáforo existente */
        semid = semget(llave, 1, 0);
        if (semid == -1) { perror("semget"); exit(-1); }
    }

    printf("\\nSemáforo creado/accedido con semid=%d\\n", semid);
    printf("Verifícalo con: ipcs -s\\n");

    /* Eliminar el semáforo al finalizar */
    semctl(semid, 0, IPC_RMID, 0);
    printf("Semáforo eliminado con IPC_RMID.\\n");

    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "ftok_demo.c",
    terminalLines: [
      "$ gcc ftok_demo.c -o ftok_demo",
      "$ ./ftok_demo",
      "Llave generada: 0x6100050e (1627391246)",
      "Archivo usado : ./ftok_demo",
      "proj_id usado : 'a' = 97",
      "",
      "Semáforo creado/accedido con semid=1",
      "Verifícalo con: ipcs -s",
      "",
      "$ ipcs -s",
      "------ Matrices semáforo ------",
      "key        semid    propietario perms   nsems",
      "0x6100050e 1        gcgero      600     1",
      "",
      "Semáforo eliminado con IPC_RMID.",
    ],
    terminalTitle: "Terminal — bash · ftok_demo",
    conclusion:
      "ftok() es la función estándar para generar llaves reproducibles: el mismo pathname y proj_id siempre producen la misma llave en el mismo sistema de archivos, lo que permite que procesos independientes accedan al mismo objeto IPC sin comunicación previa. Es importante que el archivo pathname exista y sea accesible, y que todos los procesos participantes usen los mismos parámetros.",
    improvements:
      "Experimentar con distintos valores de proj_id para el mismo archivo y observar cómo cambia la llave. Probar qué ocurre si el archivo es eliminado y re-creado (el i-nodo cambia, por lo que ftok() genera una llave diferente). Comparar con IPC_PRIVATE para entender cuándo usar cada opción.",
  },

  // ─────────────────────────────────────────────────────────────────
  // 3.2.2 Semáforos en derivados de System V
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-3-2-2",
    number: 6,
    title: "3.2.2 Semáforos en derivados de System V",
    difficulty: "Avanzado" as const,
    tags: ["semget", "semop", "semctl", "semáforos", "System V", "sincronización", "IPC"],
    objective:
      "Implementar sincronización de procesos mediante semáforos de System V usando semget(), semop() y semctl(), comprendiendo las operaciones atómicas de incremento, decremento y espera de nulidad.",
    theory: `Los semáforos son mecanismos de sincronización de acceso a recursos compartidos. En System V, la implementación garantiza que las operaciones sean atómicas mediante su implementación en el kernel.

Características de los semáforos System V:
  • Un semáforo no es un valor simple, sino un CONJUNTO de valores enteros no negativos.
  • Cada valor del conjunto puede asumir cualquier valor no negativo (no solo 0 o 1).

semget() — crear o acceder a un conjunto de semáforos:
  PROTOTIPO:
    #include <sys/types.h>
    #include <sys/ipc.h>
    #include <sys/sem.h>
    int semget(key_t key, int nsems, int semflg);

  • key    → llave (resultado de ftok() o IPC_PRIVATE).
  • nsems  → número de semáforos en el conjunto.
  • semflg → IPC_CREAT | IPC_EXCL | modo_octal.
  • Retorna el identificador del conjunto, o -1 en error.

semop() — operaciones atómicas sobre semáforos:
  PROTOTIPO:
    int semop(int semid, struct sembuf *sops, size_t nsops);

  struct sembuf {
    unsigned short sem_num; /* número de semáforo en el conjunto (0..n-1) */
    short          sem_op;  /* operación: negativo=decremento, positivo=incremento, 0=espera nulidad */
    short          sem_flg; /* IPC_NOWAIT, SEM_UNDO */
  };

  sem_op < 0 → decrementa (bloquea si semval < |sem_op|).
  sem_op > 0 → incrementa (despierta procesos en espera).
  sem_op = 0 → espera hasta que semval sea 0.

semctl() — administrar semáforos:
  PROTOTIPO:
    int semctl(int semid, int semnum, int cmd, union semun arg);

  Comandos principales (cmd):
  • IPC_STAT → obtener información del conjunto.
  • IPC_SET  → modificar permisos/propietario.
  • IPC_RMID → eliminar el conjunto de semáforos.
  • SETVAL   → inicializar un semáforo a un valor.
  • GETVAL   → leer el valor de un semáforo.
  • SETALL   → inicializar todos los semáforos del conjunto.
  • GETALL   → leer todos los valores del conjunto.`,
    code: `#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>
#include <unistd.h>
#include <errno.h>

#define SEM_HIJO  0
#define SEM_PADRE 1

int main(int argc, char *argv[]) {
    int            semid;
    pid_t          pid;
    struct sembuf  operacion;
    key_t          llave;
    int            i = 5;  /* iteraciones de demostración */

    /* Generar llave y crear conjunto de 2 semáforos */
    llave = ftok(argv[0], 'a');
    if ((semid = semget(llave, 2, IPC_CREAT | 0600)) == -1) {
        perror("semget"); exit(-1);
    }

    /* Inicializar semáforos:
       SEM_HIJO  = 0 (bloqueado  → el hijo espera)
       SEM_PADRE = 1 (desbloqueado → el padre puede continuar) */
    semctl(semid, SEM_HIJO,  SETVAL, 0);
    semctl(semid, SEM_PADRE, SETVAL, 1);

    if ((pid = fork()) == -1) { perror("fork"); exit(-1); }

    if (pid == 0) {
        /* ── Proceso HIJO ── */
        while (i--) {
            /* Decrementar (cerrar) semáforo del hijo → espera su turno */
            operacion.sem_num = SEM_HIJO;
            operacion.sem_op  = -1;
            operacion.sem_flg = 0;
            semop(semid, &operacion, 1);

            printf("[HIJO]  turno %d\\n", 5 - i);

            /* Incrementar (abrir) semáforo del padre → cede el turno */
            operacion.sem_num = SEM_PADRE;
            operacion.sem_op  = 1;
            semop(semid, &operacion, 1);
        }
        semctl(semid, 0, IPC_RMID, 0);
        exit(EXIT_SUCCESS);

    } else {
        /* ── Proceso PADRE ── */
        while (i--) {
            /* Decrementar (cerrar) semáforo del padre → espera su turno */
            operacion.sem_num = SEM_PADRE;
            operacion.sem_op  = -1;
            operacion.sem_flg = 0;
            semop(semid, &operacion, 1);

            printf("[PADRE] turno %d\\n", 5 - i);

            /* Incrementar (abrir) semáforo del hijo → cede el turno */
            operacion.sem_num = SEM_HIJO;
            operacion.sem_op  = 1;
            semop(semid, &operacion, 1);
        }
        semctl(semid, 0, IPC_RMID, 0);
    }

    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "semaforos_sv.c",
    terminalLines: [
      "$ gcc semaforos_sv.c -o semaforos_sv",
      "$ ./semaforos_sv",
      "[PADRE] turno 1",
      "[HIJO]  turno 1",
      "[PADRE] turno 2",
      "[HIJO]  turno 2",
      "[PADRE] turno 3",
      "[HIJO]  turno 3",
      "[PADRE] turno 4",
      "[HIJO]  turno 4",
      "[PADRE] turno 5",
      "[HIJO]  turno 5",
    ],
    terminalTitle: "Terminal — bash · semaforos_sv",
    conclusion:
      "Los semáforos de System V son más complejos que los semáforos POSIX porque operan sobre conjuntos (arrays) de semáforos y requieren el uso de la estructura sembuf. La atomicidad de semop() garantiza que ningún otro proceso pueda modificar el semáforo entre el test y la operación, eliminando las condiciones de carrera. La inicialización correcta con semctl(SETVAL) es esencial antes de usar el semáforo.",
    improvements:
      "Experimentar con SEM_UNDO para que el kernel revierta automáticamente las operaciones si el proceso termina inesperadamente. Usar semctl(IPC_STAT) para inspeccionar el estado del conjunto. Implementar un mutex usando un semáforo con valor inicial 1 para proteger una sección crítica.",
  },

  // ─────────────────────────────────────────────────────────────────
  // 3.3 Memoria compartida
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-3-3",
    number: 7,
    title: "3.3 Memoria compartida — shmget, shmat, shmdt, shmctl",
    difficulty: "Avanzado" as const,
    tags: ["shmget", "shmat", "shmdt", "shmctl", "memoria compartida", "IPC", "System V"],
    objective:
      "Implementar comunicación entre procesos mediante memoria compartida de System V usando shmget(), shmat(), shmdt() y shmctl(), comprendiendo el ciclo completo de creación, adjunción, uso y eliminación.",
    theory: `La forma más rápida para comunicar dos procesos es hacer que compartan una zona de memoria. El segmento de memoria compartida existe en el espacio de direcciones del kernel y cada proceso que se une recibe un puntero a su copia local de la dirección virtual.

shmget() — crear o acceder a un segmento de memoria compartida:
  PROTOTIPO:
    #include <sys/ipc.h>
    #include <sys/shm.h>
    int shmget(key_t key, size_t size, int shmflg);

  • key    → llave (ftok() o IPC_PRIVATE).
  • size   → tamaño en bytes del segmento.
  • shmflg → IPC_CREAT | IPC_EXCL | modo_octal.
  • Retorna el identificador del segmento (shmid), o -1 en error.

shmat() / shmdt() — unirse y separarse del segmento:
  PROTOTIPO:
    char *shmat(int shmid, char *shmaddr, int shmflg);
    int   shmdt(char *shmaddr);

  • shmat() retorna la dirección inicial del segmento en el espacio del proceso.
  • Si shmaddr = 0, el kernel elige la dirección automáticamente (recomendado).
  • shmdt() desconecta el segmento del espacio de direcciones del proceso (no lo elimina).

shmctl() — administrar el segmento:
  PROTOTIPO:
    int shmctl(int shmid, int cmd, struct shmid_ds *buf);

  Comandos principales (cmd):
  • IPC_STAT → leer información del segmento en buf.
  • IPC_SET  → modificar permisos/propietario.
  • IPC_RMID → marcar el segmento para eliminación (se elimina cuando nattch = 0).
  • SHM_LOCK → bloquear el segmento en memoria física.
  • SHM_UNLOCK → desbloquear.

Ciclo de vida completo:
  1. shmget()  → crear el segmento y obtener shmid.
  2. shmat()   → adjuntar el segmento al espacio de direcciones.
  3. [uso]     → leer/escribir como si fuera memoria normal.
  4. shmdt()   → separar el segmento del espacio de direcciones.
  5. shmctl(IPC_RMID) → eliminar el segmento del sistema.`,
    code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <sys/wait.h>
#include <unistd.h>

#define TAM_SEG 1024   /* tamaño del segmento en bytes */

int main(void) {
    int   shmid;
    char *segmento;
    pid_t hijo;
    int   estado;

    /* 1. Crear el segmento de memoria compartida */
    if ((shmid = shmget(IPC_PRIVATE, TAM_SEG, IPC_CREAT | 0600)) == -1) {
        perror("shmget");
        exit(EXIT_FAILURE);
    }
    printf("[PADRE] Segmento creado: shmid=%d, tamaño=%d bytes\\n",
           shmid, TAM_SEG);

    /* 2. Adjuntar el segmento al espacio de direcciones del padre */
    segmento = (char *)shmat(shmid, 0, 0);
    if (segmento == (char *)-1) { perror("shmat"); exit(EXIT_FAILURE); }

    /* Inicializar el segmento */
    memset(segmento, 0, TAM_SEG);
    sprintf(segmento, "Mensaje del PADRE (PID=%ld)", (long)getpid());

    if ((hijo = fork()) == 0) {
        /* ── Proceso HIJO ── */
        /* El hijo hereda el descriptor shmid, se adjunta al mismo segmento */
        char *seg_hijo = (char *)shmat(shmid, 0, 0);
        if (seg_hijo == (char *)-1) { perror("shmat hijo"); exit(1); }

        printf("[HIJO]  Lee del padre: \"%s\"\\n", seg_hijo);

        /* El hijo escribe su propio mensaje */
        sprintf(seg_hijo, "Respuesta del HIJO (PID=%ld)", (long)getpid());

        shmdt(seg_hijo);  /* separarse del segmento */
        exit(EXIT_SUCCESS);

    } else {
        wait(&estado);   /* esperar al hijo */

        /* El padre lee el mensaje que dejó el hijo */
        printf("[PADRE] Lee del hijo: \"%s\"\\n", segmento);

        /* 4. Separarse del segmento */
        shmdt(segmento);

        /* 5. Eliminar el segmento del sistema */
        shmctl(shmid, IPC_RMID, 0);
        printf("[PADRE] Segmento eliminado del sistema.\\n");
    }

    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "shm_demo.c",
    terminalLines: [
      "$ gcc shm_demo.c -o shm_demo",
      "$ ./shm_demo",
      "[PADRE] Segmento creado: shmid=884743, tamaño=1024 bytes",
      "[HIJO]  Lee del padre: \"Mensaje del PADRE (PID=11000)\"",
      "[PADRE] Lee del hijo:  \"Respuesta del HIJO (PID=11001)\"",
      "[PADRE] Segmento eliminado del sistema.",
      "",
      "$ ipcs -m",
      "---- Segmentos memoria compartida ---",
      "key        shmid    propietario perms   bytes   nattch estado",
      "# (vacío: el segmento fue eliminado correctamente)",
    ],
    terminalTitle: "Terminal — bash · shm_demo",
    conclusion:
      "La memoria compartida es el mecanismo IPC más rápido porque evita la copia de datos: ambos procesos acceden directamente al mismo segmento físico de memoria. Sin embargo, al no proporcionar sincronización automática, se debe combinar con semáforos o mutexes para proteger el acceso concurrente. El uso de IPC_PRIVATE con shmget() es conveniente cuando el segmento solo será compartido entre procesos emparentados (vía fork).",
    improvements:
      "Combinar memoria compartida con semáforos de System V para implementar un buffer circular protegido. Usar shmctl(IPC_STAT) para inspeccionar el número de procesos adjuntados (nattch). Comparar con la alternativa POSIX: shm_open() + mmap() para memoria compartida con nombre.",
  },

  // ─────────────────────────────────────────────────────────────────
  // 3.4 Cola de mensajes
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-3-4",
    number: 8,
    title: "3.4 Cola de mensajes — msgget, msgsnd, msgrcv, msgctl",
    difficulty: "Avanzado" as const,
    tags: ["msgget", "msgsnd", "msgrcv", "msgctl", "cola de mensajes", "System V", "IPC"],
    objective:
      "Implementar comunicación entre procesos mediante colas de mensajes de System V, comprendiendo el ciclo de envío y recepción con msgsnd()/msgrcv() y la selección de mensajes por tipo.",
    theory: `Las colas de mensajes permiten el intercambio de datos estructurados entre procesos. Los mensajes tienen un tipo que permite la recepción selectiva.

msgget() — crear o acceder a una cola de mensajes:
  PROTOTIPO:
    #include <sys/types.h>
    #include <sys/ipc.h>
    #include <sys/msg.h>
    int msgget(key_t key, int msgflg);

  • Si key = IPC_PRIVATE → siempre crea una nueva cola.
  • Si se usa llave de ftok() → especificar IPC_CREAT en msgflg.
  • Retorna el identificador de la cola (msqid), o -1 en error.

Estructura del mensaje (msgbuf):
  struct msgbuf {
    long mtype;      /* Tipo del mensaje; debe ser > 0 */
    char mtext[N];   /* Datos del mensaje, de longitud N bytes */
  };

msgsnd() — enviar un mensaje:
  PROTOTIPO:
    int msgsnd(int msqid, const void *msgp, size_t msgsz, int msgflg);

  • msgsz  → tamaño del campo mtext (no incluye long mtype).
  • msgflg → IPC_NOWAIT (no bloquear si la cola está llena) o 0 (bloquear).

msgrcv() — recibir un mensaje:
  PROTOTIPO:
    ssize_t msgrcv(int msqid, void *msgp, size_t msgsz, long msgtyp, int msgflg);

  • msgtyp = 0   → leer el primer mensaje de la cola.
  • msgtyp > 0   → leer el primer mensaje de tipo msgtyp.
  • msgtyp < 0   → leer el primer mensaje con tipo ≤ |msgtyp|.
  • msgflg       → IPC_NOWAIT, MSG_NOERROR (truncar si es muy grande), MSG_EXCEPT.

msgctl() — administrar la cola:
  int msgctl(int msqid, int cmd, struct msqid_ds *buf);

  • IPC_STAT → leer la estructura de control en buf.
  • IPC_SET  → modificar permisos/tamaño máximo de la cola.
  • IPC_RMID → eliminar la cola (despierta procesos en espera con EIDRM).`,
    code: `/* ************************************************************
   Compilar: gcc -Wall mcola.c -o mcola
   Ejecutar para enviar:  ./mcola s
   Ejecutar para recibir: ./mcola r
   ************************************************************ */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>
#include <errno.h>
#include <sys/msg.h>

struct msgbuf {
    long mtype;
    char mtext[80];
};

void send_msg(int qid, int msgtype) {
    struct msgbuf msg;
    time_t t;

    msg.mtype = msgtype;
    time(&t);
    snprintf(msg.mtext, sizeof(msg.mtext),
             "Mensaje enviado el: %s", ctime(&t));

    if (msgsnd(qid, (void *)&msg, sizeof(msg.mtext), IPC_NOWAIT) == -1) {
        perror("ERROR en msgsnd");
        exit(EXIT_FAILURE);
    }
    printf("Mensaje enviado: %s\\n", msg.mtext);
}

void get_msg(int qid, int msgtype) {
    struct msgbuf msg;

    if (msgrcv(qid, (void *)&msg, sizeof(msg.mtext),
               msgtype, MSG_NOERROR | IPC_NOWAIT) == -1) {
        if (errno != ENOMSG) {
            perror("ERROR en msgrcv");
            exit(EXIT_FAILURE);
        }
        printf("No hay mensajes disponibles en la cola.\\n");
    } else {
        printf("Mensaje recibido: %s\\n", msg.mtext);
    }
}

int main(int argc, char *argv[]) {
    int   qid, modo, msgtype = 1;
    key_t llave;

    if (argc < 2 || (argv[1][0] != 's' && argv[1][0] != 'r')) {
        printf("Uso: %s s|r\\n", argv[0]);
        exit(EXIT_FAILURE);
    }

    modo  = (argv[1][0] == 's') ? 1 : 2;
    llave = ftok(argv[0], 'a');

    if ((qid = msgget(llave, IPC_CREAT | 0666)) == -1) {
        perror("msgget");
        exit(EXIT_FAILURE);
    }

    if (modo == 1) send_msg(qid, msgtype);
    else           get_msg(qid, msgtype);

    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "mcola.c",
    terminalLines: [
      "$ gcc -Wall mcola.c -o mcola",
      "",
      "# Terminal 1: enviar mensaje",
      "$ ./mcola s",
      "Mensaje enviado: Mensaje enviado el: Thu May 14 10:30:00 2026",
      "",
      "# Terminal 2: recibir mensaje",
      "$ ./mcola r",
      "Mensaje recibido: Mensaje enviado el: Thu May 14 10:30:00 2026",
      "",
      "# Si no hay mensajes:",
      "$ ./mcola r",
      "No hay mensajes disponibles en la cola.",
      "",
      "# Ver el estado de la cola:",
      "$ ipcs -q",
      "------ Colas de mensajes ----",
      "key        msqid    propietario perms   bytes mensajes",
      "0x6100050e 3        gcgero      666     0     0",
    ],
    terminalTitle: "Terminal — bash · mcola",
    conclusion:
      "Las colas de mensajes son el único mecanismo IPC de System V que preserva los límites entre mensajes (a diferencia de pipe que es un flujo continuo). El campo mtype permite que múltiples tipos de mensajes coexistan en la misma cola y que los receptores seleccionen solo los que les interesan. La cola persiste en el sistema hasta que se elimina explícitamente con msgctl(IPC_RMID) o con ipcrm.",
    improvements:
      "Implementar un sistema productor-consumidor con múltiples tipos de mensajes usando msgtyp para enrutamiento. Combinar la cola con un semáforo para controlar el acceso concurrente al envío. Comparar con las colas de mensajes POSIX (mq_open) que ofrecen mayor portabilidad y prioridad de mensajes.",
  },

  // ─────────────────────────────────────────────────────────────────
  // 3.5 Información de IPC por medio de comandos del sistema
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-3-5",
    number: 9,
    title: "3.5 Información de IPC por medio de comandos del sistema",
    difficulty: "Básico" as const,
    tags: ["ipcs", "ipcrm", "/proc/sysvipc", "comandos", "IPC", "administración"],
    objective:
      "Usar los comandos del sistema ipcs e ipcrm para inspeccionar y administrar los objetos IPC activos, y conocer el directorio /proc/sysvipc y /proc/sys/kernel para monitorear y configurar los límites del sistema.",
    theory: `GNU/Linux proporciona comandos y archivos de sistema para gestionar y monitorear todos los objetos IPC activos.

Comando ipcs — Information on IPC facilities:
  • ipcs          → muestra los tres tipos de IPC (semáforos, memoria compartida, colas).
  • ipcs -s       → solo semáforos.
  • ipcs -m       → solo memoria compartida.
  • ipcs -q       → solo colas de mensajes.
  • ipcs -l       → límites del sistema para cada mecanismo.

Comando ipcrm — Remove IPC objects:
  • ipcrm -s <semid>  → eliminar semáforo por identificador.
  • ipcrm -m <shmid>  → eliminar memoria compartida por identificador.
  • ipcrm -q <msqid>  → eliminar cola de mensajes por identificador.
  • ipcrm -S <llave>  → eliminar semáforo por llave.
  • ipcrm -M <llave>  → eliminar memoria compartida por llave.
  • ipcrm -Q <llave>  → eliminar cola de mensajes por llave.

Directorio /proc/sysvipc:
  Contiene tres archivos de solo lectura con información en tiempo real:
  • /proc/sysvipc/msg → colas de mensajes activas.
  • /proc/sysvipc/sem → conjuntos de semáforos activos.
  • /proc/sysvipc/shm → segmentos de memoria compartida activos.

Límites del sistema en /proc/sys/kernel/:
  • /proc/sys/kernel/sem     → límites de semáforos (SEMMSL, SEMMNS, SEMOPM, SEMMNI).
  • /proc/sys/kernel/shmmax  → tamaño máximo de un segmento de memoria compartida.
  • /proc/sys/kernel/shmall  → páginas totales de memoria compartida.
  • /proc/sys/kernel/msgmax  → tamaño máximo de un mensaje.
  • /proc/sys/kernel/msgmnb  → tamaño máximo de la cola en bytes.
  • /proc/sys/kernel/msgmni  → número máximo de colas de mensajes.

El sistema tiene límites asociados a cada mecanismo IPC para prevenir la creación arbitraria de objetos y el agotamiento de recursos.`,
    code: `/* Script de demostración de comandos IPC del sistema
   Crea un objeto de cada tipo, los observa y los elimina */

/* ── Paso 1: Crear objetos IPC de prueba ── */
// gcc semaforos_sv.c -o sem_test && ./sem_test &  (en background)
// gcc shm_demo.c -o shm_test && ./shm_test &
// gcc mcola.c -o mq_test && ./mq_test s

/* ── Paso 2: Listar todos los objetos IPC ── */
// ipcs

/* Salida esperada:
------ Colas de mensajes ----
key        msqid    propietario perms   bytes mensajes
0x6100050e 3        gcgero      666     0     0

---- Segmentos memoria compartida ---
key        shmid    propietario perms   bytes   nattch estado
0x00000000 884743   gcgero      600     1048576 2      dest

------ Matrices semáforo ------
key        semid    propietario perms   nsems
0x6100050e 1        gcgero      600     2
*/

/* ── Paso 3: Ver información en /proc/sysvipc ── */
// ls /proc/sysvipc          → msg  sem  shm
// cat /proc/sysvipc/sem     → semid perms nsems uid gid ...

/* ── Paso 4: Ver límites del sistema ── */
// cat /proc/sys/kernel/sem
//   → 32000 1024000000 500 32000
//   (SEMMSL SEMMNS SEMOPM SEMMNI)

// cat /proc/sys/kernel/shmmax
//   → 18446744073692774399   (bytes)

// cat /proc/sys/kernel/msgmax
//   → 8192   (bytes por mensaje)

/* ── Paso 5: Eliminar objetos IPC ── */
// ipcrm -s 1      → eliminar semáforo con semid=1
// ipcrm -m 884743 → eliminar memoria compartida con shmid=884743
// ipcrm -q 3      → eliminar cola de mensajes con msqid=3

/* ── Paso 6: Verificar que fueron eliminados ── */
// ipcs
// (debe aparecer vacío o sin los objetos eliminados)`,
    language: "c",
    filename: "ipc_comandos.c",
    terminalLines: [
      "$ ipcs",
      "------ Colas de mensajes ----",
      "key        msqid  propietario perms  bytes mensajes",
      "0x6100050e 3      gcgero      666    0     0",
      "",
      "---- Segmentos memoria compartida ---",
      "key        shmid  propietario perms  bytes   nattch estado",
      "0x00000000 884743 gcgero      600    1048576 0      dest",
      "",
      "------ Matrices semáforo ------",
      "key        semid  propietario perms  nsems",
      "0x6100050e 1      gcgero      600    2",
      "",
      "$ cat /proc/sysvipc/sem",
      "key       semid perms nsems uid  gid  cuid cgid otime            ctime",
      "1627391246 1    600   2     1000 1000 1000 1000 1772583562 1772583561",
      "",
      "$ cat /proc/sys/kernel/sem",
      "32000  1024000000  500  32000",
      "",
      "$ cat /proc/sys/kernel/shmmax",
      "18446744073692774399",
      "",
      "$ ipcrm -s 1 && ipcrm -m 884743 && ipcrm -q 3",
      "$ ipcs",
      "------ Colas de mensajes ----",
      "---- Segmentos memoria compartida ---",
      "------ Matrices semáforo ------",
      "(vacío)",
    ],
    terminalTitle: "Terminal — bash · ipc_comandos",
    conclusion:
      "Los comandos ipcs e ipcrm son herramientas esenciales para la administración del sistema. Los objetos IPC de System V persisten aunque los procesos que los crearon hayan terminado, por lo que es común encontrar objetos 'huérfanos' que deben eliminarse manualmente. El directorio /proc/sysvipc proporciona una vista en tiempo real del estado interno del kernel para cada mecanismo IPC.",
    improvements:
      "Crear un script de shell que liste todos los objetos IPC de un usuario y los elimine de forma selectiva. Monitorear en tiempo real los cambios en /proc/sysvipc mientras los programas de prueba se ejecutan. Ajustar los límites de /proc/sys/kernel/sem y shmmax (con echo > archivo como root) y observar el efecto.",
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
              Tema 3 · 3 Prácticas
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
          Comunicación entre Procesos (Inter-Process Communication). Se exploran los tres mecanismos principales: pipes anónimos para comunicación padre-hijo, memoria compartida POSIX para máximo rendimiento, y semáforos para sincronización de acceso a recursos compartidos.
        </p>
        <div className="flex flex-wrap gap-2">
          {["pipe()", "shm_open()", "mmap()", "sem_init()", "sem_wait()", "sem_post()"].map((tag) => (
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