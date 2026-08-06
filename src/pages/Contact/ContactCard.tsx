import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

type ContactCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  href: string;
  copyValue?: string;
  external?: boolean;
  actionLabel: string;
};

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
    } catch (err) {
      console.warn("Error copying", err);
    }
  };

  return (
    <div className="group relative rounded-xl border border-white/[0.09] bg-white/[0.03] p-4 sm:p-5 md:p-6 flex flex-wrap items-center gap-3 sm:gap-4 md:gap-5 overflow-hidden hover:border-white/[0.18] hover:bg-white/[0.05] transition-colors duration-300">
      <div className="shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-xl border border-white/[0.12] flex items-center justify-center text-white/50">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-widest text-white/40">
          {label}
        </p>
        <p className="mt-1 text-white text-base md:text-lg font-medium break-all">
          {value}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0 w-full justify-end sm:w-auto sm:justify-start">
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
