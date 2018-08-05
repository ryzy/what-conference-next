import { countriesData } from '../data/countries';
import { findCountries, findCountry, getEventSlug, getNormalisedDate } from './event-utils';

describe('event-utils', () => {
  const poland = countriesData.find((c) => c.isoCode === 'PL');
  const uk = countriesData.find((c) => c.isoCode === 'GB');

  it('#findCountry', () => {
    expect(findCountry()).toBe(undefined);
    expect(findCountry(uk)).toBe(uk);

    expect(findCountry('pl')).toBe(poland);
    expect(findCountry('poland')).toBe(poland);

    expect(findCountry('GB')).toBe(uk);
    expect(findCountry('Great')).toBe(uk);
    expect(findCountry('United Kingdom')).toBe(uk);
  });

  it('#findCountries', () => {
    expect(findCountries().length).toBe(countriesData.length);
    expect(findCountries({} as any).length).toBe(countriesData.length);
    expect(findCountries('').length).toBe(countriesData.length);

    expect(findCountries('pl').length).toBe(2);
    expect(findCountries('pol').length).toBe(2); // poland and french polynesia

    expect(findCountries('z').length).toBe(16);
  });

  it('#getNormalisedDate', () => {
    expect(getNormalisedDate() instanceof Date).toBe(true);

    // from Date obj
    const mockDate = new Date();
    expect(getNormalisedDate(mockDate)).toBe(mockDate);

    // from string
    expect(getNormalisedDate(mockDate.toISOString())).toEqual(mockDate);
  });

  it('#getEventSlug', () => {
    expect(getEventSlug('Some Event Title')).toContain('some-event-title-');
    expect(getEventSlug('')).toContain('-');
    expect(getEventSlug('').length).toBeGreaterThan(5); // we should have at least an -random-suffix here...
  });
});
