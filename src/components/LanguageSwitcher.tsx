import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "../i18n";

/**
 * Compact language switcher. Shows the current flag + code and reveals a
 * dropdown with the supported languages on click. Keeps the same visual
 * language as the JS dropdown for consistency.
 */
export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current =
    SUPPORTED_LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) ??
    SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
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

  const pick = (code: LanguageCode) => {
    void i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("nav.language")}
        className={`px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1.5 text-sm ${
          open
            ? "text-white bg-white/10"
            : "text-white/60 hover:text-white"
        }`}
      >
        <span aria-hidden>{current.flag}</span>
        <span className="uppercase tracking-wider text-xs">{current.code}</span>
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
          <motion.ul
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-3 w-44 rounded-2xl p-1 origin-top-right shadow-2xl shadow-black/60 bg-ink-900/90 backdrop-blur-xl border border-white/10"
          >
            {SUPPORTED_LANGUAGES.map((lang) => {
              const active = lang.code === current.code;
              const disabled = lang.disabled;
              return (
                <li key={lang.code} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    disabled={disabled}
                    onClick={() => !disabled && pick(lang.code)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                      disabled
                        ? "text-white/30 cursor-not-allowed"
                        : active
                          ? "bg-accent/15 text-white"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`text-lg ${disabled ? "grayscale opacity-50" : ""}`}
                    >
                      {lang.flag}
                    </span>
                    <span className="flex-1 text-left">{lang.label}</span>
                    {disabled ? (
                      <span className="text-[10px] uppercase tracking-widest text-white/30">
                        soon
                      </span>
                    ) : (
                      active && <span className="text-accent-soft">✓</span>
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
