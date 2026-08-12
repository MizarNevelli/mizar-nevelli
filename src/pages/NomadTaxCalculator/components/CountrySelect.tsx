import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { sortedCountries } from "../utils/countryName";

type Props = {
  value: string;
  onChange: (code: string) => void;
  exclude?: string;
};

export function CountrySelect({ value, onChange, exclude }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? "en";

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const countries = useMemo(
    () => sortedCountries(locale).filter((c) => c.code !== exclude),
    [locale, exclude]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? countries.filter((c) => c.name.toLowerCase().includes(q)) : countries;
  }, [countries, query]);

  const selectedName = useMemo(
    () => countries.find((c) => c.code === value)?.name ?? "",
    [countries, value]
  );

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape, focus search when opening
  useEffect(() => {
    if (!open) { setQuery(""); return; }
    searchRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  function select(code: string) {
    onChange(code);
    setOpen(false);
  }

  const placeholder = t("nomadTax.form.countryPlaceholder");

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-2 border rounded-lg px-3 py-2 text-sm transition-colors text-left ${
          open
            ? "border-accent/60 bg-transparent text-white"
            : value
            ? "border-white/15 bg-transparent text-white hover:border-white/30"
            : "border-white/15 bg-transparent text-white/30 hover:border-white/30"
        }`}
      >
        <span className="truncate">{selectedName || placeholder}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className={`shrink-0 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-white/10 bg-ink-900/95 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden">
          <div className="p-2 border-b border-white/[0.06]">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full bg-transparent text-sm text-white placeholder-white/30 px-2 py-1 focus:outline-none"
            />
          </div>

          <ul
            ref={listRef}
            className="max-h-52 overflow-y-auto py-1 scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-white/30">No results.</li>
            ) : (
              filtered.map((c) => (
                <li key={c.code}>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); select(c.code); }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      c.code === value
                        ? "text-white bg-accent/15"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {c.name}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
