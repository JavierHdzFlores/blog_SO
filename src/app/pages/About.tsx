import { User, GraduationCap, BookOpen, Code2, Award, Mail } from "lucide-react";

export function About() {
  const students = [
    {
      name: "Javier Hernández Flores",
      matricula: "2022020208",
      email: "javierherflores34@gmail.com.mx",
      carrera: "Ing. Computación",
      semestre: "6to Semestre",
      universidad: "UTM · 2022-2026",
      presentation:
        "Soy estudiante de sexto semestre de Ingeniería en Computación en la Universidad Tecnológica de la Mixteca. Me apasiona la programación de sistemas, especialmente todo lo relacionado con la interacción entre software y hardware a bajo nivel.",
      skills: [
        { label: "C / C++", level: 80 },
        { label: "Linux / Bash", level: 85 },
        { label: "Programación Concurrente", level: 70 },
        { label: "Estructuras de Datos", level: 75 },
        { label: "Python", level: 65 },
        { label: "Git / Control de Versiones", level: 72 },
      ],
    },
    {
      name: "Marlen",
      matricula: "2023020006",
      email: "marlenherandezg10@gmail.com.mx",
      carrera: "Ing. Computación",
      semestre: "6to Semestre",
      universidad: "UTM · 2023-2026",
      presentation:
        "Estudiante de Ingeniería en Computación apasionado por el desarrollo de sistemas y programación concurrente.",
      skills: [
        { label: "C / C++", level: 70 },
        { label: "Linux / Bash", level: 75 },
        { label: "Programación Concurrente", level: 68 },
        { label: "Estructuras de Datos", level: 70 },
        { label: "Python", level: 70 },
        { label: "Git / Control de Versiones", level: 70 },
      ],
    },
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {students.map((student) => (
          <div key={student.matricula} className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4">
            {/* Encabezado con nombre */}
            <div className="flex items-start gap-4 border-b border-border pb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
                <User className="size-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                  {student.name}
                </h2>
                <p className="text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Matrícula: {student.matricula}
                </p>
              </div>
            </div>

            {/* Información académica */}
            <div className="flex flex-col gap-2">
              {[
                { icon: <GraduationCap className="size-4" />, label: student.carrera },
                { icon: <BookOpen className="size-4" />, label: student.semestre },
                { icon: <Award className="size-4" />, label: student.universidad },
                { icon: <Mail className="size-4" />, label: student.email },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                  {item.icon}
                  <span style={{ fontFamily: "'Inter', sans-serif" }}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Presentación */}
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {student.presentation}
              </p>
            </div>

            {/* Habilidades */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="size-4 text-muted-foreground" />
                <h3 className="text-xs text-foreground font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Habilidades Técnicas
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                {student.skills.map((skill) => (
                  <div key={skill.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {skill.label}
                      </span>
                      <span className="text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
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
        ))}
      </div>
    </div>
  );
}
