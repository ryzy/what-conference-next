import { Entity } from '../../core/model/entity';

export interface EventTag extends Entity {
  /**
   * Reference to another, parent tag id
   *
   * Needed so we can build a tree-like structure tags
   * since we want to have primary and, more specific, secondary tags.
   */
  parent?: string;

  /**
   * Short description of the tag
   */
  description?: string;
}

/**
 * Data/lexicons needed to assemble full ConferenceEvent(Ref)
 */
export interface ConferenceEventLexicon {
  tags: EventTag[];
}
