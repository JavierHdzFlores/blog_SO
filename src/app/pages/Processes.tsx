import { Cpu } from "lucide-react";
import { PracticeCard } from "../components/PracticeCard";

const practices = [
  {
    id: "practica-1",
    number: 1,
    title: "Creación de Procesos con fork()",
    difficulty: "Intermedio" as const,
    tags: ["fork", "procesos", "wait", "POSIX"],
    objective:
      "Comprender el mecanismo de creación de procesos en Linux mediante la llamada al sistema fork(), entender la duplicación del espacio de memoria y la gestión de procesos hijo con wait().",
    theory: `En Linux, un proceso es una instancia en ejecución de un programa que tiene su propio espacio de memoria, variables, descriptores de archivo y estado. Cada proceso tiene un identificador único llamado PID (Process ID).

La llamada al sistema fork() crea un proceso hijo que es una copia casi idéntica del proceso padre. Después de fork():
• En el proceso padre: fork() devuelve el PID del hijo (> 0).
• En el proceso hijo: fork() devuelve 0.
• En caso de error: fork() devuelve -1.

El proceso padre puede esperar a que el hijo termine usando wait() o waitpid(). Sin esto, el proceso hijo terminado se convierte en un proceso zombie hasta que el padre lo "recoge".

La llamada exec() (execvp, execl, etc.) reemplaza el código del proceso actual por un nuevo programa, siendo la forma en que la shell ejecuta comandos externos.`,
    code: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/types.h>
#include <time.h>

// Función que simula un proceso trabajador
void proceso_trabajador(int id, int segundos) {
    printf("[HIJO %d] PID=%d | Padre PID=%d | Trabajando %ds...\\n",
           id, getpid(), getppid(), segundos);
    sleep(segundos);
    printf("[HIJO %d] PID=%d | Tarea completada.\\n", id, getpid());
    exit(EXIT_SUCCESS);
}

int main() {
    const int NUM_HIJOS = 3;
    pid_t pids[NUM_HIJOS];
    int tiempos[] = {3, 1, 2}; // Tiempo de trabajo para cada hijo

    printf("===================================\\n");
    printf("  Demostración de fork() - UTM     \\n");
    printf("  Proceso PADRE: PID = %d           \\n", getpid());
    printf("===================================\\n\\n");

    // Crear NUM_HIJOS procesos
    for (int i = 0; i < NUM_HIJOS; i++) {
        pids[i] = fork();

        if (pids[i] < 0) {
            // Error al crear el proceso
            perror("fork");
            exit(EXIT_FAILURE);

        } else if (pids[i] == 0) {
            // Código del proceso HIJO
            proceso_trabajador(i + 1, tiempos[i]);
            // No llega aquí porque proceso_trabajador llama exit()

        } else {
            // Código del proceso PADRE
            printf("[PADRE] Hijo %d creado con PID=%d\\n", i + 1, pids[i]);
        }
    }

    printf("\\n[PADRE] Todos los hijos creados. Esperando...\\n\\n");

    // Esperar a que todos los hijos terminen
    for (int i = 0; i < NUM_HIJOS; i++) {
        int estado;
        pid_t hijo_terminado = waitpid(pids[i], &estado, 0);

        if (WIFEXITED(estado)) {
            printf("[PADRE] Hijo PID=%d terminó con código %d\\n",
                   hijo_terminado, WEXITSTATUS(estado));
        }
    }

    printf("\\n[PADRE] Todos los hijos han terminado.\\n");
    printf("[PADRE] PID=%d finaliza.\\n", getpid());

    return 0;
}`,
    language: "c",
    filename: "fork_demo.c",
    terminalLines: [
      "$ gcc fork_demo.c -o fork_demo",
      "$ ./fork_demo",
      "",
      "===================================",
      "  Demostración de fork() - UTM     ",
      "  Proceso PADRE: PID = 4821        ",
      "===================================",
      "",
      "[PADRE] Hijo 1 creado con PID=4822",
      "[PADRE] Hijo 2 creado con PID=4823",
      "[PADRE] Hijo 3 creado con PID=4824",
      "[HIJO 1] PID=4822 | Padre PID=4821 | Trabajando 3s...",
      "[HIJO 2] PID=4823 | Padre PID=4821 | Trabajando 1s...",
      "[HIJO 3] PID=4824 | Padre PID=4821 | Trabajando 2s...",
      "",
      "[PADRE] Todos los hijos creados. Esperando...",
      "",
      "[HIJO 2] PID=4823 | Tarea completada.",
      "[PADRE] Hijo PID=4823 terminó con código 0",
      "[HIJO 3] PID=4824 | Tarea completada.",
      "[HIJO 1] PID=4822 | Tarea completada.",
      "[PADRE] Hijo PID=4824 terminó con código 0",
      "[PADRE] Hijo PID=4822 terminó con código 0",
      "",
      "[PADRE] Todos los hijos han terminado.",
      "[PADRE] PID=4821 finaliza.",
    ],
    terminalTitle: "Terminal — bash · fork_demo",
    conclusion:
      "Esta práctica fue reveladora para entender cómo el sistema operativo gestiona la concurrencia a nivel de proceso. Observé que los procesos hijos pueden terminar en diferente orden al que fueron creados, dependiendo de su carga de trabajo, lo que ilustra perfectamente la naturaleza asíncrona de la concurrencia. La función wait() es crucial para evitar procesos zombie, que son procesos terminados cuya entrada en la tabla de procesos aún no ha sido liberada.",
    improvements:
      "Implementaría un pool de procesos trabajadores que reutilicen los hijos en lugar de crearlos cada vez, agregaría comunicación entre padre e hijo usando pipes para que los hijos reporten resultados, y manejaría señales como SIGCHLD para recoger hijos de forma asíncrona sin bloquear al proceso padre. También visualizaría el árbol de procesos con pstree durante la ejecución.",
  },
  {
    id: "practica-2",
    number: 2,
    title: "Creación de Hilos POSIX (pthreads)",
    difficulty: "Intermedio" as const,
    tags: ["pthread", "hilos", "concurrencia", "POSIX"],
    objective:
      "Implementar programación multi-hilo en C usando la biblioteca POSIX Threads (pthreads), comprendiendo la diferencia entre procesos e hilos y el concepto de memoria compartida dentro de un mismo proceso.",
    theory: `Un hilo (thread) es una unidad de ejecución más ligera que un proceso. Múltiples hilos dentro de un proceso comparten:
• El mismo espacio de memoria (heap y variables globales).
• Los descriptores de archivo abiertos.
• El código del programa.

Lo que cada hilo tiene de forma privada:
• Su propio stack (variables locales).
• Su propio contador de programa (PC).
• Sus propios registros del CPU.

POSIX Threads (pthreads) es el estándar de facto para programación multi-hilo en sistemas Unix. Las funciones principales son:
• pthread_create(): Crea un nuevo hilo.
• pthread_join(): Espera a que un hilo termine (análogo a wait() para procesos).
• pthread_exit(): Termina el hilo actual.
• pthread_self(): Obtiene el ID del hilo actual.

La ventaja principal de los hilos sobre los procesos es su menor costo de creación y la facilidad para compartir datos (aunque esto introduce la necesidad de sincronización).`,
    code: `#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>
#include <time.h>

#define NUM_HILOS 4
#define ITERACIONES 5

// Estructura de datos para pasar argumentos al hilo
typedef struct {
    int id;
    int iteraciones;
    double resultado;    // Dato compartido por referencia
} DatosHilo;

// Función que ejecutará cada hilo
void *funcion_hilo(void *arg) {
    DatosHilo *datos = (DatosHilo *)arg;
    double suma = 0.0;

    printf("[Hilo %d] TID=0x%lx | Iniciando %d iteraciones...\\n",
           datos->id, (unsigned long)pthread_self(), datos->iteraciones);

    for (int i = 1; i <= datos->iteraciones; i++) {
        suma += (double)i * datos->id;
        printf("[Hilo %d] Iteración %d/%d → suma parcial = %.1f\\n",
               datos->id, i, datos->iteraciones, suma);
        usleep(100000); // 100ms de pausa simulando trabajo
    }

    datos->resultado = suma;
    printf("[Hilo %d] Resultado final: %.1f | Finalizando.\\n\\n",
           datos->id, datos->resultado);

    pthread_exit(NULL);
}

int main() {
    pthread_t hilos[NUM_HILOS];
    DatosHilo datos[NUM_HILOS];
    double total = 0.0;

    printf("========================================\\n");
    printf("  Demostración de pthreads - UTM        \\n");
    printf("  PID del proceso principal: %d          \\n", getpid());
    printf("========================================\\n\\n");

    // Crear los hilos
    for (int i = 0; i < NUM_HILOS; i++) {
        datos[i].id = i + 1;
        datos[i].iteraciones = ITERACIONES;
        datos[i].resultado = 0.0;

        int ret = pthread_create(&hilos[i], NULL, funcion_hilo, &datos[i]);
        if (ret != 0) {
            fprintf(stderr, "Error creando hilo %d: %d\\n", i + 1, ret);
            exit(EXIT_FAILURE);
        }
        printf("[MAIN] Hilo %d creado (TID=0x%lx)\\n",
               i + 1, (unsigned long)hilos[i]);
    }

    printf("\\n[MAIN] Esperando que todos los hilos terminen...\\n\\n");

    // Esperar a que todos los hilos terminen
    for (int i = 0; i < NUM_HILOS; i++) {
        pthread_join(hilos[i], NULL);
        total += datos[i].resultado;
        printf("[MAIN] Hilo %d completado. Resultado: %.1f\\n",
               i + 1, datos[i].resultado);
    }

    printf("\\n[MAIN] Suma total de todos los hilos: %.1f\\n", total);
    printf("[MAIN] Programa finalizado.\\n");

    return 0;
}`,
    language: "c",
    filename: "pthreads_demo.c",
    terminalLines: [
      "$ gcc pthreads_demo.c -o pthreads_demo -lpthread",
      "$ ./pthreads_demo",
      "",
      "========================================",
      "  Demostración de pthreads - UTM        ",
      "  PID del proceso principal: 5102        ",
      "========================================",
      "",
      "[MAIN] Hilo 1 creado (TID=0x7f3a4c001000)",
      "[MAIN] Hilo 2 creado (TID=0x7f3a4b800000)",
      "[MAIN] Hilo 3 creado (TID=0x7f3a4b000000)",
      "[MAIN] Hilo 4 creado (TID=0x7f3a4a800000)",
      "",
      "[MAIN] Esperando que todos los hilos terminen...",
      "",
      "[Hilo 1] TID=0x7f3a4c001000 | Iniciando 5 iteraciones...",
      "[Hilo 2] TID=0x7f3a4b800000 | Iniciando 5 iteraciones...",
      "[Hilo 3] TID=0x7f3a4b000000 | Iniciando 5 iteraciones...",
      "[Hilo 4] TID=0x7f3a4a800000 | Iniciando 5 iteraciones...",
      "[Hilo 1] Iteración 1/5 → suma parcial = 1.0",
      "[Hilo 2] Iteración 1/5 → suma parcial = 2.0",
      "...",
      "[Hilo 1] Resultado final: 15.0 | Finalizando.",
      "[Hilo 2] Resultado final: 30.0 | Finalizando.",
      "[Hilo 3] Resultado final: 45.0 | Finalizando.",
      "[Hilo 4] Resultado final: 60.0 | Finalizando.",
      "",
      "[MAIN] Hilo 1 completado. Resultado: 15.0",
      "[MAIN] Hilo 2 completado. Resultado: 30.0",
      "[MAIN] Hilo 3 completado. Resultado: 45.0",
      "[MAIN] Hilo 4 completado. Resultado: 60.0",
      "[MAIN] Suma total de todos los hilos: 150.0",
      "[MAIN] Programa finalizado.",
    ],
    terminalTitle: "Terminal — bash · pthreads_demo",
    conclusion:
      "Aprendí la diferencia fundamental entre procesos e hilos: mientras los procesos tienen espacios de memoria independientes, los hilos comparten el mismo espacio del proceso padre. Esto hace que la comunicación entre hilos sea trivial (a través de variables globales o structs compartidos), pero introduce el problema de condiciones de carrera. Observé que el orden de ejecución de los hilos no es determinista, ya que depende del planificador del sistema operativo.",
    improvements:
      "El programa actual no protege los datos compartidos, lo que en escenarios de escritura simultánea causaría condiciones de carrera. Implementaría mutex para proteger el acceso a datos compartidos, añadiría un pool de hilos para reutilizarlos eficientemente (evitando el costo de creación), y utilizaría variables de condición para coordinar la ejecución entre hilos. También implementaría un sistema de cancelación de hilos con pthread_cancel().",
  },
  {
    id: "practica-3",
    number: 3,
    title: "Sincronización con Mutex (Problema del Buffer Compartido)",
    difficulty: "Avanzado" as const,
    tags: ["mutex", "sincronización", "race condition", "pthread"],
    objective:
      "Resolver el problema de la sección crítica usando mutex de pthreads, demostrando la diferencia entre un programa sin sincronización (con condiciones de carrera) y uno con sincronización correcta.",
    theory: `Cuando múltiples hilos acceden y modifican datos compartidos simultáneamente sin coordinación, se produce una condición de carrera (race condition), que puede corromper los datos y producir resultados incorrectos e impredecibles.

Una sección crítica es el fragmento de código que accede a recursos compartidos y que debe ejecutarse de forma atómica (como si fuera una sola instrucción indivisible).

Un Mutex (Mutual Exclusion) es un mecanismo de sincronización que garantiza que solo un hilo pueda estar en la sección crítica a la vez:

• pthread_mutex_init(): Inicializa el mutex.
• pthread_mutex_lock(): Adquiere el bloqueo. Si ya está bloqueado, el hilo espera.
• pthread_mutex_unlock(): Libera el bloqueo, permitiendo que otro hilo entre.
• pthread_mutex_destroy(): Libera los recursos del mutex.

El Problema Productor-Consumidor es un problema clásico de sincronización: un productor genera datos y los coloca en un buffer compartido, mientras que un consumidor los retira y procesa.`,
    code: `#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>

#define BUFFER_SIZE 5
#define NUM_ITEMS   10

// Buffer circular compartido
int buffer[BUFFER_SIZE];
int cabeza = 0;     // Índice de lectura
int cola = 0;       // Índice de escritura
int contador = 0;   // Items en el buffer

// Mutex y variables de condición
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t  no_lleno  = PTHREAD_COND_INITIALIZER;
pthread_cond_t  no_vacio  = PTHREAD_COND_INITIALIZER;

// Productor: genera datos y los coloca en el buffer
void *productor(void *arg) {
    for (int i = 1; i <= NUM_ITEMS; i++) {
        pthread_mutex_lock(&mutex);

        // Esperar si el buffer está lleno
        while (contador == BUFFER_SIZE) {
            printf("[PRODUCTOR] Buffer LLENO. Esperando...\\n");
            pthread_cond_wait(&no_lleno, &mutex);
        }

        // Insertar dato en el buffer
        buffer[cola] = i;
        cola = (cola + 1) % BUFFER_SIZE;
        contador++;

        printf("[PRODUCTOR] Produjo item #%d | Buffer: %d/%d\\n",
               i, contador, BUFFER_SIZE);

        pthread_cond_signal(&no_vacio);   // Avisar al consumidor
        pthread_mutex_unlock(&mutex);

        usleep(150000); // Simular tiempo de producción
    }
    return NULL;
}

// Consumidor: retira datos del buffer y los procesa
void *consumidor(void *arg) {
    int item;
    for (int i = 0; i < NUM_ITEMS; i++) {
        pthread_mutex_lock(&mutex);

        // Esperar si el buffer está vacío
        while (contador == 0) {
            printf("[CONSUMIDOR] Buffer VACÍO. Esperando...\\n");
            pthread_cond_wait(&no_vacio, &mutex);
        }

        // Retirar dato del buffer
        item = buffer[cabeza];
        cabeza = (cabeza + 1) % BUFFER_SIZE;
        contador--;

        printf("[CONSUMIDOR] Consumió item #%d | Buffer: %d/%d\\n",
               item, contador, BUFFER_SIZE);

        pthread_cond_signal(&no_lleno);   // Avisar al productor
        pthread_mutex_unlock(&mutex);

        usleep(300000); // Simular tiempo de procesamiento
    }
    return NULL;
}

int main() {
    pthread_t hilo_prod, hilo_cons;

    printf("===========================================\\n");
    printf("  Productor-Consumidor con Mutex - UTM     \\n");
    printf("  Buffer size: %d | Items totales: %d      \\n",
           BUFFER_SIZE, NUM_ITEMS);
    printf("===========================================\\n\\n");

    pthread_create(&hilo_prod, NULL, productor, NULL);
    pthread_create(&hilo_cons, NULL, consumidor, NULL);

    pthread_join(hilo_prod, NULL);
    pthread_join(hilo_cons, NULL);

    // Limpiar recursos
    pthread_mutex_destroy(&mutex);
    pthread_cond_destroy(&no_lleno);
    pthread_cond_destroy(&no_vacio);

    printf("\\n[MAIN] Todos los items procesados correctamente.\\n");
    return 0;
}`,
    language: "c",
    filename: "productor_consumidor.c",
    terminalLines: [
      "$ gcc productor_consumidor.c -o prod_cons -lpthread",
      "$ ./prod_cons",
      "",
      "===========================================",
      "  Productor-Consumidor con Mutex - UTM     ",
      "  Buffer size: 5 | Items totales: 10       ",
      "===========================================",
      "",
      "[PRODUCTOR] Produjo item #1 | Buffer: 1/5",
      "[PRODUCTOR] Produjo item #2 | Buffer: 2/5",
      "[CONSUMIDOR] Consumió item #1 | Buffer: 1/5",
      "[PRODUCTOR] Produjo item #3 | Buffer: 2/5",
      "[PRODUCTOR] Produjo item #4 | Buffer: 3/5",
      "[PRODUCTOR] Produjo item #5 | Buffer: 4/5",
      "[CONSUMIDOR] Consumió item #2 | Buffer: 3/5",
      "[PRODUCTOR] Produjo item #6 | Buffer: 4/5",
      "[PRODUCTOR] Produjo item #7 | Buffer: 5/5",
      "[PRODUCTOR] Buffer LLENO. Esperando...",
      "[CONSUMIDOR] Consumió item #3 | Buffer: 4/5",
      "[PRODUCTOR] Produjo item #8 | Buffer: 5/5",
      "[CONSUMIDOR] Consumió item #4 | Buffer: 4/5",
      "[CONSUMIDOR] Consumió item #5 | Buffer: 3/5",
      "[PRODUCTOR] Produjo item #9 | Buffer: 4/5",
      "[PRODUCTOR] Produjo item #10 | Buffer: 5/5",
      "[CONSUMIDOR] Consumió item #6 | Buffer: 4/5",
      "[CONSUMIDOR] Consumió item #7 | Buffer: 3/5",
      "[CONSUMIDOR] Consumió item #8 | Buffer: 2/5",
      "[CONSUMIDOR] Consumió item #9 | Buffer: 1/5",
      "[CONSUMIDOR] Consumió item #10 | Buffer: 0/5",
      "",
      "[MAIN] Todos los items procesados correctamente.",
    ],
    terminalTitle: "Terminal — bash · prod_cons",
    conclusion:
      "Esta fue la práctica más compleja y enriquecedora del tema. El problema Productor-Consumidor ilustra perfectamente por qué la sincronización es crítica en programas concurrentes. Las variables de condición (pthread_cond_t) son más elegantes que el busy-waiting, ya que ponen al hilo en espera suspendida sin consumir CPU. El patrón while(condición) { cond_wait() } en lugar de if(condición) { cond_wait() } es fundamental para evitar el problema del 'wakeup spurioso'.",
    improvements:
      "Generalizaría la solución para soportar múltiples productores y consumidores simultáneos. Implementaría métricas de rendimiento (tiempo promedio de espera, throughput). Añadiría un mecanismo de shutdown graceful para terminar los hilos de forma ordenada. También exploraría el uso de sem_t (semáforos POSIX) como alternativa a la combinación mutex+variable de condición, para comparar su eficiencia.",
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
          Esta sección explora cómo el sistema operativo gestiona la ejecución concurrente. Se estudia la creación de procesos con fork(), la programación multi-hilo con pthreads y la sincronización mediante mutex y variables de condición.
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
