import { useTranslation } from "react-i18next";
import type { CountryRiskResult } from "../types";
import { countryName } from "../utils/countryName";

type Props = {
  results: CountryRiskResult[];
};

export function RiskSummary({ results }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";

  const atRisk = results.filter((r) => r.atRisk);
  const nearMiss = results.filter((r) => !r.atRisk && r.maxDaysInWindow >= 120);

  if (results.length === 0) return null;

  if (atRisk.length > 0) {
    const countries = atRisk.map((r) => countryName(r.country, locale)).join(", ");
    return (
      <div className="rounded-xl border border-red-500/40 bg-red-950/30 px-5 py-4">
        <p className="text-red-400 font-semibold text-sm">
          {t("nomadTax.summary.atRiskTitle", { countries })}
        </p>
        <p className="text-red-400/60 text-xs mt-1 leading-relaxed">
          {t("nomadTax.summary.atRiskBody")}
        </p>
      </div>
    );
  }

  if (nearMiss.length > 0) {
    const countries = nearMiss.map((r) => countryName(r.country, locale)).join(", ");
    return (
      <div className="rounded-xl border border-yellow-500/30 bg-yellow-950/20 px-5 py-4">
        <p className="text-yellow-400 font-semibold text-sm">
          {t("nomadTax.summary.warningTitle", { countries })}
        </p>
        <p className="text-yellow-400/60 text-xs mt-1 leading-relaxed">
          {t("nomadTax.summary.warningBody")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4">
      <p className="text-white/60 text-sm">
        {t("nomadTax.summary.noRisk", { count: results.length })}
      </p>
    </div>
  );
}
