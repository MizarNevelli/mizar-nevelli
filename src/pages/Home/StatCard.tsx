type StatCardProps = {
  value: string;
  label: string;
  /** Roman-numeral index shown as a leader in the corner (e.g. "i", "ii"). */
  index?: string;
};

/**
 * A ruled observation-table row rather than a card. Big serif numeral,
 * tabular-mono label, hairline top border. Reads like a data table entry.
 */
export function StatCard({ value, label, index }: StatCardProps) {
  return (
    <div className="hair-t pt-4 pb-3 flex flex-col">
      {index && <span className="coord mb-2">obs. {index}</span>}
      <div className="font-display text-5xl md:text-6xl text-bone tnum leading-none">
        {value}
      </div>
      <div className="mt-3 text-[11px] uppercase tracking-[0.18em] text-bone/50 font-mono">
        {label}
      </div>
    </div>
  );
}
