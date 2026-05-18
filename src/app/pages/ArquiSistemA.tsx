import { Terminal } from "lucide-react";
import { PracticeCard } from "../components/PracticeCard";

const practices = [
   // ─────────────────────────────────────────────────────────────────
  // 6.1 Introducción
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-6-1",
    number: 1,
    title: "6.1 Introducción",
    difficulty: "Básico" as const,
    tags: ["sistema de archivos", "UNIX", "estructura jerárquica", "números de dispositivo", "driver", "kernel"],
    objective:
      "Conocer las características fundamentales del sistema de archivos de UNIX (estructura jerárquica, protección, manejo dinámico) y comprender cómo el kernel trabaja a nivel lógico mediante números de dispositivo mayor/menor y controladores (drivers).",
    theory: `El sistema de archivos de UNIX posee las siguientes características:

• Estructura jerárquica: organización en árbol de directorios y archivos, con una raíz (/) y rutas absolutas/relativas.
• Consistencia y protección de datos: mediante permisos (lectura, escritura, ejecución) y propietarios, más mecanismos como journaling o fsck para mantener la integridad.
• Creación y eliminación de archivos: llamadas al sistema como open, creat, unlink, rmdir, etc.
• Manejo dinámico de los archivos: posibilidad de crecer, truncarse, moverse, enlazarse (enlaces duros y simbólicos).

El kernel trabaja con el sistema de archivos a un nivel lógico y no trata directamente con los discos a nivel físico. Cada dispositivo (disco duro, partición, pendrive, etc.) es considerado como un dispositivo lógico que tiene asociado números de dispositivo llamados número mayor y número menor.

• Número mayor (major): identifica el tipo de dispositivo o el controlador (driver) a usar. Por ejemplo, 8 para discos SCSI/SATA, 259 para dispositivos de bloque modernos.
• Número menor (minor): identifica la unidad o partición específica dentro de ese controlador.

Estos números se utilizan como indexación de una tabla de funciones para manejar el controlador (driver) del dispositivo. Dicho controlador se encarga de transformar las direcciones lógicas del sistema de archivos (inodos, bloques) a direcciones físicas del disco (cilindros, cabezas, sectores, o direcciones LBA). Así, el kernel presenta una interfaz uniforme (archivos, directorios, operaciones read/write) independientemente del hardware subyacente.

En Linux, los números de dispositivo se pueden consultar con ls -l /dev/ (los dos números separados por coma en lugar del tamaño) o mediante las macros major() y minor() definidas en <sys/sysmacros.h>. El directorio /dev contiene los archivos especiales que representan dispositivos, y /sys/class/ proporciona información jerárquica sobre ellos.`,
    code: `/* Consulta de números de dispositivo y atributos de un archivo especial */
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <sys/sysmacros.h>  /* para major() y minor() */

int main(int argc, char *argv[]) {
    struct stat st;

    if (argc != 2) {
        fprintf(stderr, "Uso: %s <archivo_o_dispositivo>\n", argv[0]);
        exit(EXIT_FAILURE);
    }

    if (stat(argv[1], &st) == -1) {
        perror("stat");
        exit(EXIT_FAILURE);
    }

    printf("Archivo: %s\n", argv[1]);
    printf("Tamaño: %ld bytes\n", st.st_size);
    printf("Número de inodo: %lu\n", (unsigned long) st.st_ino);
    printf("Modo (permisos): %o\n", st.st_mode & 0777);

    if (S_ISBLK(st.st_mode)) {
        printf("Tipo: dispositivo de bloque\n");
        printf("Número mayor: %u\n", major(st.st_rdev));
        printf("Número menor: %u\n", minor(st.st_rdev));
    } else if (S_ISCHR(st.st_mode)) {
        printf("Tipo: dispositivo de caracteres\n");
        printf("Número mayor: %u\n", major(st.st_rdev));
        printf("Número menor: %u\n", minor(st.st_rdev));
    } else if (S_ISREG(st.st_mode)) {
        printf("Tipo: archivo regular\n");
    } else if (S_ISDIR(st.st_mode)) {
        printf("Tipo: directorio\n");
    } else {
        printf("Tipo: otro (FIFO, socket, etc.)\n");
    }

    return 0;
}`,
    language: "c",
    filename: "dev_major_minor.c",
    terminalLines: [
      "$ gcc dev_major_minor.c -o dev_major_minor",
      "$ ./dev_major_minor /dev/sda",
      "Archivo: /dev/sda",
      "Tamaño: 0 bytes",
      "Número de inodo: 12345",
      "Modo (permisos): 660",
      "Tipo: dispositivo de bloque",
      "Número mayor: 8",
      "Número menor: 0",
      "",
      "$ ./dev_major_minor /dev/tty",
      "Archivo: /dev/tty",
      "Tamaño: 0 bytes",
      "Número de inodo: 6789",
      "Modo (permisos): 620",
      "Tipo: dispositivo de caracteres",
      "Número mayor: 5",
      "Número menor: 0",
      "",
      "$ ./dev_major_minor /etc/passwd",
      "Archivo: /etc/passwd",
      "Tamaño: 2345 bytes",
      "Número de inodo: 98765",
      "Modo (permisos): 644",
      "Tipo: archivo regular"
    ],
    terminalTitle: "Terminal — bash · dev_major_minor",
    conclusion:
      "La introducción al sistema de archivos de UNIX destaca su estructura jerárquica, protección y manejo dinámico. El kernel abstrae los detalles físicos mediante números de dispositivo mayor/menor y controladores, permitiendo una interfaz uniforme (archivos, directorios) independientemente del hardware. Comprender los números de dispositivo es esencial para administrar discos, particiones y periféricos, así como para programar controladores o manipular dispositivos desde espacio de usuario.",
    improvements:
      "Explorar el directorio /sys/block/ para ver la relación entre dispositivos y sus números mayor/menor. Usar el comando 'udevadm info --query=all --name=/dev/sda' para obtener información detallada de dispositivos. Implementar un programa que liste todos los dispositivos de bloque en /dev y muestre sus números. Investigar cómo se asignan dinámicamente los números mayores en Linux (dispositivos asignables, device mapper)."
  },
    // ─────────────────────────────────────────────────────────────────
  // 6.2 Estructura lógica del sistema de archivos
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-6-2",
    number: 2,
    title: "6.2 Estructura lógica del sistema de archivos",
    difficulty: "Intermedio" as const,
    tags: ["superbloque", "inodos", "bloques de datos", "boot", "sistema de archivos", "estructura lógica", "ext2", "ext4"],
    objective:
      "Comprender la organización lógica de un sistema de archivos UNIX/Linux, identificando las cuatro secciones principales: bloque de arranque (boot), superbloque, lista de inodos y bloque de datos.",
    theory: `La estructura lógica de un sistema de archivos UNIX/Linux se divide en cuatro secciones principales:

1. Boot (bloque de arranque). Se localiza típicamente en el primer sector del dispositivo (sector 0). Puede contener el código de arranque del sistema operativo. Este código es un pequeño programa que se encarga de buscar el sistema operativo y cargarlo en memoria para inicializarlo. En sistemas con múltiples particiones, solo la partición activa suele tener un código de arranque válido.

2. Superbloque. Describe el estado del sistema de archivos. Almacena metadatos globales como:
   - Tamaño total del sistema de archivos (en bloques)
   - Número total de inodos
   - Número de bloques libres y ocupados
   - Número de inodos libres
   - Marca de limpieza (indicador de si el sistema de archivos está montado correctamente)
   - Fecha de última montura y última escritura
   - Punteros a listas de bloques libres
   - Tamaño del bloque (generalmente 1K, 2K, 4K, etc.)

3. Lista de nodos índice (inodos). Esta lista tiene una entrada (inodo) por cada archivo o directorio. Cada inodo contiene:
   - Tipo de archivo (regular, directorio, dispositivo, FIFO, socket, etc.)
   - Permisos (modo de acceso)
   - Número de enlaces (hard links)
   - ID del propietario (UID) y del grupo (GID)
   - Tamaño en bytes
   - Fechas: último acceso (atime), última modificación (mtime), último cambio de inodo (ctime)
   - Punteros a los bloques de datos (directos, indirectos simples, dobles y triples)

4. Bloque de datos. En esta área se encuentra el contenido real de los archivos a los que hacen referencia los inodos. Los bloques de datos son fragmentos de tamaño fijo (igual al tamaño de bloque definido en el superbloque). Los directorios son archivos especiales que contienen listas de nombres de archivo y sus correspondientes números de inodo.

Esta organización es la base de sistemas de archivos clásicos como ext2, ext3 y ext4, aunque estos últimos añaden características adicionales como journaling y extents.`,
    code: `/* Programa que simula la estructura lógica de un sistema de archivos
   y muestra información del superbloque y los inodos desde un archivo real */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <time.h>

/* Definiciones para simular la estructura de un sistema de archivos simplificado */
#define MAX_INODOS 128
#define MAX_BLOQUES 1024
#define TAM_BLOQUE 1024   /* 1 KB */
#define TAM_INODO 128     /* bytes por inodo (simplificado) */

/* Estructura de un inodo simplificado */
typedef struct {
    unsigned int mode;        /* tipo y permisos */
    unsigned int uid;         /* propietario */
    unsigned int gid;         /* grupo */
    unsigned int size;        /* tamaño en bytes */
    unsigned int atime;       /* último acceso (timestamp) */
    unsigned int mtime;       /* última modificación */
    unsigned int ctime;       /* último cambio de inodo */
    unsigned int blocks[10];  /* punteros a bloques (simplificado) */
} inodo_t;

/* Estructura del superbloque simplificada */
typedef struct {
    unsigned int total_inodos;
    unsigned int free_inodos;
    unsigned int total_bloques;
    unsigned int free_bloques;
    unsigned int tam_bloque;
    unsigned int clean_flag;   /* 1 = limpio, 0 = sucio */
} superbloque_t;

/* Función para mostrar atributos de un archivo real (similar a leer su inodo) */
void mostrar_inodo_real(const char *path) {
    struct stat st;
    if (stat(path, &st) == -1) {
        perror("stat");
        return;
    }

    printf("Inodo real para: %s\n", path);
    printf("  Tipo: ");
    if (S_ISREG(st.st_mode)) printf("archivo regular\n");
    else if (S_ISDIR(st.st_mode)) printf("directorio\n");
    else if (S_ISBLK(st.st_mode)) printf("dispositivo de bloque\n");
    else if (S_ISCHR(st.st_mode)) printf("dispositivo de caracteres\n");
    else if (S_ISFIFO(st.st_mode)) printf("FIFO/pipe\n");
    else if (S_ISLNK(st.st_mode)) printf("enlace simbólico\n");
    else printf("desconocido\n");

    printf("  Permisos: %o\n", st.st_mode & 0777);
    printf("  Número de enlaces: %lu\n", (unsigned long)st.st_nlink);
    printf("  Propietario UID: %d, GID: %d\n", st.st_uid, st.st_gid);
    printf("  Tamaño: %ld bytes\n", (long)st.st_size);
    printf("  Último acceso (atime): %s", ctime(&st.st_atime));
    printf("  Última modificación (mtime): %s", ctime(&st.st_mtime));
    printf("  Último cambio de inodo (ctime): %s", ctime(&st.st_ctime));
    printf("  Número de inodo: %lu\n\n", (unsigned long)st.st_ino);
}

int main() {
    /* Simulación de la estructura lógica */
    printf("=== Estructura lógica de un sistema de archivos ===\n\n");
    printf("1. Boot block:\n");
    printf("   Primer sector, código de arranque (no accesible directamente).\n\n");

    printf("2. Superbloque (simulado):\n");
    superbloque_t sb;
    sb.total_inodos = MAX_INODOS;
    sb.free_inodos = MAX_INODOS - 10;
    sb.total_bloques = MAX_BLOQUES;
    sb.free_bloques = MAX_BLOQUES - 150;
    sb.tam_bloque = TAM_BLOQUE;
    sb.clean_flag = 1;
    printf("   Total inodos: %u\n", sb.total_inodos);
    printf("   Inodos libres: %u\n", sb.free_inodos);
    printf("   Total bloques: %u\n", sb.total_bloques);
    printf("   Bloques libres: %u\n", sb.free_bloques);
    printf("   Tamaño de bloque: %u bytes\n", sb.tam_bloque);
    printf("   Estado: %s\n\n", sb.clean_flag ? "limpio" : "sucio");

    printf("3. Lista de inodos (simulación de los primeros inodos):\n");
    inodo_t inodos[MAX_INODOS];
    memset(inodos, 0, sizeof(inodos));
    /* Configurar un inodo para un archivo simulado */
    inodos[1].mode = 0100644;  /* archivo regular con permisos 644 */
    inodos[1].uid = 1000;
    inodos[1].gid = 1000;
    inodos[1].size = 2048;
    inodos[1].blocks[0] = 200;
    inodos[1].blocks[1] = 201;
    printf("   Inodo 1: archivo regular, tamaño=%u, bloques=%u, %u\n",
           inodos[1].size, inodos[1].blocks[0], inodos[1].blocks[1]);
    inodos[2].mode = 0040755;  /* directorio */
    inodos[2].size = 4096;
    printf("   Inodo 2: directorio, tamaño=%u\n\n", inodos[2].size);

    printf("4. Bloque de datos:\n");
    printf("   Contiene el contenido de los archivos (datos, directorios).\n");
    printf("   Ejemplo: bloque %u (datos del inodo 1), bloque %u, etc.\n\n",
           inodos[1].blocks[0], inodos[1].blocks[1]);

    /* Mostrar inodo de un archivo real del sistema */
    printf("=== Ejemplo con un archivo real ===\n");
    mostrar_inodo_real("/etc/passwd");
    mostrar_inodo_real("/dev/sda");

    return 0;
}`,
    language: "c",
    filename: "filesystem_structure.c",
    terminalLines: [
      "$ gcc filesystem_structure.c -o fs_structure",
      "$ ./fs_structure",
      "=== Estructura lógica de un sistema de archivos ===",
      "",
      "1. Boot block:",
      "   Primer sector, código de arranque (no accesible directamente).",
      "",
      "2. Superbloque (simulado):",
      "   Total inodos: 128",
      "   Inodos libres: 118",
      "   Total bloques: 1024",
      "   Bloques libres: 874",
      "   Tamaño de bloque: 1024 bytes",
      "   Estado: limpio",
      "",
      "3. Lista de inodos (simulación de los primeros inodos):",
      "   Inodo 1: archivo regular, tamaño=2048, bloques=200, 201",
      "   Inodo 2: directorio, tamaño=4096",
      "",
      "4. Bloque de datos:",
      "   Contiene el contenido de los archivos (datos, directorios).",
      "   Ejemplo: bloque 200 (datos del inodo 1), bloque 201, etc.",
      "",
      "=== Ejemplo con un archivo real ===",
      "Inodo real para: /etc/passwd",
      "  Tipo: archivo regular",
      "  Permisos: 644",
      "  Número de enlaces: 1",
      "  Propietario UID: 0, GID: 0",
      "  Tamaño: 2345 bytes",
      "  Último acceso (atime): Mon Jan 15 10:30:00 2025",
      "  Última modificación (mtime): Mon Jan 15 09:20:00 2025",
      "  Último cambio de inodo (ctime): Mon Jan 15 09:20:00 2025",
      "  Número de inodo: 123456",
      "",
      "Inodo real para: /dev/sda",
      "  Tipo: dispositivo de bloque",
      "  Permisos: 660",
      "  Número de enlaces: 1",
      "  Propietario UID: 0, GID: 6",
      "  Tamaño: 0 bytes",
      "  Número de inodo: 78901"
    ],
    terminalTitle: "Terminal — bash · fs_structure",
    conclusion:
      "La estructura lógica de un sistema de archivos UNIX se organiza en cuatro áreas fundamentales: bloque de arranque (boot), superbloque (metadatos globales), lista de inodos (metadatos por archivo) y bloque de datos (contenido). Esta separación permite una gestión eficiente del espacio, recuperación de datos y protección. Los inodos contienen toda la información de un archivo excepto su nombre (que se almacena en los directorios). Comprender esta estructura es clave para administrar discos, reparar sistemas de archivos dañados y diseñar sistemas de archivos propios.",
    improvements:
      "Implementar una mini herramienta que recorra el superbloque y la lista de inodos de una imagen de sistema de archivos ext2 (usando un archivo de imagen). Usar el comando 'debugfs' para explorar inodos y bloques de un sistema ext4. Escribir un programa que lea el superbloque directamente de un dispositivo usando lectura de bajo nivel (open/read). Investigar la estructura ext4 más moderna (extents, journal, etc.)."
  },
    // ─────────────────────────────────────────────────────────────────
  // 6.2.1 El superbloque
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-6-2-1",
    number: 3,
    title: "6.2.1 El superbloque",
    difficulty: "Intermedio" as const,
    tags: ["superbloque", "sync", "syncfs", "mount", "umount", "statvfs", "fstatvfs", "sistema de archivos", "metadatos"],
    objective:
      "Comprender la información que almacena el superbloque de un sistema de archivos, las funciones para sincronizar metadatos (sync, syncfs), montar/desmontar sistemas de archivos (mount, umount) y obtener estadísticas mediante statvfs.",
    theory: `El superbloque contiene, entre otras cosas, la siguiente información:

• Tamaño del sistema de archivos.
• Lista de bloques libres disponibles.
• Índice del siguiente bloque libre en la lista de bloques libres.
• Tamaño de la lista de inodos.
• Total de inodos libres.
• Lista de inodos libres.
• Índice del siguiente inodo libre en la lista de inodos libres.
• Campos de bloqueo de elementos de las listas de bloques libres y de inodos libres (se emplean cuando se realiza una petición de bloqueo o de inodo libre).
• Banderas para indicar si el superbloque ha sido modificado o no.

En la memoria del sistema se cuenta con una copia del superbloque y de la lista de inodos, para realizar de forma eficiente el acceso a los datos en el disco. Existe un demonio (sync o sync_supers) que se encarga de realizar la actualización en disco de los datos de administración que se encuentran en memoria; este demonio se levanta al iniciar el sistema. Antes de apagar el sistema también hay que actualizar el superbloque y las tablas de inodos del disco; el encargado es el programa shutdown.

En GNU/Linux, la función sync() en C hace que todas las modificaciones pendientes de los metadatos del sistema de archivos y los datos de los archivos en caché se escriban en los sistemas de archivos subyacentes. Además existe syncfs(int fd), que sincroniza únicamente el sistema de archivos que contiene el archivo al que hace referencia el descriptor fd.

  #include <unistd.h>
  void sync(void);
  int syncfs(int fd);

syncfs devuelve 0 en éxito; en error, -1 y errno (ej. EBADF si fd no es válido).

Para montar y desmontar sistemas de archivos existen los comandos mount y umount, así como las llamadas al sistema:

  #include <sys/mount.h>
  int mount(const char *source, const char *target,
            const char *filesystemtype, unsigned long mountflags,
            const void *data);
  int umount(const char *target);
  int umount2(const char *target, int flags);

mount añade el sistema de archivos especificado en source (dispositivo o ruta) en el directorio target. Se requiere privilegios (CAP_SYS_ADMIN). filesystemtype admite valores como "ext4", "vfat", "ntfs", etc. (ver /proc/filesystems). umount y umount2 eliminan el montaje.

También se pueden obtener estadísticas de los sistemas de archivos montados mediante statvfs y fstatvfs:

  #include <sys/statvfs.h>
  int statvfs(const char *path, struct statvfs *buf);
  int fstatvfs(int fd, struct statvfs *buf);

La estructura statvfs contiene campos como f_bsize (tamaño de bloque), f_blocks (total bloques), f_bfree (libres), f_bavail (libres para no privilegiados), f_files (total inodos), f_ffree (inodos libres), f_favail, f_fsid, f_flag (banderas de montaje), f_namemax (longitud máxima de nombre). Las banderas incluyen ST_RDONLY (solo lectura), ST_NOSUID (ignorar bits SUID/SGID), ST_NOEXEC (no ejecutar), ST_NOATIME (no actualizar atime), entre otras.`,
    code: `/* Programa para recuperar información del sistema de archivos usando statvfs */
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <sys/types.h>
#include <sys/statvfs.h>

int main() {
    struct statvfs vfs;
    char *ruta = "/";

    if (statvfs(ruta, &vfs) != 0) {
        perror("llamado de statvfs");
        exit(EXIT_FAILURE);
    }

    printf("\tArchivo: %s\n", ruta);
    printf("\tTamaño de bloques: %ld\n", (long) vfs.f_bsize);
    printf("\tTamaño de fragmento: %ld\n", (long) vfs.f_frsize);
    printf("\tTamaño en unidades: %lu\n", (unsigned long) vfs.f_blocks);
    printf("\tBloques libres: %lu\n", (unsigned long) vfs.f_bfree);
    printf("\tBloques disponibles: %lu\n", (unsigned long) vfs.f_bavail);
    printf("\tNúmero de inodos: %lu\n", (unsigned long) vfs.f_files);
    printf("\tNúmero de inodos libres: %lu\n", (unsigned long) vfs.f_ffree);
    printf("\tNúmero de inodos disponibles: %lu\n", (unsigned long) vfs.f_favail);
    printf("\tID del S.A.: %#lx\n", (unsigned long) vfs.f_fsid);
    printf("\tBandera: ");
    if (vfs.f_flag == 0)
        printf("(Ninguna)\n");
    else {
        if ((vfs.f_flag & ST_RDONLY) != 0)
            printf("ST_RDONLY ");
        if ((vfs.f_flag & ST_NOSUID) != 0)
            printf("ST_NOSUID");
        /* Se pueden agregar más banderas según necesidad */
        printf("\n");
    }
    printf("\tLongitud máxima para archivo: %ld\n", (long) vfs.f_namemax);

    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "superblock_statvfs.c",
    terminalLines: [
      "$ gcc superblock_statvfs.c -o superblock_statvfs",
      "$ ./superblock_statvfs",
      "\tArchivo: /",
      "\tTamaño de bloques: 4096",
      "\tTamaño de fragmento: 4096",
      "\tTamaño en unidades: 4096000",
      "\tBloques libres: 1024000",
      "\tBloques disponibles: 950000",
      "\tNúmero de inodos: 2621440",
      "\tNúmero de inodos libres: 2100000",
      "\tNúmero de inodos disponibles: 2100000",
      "\tID del S.A.: 0x12345678",
      "\tBandera: (Ninguna)",
      "\tLongitud máxima para archivo: 255",
      "",
      "# Ejemplo de montaje (comentado, requiere root)",
      "# mount /dev/sdb1 /mnt/disco -t ext4",
      "# umount /mnt/disco"
    ],
    terminalTitle: "Terminal — bash · superblock_statvfs",
    conclusion:
      "El superbloque es el corazón de los metadatos de un sistema de archivos: contiene la lista de bloques libres, lista de inodos libres, tamaño total, etc. Su copia en memoria acelera las operaciones, pero requiere sincronización periódica mediante sync/syncfs y programas como shutdown. Las llamadas mount/umount permiten añadir y quitar sistemas de archivos dinámicamente. Por último, statvfs proporciona estadísticas detalladas (bloques libres, inodos, banderas, etc.) sin necesidad de acceder directamente al superbloque.",
    improvements:
      "Implementar un programa que muestre periódicamente el uso de disco e inodos usando statvfs. Usar syncfs para sincronizar un solo sistema de archivos. Simular un sistema de montaje virtual con mount bind. Investigar la estructura del superbloque ext2/ext4 usando debugfs y herramientas de bajo nivel (dd, losetup)."
  },
    // ─────────────────────────────────────────────────────────────────
  // 6.2.2 Nodos índices (inodos)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-6-2-2",
    number: 4,
    title: "6.2.2 Nodos índices (inodos)",
    difficulty: "Intermedio" as const,
    tags: ["inodos", "stat", "lstat", "fstat", "estructura stat", "metadatos", "tabla de inodos", "enlaces"],
    objective:
      "Comprender la función del inodo en UNIX/Linux, los campos que lo componen (propietario, tipo, tamaño, bloques, etc.), la diferencia entre la lista de inodos en disco y la tabla de inodos en memoria, y usar las funciones stat, fstat y lstat para obtener metadatos de archivos.",
    theory: `Cada archivo en un sistema UNIX tiene asociado un inodo. El inodo contiene información necesaria para que un proceso pueda acceder al archivo: propietario, derechos de acceso, tamaño, localización en el sistema de archivos, etc. La lista de inodos se encuentra situada en los bloques que están a continuación del superbloque. Durante el proceso de arranque, el kernel lee la lista de inodos del disco y carga una copia en memoria, conocida como tabla de inodos. Las manipulaciones del subsistema de archivos involucran a la tabla de inodos (siempre en memoria) y se actualizan periódicamente al disco mediante un demonio.

