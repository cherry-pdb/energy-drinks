import isoCountries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';

isoCountries.registerLocale(en);

export type CountryOption = {
  code: string; // ISO 3166-1 alpha-2
  name: string;
};

const NAMES = isoCountries.getNames('en', { select: 'official' }) as Record<string, string>;

export const COUNTRIES: CountryOption[] = Object.entries(NAMES)
  .map(([code, name]) => ({ code, name }))
  .filter((c) => /^[A-Z]{2}$/.test(c.code))
  .sort((a, b) => a.name.localeCompare(b.name));

export function findCountry(codeOrName: string): CountryOption | null {
  const q = codeOrName.trim();
  if (!q) return null;
  const upper = q.toUpperCase();
  const byCode = COUNTRIES.find((c) => c.code === upper);
  if (byCode) return byCode;
  const lower = q.toLowerCase();
  return COUNTRIES.find((c) => c.name.toLowerCase() === lower) ?? null;
}

