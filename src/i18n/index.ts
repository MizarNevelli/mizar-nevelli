import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import it from "./locales/it.json";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧", disabled: false },
  { code: "it", label: "Italiano", flag: "🇮🇹", disabled: true },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

// Only enabled languages are advertised to i18next. Disabled locales stay in
// the JSON so re-enabling later is a one-line flag flip, but browser detection
// will fall back to English instead of picking a locale we're not shipping yet.
const enabledCodes = SUPPORTED_LANGUAGES.filter((l) => !l.disabled).map(
  (l) => l.code
);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      it: { translation: it },
    },
    fallbackLng: "en",
    supportedLngs: enabledCodes,
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      // Try localStorage first (respects user's explicit choice), then browser
      // language. Persist any change back to localStorage.
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "js-ux.lang",
      caches: ["localStorage"],
    },
    returnObjects: true,
  });

export default i18n;
