import { ConferenceEventLexicon } from '../../app/event-base/model/event-tag';
import { EventTag } from '../../app/event-base/model/event-tag';

export const mockTags: EventTag[] = [
  { id: 'backend', name: 'Backend' },
  { id: 'cloud', name: 'Cloud', description: 'Cloud Computing, services and DevOps' },
  { id: 'frontend', name: 'Frontend', description: 'Frontend tech' },
];
/**
 * Mock tags with some sub-tags
 */
export const mockTagsWithSub: EventTag[] = [
  { id: 'backend', name: 'Backend' },
  { id: 'cloud', name: 'Cloud', description: 'Cloud Computing, services and DevOps' },
  { id: 'frontend', name: 'Frontend', description: 'Frontend tech' },
  { id: 'angular', name: 'Angular', parent: 'frontend' },
  { id: 'react', name: 'React', parent: 'frontend' },
  { id: 'aws', name: 'AWS', parent: 'cloud' },
];

export const mockTag: EventTag = mockTags[0];

export const mockLex: ConferenceEventLexicon = {
  tags: mockTags,
};

export const mockLexEmpty: ConferenceEventLexicon = {
  tags: [],
};
