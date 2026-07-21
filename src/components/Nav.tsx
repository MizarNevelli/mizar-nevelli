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

  const jsActive = JS_FEATURE_KEYS.some((f) => location.pathname === f.to);

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

  useEffect(() => setOpen(false), [location.pathname]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm transition-colors ${
      isActive ? "text-bone" : "text-bone/55 hover:text-bone"
    }`;

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-night/80 backdrop-blur-md hair-b">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        {/* Wordmark — Mizar as star, not brand */}
        <NavLink to="/" className="flex items-baseline gap-2 group">
          <span className="font-mono tnum uppercase tracking-[0.22em] text-[11px] text-bone">
            MIZAR
          </span>
          <span className="coord">· ζ UMa</span>
        </NavLink>

        <ul className="flex items-center gap-6">
          <li>
            <NavLink to="/" end className={linkClass}>
              {t("nav.home")}
            </NavLink>
          </li>
          <li ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-haspopup="menu"
              className={`text-sm transition-colors inline-flex items-baseline gap-1 ${
                jsActive || open
                  ? "text-bone"
                  : "text-bone/55 hover:text-bone"
              }`}
            >
              {t("nav.js")}
              <span className="coord text-[9px]">▾</span>
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 mt-4 w-72 hair bg-ink"
                >
                  <div className="px-4 pt-3 pb-2 hair-b">
                    <span className="coord">{t("nav.jsFeatures")}</span>
                  </div>
                  <ul>
                    {JS_FEATURE_KEYS.map((feat, i) => (
                      <li
                        key={feat.to}
                        role="none"
                        className={i > 0 ? "hair-t" : ""}
                      >
                        <NavLink
                          to={feat.to}
                          role="menuitem"
                          className={({ isActive }) =>
                            `block px-4 py-3 transition-colors group ${
                              isActive
                                ? "bg-star/5 text-bone"
                                : "text-bone/75 hover:bg-bone/5 hover:text-bone"
                            }`
                          }
                        >
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="text-sm">
                              {t(`nav.features.${feat.key}.label`)}
                            </span>
                            <span className="coord opacity-60 group-hover:text-star group-hover:opacity-100 transition-colors">
                              obs. {i === 0 ? "i" : "ii"}
                            </span>
                          </div>
                          <p className="text-xs text-bone/45 mt-1">
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
            <NavLink to="/contact" className={linkClass}>
              {t("nav.contact")}
            </NavLink>
          </li>
          <li className="pl-4 ml-2 hair-l">
            <LanguageSwitcher />
          </li>
        </ul>
      </div>
    </header>
  );
}
