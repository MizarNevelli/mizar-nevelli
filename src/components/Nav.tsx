import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

const JS_FEATURE_KEYS = [
  { to: "/event-loop", key: "eventLoop" },
  { to: "/event-bubbling", key: "eventBubbling" },
] as const;

type TopLinkKey = "home" | "about" | "contact";
const TOP_LINKS: Array<{ to: string; key: TopLinkKey; end?: boolean }> = [
  { to: "/", key: "home", end: true },
  { to: "/about", key: "about" },
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
      <div className="mx-auto mt-4 max-w-4xl px-4">
        <nav className="glass rounded-full px-5 py-2.5 flex items-center justify-between">
          <NavLink
            to="/"
            className="flex items-center gap-2 group"
            onClick={() => setMobileOpen(false)}
          >
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
            <span className="text-white font-medium tracking-tight">
              Mizar<span className="text-accent-soft">.js</span>
            </span>
          </NavLink>

          {/* ────────── DESKTOP LINKS ────────── */}
          <ul className="hidden md:flex items-center gap-1 text-sm">
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
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full transition-colors ${
                    isActive
                      ? "text-white bg-white/10"
                      : "text-white/60 hover:text-white"
                  }`
                }
              >
                {t("nav.about")}
              </NavLink>
            </li>
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

          {/* ────────── MOBILE BURGER ────────── */}
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

      {/* ────────── MOBILE FULL-SCREEN OVERLAY ────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            onClose={() => setMobileOpen(false)}
            jsActive={jsActive}
          />
        )}
      </AnimatePresence>
    </header>
  );
}

type MobileMenuProps = {
  onClose: () => void;
  jsActive: boolean;
};

/**
 * Full-screen glass overlay used on mobile. Links stagger in top-to-bottom;
 * the JS feature list is flattened inline (no nested dropdown on touch).
 * Language switcher lives at the bottom.
 */
function MobileMenu({ onClose }: MobileMenuProps) {
  const { t } = useTranslation();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block text-4xl font-semibold tracking-tight transition-colors ${
      isActive ? "text-white" : "text-white/50 hover:text-white"
    }`;

  return (
    <motion.div
      key="mobile-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="md:hidden fixed inset-0 top-0 z-40 bg-ink-950/90 backdrop-blur-2xl"
      onClick={(e) => {
        // Close on backdrop click (but not when clicking the panel itself).
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-screen flex flex-col px-6 pt-24 pb-10"
      >
        <ul className="flex-1 flex flex-col justify-center gap-6">
          {TOP_LINKS.map((link, i) => (
            <MobileLink key={link.to} delay={0.05 + i * 0.06}>
              <NavLink to={link.to} end={link.end} className={linkClass}>
                {t(`nav.${link.key}`)}
              </NavLink>
            </MobileLink>
          ))}

          {/* Flattened JS features */}
          <MobileLink delay={0.05 + TOP_LINKS.length * 0.06}>
            <div className="pt-4 border-t border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-accent-soft mb-4">
                {t("nav.jsFeatures")}
              </p>
              <ul className="space-y-3">
                {JS_FEATURE_KEYS.map((feat) => (
                  <li key={feat.to}>
                    <NavLink
                      to={feat.to}
                      className={({ isActive }) =>
                        `flex items-baseline justify-between group ${
                          isActive ? "text-white" : "text-white/60 hover:text-white"
                        }`
                      }
                    >
                      <div>
                        <div className="text-2xl font-semibold tracking-tight">
                          {t(`nav.features.${feat.key}.label`)}
                        </div>
                        <p className="text-xs text-white/40 mt-0.5">
                          {t(`nav.features.${feat.key}.description`)}
                        </p>
                      </div>
                      <span className="text-white/30 group-hover:text-accent-soft transition-colors">
                        →
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </MobileLink>
        </ul>

        {/* Language switcher pinned to the bottom */}
        <MobileLink delay={0.05 + (TOP_LINKS.length + 1) * 0.06}>
          <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs uppercase tracking-widest text-white/40">
            <span>{t("nav.language")}</span>
            <LanguageSwitcher />
          </div>
        </MobileLink>
      </motion.div>
    </motion.div>
  );
}

function MobileLink({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.li>
  );
}

/**
 * Animated burger → X icon. Both lines share the same geometry (a horizontal
 * line at y=8) and are moved into position via CSS transforms — that way
 * framer-motion never has to interpolate raw SVG y1/y2 attributes, which need
 * seed values before they can animate.
 */
function BurgerIcon({ open }: { open: boolean }) {
  const spring = { duration: 0.25, ease: [0.16, 1, 0.3, 1] } as const;
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden>
      <motion.line
        x1="1"
        y1="8"
        x2="21"
        y2="8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{ originX: "11px", originY: "8px" }}
        animate={{ translateY: open ? 0 : -5, rotate: open ? 45 : 0 }}
        transition={spring}
      />
      <motion.line
        x1="1"
        y1="8"
        x2="21"
        y2="8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{ originX: "11px", originY: "8px" }}
        animate={{ translateY: open ? 0 : 5, rotate: open ? -45 : 0 }}
        transition={spring}
      />
    </svg>
  );
}
