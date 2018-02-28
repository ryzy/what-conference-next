import { BaseEvent } from './base-event';

export interface ConferenceEvent extends BaseEvent {
  workshopDays?: number;
  price?: number;
  sizeBand?: number;
  speakers: string[]; // TODO
  twitterHandle?: string;
  // TODO: hash tags
}
