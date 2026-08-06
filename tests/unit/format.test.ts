import { describe, it, expect } from "vitest";
import { formatDate, formatOrdinal } from "../../src/utils/format";

describe("formatDate", () => {
  it("formats a standard ISO date to en-GB long format", () => {
    expect(formatDate("2020-09-05")).toBe("5 September 2020");
  });

  it("formats December correctly", () => {
    expect(formatDate("2019-12-23")).toBe("23 December 2019");
  });

  it("handles day 1 without zero-padding", () => {
    expect(formatDate("2022-01-01")).toBe("1 January 2022");
  });
});

describe("formatOrdinal", () => {
  it("pads single digits with a leading zero", () => {
    expect(formatOrdinal(0)).toBe("01");
    expect(formatOrdinal(8)).toBe("09");
  });

  it("does not pad two-digit numbers", () => {
    expect(formatOrdinal(9)).toBe("10");
    expect(formatOrdinal(10)).toBe("11");
  });
});
