import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n";

// Suppress THREE.Clock deprecation noise from @react-three/fiber internals.
const _warn = console.warn.bind(console);
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
  _warn(...args);
};

// Welcome console message
console.warn(
  "%c⭐  MIZAR\n%c👀  Were you looking for warnings or errors?\n%c   Detail-oriented dev here, there aren't any.\n\n%c   → JS, everywhere. Even in DevTools.",
  "font-size:15px;font-weight:700;letter-spacing:0.12em;color:#f5cf5c;font-family:monospace",
  "font-size:13px;font-weight:600;color:#fff;font-family:monospace;line-height:2",
  "font-size:13px;color:rgba(255,255,255,0.45);font-family:monospace;line-height:2",
  "font-size:11px;color:#d4a017;font-family:monospace"
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
