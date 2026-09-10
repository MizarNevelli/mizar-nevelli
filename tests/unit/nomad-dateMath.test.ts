import { describe, it, expect } from "vitest";
import {
  expandTrip,
  buildCountryDays,
} from "../../src/pages/NomadTaxCalculator/utils/dateMath";

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
