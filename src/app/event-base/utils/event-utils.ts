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
    return countriesData.find((c) => c.isoCode === countryVal);
  } else {
    countryVal = countryVal.toLowerCase();
    return countriesData.find((c) => c.name.toLowerCase().includes(countryVal as string));
  }
}
