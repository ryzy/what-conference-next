import { builtinSizeBands, EventSizeBand } from '../data/size-bands';
import { findCountry, getNormalisedDate } from '../utils/event-utils';
import { Country } from './country';
import { EventTopic } from './event-topic';

/**
 * Event obj, as being stored in the db
 */
export interface ConferenceEvent {
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
  date: Date|firebase.firestore.Timestamp;

  /**
   * Event location
   */
  country: string;
  countryCode: string;
  countryFlag: string;
  region: string;
  subRegion: string;
  city: string;
  address: string | null;
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

  workshopDays: number | null;

  price: number | null;
  sizeBand: string | null;

  // TODO: hash tags
  // TODO: speakers
}

/**
 * Event data, as it arrives from the form
 */
export interface ConferenceEventFormData {
  name: string;
  topicTags: Array<string | boolean>;

  country: Country;
  city: string;
  address: string | null;
  website: string;
  description: string;
  twitterHandle: string;

  date: Date;
  eventDuration: number;
  workshopDays: number | null;
  price: number | null;
  sizeBand: EventSizeBand | null;
}

/**
 * Create ConferenceEvent from event form structure
 */
export function createEventFromFormData(
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

  if (formData.sizeBand && formData.sizeBand.id) {
    event.sizeBand = formData.sizeBand.id;
  }

  return event;
}

export function createFormDataFromEvent(ev: ConferenceEvent, topicsDb: EventTopic[] = []): ConferenceEventFormData {
  const formData: ConferenceEventFormData = {
    name: ev.name,
    topicTags: [],
    country: findCountry(ev.countryCode) as Country,
    city: ev.city,
    address: ev.address,
    website: ev.website,
    description: ev.description,
    twitterHandle: ev.twitterHandle,
    date: getNormalisedDate(ev.date),
    eventDuration: ev.eventDuration,
    workshopDays: ev.workshopDays,
    price: ev.price,
    sizeBand: builtinSizeBands.find(b => b.id === ev.sizeBand) || null,
  };

  // convert topics to boolean flags, compatible with the form
  topicsDb.forEach((t: EventTopic, idx: number) => {
    formData.topicTags[idx] = ev.topicTags[t.id] === true;
  });

  return formData;
}

/**
 * Wrapper to ConferenceEvent, with all related data handy.
 * Convenient to use in the view layer.
 */
export class ConferenceEventRef {
  public id: string;
  public ref: ConferenceEvent;

  public date: Date;
  public topicTags: EventTopic[];
  public country: Country;
  public sizeBand?: EventSizeBand;

  public constructor(
    id: string,
    ev: ConferenceEvent,
    dict: { topics: EventTopic[] } = { topics: [] },
  ) {
    this.id = id || 'missing-ConferenceEventRef-id';
    this.ref = ev;

    this.country = findCountry(ev.countryCode) || {} as Country;

    // Get real EventTopic objects from their IDs
    this.topicTags = Object.keys(ev.topicTags || {}).reduce(
      (topics: EventTopic[], tid: string) => {
        const et: EventTopic = dict.topics.find((t: EventTopic) => t.id === tid) || { id: tid, name: tid };
        return [ ...topics, et ];
      },
      [],
    );

    this.date = getNormalisedDate(ev.date);

    // Restore EventSizeBand from its stored iD
    this.sizeBand = builtinSizeBands.find((band) => band.id === ev.sizeBand);
  }
}
