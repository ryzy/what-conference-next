import { TestBed } from '@angular/core/testing';

import { AppTestingAuthAndDbModule } from '../../../testing/app-testing-with-database.module';
import { EventTopic } from '../model/event-topic';
import { EventService } from './event.service';

describe('EventService', () => {
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingAuthAndDbModule],
    });

    eventService = TestBed.get(EventService);
  });

  it('#getTopics', () => {
    let topics: EventTopic[] | undefined;
    eventService.getTopics().subscribe((v) => (topics = v));
    console.log(topics);
  });
});
