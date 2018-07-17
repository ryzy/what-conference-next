import { builtinSizeBands, EventSizeBand } from '../../app/event-base/data/size-bands';
import { ConferenceEventFormData } from '../../app/event-base/model/conference-event';
import { Country } from '../../app/event-base/model/country';
import { findCountry } from '../../app/event-base/utils/event-utils';

const pl: Country = findCountry('pl') as Country;
const uk: Country = findCountry('uk') as Country;

export const mockNewEventFormData: ConferenceEventFormData = {
  name: 'NG Poland',
  topicTags: ['angular'],
  country: pl!,
  city: pl!.capital,
  address: '',
  date: new Date('2017-11-21T00:00:00.000Z'),
  eventDuration: 2,
  workshopDays: 1,
  price: 1000,
  sizeBand: builtinSizeBands[1],
  website: 'http://www.ng-poland.pl/',
  description: 'lipsum dolor',
  twitterHandle: '@someHandle',
};
