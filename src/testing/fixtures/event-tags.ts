import { ConferenceEventLexicon } from '../../app/event-base/model/event-tag';
import { EventTag } from '../../app/event-base/model/event-tag';

export const mockTags: EventTag[] = [
  { id: 'frontend', name: 'Frontend', description: 'Frontend tech' },
  { id: 'backend', name: 'Backend' },
  { id: 'cloud', name: 'Cloud', description: 'Cloud Computing, services and DevOps' },
];

export const mockTag: EventTag = mockTags[0];

export const mockLex: ConferenceEventLexicon = {
  tags: mockTags,
};

export const mockLexEmpty: ConferenceEventLexicon = {
  tags: [],
};
