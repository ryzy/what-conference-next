import { countriesData } from '../data/countries';
import { findCountry } from './event-utils';

describe('event-utils', () => {
  const poland = countriesData.find(c => c.isoCode === 'PL');
  const uk = countriesData.find(c => c.isoCode === 'GB');

  it('#findCountry', () => {
    expect(findCountry('pl')).toBe(poland);
    expect(findCountry('poland')).toBe(poland);

    expect(findCountry('GB')).toBe(uk);
    expect(findCountry('Great')).toBe(uk);
    expect(findCountry('United Kingdom')).toBe(uk);
  });
});
