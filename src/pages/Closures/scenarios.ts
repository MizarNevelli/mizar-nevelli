/**
 * Scripted timelines for the closures visualizer.
 *
 * Only structural data lives here (code, per-frame scope stack + queue + log +
 * highlight + focused line). Narration strings live in i18n under
 * `closures.scenarios.<id>.narrations[i]`.
 *
 * The order of `scopes` is outermost → innermost (global first).
 * Scope IDs must be stable across frames so framer-motion can animate them.
 */

export type Binding = { name: string; value: string };
export type ScopeStatus = "active" | "captured" | "gone";

export type Scope = {
  id: string;
  label: string;
  bindings: Binding[];
  status: ScopeStatus;
};

export type Frame = {
  /** 1-indexed source line to highlight. */
  line: number;
  scopes: Scope[];
  /** Which binding (if any) is being read/written this step. */
  highlight?: { scopeId: string; name: string };
  /** Pending setTimeout callbacks. */
  queue: string[];
  /** If set, this frame appends a line to the console output. */
  log?: string;
};

export type Scenario = {
  code: string;
  timeline: Frame[];
};

export type ScenarioId = "basic" | "counter" | "forVar" | "forLet";

const GLOBAL_ONLY: Scope[] = [
  { id: "global", label: "global", bindings: [], status: "active" },
];

// ─────────── 1 · basic ───────────
const basic: Scenario = {
  code: `function outer() {
  const secret = 42
  return function inner() {
    return secret
  }
}

const f = outer()
console.log(f())`,
  timeline: [
    // 0 — initial
    {
      line: 8,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [{ name: "outer", value: "ƒ outer" }],
          status: "active",
        },
      ],
      queue: [],
    },
    // 1 — outer() invoked
    {
      line: 1,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [{ name: "outer", value: "ƒ outer" }],
          status: "active",
        },
        { id: "outer", label: "outer()", bindings: [], status: "active" },
      ],
      queue: [],
    },
    // 2 — const secret = 42
    {
      line: 2,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [{ name: "outer", value: "ƒ outer" }],
          status: "active",
        },
        {
          id: "outer",
          label: "outer()",
          bindings: [{ name: "secret", value: "42" }],
          status: "active",
        },
      ],
      highlight: { scopeId: "outer", name: "secret" },
      queue: [],
    },
    // 3 — inner created inside outer
    {
      line: 3,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [{ name: "outer", value: "ƒ outer" }],
          status: "active",
        },
        {
          id: "outer",
          label: "outer()",
          bindings: [
            { name: "secret", value: "42" },
            { name: "inner", value: "ƒ inner" },
          ],
          status: "active",
        },
      ],
      queue: [],
    },
    // 4 — outer returns; outer scope becomes captured (held by f)
    {
      line: 8,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [
            { name: "outer", value: "ƒ outer" },
            { name: "f", value: "ƒ inner" },
          ],
          status: "active",
        },
        {
          id: "outer",
          label: "outer()",
          bindings: [
            { name: "secret", value: "42" },
            { name: "inner", value: "ƒ inner" },
          ],
          status: "captured",
        },
      ],
      queue: [],
    },
    // 5 — f() called; inner scope pushed
    {
      line: 9,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [
            { name: "outer", value: "ƒ outer" },
            { name: "f", value: "ƒ inner" },
          ],
          status: "active",
        },
        {
          id: "outer",
          label: "outer()",
          bindings: [
            { name: "secret", value: "42" },
            { name: "inner", value: "ƒ inner" },
          ],
          status: "captured",
        },
        { id: "inner", label: "inner()", bindings: [], status: "active" },
      ],
      queue: [],
    },
    // 6 — return secret reads through captured chain
    {
      line: 4,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [
            { name: "outer", value: "ƒ outer" },
            { name: "f", value: "ƒ inner" },
          ],
          status: "active",
        },
        {
          id: "outer",
          label: "outer()",
          bindings: [
            { name: "secret", value: "42" },
            { name: "inner", value: "ƒ inner" },
          ],
          status: "captured",
        },
        { id: "inner", label: "inner()", bindings: [], status: "active" },
      ],
      highlight: { scopeId: "outer", name: "secret" },
      queue: [],
    },
    // 7 — logs 42
    {
      line: 9,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [
            { name: "outer", value: "ƒ outer" },
            { name: "f", value: "ƒ inner" },
          ],
          status: "active",
        },
        {
          id: "outer",
          label: "outer()",
          bindings: [
            { name: "secret", value: "42" },
            { name: "inner", value: "ƒ inner" },
          ],
          status: "captured",
        },
      ],
      queue: [],
      log: "42",
    },
  ],
};

