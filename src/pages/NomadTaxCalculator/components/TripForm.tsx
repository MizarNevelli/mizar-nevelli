import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Trip } from "../types";
import { CountrySelect } from "./CountrySelect";

type Props = {
  onAdd: (draft: Omit<Trip, "id">) => void;
  residenceCountry: string;
};

const inputCls =
  "w-full bg-transparent border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent/60 transition-colors";

export function TripForm({ onAdd, residenceCountry }: Props) {
  const { t } = useTranslation();
  const [country, setCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!country || !startDate || !endDate) {
      setError(t("nomadTax.form.errorFillAll"));
      return;
    }
    if (endDate < startDate) {
      setError(t("nomadTax.form.errorEndDate"));
      return;
    }
    onAdd({ country, startDate, endDate });
    setCountry("");
    setStartDate("");
    setEndDate("");
    setError("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <CountrySelect value={country} onChange={setCountry} exclude={residenceCountry} />

      <div className="flex gap-2">
        <input
          type="date"
          value={startDate}
          max={endDate || undefined}
          onChange={(e) => setStartDate(e.target.value)}
          className={inputCls}
        />
        <input
          type="date"
          value={endDate}
          min={startDate || undefined}
          onChange={(e) => setEndDate(e.target.value)}
          className={inputCls}
        />
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        type="submit"
        className="bg-accent text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-accent/85 transition-colors"
      >
        {t("nomadTax.form.addButton")}
      </button>
    </form>
  );
}
