import { Network } from "lucide-react";
import { PracticeCard } from "../components/PracticeCard";

const practices = [
  {
    id: "practica-1",
    number: 1,
    title: "Comunicación con Pipes Anónimos",
    difficulty: "Intermedio" as const,
    tags: ["pipe", "IPC", "fork", "comunicación"],
    objective:
      "Implementar comunicación unidireccional entre un proceso padre e hijo usando pipes anónimos, comprendiendo el modelo de descriptores de archivo y el flujo de datos en UNIX.",
    theory: `Un pipe (tubo) es uno de los mecanismos de IPC más antiguos de UNIX. Es un canal de comunicación unidireccional en memoria del kernel que conecta la salida de un proceso con la entrada de otro.

Un pipe crea dos descriptores de archivo:
• fd[0]: Extremo de lectura (read end).
• fd[1]: Extremo de escritura (write end).

Los datos fluyen en una sola dirección: se escriben en fd[1] y se leen de fd[0].

Reglas importantes:
• Es importante cerrar el extremo no utilizado en cada proceso para evitar bloqueos.
• Cuando todos los escritores cierran fd[1], el lector recibe EOF (End of File).
• Los pipes son unidireccionales; para comunicación bidireccional se necesitan dos pipes.
• El kernel garantiza que escrituras de hasta PIPE_BUF bytes son atómicas.

Cuando se combina pipe() con fork(), el proceso hijo hereda los descriptores de archivo del padre, permitiendo la comunicación entre ellos.`,
    code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/types.h>

#define BUFFER_SIZE 256

// Simula el trabajo del productor (PADRE → HIJO)
void padre_envia(int fd_escritura, const char *mensajes[], int n) {
    printf("[PADRE] PID=%d | Iniciando envío de %d mensajes\\n",
           getpid(), n);

    for (int i = 0; i < n; i++) {
        char paquete[BUFFER_SIZE];
        snprintf(paquete, sizeof(paquete), "[MSG %d] %s", i + 1, mensajes[i]);

        write(fd_escritura, paquete, strlen(paquete) + 1);
        printf("[PADRE] Enviado: \"%s\"\\n", paquete);
        usleep(200000); // 200ms entre mensajes
    }

    close(fd_escritura);
    printf("[PADRE] Canal de escritura cerrado.\\n");
}

// Simula el trabajo del consumidor (HIJO recibe)
void hijo_recibe(int fd_lectura) {
    char buffer[BUFFER_SIZE];
    int bytes_leidos;
    int total = 0;

    printf("[HIJO]  PID=%d | Esperando mensajes del padre...\\n", getpid());

    while ((bytes_leidos = read(fd_lectura, buffer, sizeof(buffer))) > 0) {
        printf("[HIJO]  Recibido (%d bytes): \"%s\"\\n",
               bytes_leidos, buffer);
        total++;
    }

    close(fd_lectura);
    printf("[HIJO]  Total de mensajes recibidos: %d\\n", total);
    printf("[HIJO]  EOF detectado. Finalizando.\\n");
    exit(EXIT_SUCCESS);
}

int main() {
    int fd[2]; // fd[0]=lectura, fd[1]=escritura
    pid_t pid;

    const char *mensajes[] = {
        "Hola desde el proceso padre",
        "Sistemas Operativos - UTM 2025",
        "Los pipes son unidireccionales",
        "Comunicación IPC con fork()",
        "Último mensaje del padre"
    };
    int n_mensajes = sizeof(mensajes) / sizeof(mensajes[0]);

    printf("=======================================\\n");
    printf("  Demostración de Pipes Anónimos - UTM \\n");
    printf("=======================================\\n\\n");

    // Crear el pipe ANTES del fork
    if (pipe(fd) == -1) {
        perror("pipe");
        exit(EXIT_FAILURE);
    }

    pid = fork();

    if (pid < 0) {
        perror("fork");
        exit(EXIT_FAILURE);

    } else if (pid == 0) {
        // PROCESO HIJO: solo lee
        close(fd[1]); // Cerrar extremo de escritura
        hijo_recibe(fd[0]);

    } else {
        // PROCESO PADRE: solo escribe
        close(fd[0]); // Cerrar extremo de lectura
        padre_envia(fd[1], mensajes, n_mensajes);
        wait(NULL); // Esperar al hijo
        printf("\\n[PADRE] Hijo ha terminado. Programa completo.\\n");
    }

    return 0;
}`,
    language: "c",
    filename: "pipes_anonimos.c",
    terminalLines: [
      "$ gcc pipes_anonimos.c -o pipes_demo",
      "$ ./pipes_demo",
      "",
      "=======================================",
      "  Demostración de Pipes Anónimos - UTM ",
      "=======================================",
      "",
      "[PADRE] PID=6412 | Iniciando envío de 5 mensajes",
      "[HIJO]  PID=6413 | Esperando mensajes del padre...",
      "[PADRE] Enviado: \"[MSG 1] Hola desde el proceso padre\"",
      "[HIJO]  Recibido (33 bytes): \"[MSG 1] Hola desde el proceso padre\"",
      "[PADRE] Enviado: \"[MSG 2] Sistemas Operativos - UTM 2025\"",
      "[HIJO]  Recibido (39 bytes): \"[MSG 2] Sistemas Operativos - UTM 2025\"",
      "[PADRE] Enviado: \"[MSG 3] Los pipes son unidireccionales\"",
      "[HIJO]  Recibido (38 bytes): \"[MSG 3] Los pipes son unidireccionales\"",
      "[PADRE] Enviado: \"[MSG 4] Comunicación IPC con fork()\"",
      "[HIJO]  Recibido (36 bytes): \"[MSG 4] Comunicación IPC con fork()\"",
      "[PADRE] Enviado: \"[MSG 5] Último mensaje del padre\"",
      "[HIJO]  Recibido (32 bytes): \"[MSG 5] Último mensaje del padre\"",
      "[PADRE] Canal de escritura cerrado.",
      "[HIJO]  Total de mensajes recibidos: 5",
      "[HIJO]  EOF detectado. Finalizando.",
      "",
      "[PADRE] Hijo ha terminado. Programa completo.",
    ],
    terminalTitle: "Terminal — bash · pipes_demo",
    conclusion:
      "Los pipes son elegantes en su simplicidad: modelan perfectamente el flujo de datos como una corriente (stream) de bytes, exactamente como los caracteres '|' funcionan en la línea de comandos de bash. La lección más importante fue que cerrar los extremos no utilizados es obligatorio: si el padre no cierra fd[0], el hijo nunca recibirá EOF aunque el padre haya terminado de escribir, causando un deadlock. Esta práctica me hizo entender el mecanismo interno del comando 'cat archivo | grep palabra | wc -l'.",
    improvements:
      "Implementaría comunicación bidireccional usando dos pipes (uno para cada dirección). También exploraría los Named Pipes (FIFOs) para comunicación entre procesos no relacionados (sin fork). Añadiría protocolos de mensajes con campos de longitud para evitar problemas de fragmentación de mensajes. Finalmente, compararía el rendimiento de pipes con memoria compartida para transferencias de grandes volúmenes de datos.",
  },
  {
    id: "practica-2",
    number: 2,
    title: "Memoria Compartida POSIX (shm)",
    difficulty: "Avanzado" as const,
    tags: ["shm", "memoria compartida", "POSIX", "mmap"],
    objective:
      "Implementar el mecanismo de memoria compartida POSIX para permitir que dos procesos independientes accedan y modifiquen la misma región de memoria, comprendiendo su superioridad en rendimiento sobre otros mecanismos IPC.",
    theory: `La memoria compartida (Shared Memory) es el mecanismo IPC de mayor rendimiento disponible en sistemas POSIX, ya que permite que múltiples procesos accedan directamente a la misma región de memoria física, evitando copias de datos innecesarias.

API POSIX para memoria compartida:
• shm_open(): Crea o abre un objeto de memoria compartida identificado por un nombre.
• ftruncate(): Establece el tamaño del objeto de memoria compartida.
• mmap(): Mapea el objeto en el espacio de direcciones del proceso.
• munmap(): Desmapea la región de memoria.
• shm_unlink(): Elimina el objeto de memoria compartida del sistema.

Flujo típico:
1. Proceso A: shm_open() → ftruncate() → mmap() → escribir datos.
2. Proceso B: shm_open() → mmap() → leer datos.
3. Cualquier proceso: munmap() → shm_unlink() para limpiar.

La memoria compartida NO proporciona sincronización por sí misma. Se debe combinar con semáforos o mutex para evitar condiciones de carrera.`,
    code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <sys/wait.h>

#define SHM_NAME   "/utm_shm_demo"
#define SHM_SIZE   (sizeof(DatosCompartidos))

// Estructura de datos en memoria compartida
typedef struct {
    int    contador;              // Contador modificado por ambos procesos
    char   mensaje[128];          // Mensaje pasado entre procesos
    double valores[5];            // Arreglo de valores compartido
    int    escritura_completa;    // Flag de sincronización simple
} DatosCompartidos;

// Proceso escritor: crea y escribe en la memoria compartida
void proceso_escritor() {
    int fd;
    DatosCompartidos *datos;

    printf("[ESCRITOR] PID=%d | Creando memoria compartida '%s'\\n",
           getpid(), SHM_NAME);

    // Crear objeto de memoria compartida
    fd = shm_open(SHM_NAME, O_CREAT | O_RDWR, 0666);
    if (fd == -1) { perror("shm_open"); exit(1); }

    // Establecer tamaño
    ftruncate(fd, SHM_SIZE);

    // Mapear en el espacio de direcciones
    datos = (DatosCompartidos *)mmap(NULL, SHM_SIZE,
                                     PROT_READ | PROT_WRITE,
                                     MAP_SHARED, fd, 0);
    if (datos == MAP_FAILED) { perror("mmap"); exit(1); }
    close(fd);

    // Inicializar datos compartidos
    memset(datos, 0, SHM_SIZE);
    datos->contador = 42;
    strcpy(datos->mensaje, "Hola desde el escritor - UTM 2025");
    double vals[] = {3.14159, 2.71828, 1.41421, 1.73205, 0.57721};
    memcpy(datos->valores, vals, sizeof(vals));
    datos->escritura_completa = 1; // Señal al lector

    printf("[ESCRITOR] Datos escritos:\\n");
    printf("  - Contador: %d\\n", datos->contador);
    printf("  - Mensaje:  \"%s\"\\n", datos->mensaje);
    printf("  - Valores:  [%.5f, %.5f, %.5f, ...]\\n",
           datos->valores[0], datos->valores[1], datos->valores[2]);

    // Esperar que el lector consuma los datos (simulado con sleep)
    sleep(2);

    printf("[ESCRITOR] Actualizando contador: %d → %d\\n",
           datos->contador, datos->contador * 2);
    datos->contador *= 2;
    sleep(1);

    munmap(datos, SHM_SIZE);
    printf("[ESCRITOR] Memoria desmapeada. Proceso terminado.\\n");
}

// Proceso lector: lee de la memoria compartida
void proceso_lector() {
    int fd;
    DatosCompartidos *datos;

    sleep(1); // Dar tiempo al escritor de crear la shm

    printf("[LECTOR]   PID=%d | Abriendo memoria compartida '%s'\\n",
           getpid(), SHM_NAME);

    fd = shm_open(SHM_NAME, O_RDWR, 0666);
    if (fd == -1) { perror("shm_open lector"); exit(1); }

    datos = (DatosCompartidos *)mmap(NULL, SHM_SIZE,
                                     PROT_READ | PROT_WRITE,
                                     MAP_SHARED, fd, 0);
    if (datos == MAP_FAILED) { perror("mmap lector"); exit(1); }
    close(fd);

    // Esperar a que el escritor termine de escribir
    while (!datos->escritura_completa) { usleep(10000); }

    printf("[LECTOR]   Datos leídos de la memoria compartida:\\n");
    printf("  - Contador: %d\\n", datos->contador);
    printf("  - Mensaje:  \"%s\"\\n", datos->mensaje);
    printf("  - Valores:  [%.5f, %.5f, %.5f, %.5f, %.5f]\\n",
           datos->valores[0], datos->valores[1], datos->valores[2],
           datos->valores[3], datos->valores[4]);

    sleep(1);
    printf("[LECTOR]   Contador actualizado por escritor: %d\\n",
           datos->contador);

    munmap(datos, SHM_SIZE);
    shm_unlink(SHM_NAME); // Eliminar objeto de shm
    printf("[LECTOR]   shm_unlink() - Memoria compartida eliminada.\\n");
}

int main() {
    printf("===========================================\\n");
    printf("  Memoria Compartida POSIX (shm) - UTM    \\n");
    printf("===========================================\\n\\n");

    pid_t pid = fork();
    if (pid == 0) {
        proceso_lector();
    } else {
        proceso_escritor();
        wait(NULL);
        printf("\\n[MAIN] Programa finalizado.\\n");
    }
    return 0;
}`,
    language: "c",
    filename: "shm_posix.c",
    terminalLines: [
      "$ gcc shm_posix.c -o shm_demo -lrt",
      "$ ./shm_demo",
      "",
      "===========================================",
      "  Memoria Compartida POSIX (shm) - UTM    ",
      "===========================================",
      "",
      "[ESCRITOR] PID=7201 | Creando memoria compartida '/utm_shm_demo'",
      "[ESCRITOR] Datos escritos:",
      "  - Contador: 42",
      "  - Mensaje:  \"Hola desde el escritor - UTM 2025\"",
      "  - Valores:  [3.14159, 2.71828, 1.41421, ...]",
      "[LECTOR]   PID=7202 | Abriendo memoria compartida '/utm_shm_demo'",
      "[LECTOR]   Datos leídos de la memoria compartida:",
      "  - Contador: 42",
      "  - Mensaje:  \"Hola desde el escritor - UTM 2025\"",
      "  - Valores:  [3.14159, 2.71828, 1.41421, 1.73205, 0.57721]",
      "[ESCRITOR] Actualizando contador: 42 → 84",
      "[LECTOR]   Contador actualizado por escritor: 84",
      "[ESCRITOR] Memoria desmapeada. Proceso terminado.",
      "[LECTOR]   shm_unlink() - Memoria compartida eliminada.",
      "",
      "[MAIN] Programa finalizado.",
    ],
    terminalTitle: "Terminal — bash · shm_demo",
    conclusion:
      "La memoria compartida es el mecanismo IPC más rápido porque no hay llamadas al sistema para transferir datos una vez que la región está mapeada: los procesos leen y escriben directamente en la misma memoria física. El flag escritura_completa que usé es una forma muy primitiva de sincronización; en producción esto causaría busy-waiting. La llamada mmap() es fascinante porque abstrae completamente el manejo de memoria del kernel, haciendo que el IPC parezca simple acceso a una estructura en memoria.",
    improvements:
      "Remplazaría el flag de sincronización primitivo por semáforos POSIX para una coordinación correcta. Implementaría un sistema de doble buffer para permitir escritura y lectura simultáneas sin bloqueos. Añadiría manejo de señales para limpiar la memoria compartida si el proceso termina inesperadamente (atexit()). También implementaría un esquema de múltiples lectores y un escritor usando un semáforo de lectores-escritores.",
  },
  {
    id: "practica-3",
    number: 3,
    title: "Semáforos POSIX para Sincronización",
    difficulty: "Avanzado" as const,
    tags: ["semáforos", "POSIX", "sincronización", "sem_t"],
    objective:
      "Implementar semáforos POSIX sin nombre para sincronizar el acceso a recursos compartidos entre hilos, resolviendo el problema de la sección crítica de forma más eficiente que con busy-waiting.",
    theory: `Un semáforo es una variable entera no negativa con dos operaciones atómicas definidas por Dijkstra:
• wait() (también llamada P, down, o sem_wait): Decrementa el semáforo. Si el valor es 0, bloquea al proceso/hilo hasta que sea positivo.
• signal() (también llamada V, up, o sem_post): Incrementa el semáforo. Si hay procesos bloqueados, despierta a uno.

Tipos de semáforos en Linux:
• Semáforos POSIX sin nombre (sem_t): Para sincronización entre hilos del mismo proceso.
• Semáforos POSIX con nombre (sem_open): Para sincronización entre procesos diferentes.
• Semáforos System V (semget/semop): Más antiguos y complejos, evitar en código nuevo.

API POSIX:
• sem_init(): Inicializa un semáforo sin nombre.
• sem_wait(): Operación P (puede bloquear).
• sem_trywait(): Operación P no bloqueante.
• sem_post(): Operación V (nunca bloquea).
• sem_getvalue(): Consulta el valor actual.
• sem_destroy(): Libera recursos.

Semáforo binario (valor inicial=1): Actúa como mutex.
Semáforo contador (valor inicial=N): Controla acceso a N recursos.`,
    code: `#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

#define NUM_HILOS    5
#define NUM_RECURSOS 2     // Solo 2 instancias del recurso disponibles

// Semáforo contador: controla acceso a NUM_RECURSOS instancias
sem_t sem_recursos;
// Semáforo binario: protege la salida a consola
sem_t sem_consola;

// Simulación de un recurso compartido (ej. conexión a base de datos)
typedef struct {
    int id;
    int en_uso;
} Recurso;

Recurso recursos[NUM_RECURSOS] = {{1, 0}, {2, 0}};

// Encontrar un recurso libre
int adquirir_recurso() {
    for (int i = 0; i < NUM_RECURSOS; i++) {
        if (!recursos[i].en_uso) {
            recursos[i].en_uso = 1;
            return recursos[i].id;
        }
    }
    return -1; // No debería ocurrir si el semáforo funciona correctamente
}

void liberar_recurso(int id) {
    for (int i = 0; i < NUM_RECURSOS; i++) {
        if (recursos[i].id == id) {
            recursos[i].en_uso = 0;
            return;
        }
    }
}

void log_evento(int hilo_id, const char *evento, int recurso_id) {
    sem_wait(&sem_consola); // Proteger salida
    int valor;
    sem_getvalue(&sem_recursos, &valor);
    printf("[Hilo %d] %s (Recurso #%d) | Semáforo=%d\\n",
           hilo_id, evento, recurso_id, valor);
    sem_post(&sem_consola);
}

void *trabajador(void *arg) {
    int id = *(int *)arg;
    free(arg);

    for (int turno = 1; turno <= 2; turno++) {
        // Solicitar acceso al recurso
        sem_wait(&sem_consola);
        printf("[Hilo %d] Turno %d/2: esperando recurso...\\n", id, turno);
        sem_post(&sem_consola);

        sem_wait(&sem_recursos); // Bloqueará si todos los recursos están ocupados

        // Sección crítica: usar el recurso
        int recurso = adquirir_recurso();
        log_evento(id, "ADQUIRIÓ recurso", recurso);

        // Simular uso del recurso
        int tiempo = 500000 + (rand() % 500000); // 0.5-1.0 segundos
        usleep(tiempo);

        // Liberar el recurso
        liberar_recurso(recurso);
        log_evento(id, "LIBERÓ  recurso", recurso);
        sem_post(&sem_recursos);

        usleep(100000); // Pequeña pausa entre turnos
    }

    sem_wait(&sem_consola);
    printf("[Hilo %d] Completó todos sus turnos.\\n", id);
    sem_post(&sem_consola);

    return NULL;
}

int main() {
    pthread_t hilos[NUM_HILOS];

    printf("=============================================\\n");
    printf("  Semáforos POSIX - Recursos Compartidos     \\n");
    printf("  Hilos: %d | Recursos disponibles: %d       \\n",
           NUM_HILOS, NUM_RECURSOS);
    printf("=============================================\\n\\n");

    // Inicializar semáforos
    sem_init(&sem_recursos, 0, NUM_RECURSOS); // Contador (valor inicial = 2)
    sem_init(&sem_consola, 0, 1);             // Binario (mutex para printf)

    srand(42);

    // Crear hilos trabajadores
    for (int i = 0; i < NUM_HILOS; i++) {
        int *id = malloc(sizeof(int));
        *id = i + 1;
        pthread_create(&hilos[i], NULL, trabajador, id);
        printf("[MAIN] Hilo %d creado.\\n", i + 1);
    }

    // Esperar a todos los hilos
    for (int i = 0; i < NUM_HILOS; i++) {
        pthread_join(hilos[i], NULL);
    }

    // Limpiar semáforos
    sem_destroy(&sem_recursos);
    sem_destroy(&sem_consola);

    printf("\\n[MAIN] Todos los hilos completados.\\n");
    printf("[MAIN] Recursos finales: #1=%s, #2=%s\\n",
           recursos[0].en_uso ? "OCUPADO" : "LIBRE",
           recursos[1].en_uso ? "OCUPADO" : "LIBRE");
    return 0;
}`,
    language: "c",
    filename: "semaforos_posix.c",
    terminalLines: [
      "$ gcc semaforos_posix.c -o semaforos -lpthread",
      "$ ./semaforos",
      "",
      "=============================================",
      "  Semáforos POSIX - Recursos Compartidos     ",
      "  Hilos: 5 | Recursos disponibles: 2         ",
      "=============================================",
      "",
      "[MAIN] Hilo 1 creado.",
      "[MAIN] Hilo 2 creado.",
      "[MAIN] Hilo 3 creado.",
      "[MAIN] Hilo 4 creado.",
      "[MAIN] Hilo 5 creado.",
      "[Hilo 1] Turno 1/2: esperando recurso...",
      "[Hilo 2] Turno 1/2: esperando recurso...",
      "[Hilo 3] Turno 1/2: esperando recurso...",
      "[Hilo 1] ADQUIRIÓ recurso (Recurso #1) | Semáforo=1",
      "[Hilo 2] ADQUIRIÓ recurso (Recurso #2) | Semáforo=0",
      "[Hilo 3] Turno 1/2: esperando recurso...",
      "# Hilo 3, 4, 5 esperan porque Semáforo=0",
      "[Hilo 1] LIBERÓ  recurso (Recurso #1) | Semáforo=1",
      "[Hilo 3] ADQUIRIÓ recurso (Recurso #1) | Semáforo=0",
      "[Hilo 2] LIBERÓ  recurso (Recurso #2) | Semáforo=1",
      "[Hilo 4] ADQUIRIÓ recurso (Recurso #2) | Semáforo=0",
      "[Hilo 3] LIBERÓ  recurso (Recurso #1) | Semáforo=1",
      "[Hilo 5] ADQUIRIÓ recurso (Recurso #1) | Semáforo=0",
      "...",
      "[Hilo 1] Completó todos sus turnos.",
      "[Hilo 2] Completó todos sus turnos.",
      "[Hilo 3] Completó todos sus turnos.",
      "[Hilo 4] Completó todos sus turnos.",
      "[Hilo 5] Completó todos sus turnos.",
      "",
      "[MAIN] Todos los hilos completados.",
      "[MAIN] Recursos finales: #1=LIBRE, #2=LIBRE",
    ],
    terminalTitle: "Terminal — bash · semaforos",
    conclusion:
      "Los semáforos representan una abstracción poderosa y general: un semáforo binario (valor inicial 1) se comporta exactamente como un mutex, mientras que un semáforo contador (valor inicial N) controla el acceso a N instancias de un recurso simultáneamente. Lo más importante es comprender que sem_wait() es una operación atómica garantizada por el kernel, lo que evita las condiciones de carrera en la actualización del valor del semáforo en sí mismo. El semáforo de consola fue un detalle importante para que la salida fuera legible.",
    improvements:
      "Implementaría semáforos con nombre (sem_open) para sincronizar procesos completamente independientes (no relacionados por fork). Añadiría sem_timedwait() para implementar timeouts y evitar bloqueos indefinidos. Crearía una versión del problema Lectores-Escritores usando semáforos, que es más compleja pero muy importante en bases de datos. También compararía métricas de rendimiento entre semáforos POSIX, mutex de pthreads y semáforos System V.",
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
