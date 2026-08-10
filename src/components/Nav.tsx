import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { BurgerIcon } from "./BurgerIcon";

const JS_FEATURE_KEYS = [
  { to: "/event-loop", key: "eventLoop" },
  { to: "/event-bubbling", key: "eventBubbling" },
  { to: "/closures", key: "closures" },
] as const;

type TopLinkKey = "home" | "about" | "blog" | "contact";
const TOP_LINKS: Array<{ to: string; key: TopLinkKey; end?: boolean }> = [
  { to: "/", key: "home", end: true },
  { to: "/about", key: "about" },
  { to: "/blog", key: "blog" },
  { to: "/contact", key: "contact" },
];

export function Nav() {
  const { t } = useTranslation();
  const [jsOpen, setJsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const location = useLocation();

  const jsActive = JS_FEATURE_KEYS.some((f) => location.pathname === f.to);

  // Close desktop JS dropdown on outside click + Escape.
  useEffect(() => {
    if (!jsOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setJsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setJsOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [jsOpen]);

  // Close mobile menu on Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Lock body scroll while the mobile overlay is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  // Route change closes everything.
  useEffect(() => {
    setJsOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto mt-4 max-w-6xl px-4 flex items-start justify-between gap-3">

        {/* ── LEFT PILL — logo + mobile burger ── */}
        <div className="relative flex-1 md:flex-none">
          <div
            aria-hidden
            className="nav-border-glow absolute inset-[-1.5px] rounded-full pointer-events-none"
          />
          <nav className="glass rounded-full px-5 py-2.5 flex items-center justify-between md:justify-start gap-3">
            <NavLink to="/" className="flex items-center gap-2 group">
              <span
                className="relative inline-flex items-center justify-center shrink-0"
                style={{ width: 14, height: 14 }}
              >
                <motion.span
                  aria-hidden
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    inset: -10,
                    background:
                      "radial-gradient(circle, rgba(240,190,60,0.22) 0%, rgba(240,190,60,0.05) 55%, transparent 72%)",
                  }}
                  animate={{ scale: [0.85, 1.2, 0.85], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.span
                  className="inline-flex"
                  whileHover={{ scale: 1.35 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    aria-hidden
                    style={{ overflow: "visible" }}
                    animate={{
                      scale: [1, 1.07, 0.96, 1.05, 0.99, 1],
                      filter: [
                        "drop-shadow(0 0 1.5px rgba(240,190,60,0.45))",
                        "drop-shadow(0 0 5px rgba(240,190,60,1)) drop-shadow(0 0 10px rgba(240,190,60,0.4))",
                        "drop-shadow(0 0 2px rgba(240,190,60,0.55))",
                        "drop-shadow(0 0 5px rgba(240,190,60,0.9)) drop-shadow(0 0 8px rgba(240,190,60,0.3))",
                        "drop-shadow(0 0 2px rgba(240,190,60,0.45))",
                        "drop-shadow(0 0 1.5px rgba(240,190,60,0.45))",
                      ],
                    }}
                    transition={{
                      scale: {
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.15, 0.4, 0.62, 0.82, 1],
                      },
                      filter: {
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.15, 0.4, 0.62, 0.82, 1],
                      },
                    }}
                  >
                    <path d="M-8 8L8 7.25L24 8L8 8.75Z" fill="rgba(240,190,60,0.32)" />
                    <path d="M8-8L8.75 8L8 24L7.25 8Z" fill="rgba(240,190,60,0.32)" />
                    <path
                      d="M8 1L9.8 5.6L14.7 5.8L10.9 8.9L12.1 13.7L8 11L3.9 13.7L5.1 8.9L1.3 5.8L6.2 5.6Z"
                      fill="white"
                    />
                  </motion.svg>
                </motion.span>
              </span>
              <span className="font-medium tracking-tight bg-gradient-to-r from-accent-soft via-white to-white bg-clip-text text-transparent">
                Mizar
              </span>
            </NavLink>

            {/* Mobile burger lives inside the logo pill */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="md:hidden relative w-9 h-9 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              <BurgerIcon open={mobileOpen} />
            </button>
          </nav>
        </div>

        {/* ── RIGHT PILL — links + language switcher (desktop only) ── */}
        <div className="relative hidden md:block">
          <div
            aria-hidden
            className="nav-border-glow absolute inset-[-1.5px] rounded-full pointer-events-none"
          />
          <nav className="glass rounded-full px-3 py-2.5">
            <ul className="flex items-center gap-1 text-sm">
              {TOP_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-full transition-colors ${
                        isActive
                          ? "text-white bg-white/10"
                          : "text-white/60 hover:text-white"
                      }`
                    }
                  >
                    {t(`nav.${link.key}`)}
                  </NavLink>
                </li>
              ))}
              <li ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setJsOpen((o) => !o)}
                  aria-expanded={jsOpen}
                  aria-haspopup="menu"
                  className={`px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1.5 ${
                    jsActive || jsOpen
                      ? "text-white bg-white/10"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {t("nav.js")}
                  <motion.svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    animate={{ rotate: jsOpen ? 180 : 0 }}
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
                  {jsOpen && (
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

              <li className="ml-1 pl-2 border-l border-white/10">
                <LanguageSwitcher />
              </li>
            </ul>
          </nav>
        </div>

      </div>

      {/* ────────── MOBILE FULL-SCREEN OVERLAY ────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            onClose={() => setMobileOpen(false)}
            topLinks={TOP_LINKS}
            jsFeatureKeys={JS_FEATURE_KEYS}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
