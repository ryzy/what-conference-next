import { countriesData } from '../data/countries';
import { Country } from '../model/country';

/**
 * Find country by its ISO code or name
 */
export function findCountry(countryVal?: string | Country): Country | undefined {
  if (!countryVal) {
    return;
  } else if ('object' === typeof countryVal) {
    return countryVal;
  } else if (countryVal.length === 2) {
    countryVal = countryVal.toUpperCase();
    return countriesData.find((c) => c.isoCode === (countryVal as string).toUpperCase());
  } else {
    countryVal = countryVal.toUpperCase();
    return countriesData.find((c) => c.name.toUpperCase().includes(countryVal as string));
  }
}

export function findCountries(countryVal?: string): Country[] {
  if ('string' === typeof countryVal) {
    countryVal = countryVal.toUpperCase();
    return countriesData.filter((c) => c.isoCode === countryVal || c.name.toUpperCase().includes(countryVal as string));
  }

  return countriesData;
}
