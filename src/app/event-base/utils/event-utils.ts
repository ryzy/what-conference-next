import { deburr, kebabCase } from 'lodash-es';

import { uuid } from '../../core/core-utils';
import { countriesData } from '../../data/countries';
import { Country } from '../../core/model/country';

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

export function findCountries(countryVal: string = ''): Country[] {
  if ('string' === typeof (countryVal as any)) {
    countryVal = countryVal.toLowerCase();
    return countriesData.filter((c) => {
      return (
        c.isoCode === countryVal ||
        c.name.toLowerCase().includes(countryVal) ||
        c.subregion.toLowerCase().includes(countryVal) ||
        c.capital.toLowerCase().includes(countryVal)
      );
    });
  }

  return countriesData;
}

/**
 * Return Date obj, converted from Timestamp obj, if needed
 */
export function getNormalisedDate(date: Date | string = new Date()): Date {
  if ('string' === typeof date) {
    return new Date(date);
  }

  return date;
}

/**
 * Generate event id/url slug from provided name
 */
export function getEventSlug(eventName: string): string {
  return kebabCase(deburr(eventName)) + '-' + uuid(6);
}
