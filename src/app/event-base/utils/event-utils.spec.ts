import { countriesData } from '../data/countries';
import { findCountries, findCountry, getNormalisedDate } from './event-utils';
const firebase = require('firebase/app');

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

    const mockDate = new Date();
    expect(getNormalisedDate(mockDate)).toBe(mockDate);

    const mockTimestamp = new firebase.firestore.Timestamp();
    expect(getNormalisedDate(mockTimestamp) instanceof Date).toBe(true);
  });
});
