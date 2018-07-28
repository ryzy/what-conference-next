import { EventTopic } from '../../app/event-base/model/event-topic';

export const mockTopics: EventTopic[] = [
  { id: 'frontend', name: 'Frontend' },
  { id: 'devops', name: 'DevOps' },
  { id: 'backend', name: 'Backend' },
];

export const mockTopic: EventTopic = mockTopics[0];