// ─────────── 2 · counter ───────────
const counter: Scenario = {
  code: `function makeCounter() {
  let count = 0
  return {
    inc: () => ++count,
    get: () => count,
  }
}

const c = makeCounter()
c.inc()
c.inc()
console.log(c.get())`,
  timeline: [
    // 0 — enter makeCounter
    {
      line: 1,
      scopes: [
        { id: "global", label: "global", bindings: [], status: "active" },
        { id: "mc", label: "makeCounter()", bindings: [], status: "active" },
      ],
      queue: [],
    },
    // 1 — let count = 0
    {
      line: 2,
      scopes: [
        { id: "global", label: "global", bindings: [], status: "active" },
        {
          id: "mc",
          label: "makeCounter()",
          bindings: [{ name: "count", value: "0" }],
          status: "active",
        },
      ],
      highlight: { scopeId: "mc", name: "count" },
      queue: [],
    },
    // 2 — return { inc, get } — both closures over makeCounter
    {
      line: 3,
      scopes: [
        { id: "global", label: "global", bindings: [], status: "active" },
        {
          id: "mc",
          label: "makeCounter()",
          bindings: [
            { name: "count", value: "0" },
            { name: "inc", value: "ƒ (closure)" },
            { name: "get", value: "ƒ (closure)" },
          ],
          status: "active",
        },
      ],
      queue: [],
    },
    // 3 — makeCounter returns → scope captured
    {
      line: 9,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [{ name: "c", value: "{ inc, get }" }],
          status: "active",
        },
        {
          id: "mc",
          label: "makeCounter()",
          bindings: [
            { name: "count", value: "0" },
            { name: "inc", value: "ƒ (closure)" },
            { name: "get", value: "ƒ (closure)" },
          ],
          status: "captured",
        },
      ],
      queue: [],
    },
    // 4 — c.inc() → count 0 → 1
    {
      line: 10,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [{ name: "c", value: "{ inc, get }" }],
          status: "active",
        },
        {
          id: "mc",
          label: "makeCounter()",
          bindings: [
            { name: "count", value: "1" },
            { name: "inc", value: "ƒ (closure)" },
            { name: "get", value: "ƒ (closure)" },
          ],
          status: "captured",
        },
      ],
      highlight: { scopeId: "mc", name: "count" },
      queue: [],
    },
    // 5 — c.inc() again → count 1 → 2
    {
      line: 11,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [{ name: "c", value: "{ inc, get }" }],
          status: "active",
        },
        {
          id: "mc",
          label: "makeCounter()",
          bindings: [
            { name: "count", value: "2" },
            { name: "inc", value: "ƒ (closure)" },
            { name: "get", value: "ƒ (closure)" },
          ],
          status: "captured",
        },
      ],
      highlight: { scopeId: "mc", name: "count" },
      queue: [],
    },
    // 6 — c.get() reads count
    {
      line: 5,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [{ name: "c", value: "{ inc, get }" }],
          status: "active",
        },
        {
          id: "mc",
          label: "makeCounter()",
          bindings: [
            { name: "count", value: "2" },
            { name: "inc", value: "ƒ (closure)" },
            { name: "get", value: "ƒ (closure)" },
          ],
          status: "captured",
        },
      ],
      highlight: { scopeId: "mc", name: "count" },
      queue: [],
    },
    // 7 — console.log(2)
    {
      line: 12,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [{ name: "c", value: "{ inc, get }" }],
          status: "active",
        },
        {
          id: "mc",
          label: "makeCounter()",
          bindings: [
            { name: "count", value: "2" },
            { name: "inc", value: "ƒ (closure)" },
            { name: "get", value: "ƒ (closure)" },
          ],
          status: "captured",
        },
      ],
      queue: [],
      log: "2",
    },
  ],
};

