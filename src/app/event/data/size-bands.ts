import { Entity } from '../model/entity';

export interface EventSizeBand extends Entity {
  description: string;
}

/**
 * List of built-in event size bands
 */
export const builtinSizeBands: EventSizeBand[] = [
  { id: 'small', name: 'Small', description: '< 100 people' },
  { id: 'medium', name: 'Medium', description: '100..499 people' },
  { id: 'large', name: 'Large', description: '500..999 people' },
  { id: 'xlarge', name: 'Extra Large', description: '1000 and more people' },
];
