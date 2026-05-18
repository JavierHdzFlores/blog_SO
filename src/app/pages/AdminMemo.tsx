import { Network } from "lucide-react";
import { PracticeCard } from "../components/PracticeCard";

const practices = [
  // ─────────────────────────────────────────────────────────────────
  // 5.1 Introducción 
  // ─────────────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────
  // 5.1 Introducción a la Administración de Memoria
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-5-1",
    number: 6,
    title: "5.1 Introducción",
    difficulty: "Básico" as const,
    tags: ["memoria", "paginación", "segmentación", "sysconf", "getpagesize", "kernel"],
    objective:
      "Comprender la importancia de la gestión de memoria principal en los sistemas operativos modernos, diferenciar entre los esquemas de paginación y segmentación, y aprender a consultar el tamaño de página del sistema operativo mediante C.",
    theory: `La administración de memoria es una de las responsabilidades más complejas y críticas del sistema operativo. Consiste en gestionar la memoria RAM como un recurso limitado que debe distribuirse de forma óptima entre todos los procesos activos que compiten por ella.

Funciones clave del Administrador de Memoria:
• Monitoreo de estado: Supervisa constantemente qué regiones de la memoria física están asignadas y cuáles permanecen libres.
• Asignación dinámica: Concede espacio a los procesos cuando lo solicitan y lo libera de inmediato al terminar su ciclo de vida.
• Mecanismo de Intercambio (Swapping): Coordina la transferencia de datos entre la memoria principal y el almacenamiento secundario (disco duro/SSD) cuando la RAM se satura y no puede albergar a todos los procesos.

Estrategias fundamentales de organización:
• Paginación: Segmenta el espacio de memoria en bloques de tamaño fijo y uniforme denominados páginas.
• Segmentación: Divide la memoria en bloques lógicos de longitud variable que se adaptan a las necesidades específicas de la estructura del programa.
• Modelos Híbridos: Combinan las ventajas operativas de ambos enfoques en un único esquema de gestión.



El Tamaño de Página del Sistema:
Por regla general, en arquitecturas x86 y x86-64, la unidad mínima de transferencia y mapeo (controlada por la Tabla de Páginas o PTE) es de 4 KB (4096 bytes). Puedes consultar este valor desde la consola ejecutando \`getconf PAGESIZE\`. 

Para escenarios de alto rendimiento que manejan enormes volúmenes de datos, Linux implementa *HugePages* (de 2 MB hasta 1 GB), reduciendo los fallos en el buffer de traducción anticipada (TLB).

Llamadas del sistema en lenguaje C para obtener este parámetro:
• \`long sysconf(int name);\` (Llamada estándar POSIX portable mediante la bandera \`_SC_PAGESIZE\`).
• \`int getpagesize(void);\` (Función heredada de BSD, comúnmente disponible en entornos GNU/Linux).`,
    code: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(void) {
    /* * El tamaño de página define la granularidad con la que el kernel 
     * mapea la memoria virtual a la memoria física.
     */
    
    printf("Determinando el tamaño de página del sistema:\\n");
    printf("--------------------------------------------------\\n");
    
    /* Método 1: Usando la llamada estándar POSIX sysconf */
    printf("Tamaño de página (sysconf)    : %d bytes\\n", (int)sysconf(_SC_PAGESIZE));
    
    /* Método 2: Usando la función tradicional getpagesize */
    printf("Tamaño de página (getpagesize): %d bytes\\n", (int)getpagesize());
    
    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "pagesize_demo.c",
    terminalLines: [
      "$ getconf PAGESIZE",
      "4096",
      "$ gcc pagesize_demo.c -o pagesize_demo",
      "$ ./pagesize_demo",
      "Determinando el tamaño de página del sistema:",
      "--------------------------------------------------",
      "Tamaño de página (sysconf)    : 4096 bytes",
      "Tamaño de página (getpagesize): 4096 bytes",
    ],
    terminalTitle: "Terminal — bash · pagesize_demo",
    conclusion:
      "La memoria RAM no se asigna byte por byte, sino en bloques fijos denominados páginas. Conocer el tamaño de página (normalmente 4 KB) es fundamental, ya que representa el tamaño de bloque sobre el cual operan mecanismos avanzados como la memoria virtual, las llamadas de mapeo mmap() y la protección de memoria a nivel de hardware.",
    improvements:
      "Investigar cómo cambia el comportamiento y el rendimiento de un programa al realizar operaciones de lectura/escritura alineadas exactamente al tamaño de página del sistema. Consultar el archivo /proc/meminfo para verificar si el sistema operativo tiene HugePages activas.",
  },
  // ─────────────────────────────────────────────────────────────────
  // 5.2 Administración de memoria sin intercambio o paginación
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-5-2",
    number: 7,
    title: "5.2 Administración de memoria sin intercambio o paginación",
    difficulty: "Básico" as const,
    tags: ["monoprogramación", "segmentación-estática", "memoria-física", "sin-intercambio"],
    objective:
      "Comprender el funcionamiento del esquema de monoprogramación, identificando las limitaciones de los sistemas que no implementan intercambio (swapping) ni paginación, y observar cómo se distribuye un único proceso en el espacio de memoria física.",
    theory: `Los sistemas de gestión de memoria se dividen fundamentalmente en dos grandes categorías según su comportamiento durante el tiempo de ejecución:
• Sistemas con intercambio/paginación: Trasladan dinámicamente fragmentos de procesos (o procesos enteros) entre la memoria principal (RAM) y el almacenamiento secundario (disco) para optimizar el espacio.
• Sistemas sin intercambio/paginación: Mantienen los procesos fijos en la RAM desde que inician hasta que concluyen. No realizan movimientos hacia el disco durante su ejecución.

El modelo más primitivo y elemental dentro de esta última categoría es la monoprogramación (o uniprogramación). Bajo este enfoque, el sistema operativo permite que únicamente un proceso de usuario se ejecute en el sistema en un instante dado. 



Características principales del modelo:
• Exclusividad absoluta: Toda la memoria disponible en el equipo se reparte estrictamente entre el propio núcleo del sistema operativo y el único programa de usuario en ejecución.
• Flujo secuencial: Si un usuario desea ejecutar un nuevo programa, el proceso actual debe finalizar por completo y liberar toda la RAM asignada antes de dar paso al siguiente.
• Organizaciones típicas de memoria:
  1. El Sistema Operativo se aloja en la parte baja de la RAM (direcciones iniciales) y el programa del usuario arriba.
  2. El Sistema Operativo se ubica en memoria ROM (en la parte alta del direccionamiento) y el programa de usuario en la RAM abajo (esquema clásico de sistemas embebidos antiguos).
  3. Los controladores de dispositivos se quedan en ROM arriba, el SO en RAM abajo, y el programa del usuario en medio (modelo tipo MS-DOS).`,
    code: `#include <stdio.h>
#include <stdlib.h>

/* Variable global: Se almacena en el segmento de Datos/BSS */
int variable_global = 100;

int main(void) {
    /* Variable local: Se almacena en el segmento de Pila (Stack) */
    int variable_pila = 5;
    
    /* Memoria dinámica: Se aloja en el segmento del Montículo (Heap) */
    int *variable_heap = (int *)malloc(sizeof(int));
    if (variable_heap == NULL) {
        perror("Error al asignar memoria");
        return EXIT_FAILURE;
    }
    *variable_heap = 500;

    /* En un sistema de monoprogramación pura, este mapa de direcciones 
     * virtuales correspondería directamente a las posiciones físicas de la RAM, 
     * ya que el proceso es dueño absoluto de todo el espacio de usuario.
     */
    printf("Mapa de segmentos del proceso actual (Dueño de la memoria):\\n");
    printf("-------------------------------------------------------------\\n");
    printf("Dirección del código fuente (Texto)   : %p\\n", (void *)&main);
    printf("Dirección de la variable global (Datos): %p\\n", (void *)&variable_global);
    printf("Dirección en el Montículo (Heap)      : %p\\n", (void *)variable_heap);
    printf("Dirección en la Pila (Stack)          : %p\\n", (void *)&variable_pila);

    /* Liberación del recurso */
    free(variable_heap);
    
    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "monoprogramacion_demo.c",
    terminalLines: [
      "$ gcc monoprogramacion_demo.c -o monoprogramacion_demo",
      "$ ./monoprogramacion_demo",
      "Mapa de segmentos del proceso actual (Dueño de la memoria):",
      "-------------------------------------------------------------",
      "Dirección del código fuente (Texto)   : 0x5555555551a9",
      "Dirección de la variable global (Datos): 0x555555558010",
      "Dirección en el Montículo (Heap)      : 0x5555555592a0",
      "Dirección en la Pila (Stack)          : 0x7fffffffdc44",
    ],
    terminalTitle: "Terminal — bash · monoprogramacion_demo",
    conclusion:
      "La administración de memoria sin intercambio ofrece una simplicidad absoluta para el hardware y el kernel, pero penaliza drásticamente el rendimiento global del equipo. Al no existir concurrencia, si el proceso único se detiene a esperar una operación de Entrada/Salida (E/S), la CPU se queda completamente ociosa, desperdiciando valioso tiempo de cómputo.",
    improvements:
      "Analizar cómo sistemas operativos antiguos (como MS-DOS) lidiaban con la falta de protección de memoria, permitiendo que un programa malicioso o con errores sobrescribiera accidentalmente las rutinas del propio sistema operativo. Investigar en qué dispositivos modernos (microcontroladores, IoT) se sigue utilizando este modelo sin intercambio por cuestiones de recursos mínimos.",
  },
];

export function AdminMemo() {
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
              Tema 5 · 5 Prácticas
            </p>
            <h1
              className="text-foreground"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.75rem", fontWeight: 700 }}
            >
              Administración de memoria
            </h1>
          </div>
        </div>
        <p
          className="text-muted-foreground leading-relaxed max-w-2xl"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
            Uso de paginación y segmentación de la memoria para usar de manera eficiente un recurso tan valioso como lo es la memoria 
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