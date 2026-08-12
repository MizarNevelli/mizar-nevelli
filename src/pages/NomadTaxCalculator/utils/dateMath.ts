import { THRESHOLD } from "../../../constants";
import type { Trip, RiskWindow, CountryRiskResult } from "../types";

function toDayNum(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

function fromDayNum(n: number): string {
  return new Date(n * 86_400_000).toISOString().slice(0, 10);
}

export function expandTrip(trip: Trip): string[] {
  const start = toDayNum(trip.startDate);
  const end = toDayNum(trip.endDate);
  const days: string[] = [];
  for (let n = start; n <= end; n++) days.push(fromDayNum(n));
  return days;
}

export function buildCountryDays(trips: Trip[]): Map<string, string[]> {
  const sets = new Map<string, Set<string>>();
  for (const trip of trips) {
    if (!sets.has(trip.country)) sets.set(trip.country, new Set());
    for (const day of expandTrip(trip)) sets.get(trip.country)!.add(day);
  }
  const result = new Map<string, string[]>();
  for (const [country, set] of sets) {
    result.set(country, [...set].sort());
  }
  return result;
}

export function maxDaysInRollingWindow(sortedDays: string[]): RiskWindow {
  if (sortedDays.length === 0) {
    return { windowStart: "", windowEnd: "", days: 0 };
  }

  const nums = sortedDays.map(toDayNum);
  let bestL = 0;
  let bestCount = 0;
  let l = 0;

  for (let r = 0; r < nums.length; r++) {
    while (nums[r] - nums[l] >= 365) l++;

    const count = r - l + 1;
    if (count > bestCount) {
      bestCount = count;
      bestL = l;
    }
  }

  return {
    windowStart: sortedDays[bestL],
    windowEnd: fromDayNum(nums[bestL] + 364),
    days: bestCount,
  };
}

export function computeResidencyRisk(
  trips: Trip[],
  threshold = THRESHOLD
): CountryRiskResult[] {
  const countryDays = buildCountryDays(trips);
  const results: CountryRiskResult[] = [];

  for (const [country, days] of countryDays) {
    const riskWindow = maxDaysInRollingWindow(days);
    results.push({
      country,
      totalDays: days.length,
      maxDaysInWindow: riskWindow.days,
      riskWindow,
      atRisk: riskWindow.days >= threshold,
    });
  }

  return results.sort((a, b) => b.maxDaysInWindow - a.maxDaysInWindow);
}
