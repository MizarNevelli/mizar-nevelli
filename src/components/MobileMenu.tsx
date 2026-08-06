import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

type TopLink = {
  to: string;
  key: string;
  end?: boolean;
};

type JsFeature = {
  to: string;
  key: string;
};

type MobileMenuProps = {
  onClose: () => void;
  topLinks: ReadonlyArray<TopLink>;
  jsFeatureKeys: ReadonlyArray<JsFeature>;
};

/**
 * Full-screen glass overlay used on mobile. Links stagger in top-to-bottom;
 * the JS feature list is flattened inline (no nested dropdown on touch).
 * Language switcher lives at the bottom.
 *
 * Kept dumb — link config is passed in from `Nav`, so this component doesn't
 * need to know which routes exist.
 */
export function MobileMenu({
  onClose,
  topLinks,
  jsFeatureKeys,
}: MobileMenuProps) {
  const { t } = useTranslation();
  const tx = t as (key: string) => string;

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
      {/* Dedicated close button — the animated burger in the nav is easy to
         miss against the dark overlay, so give the menu its own affordance. */}
      <motion.button
        type="button"
        onClick={onClose}
        aria-label="Close menu"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-5 right-5 h-11 w-11 flex items-center justify-center rounded-full glass text-white hover:bg-white/10 transition-colors"
      >
        <CloseIcon />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-[100dvh] flex flex-col px-6 py-10"
      >
        <ul className="flex-1 flex flex-col justify-center gap-6">
          {topLinks.map((link, i) => (
            <MobileLink key={link.to} delay={0.05 + i * 0.06}>
              <NavLink to={link.to} end={link.end} className={linkClass}>
                {tx(`nav.${link.key}`)}
              </NavLink>
            </MobileLink>
          ))}

          {/* Flattened JS features */}
          <MobileLink delay={0.05 + topLinks.length * 0.06}>
            <div className="pt-4 border-t border-white/10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono mb-4">
                {t("nav.jsFeatures")}
              </p>
              <ul className="space-y-3">
                {jsFeatureKeys.map((feat) => (
                  <li key={feat.to}>
                    <NavLink
                      to={feat.to}
                      className={({ isActive }) =>
                        `flex items-baseline justify-between group ${
                          isActive
                            ? "text-white"
                            : "text-white/60 hover:text-white"
                        }`
                      }
                    >
                      <div>
                        <div className="text-2xl font-semibold tracking-tight">
                          {tx(`nav.features.${feat.key}.label`)}
                        </div>
                        <p className="text-xs text-white/40 mt-0.5">
                          {tx(`nav.features.${feat.key}.description`)}
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
        <MobileLink delay={0.05 + (topLinks.length + 1) * 0.06}>
          <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs uppercase tracking-widest text-white/40">
            <span>{t("nav.language")}</span>
            <LanguageSwitcher variant="inline" />
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

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M3 3l10 10M13 3L3 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
