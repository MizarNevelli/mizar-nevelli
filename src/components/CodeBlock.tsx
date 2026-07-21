type Props = {
  code: string;
  /** 1-indexed line to highlight, if any. */
  highlightLine?: number;
};

/**
 * Minimal monospace code block. Active line gets a hairline `star` left border
 * and a very faint tint. Reads like a printed log column.
 */
export function CodeBlock({ code, highlightLine }: Props) {
  const lines = code.split("\n");
  return (
    <pre className="hair p-6 overflow-x-auto text-sm font-mono leading-relaxed bg-ink/40">
      <code>
        {lines?.map((line, i) => {
          const active = highlightLine === i + 1;
          return (
            <div
              key={i}
              className={`pl-3 -ml-3 border-l-2 transition-colors ${
                active
                  ? "border-star bg-star/[0.06] text-bone"
                  : "border-transparent text-bone/60"
              }`}
            >
              <span className="inline-block w-8 text-bone/25 select-none tnum">
                {i + 1}
              </span>
              {line || " "}
            </div>
          );
        })}
      </code>
    </pre>
  );
}