Los campos que componen un inodo son:
• Identificador del propietario del archivo (UID y GID).
• Tipo de archivo: ordinario, directorio, dispositivo, comunicación (FIFO, socket).
• Tipo de acceso al archivo: fechas de última modificación, último acceso y último cambio de inodo.
• Número de enlaces del archivo: total de nombres que el archivo tiene en la jerarquía.
• Entradas para los bloques de dirección de los datos del archivo (punteros a bloques directos, indirectos, etc.).
• Tamaño del archivo en bytes.

Notas importantes:
1. El nombre del archivo no queda especificado en su inodo (se almacena en los directorios).
2. Escribir el contenido de un inodo en disco es diferente a escribir el contenido del archivo. El contenido del archivo cambia solo con escrituras; el inodo cambia al modificar los datos o la situación administrativa (propietario, permisos, enlaces).

La tabla de inodos en memoria contiene la misma información que la lista de inodos, más información adicional:
• Estado del inodo (bloqueado, esperas, si difiere del disco, si los datos difieren por buffer caché).
• Número de dispositivo lógico del sistema de archivos.
• Número de inodo.
• Apuntadores a otros inodos cargados (cola hash, lista libre).
• Contador de copias activas (archivo abierto por varios procesos).

En C, se puede recuperar información administrativa de un archivo con stat, fstat o lstat:

  #include <sys/types.h>
  #include <sys/stat.h>
  #include <unistd.h>
  int stat(const char *pathname, struct stat *statbuf);
  int fstat(int fd, struct stat *statbuf);
  int lstat(const char *pathname, struct stat *statbuf);

