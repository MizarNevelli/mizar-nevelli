type Props = {
  code: string;
  /** 1-indexed line to highlight, if any. */
  highlightLine?: number;
};

/**
 * Minimal monospace code block with a single highlighted line for step-through
 * visualizations. Intentionally not full syntax highlighting — the surrounding
 * animation is what carries the meaning.
 */
export function CodeBlock({ code, highlightLine }: Props) {
  const lines = code.split("\n");
  return (
    <pre className="glass rounded-3xl p-6 overflow-x-auto text-sm font-mono leading-relaxed">
      <code>
        {lines?.map((line, i) => {
          const active = highlightLine === i + 1;
          return (
            <div
              key={i}
              className={`px-3 -mx-3 rounded transition-colors ${
                active ? "bg-accent/20 text-white" : "text-white/70"
              }`}
            >
              <span className="inline-block w-8 text-white/25 select-none">
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
