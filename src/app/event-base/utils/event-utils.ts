import { TrackByFunction } from '@angular/core';
import deburr from 'lodash-es/deburr.js';
import kebabCase from 'lodash-es/kebabCase.js';

import { uuid } from '../../core/core-utils';
import { Entity } from '../../core/model/entity';
import { countriesData } from '../../data/countries';
import { Country } from '../../core/model/country';

/**
 * Global TrackByFunction
 */
export const trackByFn: TrackByFunction<Entity> = (index: number, item: Entity): string | undefined => {
  return item && item.id;
};

export function compareWithFn(o1: Entity, o2: Entity): boolean {
  // console.log('compareWithFn', { o1, o2 });
  return !!o1 && !!o2 && !!o1.id && o1.id === o2.id;
}

/**
 * Find country by its ISO code or name
 */
export function findCountry(countryVal?: string | Country): Country | undefined {
  if (!countryVal) {
    return;
  } else if ('object' === typeof countryVal) {
    return countryVal;
  } else if (countryVal.length === 2) {
    return countriesData.find((c) => c.isoCode === (countryVal as string).toLowerCase());
  } else {
    countryVal = countryVal.toLowerCase();
    return countriesData.find((c) => c.name.toLowerCase().includes(countryVal as string));
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
  countriesData
    .filter((c) => !!c.region && !!c.subregion)
    .forEach((c: Country) => {
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

/**
 * Strip https:// and www. from the beginning of URL
 * and the ending / too.
 * So it's nice/ready to display
 */
export function getUrlForDisplay(url: string): string {
  return url.replace(/^(https?:\/\/)?(www\.)?(.+?)\/?$/, '$3');
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

/**
 * Gets list of entities and returns obj "indexed" by entities IDs
 */
export function entitiesById<T extends Entity>(entities: T[] = []): { [entityId: string]: T } {
  return entities.reduce((obj: { [id: string]: T }, entity: T) => {
    obj[entity.id] = entity;
    return obj;
  }, {});
}

/**
 * Check if given date is past date
 */
export function isPastDate(date: Date): boolean {
  const now = new Date();
  return now.valueOf() >= date.valueOf();
}
