export type NodeId =
  | "app"
  | "header"
  | "page"
  | "logo"
  | "nav"
  | "counter"
  | "footer";

export type NodePhase =
  | "hidden"
  | "idle"
  | "new"
  | "render"
  | "bailout"
  | "dirty"
  | "commit"
  | "effect";

export interface FiberFrame {
  nodes: Record<NodeId, NodePhase>;
  codeHighlight?: number;
}

export type ScenarioId = "initialRender" | "stateUpdate" | "effects";

export interface Scenario {
  code: string;
  timeline: FiberFrame[];
}

const hidden: Record<NodeId, NodePhase> = {
  app: "hidden",
  header: "hidden",
  page: "hidden",
  logo: "hidden",
  nav: "hidden",
  counter: "hidden",
  footer: "hidden",
};

const idle: Record<NodeId, NodePhase> = {
  app: "idle",
  header: "idle",
  page: "idle",
  logo: "idle",
  nav: "idle",
  counter: "idle",
  footer: "idle",
};

export const SCENARIOS: Record<ScenarioId, Scenario> = {
  initialRender: {
    code: `function App() {
  return (
    <>
      <Header>
        <Logo />
        <NavLinks />
      </Header>
      <Page>
        <Counter />
        <Footer />
      </Page>
    </>
  );
}`,
    timeline: [
      { nodes: { ...hidden } },
      { nodes: { ...hidden, app: "new" }, codeHighlight: 1 },
      { nodes: { ...hidden, app: "new", header: "new" }, codeHighlight: 4 },
      {
        nodes: { ...hidden, app: "new", header: "new", logo: "new" },
        codeHighlight: 5,
      },
      {
        nodes: { ...hidden, app: "new", header: "new", logo: "new", nav: "new" },
        codeHighlight: 6,
      },
      {
        nodes: {
          ...hidden,
          app: "new",
          header: "new",
          logo: "new",
          nav: "new",
          page: "new",
        },
        codeHighlight: 8,
      },
      {
        nodes: {
          ...hidden,
          app: "new",
          header: "new",
          logo: "new",
          nav: "new",
          page: "new",
          counter: "new",
        },
        codeHighlight: 9,
      },
      {
        nodes: {
          app: "new",
          header: "new",
          logo: "new",
          nav: "new",
          page: "new",
          counter: "new",
          footer: "new",
        },
        codeHighlight: 10,
      },
      {
        nodes: {
          app: "render",
          header: "render",
          logo: "render",
          nav: "render",
          page: "render",
          counter: "render",
          footer: "render",
        },
      },
      {
        nodes: {
          app: "commit",
          header: "commit",
          logo: "commit",
          nav: "commit",
          page: "commit",
          counter: "commit",
          footer: "commit",
        },
      },
      { nodes: { ...idle } },
    ],
  },

  stateUpdate: {
    code: `function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button
      onClick={() => setCount(c => c + 1)}
    >
      {count}
    </button>
  );
}`,
    timeline: [
      { nodes: { ...idle } },
      { nodes: { ...idle, counter: "dirty" }, codeHighlight: 6 },
      { nodes: { ...idle, counter: "dirty" } },
      { nodes: { ...idle, app: "bailout", counter: "dirty" } },
      {
        nodes: {
          app: "bailout",
          header: "bailout",
          logo: "bailout",
          nav: "bailout",
          page: "bailout",
          counter: "dirty",
          footer: "idle",
        },
      },
      {
        nodes: {
          app: "bailout",
          header: "bailout",
          logo: "bailout",
          nav: "bailout",
          page: "bailout",
          counter: "render",
          footer: "idle",
        },
        codeHighlight: 2,
      },
      {
        nodes: {
          app: "bailout",
          header: "bailout",
          logo: "bailout",
          nav: "bailout",
          page: "bailout",
          counter: "render",
          footer: "bailout",
        },
      },
      { nodes: { ...idle, counter: "commit" } },
      { nodes: { ...idle } },
    ],
  },

  effects: {
    code: `function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Count: \${count}\`;
    return () => { /* cleanup */ };
  }, [count]);

  return <button ...>{count}</button>;
}`,
    timeline: [
      { nodes: { ...idle } },
      { nodes: { ...idle, counter: "dirty" }, codeHighlight: 9 },
      { nodes: { ...idle, counter: "render" }, codeHighlight: 2 },
      { nodes: { ...idle, counter: "render" }, codeHighlight: 4 },
      { nodes: { ...idle, counter: "commit" } },
      { nodes: { ...idle, counter: "effect" }, codeHighlight: 5 },
      { nodes: { ...idle } },
    ],
  },
};

export const SCENARIO_IDS: ScenarioId[] = [
  "initialRender",
  "stateUpdate",
  "effects",
];

export const IDLE_FRAME: FiberFrame = { nodes: { ...idle } };
