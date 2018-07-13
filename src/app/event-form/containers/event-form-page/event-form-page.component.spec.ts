import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTestingAuthAndDbModule } from '../../../../testing/app-testing-with-database.module';
import { EventFormModule } from '../../event-form.module';
import { EventFormPageComponent } from './event-form-page.component';

describe('EventFormPageComponent', () => {
  let component: EventFormPageComponent;
  let fixture: ComponentFixture<EventFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingAuthAndDbModule, EventFormModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventFormPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
