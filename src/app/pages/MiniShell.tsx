import { useState } from "react";
import { Terminal, ChevronDown, ChevronRight } from "lucide-react";

/* ─── Diagrama: arquitectura del mini shell ─────────────────────── */
function ShellArchDiagram() {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-blue-500/20 bg-muted/30 p-4">
      <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        // diagrama · arquitectura del mini shell
      </p>
      <svg viewBox="0 0 700 220" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl mx-auto">
        <defs>
          <marker id="sarr" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill="#3b82f6" />
          </marker>
        </defs>

        {/* stdin */}
        <rect x="10" y="90" width="90" height="40" rx="8" fill="#1e2a3a" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="55" y="108" textAnchor="middle" fill="#93c5fd" fontSize="10" fontFamily="JetBrains Mono">stdin</text>
        <text x="55" y="122" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter">fgets()</text>

        {/* Parser */}
        <rect x="145" y="75" width="110" height="70" rx="8" fill="#1e2a3a" stroke="#3b82f6" strokeWidth="1.5"/>
        <text x="200" y="97" textAnchor="middle" fill="#93c5fd" fontSize="10" fontFamily="JetBrains Mono">Parser</text>
        <text x="200" y="111" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter">strtok()</text>
        <text x="200" y="124" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter">cmd/arg/flag</text>
        <text x="200" y="137" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter">historial[]</text>

        {/* Despachador */}
        <rect x="305" y="60" width="130" height="100" rx="8" fill="#1a2a1a" stroke="#10b981" strokeWidth="1.8"/>
        <text x="370" y="85" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="JetBrains Mono">Despachador</text>
        <text x="370" y="100" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter">strcmp(cmd, "ls") → ls()</text>
        <text x="370" y="113" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter">strcmp(cmd, "cd") → cd()</text>
        <text x="370" y="126" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter">strcmp(cmd, "who") → who()</text>
        <text x="370" y="139" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter">... 20+ comandos</text>
        <text x="370" y="152" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter">else → error</text>

        {/* Kernel */}
        <rect x="490" y="75" width="120" height="70" rx="8" fill="#2a1a1a" stroke="#f59e0b" strokeWidth="1.5"/>
        <text x="550" y="97" textAnchor="middle" fill="#fcd34d" fontSize="10" fontFamily="JetBrains Mono">Syscalls</text>
        <text x="550" y="111" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter">opendir/readdir/stat</text>
        <text x="550" y="124" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter">chdir/getcwd/mkdir</text>
        <text x="550" y="137" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter">socket/ioctl/sysinfo</text>

        {/* flechas */}
        <line x1="100" y1="110" x2="143" y2="110" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#sarr)"/>
        <line x1="255" y1="110" x2="303" y2="110" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#sarr)"/>
        <line x1="435" y1="110" x2="488" y2="110" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#sarr)"/>

        {/* historial label */}
        <text x="55" y="175" textAnchor="middle" fill="#4b5563" fontSize="8" fontFamily="Inter">Historial circular</text>
        <text x="55" y="186" textAnchor="middle" fill="#4b5563" fontSize="8" fontFamily="JetBrains Mono">MAX_HIST=512</text>
      </svg>
    </div>
  );
}

/* ─── Badge item ────────────────────────────────────────────────── */
function Item({ code, label, color = "blue" }: { code: string; label: string; color?: string }) {
  const colors: Record<string, string> = {
    blue:   "bg-blue-500/10 text-blue-400 border-blue-500/30",
    green:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    amber:  "bg-amber-500/10 text-amber-400 border-amber-500/30",
    red:    "bg-red-500/10 text-red-400 border-red-500/30",
    gray:   "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };
  return (
    <li className="flex items-start gap-2 py-0.5 text-sm">
      <span className={`mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono border shrink-0 ${colors[color]}`}>{code}</span>
      <span className="text-muted-foreground">{label}</span>
    </li>
  );
}

/* ─── Acordeón de sección ───────────────────────────────────────── */
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between px-4 py-2.5 bg-muted/40 hover:bg-muted/70 transition-colors text-left">
        <span className="text-xs font-semibold text-foreground uppercase tracking-wide" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
        {open ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronRight className="size-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 py-3 bg-card">{children}</div>}
    </div>
  );
}

