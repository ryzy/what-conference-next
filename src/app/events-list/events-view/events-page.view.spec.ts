import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { AppTestingAuthAndDbModule } from '../../../testing/app-testing-auth-db.module';
import { mockLex, mockLexEmpty } from '../../../testing/fixtures/event-tags';
import { mockEvent, mockEvents } from '../../../testing/fixtures/events';
import { FullAppRootState } from '../../../testing/state';
import { AppRouterState, defaultAppRouterState } from '../../core/store/router/router';
import { ConferenceEventRef } from '../../event-base/model/conference-event';
import { EventsService } from '../../event-base/services/events.service';
import { EventsPageView } from './events-page.view';
import { EventsListModule } from '../events-list.module';

describe('EventsPageView', () => {
  let component: EventsPageView;
  let fixture: ComponentFixture<EventsPageView>;
  let service: EventsService;
  let store: Store<FullAppRootState>;
  let dispatchSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingAuthAndDbModule, EventsListModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsPageView);
    component = fixture.componentInstance;
    service = TestBed.get(EventsService);

    store = TestBed.get(Store);
    dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
  });

  it('should create with events list', () => {
    const mockRouterState: AppRouterState = { ...defaultAppRouterState, params: { ws: '1', s: 'date' } };
    const mockEventRefs = mockEvents.map((v) => new ConferenceEventRef(v, mockLex));

    // have some router state emitted, to test the subscription
    spyOn(service, 'getRouterState').and.returnValue(of(mockRouterState));
    // have some events returned, so we actually test events rendering
    spyOn(service, 'getEvents').and.returnValue(of(mockEventRefs));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('#onFiltersChange', () => {
    expect(dispatchSpy).not.toHaveBeenCalled();
    component.onFiltersChange({});
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('#onSortChange', () => {
    expect(dispatchSpy).not.toHaveBeenCalled();
    component.onSortChange({ active: 'foo' });
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('#tableTrackByFn', () => {
    expect(component.tableTrackByFn(new ConferenceEventRef(mockEvent, mockLexEmpty))).toEqual(mockEvent.id);
  });
});
