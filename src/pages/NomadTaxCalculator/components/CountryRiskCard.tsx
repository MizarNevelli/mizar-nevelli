import { useTranslation } from "react-i18next";
import type { CountryRiskResult } from "../types";
import { THRESHOLD } from "../types";
import { countryName } from "../utils/countryName";

type Props = {
  result: CountryRiskResult;
};

export function CountryRiskCard({ result }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";

  const { country, totalDays, maxDaysInWindow, riskWindow, atRisk } = result;
  const pct = Math.min(100, (maxDaysInWindow / THRESHOLD) * 100);

  const barColor = atRisk
    ? "bg-red-500"
    : pct >= 70
    ? "bg-yellow-500"
    : "bg-accent";

  return (
    <div
      className={`rounded-xl border p-5 transition-colors ${
        atRisk
          ? "border-red-500/40 bg-red-950/20"
          : "border-white/[0.08] bg-white/[0.02]"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-white font-semibold text-lg leading-tight">
            {countryName(country, locale)}
          </p>
          <p className="text-white/40 text-xs font-mono mt-0.5">
            {t("nomadTax.card.daysTotal", { count: totalDays })}
          </p>
        </div>

        {atRisk && (
          <span className="shrink-0 text-xs font-mono uppercase tracking-widest bg-red-500/20 text-red-400 border border-red-500/30 rounded px-2 py-1">
            {t("nomadTax.card.atRiskBadge")}
          </span>
        )}
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs text-white/40 font-mono mb-1.5">
          <span>
            {t("nomadTax.card.barLabel", {
              days: maxDaysInWindow,
              threshold: THRESHOLD,
            })}
          </span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-white/30 font-mono">
        {t("nomadTax.card.worstWindow", {
          start: riskWindow.windowStart,
          end: riskWindow.windowEnd,
        })}
      </p>
    </div>
  );
}
