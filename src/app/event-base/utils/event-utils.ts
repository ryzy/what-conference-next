import { deburr, kebabCase } from 'lodash-es';

import { uuid } from '../../core/core-utils';
import { Entity } from '../../core/model/entity';
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

let _regionList: Entity[] | undefined;

/**
 * Get regions and sub-regions list (sorted)
 * (with url-friendly IDs)
 */
export function getRegionList(): Entity[] {
  if (_regionList) {
    return _regionList;
  }

  const regions: { [k: string]: string } = {};
  const subRegions: { [k: string]: string } = {};

  const sep = ',';
  countriesData.filter((c) => !!c.region && !!c.subregion).forEach((c: Country) => {
    regions[c.region] = c.region;
    subRegions[c.region + sep + c.subregion] = c.region + ' / ' + c.subregion;
  });

  // Sine we want to have entities with IDs which we can later decode back (from URL)
  // we need to generate URL-friendly entity IDs for our region and sub-regions.
  // We use extra separator (`sep`) to do that.
  _regionList = [
    ...Object.keys(regions).map((k) => {
      return <Entity>{ id: slug(k), name: regions[k] };
    }),
    ...Object.keys(subRegions).map((k) => {
      return <Entity>{ id: slug(k.split(sep)[0]) + sep + slug(k.split(sep)[1]), name: subRegions[k] };
    }),
  ].sort((r1: Entity, r2: Entity) => r1.id.localeCompare(r2.id));

  return _regionList;
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

export function slug(str: string): string {
  return kebabCase(deburr(str || ''));
}

/**
 * Generate event id/url slug from provided name
 */
export function getEventSlug(eventName: string): string {
  return kebabCase(deburr(eventName)) + '-' + uuid(6);
}
