import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

type ContactCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  /** Where the primary action button leads (mailto:, https://…). */
  href: string;
  /** Optional override for what gets copied (e.g. raw phone number). */
  copyValue?: string;
  external?: boolean;
  actionLabel: string;
};

/**
 * Reusable contact card. Shows the channel, the value, a copy-to-clipboard
 * button, and a primary CTA that opens the correct app (mail client, WhatsApp,
 * GitHub, LinkedIn, etc).
 */
export function ContactCard({
  icon,
  label,
  value,
  href,
  copyValue,
  external,
  actionLabel,
}: ContactCardProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue ?? value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard API not available (older browser, insecure context) —
      // silently no-op; the CTA still works.
    }
  };

  return (
    <div className="group relative glass rounded-2xl p-5 md:p-6 flex items-center gap-4 md:gap-5 overflow-hidden">
      {/* Ambient glow on hover */}
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-accent/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="shrink-0 h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-soft">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-widest text-white/40">
          {label}
        </p>
        <p className="mt-1 text-white text-base md:text-lg font-medium truncate">
          {value}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onCopy}
          aria-label={t("contact.copyAria", { label })}
          className="relative h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15 }}
                className="text-emerald-400"
              >
                <CheckIcon />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15 }}
              >
                <CopyIcon />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer noopener" : undefined}
          className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-accent px-4 h-10 text-white text-sm font-medium hover:bg-accent-soft transition-colors"
        >
          {actionLabel}
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </a>

        {/* Compact CTA for narrow screens */}
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer noopener" : undefined}
          aria-label={actionLabel}
          className="sm:hidden h-10 w-10 rounded-xl bg-accent text-white hover:bg-accent-soft transition-colors flex items-center justify-center"
        >
          <ArrowIcon />
        </a>
      </div>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="9"
        y="9"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M15 5H6a2 2 0 0 0-2 2v9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12l5 5L20 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
