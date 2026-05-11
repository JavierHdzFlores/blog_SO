import { useState } from "react";
import { Copy, Check, Code2 } from "lucide-react";
import { Button } from "./ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

type Token = { type: "keyword" | "string" | "comment" | "preprocessor" | "number" | "function" | "plain"; value: string };

const C_KEYWORDS = new Set([
  "int","char","void","return","if","else","while","for","do","struct",
  "typedef","NULL","sizeof","break","continue","switch","case","default",
  "static","extern","const","volatile","unsigned","long","short","float",
  "double","enum","union","auto","register","signed","goto","inline",
]);

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  
  while (i < line.length) {
    // Single-line comment //
    if (line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ type: "comment", value: line.slice(i) });
      break;
    }
    
    // Preprocessor directive #
    if (line[i] === '#' && (i === 0 || /\s/.test(line[i - 1]))) {
      let end = i + 1;
      while (end < line.length && /\S/.test(line[end])) end++;
      tokens.push({ type: "preprocessor", value: line.slice(i, end) });
      i = end;
      continue;
    }
    
    // String literal "..."
    if (line[i] === '"') {
      let end = i + 1;
      while (end < line.length) {
        if (line[end] === '\\') { end += 2; continue; }
        if (line[end] === '"') { end++; break; }
        end++;
      }
      tokens.push({ type: "string", value: line.slice(i, end) });
      i = end;
      continue;
    }
    
    // Char literal '.'
    if (line[i] === "'") {
      let end = i + 1;
      while (end < line.length) {
        if (line[end] === '\\') { end += 2; continue; }
        if (line[end] === "'") { end++; break; }
        end++;
      }
      tokens.push({ type: "string", value: line.slice(i, end) });
      i = end;
      continue;
    }
    
    // Number
    if (/\d/.test(line[i]) && (i === 0 || /\W/.test(line[i - 1]))) {
      let end = i;
      while (end < line.length && /[\d.xXa-fA-FuUlL]/.test(line[end])) end++;
      tokens.push({ type: "number", value: line.slice(i, end) });
      i = end;
      continue;
    }
    
    // Word (keyword, function, or identifier)
    if (/[a-zA-Z_]/.test(line[i])) {
      let end = i + 1;
      while (end < line.length && /[\w]/.test(line[end])) end++;
      const word = line.slice(i, end);
      
      // Check if it's followed by '('
      let j = end;
      while (j < line.length && line[j] === ' ') j++;
      
      if (C_KEYWORDS.has(word)) {
        tokens.push({ type: "keyword", value: word });
      } else if (line[j] === '(') {
        tokens.push({ type: "function", value: word });
      } else {
        tokens.push({ type: "plain", value: word });
      }
      i = end;
      continue;
    }
    
    // Plain character
    tokens.push({ type: "plain", value: line[i] });
    i++;
  }
  
  return tokens;
}

const tokenColors: Record<Token["type"], string> = {
  keyword: "#cba6f7",
  string: "#a6e3a1",
  comment: "#6c7086",
  preprocessor: "#89b4fa",
  number: "#fab387",
  function: "#89dceb",
  plain: "#cdd6f4",
};

const tokenStyles: Partial<Record<Token["type"], React.CSSProperties>> = {
  comment: { fontStyle: "italic" },
  keyword: { fontWeight: 600 },
};

function HighlightedLine({ line }: { line: string }) {
  const tokens = tokenizeLine(line);
  
  if (tokens.length === 0) return <span>&nbsp;</span>;
  
  return (
    <>
      {tokens.map((token, idx) => (
        <span
          key={idx}
          style={{
            color: tokenColors[token.type],
            ...tokenStyles[token.type],
          }}
        >
          {token.value}
        </span>
      ))}
    </>
  );
}

export function CodeBlock({ code, language = "c", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-md">
      {/* Editor top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e1e2e] dark:bg-[#12121a]">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          {filename && (
            <div className="flex items-center gap-1.5">
              <Code2 className="size-3 text-[#89b4fa]" />
              <span
                className="text-xs text-[#cdd6f4]/70"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {filename}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2 py-0.5 rounded bg-[#313244] text-[#89b4fa]"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem" }}
          >
            {language.toUpperCase()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-[#cdd6f4]/60 hover:text-[#cdd6f4] hover:bg-[#313244]"
          >
            {copied ? (
              <Check className="size-3.5 text-[#a6e3a1]" />
            ) : (
              <Copy className="size-3.5" />
            )}
            <span className="text-xs ml-1">{copied ? "Copiado" : "Copiar"}</span>
          </Button>
        </div>
      </div>

      {/* Code area */}
      <div className="overflow-x-auto bg-[#1e1e2e] dark:bg-[#12121a] p-4 leading-6">
        <pre>
          {lines.map((line, idx) => (
            <div key={idx} className="flex">
              <span
                className="select-none w-10 shrink-0 text-right pr-4"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.78rem",
                  color: "#45475a",
                }}
              >
                {idx + 1}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.82rem",
                  whiteSpace: "pre",
                }}
              >
                {line ? <HighlightedLine line={line} /> : <>&nbsp;</>}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
