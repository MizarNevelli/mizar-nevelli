import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "../i18n";

/**
 * Language switcher — tabular-mono codes (EN / IT), no flag emojis.
 * Disabled locales appear muted with a `soon` tag.
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
        className="font-mono tnum tracking-[0.18em] uppercase text-[11px] text-bone/60 hover:text-bone transition-colors"
      >
        {current.code}
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-3 min-w-[10rem] hair bg-ink origin-top-right"
          >
            {SUPPORTED_LANGUAGES.map((lang) => {
              const active = lang.code === current.code;
              const disabled = lang.disabled;
              return (
                <li key={lang.code} role="none" className="hair-b last:border-b-0">
                  <button
                    type="button"
                    role="menuitem"
                    disabled={disabled}
                    onClick={() => !disabled && pick(lang.code)}
                    className={`w-full flex items-baseline gap-3 px-4 py-3 text-left transition-colors ${
                      disabled
                        ? "text-bone/25 cursor-not-allowed"
                        : active
                          ? "text-bone bg-star/5"
                          : "text-bone/70 hover:text-bone hover:bg-bone/5"
                    }`}
                  >
                    <span className="font-mono tnum text-[11px] uppercase tracking-[0.18em] w-6">
                      {lang.code}
                    </span>
                    <span
                      className={`flex-1 text-sm ${disabled ? "line-through" : ""}`}
                    >
                      {lang.label}
                    </span>
                    {disabled ? (
                      <span className="coord">soon</span>
                    ) : (
                      active && <span className="text-star">·</span>
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
