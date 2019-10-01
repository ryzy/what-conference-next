/**
 * Events listing filters
 * as they arrive from events filter component
 * @see EventsFilterComponent
 */
export interface EventsFilters {
  /**
   * Region, sub-region or lower-cased country code
   */
  where?: string;
  workshops?: boolean;
  freeWorkshops?: boolean;

  /**
   * Clean and lean list of selected tags
   * @see TagsSelectorComponent
   */
  tags?: string[];
}
