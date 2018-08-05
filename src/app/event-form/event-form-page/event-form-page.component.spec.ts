import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AppTestingAuthAndDbModule } from '../../../testing/app-testing-auth-db.module';
import { mockNewEventFormData } from '../../../testing/fixtures/event-form';
import { mockEvent, mockEvents } from '../../../testing/fixtures/events-db';
import { ConferenceEventFormData, ConferenceEventRef } from '../../event-base/model/conference-event';
import { EventService } from '../../event-base/services/event.service';
import { EventFormModule } from '../event-form.module';
import { EventFormPageComponent } from './event-form-page.component';

describe('EventFormPageComponent', () => {
  let component: EventFormPageComponent;
  let fixture: ComponentFixture<EventFormPageComponent>;
  let service: EventService;
  let router: Router;
  let snackBar: MatSnackBar;
  let dialog: MatDialog;

  let routerNavigateSpy: jasmine.Spy;
  let snackBarOpenSpy: jasmine.Spy;
  let dialogOpenSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingAuthAndDbModule, EventFormModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(EventService);
    router = TestBed.get(Router);
    snackBar = TestBed.get(MatSnackBar);
    dialog = TestBed.get(MatDialog);
    fixture = TestBed.createComponent(EventFormPageComponent);
    component = fixture.componentInstance;

    routerNavigateSpy = spyOn(router, 'navigate');
    snackBarOpenSpy = spyOn(snackBar, 'open');
    dialogOpenSpy = spyOn(dialog, 'open');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();

    // dummy call to cover all else {} branches
    component.onEventSaved();
  });

  it('should submit', () => {
    spyOn(service, 'addOrUpdateEvent').and.returnValue(of(new ConferenceEventRef('id', mockEvents[0])));
    fixture.detectChanges();

    component.onSubmit(mockNewEventFormData);
    expect(snackBarOpenSpy).toHaveBeenCalled();
    expect(routerNavigateSpy).toHaveBeenCalled();
  });

  it('should submit and show error (and should stay on the page)', () => {
    spyOn(service, 'addOrUpdateEvent').and.callFake(throwError);
    fixture.detectChanges();
    component.onSubmit({} as ConferenceEventFormData);
    expect(snackBarOpenSpy).toHaveBeenCalled();
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });

  it('#onCancel should navigate to event details page', () => {
    component.editingEvent = new ConferenceEventRef(mockEvent.id, mockEvent);
    component.onCancel();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/', 'ev', mockEvent.id]);
  });

  it('#onCancel should navigate to / if not editing event', () => {
    component.onCancel();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('#onDelete should delete event (when confirmed)', () => {
    const dbDeleteEventSpy = spyOn(service, 'deleteEvent').and.returnValue(of(true));
    dialogOpenSpy.and.returnValue(<MatDialogRef<any>>{ afterClosed: () => of(true), close: () => null });
    component.editingEvent = new ConferenceEventRef(mockEvent.id, mockEvent);
    component.onDelete();
    expect(dialogOpenSpy).toHaveBeenCalled();
    expect(dbDeleteEventSpy).toHaveBeenCalled();
    expect(routerNavigateSpy).toHaveBeenCalled();
  });

  it('#onDelete should NOT delete event (when not confirmed)', () => {
    const dbDeleteEventSpy = spyOn(service, 'deleteEvent').and.returnValue(of(true));
    dialogOpenSpy.and.returnValue(<MatDialogRef<any>>{ afterClosed: () => of(false), close: () => null });
    component.editingEvent = new ConferenceEventRef(mockEvent.id, mockEvent);
    component.onDelete();
    expect(dialogOpenSpy).toHaveBeenCalled();
    expect(dbDeleteEventSpy).not.toHaveBeenCalled();
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });
});
