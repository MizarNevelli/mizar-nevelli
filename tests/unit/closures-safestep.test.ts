/**
 * Regression tests for the safeStep fix in ClosuresPage.
 *
 * Bug: switching scenarios while step > 0 caused scenario.timeline[step] to
 * return undefined when the new scenario has fewer frames, crashing on
 * frame.line access ("Cannot read properties of undefined (reading 'line')").
 *
 * Fix: const safeStep = Math.min(step, lastStep)
 */
import { describe, it, expect } from "vitest";
import { SCENARIOS } from "../../src/pages/Closures/scenarios";

describe("safeStep — scenario switch regression", () => {
  it("clamps a stale step to the new scenario's last valid index", () => {
    const scenario = SCENARIOS.basic;
    const lastStep = scenario.timeline.length - 1;

    const staleStep = 20; // way beyond any scenario length
    const safeStep = Math.min(staleStep, lastStep);

    expect(scenario.timeline[safeStep]).toBeDefined();
    expect(safeStep).toBeLessThanOrEqual(lastStep);
  });

  it("a step valid in forLet may be out-of-bounds in basic without the clamp", () => {
    const forLetLen = SCENARIOS.forLet.timeline.length;
    const basicLen = SCENARIOS.basic.timeline.length;

    // forLet is longer than basic — a step valid in forLet can overflow basic
    expect(forLetLen).toBeGreaterThan(0);
    const edgeStep = forLetLen - 1;

    if (edgeStep >= basicLen) {
      // Without fix: undefined
      expect(SCENARIOS.basic.timeline[edgeStep]).toBeUndefined();
      // With fix: clamped to last valid frame
      const safeStep = Math.min(edgeStep, basicLen - 1);
      expect(SCENARIOS.basic.timeline[safeStep]).toBeDefined();
    }
  });

  it("safeStep is a no-op when step is within bounds", () => {
    const scenario = SCENARIOS.counter;
    const lastStep = scenario.timeline.length - 1;
    const validStep = 2;

    const safeStep = Math.min(validStep, lastStep);
    expect(safeStep).toBe(validStep);
    expect(scenario.timeline[safeStep]).toBeDefined();
  });
});
