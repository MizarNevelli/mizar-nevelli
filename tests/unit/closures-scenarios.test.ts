import { describe, it, expect } from "vitest";
import {
  SCENARIOS,
  SCENARIO_IDS,
  IDLE_FRAME,
} from "../../src/pages/Closures/scenarios";

describe("IDLE_FRAME", () => {
  it("has an empty queue and no highlight", () => {
    expect(IDLE_FRAME.queue).toEqual([]);
    expect(IDLE_FRAME.highlight).toBeUndefined();
  });

  it("has line 0 (no highlighted line in idle state)", () => {
    expect(IDLE_FRAME.line).toBe(0);
  });

  it("contains only the global scope with no bindings", () => {
    expect(IDLE_FRAME.scopes).toHaveLength(1);
    expect(IDLE_FRAME.scopes[0].id).toBe("global");
    expect(IDLE_FRAME.scopes[0].bindings).toEqual([]);
  });
});

describe("SCENARIO_IDS", () => {
  it("contains exactly the four expected scenario IDs", () => {
    expect(SCENARIO_IDS).toEqual(["basic", "counter", "forVar", "forLet"]);
  });

  it("every ID maps to a scenario in SCENARIOS", () => {
    for (const id of SCENARIO_IDS) {
      expect(SCENARIOS[id]).toBeDefined();
      expect(SCENARIOS[id].timeline.length).toBeGreaterThan(0);
    }
  });
});

describe("frame integrity", () => {
  it("every highlighted binding references a scope that exists in the same frame", () => {
    for (const [id, scenario] of Object.entries(SCENARIOS)) {
      for (const [i, frame] of scenario.timeline.entries()) {
        if (!frame.highlight) continue;
        const scopeIds = frame.scopes.map((s) => s.id);
        expect(
          scopeIds,
          `scenario "${id}" frame ${i}: highlight.scopeId "${frame.highlight.scopeId}" not found in scopes`
        ).toContain(frame.highlight.scopeId);
      }
    }
  });

  it("no frame has undefined scopes or queue", () => {
    for (const [id, scenario] of Object.entries(SCENARIOS)) {
      for (const [i, frame] of scenario.timeline.entries()) {
        expect(frame.scopes, `scenario "${id}" frame ${i}`).toBeDefined();
        expect(frame.queue, `scenario "${id}" frame ${i}`).toBeDefined();
      }
    }
  });
});

describe("forVar scenario — classic closure bug", () => {
  const timeline = SCENARIOS.forVar.timeline;

  it("all console logs output '3' (shared scope, mutated i)", () => {
    const logs = timeline.filter((f) => f.log !== undefined).map((f) => f.log);
    expect(logs).toEqual(["3", "3", "3"]);
  });

  it("i reaches 3 before any callback fires", () => {
    const firstLog = timeline.findIndex((f) => f.log !== undefined);
    const frameBeforeFirstLog = timeline[firstLog - 1];
    const globalScope = frameBeforeFirstLog.scopes.find(
      (s) => s.id === "global"
    );
    const iBinding = globalScope?.bindings.find((b) => b.name === "i");
    expect(iBinding?.value).toBe("3");
  });
});

describe("forLet scenario — block-scoped fix", () => {
  const timeline = SCENARIOS.forLet.timeline;

  it("console logs output '0', '1', '2' in order (independent scopes)", () => {
    const logs = timeline.filter((f) => f.log !== undefined).map((f) => f.log);
    expect(logs).toEqual(["0", "1", "2"]);
  });

  it("each callback highlights a different block scope", () => {
    const logFrames = timeline.filter((f) => f.log !== undefined);
    const highlightedScopes = logFrames.map((f) => f.highlight?.scopeId);
    expect(new Set(highlightedScopes).size).toBe(3);
  });
});

describe("counter scenario", () => {
  it("final log is '2' (count incremented twice)", () => {
    const logs = SCENARIOS.counter.timeline
      .filter((f) => f.log !== undefined)
      .map((f) => f.log);
    expect(logs.at(-1)).toBe("2");
  });
});