// ─────────── 3 · forVar ───────────
const forVar: Scenario = {
  code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i)
  }, 0)
}`,
  timeline: [
    // 0 — enter loop, var i lifted into global (function) scope
    {
      line: 1,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [{ name: "i", value: "0" }],
          status: "active",
        },
      ],
      highlight: { scopeId: "global", name: "i" },
      queue: [],
    },
    // 1 — setTimeout schedules cb capturing global
    {
      line: 2,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [{ name: "i", value: "0" }],
          status: "active",
        },
      ],
      queue: ["cb → log(i) [captures global]"],
    },
    // 2 — i++ → 1, schedule cb2
    {
      line: 2,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [{ name: "i", value: "1" }],
          status: "active",
        },
      ],
      highlight: { scopeId: "global", name: "i" },
      queue: [
        "cb → log(i) [captures global]",
        "cb → log(i) [captures global]",
      ],
    },
    // 3 — i++ → 2, schedule cb3
    {
      line: 2,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [{ name: "i", value: "2" }],
          status: "active",
        },
      ],
      highlight: { scopeId: "global", name: "i" },
      queue: [
        "cb → log(i) [captures global]",
        "cb → log(i) [captures global]",
        "cb → log(i) [captures global]",
      ],
    },
    // 4 — i++ → 3, loop exits, i stuck at 3
    {
      line: 1,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [{ name: "i", value: "3" }],
          status: "active",
        },
      ],
      highlight: { scopeId: "global", name: "i" },
      queue: [
        "cb → log(i) [captures global]",
        "cb → log(i) [captures global]",
        "cb → log(i) [captures global]",
      ],
    },
    // 5 — stack empty; loop drains task queue
    {
      line: 0,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [{ name: "i", value: "3" }],
          status: "active",
        },
      ],
      queue: [
        "cb → log(i) [captures global]",
        "cb → log(i) [captures global]",
        "cb → log(i) [captures global]",
      ],
    },
    // 6 — cb1 fires, logs 3
    {
      line: 3,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [{ name: "i", value: "3" }],
          status: "active",
        },
      ],
      highlight: { scopeId: "global", name: "i" },
      queue: [
        "cb → log(i) [captures global]",
        "cb → log(i) [captures global]",
      ],
      log: "3",
    },
    // 7 — cb2 fires, logs 3
    {
      line: 3,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [{ name: "i", value: "3" }],
          status: "active",
        },
      ],
      highlight: { scopeId: "global", name: "i" },
      queue: ["cb → log(i) [captures global]"],
      log: "3",
    },
    // 8 — cb3 fires, logs 3
    {
      line: 3,
      scopes: [
        {
          id: "global",
          label: "global",
          bindings: [{ name: "i", value: "3" }],
          status: "active",
        },
      ],
      highlight: { scopeId: "global", name: "i" },
      queue: [],
      log: "3",
    },
  ],
};

// ─────────── 4 · forLet ───────────
const forLet: Scenario = {
  code: `for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i)
  }, 0)
}`,
  timeline: [
    // 0 — iter 0: fresh block scope with i=0
    {
      line: 1,
      scopes: [
        { id: "global", label: "global", bindings: [], status: "active" },
        {
          id: "block-0",
          label: "block { i=0 }",
          bindings: [{ name: "i", value: "0" }],
          status: "active",
        },
      ],
      highlight: { scopeId: "block-0", name: "i" },
      queue: [],
    },
    // 1 — setTimeout captures block-0
    {
      line: 2,
      scopes: [
        { id: "global", label: "global", bindings: [], status: "active" },
        {
          id: "block-0",
          label: "block { i=0 }",
          bindings: [{ name: "i", value: "0" }],
          status: "captured",
        },
      ],
      queue: ["cb → log(i) [captures block { i=0 }]"],
    },
    // 2 — iter 1: fresh block scope with i=1
    {
      line: 1,
      scopes: [
        { id: "global", label: "global", bindings: [], status: "active" },
        {
          id: "block-0",
          label: "block { i=0 }",
          bindings: [{ name: "i", value: "0" }],
          status: "captured",
        },
        {
          id: "block-1",
          label: "block { i=1 }",
          bindings: [{ name: "i", value: "1" }],
          status: "active",
        },
      ],
      highlight: { scopeId: "block-1", name: "i" },
      queue: ["cb → log(i) [captures block { i=0 }]"],
    },
    // 3 — setTimeout captures block-1
    {
      line: 2,
      scopes: [
        { id: "global", label: "global", bindings: [], status: "active" },
        {
          id: "block-0",
          label: "block { i=0 }",
          bindings: [{ name: "i", value: "0" }],
          status: "captured",
        },
        {
          id: "block-1",
          label: "block { i=1 }",
          bindings: [{ name: "i", value: "1" }],
          status: "captured",
        },
      ],
      queue: [
        "cb → log(i) [captures block { i=0 }]",
        "cb → log(i) [captures block { i=1 }]",
      ],
    },
    // 4 — iter 2: fresh scope with i=2, setTimeout captures it
    {
      line: 2,
      scopes: [
        { id: "global", label: "global", bindings: [], status: "active" },
        {
          id: "block-0",
          label: "block { i=0 }",
          bindings: [{ name: "i", value: "0" }],
          status: "captured",
        },
        {
          id: "block-1",
          label: "block { i=1 }",
          bindings: [{ name: "i", value: "1" }],
          status: "captured",
        },
        {
          id: "block-2",
          label: "block { i=2 }",
          bindings: [{ name: "i", value: "2" }],
          status: "captured",
        },
      ],
      queue: [
        "cb → log(i) [captures block { i=0 }]",
        "cb → log(i) [captures block { i=1 }]",
        "cb → log(i) [captures block { i=2 }]",
      ],
    },
    // 5 — loop exits; three captured scopes remain
    {
      line: 0,
      scopes: [
        { id: "global", label: "global", bindings: [], status: "active" },
        {
          id: "block-0",
          label: "block { i=0 }",
          bindings: [{ name: "i", value: "0" }],
          status: "captured",
        },
        {
          id: "block-1",
          label: "block { i=1 }",
          bindings: [{ name: "i", value: "1" }],
          status: "captured",
        },
        {
          id: "block-2",
          label: "block { i=2 }",
          bindings: [{ name: "i", value: "2" }],
          status: "captured",
        },
      ],
      queue: [
        "cb → log(i) [captures block { i=0 }]",
        "cb → log(i) [captures block { i=1 }]",
        "cb → log(i) [captures block { i=2 }]",
      ],
    },
    // 6 — cb1 fires: reads block-0's i
    {
      line: 3,
      scopes: [
        { id: "global", label: "global", bindings: [], status: "active" },
        {
          id: "block-0",
          label: "block { i=0 }",
          bindings: [{ name: "i", value: "0" }],
          status: "captured",
        },
        {
          id: "block-1",
          label: "block { i=1 }",
          bindings: [{ name: "i", value: "1" }],
          status: "captured",
        },
        {
          id: "block-2",
          label: "block { i=2 }",
          bindings: [{ name: "i", value: "2" }],
          status: "captured",
        },
      ],
      highlight: { scopeId: "block-0", name: "i" },
      queue: [
        "cb → log(i) [captures block { i=1 }]",
        "cb → log(i) [captures block { i=2 }]",
      ],
      log: "0",
    },
    // 7 — cb2 fires: reads block-1's i
    {
      line: 3,
      scopes: [
        { id: "global", label: "global", bindings: [], status: "active" },
        {
          id: "block-1",
          label: "block { i=1 }",
          bindings: [{ name: "i", value: "1" }],
          status: "captured",
        },
        {
          id: "block-2",
          label: "block { i=2 }",
          bindings: [{ name: "i", value: "2" }],
          status: "captured",
        },
      ],
      highlight: { scopeId: "block-1", name: "i" },
      queue: ["cb → log(i) [captures block { i=2 }]"],
      log: "1",
    },
    // 8 — cb3 fires: reads block-2's i
    {
      line: 3,
      scopes: [
        { id: "global", label: "global", bindings: [], status: "active" },
        {
          id: "block-2",
          label: "block { i=2 }",
          bindings: [{ name: "i", value: "2" }],
          status: "captured",
        },
      ],
      highlight: { scopeId: "block-2", name: "i" },
      queue: [],
      log: "2",
    },
  ],
};

export const SCENARIOS: Record<ScenarioId, Scenario> = {
  basic,
  counter,
  forVar,
  forLet,
};

export const SCENARIO_IDS: ScenarioId[] = [
  "basic",
  "counter",
  "forVar",
  "forLet",
];

// Utility for the visualizer's idle state.
export const IDLE_FRAME: Frame = {
  line: 0,
  scopes: GLOBAL_ONLY,
  queue: [],
};
