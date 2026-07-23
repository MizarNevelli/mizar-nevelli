type StatCardProps = {
  value: string;
  label: string;
};

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div>
      <div className="text-[3.25rem] md:text-[4rem] font-semibold leading-none tracking-tighter text-white tabular-nums">
        {value}
      </div>
      <div className="mt-3 text-[10px] font-mono uppercase tracking-[0.22em] text-white/30">
        {label}
      </div>
    </div>
  );
}
