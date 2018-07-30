import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTestingAuthAndDbModule } from '../../../../testing/app-testing-auth-db.module';
import { EventService } from '../../../event-base/services/event.service';
import { EventsListModule } from '../../events-list.module';
import { EventsTableComponent } from './events-table.component';

describe('EventsTableComponent', () => {
  let component: EventsTableComponent;
  let fixture: ComponentFixture<EventsTableComponent>;
  let service: EventService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingAuthAndDbModule, EventsListModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(EventService);
    fixture = TestBed.createComponent(EventsTableComponent);
    component = fixture.componentInstance;
    component.dataSource = service.getEventsDS();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
