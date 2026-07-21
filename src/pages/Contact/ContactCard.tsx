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
  index: string;
};

/**
 * A ruled log entry — no card, no glow. Icon in a thin square on the left,
 * mono value in the middle, hairline-underlined action link on the right.
 */
export function ContactCard({
  icon,
  label,
  value,
  href,
  copyValue,
  external,
  actionLabel,
  index,
}: ContactCardProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue ?? value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard API unavailable — CTA still works.
    }
  };

  return (
    <div className="hair-t last:hair-b py-6 md:py-7 flex items-center gap-5">
      <span className="coord w-6">{index}</span>

      <div className="shrink-0 h-10 w-10 hair flex items-center justify-center text-star">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="coord mb-1">{label}</div>
        <div className="text-bone font-mono text-base tnum truncate">
          {value}
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <button
          type="button"
          onClick={onCopy}
          aria-label={t("contact.copyAria", { label })}
          className="relative w-8 h-8 hair flex items-center justify-center text-bone/60 hover:text-bone hover:border-bone/50 transition-colors"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="text-star"
              >
                <CheckIcon />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
          className="hidden sm:inline-flex items-baseline gap-2 text-sm text-bone/80 hover:text-star transition-colors group"
        >
          <span className="link-underline">{actionLabel}</span>
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </a>

        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer noopener" : undefined}
          aria-label={actionLabel}
          className="sm:hidden w-8 h-8 hair text-bone/70 hover:text-star hover:border-star/50 transition-colors flex items-center justify-center"
        >
          <ArrowIcon />
        </a>
      </div>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="9"
        y="9"
        width="11"
        height="11"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M15 5H6a2 2 0 0 0-2 2v9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
