import { EventTopic } from '../../app/event-base/model/event-topic';

export const mockTopics: EventTopic[] = [
  { id: 'mock-frontend', name: 'Frontend' },
  { id: 'mock-devops', name: 'DevOps' },
  { id: 'mock-backend', name: 'Backend' },
];

export const mockTopic: EventTopic = mockTopics[0];
