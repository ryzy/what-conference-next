import { Country } from '../../core/model/country';
import { Entity } from '../../core/model/entity';
import { GeoPoint, ObjectId } from '../../core/model/mongodb';
import { builtinSizeBands, EventSizeBand } from '../data/size-bands';
import { findCountry, getEventSlug, getNormalisedDate } from '../utils/event-utils';
import { ConferenceEventLexicon, EventTag } from './event-tag';

/**
 * Publication status of the event
 */
export enum EventStatus {
  Draft,
  Published,
}

/**
 * Event obj, as being stored in the db
 */
export interface ConferenceEvent {
  /**
   * Stitch ObjectID, when the item has already representation in the DB
   */
  _id?: ObjectId | string;

  /**
   * ID / URL slug of the event
   */
  id: string;

  /**
   * Event name to display
   */
  name: string;

  /**
   * Event tags of the event, used to indicate focus or topic of the event
   * @see hashTags
   */
  tags: string[];

  /**
   * Event date as Date() obj or string (e.g. Q4'2018)
   */
  date: Date;
  /**
   * Duration of event (num of days, incl. workshops days)
   */
  eventDuration: number;

  workshops: boolean;
  freeWorkshops: boolean;

  /**
   * Event location
   */
  country: string;
  countryCode: string;
  region: string;
  subRegion: string;
  city: string;
  address: string;

  /**
   * GeoLocation info (compatible with MongoDB GeoJSON type)
   * @see https://docs.mongodb.com/manual/reference/geojson
   */
  geoPoint: GeoPoint;

  /**
   * Full website url of the event, including https:// prefix
   */
  website: string;

  /**
   * Long description of the event
   */
  description: string;

  /**
   * Twitter @handle
   * @see hashTags
   */
  twitterHandle: string;

  /**
   * TODO: not handled yet...
   */
  hashTags: string[];

  /**
   * Event price, in USD.
   *
   * Value `0`: free event
   * Value missing: tba/tbd (to be announced / to be determined)
   */
  price?: number;

  /**
   * Event size band
   * Optional, NULL means unknown / to be determined/announced
   */
  sizeBand: string | null;

  /**
   * Info about who creation / edits of the entry
   */
  origin: {
    authorId: string;

    /**
     * TODO, not handled yet
     */
    // edits: { authorId: string, date: Date }[];
  };

  /**
   * Is the event published or not?
   */
  status: EventStatus;
}

/**
 * Event data, as it arrives from the form
 * @see ConferenceEvent
 */
export interface ConferenceEventFormData {
  name: string;
  tags: string[];
  date: Date;
  eventDuration: number;
  workshops: boolean;
  freeWorkshops: boolean;

  country: Country;
  city: string;
  address: string;

  website: string;
  description: string;
  twitterHandle: string;
  hashTags: string;

  price?: number; // see ConferenceEvent for what zero or missing value means
  sizeBand?: EventSizeBand;
}

/**
 * Make sure all required nested objects (e.g. tags) are at least properly initialised.
 * This is useful when the event JSON data arrives from the API, but some fields are missing,
 * we don't want to do all these checks later on in the code.
 *
 * @internal
 */
export function ensureValidConferenceEventObj(ev?: ConferenceEvent | any): ConferenceEvent {
  ev = { ...(ev || {}) } as ConferenceEvent;

  // Generate our id / url slug
  ev.id = ev.id || getEventSlug(ev.name);

  if (false === Array.isArray(ev.tags)) {
    ev.tags = [];
  }
  if (false === Array.isArray(ev.hashTags)) {
    ev.hashTags = [];
  }

  // make sure we have boolean here...
  ev.workshops = !!ev.workshops || false;
  ev.freeWorkshops = !!ev.freeWorkshops || false;

  return ev;
}

/**
 * Create ConferenceEvent from event form structure
 */
export function createEventFromFormData(
  formData: Partial<ConferenceEventFormData>,
  lex: ConferenceEventLexicon,
): ConferenceEvent {
  // For now just assign all properties from form.
  // Later on we fine tune / override them, as needed.
  const event: ConferenceEvent = ensureValidConferenceEventObj(formData);

  // Make sure we have only valid, non-empty tags here
  event.tags = event.tags.filter((t) => !!t);

  if (formData.country) {
    const selectedCountry = formData.country as Country;
    event.country = selectedCountry.name;
    event.countryCode = selectedCountry.isoCode;
    event.region = selectedCountry.region;
    event.subRegion = selectedCountry.subregion;
    event.geoPoint = { type: 'Point', coordinates: selectedCountry.latlng };
  }

  // Split coma-separated hash tags from the form into a nice array or hashes
  event.hashTags = (formData.hashTags || '')
    .split(',')
    .filter((v) => !!v)
    .map((v) => v.trim());

  if (formData.sizeBand && formData.sizeBand.id) {
    event.sizeBand = formData.sizeBand.id;
  }

  // Initialise origin obj
  event.origin = {
    authorId: '', // will be set on save/update
  };
  // For now, all events are published as soon as we add them to DB
  event.status = EventStatus.Published;

  return event;
}

/**
 * Create form data obj (for editing) from ConferenceEvent obj
 */
export function createFormDataFromEvent(ev: ConferenceEvent, lex: ConferenceEventLexicon): ConferenceEventFormData {
  ev = ensureValidConferenceEventObj(ev);

  return <ConferenceEventFormData>{
    name: ev.name,
    tags: ev.tags,
    date: getNormalisedDate(ev.date),
    eventDuration: ev.eventDuration,
    workshops: ev.workshops,
    freeWorkshops: ev.workshops,
    country: findCountry(ev.countryCode) as Country,
    city: ev.city,
    address: ev.address,
    website: ev.website,
    description: ev.description,
    twitterHandle: ev.twitterHandle,
    hashTags: ev.hashTags.join(', '),
    price: ev.price,
    sizeBand: builtinSizeBands.find((b) => b.id === ev.sizeBand),
  };
}

/**
 * Wrapper to ConferenceEvent, with all related data handy.
 * Convenient to use in the view layer.
 */
export class ConferenceEventRef {
  public id: string; // shortcut to ConferenceEvent.id
  public ref: ConferenceEvent;

  public date: Date;
  public tags: EventTag[];
  public country: Country;
  public sizeBand?: EventSizeBand;

  public constructor(ev: ConferenceEvent, lex: ConferenceEventLexicon) {
    ev = ensureValidConferenceEventObj(ev);

    this.id = ev.id;
    this.ref = ev;

    // It's rather impossible that we don't have valid country code here... so for now fallback to empty obj, to avoid any errors
    this.country = findCountry(ev.countryCode) || ({} as Country);

    // Get real EventTag objects from their IDs
    this.tags = ev.tags.reduce((tags: EventTag[], tid: string) => {
      const tag: EventTag | undefined = lex.tags.find((t: EventTag) => t.id === tid);
      return tag ? [...tags, tag] : tags;
    }, []);

    this.date = getNormalisedDate(ev.date);

    // Restore EventSizeBand obj from ID str stored in db
    this.sizeBand = builtinSizeBands.find((band) => band.id === ev.sizeBand);
  }
}

export function entityToIndex(entity?: Entity | string, dict: Entity[] = []): number {
  const id = entity && 'object' === typeof entity ? entity.id : entity;

  return dict.findIndex((en) => !!en && en.id === id);
}
