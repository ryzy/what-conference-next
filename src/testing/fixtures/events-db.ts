import { builtinSizeBands, EventSizeBand } from '../../app/event-base/data/size-bands';

// tslint:disable:max-line-length
import { ConferenceEvent } from '../../app/event-base/model/conference-event';
import { Country } from '../../app/event-base/model/country';
import { findCountry } from '../../app/event-base/utils/event-utils';

const pl = findCountry('pl') as Country;

/**
 * Conference events (mock data)
 */
export const mockEvents: ConferenceEvent[] = [
  {
    id: 'mock-event-1',
    name: 'NG Poland',
    topicTags: { 'mock-frontend': true },
    date: new Date('2017-11-21T00:00:00.000Z'),
    city: 'Warsaw',
    country: pl.name,
    countryCode: pl.isoCode,
    countryFlag: pl.flag,
    region: pl.region,
    subRegion: pl.subregion,
    addressLatLng: pl.latlng,
    address: 'Mokotów',
    website: 'http://www.ng-poland.pl/',
    description:
      'The biggest Angular Conference in Central/Estern Europe. Learn about the present and future of Angular and its ecosystem, TypeScript, tools and much more.',
    twitterHandle: '@mockNgPoland',
    eventDuration: 1,
    workshopDays: 0,
    price: 90,
  },
];
