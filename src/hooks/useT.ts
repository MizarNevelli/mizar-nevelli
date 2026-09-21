import { useTranslation } from "react-i18next";

export function useT() {
  const { t } = useTranslation();
  const tx = t as (key: string, params?: Record<string, string>) => string;
  return { t, tx };
}