/* ─── Bloque de código con scroll ────────────────────────────────── */
const SHELL_CODE = `#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <dirent.h>
#include <sys/stat.h>
#include <sys/sysmacros.h>
#include <string.h>
#include <time.h>
#include <limits.h>
#include <pwd.h>
#include <grp.h>
#include <sys/statvfs.h>
#include <sys/utsname.h>
#include <locale.h>
#include <utmp.h>
#include <sys/sysinfo.h>
#include <sys/msg.h>
#include <errno.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/ioctl.h>
#include <netinet/in.h>
#include <net/if.h>
#include <arpa/inet.h>

#define PATH_MAX  4096
#define RUTA      1024
#define MAX_CMD   400
#define MAX_HIST  512
#define DIR_PERMS (S_IRWXU | S_IRWXG | S_IRWXO)

/* ── Variables globales ── */
char historial[MAX_HIST][MAX_CMD];
int  posicion_actual = 0;
int  total_comandos  = 0;

/* ── Estructura de colores por tipo de archivo ── */
typedef struct { char color[20]; char tipo[20]; } ColorArchivo;
ColorArchivo colores[5] = {
    {"\x1b[34m", "directory"},   /* azul       */
    {"\x1b[32m", "regular"},     /* verde       */
    {"\x1b[33m", "executable"},  /* amarillo    */
    {"\x1b[35m", "link"},        /* magenta     */
    {"\x1b[31m", "other"}        /* rojo        */
};

/* ── Estructura de mensajes IPC ── */
struct msgbuf { long mtype; char mtext[MAX_HIST]; };

/* ── Prototipos ── */
void obtener_mac_tarjetas();
void obtener_ips_tarjetas();
void obtener_conectividad();
void obtener_date();
void historial_comandos();
void pwd(char *r);
void cambiar_directorio(char *path);
void crear_directorio(char *path);
void listar_directorio(char *path, char *bandera);
void mostrar_info_archivo(char *path);
void mostrar_info_sistema_archivos(char *path);
void visualizar_contenido_archivo(char *path);
void borrar_archivo(char *path);
void renombrar_archivo(char *old_path, char *new_path);
void encontrar_archivo_normal(char *path, char *name);
void mostrar_info_sistem(char *bandera);
void enviar_mensaje_wall(char *mensaje);
void mostrar_free();
void mostrar_numeros_dispositivo(char *path);
void encontrar_archivo_recursivo(char *path, char *name);
void enviar_por_cola(char *nombre_usuario, char *texto);
void leer_buzon(char *mi_nombre);
void enviar_mesg(char *usuario, char *mensaje);

/* ════════════════════════════════════════════
   MAIN — Bucle principal del mini shell
   ════════════════════════════════════════════ */
int main(void) {
    char sentencia[MAX_CMD];
    char comando[50], argumento_aux[50], argumento[200], bandera[50];
    const char delimitador[] = " ";
    int  centinela = 1, flag_sudo = 0;
    char *token;

    while (centinela == 1) {
        printf("\\033[32m> \\033[0m");
        if (fgets(sentencia, sizeof(sentencia), stdin) == NULL) break;

        /* Inicializar campos */
        comando[0] = argumento[0] = bandera[0] = argumento_aux[0] = '\\0';
        sentencia[strcspn(sentencia, "\\n")] = '\\0';

        /* Guardar en historial circular */
        if (strlen(sentencia) > 0) {
            strncpy(historial[posicion_actual], sentencia, MAX_CMD - 1);
            historial[posicion_actual][MAX_CMD - 1] = '\\0';
            posicion_actual = (posicion_actual + 1) % MAX_HIST;
            total_comandos++;
        }

        /* Tokenizar: cmd [arg] [-flag] [arg2] */
        token = strtok(sentencia, delimitador);
        if (token == NULL) continue;

        if (strcmp(token, "sudo") == 0) {
            flag_sudo = 1;
            token = strtok(NULL, delimitador);
            if (token == NULL) continue;
        }
        strcpy(comando, token);

        token = strtok(NULL, delimitador);
        while (token != NULL) {
            if (token[0] == '-') {
                strcpy(bandera, token);
            } else {
                if (argumento[0] == '\\0') {
                    strcpy(argumento, token);
                } else {
                    if (strcmp(comando, "wall") == 0) {
                        strcat(argumento, " "); strcat(argumento, token);
                    } else if (strcmp(comando, "mesg") == 0 || strcmp(comando, "wmesg") == 0) {
                        if (argumento_aux[0] != '\\0') strcat(argumento_aux, " ");
                        strcat(argumento_aux, token);
                    } else {
                        strcpy(argumento_aux, token);
                    }
                }
            }
            token = strtok(NULL, delimitador);
        }

        /* ── Tabla de despacho ── */
        if      (strcmp(comando, "exit")     == 0) centinela = 0;
        else if (strcmp(comando, "pwd")      == 0) pwd(argumento);
        else if (strcmp(comando, "cd")       == 0) cambiar_directorio(argumento[0] ? argumento : NULL);
        else if (strcmp(comando, "ls")       == 0) listar_directorio(argumento[0] ? argumento : NULL, bandera);
        else if (strcmp(comando, "mkdir")    == 0) {
            if (!argumento[0]) fprintf(stderr, "Uso: mkdir <dir>\\n");
            else crear_directorio(argumento);
        }
        else if (strcmp(comando, "stat")     == 0) {
            if (!argumento[0]) fprintf(stderr, "Uso: stat <ruta>\\n");
            else mostrar_info_archivo(argumento);
        }
        else if (strcmp(comando, "vfstat")   == 0) {
            if (!argumento[0]) fprintf(stderr, "Uso: vfstat <ruta>\\n");
            else mostrar_info_sistema_archivos(argumento);
        }
        else if (strcmp(comando, "cat")      == 0) {
            if (!argumento[0]) fprintf(stderr, "Uso: cat <archivo>\\n");
            else visualizar_contenido_archivo(argumento);
        }
        else if (strcmp(comando, "unlink")   == 0) {
            if (!argumento[0]) fprintf(stderr, "Uso: unlink <archivo>\\n");
            else borrar_archivo(argumento);
        }
        else if (strcmp(comando, "rename")   == 0) {
            if (!argumento[0] || !argumento_aux[0]) fprintf(stderr, "Uso: rename <viejo> <nuevo>\\n");
            else renombrar_archivo(argumento, argumento_aux);
        }
        else if (strcmp(comando, "find")     == 0) {
            if (!argumento[0]) fprintf(stderr, "Uso: find <ruta> <nombre>\\n");
            else encontrar_archivo_normal(argumento, argumento_aux);
        }
        else if (strcmp(comando, "findr")    == 0) {
            if (!argumento[0] || !argumento_aux[0]) fprintf(stderr, "Uso: findr <ruta> <nombre>\\n");
            else encontrar_archivo_recursivo(argumento, argumento_aux);
        }
        else if (strcmp(comando, "uname")    == 0) mostrar_info_sistem(bandera);
        else if (strcmp(comando, "date")     == 0) obtener_date();
        else if (strcmp(comando, "who")      == 0) obtener_conectividad();
        else if (strcmp(comando, "ip")       == 0) obtener_ips_tarjetas();
        else if (strcmp(comando, "mac")      == 0) obtener_mac_tarjetas();
        else if (strcmp(comando, "free")     == 0) mostrar_free();
        else if (strcmp(comando, "history")  == 0) historial_comandos();
        else if (strcmp(comando, "numerosdisp") == 0) {
            if (!argumento[0]) fprintf(stderr, "Uso: numerosdisp <disp>\\n");
            else mostrar_numeros_dispositivo(argumento);
        }
        else if (strcmp(comando, "wall") == 0 && flag_sudo) enviar_mensaje_wall(argumento);
        else if (strcmp(comando, "mesgc")    == 0) {
            if (!argumento[0] || !argumento_aux[0]) fprintf(stderr, "usar: mesgc <usuario> <msg>\\n");
            else enviar_por_cola(argumento, argumento_aux);
        }
        else if (strcmp(comando, "leer")     == 0) {
            if (!argumento[0]) fprintf(stderr, "usar: leer <usuario>\\n");
            else leer_buzon(argumento);
        }
        else if (strcmp(comando, "mesg")     == 0) {
            if (!argumento[0] || !argumento_aux[0]) fprintf(stderr, "Uso: mesg <usuario> <msg>\\n");
            else enviar_mesg(argumento, argumento_aux);
        }
        else fprintf(stderr, "Comando no reconocido: %s\\n", comando);
    }
    return 0;
}

/* ════════════════════════════════════════════
   IMPLEMENTACIONES
   ════════════════════════════════════════════ */

void leer_buzon(char *mi_nombre) {
    key_t llave = ftok("/tmp", mi_nombre[0]);
    int qid;
    struct msgbuf msg;
    if ((qid = msgget(llave, 0666)) == -1) {
        printf("No hay mensajes pendientes para: %s\\n", mi_nombre); return;
    }
    if (msgrcv(qid, (void *)&msg, sizeof(msg.mtext), 1, IPC_NOWAIT) == -1) {
        if (errno == ENOMSG) printf("El buzón está vacío.\\n");
        else perror("msgrcv");
    } else {
        printf("Mensaje: %s\\n", msg.mtext);
    }
}

void enviar_por_cola(char *nombre_usuario, char *texto) {
    int qid;
    key_t llave = ftok("/tmp", nombre_usuario[0]);
    struct msgbuf msg;
    if ((qid = msgget(llave, IPC_CREAT | 0666)) == -1) { perror("msgget"); return; }
    msg.mtype = 1;
    snprintf(msg.mtext, sizeof(msg.mtext), "%s", texto);
    if (msgsnd(qid, (void *)&msg, sizeof(msg.mtext), IPC_NOWAIT) == -1) perror("msgsnd");
    else printf("Mensaje enviado a %s\\n", nombre_usuario);
}

void enviar_mesg(char *usuario, char *mensaje) {
    char cmd[PATH_MAX];
    snprintf(cmd, sizeof(cmd),
        "echo -e \\"\\r\\n\\007*** MENSAJE PRIVADO ***\\r\\n%s\\r\\n\\" | sudo write %s",
        mensaje, usuario);
    if (system(cmd) == -1) perror("write");
    else printf("Mensaje enviado a %s\\n", usuario);
}

void mostrar_numeros_dispositivo(char *path) {
    struct stat sb;
    if (stat(path, &sb) == -1) { perror("stat"); return; }
    printf("Archivo: %s\\n", path);
    if      (S_ISCHR(sb.st_mode)) printf("Tipo: Char device\\n");
    else if (S_ISBLK(sb.st_mode)) printf("Tipo: Block device\\n");
    else { printf("No es un dispositivo\\n"); return; }
    printf("Major: %u\\nMinor: %u\\n", major(sb.st_rdev), minor(sb.st_rdev));
}

void mostrar_free() {
    struct sysinfo info;
    if (sysinfo(&info) != 0) { perror("sysinfo"); return; }
    unsigned long total = (info.totalram * info.mem_unit) / 1024;
    unsigned long libre = (info.freeram  * info.mem_unit) / 1024;
    unsigned long comp  = (info.sharedram* info.mem_unit) / 1024;
    unsigned long buf   = (info.bufferram* info.mem_unit) / 1024;
    unsigned long ts    = (info.totalswap* info.mem_unit) / 1024;
    unsigned long ls    = (info.freeswap * info.mem_unit) / 1024;
    printf("\\n               total   usada   libre  compart. buff/cache  disp.\\n");
    printf("Mem:    %12lu%8lu%8lu%9lu%11lu%8lu\\n",
           total, total-libre, libre, comp, buf, libre+buf);
    printf("Swap:   %12lu%8lu%8lu\\n", ts, ts-ls, ls);
}

void enviar_mensaje_wall(char *mensaje) {
    if (!mensaje || !strlen(mensaje)) { fprintf(stderr, "wall: mensaje vacío\\n"); return; }
    char cmd[RUTA];
    snprintf(cmd, sizeof(cmd), "sudo wall \\"%s\\"", mensaje);
    printf("Difundiendo mensaje...\\n");
    if (system(cmd) == -1) perror("wall");
}

void obtener_mac_tarjetas() {
    int sock = socket(AF_INET, SOCK_DGRAM, 0);
    if (sock < 0) { perror("socket"); return; }
    struct ifconf ifc; struct ifreq ifr[16];
    ifc.ifc_len = sizeof(ifr); ifc.ifc_req = ifr;
    if (ioctl(sock, SIOCGIFCONF, &ifc) == -1) { perror("SIOCGIFCONF"); close(sock); return; }
    int n = ifc.ifc_len / sizeof(struct ifreq);
    for (int i = 0; i < n; i++) {
        struct ifreq ifr_mac;
        strncpy(ifr_mac.ifr_name, ifr[i].ifr_name, IFNAMSIZ-1);
        ifr_mac.ifr_name[IFNAMSIZ-1] = '\\0';
        if (ioctl(sock, SIOCGIFHWADDR, &ifr_mac) == -1) continue;
        unsigned char *mac = (unsigned char *)ifr_mac.ifr_hwaddr.sa_data;
        printf("%s:\\t%02X:%02X:%02X:%02X:%02X:%02X\\n",
               ifr[i].ifr_name, mac[0],mac[1],mac[2],mac[3],mac[4],mac[5]);
    }
    close(sock);
}

void obtener_ips_tarjetas() {
    int sock = socket(AF_INET, SOCK_DGRAM, 0);
    if (sock < 0) { perror("socket"); return; }
    struct ifconf ifc; struct ifreq ifr[16];
    ifc.ifc_len = sizeof(ifr); ifc.ifc_req = ifr;
    if (ioctl(sock, SIOCGIFCONF, &ifc) == -1) { perror("SIOCGIFCONF"); close(sock); return; }
    int n = ifc.ifc_len / sizeof(struct ifreq);
    for (int i = 0; i < n; i++) {
        struct sockaddr_in *ip = (struct sockaddr_in *)&ifr[i].ifr_addr;
        printf("%s:\\t%s\\n", ifr[i].ifr_name, inet_ntoa(ip->sin_addr));
    }
    close(sock);
}

void obtener_conectividad() {
    struct utmp *entry;
    struct tm *tm_info; char buf[100];
    setutent();
    while ((entry = getutent()) != NULL) {
        if (entry->ut_type == USER_PROCESS) {
            time_t t = entry->ut_tv.tv_sec;
            tm_info = localtime(&t);
            strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M", tm_info);
            printf("%-15s %-15s %-10s %s\\n",
                   entry->ut_user, entry->ut_line, entry->ut_host, buf);
        }
    }
    endutent();
}

void obtener_date() {
    time_t t = time(NULL);
    struct tm *tm_info = localtime(&t);
    char buf[100];
    strftime(buf, sizeof(buf), "%A, %d de %B de %Y — %H:%M:%S %Z", tm_info);
    printf("%s\\n", buf);
}

void historial_comandos() {
    int inicio = (total_comandos < MAX_HIST) ? 0 : posicion_actual;
    int cant   = (total_comandos < MAX_HIST) ? total_comandos : MAX_HIST;
    for (int i = 0; i < cant; i++)
        printf("%d. %s\\n", i+1, historial[(inicio+i) % MAX_HIST]);
}

void pwd(char *r) {
    char buf[PATH_MAX];
    if (getcwd(buf, sizeof(buf)) == NULL) perror("getcwd");
    else printf("%s\\n", buf);
    (void)r;
}

void cambiar_directorio(char *path) {
    const char *dest = path ? path : getenv("HOME");
    if (chdir(dest) == 0) printf("Directorio cambiado a: %s\\n", dest);
    else perror("chdir");
}

void crear_directorio(char *path) {
    if (mkdir(path, DIR_PERMS) == 0) printf("Directorio '%s' creado.\\n", path);
    else perror("mkdir");
}

void borrar_archivo(char *path) {
    if (unlink(path) == 0) printf("Archivo '%s' eliminado.\\n", path);
    else perror("unlink");
}

void renombrar_archivo(char *old_path, char *new_path) {
    if (rename(old_path, new_path) == 0)
        printf("'%s' renombrado a '%s'.\\n", old_path, new_path);
    else perror("rename");
}

void visualizar_contenido_archivo(char *path) {
    FILE *f = fopen(path, "r");
    if (!f) { perror("fopen"); return; }
    char buf[1024]; size_t n;
    while ((n = fread(buf, 1, sizeof(buf), f)) > 0) fwrite(buf, 1, n, stdout);
    fclose(f);
}

void mostrar_info_archivo(char *path) {
    struct stat info;
    if (stat(path, &info) == -1) { perror("stat"); return; }
    printf("Archivo:        %s\\n", path);
    printf("Tamaño:         %ld bytes\\n", info.st_size);
    printf("Permisos:       %o\\n", info.st_mode & 0777);
    printf("Enlaces:        %ld\\n", info.st_nlink);
    printf("UID/GID:        %d/%d\\n", info.st_uid, info.st_gid);
    printf("Último acceso:  %s", ctime(&info.st_atime));
    printf("Modificación:   %s", ctime(&info.st_mtime));
}

void mostrar_info_sistema_archivos(char *path) {
    struct statvfs sv;
    if (statvfs(path, &sv) == -1) { perror("statvfs"); return; }
    printf("Sistema de archivos: %s\\n", path);
    printf("Tamaño bloque:   %lu bytes\\n", sv.f_bsize);
    printf("Bloques totales: %lu\\n", sv.f_blocks);
    printf("Bloques libres:  %lu\\n", sv.f_bfree);
    printf("Inodos totales:  %lu\\n", sv.f_files);
    printf("Inodos libres:   %lu\\n", sv.f_ffree);
}

void mostrar_info_sistem(char *bandera) {
    struct utsname u;
    if (uname(&u) == -1) { perror("uname"); return; }
    if (!bandera || !bandera[0] || strcmp(bandera, "-a") == 0)
        printf("%s %s %s %s %s\\n", u.sysname, u.nodename, u.release, u.version, u.machine);
    else if (strcmp(bandera, "-s") == 0) printf("%s\\n", u.sysname);
    else if (strcmp(bandera, "-r") == 0) printf("%s\\n", u.release);
    else if (strcmp(bandera, "-m") == 0) printf("%s\\n", u.machine);
    else printf("%s %s %s %s %s\\n", u.sysname, u.nodename, u.release, u.version, u.machine);
}

void encontrar_archivo_normal(char *path, char *name) {
    DIR *dir = opendir(path);
    if (!dir) { perror("opendir"); return; }
    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        if (name && strlen(name) > 0 && strcmp(entry->d_name, name) == 0)
            printf("Encontrado: %s/%s\\n", path, entry->d_name);
    }
    closedir(dir);
}

void encontrar_archivo_recursivo(char *path, char *name) {
    DIR *dir = opendir(path);
    if (!dir) return;
    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        if (strcmp(entry->d_name, ".") == 0 || strcmp(entry->d_name, "..") == 0) continue;
        char ruta[PATH_MAX];
        snprintf(ruta, sizeof(ruta), "%s/%s", path, entry->d_name);
        struct stat st;
        if (stat(ruta, &st) == -1) continue;
        if (strcmp(entry->d_name, name) == 0) printf("Encontrado: %s\\n", ruta);
        if (S_ISDIR(st.st_mode)) encontrar_archivo_recursivo(ruta, name);
    }
    closedir(dir);
}

void listar_directorio(char *path, char *bandera) {
    char ruta_actual[RUTA];
    const char *dir_path = path;
    int flag_a = 0, flag_l = 0, flag_i = 0;

    if (bandera && bandera[0] == '-') {
        if (strchr(bandera, 'a')) flag_a = 1;
        if (strchr(bandera, 'l')) flag_l = 1;
        if (strchr(bandera, 'i')) flag_i = 1;
    }

    if (!path) {
        if (getcwd(ruta_actual, sizeof(ruta_actual)) == NULL) { perror("getcwd"); return; }
        dir_path = ruta_actual;
    }

    DIR *dir = opendir(dir_path);
    if (!dir) { perror("opendir"); return; }

    printf("Contenido de '%s':\\n", dir_path);
    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        if (!flag_a && entry->d_name[0] == '.') continue;
        char ruta_completa[PATH_MAX];
        snprintf(ruta_completa, sizeof(ruta_completa), "%s/%s", dir_path, entry->d_name);
        struct stat info;
        if (stat(ruta_completa, &info) == -1) continue;

        char *color = colores[4].color;
        if      (S_ISLNK(info.st_mode))                          color = colores[3].color;
        else if (S_ISDIR(info.st_mode))                          color = colores[0].color;
        else if (S_ISREG(info.st_mode) && (info.st_mode & S_IXUSR)) color = colores[2].color;
        else if (S_ISREG(info.st_mode))                          color = colores[1].color;

        if (flag_i) printf("%lu ", entry->d_ino);

        if (flag_l) {
            char permisos[11];
            permisos[0] = S_ISDIR(info.st_mode) ? 'd' : (S_ISLNK(info.st_mode) ? 'l' : '-');
            permisos[1] = (info.st_mode & S_IRUSR) ? 'r' : '-';
            permisos[2] = (info.st_mode & S_IWUSR) ? 'w' : '-';
            permisos[3] = (info.st_mode & S_IXUSR) ? 'x' : '-';
            permisos[4] = (info.st_mode & S_IRGRP) ? 'r' : '-';
            permisos[5] = (info.st_mode & S_IWGRP) ? 'w' : '-';
            permisos[6] = (info.st_mode & S_IXGRP) ? 'x' : '-';
            permisos[7] = (info.st_mode & S_IROTH) ? 'r' : '-';
            permisos[8] = (info.st_mode & S_IWOTH) ? 'w' : '-';
            permisos[9] = (info.st_mode & S_IXOTH) ? 'x' : '-';
            permisos[10] = '\\0';
            char tiempo[20];
            strftime(tiempo, sizeof(tiempo), "%b %d %H:%M", localtime(&info.st_mtime));
            struct passwd *pw = getpwuid(info.st_uid);
            struct group  *gr = getgrgid(info.st_gid);
            printf("%s %ld %s %s %8ld %s ",
                   permisos, info.st_nlink,
                   pw ? pw->pw_name : "?", gr ? gr->gr_name : "?",
                   info.st_size, tiempo);
        }
        printf("%s%s\\033[0m\\n", color, entry->d_name);
    }
    closedir(dir);
}`;

