import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTestingWithFirestoreModule } from '../../../../testing/app-testing-with-firestore.module';
import { EventsPageComponent } from './events-page.component';
import { EventsListModule } from '../../events-list.module';

describe('EventsPageComponent', () => {
  let component: EventsPageComponent;
  let fixture: ComponentFixture<EventsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppTestingWithFirestoreModule,
        EventsListModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
