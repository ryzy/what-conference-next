import { EventSizeBand } from '../data/size-bands';
import { Country } from './country';
import { EventTopic } from './event-topic';

export interface ConferenceEvent {
  id: string;

  /**
   * Event name to display
   */
  name: string;

  /**
   * Main topics of the event
   */
  topicTags: { [topicId: string]: boolean };

  /**
   * Event date as Date() obj or string (e.g. Q4'2018)
   */
  date: Date;

  /**
   * Event location
   */
  country: string;
  countryCode: string;
  countryFlag: string;
  region: string;
  subRegion: string;
  city: string;
  address: string;
  addressLatLng?: [number, number];

  /**
   * Full website url of the event, including https:// prefix
   */
  website: string;

  /**
   * Long description of the event
   */
  description: string;
  twitterHandle: string;

  /**
   * Duration of event (num of days, incl. workshops days)
   */
  eventDuration: number;

  workshopDays?: number;

  price?: number;
  sizeBand?: EventSizeBand;

  // TODO: hash tags
  // TODO: speakers
}

export interface ConferenceEventFormData {
  name: string;
  topicTags: Array<string | boolean>;

  country: Country;
  city: string;
  address: string | undefined;
  website: string;
  description: string | undefined;
  twitterHandle: string | undefined;

  date: Date;
  eventDuration: number;
  workshopDays: number | undefined;
  price: number | undefined;
  sizeBand: EventSizeBand | undefined;
}

/**
 * Create ConferenceEvent from event form structure
 */
export function createEventFromFormValues(
  formData: Partial<ConferenceEventFormData>,
  topicsDb: EventTopic[] = [],
): ConferenceEvent {
  const event: ConferenceEvent = { ...((formData as any) as ConferenceEvent) };

  event.topicTags = {}; // re-set, so it doesn't contain any original values
  if (Array.isArray(formData.topicTags)) {
    event.topicTags = formData.topicTags.reduce(
      (topics: { [topicId: string]: boolean }, selected: boolean | string, idx: number) => {
        if (true === selected) {
          if (topicsDb[idx]) {
            topics[topicsDb[idx].id] = true;
          }
        } else if (selected) {
          topics[selected] = true;
        }

        return topics;
      },
      {},
    );
  }

  if (formData.country) {
    const selectedCountry = formData.country as Country;
    event.country = selectedCountry.name;
    event.countryCode = selectedCountry.isoCode;
    event.countryFlag = selectedCountry.flag;
    event.region = selectedCountry.region;
    event.subRegion = selectedCountry.subregion;
    event.addressLatLng = selectedCountry.latlng;
  }

  return event;
}
