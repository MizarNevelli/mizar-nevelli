import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ContactCard } from "./ContactCard";
import { PageMeta } from "../../components/PageMeta";
import {
  EMAIL,
  GITHUB_HANDLE,
  GITHUB_URL,
  LINKEDIN_HANDLE,
  LINKEDIN_URL,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
} from "../../utils/constants";

export function ContactPage() {
  const { t } = useTranslation();
  return (
    <main className="min-h-[100dvh] pt-32 pb-24 px-6 relative overflow-hidden">
      <PageMeta
        title="Contact"
        description="Get in touch about projects, freelance work, or collaborations."
        path="/contact"
      />

      <div className="relative max-w-5xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-3">
            {t("contact.eyebrow")}
          </p>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white text-balance">
            {t("contact.titleLine1")}
            <br />
            {t("contact.titleLine2")}
          </h1>
          <p className="mt-6 text-white/60 text-lg max-w-xl mx-auto text-balance">
            {t("contact.description")}
          </p>
        </motion.header>

        <div className="mt-16 grid gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <ContactCard
              icon={<MailIcon />}
              label={t("contact.cards.email.label")}
              value={EMAIL}
              href={`mailto:${EMAIL}`}
              actionLabel={t("contact.cards.email.action")}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <ContactCard
              icon={<WhatsAppIcon />}
              label={t("contact.cards.whatsapp.label")}
              value={WHATSAPP_DISPLAY}
              copyValue={`+${WHATSAPP_NUMBER}`}
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              external
              actionLabel={t("contact.cards.whatsapp.action")}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <ContactCard
              icon={<GitHubIcon />}
              label={t("contact.cards.github.label")}
              value={GITHUB_HANDLE}
              copyValue={GITHUB_URL}
              href={GITHUB_URL}
              external
              actionLabel={t("contact.cards.github.action")}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <ContactCard
              icon={<LinkedInIcon />}
              label={t("contact.cards.linkedin.label")}
              value={LINKEDIN_HANDLE}
              copyValue={LINKEDIN_URL}
              href={LINKEDIN_URL}
              external
              actionLabel={t("contact.cards.linkedin.action")}
            />
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 text-center text-white/40 text-sm"
        >
          {t("contact.footer")}
        </motion.p>
      </div>
    </main>
  );
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.695.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.29.173-1.414-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.36-.214-3.741.981.998-3.648-.235-.374a9.86 9.86 0 0 1-1.511-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885zM20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.14 1.593 5.945L0 24l6.335-1.652a11.882 11.882 0 0 0 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.485-8.4z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.575.104.786-.25.786-.556 0-.275-.01-1.003-.016-1.97-3.2.695-3.876-1.543-3.876-1.543-.523-1.33-1.278-1.684-1.278-1.684-1.045-.714.08-.7.08-.7 1.156.082 1.764 1.187 1.764 1.187 1.028 1.76 2.696 1.252 3.354.957.104-.744.402-1.253.732-1.541-2.554-.29-5.238-1.278-5.238-5.688 0-1.257.448-2.284 1.183-3.089-.119-.29-.513-1.463.113-3.05 0 0 .965-.309 3.163 1.18a10.98 10.98 0 0 1 5.762 0c2.196-1.489 3.16-1.18 3.16-1.18.628 1.587.234 2.76.115 3.05.737.805 1.181 1.832 1.181 3.09 0 4.42-2.688 5.394-5.25 5.678.412.354.78 1.052.78 2.122 0 1.532-.014 2.767-.014 3.143 0 .308.208.665.79.552A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452H16.9v-5.569c0-1.328-.024-3.037-1.85-3.037-1.853 0-2.136 1.446-2.136 2.94v5.666H9.36V9h3.408v1.561h.048c.475-.9 1.635-1.85 3.365-1.85 3.6 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9H7.12v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
