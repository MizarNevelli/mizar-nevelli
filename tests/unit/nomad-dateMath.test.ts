import { describe, it, expect } from "vitest";
import {
  expandTrip,
  buildCountryDays,
  maxDaysInRollingWindow,
  computeResidencyRisk,
} from "../../src/pages/NomadTaxCalculator/utils/dateMath";
import { THRESHOLD } from "../../src/constants";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns an array of N consecutive dates starting from `start`. */
function consecutiveDays(start: string, count: number): string[] {
  const [y, m, d] = start.split("-").map(Number);
  const origin = Date.UTC(y, m - 1, d) / 86_400_000;
  return Array.from({ length: count }, (_, i) =>
    new Date((origin + i) * 86_400_000).toISOString().slice(0, 10)
  );
}

function makeTrip(
  country: string,
  startDate: string,
  endDate: string,
  id = "x"
) {
  return { id, country, startDate, endDate };
}

// ── expandTrip ────────────────────────────────────────────────────────────────

describe("expandTrip", () => {
  it("returns a single day when start equals end", () => {
    expect(expandTrip(makeTrip("IT", "2024-06-01", "2024-06-01"))).toEqual([
      "2024-06-01",
    ]);
  });

  it("returns all days inclusive on both ends", () => {
    const days = expandTrip(makeTrip("IT", "2024-06-01", "2024-06-04"));
    expect(days).toEqual([
      "2024-06-01",
      "2024-06-02",
      "2024-06-03",
      "2024-06-04",
    ]);
  });

  it("crosses month boundaries correctly", () => {
    const days = expandTrip(makeTrip("PT", "2024-01-30", "2024-02-02"));
    expect(days).toEqual([
      "2024-01-30",
      "2024-01-31",
      "2024-02-01",
      "2024-02-02",
    ]);
  });

  it("crosses year boundaries correctly", () => {
    const days = expandTrip(makeTrip("ES", "2023-12-30", "2024-01-02"));
    expect(days).toEqual([
      "2023-12-30",
      "2023-12-31",
      "2024-01-01",
      "2024-01-02",
    ]);
  });
});

// ── buildCountryDays ──────────────────────────────────────────────────────────

describe("buildCountryDays", () => {
  it("deduplicates overlapping trips for the same country", () => {
    const trips = [
      makeTrip("PT", "2024-01-01", "2024-01-05", "a"),
      makeTrip("PT", "2024-01-03", "2024-01-07", "b"),
    ];
    const map = buildCountryDays(trips);
    const days = map.get("PT")!;
    // 01-01 through 01-07 = 7 unique days
    expect(days).toHaveLength(7);
    expect(days[0]).toBe("2024-01-01");
    expect(days[6]).toBe("2024-01-07");
  });

  it("keeps countries separate", () => {
    const trips = [
      makeTrip("PT", "2024-01-01", "2024-01-03", "a"),
      makeTrip("ES", "2024-01-02", "2024-01-04", "b"),
    ];
    const map = buildCountryDays(trips);
    expect(map.get("PT")).toHaveLength(3);
    expect(map.get("ES")).toHaveLength(3);
  });

  it("returns sorted days even when trips are added out of order", () => {
    const trips = [
      makeTrip("DE", "2024-03-01", "2024-03-02", "b"),
      makeTrip("DE", "2024-01-01", "2024-01-02", "a"),
    ];
    const days = buildCountryDays(trips).get("DE")!;
    expect(days[0]).toBe("2024-01-01");
    expect(days[days.length - 1]).toBe("2024-03-02");
  });
});

// ── maxDaysInRollingWindow ────────────────────────────────────────────────────

