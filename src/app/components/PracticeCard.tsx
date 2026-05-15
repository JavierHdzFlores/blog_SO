import { Lightbulb, FileCode2, Monitor, BookMarked } from "lucide-react";
import { Badge } from "./ui/badge";
import { CodeBlock } from "./CodeBlock";
import { TerminalOutput } from "./TerminalOutput";

interface PracticeCardProps {
  id: string;
  number: number;
  title: string;
  objective: string;
  theory?: string;
  theoryNode?: React.ReactNode;
  code: string;
  language?: string;
  filename?: string;
  terminalLines: string[];
  terminalTitle?: string;
  conclusion: string;
  improvements: string;
  difficulty: "Básico" | "Intermedio" | "Avanzado";
  tags: string[];
}

const difficultyColor: Record<string, string> = {
  Básico: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  Intermedio: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  Avanzado: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
};

export function PracticeCard({
  id,
  number,
  title,
  objective,
  theory,
  theoryNode,
  code,
  language = "c",
  filename,
  terminalLines,
  terminalTitle,
  conclusion,
  improvements,
  difficulty,
  tags,
}: PracticeCardProps) {
  return (
    <article
      id={id}
      className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden scroll-mt-20"
    >
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 p-6 border-b border-border bg-muted/30">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground shrink-0 font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem" }}>
            {String(number).padStart(2, "0")}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-medium text-muted-foreground uppercase tracking-widest"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}
              >
                Práctica #{number}
              </span>
            </div>
            <h2 className="text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
              {title}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${difficultyColor[difficulty]}`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {difficulty}
          </span>
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col gap-8">
        {/* Objective */}
        <div className="flex gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Lightbulb className="size-4 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
              Objetivo
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              {objective}
            </p>
          </div>
        </div>

        {/* Theory */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookMarked className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
              Marco Teórico
            </h3>
          </div>
          {theoryNode ? (
            theoryNode
          ) : (
            <p
              className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {theory}
            </p>
          )}
        </div>

        {/* Code */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileCode2 className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
              Código Fuente
            </h3>
          </div>
          <CodeBlock code={code} language={language} filename={filename} />
        </div>

        {/* Terminal Output */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Monitor className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
              Salida en Terminal
            </h3>
          </div>
          <TerminalOutput lines={terminalLines} title={terminalTitle} />
        </div>

        {/* Conclusion */}
        <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💡</span>
            <h3
              className="font-semibold text-foreground"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              ¿Qué aprendí y cómo podría mejorarlo?
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                Lo que aprendí
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {conclusion}
              </p>
            </div>
            <div className="border-t border-primary/10 pt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary/70 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                Cómo mejoraría el programa
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {improvements}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
