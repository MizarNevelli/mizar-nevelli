import { describe, it, expect } from "vitest";
import {
  SCENARIOS,
  SCENARIO_IDS,
} from "../../src/pages/EventLoop/scenarios";
import enJson from "../../src/i18n/locales/en.json";

describe("SCENARIO_IDS", () => {
  it("contains the three expected IDs", () => {
    expect(SCENARIO_IDS).toEqual(["classic", "promises", "nested"]);
  });
});

describe("narration / timeline sync", () => {
  it("narration count matches timeline length for every scenario", () => {
    for (const id of SCENARIO_IDS) {
      const timelineLen = SCENARIOS[id].timeline.length;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const narrations = (enJson.eventLoop.scenarios as any)[id]
        ?.narrations as string[];
      expect(
        narrations?.length,
        `scenario "${id}": narrations (${narrations?.length}) ≠ timeline (${timelineLen})`
      ).toBe(timelineLen);
    }
  });
});

describe("classic scenario — microtask / macrotask ordering", () => {
  const timeline = SCENARIOS.classic.timeline;

  it("has a frame where microtask and macrotask queues are both non-empty", () => {
    const concurrent = timeline.some(
      (f) => f.microtasks.length > 0 && f.macrotasks.length > 0
    );
    expect(concurrent).toBe(true);
  });

  it("microtask drains before the macrotask fires", () => {
    const sharedIdx = timeline.findIndex(
      (f) => f.microtasks.length > 0 && f.macrotasks.length > 0
    );
    expect(sharedIdx).toBeGreaterThan(-1);

    // Find the first frame where microtasks are empty but macrotask still pending
    const drainedIdx = timeline.findIndex(
      (f, i) => i > sharedIdx && f.microtasks.length === 0 && f.macrotasks.length > 0
    );
    expect(drainedIdx).toBeGreaterThan(sharedIdx);

    // Macrotask must fire AFTER microtask drained (not before)
    const macroFiredIdx = timeline.findIndex(
      (f, i) => i > drainedIdx && f.macrotasks.length === 0
    );
    expect(macroFiredIdx).toBeGreaterThan(drainedIdx);
  });
});

describe("nested scenario — microtask starvation", () => {
  const timeline = SCENARIOS.nested.timeline;

  it("macrotask stays in queue while microtasks keep re-scheduling", () => {
    // The timer macrotask should remain pending across multiple chain() microtask frames
    const macroFrames = timeline.filter(
      (f) => f.macrotasks.length > 0 && f.microtasks.length > 0
    );
    expect(macroFrames.length).toBeGreaterThan(1);
  });
});
