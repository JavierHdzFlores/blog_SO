import { Network } from "lucide-react";
import { PracticeCard } from "../components/PracticeCard";

const practices = [
  {
    id: "ipc-practica-1",
    number: 1,
    title: "Tuberías sin nombre — pipe()",
    difficulty: "Básico" as const,
    tags: ["pipe", "IPC", "fork", "comunicación", "POSIX"],
    objective:
      "Crear tuberías sin nombre con pipe() para comunicar un proceso padre con su hijo, comprender el flujo unidireccional de datos y el manejo correcto de los descriptores de lectura y escritura.",
    theory: `Las tuberías sin nombre (pipes) son la forma más básica de IPC en UNIX. Presentan dos limitaciones fundamentales:
1. Los datos fluyen en una sola dirección (half-duplex).
2. Solo pueden usarse entre procesos que comparten un ancestro común.

El prototipo es:
  int pipe(int filedes[2]);
  • filedes[0] → extremo de LECTURA.
  • filedes[1] → extremo de ESCRITURA.
  • Retorna 0 en éxito, -1 en error.

La función pipe2() (Linux ≥ 2.6.27) acepta flags adicionales:
  • O_CLOEXEC  → cierra los descriptores al ejecutar exec.
  • O_NONBLOCK → modo no bloqueante.
  • O_DIRECT   → modo paquete (cada write es un paquete independiente).

Flujo típico de uso:
1. El proceso llama a pipe() antes de fork().
2. Tras fork(), cada proceso cierra el extremo que no usa.
3. El escritor escribe con write(filedes[1], ...).
4. El lector lee con read(filedes[0], ...).

Si el proceso escritor cierra su extremo, el lector recibe EOF al agotar los datos. Si el lector cierra su extremo, el escritor recibe SIGPIPE.`,
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
    theory: `Las tuberías con nombre (FIFOs) resuelven la limitación principal de los pipes: pueden comunicar procesos que no comparten un ancestro, porque el archivo FIFO vive en el sistema de archivos y cualquier proceso con los permisos adecuados puede abrirlo.

El prototipo es:
  #include <sys/types.h>
  #include <sys/stat.h>
  int mkfifo(const char *pathname, mode_t mode);
  • pathname → ruta donde se creará el archivo especial FIFO.
  • mode     → permisos (p.ej. 0666, modificado por umask).
  • Retorna 0 en éxito, -1 en error.

Comportamiento importante:
• Abrir un FIFO para lectura BLOQUEA hasta que otro proceso lo abra para escritura, y viceversa.
• Una vez abierto en ambos extremos, la E/S funciona igual que un pipe.
• El archivo persiste en el sistema de archivos hasta que se elimine con unlink().
• umask() se usa para ajustar la máscara de permisos antes de crear el FIFO.

Diferencias clave con pipe():
  pipe  → sin nombre, solo procesos emparentados, descriptor de archivo.
  FIFO  → con nombre/ruta, cualquier proceso, descriptor de archivo.`,
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
    theory: `Los semáforos en System V son conjuntos de valores enteros no negativos mantenidos por el kernel. Cada operación sobre el conjunto es atómica, garantizando sincronización sin condiciones de carrera.

Flujo de uso:
1. Generar una llave: key_t llave = ftok(pathname, proj_id);
   ftok combina los 8 bits menos significativos de proj_id + número de i-nodo + número de dispositivo → llave única de 32 bits.

2. Crear/obtener el conjunto: semid = semget(llave, nsems, semflg);
   • nsems   → número de semáforos en el conjunto.
   • semflg  → IPC_CREAT|0600 (crear con permisos de propietario).

3. Inicializar valores: semctl(semid, num, SETVAL, valor);

4. Operar sobre el semáforo: semop(semid, &operacion, 1);
   La estructura sembuf tiene:
   • sem_num → índice del semáforo en el conjunto.
   • sem_op  → negativo = decrementar (bloquear), positivo = incrementar (despertar), 0 = esperar a cero.
   • sem_flg → 0 (bloqueante) o IPC_NOWAIT.

5. Eliminar el conjunto: semctl(semid, 0, IPC_RMID, 0);

Comandos del sistema:
  ipcs -s         → lista conjuntos de semáforos activos.
  ipcrm -s semid  → elimina un conjunto de semáforos.`,
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
    theory: `La memoria compartida es el mecanismo IPC más rápido porque los procesos acceden directamente a la misma región de memoria sin necesidad de copias. Sin embargo, requiere sincronización externa (semáforos o mutex) para evitar condiciones de carrera.

Funciones del ciclo de vida:

1. Crear/obtener el segmento:
   int shmget(key_t key, size_t size, int shmflg);
   • size    → tamaño en bytes del segmento.
   • shmflg → IPC_CREAT | permisos (p.ej. 0600).
   • Retorna shmid (identificador del segmento).

2. Adjuntar al espacio de direcciones del proceso:
   void *shmat(int shmid, const void *shmaddr, int shmflg);
   • shmaddr = NULL → el kernel elige la dirección.
   • Retorna puntero a la región compartida.

3. Operar sobre los datos directamente a través del puntero.

4. Desadjuntar (el segmento no se elimina):
   int shmdt(const void *shmaddr);

5. Eliminar el segmento del kernel:
   shmctl(shmid, IPC_RMID, NULL);

Otros comandos de shmctl:
  IPC_STAT  → lee la estructura de control shmid_ds.
  IPC_SET   → modifica permisos y propietario.
  SHM_LOCK  → fija el segmento en memoria RAM.
  SHM_UNLOCK → lo libera para swap.

Comandos del sistema:
  ipcs -m          → lista segmentos de memoria compartida.
  cat /proc/sysvipc/shm → estado detallado en el kernel.`,
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
    theory: `Las colas de mensajes permiten que procesos intercambien datos estructurados (mensajes) de forma asíncrona y con filtrado por tipo. A diferencia de los pipes, los mensajes quedan en la cola del kernel hasta que son consumidos.

Estructura básica de un mensaje:
  struct msgbuf {
    long mtype;       // Tipo del mensaje (debe ser > 0)
    char mtext[N];    // Cuerpo del mensaje
  };

Funciones principales:

1. Crear/obtener la cola:
   int msgget(key_t key, int msgflg);
   • IPC_PRIVATE → crea una cola privada (sin llave).
   • ftok() + IPC_CREAT → crea o accede a una cola compartida.

2. Enviar un mensaje:
   int msgsnd(int msqid, const void *msgp, size_t msgsz, int msgflg);
   • msgsz → tamaño de mtext (sin incluir mtype).
   • IPC_NOWAIT → no bloquear si la cola está llena.

3. Recibir un mensaje:
   ssize_t msgrcv(int msqid, void *msgp, size_t msgsz, long msgtyp, int msgflg);
   • msgtyp = 0   → primer mensaje de la cola (FIFO).
   • msgtyp > 0   → primer mensaje de ese tipo exacto.
   • msgtyp < 0   → primer mensaje con tipo ≤ |msgtyp|.
   • MSG_NOERROR  → truncar si el mensaje es mayor que msgsz.

4. Eliminar la cola:
   msgctl(msqid, IPC_RMID, NULL);

Comandos del sistema:
  ipcs -q         → lista colas de mensajes activas.
  ipcrm -q msqid  → elimina una cola.`,
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
    theory: `El sistema GNU/Linux ofrece dos vías para inspeccionar los objetos IPC System V activos:

1. Comando ipcs (IPC Status):
   ipcs           → muestra colas, memoria compartida y semáforos.
   ipcs -q        → solo colas de mensajes.
   ipcs -m        → solo segmentos de memoria compartida.
   ipcs -s        → solo conjuntos de semáforos.
   ipcs -l        → límites del sistema para cada mecanismo.

2. Sistema de archivos virtual /proc/sysvipc/:
   /proc/sysvipc/msg → colas de mensajes.
   /proc/sysvipc/shm → segmentos de memoria compartida.
   /proc/sysvipc/sem → conjuntos de semáforos.
   Estos archivos son de solo lectura y contienen información detallada del kernel.

3. Límites del sistema en /proc/sys/kernel/:
   shmmax  → tamaño máximo de un segmento de memoria compartida.
   sem     → parámetros de semáforos (SEMMSL, SEMMNS, SEMOPM, SEMMNI).
   msgmax  → tamaño máximo de un mensaje.
   msgmnb  → tamaño máximo de la cola en bytes.

4. Eliminar objetos IPC huérfanos con ipcrm:
   ipcrm -q msqid  → elimina cola de mensajes.
   ipcrm -m shmid  → elimina segmento de memoria compartida.
   ipcrm -s semid  → elimina conjunto de semáforos.

Los objetos IPC System V persisten en el kernel hasta que se eliminan explícitamente (IPC_RMID / ipcrm), incluso si todos los procesos que los crearon ya terminaron.`,
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