describe("maxDaysInRollingWindow", () => {
  it("returns zero for an empty array", () => {
    expect(maxDaysInRollingWindow([])).toEqual({
      windowStart: "",
      windowEnd: "",
      days: 0,
    });
  });

  it("returns 1 for a single day", () => {
    const result = maxDaysInRollingWindow(["2024-06-01"]);
    expect(result.days).toBe(1);
    expect(result.windowStart).toBe("2024-06-01");
    expect(result.windowEnd).toBe("2025-05-31"); // +364 days
  });

  it("counts 182 consecutive days correctly (below threshold)", () => {
    const days = consecutiveDays("2024-01-01", 182);
    expect(maxDaysInRollingWindow(days).days).toBe(182);
  });

  it("counts 183 consecutive days correctly (at threshold)", () => {
    const days = consecutiveDays("2024-01-01", 183);
    expect(maxDaysInRollingWindow(days).days).toBe(183);
  });

  it("two days exactly 364 apart fall inside the same 365-day window", () => {
    // 2024-01-01 to 2024-12-30 = 364 days gap → same window
    const result = maxDaysInRollingWindow(["2024-01-01", "2024-12-30"]);
    expect(result.days).toBe(2);
  });

  it("two days exactly 365 apart fall in different windows", () => {
    // 2024-01-01 to 2025-01-01 = 365 days gap → each in its own window
    const result = maxDaysInRollingWindow(["2024-01-01", "2025-01-01"]);
    expect(result.days).toBe(1);
  });

  it("picks the worst window when there are multiple clusters", () => {
    // cluster A: 80 days, cluster B: 120 days (best answer is B)
    const clusterA = consecutiveDays("2022-01-01", 80);
    const clusterB = consecutiveDays("2023-06-01", 120);
    const result = maxDaysInRollingWindow([...clusterA, ...clusterB].sort());
    expect(result.days).toBe(120);
  });

  // ── The key scenario: rolling window catches what a calendar year misses ──

  it("catches a cross-year rolling window that spans exactly 183 days", () => {
    // 90 days at end of 2023 + 93 days at start of 2024 = 183 days in one window
    const tail2023 = consecutiveDays("2023-10-03", 90); // Oct 3 → Dec 31
    const head2024 = consecutiveDays("2024-01-01", 93); // Jan 1 → Apr 3
    // Both clusters fall inside a single 365-day window
    const all = [...tail2023, ...head2024].sort();
    const result = maxDaysInRollingWindow(all);
    expect(result.days).toBe(183);
  });

  it("reports the windowEnd as windowStart + 364 days", () => {
    const days = consecutiveDays("2024-03-01", 10);
    const result = maxDaysInRollingWindow(days);
    // windowStart is the first day of the best window; windowEnd = start + 364
    const start = new Date(result.windowStart).getTime();
    const end = new Date(result.windowEnd).getTime();
    expect((end - start) / 86_400_000).toBe(364);
  });
});

// ── computeResidencyRisk ──────────────────────────────────────────────────────

describe("computeResidencyRisk", () => {
  it("marks a country at risk when days reach the threshold", () => {
    const trips = [makeTrip("DE", "2024-01-01", "2024-07-01")]; // 183 days
    const [result] = computeResidencyRisk(trips);
    expect(result.country).toBe("DE");
    expect(result.atRisk).toBe(true);
    expect(result.maxDaysInWindow).toBe(183);
  });

  it("does not mark a country at risk when days are below threshold", () => {
    const trips = [makeTrip("PT", "2024-01-01", "2024-06-30")]; // 182 days
    const [result] = computeResidencyRisk(trips);
    expect(result.atRisk).toBe(false);
    expect(result.maxDaysInWindow).toBe(182);
  });

  it("respects a custom threshold", () => {
    const trips = [makeTrip("ES", "2024-01-01", "2024-01-10")]; // 10 days
    const [result] = computeResidencyRisk(trips, 10);
    expect(result.atRisk).toBe(true);
  });

  it("sorts results by worst-window days descending", () => {
    const trips = [
      makeTrip("FR", "2024-01-01", "2024-03-31", "a"), // 91 days
      makeTrip("IT", "2024-01-01", "2024-05-31", "b"), // 152 days
      makeTrip("DE", "2024-01-01", "2024-01-10", "c"), // 10 days
    ];
    const results = computeResidencyRisk(trips);
    expect(results.map((r) => r.country)).toEqual(["IT", "FR", "DE"]);
  });

  it("THRESHOLD export equals 183", () => {
    expect(THRESHOLD).toBe(183);
  });

  it("cross-year stay of 183 days triggers risk even though each calendar year is under 183", () => {
    // 90 days in 2023 + 93 days in 2024 = safe by calendar year, dangerous by rolling window
    const trips = [
      makeTrip("NL", "2023-10-03", "2023-12-31", "a"), // 90 days
      makeTrip("NL", "2024-01-01", "2024-04-03", "b"), // 94 days (total 184)
    ];
    const [result] = computeResidencyRisk(trips);
    expect(result.atRisk).toBe(true);
  });
});
