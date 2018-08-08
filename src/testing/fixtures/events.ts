// tslint:disable:max-line-length
import { builtinSizeBands } from '../../app/event-base/data/size-bands';
import { ConferenceEvent, ConferenceEventFormData, EventStatus } from '../../app/event-base/model/conference-event';
import { Country } from '../../app/core/model/country';
import { findCountry } from '../../app/event-base/utils/event-utils';
import { mockTags } from './event-tags';

const mockCountry1 = findCountry('aw') as Country;
const mockCountry2 = findCountry('pl') as Country;

/**
 * Conference events (mock data)
 */
export const mockEvents: ConferenceEvent[] = [
  {
    id: 'event-1',
    name: 'Unit Test Event 1',
    tags: [mockTags[0].id, mockTags[2].id],
    date: new Date('2017-11-21T00:00:00.000Z'),
    eventDuration: 3,
    workshops: false,
    freeWorkshops: true,
    country: mockCountry1.name,
    countryCode: mockCountry1.isoCode,
    region: mockCountry1.region,
    subRegion: mockCountry1.subregion,
    city: mockCountry1.capital,
    address: '123, Some Street in ' + mockCountry1.capital,
    geoPoint: { type: 'Point', coordinates: mockCountry1.latlng },
    website: `https://www.example.${mockCountry1.isoCode.toLowerCase()}/`,
    description: `The biggest Angular Conference in ${
      mockCountry1.subregion
    }. Learn about the present and future of Angular and its ecosystem, TypeScript, tools and much more.`,
    twitterHandle: mockCountry1.name + 'Conf',
    hashTags: [],
    price: 100,
    sizeBand: builtinSizeBands[2].id,
    origin: {
      authorId: '5b5cc113058429b7820af78e', // editor@test.com from DEV db
      date: new Date('25 Sep 2018'),
    },
    status: EventStatus.Published,
  },
  {
    id: 'event-2',
    name: 'Unit Test Event 2',
    tags: [mockTags[0].id],
    date: new Date('2017-12-24T00:00:00.000Z'),
    eventDuration: 1,
    workshops: true,
    freeWorkshops: false,
    country: mockCountry2.name,
    countryCode: mockCountry2.isoCode,
    region: mockCountry2.region,
    subRegion: mockCountry2.subregion,
    city: mockCountry2.capital,
    address: '123, Some Street in ' + mockCountry2.capital,
    geoPoint: { type: 'Point', coordinates: mockCountry2.latlng },
    website: `https://www.example.${mockCountry2.isoCode.toLowerCase()}/`,
    description: `The biggest Angular Conference in ${
      mockCountry2.subregion
    }. Learn about the present and future of Angular and its ecosystem, TypeScript, tools and much more.`,
    twitterHandle: mockCountry2.name + 'Conf',
    hashTags: ['hash1', 'hash2', 'hash3'],
    price: 500,
    sizeBand: builtinSizeBands[1].id,
    origin: {
      authorId: '5b5ccb894fdd1f82c29b1afc', // marcin@ryzycki from DEV db
      date: new Date('11 Jul 2019'),
    },
    status: EventStatus.Published,
  },
];

export const mockEvent: ConferenceEvent = mockEvents[0];

export const mockEventFormData: ConferenceEventFormData = {
  name: mockEvent.name,
  tags: mockEvent.tags,
  country: mockCountry1,
  city: mockEvent.city,
  address: mockEvent.address,
  date: mockEvent.date,
  eventDuration: mockEvent.eventDuration,
  workshops: mockEvent.workshops,
  freeWorkshops: mockEvent.freeWorkshops,
  price: 1000,
  sizeBand: builtinSizeBands[2],
  website: mockEvent.website,
  description: mockEvent.description,
  twitterHandle: mockEvent.twitterHandle,
  hashTags: mockEvent.hashTags.join(', '),
};
