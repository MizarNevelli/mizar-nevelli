import type { Trip, RiskWindow, CountryRiskResult } from "../types";
import { THRESHOLD } from "../types";

// ── Primitives ────────────────────────────────────────────────────────────────

/** Parse a YYYY-MM-DD string as UTC day-number (days since epoch). */
function toDayNum(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

/** Convert a UTC day-number back to YYYY-MM-DD. */
function fromDayNum(n: number): string {
  return new Date(n * 86_400_000).toISOString().slice(0, 10);
}

// ── Core functions ─────────────────────────────────────────────────────────────

/**
 * Expand a single trip into every calendar day it covers (inclusive on both
 * ends). Returns ISO date strings.
 */
export function expandTrip(trip: Trip): string[] {
  const start = toDayNum(trip.startDate);
  const end = toDayNum(trip.endDate);
  const days: string[] = [];
  for (let n = start; n <= end; n++) days.push(fromDayNum(n));
  return days;
}

/**
 * Aggregate all trips into a Map<countryCode, sortedUniqueDays>.
 * Overlapping trips for the same country are deduplicated.
 */
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

/**
 * Find the worst-case 365-day rolling window for a sorted array of unique
 * days spent in a single country.
 *
 * Algorithm: two-pointer O(n).
 * - For each right pointer r, advance left pointer l until the window
 *   [days[l] … days[r]] spans < 365 calendar days.
 * - Track the window with the highest count.
 *
 * The window reported is [days[l], days[l] + 364] — a full 365-day period
 * starting on the earliest day still inside the best window.
 */
export function maxDaysInRollingWindow(sortedDays: string[]): RiskWindow {
  if (sortedDays.length === 0) {
    return { windowStart: "", windowEnd: "", days: 0 };
  }

  const nums = sortedDays.map(toDayNum);
  let bestL = 0;
  let bestCount = 0;
  let l = 0;

  for (let r = 0; r < nums.length; r++) {
    // Shrink left side until the window spans at most 364 calendar days
    // (meaning both endpoints fall within the same 365-day period).
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

/**
 * Main entry point. Given a list of trips, returns one CountryRiskResult per
 * country, sorted by risk (most days in worst window first).
 */
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
