import { useTranslation } from "react-i18next";
import type { Trip } from "../types";
import { countryName } from "../utils/countryName";

type Props = {
  trips: Trip[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
};

export function TripList({ trips, onRemove, onClearAll }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";

  if (trips.length === 0) {
    return (
      <p className="text-white/30 text-sm py-4">{t("nomadTax.tripList.empty")}</p>
    );
  }

  return (
    <div>
      <ul className="flex flex-col divide-y divide-white/[0.06]">
        {trips.map((trip) => (
          <li key={trip.id} className="flex items-center justify-between gap-4 py-3">
            <div className="flex-1 min-w-0">
              <span className="text-white text-sm font-medium">
                {countryName(trip.country, locale)}
              </span>
              <span className="ml-2 text-white/40 text-xs font-mono">
                {trip.startDate} → {trip.endDate}
              </span>
            </div>
            <button
              onClick={() => onRemove(trip.id)}
              className="text-white/25 hover:text-red-400 transition-colors text-xs shrink-0"
              aria-label={t("nomadTax.tripList.removeAriaLabel")}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={onClearAll}
        className="mt-4 text-xs text-white/25 hover:text-white/50 transition-colors"
      >
        {t("nomadTax.tripList.clearAll")}
      </button>
    </div>
  );
}
