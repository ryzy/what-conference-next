import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTestingAuthAndDbModule } from '../../../testing/app-testing-with-database.module';
import { EventDetailsModule } from '../event-details.module';
import { EventDetailsPageComponent } from './event-details-page.component';

describe('EventDetailsPageComponent', () => {
  let component: EventDetailsPageComponent;
  let fixture: ComponentFixture<EventDetailsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingAuthAndDbModule, EventDetailsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailsPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
