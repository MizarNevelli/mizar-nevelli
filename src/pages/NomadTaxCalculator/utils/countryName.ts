const cache = new Map<string, Intl.DisplayNames>();

function getDisplayNames(locale: string): Intl.DisplayNames {
  if (!cache.has(locale)) {
    cache.set(locale, new Intl.DisplayNames([locale], { type: "region" }));
  }
  return cache.get(locale)!;
}

export function countryName(code: string, locale: string): string {
  try {
    return getDisplayNames(locale).of(code) ?? code;
  } catch {
    return code;
  }
}

/** ISO 3166-1 alpha-2 codes supported by the calculator, sorted by localized name. */
const CODES = [
  "AD","AE","AR","AT","AU","BA","BE","BG","BR","CA","CH","CL","CO","CR","CY",
  "CZ","DE","DK","EE","ES","FI","FR","GB","GE","GR","HR","HU","ID","IE","IL",
  "IN","IS","IT","JP","KR","LT","LU","LV","ME","MK","MT","MX","MY","NL","NO",
  "NZ","PH","PL","PT","RO","RS","SE","SG","SI","SK","TH","TR","UA","US","VN","ZA",
];

export function sortedCountries(locale: string): { code: string; name: string }[] {
  return CODES.map((code) => ({ code, name: countryName(code, locale) })).sort(
    (a, b) => a.name.localeCompare(b.name, locale)
  );
}
