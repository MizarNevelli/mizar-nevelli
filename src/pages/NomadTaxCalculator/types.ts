export type Trip = {
  id: string;
  country: string; // ISO 3166-1 alpha-2, e.g. "PT"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
};

export type RiskWindow = {
  windowStart: string; // YYYY-MM-DD: first day of the worst 365-day window
  windowEnd: string; // YYYY-MM-DD: windowStart + 364 days
  days: number; // how many days in that country fell inside this window
};

export type CountryRiskResult = {
  country: string;
  totalDays: number;
  maxDaysInWindow: number;
  riskWindow: RiskWindow;
  atRisk: boolean;
};
