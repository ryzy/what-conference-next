import { deburr, kebabCase } from 'lodash-es';

import { EventSizeBand } from '../data/size-bands';
import { Country } from './country';
import { EventTopic } from './event-topic';

export class ConferenceEvent {
  public id: string;

  /**
   * Event name to display
   */
  public name: string = '';

  /**
   * Main topics of the event
   */
  public topicTags: { [topicTag: string]: boolean } = {};

  /**
   * Event date as Date() obj or string (e.g. Q4'2018)
   */
  public date: Date = new Date();

  /**
   * Event location
   */
  public country: string = '';
  public countryCode: string = '';
  public countryFlag: string = '';
  public region: string = '';
  public subRegion: string = '';
  public city: string = '';
  public address: string = '';
  public addressLatLng?: [number, number];

  /**
   * Full website url of the event, including https:// prefix
   */
  public website: string = '';

  /**
   * Long description of the event
   */
  public description: string = '';
  public twitterHandle: string = '';

  /**
   * Duration of event (num of days, incl. workshops days)
   */
  public eventDuration: number = 1;

  public workshopDays: number | undefined;

  public price: number | undefined;
  public sizeBand: EventSizeBand | undefined;

  // TODO: hash tags
  // TODO: speakers

  /**
   * Create ConferenceEvent from event form structure
   */
  public static fromFormValues(values: { [key: string]: any }, topicsDb: EventTopic[] = []): ConferenceEvent {
    const event: ConferenceEvent = new ConferenceEvent(values as ConferenceEvent);

    event.topicTags = {}; // re-set, so it doesn't contain any original values
    if (Array.isArray(values.topicTags)) {
      event.topicTags = (values.topicTags as boolean[]).reduce((ts: any, selected: boolean, idx: number) => {
        if (selected && topicsDb[idx]) {
          ts[topicsDb[idx].id] = true;
        }

        return ts;
      }, {});
    }

    if (values.country) {
      const selectedCountry = values.country as Country;
      event.country = selectedCountry.name;
      event.countryCode = selectedCountry.isoCode;
      event.countryFlag = selectedCountry.flag;
      event.region = selectedCountry.region;
      event.subRegion = selectedCountry.subregion;
      event.addressLatLng = selectedCountry.latlng;
    }

    return event;
  }

  public constructor(values: Partial<ConferenceEvent>) {
    Object.assign(this, values);
    this.id = values.id || kebabCase(deburr(values.name));
  }
}
