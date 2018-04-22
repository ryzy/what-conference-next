import { deburr, kebabCase } from 'lodash-es';

import { EventSizeBand } from '../data/size-bands';
import { findCountry } from '../utils/event-utils';
import { Country } from './country';

export class ConferenceEvent {
  public id: string;

  /**
   * Event name to display
   */
  public name: string;

  /**
   * Main topics of the event
   */
  public topicTags: string[];

  /**
   * Event date as Date() obj or string (e.g. Q4'2018)
   */
  public date: Date;

  /**
   * Event location
   */
  public country?: Country;
  public city?: string;
  public address?: string;

  /**
   * Duration of event (num of days)
   */
  public eventDuration: number;
  public workshopDays: number;

  public price?: number;
  public sizeBand?: EventSizeBand;

  /**
   * Full website url of the event, including https:// prefix
   */
  public website?: string;

  /**
   * Long description of the event
   */
  public description?: string;
  public twitterHandle?: string;

  // TODO: hash tags
  // TODO: speakers

  public constructor(values: Partial<ConferenceEvent>) {
    this.id = values.id || kebabCase(deburr(values.name));
    this.name = values.name || '';
    this.topicTags = values.topicTags || [];

    this.country = findCountry(values.country);
    this.city = values.city;
    this.address = values.address;

    this.date = values.date instanceof Date ? values.date : new Date(values.date as any);
    this.eventDuration = values.eventDuration || 1;
    this.workshopDays = values.workshopDays || 0;
    this.price = values.price || 0;
    this.sizeBand = values.sizeBand; // TODO: invalidate provided value

    this.website = values.website;
    this.description = values.website;
    this.twitterHandle = values.twitterHandle;
  }
}
