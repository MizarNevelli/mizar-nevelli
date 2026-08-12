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

export function MobileMenu({
  onClose,
  topLinks,
  jsFeatureKeys,
}: MobileMenuProps) {
  const { t } = useTranslation();
  const tx = t as (key: string) => string;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block text-4xl font-semibold tracking-tight ${
      isActive ? "text-white" : "text-white/50"
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
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="h-full overflow-y-auto overscroll-contain flex flex-col px-6 py-10"
      >
        <ul className="flex-1 flex flex-col justify-center gap-6 select-none">
          {topLinks.map((link, i) => (
            <MobileLink key={link.to} delay={0.05 + i * 0.06}>
              <NavLink
                style={{ WebkitTapHighlightColor: "transparent" }}
                to={link.to}
                end={link.end}
                className={linkClass}
              >
                {tx(`nav.${link.key}`)}
              </NavLink>
            </MobileLink>
          ))}

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
                          isActive ? "text-white" : "text-white/60"
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
                      <span className="text-white/30">→</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </MobileLink>
        </ul>

        <MobileLink delay={0.05 + (topLinks.length + 1) * 0.06}>
          <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs uppercase tracking-widest text-white/40">
            <span>{t("nav.language")}</span>
            <LanguageSwitcher variant="inline" />
          </div>
        </MobileLink>
      </motion.div>

      <AnimatedCloseButton onClick={onClose} />
    </motion.div>
  );
}

function AnimatedCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close menu"
      className="absolute top-[26px] right-9 w-9 h-9 flex flex-col items-center justify-center gap-[5px] text-white/80 hover:text-white transition-colors"
    >
      <motion.span
        className="block w-6 h-px bg-current rounded-full origin-center"
        initial={{ rotate: 0, y: 0 }}
        animate={{ rotate: 45, y: 6 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className="block w-6 h-px bg-current rounded-full"
        initial={{ opacity: 1, scaleX: 1 }}
        animate={{ opacity: 0, scaleX: 0 }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.span
        className="block w-6 h-px bg-current rounded-full origin-center"
        initial={{ rotate: 0, y: 0 }}
        animate={{ rotate: -45, y: -6 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      />
    </button>
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
