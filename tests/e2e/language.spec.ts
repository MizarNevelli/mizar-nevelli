import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Translation json parity
// Recursively collects every dot notation path
function leafKeys(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return [prefix];
  }
  return Object.entries(obj as Record<string, unknown>).flatMap(([key, val]) =>
    leafKeys(val, prefix ? `${prefix}.${key}` : key)
  );
}

test.describe("i18n translation parity", () => {
  // Read at describe-evaluation time (sync, Node.js context — no browser needed).
  const localesDir = resolve(process.cwd(), "src/i18n/locales");
  const en = JSON.parse(
    readFileSync(resolve(localesDir, "en.json"), "utf-8")
  ) as Record<string, unknown>;
  const it = JSON.parse(
    readFileSync(resolve(localesDir, "it.json"), "utf-8")
  ) as Record<string, unknown>;

  const enKeys = leafKeys(en).sort();
  const itKeys = leafKeys(it).sort();

  test("IT locale has no keys absent from EN", () => {
    const extra = itKeys.filter((k) => !enKeys.includes(k));
    expect(
      extra,
      `Keys present in IT but missing in EN:\n  ${extra.join("\n  ")}`
    ).toHaveLength(0);
  });

  test("EN locale has no keys absent from IT", () => {
    const extra = enKeys.filter((k) => !itKeys.includes(k));
    expect(
      extra,
      `Keys present in EN but missing in IT:\n  ${extra.join("\n  ")}`
    ).toHaveLength(0);
  });

  test("both locales have the same total number of translation strings", () => {
    expect(itKeys.length).toBe(enKeys.length);
  });
});
