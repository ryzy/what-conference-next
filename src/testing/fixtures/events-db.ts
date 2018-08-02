// tslint:disable:max-line-length
import { builtinSizeBands } from '../../app/event-base/data/size-bands';
import { ConferenceEvent } from '../../app/event-base/model/conference-event';
import { Country } from '../../app/event-base/model/country';
import { findCountry } from '../../app/event-base/utils/event-utils';
import { mockTopics } from './topics';

const pl = findCountry('pl') as Country;

/**
 * Conference events (mock data)
 */
export const mockEvents: ConferenceEvent[] = [
  {
    id: 'event-1',
    name: 'Mock Event 1',
    topicTags: { [mockTopics[0].id]: true },
    date: new Date('2017-11-21T00:00:00.000Z'),
    city: 'Warsaw',
    country: pl.name,
    countryCode: pl.isoCode,
    region: pl.region,
    subRegion: pl.subregion,
    addressLatLng: pl.latlng,
    address: 'Mokotów',
    website: 'http://www.ng-poland.pl/',
    description:
      'The biggest Angular Conference in Central/Estern Europe. Learn about the present and future of Angular and its ecosystem, TypeScript, tools and much more.',
    twitterHandle: 'mockNgPoland',
    eventDuration: 1,
    workshopDays: 0,
    price: 90,
    sizeBand: builtinSizeBands[0].id,
  },
  {
    id: 'event-2',
    address: '',
    addressLatLng: [1.36666666, 103.8],
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    date: new Date('2017-12-12T00:00:00.000Z'),
    description:
      'A famous JavaScript conference in Asia. Talks, community workshops, hands-on sessions, great food and the DBS beach-party.',
    eventDuration: 3,
    name: 'Mock Event 2',
    region: 'Asia',
    sizeBand: builtinSizeBands[2].id,
    subRegion: 'South-Eastern Asia',
    topicTags: { [mockTopics[0].id]: true, [mockTopics[1].id]: true },
    twitterHandle: 'jsconfasia',
    website: 'https://2018.jsconf.asia/',
    workshopDays: 0,
    price: null,
  },
];

export const mockEvent: ConferenceEvent = mockEvents[0];
