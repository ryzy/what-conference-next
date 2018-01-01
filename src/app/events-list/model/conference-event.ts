import { BaseEvent } from './base-event';

export interface ConferenceEvent extends BaseEvent {
  // TODO: workshopDays
  price?: number;
  priceCurrency?: string;
  confSize?: number;
  speakers: string[];
  tags: string[];
  twitterHandle?: string; // TODO: hash tags
}
