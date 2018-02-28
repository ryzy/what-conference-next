import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTestingModule } from '../../../../testing/app-testing.module';
import { CoreModule } from '../../../core/core.module';
import { EventsListModule } from '../../events-list.module';
import { EventsTableComponent } from './events-table.component';
import { EventsListService } from '../../services/events-list.service';

describe('EventsTableComponent', () => {
  let component: EventsTableComponent;
  let fixture: ComponentFixture<EventsTableComponent>;
  let service: EventsListService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        EventsListModule,
        AppTestingModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(EventsListService);
    fixture = TestBed.createComponent(EventsTableComponent);
    component = fixture.componentInstance;
    component.dataSource = service.getEventsDataSource();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
