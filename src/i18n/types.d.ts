import type en from "./locales/en.json";

// Give the t() function full type-safety based on the English resource.
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof en;
    };
  }
}
