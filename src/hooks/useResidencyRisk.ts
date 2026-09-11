import { useMemo } from "react";
import type {
  Trip,
  CountryRiskResult,
} from "../pages/NomadTaxCalculator/types";
import { computeResidencyRisk } from "../pages/NomadTaxCalculator/utils/dateMath";

export function useResidencyRisk(
  trips: Trip[],
  residenceCountry: string
): CountryRiskResult[] {
  return useMemo(() => {
    const filtered = residenceCountry
      ? trips.filter((t) => t.country !== residenceCountry)
      : trips;
    return computeResidencyRisk(filtered);
  }, [trips, residenceCountry]);
}
