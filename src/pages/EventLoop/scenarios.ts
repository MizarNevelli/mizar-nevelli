/**
 * Scripted timelines for the event-loop visualizer.
 *
 * Only *structural* data lives here (code, per-frame queue state, highlighted
 * line). Human-readable strings (scenario labels, per-frame narration) live in
 * the i18n JSON files under `eventLoop.scenarios.<id>`, the page looks them
 * up by scenario id + frame index.
 *
 * This is deliberately not a real JS interpreter: the goal is pedagogical
 * clarity, not correctness under every edge case.
 */

export type Frame = {
  /** 1-indexed line of the source snippet currently in focus. */
  line: number;
  stack: string[];
  microtasks: string[];
  macrotasks: string[];
};

export type Scenario = {
  code: string;
  timeline: Frame[];
};

export type ScenarioId = "classic" | "promises" | "nested";

const classic: Scenario = {
  code: `console.log('A')

setTimeout(() => {
  console.log('B')
}, 0)

Promise.resolve().then(() => {
  console.log('C')
})

console.log('D')`,
  timeline: [
    { line: 1, stack: ["console.log('A')"], microtasks: [], macrotasks: [] },
    { line: 3, stack: ["setTimeout(...)"], microtasks: [], macrotasks: [] },
    { line: 3, stack: [], microtasks: [], macrotasks: ["() => log('B')"] },
    {
      line: 7,
      stack: ["Promise.resolve().then(...)"],
      microtasks: [],
      macrotasks: ["() => log('B')"],
    },
    {
      line: 7,
      stack: [],
      microtasks: ["() => log('C')"],
      macrotasks: ["() => log('B')"],
    },
    {
      line: 11,
      stack: ["console.log('D')"],
      microtasks: ["() => log('C')"],
      macrotasks: ["() => log('B')"],
    },
    {
      line: 11,
      stack: [],
      microtasks: ["() => log('C')"],
      macrotasks: ["() => log('B')"],
    },
    {
      line: 8,
      stack: ["() => log('C')"],
      microtasks: [],
      macrotasks: ["() => log('B')"],
    },
    { line: 4, stack: ["() => log('B')"], microtasks: [], macrotasks: [] },
  ],
};

const promises: Scenario = {
  code: `Promise.resolve('start')
  .then(v => {
    console.log(v)
    return 'next'
  })
  .then(v => {
    console.log(v)
  })

console.log('sync')`,
  timeline: [
    { line: 1, stack: ["Promise.resolve(...)"], microtasks: [], macrotasks: [] },
    { line: 2, stack: [".then(...)"], microtasks: ["step 1"], macrotasks: [] },
    {
      line: 10,
      stack: ["console.log('sync')"],
      microtasks: ["step 1"],
      macrotasks: [],
    },
    { line: 10, stack: [], microtasks: ["step 1"], macrotasks: [] },
    { line: 3, stack: ["step 1"], microtasks: [], macrotasks: [] },
    { line: 6, stack: [], microtasks: ["step 2"], macrotasks: [] },
    { line: 7, stack: ["step 2"], microtasks: [], macrotasks: [] },
  ],
};

const nested: Scenario = {
  code: `setTimeout(() => console.log('task'), 0)

Promise.resolve().then(function chain() {
  console.log('micro')
  Promise.resolve().then(chain)
})`,
  timeline: [
    { line: 1, stack: ["setTimeout(...)"], microtasks: [], macrotasks: [] },
    { line: 1, stack: [], microtasks: [], macrotasks: ["log('task')"] },
    {
      line: 3,
      stack: [".then(chain)"],
      microtasks: ["chain"],
      macrotasks: ["log('task')"],
    },
    {
      line: 3,
      stack: [],
      microtasks: ["chain"],
      macrotasks: ["log('task')"],
    },
    {
      line: 4,
      stack: ["chain"],
      microtasks: [],
      macrotasks: ["log('task')"],
    },
    {
      line: 5,
      stack: ["chain"],
      microtasks: ["chain"],
      macrotasks: ["log('task')"],
    },
    {
      line: 5,
      stack: [],
      microtasks: ["chain"],
      macrotasks: ["log('task')"],
    },
    {
      line: 4,
      stack: ["chain"],
      microtasks: [],
      macrotasks: ["log('task')"],
    },
    {
      line: 5,
      stack: ["chain"],
      microtasks: ["chain"],
      macrotasks: ["log('task')"],
    },
  ],
};

export const SCENARIOS: Record<ScenarioId, Scenario> = {
  classic,
  promises,
  nested,
};

export const SCENARIO_IDS: ScenarioId[] = ["classic", "promises", "nested"];
