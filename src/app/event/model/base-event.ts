export interface BaseEvent {
  /**
   * Event name to display
   */
  name: string;

  /**
   * Main topics of the event
   */
  topicTags: string[];

  /**
   * Event location
   */
  location: string[];

  /**
   * Event date as Date() obj or string (e.g. Q4'2018)
   */
  date: Date|string;

  /**
   * Duration of event (num of days)
   */
  eventDuration: number;

  /**
   * Full website url of the event, including https:// prefix
   */
  website: string;

  /**
   * Long description of the event
   */
  description: string[];
}
