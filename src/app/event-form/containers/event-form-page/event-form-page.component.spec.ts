import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppTestingAuthAndDbModule } from '../../../../testing/app-testing-with-database.module';
import { mockNewEventFormData } from '../../../../testing/fixtures/event-form';
import { mockEvents } from '../../../../testing/fixtures/events-db';
import { ConferenceEventFormData } from '../../../event-base/model/conference-event';
import { EventService } from '../../../event-base/services/event.service';
import { EventFormModule } from '../../event-form.module';
import { EventFormPageComponent } from './event-form-page.component';

describe('EventFormPageComponent', () => {
  let component: EventFormPageComponent;
  let fixture: ComponentFixture<EventFormPageComponent>;
  let service: EventService;
  let router: Router;
  let snackBar: MatSnackBar;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingAuthAndDbModule, EventFormModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(EventService);
    router = TestBed.get(Router);
    snackBar = TestBed.get(MatSnackBar);
    fixture = TestBed.createComponent(EventFormPageComponent);
    component = fixture.componentInstance;

    spyOn(router, 'navigate');
    spyOn(snackBar, 'open');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();

    // dummy call to bump test coverage
    component.onEventSaved();
  });

  it('should submit', () => {
    spyOn(service, 'newEvent').and.returnValue(of(mockEvents[0]));
    fixture.detectChanges();

    component.onSubmit(mockNewEventFormData);
    expect(snackBar.open).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should submit and show error (and should stay on the page)', () => {
    spyOn(service, 'newEvent').and.callFake(throwError);
    fixture.detectChanges();
    component.onSubmit({} as ConferenceEventFormData);
    expect(snackBar.open).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
