import { EventTopic } from '../../app/event-base/model/event-topic';

export const mockTopics: EventTopic[] = [
  { id: 'frontend', name: 'Frontend' },
  { id: 'backend', name: 'Backend' },
  { id: 'cloud', name: 'Cloud' },
];

export const mockTopic: EventTopic = mockTopics[0];
