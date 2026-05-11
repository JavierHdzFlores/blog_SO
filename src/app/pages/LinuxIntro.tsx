import { Terminal } from "lucide-react";
import { PracticeCard } from "../components/PracticeCard";
import React from 'react';

interface Practice {
  id: string;
  number: number;
  title: string;
  difficulty: "Básico" | "Intermedio" | "Avanzado";
  tags: string[];
  objective: string;
  theory: string;
  code: string;
  language: string;
  filename: string;
  terminalLines: string[];
  terminalTitle: string;
  conclusion: string;
  improvements: string;
}

const practices: Practice[] = [
  {
    id: "practica-1",
    number: 1,
    title: "Comandos Básicos del Sistema de Archivos",
    difficulty: "Básico" as const,
    tags: ["Linux", "Bash", "Filesystem"],
    objective:
      "Familiarizarse con los comandos fundamentales del sistema de archivos en Linux para navegar directorios, manipular archivos y comprender la jerarquía del sistema.",
    theory: `El sistema de archivos de Linux sigue la jerarquía estándar FHS (Filesystem Hierarchy Standard). Todo parte desde el directorio raíz "/" del cual se desprenden subdirectorios como /home, /bin, /etc, /var, entre otros.

Los comandos que se exploran en esta práctica son los más utilizados en la administración cotidiana de un sistema Linux:

• ls: Lista el contenido de un directorio con opciones para mostrar archivos ocultos (-a) y permisos detallados (-l).
• pwd: Imprime el directorio de trabajo actual (Print Working Directory).
• cd: Cambia el directorio de trabajo (Change Directory).
• mkdir / rmdir: Crean y eliminan directorios respectivamente.
• cp / mv / rm: Copian, mueven y eliminan archivos.
• cat / less / head / tail: Permiten visualizar el contenido de archivos.
• find: Busca archivos y directorios según criterios específicos.`,
    code: `#!/bin/bash
// Script: exploracion_filesystem.sh
// Propósito: Demostrar comandos básicos del sistema de archivos Linux

#include <stdio.h>
#include <stdlib.h>
#include <dirent.h>
#include <sys/stat.h>
#include <string.h>

// Función que lista el contenido de un directorio
void listar_directorio(const char *ruta) {
    DIR *dir;
    struct dirent *entrada;
    struct stat info;
    char ruta_completa[512];

    dir = opendir(ruta);
    if (dir == NULL) {
        printf("ERROR: No se puede abrir el directorio: %s\\n", ruta);
        return;
    }

    printf("\\n=== Contenido de: %s ===\\n\\n", ruta);
    printf("%-30s %-10s %s\\n", "Nombre", "Tipo", "Tamaño");
    printf("%-30s %-10s %s\\n", "------", "----", "------");

    while ((entrada = readdir(dir)) != NULL) {
        // Ignorar directorios . y ..
        if (strcmp(entrada->d_name, ".") == 0 ||
            strcmp(entrada->d_name, "..") == 0)
            continue;

        snprintf(ruta_completa, sizeof(ruta_completa),
                 "%s/%s", ruta, entrada->d_name);
        stat(ruta_completa, &info);

        const char *tipo = S_ISDIR(info.st_mode) ? "DIR" : "FILE";
        printf("%-30s %-10s %ld bytes\\n",
               entrada->d_name, tipo, info.st_size);
    }
    printf("\\n");
    closedir(dir);
}

int main(int argc, char *argv[]) {
    const char *directorio = (argc > 1) ? argv[1] : ".";

    printf("=========================================\\n");
    printf("   Explorador de Sistema de Archivos     \\n");
    printf("   Universidad Tecnológica de la Mixteca \\n");
    printf("=========================================\\n");

    listar_directorio(directorio);

    // Crear un directorio de prueba
    printf("Creando directorio 'practica_utm'...\\n");
    if (mkdir("practica_utm", 0755) == 0)
        printf("[OK] Directorio creado exitosamente.\\n");
    else
        printf("ERROR: No se pudo crear el directorio.\\n");

    return 0;
}`,
    language: "c",
    filename: "exploracion_filesystem.c",
    terminalLines: [
      "$ gcc exploracion_filesystem.c -o explorador",
      "$ ./explorador /home/carlos",
      "",
      "=========================================",
      "   Explorador de Sistema de Archivos     ",
      "   Universidad Tecnológica de la Mixteca ",
      "=========================================",
      "",
      "=== Contenido de: /home/carlos ===",
      "",
      "Nombre                         Tipo       Tamaño",
      "------                         ----       ------",
      "Documentos                     DIR        4096 bytes",
      "Descargas                      DIR        4096 bytes",
      "practica1.c                    FILE       2048 bytes",
      "notas.txt                      FILE       512 bytes",
      "",
      "Creando directorio 'practica_utm'...",
      "[OK] Directorio creado exitosamente.",
      "$ ls -la practica_utm",
      "total 8",
      "drwxr-xr-x 2 carlos carlos 4096 oct 12 10:23 .",
      "drwxr-xr-x 8 carlos carlos 4096 oct 12 10:23 ..",
    ],
    terminalTitle: "Terminal — bash · exploracion_filesystem",
    conclusion:
      "Aprendí que el sistema de archivos de Linux es una estructura jerárquica bien organizada donde cada elemento tiene un propósito definido. Usar la biblioteca dirent.h en C permite manipular directorios de forma programática, lo que me ayudó a entender cómo los comandos de shell como 'ls' funcionan internamente. La función readdir() itera sobre las entradas de un directorio de forma secuencial, similar a cómo el sistema operativo gestiona estas operaciones.",
    improvements:
      "Agregaría soporte para listado recursivo de subdirectorios, implementaría filtros por extensión de archivo, mostraría información detallada de permisos usando el campo st_mode, y permitiría ordenar los resultados por nombre, tamaño o fecha de modificación. También añadiría colores en la salida para diferenciar visualmente los tipos de archivos.",
  },
  {
    id: "practica-2",
    number: 2,
    title: "Gestión de Usuarios y Permisos en Linux",
    difficulty: "Intermedio" as const,
    tags: ["Linux", "Permisos", "chmod", "C"],
    objective:
      "Comprender el modelo de permisos de Linux (propietario, grupo, otros) y manipular permisos de archivos mediante código C usando las llamadas al sistema stat() y chmod().",
    theory: `En Linux, cada archivo y directorio tiene asociados tres conjuntos de permisos que determinan quién puede leer (r), escribir (w) o ejecutar (x) dicho recurso:

• Propietario (owner): El usuario que creó el archivo.
• Grupo (group): Un conjunto de usuarios con acceso compartido.
• Otros (others): El resto de usuarios del sistema.

Los permisos se representan en notación octal, donde cada dígito es la suma de: 4 (lectura) + 2 (escritura) + 1 (ejecución). Por ejemplo, 755 significa rwxr-xr-x.

La llamada al sistema chmod() permite cambiar los permisos de un archivo, mientras que stat() permite leer la información del archivo incluyendo sus permisos actuales, propietario, grupo y tamaño.`,
    code: `#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>
#include <pwd.h>
#include <grp.h>
#include <time.h>

// Convierte bits de permisos a cadena tipo "rwxrwxrwx"
void bits_a_cadena(mode_t modo, char *buf) {
    buf[0] = (modo & S_IRUSR) ? 'r' : '-';
    buf[1] = (modo & S_IWUSR) ? 'w' : '-';
    buf[2] = (modo & S_IXUSR) ? 'x' : '-';
    buf[3] = (modo & S_IRGRP) ? 'r' : '-';
    buf[4] = (modo & S_IWGRP) ? 'w' : '-';
    buf[5] = (modo & S_IXGRP) ? 'x' : '-';
    buf[6] = (modo & S_IROTH) ? 'r' : '-';
    buf[7] = (modo & S_IWOTH) ? 'w' : '-';
    buf[8] = (modo & S_IXOTH) ? 'x' : '-';
    buf[9] = '\\0';
}

void mostrar_info_archivo(const char *nombre_archivo) {
    struct stat info;
    char permisos[10];
    struct passwd *pw;
    struct group  *gr;
    char tiempo[64];

    if (stat(nombre_archivo, &info) == -1) {
        perror("stat");
        return;
    }

    bits_a_cadena(info.st_mode, permisos);
    pw = getpwuid(info.st_uid);
    gr = getgrgid(info.st_gid);
    strftime(tiempo, sizeof(tiempo), "%Y-%m-%d %H:%M",
             localtime(&info.st_mtime));

    printf("\\n--- Información del Archivo ---\\n");
    printf("Archivo   : %s\\n", nombre_archivo);
    printf("Permisos  : %s (octal: %o)\\n", permisos,
           (unsigned)(info.st_mode & 0777));
    printf("Propietario: %s (UID: %d)\\n",
           pw ? pw->pw_name : "desconocido", info.st_uid);
    printf("Grupo     : %s (GID: %d)\\n",
           gr ? gr->gr_name : "desconocido", info.st_gid);
    printf("Tamaño    : %ld bytes\\n", info.st_size);
    printf("Modificado: %s\\n\\n", tiempo);
}

int main() {
    const char *archivo = "prueba_permisos.txt";

    // Crear un archivo de prueba
    FILE *f = fopen(archivo, "w");
    fprintf(f, "Archivo de prueba UTM\\n");
    fclose(f);

    printf("=== ANÁLISIS DE PERMISOS ===\\n");
    mostrar_info_archivo(archivo);

    // Cambiar permisos a 644 (rw-r--r--)
    printf("Aplicando chmod 644...\\n");
    chmod(archivo, S_IRUSR | S_IWUSR | S_IRGRP | S_IROTH);
    mostrar_info_archivo(archivo);

    // Cambiar permisos a 755 (rwxr-xr-x)
    printf("Aplicando chmod 755...\\n");
    chmod(archivo, S_IRWXU | S_IRGRP | S_IXGRP | S_IROTH | S_IXOTH);
    mostrar_info_archivo(archivo);

    return 0;
}`,
    language: "c",
    filename: "permisos.c",
    terminalLines: [
      "$ gcc permisos.c -o permisos",
      "$ ./permisos",
      "",
      "=== ANÁLISIS DE PERMISOS ===",
      "",
      "--- Información del Archivo ---",
      "Archivo   : prueba_permisos.txt",
      "Permisos  : rw-rw-r-- (octal: 664)",
      "Propietario: carlos (UID: 1000)",
      "Grupo     : carlos (GID: 1000)",
      "Tamaño    : 22 bytes",
      "Modificado: 2025-03-15 14:32",
      "",
      "Aplicando chmod 644...",
      "",
      "--- Información del Archivo ---",
      "Permisos  : rw-r--r-- (octal: 644)",
      "Tamaño    : 22 bytes",
      "Modificado: 2025-03-15 14:32",
      "",
      "Aplicando chmod 755...",
      "",
      "--- Información del Archivo ---",
      "Permisos  : rwxr-xr-x (octal: 755)",
      "Tamaño    : 22 bytes",
      "Modificado: 2025-03-15 14:32",
    ],
    terminalTitle: "Terminal — bash · permisos",
    conclusion:
      "Comprendí profundamente cómo Linux implementa la seguridad a nivel de archivo mediante el sistema de permisos basado en bits. La representación octal de los permisos tiene una lógica matemática elegante: cada conjunto de 3 bits representa un dígito octal que codifica los permisos de lectura, escritura y ejecución. La función stat() es extremadamente poderosa, ya que devuelve un struct completo con toda la metadata del archivo.",
    improvements:
      "Implementaría una función recursiva para cambiar permisos en directorios completos (equivalente a chmod -R), agregaría validación de errores más robusta, y crearía una interfaz de usuario interactiva donde el usuario pueda ingresar el nombre del archivo y los permisos deseados en notación simbólica (u+x, g-w, o=r) o en octal. También mostraría el historial de cambios de permisos.",
  },
];

export function LinuxIntro() {
  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30">
            <Terminal className="size-5 text-blue-500" />
          </div>
          <div>
            <p
              className="text-xs font-medium text-muted-foreground uppercase tracking-widest"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Tema 1 · 3 Prácticas
            </p>
            <h1
              className="text-foreground"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.75rem", fontWeight: 700 }}
            >
              Introducción a Linux
            </h1>
          </div>
        </div>
        <p
          className="text-muted-foreground leading-relaxed max-w-2xl"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Esta sección cubre los fundamentos del entorno Linux: navegación del sistema de archivos, gestión de permisos y automatización con scripts de Bash. Es la base sobre la que se construyen los temas más avanzados del curso.
        </p>
        <div className="flex flex-wrap gap-2">
          {["Sistema de Archivos", "Permisos", "Shell Scripting", "C POSIX"].map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Practice Cards */}
      <div className="flex flex-col gap-10">
        {practices.map((p) => (
          <PracticeCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
}
