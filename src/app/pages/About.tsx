import { User, GraduationCap, BookOpen, Code2, Award, Mail } from "lucide-react";

export function About() {
  const skills = [
    { label: "C / C++", level: 80 },
    { label: "Linux / Bash", level: 85 },
    { label: "Programación Concurrente", level: 70 },
    { label: "Estructuras de Datos", level: 75 },
    { label: "Python", level: 65 },
    { label: "Git / Control de Versiones", level: 72 },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/15 border border-primary/30">
            <User className="size-5 text-primary" />
          </div>
          <div>
            <p
              className="text-xs font-medium text-muted-foreground uppercase tracking-widest"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Perfil del Estudiante
            </p>
            <h1
              className="text-foreground"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.75rem", fontWeight: 700 }}
            >
              Acerca de
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1 rounded-2xl border border-border bg-card p-6 flex flex-col items-center text-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 border-2 border-primary/20 flex items-center justify-center">
            <User className="size-10 text-primary" />
          </div>
          <div>
            <h2 className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
              Javier, Marlen
            </h2>
            <p className="text-sm text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Matrícula: 2022020208, Matricula: 
            </p>
          </div>

          <div className="w-full border-t border-border pt-4 flex flex-col gap-2">
            {[
              { icon: <GraduationCap className="size-4" />, label: "Ing. Computación" },
              { icon: <BookOpen className="size-4" />, label: "6to Semestre" },
              { icon: <Award className="size-4" />, label: "UTM · 2022-2026" },
              { icon: <Mail className="size-4" />, label: "javierherflores34@gmail.com.mx" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                {item.icon}
                <span style={{ fontFamily: "'Inter', sans-serif" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-3 text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
              Presentación Personal
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Somos estudiante de sexto semestre de Ingeniería en Computación en la Universidad Tecnológica de la Mixteca. Nos apasiona la programación de sistemas, especialmente todo lo relacionado con la interacción entre software y hardware a bajo nivel. La materia de Sistemas Operativos ha sido fundamental para comprender cómo funciona la capa de software que hace posible que los programas de alto nivel se ejecuten de manera eficiente y segura.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              A través de las prácticas documentadas en este portafolio, hemos desarrollado habilidades en programación en C a nivel de sistema, manejo de concurrencia y paralelismo, y comprensión de los mecanismos internos del kernel de Linux.
            </p>
          </div>

          {/* Skills */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Code2 className="size-4 text-muted-foreground" />
              <h3 className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                Habilidades Técnicas
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {skills.map((skill) => (
                <div key={skill.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {skill.label}
                    </span>
                    <span className="text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