stat sigue enlaces simbólicos; lstat no. fstat usa descriptor de archivo. La estructura stat contiene campos como st_dev, st_ino, st_mode, st_nlink, st_uid, st_gid, st_size, st_blksize, st_blocks, st_atime, st_mtime, st_ctime.

Para determinar el tipo de archivo se usa st_mode con máscaras S_IFMT y macros como S_ISREG(m), S_ISDIR(m), etc.`,
    code: `/* Programa que obtiene características de los archivos del directorio actual */
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <dirent.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <time.h>
#include <sys/sysmacros.h>

#define RUTA 255

int main(void) {
    char ruta[RUTA];
    DIR *dir;
    struct dirent *direntrada;
    struct stat sb;

    if (getcwd(ruta, RUTA) == NULL) {
        perror("No puedo leer la ruta actual");
        exit(EXIT_FAILURE);
    }

    printf("Ruta actual: %s\n", ruta);
    printf("Mostrar contenido\n");

    if ((dir = opendir(ruta)) == NULL) {
        perror("No puedo leer el directorio");
        exit(EXIT_FAILURE);
    }

    while ((direntrada = readdir(dir)) != NULL) {
        getchar();  /* pausa para leer entrada uno a uno */
        printf("%s\t", direntrada->d_name);

        if (lstat(direntrada->d_name, &sb) == -1) {
            perror("lstat");
            exit(EXIT_FAILURE);
        }

        printf("ID del dispositivo: [%lx,%lx]\n", (long) major(sb.st_dev), (long) minor(sb.st_dev));
        printf("Tipo de archivo: ");
        switch (sb.st_mode & S_IFMT) {
            case S_IFBLK:  printf("Dispositivo de Bloque\n"); break;
            case S_IFCHR:  printf("Dispositivo de Caracter\n"); break;
            case S_IFDIR:  printf("Directorio\n"); break;
            case S_IFIFO:  printf("FIFO/pipe\n"); break;
            case S_IFLNK:  printf("Enlace\n"); break;
            case S_IFREG:  printf("Regular\n"); break;
            case S_IFSOCK: printf("Socket\n"); break;
            default:       printf("No conocido?\n"); break;
        }
        printf("I-nodo: %ld\n", (long) sb.st_ino);
        printf("Modo: %lo (octal)\n", (unsigned long) sb.st_mode);
        printf("No. Link: %ld\n", (long) sb.st_nlink);
        printf("Propietario: UID=%ld GID=%ld\n", (long) sb.st_uid, (long) sb.st_gid);
        printf("Tamaño de Bloque E/S: %ld bytes\n", (long) sb.st_blksize);
        printf("Tamaño: %lld bytes\n", (long long) sb.st_size);
        printf("Bloques: %lld\n", (long long) sb.st_blocks);
        printf("Ultima fecha de cambio: %s", ctime(&sb.st_ctime));
        printf("Ultima fecha de acceso: %s", ctime(&sb.st_atime));
        printf("Ultima fecha de modificación: %s", ctime(&sb.st_mtime));
        printf("\n");
    }

    closedir(dir);
    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "inode_info.c",
    terminalLines: [
      "$ gcc inode_info.c -o inode_info",
      "$ ./inode_info",
      "Ruta actual: /home/user/pruebas",
      "Mostrar contenido",
      "",
      ".    ID del dispositivo: [8,2]",
      "Tipo de archivo: Directorio",
      "I-nodo: 1234567",
      "Modo: 40755 (octal)",
      "No. Link: 5",
      "Propietario: UID=1000 GID=1000",
      "Tamaño de Bloque E/S: 4096 bytes",
      "Tamaño: 4096 bytes",
      "Bloques: 8",
      "Ultima fecha de cambio: Mon Jan 20 10:00:00 2025",
      "Ultima fecha de acceso: Mon Jan 20 09:30:00 2025",
      "Ultima fecha de modificación: Mon Jan 20 09:25:00 2025",
      "",
      "..   ID del dispositivo: [8,2]",
      "Tipo de archivo: Directorio",
      "...",
      "",
      "archivo.txt   ID del dispositivo: [8,2]",
      "Tipo de archivo: Regular",
      "I-nodo: 1234568",
      "Modo: 100644 (octal)",
      "No. Link: 1",
      "Propietario: UID=1000 GID=1000",
      "Tamaño de Bloque E/S: 4096 bytes",
      "Tamaño: 1024 bytes",
      "Bloques: 2",
      "Ultima fecha de cambio: Mon Jan 20 09:00:00 2025",
      "Ultima fecha de acceso: Mon Jan 20 09:15:00 2025",
      "Ultima fecha de modificación: Mon Jan 20 08:50:00 2025"
    ],
    terminalTitle: "Terminal — bash · inode_info",
    conclusion:
      "El inodo es la estructura fundamental que almacena todos los metadatos de un archivo excepto su nombre. La tabla de inodos en memoria acelera el acceso y permite gestionar bloqueos, cambios pendientes y referencias. Las funciones stat, fstat y lstat permiten obtener estos metadatos desde espacio de usuario, siendo lstat especialmente útil para enlaces simbólicos. Comprender los inodos ayuda a diagnosticar problemas de permisos, fechas, enlaces duros y uso de bloques en disco.",
    improvements:
      "Extender el programa para que recorra recursivamente directorios y muestre el árbol completo con sus inodos. Implementar una herramienta que busque archivos con enlaces duros (st_nlink > 1) y muestre los nombres compartidos. Usar la función readlink para leer el destino de enlaces simbólicos. Investigar cómo ver la fragmentación de un archivo usando FIBMAP o ioctl."
  },
    // ─────────────────────────────────────────────────────────────────
  // 6.3 Tipos de archivos en Linux
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-6-3",
    number: 5,
    title: "6.3 Tipos de archivos en Linux",
    difficulty: "Básico" as const,
    tags: ["archivos regulares", "directorios", "dispositivos", "archivos especiales", "tuberías", "sockets", "clasificación de archivos"],
    objective:
      "Identificar y comprender los cuatro tipos de archivos en Linux (ordinarios, directorios, dispositivos y comunicación), así como las operaciones permitidas y restringidas sobre archivos ordinarios.",
    theory: `En Linux existen cuatro tipos de archivos:

• Ordinarios (archivos regulares o de datos): contienen bytes de datos organizados como un arreglo lineal. Operaciones permitidas:
  - Leer o escribir cualquier byte.
  - Añadir bytes al final del archivo, aumentando su tamaño.
  - Truncar el tamaño de un archivo a cero bytes.
  Operaciones no permitidas:
  - Insertar bytes en un archivo, excepto al final.
  - Borrar bytes de un archivo, excepto el borrado de bytes con la puesta a cero de los que ya existen.
  - Truncar el tamaño de un archivo a un valor distinto de cero (solo a cero está permitido).

• Directorios: archivos especiales que contienen listas de nombres de archivo y sus correspondientes números de inodo. Permiten organizar jerárquicamente el sistema de archivos.

• Dispositivos (archivos especiales): representan dispositivos hardware. Se dividen en:
  - Dispositivos de bloque (discos, particiones): transfieren datos en bloques, acceso aleatorio.
  - Dispositivos de caracteres (terminales, impresoras, ratones): transfieren datos byte a byte, acceso secuencial.

• Comunicación: mecanismos IPC como tuberías (pipes) y sockets. Permiten transferir datos entre procesos. Los FIFOs (tuberías con nombre) también se incluyen aquí.

Los archivos ordinarios, como tales, no tienen nombre; el acceso a ellos se realiza a través de los inodos. El nombre se almacena en los directorios, que asocian un nombre de archivo con un número de inodo. Esta separación permite que un mismo inodo tenga múltiples nombres (enlaces duros).`,
    code: `/* Programa que clasifica los archivos de un directorio según su tipo */
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <dirent.h>
#include <string.h>

void mostrar_tipo_archivo(const char *ruta, const char *nombre) {
    char path_completo[1024];
    struct stat sb;

    snprintf(path_completo, sizeof(path_completo), "%s/%s", ruta, nombre);
    if (lstat(path_completo, &sb) == -1) {
        perror("lstat");
        return;
    }

    printf("%-20s -> ", nombre);
    switch (sb.st_mode & S_IFMT) {
        case S_IFREG:  printf("Ordinario (regular)\n"); break;
        case S_IFDIR:  printf("Directorio\n"); break;
        case S_IFBLK:  printf("Dispositivo de bloque\n"); break;
        case S_IFCHR:  printf("Dispositivo de caracter\n"); break;
        case S_IFIFO:  printf("Tubería (FIFO)\n"); break;
        case S_IFLNK:  printf("Enlace simbólico\n"); break;
        case S_IFSOCK: printf("Socket\n"); break;
        default:       printf("Desconocido\n"); break;
    }
}

int main(int argc, char *argv[]) {
    const char *dir_path = (argc > 1) ? argv[1] : ".";
    DIR *dir = opendir(dir_path);
    if (!dir) {
        perror("opendir");
        exit(EXIT_FAILURE);
    }

    printf("Clasificación de archivos en: %s\n\n", dir_path);
    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        if (strcmp(entry->d_name, ".") == 0 || strcmp(entry->d_name, "..") == 0)
            continue;
        mostrar_tipo_archivo(dir_path, entry->d_name);
    }
    closedir(dir);
    return 0;
}`,
    language: "c",
    filename: "file_types.c",
    terminalLines: [
      "$ gcc file_types.c -o file_types",
      "$ ./file_types /dev",
      "Clasificación de archivos en: /dev",
      "",
      "sda                 -> Dispositivo de bloque",
      "tty                 -> Dispositivo de caracter",
      "null                -> Dispositivo de caracter",
      "zero                -> Dispositivo de caracter",
      "random              -> Dispositivo de caracter",
      "...",
      "",
      "$ ./file_types /tmp",
      "Clasificación de archivos en: /tmp",
      "",
      "archivo.txt         -> Ordinario (regular)",
      "mi_pipe             -> Tubería (FIFO)",
      "socket_local        -> Socket",
      "subdir              -> Directorio",
      "",
      "$ ./file_types /proc/self/fd",
      "Clasificación de archivos en: /proc/self/fd",
      "",
      "0                   -> Enlace simbólico",
      "1                   -> Enlace simbólico",
      "2                   -> Enlace simbólico"
    ],
    terminalTitle: "Terminal — bash · file_types",
    conclusion:
      "Linux soporta cuatro categorías principales de archivos: ordinarios (datos), directorios (organización), dispositivos (hardware) y comunicación (IPC). Los archivos ordinarios tienen restricciones en sus operaciones de escritura (no se pueden insertar ni borrar bytes arbitrarios, solo añadir al final o truncar a cero). El nombre del archivo no está en el inodo sino en los directorios, lo que permite múltiples nombres para un mismo inodo. Clasificar correctamente los archivos es útil para administración, seguridad y desarrollo de herramientas de sistema.",
    improvements:
      "Extender el programa para contar cuántos archivos de cada tipo hay en un directorio. Implementar una versión recursiva que explore todo el árbol. Usar macros como S_ISREG, S_ISDIR para simplificar. Investigar la creación de archivos especiales con mknod y tuberías con mkfifo."
  },
    // ─────────────────────────────────────────────────────────────────
  // 6.3.1 Archivos tipo Directorios
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-6-3-1",
    number: 6,
    title: "6.3.1 Archivos tipo Directorios",
    difficulty: "Intermedio" as const,
    tags: ["directorios", "opendir", "readdir", "closedir", "dirent", "enlaces", "permisos", "pathname"],
    objective:
      "Comprender la función de los directorios como archivos especiales que asocian nombres de archivo con inodos, conocer los permisos específicos (lectura, escritura, ejecución) y utilizar las funciones opendir, readdir y closedir para recorrer directorios.",
    theory: `Los directorios son los archivos que permiten darle una estructura jerárquica a los sistemas de archivos. Su función fundamental consiste en establecer la relación que existe entre el nombre de un archivo y su inodo correspondiente. En UNIX/Linux, un directorio es un archivo cuyos datos están organizados como una secuencia de entradas, cada una de las cuales contiene un número de inodo y el nombre de un archivo que pertenece al directorio. Al par inodo-nombre de archivo se le conoce como enlace (link).

El kernel maneja los datos de un directorio con los mismos procedimientos que los archivos ordinarios (estructura inodo, bloques directos e indirectos). Los procesos pueden leer el contenido de un directorio como si fuese un archivo de datos, sin embargo no pueden modificarlo directamente. El derecho de escritura en un directorio está reservado al kernel (mediante llamadas al sistema).

Permisos de acceso a un directorio:
• Permiso de lectura (r): permite que un proceso pueda leer el directorio (obtener la lista de nombres).
• Permiso de escritura (w): permite a un proceso crear una nueva entrada en el directorio o borrar alguna ya existente mediante llamadas: creat, mknod, link, unlink, rename, mkdir, rmdir.
• Permiso de ejecución (x): autoriza a un proceso para buscar el nombre de un archivo dentro del directorio (atravesar el directorio). Sin este permiso, no se puede acceder a ningún archivo dentro aunque se conozca su nombre.

Desde el punto de vista del usuario, se referencian los archivos mediante su nombre de ruta (pathname). El kernel transforma el pathname a su inodo correspondiente recorriendo los directorios.

Funciones para programación de directorios:

• opendir(): abre un directorio y devuelve un apuntador a DIR (flujo de directorio). Prototipo:
  #include <sys/types.h>
  #include <dirent.h>
  DIR *opendir(const char *nombre);
  Retorna NULL en error, con errno indicando la causa (EACCES, ENOENT, ENOTDIR, etc.).

• readdir(): lee la siguiente entrada del directorio. Prototipo:
  struct dirent *readdir(DIR *dirp);
  Devuelve un apuntador a una estructura dirent, o NULL al final o error. La estructura dirent contiene:
  - d_ino: número de inodo.
  - d_off: desplazamiento dentro del directorio.
  - d_reclen: longitud del registro.
  - d_type: tipo de archivo (no siempre soportado).
  - d_name[256]: nombre del archivo (cadena terminada en nulo).

• closedir(): cierra el flujo del directorio y libera recursos.
• rewinddir(): reinicia la lectura al inicio del directorio.

El siguiente ejemplo muestra cómo listar el contenido de un directorio.`,
    code: `/* Programa para imprimir la lista de archivos contenidos en un directorio */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <errno.h>

int main(int argc, char *argv[]) {
    DIR *directorio;
    struct dirent *entradadir;

    if (argc != 2) {
        fprintf(stderr, "Uso: %s nombre_directorio\n", argv[0]);
        exit(1);
    }

    if ((directorio = opendir(argv[1])) == NULL) {
        fprintf(stderr, "No puedo abrir el directorio %s. Error: %s\n",
                argv[1], strerror(errno));
        exit(1);
    }

    printf("Contenido de '%s':\n", argv[1]);
    while ((entradadir = readdir(directorio)) != NULL) {
        printf("  %s\n", entradadir->d_name);
    }

    closedir(directorio);
    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "list_dir.c",
    terminalLines: [
      "$ gcc list_dir.c -o list_dir",
      "$ ./list_dir /home/user",
      "Contenido de '/home/user':",
      "  .",
      "  ..",
      "  documentos",
      "  descargas",
      "  .bashrc",
      "  .profile",
      "  archivo.txt",
      "",
      "$ ./list_dir /tmp",
      "Contenido de '/tmp':",
      "  .",
      "  ..",
      "  .X11-unix",
      "  systemd-private-xxx",
      "",
      "$ ./list_dir /noexiste",
      "No puedo abrir el directorio /noexiste. Error: No such file or directory",
      "",
      "# Ejemplo con permiso denegado",
      "$ ./list_dir /root",
      "No puedo abrir el directorio /root. Error: Permission denied"
    ],
    terminalTitle: "Terminal — bash · list_dir",
    conclusion:
      "Los directorios son archivos especiales que asocian nombres con inodos, permitiendo la estructura jerárquica del sistema de archivos. Sus permisos tienen significados específicos: lectura para listar, escritura para crear/eliminar entradas, y ejecución para atravesar. Las funciones opendir/readdir/closedir proporcionan una interfaz portable para recorrer directorios desde C, extrayendo nombres e inodos. Comprender los directorios es esencial para la administración y para desarrollar herramientas como ls, find, o gestores de archivos.",
    improvements:
      "Modificar el programa para que también muestre el número de inodo (d_ino) y el tipo de archivo (d_type) cuando esté disponible. Implementar una versión recursiva que liste directorios dentro de directorios. Agregar filtrado por extensión o patrón. Investigar las funciones scandir y ftw para recorridos más avanzados."
  },
    // ─────────────────────────────────────────────────────────────────
  // 6.3.2 Archivos tipo Dispositivos
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-6-3-2",
    number: 7,
    title: "6.3.2 Archivos tipo Dispositivos",
    difficulty: "Intermedio" as const,
    tags: ["dispositivos", "drivers", "major", "minor", "stat", "dispositivos de bloque", "dispositivos de caracter", "pseudo dispositivos", "lsblk", "lspci"],
    objective:
      "Comprender el rol de los archivos especiales de dispositivo en Linux, diferenciar entre dispositivos de bloque y de carácter, interpretar los números mayor y menor, y utilizar las funciones major() y minor() para obtenerlos desde C.",
    theory: `Los archivos especiales o archivos de dispositivos permiten a los procesos comunicarse con los dispositivos periféricos (discos, cintas, impresoras, terminales, redes, etc.). Existen dos tipos:

• Dispositivos de bloque (block devices): se ajustan a un modelo donde el dispositivo contiene un arreglo de bloques de tamaño fijo (generalmente múltiplo de 512 bytes). El kernel gestiona un buffer caché que acelera la transferencia. Ejemplos: discos duros (/dev/sda), particiones (/dev/sda1), discos virtuales (/dev/loop0).

• Dispositivos de carácter (character devices): la información es vista como una secuencia lineal de bytes sin buffer caché; la transferencia suele ser a baja velocidad y por bytes. Ejemplos: terminales (/dev/tty, /dev/pts/*), ratones, impresoras, /dev/null, /dev/random.

Los módulos del kernel que gestionan la comunicación con los dispositivos se conocen como controladores o drivers. Para ver los controladores cargados se usa lsmod; para identificar controladores por hardware, lspci -k.

El sistema también soporta pseudo dispositivos (dispositivos virtuales) sin hardware asociado, gestionados por el kernel (ej. /dev/mem, /dev/zero, /dev/urandom). Estos se manejan con las mismas llamadas de archivo.

Los archivos de dispositivos tienen asociado un inodo, pero a diferencia de archivos ordinarios o directorios, no contienen bloques de datos. En su lugar, el inodo almacena dos números: número mayor (major) y número menor (minor). El major indica el tipo de dispositivo (el driver), y el minor identifica la unidad o instancia específica dentro de ese driver. El kernel usa major y minor para indexar en tablas de rutinas del driver.

Para ver dispositivos de bloque con sus números mayor/menor: lsblk -d -o NAME,MAJ:MIN,SIZE,TYPE,MOUNTPOINT.
Para obtener estos números desde C se usan las macros major() y minor() definidas en <sys/sysmacros.h>, aplicadas al campo st_rdev de la estructura stat (obtenida con stat() sobre el archivo de dispositivo).`,
    code: `/* Extrae el número mayor (major) y menor (minor) de un dispositivo */
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <sys/sysmacros.h>

int main(int argc, char *argv[]) {
    struct stat sb;

    if (argc != 2) {
        fprintf(stderr, "Uso: %s <ruta_dispositivo>\n", argv[0]);
        exit(EXIT_FAILURE);
    }

    if (stat(argv[1], &sb) == -1) {
        perror("stat");
        exit(EXIT_FAILURE);
    }

    printf("Archivo: %s\n", argv[1]);

    if (S_ISCHR(sb.st_mode)) {
        printf("Tipo: Dispositivo de caracteres (Char)\n");
    } else if (S_ISBLK(sb.st_mode)) {
        printf("Tipo: Dispositivo de bloques (Block)\n");
    } else {
        printf("Tipo: No es un dispositivo de bloques o caracteres\n");
        exit(EXIT_FAILURE);
    }

    printf("Número Mayor (Major): %u\n", major(sb.st_rdev));
    printf("Número Menor (Minor): %u\n", minor(sb.st_rdev));

    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "device_major_minor.c",
    terminalLines: [
      "$ gcc device_major_minor.c -o device_major_minor",
      "$ ./device_major_minor /dev/tty1",
      "Archivo: /dev/tty1",
      "Tipo: Dispositivo de caracteres (Char)",
      "Número Mayor (Major): 4",
      "Número Menor (Minor): 1",
      "",
      "$ ./device_major_minor /dev/loop49",
      "Archivo: /dev/loop49",
      "Tipo: Dispositivo de bloques (Block)",
      "Número Mayor (Major): 7",
      "Número Menor (Minor): 49",
      "",
      "$ ./device_major_minor /dev/sda",
      "Archivo: /dev/sda",
      "Tipo: Dispositivo de bloques (Block)",
      "Número Mayor (Major): 8",
      "Número Menor (Minor): 0",
      "",
      "# Ver dispositivos de bloque con lsblk",
      "$ lsblk -d -o NAME,MAJ:MIN,SIZE,TYPE",
      "NAME MAJ:MIN  SIZE TYPE",
      "sda   8:0     120G disk",
      "loop0 7:0     100M loop",
      "loop1 7:1     200M loop"
    ],
    terminalTitle: "Terminal — bash · device_major_minor",
    conclusion:
      "Los archivos de dispositivos en Linux permiten la comunicación con hardware y pseudo-dispositivos usando la interfaz estándar de archivos. Se dividen en bloque (con buffer caché, acceso por bloques) y carácter (sin buffer, flujo de bytes). Los números mayor (major) y menor (minor) en el inodo identifican el controlador y la unidad, siendo esenciales para que el kernel enrute las operaciones al driver correcto. Comprender estos números ayuda a administrar dispositivos, depurar permisos y crear nodos de dispositivo manualmente con mknod.",
    improvements:
      "Extender el programa para listar todos los dispositivos en /dev y mostrar su tipo, major y minor. Usar el comando 'udevadm info' para obtener información detallada de un dispositivo. Investigar la creación de pseudo-dispositivos con device mapper o con 'mknod'. Escribir un programa que lea de /dev/urandom y calcule entropía."
  },
    // ─────────────────────────────────────────────────────────────────
  // 6.3.3 Archivos tipo Comunicación (tuberías)
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-6-3-3",
    number: 8,
    title: "6.3.3 Archivos tipo Comunicación",
    difficulty: "Intermedio" as const,
    tags: ["tuberías", "pipes", "FIFO", "comunicación entre procesos", "lsof", "find", "mkfifo"],
    objective:
      "Comprender los archivos de comunicación (tuberías) en Linux, su comportamiento FIFO, diferencias con archivos ordinarios, y aprender a identificar tuberías en el sistema usando comandos como lsof y find.",
    theory: `Los archivos de comunicación, llamados también tuberías (pipes), son archivos con una estructura similar a la de los archivos ordinarios. La diferencia principal es que los datos de una tubería son transitorios y se utilizan para comunicar procesos. Lo normal es que un proceso abra la tubería para escritura y otro para lectura. Los datos escritos en la tubería se leen en el mismo orden en el que fueron escritos (FIFO: first in, first out). La sincronización del acceso a la tubería es responsabilidad del kernel.

El almacenamiento de los datos en una tubería se realiza de la misma forma que en un archivo ordinario, excepto que el kernel solo utiliza entradas directas de la tabla de direcciones de bloque del inodo de la tubería (sin punteros indirectos). Existen dos tipos:
- Tuberías sin nombre (pipe): solo entre procesos emparentados, creadas con pipe().
- Tuberías con nombre (FIFO): tienen una ruta en el sistema de archivos, creadas con mkfifo o mknod, y permiten comunicación entre procesos no emparentados.

Para listar las tuberías en uso en el sistema se puede usar: lsof | grep FIFO. Para buscar archivos FIFO (tuberías con nombre) en todo el sistema: find / -type p 2>/dev/null. El comando find con -type p encuentra archivos de tipo pipe, y se redirige stderr a /dev/null para evitar errores de permisos.

El siguiente ejemplo muestra la creación de una tubería con nombre, donde un proceso escribe y otro lee, simulando dos programas independientes (se puede ejecutar el lector y el escritor en terminales separadas o con fork).`,
    code: `/* Ejemplo: Tubería con nombre (FIFO) para comunicación entre procesos.
   Compilar: gcc fifo_comunicacion.c -o fifo_comunicacion
   Uso: 
     ./fifo_comunicacion escritor   (modo escritura)
     ./fifo_comunicacion lector     (modo lectura)
   O bien, ejecutar sin argumentos para demostración con fork.
*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <errno.h>

#define FIFO_PATH "/tmp/mi_tuberia_comunicacion"
#define BUFFER_SIZE 256

int main(int argc, char *argv[]) {
    int fd;
    char buffer[BUFFER_SIZE];

    // Modo demostración: si no hay argumentos, hacer fork y demostrar
    if (argc < 2) {
        printf("Demostración con fork: padre lee, hijo escribe.\n");
        unlink(FIFO_PATH);
        if (mkfifo(FIFO_PATH, 0666) == -1 && errno != EEXIST) {
            perror("mkfifo");
            exit(EXIT_FAILURE);
        }
        pid_t pid = fork();
        if (pid == -1) {
            perror("fork");
            exit(EXIT_FAILURE);
        }
        if (pid == 0) {
            // Hijo: escritor
            fd = open(FIFO_PATH, O_WRONLY);
            if (fd == -1) { perror("hijo: open escritura"); exit(EXIT_FAILURE); }
            const char *msg = "Mensaje desde el hijo mediante FIFO";
            write(fd, msg, strlen(msg) + 1);
            close(fd);
            printf("[HIJO] Mensaje enviado.\n");
            exit(EXIT_SUCCESS);
        } else {
            // Padre: lector
            fd = open(FIFO_PATH, O_RDONLY);
            if (fd == -1) { perror("padre: open lectura"); exit(EXIT_FAILURE); }
            read(fd, buffer, BUFFER_SIZE);
            printf("[PADRE] Mensaje recibido: %s\n", buffer);
            close(fd);
            unlink(FIFO_PATH);
            wait(NULL);
        }
        return EXIT_SUCCESS;
    }

    // Modo independiente: argumento "escritor" o "lector"
    if (strcmp(argv[1], "escritor") == 0) {
        // Crear FIFO si no existe
        if (mkfifo(FIFO_PATH, 0666) == -1 && errno != EEXIST) {
            perror("mkfifo");
            exit(EXIT_FAILURE);
        }
        fd = open(FIFO_PATH, O_WRONLY);
        if (fd == -1) { perror("open escritor"); exit(EXIT_FAILURE); }
        printf("Escritor: Escriba mensajes (EOF para terminar):\n");
        while (fgets(buffer, BUFFER_SIZE, stdin)) {
            write(fd, buffer, strlen(buffer) + 1);
        }
        close(fd);
    } 
    else if (strcmp(argv[1], "lector") == 0) {
        fd = open(FIFO_PATH, O_RDONLY);
        if (fd == -1) { perror("open lector"); exit(EXIT_FAILURE); }
        printf("Lector: Esperando mensajes...\n");
        while (read(fd, buffer, BUFFER_SIZE) > 0) {
            printf("Lector recibió: %s", buffer);
        }
        close(fd);
    } 
    else {
        fprintf(stderr, "Uso: %s [escritor|lector]\n", argv[0]);
        exit(EXIT_FAILURE);
    }
    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "fifo_comunicacion.c",
    terminalLines: [
      "$ gcc fifo_comunicacion.c -o fifo_comunicacion",
      "$ ./fifo_comunicacion",
      "Demostración con fork: padre lee, hijo escribe.",
      "[HIJO] Mensaje enviado.",
      "[PADRE] Mensaje recibido: Mensaje desde el hijo mediante FIFO",
      "",
      "# Modo independiente: en dos terminales",
      "# Terminal 1 (lector):",
      "$ ./fifo_comunicacion lector",
      "Lector: Esperando mensajes...",
      "# Terminal 2 (escritor):",
      "$ ./fifo_comunicacion escritor",
      "Escritor: Escriba mensajes (EOF para terminar):",
      "Hola FIFO",
      "Otro mensaje",
      "# En terminal 1 aparece:",
      "Lector recibió: Hola FIFO",
      "Lector recibió: Otro mensaje",
      "",
      "# Buscar tuberías con nombre en el sistema",
      "$ find / -type p 2>/dev/null | head -5",
      "/run/user/1000/wayland-0",
      "/tmp/mi_tuberia_comunicacion",
      "",
      "# Listar tuberías en uso",
      "$ lsof | grep FIFO",
      "fifo_escri 12345 user    3r  FIFO   0,13      0t0    12345 /tmp/mi_tuberia_comunicacion"
    ],
    terminalTitle: "Terminal — bash · fifo_comunicacion",
    conclusion:
      "Los archivos de comunicación (tuberías) son un tipo especial que permite la transferencia de datos entre procesos de forma FIFO. A diferencia de los archivos ordinarios, los datos son transitorios y el kernel se encarga de la sincronización. Las tuberías con nombre (FIFO) persisten en el sistema de archivos y permiten comunicar procesos no emparentados. Herramientas como lsof y find ayudan a localizarlas y monitorizarlas. Este mecanismo es fundamental para el diseño de sistemas de procesamiento en flujo (pipeline) y para la comunicación entre componentes.",
    improvements:
      "Implementar una comunicación bidireccional usando dos FIFOs. Crear un chat simple entre dos terminales. Usar las funciones select o poll para manejar múltiples flujos. Investigar el límite de capacidad de los FIFOs (tamaño de buffer del kernel) y cómo ajustarlo con fcntl."
  },
    // ─────────────────────────────────────────────────────────────────
  // 6.4 Dispositivos de entrada y salida
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-6-4",
    number: 9,
    title: "6.4 Dispositivos de entrada y salida",
    difficulty: "Intermedio" as const,
    tags: ["dispositivos", "E/S", "hdparm", "terminal", "/dev/tty", "utmp", "getutent", "write", "mensaje_para"],
    objective:
      "Comprender la administración de dispositivos de E/S en Linux, diferenciar dispositivos de bloque y carácter, usar hdparm para medir discos, explorar terminales como archivos especiales, y programar la comunicación con usuarios mediante el archivo utmp y getutent.",
    theory: `El sistema operativo administra los accesos de entrada y salida a los dispositivos: tiempos de búsqueda, acceso y transferencia. En UNIX/Linux existen dos tipos de dispositivos: de bloque y de carácter.

• Dispositivos de bloque: trabajan con bloques de tamaño fijo (mínimo 512 bytes). La transferencia se realiza en una o más unidades. Ejemplos: discos duros, memorias USB, SSD. Se identifican con la letra 'b' en ls -l /dev. Para medir la velocidad de lectura de un disco se usa hdparm -t. Ejemplo: sudo hdparm -t /dev/sda. Con hdparm -I se obtienen detalles del modelo, firmware, etc.

• Dispositivos de carácter: trabajan con flujo de bytes, sin bloques fijos. Ejemplos: terminales, teclados, impresoras, interfaces de red. Se identifican con 'c' en ls -l /dev.

Las terminales son dispositivos carácter especiales. Cada sesión de usuario tiene asociado un terminal representado por un archivo en /dev/tty##. El archivo /dev/tty permite al proceso acceder a su propia terminal. Para saber qué terminal usa un usuario se emplean los comandos who o w (segunda columna).

El archivo /etc/utmp (o /var/run/utmp) almacena información de los usuarios actualmente conectados. Contiene registros con la estructura utmp definida en <sys/utmp.h>. La función getutent() lee secuencialmente estos registros. Cada registro incluye: ut_user (nombre de usuario), ut_line (dispositivo terminal, ej. "tty1"), ut_pid (PID del proceso de login), ut_host (host remoto), etc.

El programa mensaje_para (similar al comando write) busca al usuario destino en utmp, obtiene su terminal, abre el archivo de dispositivo correspondiente en modo escritura y envía mensajes. Finaliza al recibir "adios" y mata el proceso del usuario (con kill(...,9)). Requiere permisos de root.

El siguiente código implementa esta funcionalidad.`,
    code: `/* Programa mensaje_para: envío de mensajes a un usuario en su terminal */
#include <stdio.h>
#include <fcntl.h>
#include <utmp.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <signal.h>

int main(int argc, char *argv[]) {
    int tty, salir = 0;
    char terminal[40], mensaje[256], *logname;
    struct utmp *utmp;

    if (argc != 2) {
        fprintf(stderr, "Forma de uso: %s usuario\n", argv[0]);
        exit(-1);
    }

    /* Buscar el usuario en utmp */
    while ((utmp = getutent()) != NULL && strncmp(utmp->ut_user, argv[1], 8) != 0);
    if (utmp == NULL) {
        printf("EL USUARIO %s NO ESTÁ EN SESIÓN.\n", argv[1]);
        exit(EXIT_FAILURE);
    }

    /* Construir la ruta del dispositivo terminal */
    sprintf(terminal, "/dev/%s", utmp->ut_line);
    if ((tty = open(terminal, O_WRONLY)) == -1) {
        perror(terminal);
        exit(EXIT_FAILURE);
    }

    /* Obtener nombre del usuario que envía */
    logname = getenv("LOGNAME");
    sprintf(mensaje, "\n\t\tMENSAJE PROCEDENTE DEL USUARIO %s\t\t\n", logname);
    write(tty, mensaje, strlen(mensaje));

    /* Envío de mensajes hasta que se escriba "adios" */
    do {
        fgets(mensaje, 256, stdin);
        write(tty, mensaje, strlen(mensaje));
        if (strcmp(mensaje, "adios\n") == 0) {
            sprintf(mensaje, "\n<FIN DEL MENSAJE>\n");
            write(tty, mensaje, strlen(mensaje));
            close(tty);
            kill(utmp->ut_pid, 9);  /* Finalizar sesión del usuario */
            salir = 1;
        }
    } while (salir != 1);

    return EXIT_SUCCESS;
}`,
    language: "c",
    filename: "mensaje_para.c",
    terminalLines: [
      "$ gcc mensaje_para.c -o mensaje_para",
      "$ sudo ./mensaje_para ana",
      "",
      "\t\tMENSAJE PROCEDENTE DEL USUARIO root\t\t",
      "Hola Ana, ¿cómo estás?",
      "adios",
      "",
      "# En la terminal de Ana aparece:",
      "\t\tMENSAJE PROCEDENTE DEL USUARIO root\t\t",
      "Hola Ana, ¿cómo estás?",
      "adios",
      "<FIN DEL MENSAJE>",
      "",
      "$ who",
      "ana      tty2         2025-02-20 10:00",
      "root     pts/0        2025-02-20 11:30",
      "",
      "$ ls -l /dev/tty2",
      "crw--w---- 1 ana tty 4, 2 feb 20 10:00 /dev/tty2",
      "",
      "$ sudo hdparm -t /dev/sda",
      "/dev/sda:",
      "Timing buffered disk reads: 186 MB in 3.01 seconds = 61.83 MB/sec"
    ],
    terminalTitle: "Terminal — bash · mensaje_para",
    conclusion:
      "Los dispositivos de E/S se dividen en bloque (discos, con buffer y acceso por bloques) y carácter (terminales, flujo de bytes). Herramientas como hdparm permiten evaluar rendimiento. Las terminales son archivos especiales (/dev/tty*) que pueden abrirse para escribir mensajes a otros usuarios. El archivo utmp y la función getutent proporcionan acceso a la lista de usuarios conectados, lo que permite implementar comandos como write o wall. El ejemplo mensaje_para ilustra el uso combinado de utmp, apertura de terminal y señal para terminar sesión.",
    improvements:
      "Mejorar el programa para que no requiera kill -9 (enviar un mensaje de fin de sesión más amigable). Usar utmpname() para especificar otro archivo. Implementar una versión que envíe mensajes a todos los usuarios (wall). Investigar el uso de syslog para registrar los mensajes enviados. Explorar el comando 'write' y su implementación en código abierto."
  },
    // ─────────────────────────────────────────────────────────────────
  // 6.4.1 Función ioctl
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-6-4-1",
    number: 10,
    title: "6.4.1 Función ioctl",
    difficulty: "Avanzado" as const,
    tags: ["ioctl", "dispositivos de caracter", "control de dispositivos", "TCGETS", "termios", "drivers"],
    objective:
      "Comprender el propósito de la función ioctl para controlar dispositivos de carácter, aprender a usarla con terminales y otros dispositivos, e interpretar códigos de solicitud comunes.",
    theory: `La función ioctl (input/output control) permite trabajar con dispositivos de carácter, enviando comandos de control específicos que no son cubiertos por las operaciones estándar de lectura/escritura. Su prototipo es:

  #include <sys/ioctl.h>
  int ioctl(int fd, unsigned long request, char *argp, ...);

Parámetros:
- fd: descriptor del archivo abierto (dispositivo de carácter).
- request: código de solicitud que depende del dispositivo. Define la operación a realizar (ej. obtener parámetros de terminal, establecer velocidad, formatear un disquete, etc.).
- argp: apuntador a parámetros opcionales, cuyo tipo depende de la solicitud.

Retorna 0 en éxito, -1 en error con errno apropiado.

ioctl es muy versátil y se usa con terminales, discos (CDROM, disquetes), tarjetas de audio, video, etc. Los códigos de solicitud se definen mediante macros como _IO, _IOR, _IOW, _IOWR. Por ejemplo, para terminales se usan solicitudes como TCGETS (obtener atributos termios), TCSETS (establecer atributos), TIOCGWINSZ (obtener tamaño de ventana), etc.

El ejemplo muestra cómo obtener el tamaño de la ventana de la terminal actual usando ioctl con la solicitud TIOCGWINSZ. También ilustra cómo cambiar el eco de teclado (desactivar/activar) usando TCGETS/TCSETS y la estructura termios.

Es necesario incluir <sys/ioctl.h> y, para terminales, <termios.h> y <sys/ttydefaults.h>.`,
    code: `/* Ejemplo de uso de ioctl: obtener tamaño de ventana de terminal
   y cambiar el modo de eco (deshabilitar/habilitar) */
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/ioctl.h>
#include <termios.h>
#include <errno.h>

int main() {
    int fd = STDIN_FILENO;  // Usamos la entrada estándar
    struct winsize ws;

    // Obtener tamaño de la ventana
    if (ioctl(fd, TIOCGWINSZ, &ws) == -1) {
        perror("ioctl TIOCGWINSZ");
        exit(EXIT_FAILURE);
    }
    printf("Tamaño de la terminal: %d filas x %d columnas\n", ws.ws_row, ws.ws_col);

    // Ejemplo de modificación de atributos de terminal (echo on/off)
    struct termios oldt, newt;
    if (tcgetattr(fd, &oldt) == -1) {
        perror("tcgetattr");
        exit(EXIT_FAILURE);
    }
    newt = oldt;
    // Deshabilitar echo
    newt.c_lflag &= ~ECHO;
    if (tcsetattr(fd, TCSANOW, &newt) == -1) {
        perror("tcsetattr (echo off)");
        exit(EXIT_FAILURE);
    }
    printf("Echo desactivado. Escriba algo (CR para terminar): ");
    char c;
    while (read(fd, &c, 1) == 1) {
        if (c == '\\n') break;
        // No se muestra lo que se teclea
    }
    // Restaurar echo
    if (tcsetattr(fd, TCSANOW, &oldt) == -1) {
        perror("tcsetattr (restaurar echo)");
        exit(EXIT_FAILURE);
    }
    printf("\\nEcho restaurado.\n");

    // Alternativa usando ioctl para obtener atributos (no portable, para demostración)
    struct termios tio;
    if (ioctl(fd, TCGETS, &tio) == -1) {
        perror("ioctl TCGETS");
    } else {
        printf("Atributos terminal obtenidos con ioctl (TCGETS).\n");
    }
    return 0;
}`,
    language: "c",
    filename: "ioctl_demo.c",
    terminalLines: [
      "$ gcc ioctl_demo.c -o ioctl_demo",
      "$ ./ioctl_demo",
      "Tamaño de la terminal: 24 filas x 80 columnas",
      "Echo desactivado. Escriba algo (CR para terminar): ",
      "(el usuario teclea 'secreto' y presiona Enter)",
      "",
      "Echo restaurado.",
      "Atributos terminal obtenidos con ioctl (TCGETS).",
      "",
      "# Ejemplo alternativo: obtener tamaño de ventana con ioctl desde un script",
      "$ cat > win_size.c << \"EOF\"",
      "#include <stdio.h>",
      "#include <sys/ioctl.h>",
      "#include <unistd.h>",
      "int main() { struct winsize w; ioctl(0, TIOCGWINSZ, &w); printf(\"%d %d\\n\", w.ws_row, w.ws_col); }",
      "EOF",
      "$ gcc win_size.c -o win_size && ./win_size",
      "24 80"
    ],
    terminalTitle: "Terminal — bash · ioctl_demo",
    conclusion:
      "ioctl es la interfaz genérica para controlar dispositivos de carácter, permitiendo operaciones más allá de read/write. Se utiliza para configurar terminales (tamaño, eco, velocidad), controlar unidades de disco, manejar dispositivos multimedia, etc. Su uso requiere conocer los códigos de solicitud específicos de cada dispositivo, que suelen definirse en los encabezados del kernel o del driver. Aunque es potente, debe usarse con cuidado ya que compromete la portabilidad. Alternativas modernas incluyen sysfs, netlink o interfaces específicas, pero ioctl sigue siendo fundamental en sistemas embebidos y de bajo nivel.",
    improvements:
      "Implementar un programa que cambie el flujo de control de una terminal (CLOCAL, CRTSCTS). Usar ioctl con dispositivos de bucle (loop) para obtener parámetros. Investigar las solicitudes estándar para discos (HDIO_GETGEO, BLKGETSIZE). Escribir una versión simplificada de 'stty' usando ioctl."
  },
    // ─────────────────────────────────────────────────────────────────
  // 6.4.2 Unidad de disco
  // ─────────────────────────────────────────────────────────────────
  {
    id: "tema-6-4-2",
    number: 11,
    title: "6.4.2 Unidad de disco",
    difficulty: "Intermedio" as const,
    tags: ["disco duro", "pistas", "sectores", "tiempo de búsqueda", "latencia rotacional", "partición", "/proc/swaps", "hdparm", "ioctl", "BLKGETSIZE"],
    objective:
      "Comprender la estructura física de una unidad de disco (pistas, sectores, tiempos de acceso), el concepto de partición y cómo el kernel las trata como dispositivos independientes, así como obtener información del disco mediante comandos y programación en C con ioctl.",
    theory: `La unidad de disco es un medio magnético (o de estado sólido) donde se almacenan todos los datos. Para leer o escribir, los cabezales deben posicionarse en un conjunto de círculos concéntricos llamados pistas, las cuales se dividen en bloques llamados sectores. Los sectores suelen tener un tamaño de 512 bytes (o múltiplo, como 4096 bytes en discos avanzados) y es la unidad de bloque más pequeña que se puede leer o escribir.

Tiempos característicos:
- Tiempo de búsqueda (seek time): tiempo que tarda el cabezal en ubicar la pista correcta.
- Retardo de giro o latencia rotacional (rotational latency): tiempo que tarda el sector deseado en alinearse con el cabezal, dada la rotación del disco.
- Tiempo de acceso: suma del tiempo de búsqueda y la latencia rotacional.

Particiones: cada división lógica del disco se conoce como partición. El kernel trata cada partición como un dispositivo separado, normalmente representado por un archivo en /dev (ej. /dev/sda1, /dev/sda2). Cada partición puede contener un sistema de archivos (para datos) o un área de swap (intercambio). En el archivo /proc/swaps se observa información del área de swap del sistema (dispositivo, tamaño, uso).

Para obtener información del disco desde la línea de comandos se pueden usar:
- fdisk -l /dev/sda: mostrar tabla de particiones.
- lsblk: listar bloques de dispositivos (discos y particiones).
- hdparm -I /dev/sda: detalles del disco (modelo, tamaño, capacidades).
- smartctl -a /dev/sda: información SMART.

Desde C, se puede usar la llamada ioctl con solicitudes como BLKGETSIZE64 (obtener tamaño en bytes), BLKSSZGET (tamaño del sector), o HDIO_GETGEO (geometría del disco, aunque obsoleta para discos LBA). El siguiente ejemplo muestra cómo obtener el tamaño total de un disco o partición usando ioctl con BLKGETSIZE64.`,
    code: `/* Obtener información básica de un disco/partición usando ioctl */
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/ioctl.h>
#include <linux/fs.h>   /* Para BLKGETSIZE64, BLKSSZGET */
#include <errno.h>

int main(int argc, char *argv[]) {
    if (argc != 2) {
        fprintf(stderr, "Uso: %s <dispositivo> (ej: /dev/sda, /dev/sda1)\n", argv[0]);
        exit(EXIT_FAILURE);
    }

    int fd = open(argv[1], O_RDONLY);
    if (fd == -1) {
        perror("open");
        exit(EXIT_FAILURE);
    }

    // Obtener tamaño en bytes
    unsigned long long size_bytes = 0;
    if (ioctl(fd, BLKGETSIZE64, &size_bytes) == -1) {
        perror("ioctl BLKGETSIZE64");
        close(fd);
        exit(EXIT_FAILURE);
    }
    printf("Dispositivo: %s\n", argv[1]);
    printf("Tamaño total: %llu bytes (%.2f GB, %.2f GiB)\n",
           size_bytes, size_bytes / 1e9, size_bytes / (1024.0*1024*1024));

    // Obtener tamaño de sector (lógico)
    unsigned int sector_size = 0;
    if (ioctl(fd, BLKSSZGET, &sector_size) == -1) {
        perror("ioctl BLKSSZGET");
    } else {
        printf("Tamaño de sector lógico: %u bytes\n", sector_size);
        printf("Número de sectores: %llu\n", size_bytes / sector_size);
    }

    close(fd);
    return 0;
}`,
    language: "c",
    filename: "disk_info.c",
    terminalLines: [
      "$ gcc disk_info.c -o disk_info",
      "$ sudo ./disk_info /dev/sda",
      "Dispositivo: /dev/sda",
      "Tamaño total: 120034123776 bytes (120.03 GB, 111.79 GiB)",
      "Tamaño de sector lógico: 512 bytes",
      "Número de sectores: 234441648",
      "",
      "$ lsblk /dev/sda",
      "NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT",
      "sda      8:0    0 111.8G  0 disk",
      "├─sda1   8:1    0   512M  0 part /boot/efi",
      "├─sda2   8:2    0  55.9G  0 part /",
      "└─sda3   8:3    0  55.4G  0 part /home",
      "",
      "$ cat /proc/swaps",
      "Filename\t\tType\t\tSize\tUsed\tPriority",
      "/dev/sda3                               partition\t4194300\t0\t-2",
      "",
      "$ sudo hdparm -t /dev/sda",
      "/dev/sda:",
      " Timing buffered disk reads: 186 MB in 3.01 seconds = 61.83 MB/sec"
    ],
    terminalTitle: "Terminal — bash · disk_info",
    conclusion:
      "La unidad de disco se organiza físicamente en pistas y sectores; el rendimiento depende del tiempo de búsqueda y la latencia rotacional. Las particiones dividen el disco en áreas lógicas que el kernel trata como dispositivos independientes. Herramientas como ioctl (BLKGETSIZE64, BLKSSZGET) permiten obtener el tamaño y geometría desde programas C, mientras que comandos como fdisk, lsblk, hdparm y cat /proc/swaps ofrecen información útil para administración y monitoreo. Comprender estos conceptos es clave para optimizar el almacenamiento y diagnosticar problemas de E/S.",
    improvements:
      "Extender el programa para obtener también el tamaño de sector físico (BLKBSZGET) y la alineación. Implementar una herramienta que muestre la tabla de particiones usando ioctl (FDISK). Calcular el tiempo de acceso promedio midiendo lecturas con posix_fadvise. Investigar el uso de /sys/block/sda/queue/ para parámetros de la cola de E/S."
  },
];

export function ArquiSistem() {
  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
            <Terminal className="size-5 text-emerald-500" />
          </div>
          <div>
            <p
              className="text-xs font-medium text-muted-foreground uppercase tracking-widest"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Tema 6 · {practices.length} Prácticas
            </p>
            <h1
              className="text-foreground"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.75rem", fontWeight: 700 }}
            >
              Arquitectura del sistema de archivos
            </h1>
          </div>
        </div>
        <p
          className="text-muted-foreground leading-relaxed max-w-2xl"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Estructura lógica del sistema de archivos: superbloque, inodos, bloques de datos,
          tipos de archivos (ordinarios, directorios, dispositivos, tuberías), manejo de
          dispositivos de E/S, y funciones como stat, opendir, ioctl.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "superbloque",
            "inodos",
            "directorios",
            "dispositivos de bloque",
            "dispositivos de carácter",
            "tuberías",
            "stat",
            "opendir",
            "ioctl",
          ].map((tag) => (
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