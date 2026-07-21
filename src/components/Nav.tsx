import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

const JS_FEATURE_KEYS = [
  { to: "/event-loop", key: "eventLoop" },
  { to: "/event-bubbling", key: "eventBubbling" },
] as const;

export function Nav() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const location = useLocation();

  // "JS" tab reads as active if the current route is any of its children.
  const jsActive = JS_FEATURE_KEYS.some((f) => location.pathname === f.to);

  // Close on outside click + Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Auto-close when the route changes
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto mt-4 max-w-4xl px-4">
        <nav className="glass rounded-full px-5 py-2.5 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 group">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
            <span className="text-white font-medium tracking-tight">
              Mizar<span className="text-accent-soft">.js</span>
            </span>
          </NavLink>
          <ul className="flex items-center gap-1 text-sm">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full transition-colors ${
                    isActive
                      ? "text-white bg-white/10"
                      : "text-white/60 hover:text-white"
                  }`
                }
              >
                {t("nav.home")}
              </NavLink>
            </li>
            <li ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-haspopup="menu"
                className={`px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1.5 ${
                  jsActive || open
                    ? "text-white bg-white/10"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {t("nav.js")}
                <motion.svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  aria-hidden
                >
                  <path
                    d="M1 3l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-3 w-72 rounded-2xl p-2 origin-top-right shadow-2xl shadow-black/60 bg-ink-900/90 backdrop-blur-xl border border-white/10"
                  >
                    <div className="px-3 pt-2 pb-1">
                      <p className="text-[10px] uppercase tracking-widest text-white/40">
                        {t("nav.jsFeatures")}
                      </p>
                    </div>
                    <ul className="space-y-1">
                      {JS_FEATURE_KEYS.map((feat) => (
                        <li key={feat.to} role="none">
                          <NavLink
                            to={feat.to}
                            role="menuitem"
                            className={({ isActive }) =>
                              `block rounded-xl px-3 py-2.5 transition-colors group ${
                                isActive
                                  ? "bg-accent/15 text-white"
                                  : "text-white/80 hover:bg-white/5 hover:text-white"
                              }`
                            }
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {t(`nav.features.${feat.key}.label`)}
                              </span>
                              <span className="text-white/30 group-hover:text-accent-soft transition-colors">
                                →
                              </span>
                            </div>
                            <p className="text-xs text-white/50 mt-0.5">
                              {t(`nav.features.${feat.key}.description`)}
                            </p>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full transition-colors ${
                    isActive
                      ? "text-white bg-white/10"
                      : "text-white/60 hover:text-white"
                  }`
                }
              >
                {t("nav.contact")}
              </NavLink>
            </li>
            <li className="ml-1 pl-2 border-l border-white/10">
              <LanguageSwitcher />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
