export type Binding = { name: string; value: string };
export type ScopeStatus = "active" | "captured" | "gone";

export type Scope = {
  id: string;
  label: string;
  bindings: Binding[];
  status: ScopeStatus;
};

export type Frame = {
  line: number;
  scopes: Scope[];
  highlight?: { scopeId: string; name: string };
  queue: string[];
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
    {
      line: 1,
      scopes: [
        { id: "global", label: "global", bindings: [], status: "active" },
        { id: "mc", label: "makeCounter()", bindings: [], status: "active" },
      ],
      queue: [],
    },
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

const forVar: Scenario = {
  code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i)
  }, 0)
}`,
  timeline: [
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

const forLet: Scenario = {
  code: `for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i)
  }, 0)
}`,
  timeline: [
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
