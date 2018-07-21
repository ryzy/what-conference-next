import { TestBed } from '@angular/core/testing';

import { AppTestingAuthAndDbModule } from '../../../testing/app-testing-with-database.module';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { mockTopics } from '../../../testing/fixtures/topics';
import { EventBaseModule } from '../event-base.module';
import { EventTopic } from '../model/event-topic';
import { EventService } from './event.service';

describe('EventService', () => {
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppTestingAuthAndDbModule, // with mocked DatabaseService
        EventBaseModule,
      ],
    });

    eventService = TestBed.get(EventService);
  });

  it('#getTopics', () => {
    let topics: EventTopic[] | undefined;
    eventService.getTopics().subscribe((v) => (topics = v));

    // We have full EventBaseModule and its effects, it tries to load the topics on the start
    // Since we work with mocked DatabaseService (from AppTestingAuthAndDbModule), we expect
    // topics already loaded...
    expect(topics).toEqual(mockTopics);
    expect(topics[0].id).toEqual(mockTopics[0].id);
  });
});