/* ─── Secciones de "lo que aprendimos" ─────────────────────────── */
const aprendizajes = [
  {
    nombre: "Javier Hernandez",
    avatar: "JH",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    texto: "Construir el mini shell desde cero me hizo entender que casi nada en Linux es magia: ls es opendir+readdir+stat, ip es socket+ioctl, who es leer /run/utmp. Una vez que ves la syscall detrás de cada comando, el SO deja de ser una caja negra. La tabla de despacho con strcmp() fue la clave para organizar más de 20 comandos de forma limpia.",
  },
  {
    nombre: "Marlen",
    avatar: "MR",
    color: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    texto: "Lo más interesante fue el historial circular con el arreglo de MAX_HIST=512 entradas y la posición que avanza con módulo. El shell es el orquestador clásico: lee, parsea, despacha. Implementar comandos como cd o pwd me hizo apreciar lo que damos por sentado: cada cambio de directorio implica una llamada al kernel con validación de permisos.",
  },
];

/* ─── Tabla de comandos ─────────────────────────────────────────── */
const comandos = [
  { cmd: "pwd",         syscall: "getcwd()",             desc: "Imprime el directorio de trabajo actual." },
  { cmd: "cd <path>",   syscall: "chdir()",               desc: "Cambia el directorio de trabajo." },
  { cmd: "ls [-ali]",   syscall: "opendir/readdir/stat()", desc: "Lista el contenido con colores por tipo de archivo." },
  { cmd: "mkdir <dir>", syscall: "mkdir()",               desc: "Crea un nuevo directorio con permisos rwxrwxrwx." },
  { cmd: "cat <file>",  syscall: "fopen/fread/fwrite()",  desc: "Muestra el contenido de un archivo." },
  { cmd: "stat <path>", syscall: "stat()",                desc: "Información detallada: tamaño, permisos, UID, fechas." },
  { cmd: "unlink <f>",  syscall: "unlink()",              desc: "Elimina un archivo del sistema de archivos." },
  { cmd: "rename <v> <n>", syscall: "rename()",           desc: "Renombra o mueve un archivo." },
  { cmd: "find <r> <n>",syscall: "opendir/readdir()",     desc: "Busca un archivo en el directorio indicado." },
  { cmd: "findr <r> <n>", syscall: "stat+recursión",      desc: "Búsqueda recursiva de archivo en árbol de directorios." },
  { cmd: "vfstat <r>",  syscall: "statvfs()",             desc: "Info del sistema de archivos: bloques, inodos libres." },
  { cmd: "uname [-a]",  syscall: "uname()",               desc: "Info del kernel: nombre, versión, arquitectura." },
  { cmd: "date",        syscall: "time/localtime/strftime()", desc: "Fecha y hora actual formateada." },
  { cmd: "who",         syscall: "getutent()",            desc: "Sesiones de usuario activas desde /run/utmp." },
  { cmd: "ip",          syscall: "socket/ioctl(SIOCGIFCONF)", desc: "IPs de todas las interfaces de red." },
  { cmd: "mac",         syscall: "ioctl(SIOCGIFHWADDR)",  desc: "Direcciones MAC de las tarjetas de red." },
  { cmd: "free",        syscall: "sysinfo()",             desc: "Uso de memoria RAM y swap en KiB." },
  { cmd: "history",     syscall: "— (buffer circular)",   desc: "Historial de hasta 512 comandos ingresados." },
  { cmd: "numerosdisp <d>", syscall: "stat/major/minor()",desc: "Números mayor y menor de un dispositivo." },
  { cmd: "sudo wall <msg>", syscall: "system('wall ...')", desc: "Difunde un mensaje a todos los usuarios." },
  { cmd: "mesg <u> <m>",syscall: "system('write ...')",   desc: "Envía mensaje privado por TTY a un usuario." },
  { cmd: "mesgc <u> <m>",syscall: "msgget/msgsnd()",      desc: "Envía mensaje por cola IPC System V." },
  { cmd: "leer <u>",    syscall: "msgget/msgrcv()",       desc: "Lee el buzón de mensajes IPC de un usuario." },
  { cmd: "exit",        syscall: "—",                     desc: "Termina el mini shell." },
];

