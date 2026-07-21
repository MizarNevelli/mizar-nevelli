type StatCardProps = {
  value: string;
  label: string;
};

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="glass rounded-2xl p-6 text-center">
      <div className="text-2xl md:text-3xl font-semibold gradient-text">
        {value}
      </div>
      <div className="mt-2 text-xs uppercase tracking-widest text-white/50">
        {label}
      </div>
    </div>
  );
}
