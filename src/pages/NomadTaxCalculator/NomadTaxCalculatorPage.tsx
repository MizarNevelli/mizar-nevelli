import { useTranslation } from "react-i18next";
import { PageMeta } from "../../components/PageMeta";
import { TripForm } from "./components/TripForm";
import { TripList } from "./components/TripList";
import { CountryRiskCard } from "./components/CountryRiskCard";
import { RiskSummary } from "./components/RiskSummary";
import { CountrySelect } from "./components/CountrySelect";
import { useTripTracker } from "./hooks/useTripTracker";
import { useResidencyRisk } from "./hooks/useResidencyRisk";
import { countryName } from "./utils/countryName";

export function NomadTaxCalculatorPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";
  const {
    trips,
    addTrip,
    removeTrip,
    clearAll,
    residenceCountry,
    setResidenceCountry,
  } = useTripTracker();
  const results = useResidencyRisk(trips, residenceCountry);

  return (
    <main className="min-h-[100dvh] bg-ink-950 pt-28 pb-20 px-6">
      <PageMeta
        title={t("nomadTax.meta.title")}
        description={t("nomadTax.meta.description")}
        path="/nomad-tax"
      />

      <div className="max-w-5xl mx-auto">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent-soft mb-4">
          {t("nomadTax.eyebrow")}
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white text-balance mb-3">
          {t("nomadTax.titleLine1")}
          <br />
          <span className="text-white/35">{t("nomadTax.titleLine2")}</span>
        </h1>
        <p className="text-white/50 text-sm max-w-lg leading-relaxed mb-10">
          {t("nomadTax.subtitle")}
        </p>

        {/* Residence step */}
        {!residenceCountry ? (
          <div className="mb-12 max-w-sm">
            <p className="text-white font-medium mb-3">
              {t("nomadTax.residence.question")}
            </p>
            <CountrySelect value="" onChange={setResidenceCountry} />
            <p className="mt-2 text-xs text-white/30 leading-relaxed">
              {t("nomadTax.residence.hint")}
            </p>
          </div>
        ) : (
          <div className="mb-10 flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
              {t("nomadTax.residence.question")}
            </span>
            <span className="text-sm text-white font-medium">
              {countryName(residenceCountry, locale)}
            </span>
            <button
              onClick={() => setResidenceCountry("")}
              className="text-xs text-white/25 hover:text-white/60 transition-colors"
            >
              {t("nomadTax.residence.change")}
            </button>
          </div>
        )}

        {/* Main grid — only shown after residence is set */}
        {residenceCountry && (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-10">
            {/* Left: input */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-4">
                {t("nomadTax.addTripLabel")}
              </p>
              <TripForm onAdd={addTrip} residenceCountry={residenceCountry} />

              {trips.length > 0 && (
                <div className="mt-8">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-3">
                    {t("nomadTax.tripsLabel")}
                  </p>
                  <TripList
                    trips={trips}
                    onRemove={removeTrip}
                    onClearAll={clearAll}
                  />
                </div>
              )}
            </div>

            {/* Right: results */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-4">
                {t("nomadTax.riskLabel")}
              </p>

              {results.length === 0 ? (
                <p className="text-white/25 text-sm">
                  {t("nomadTax.emptyResults")}
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  <RiskSummary results={results} />
                  {results.map((r) => (
                    <CountryRiskCard key={r.country} result={r} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <p className="mt-16 text-xs text-white/20 leading-relaxed max-w-2xl">
          {t("nomadTax.disclaimer")}
        </p>
      </div>
    </main>
  );
}
