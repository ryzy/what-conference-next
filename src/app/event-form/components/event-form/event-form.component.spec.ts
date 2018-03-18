import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppTestingWithFirestoreModule } from '../../../../testing/app-testing-with-firestore.module';

import { EventFormModule } from '../../event-form.module';
import { EventFormComponent } from './event-form.component';

describe('EventFormComponent', () => {
  let component: EventFormComponent;
  let fixture: ComponentFixture<EventFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        EventFormModule,
        AppTestingWithFirestoreModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
