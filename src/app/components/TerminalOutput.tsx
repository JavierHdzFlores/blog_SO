import { Terminal } from "lucide-react";

interface TerminalOutputProps {
  lines: string[];
  title?: string;
  prompt?: string;
}

export function TerminalOutput({
  lines,
  title = "Terminal — bash",
  prompt = "user@utm:~$",
}: TerminalOutputProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-md">
      {/* Terminal title bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#11111b] dark:bg-[#0a0a12]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-1.5">
          <Terminal className="size-3 text-[#a6e3a1]" />
          <span
            className="text-xs text-[#cdd6f4]/60"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {title}
          </span>
        </div>
      </div>

      {/* Terminal body */}
      <div className="bg-[#11111b] dark:bg-[#0a0a12] p-5 min-h-32">
        <div className="flex flex-col gap-1.5">
          {lines.map((line, idx) => {
            const isCommand = line.startsWith("$");
            const isError = line.startsWith("ERROR") || line.startsWith("error");
            const isSuccess = line.startsWith("[OK]") || line.startsWith("✓");
            const isComment = line.startsWith("#");

            if (isCommand) {
              return (
                <div key={idx} className="flex items-start gap-2">
                  <span
                    className="text-[#a6e3a1] shrink-0 select-none"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem" }}
                  >
                    {prompt}
                  </span>
                  <span
                    className="text-[#cdd6f4] font-medium"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem" }}
                  >
                    {line.substring(2)}
                  </span>
                </div>
              );
            }

            if (isComment) {
              return (
                <div key={idx}>
                  <span
                    className="text-[#6c7086] italic"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem" }}
                  >
                    {line}
                  </span>
                </div>
              );
            }

            return (
              <div key={idx}>
                <span
                  className={
                    isError
                      ? "text-[#f38ba8]"
                      : isSuccess
                      ? "text-[#a6e3a1]"
                      : "text-[#bac2de]"
                  }
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}
                >
                  {line}
                </span>
              </div>
            );
          })}
          {/* Blinking cursor */}
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-[#a6e3a1] select-none"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem" }}
            >
              {prompt}
            </span>
            <span className="inline-block w-2 h-4 bg-[#cdd6f4]/70 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