/* ─── Componente principal ──────────────────────────────────────── */
export function MiniShell() {
  const [showCode, setShowCode] = useState(false);
  const [showTerm, setShowTerm] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30">
            <Terminal className="size-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Proyecto Integrador · 24 Comandos
            </p>
            <h1 className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.75rem", fontWeight: 700 }}>
              Mini Shell en C
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed max-w-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
          Shell interactivo implementado desde cero en C usando únicamente llamadas al sistema de Linux. Implementa más de 20 comandos con parser propio, historial circular de 512 entradas, colores por tipo de archivo y mensajería IPC con colas System V.
        </p>
        <div className="flex flex-wrap gap-2">
          {["syscalls", "opendir", "stat", "socket", "ioctl", "sysinfo", "msgget", "msgsnd", "uname", "getutent"].map(t => (
            <span key={t} className="px-2.5 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20" style={{ fontFamily: "'Inter', sans-serif" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Arquitectura */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>// arquitectura del sistema</p>
        <ShellArchDiagram />
        <div className="flex flex-col gap-2 mt-4">
          <Section label="Estructura interna del parser">
            <ul className="flex flex-col gap-1.5">
              <Item code="sentencia[]"    label="Buffer de MAX_CMD=400 chars leído con fgets() desde stdin." color="blue"/>
              <Item code="strtok()"       label="Tokeniza la sentencia separando: comando, argumento, bandera (-a, -l…), argumento_aux." color="blue"/>
              <Item code="flag_sudo"      label="Detecta el prefijo sudo antes del comando para habilitar operaciones privilegiadas." color="amber"/>
              <Item code="historial[][]"  label="Buffer circular bidimensional de MAX_HIST=512 × MAX_CMD=400. Posición avanza con módulo." color="green"/>
            </ul>
          </Section>
          <Section label="Coloreado de salida de ls">
            <ul className="flex flex-col gap-1.5">
              <Item code="\033[34m" label="Azul → directorios (S_ISDIR)." color="blue"/>
              <Item code="\033[32m" label="Verde → archivos regulares (S_ISREG sin bit x)." color="green"/>
              <Item code="\033[33m" label="Amarillo → ejecutables (S_ISREG + S_IXUSR)." color="amber"/>
              <Item code="\033[35m" label="Magenta → enlaces simbólicos (S_ISLNK)." color="gray"/>
              <Item code="\033[31m" label="Rojo → otros tipos (dispositivos, sockets, FIFOs…)." color="red"/>
            </ul>
          </Section>
          <Section label="Mensajería IPC System V integrada">
            <ul className="flex flex-col gap-1.5">
              <Item code="mesgc <u> <msg>" label="Genera llave con ftok('/tmp', usuario[0]) y envía con msgsnd(IPC_NOWAIT)." color="blue"/>
              <Item code="leer <u>"        label="Abre la cola del usuario y lee con msgrcv(IPC_NOWAIT). Si no hay mensajes, informa." color="blue"/>
              <Item code="mesg <u> <msg>"  label="Usa system('sudo write usuario') para mensaje directo por TTY." color="amber"/>
            </ul>
          </Section>
        </div>
      </div>

      {/* Tabla de comandos */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>// tabla de comandos implementados</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Comando</th>
                <th className="text-left py-2 pr-4 text-muted-foreground font-semibold">Syscall</th>
                <th className="text-left py-2 text-muted-foreground font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {comandos.map((c, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="py-1.5 pr-4 text-blue-400">{c.cmd}</td>
                  <td className="py-1.5 pr-4 text-amber-400">{c.syscall}</td>
                  <td className="py-1.5 text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>{c.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Código completo con scroll */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <button
          onClick={() => setShowCode(v => !v)}
          className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3 hover:text-blue-300 transition-colors"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {showCode ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
          // código completo — shellF.c ({SHELL_CODE.split("\n").length} líneas)
        </button>
        {showCode ? (
          <div className="rounded-xl border border-border bg-[#0d1117] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/10">
              <span className="text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>shellF.c</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">C · Linux syscalls</span>
            </div>
            <div className="overflow-auto max-h-[32rem] p-4">
              <pre className="text-xs text-green-300 leading-relaxed whitespace-pre" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{SHELL_CODE}</pre>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowCode(true)} className="w-full text-left px-4 py-3 rounded-xl border border-dashed border-border hover:border-blue-500/40 hover:bg-blue-500/5 transition-all text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            ▶ mostrar shellF.c completo (scroll disponible)
          </button>
        )}
      </div>

      {/* Terminal */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <button
          onClick={() => setShowTerm(v => !v)}
          className="flex items-center gap-2 text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-3 hover:text-emerald-300 transition-colors"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {showTerm ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
          // demostración en terminal
        </button>
        {showTerm ? (
          <div className="rounded-xl border border-border bg-[#0a0f0a] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/10">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <span className="ml-2 text-[10px] text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Terminal — Mini Shell</span>
            </div>
            <div className="overflow-auto max-h-96 p-4">
              {[
                "$ gcc shellF.c -o shell && ./shell",
                "> pwd",
                "/home/javier/SistemasOperativos",
                "> ls -la",
                "Contenido de '/home/javier/SistemasOperativos':",
                "drwxrwxrwx 2 javier javier     4096 May 14 09:00 \u001b[34mpracticas\u001b[0m",
                "-rwxr-xr-x 1 javier javier    42580 May 14 09:01 \u001b[33mshell\u001b[0m",
                "-rw-r--r-- 1 javier javier    18432 May 14 09:00 \u001b[32mshellF.c\u001b[0m",
                "> date",
                "miércoles, 14 de mayo de 2025 — 09:02:15 CST",
                "> uname -a",
                "Linux parrot 6.1.0-parrot1 #1 SMP x86_64 GNU/Linux",
                "> free",
                "               total   usada   libre  compart. buff/cache  disp.",
                "Mem:        8192000 3120448 2048576    524288   1022976 2654432",
                "Swap:       2097152  102400 1994752",
                "> ip",
                "lo:     127.0.0.1",
                "eth0:   192.168.1.105",
                "> mac",
                "lo:     00:00:00:00:00:00",
                "eth0:   A4:C3:F0:2B:8E:11",
                "> who",
                "javier          tty2            192.168.1.1     2025-05-14 08:55",
                "> stat shellF.c",
                "Archivo:        shellF.c",
                "Tamaño:         18432 bytes",
                "Permisos:       644",
                "UID/GID:        1000/1000",
                "Último acceso:  Wed May 14 09:00:12 2025",
                "> mesgc javier Hola desde el shell",
                "Mensaje enviado a javier",
                "> leer javier",
                "Mensaje: Hola desde el shell",
                "> history",
                "1. pwd",
                "2. ls -la",
                "3. date",
                "4. uname -a",
                "5. free",
                "6. ip",
                "7. mac",
                "8. who",
                "9. stat shellF.c",
                "10. mesgc javier Hola desde el shell",
                "11. leer javier",
                "12. history",
                "> exit",
                "$",
              ].map((line, i) => (
                <p key={i} className={`text-xs leading-5 ${line.startsWith(">") ? "text-emerald-400" : line.startsWith("$") ? "text-blue-400" : "text-gray-300"}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>{line || "\u00A0"}</p>
              ))}
            </div>
          </div>
        ) : (
          <button onClick={() => setShowTerm(true)} className="w-full text-left px-4 py-3 rounded-xl border border-dashed border-border hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            ▶ mostrar sesión de terminal
          </button>
        )}
      </div>

      {/* Mejoras propuestas */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>// mejoras propuestas</p>
        <div className="flex flex-col gap-2">
          <Section label="Ejecución de programas externos (fork + exec)">
            <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Actualmente el shell solo ejecuta comandos internos. La mejora principal sería agregar un fallback que haga <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-blue-400">fork() + execvp()</code> para cualquier comando no reconocido, como lo hace bash con <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-blue-400">/bin/grep</code>, <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-blue-400">/usr/bin/gcc</code>, etc.
            </p>
          </Section>
          <Section label="Pipes entre comandos internos ( cmd1 | cmd2 )">
            <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Detectar el carácter <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-blue-400">|</code> en la sentencia, dividir en dos comandos, crear un pipe con <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-blue-400">pipe(fd)</code>, y redirigir stdout del primero a stdin del segundo usando <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-blue-400">dup2()</code>.
            </p>
          </Section>
          <Section label="Navegación del historial con teclas ↑ ↓">
            <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Usar <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-blue-400">termios</code> para leer carácter a carácter y detectar secuencias de escape ANSI (<code className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-blue-400">\033[A</code> = flecha arriba) para navegar el historial circular.
            </p>
          </Section>
          <Section label="Autocompletado con Tab (readline)">
            <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Integrar la biblioteca <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-blue-400">libreadline</code> reemplazando fgets() para obtener historial persistente, autocompletado de rutas y edición de línea con las teclas estándar de bash.
            </p>
          </Section>
        </div>
      </div>

      {/* Lo que aprendimos */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>// lo que aprendimos</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aprendizajes.map((a, i) => (
            <div key={i} className="rounded-xl border border-border bg-muted/20 p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border ${a.color}`}>
                  {a.avatar}
                </div>
                <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>@{a.nombre}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{a.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
