import { TestBed } from '@angular/core/testing';
import { RoutesRecognized } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationPayload } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';

import { AppTestingAuthAndDbModule } from '../../../testing/app-testing-auth-db.module';
import { mockTags } from '../../../testing/fixtures/event-tags';
import { mockEventRefs, mockEvents } from '../../../testing/fixtures/events';
import { TestActions, TestActionsProvider } from '../../../testing/test-actions';
import { CoreService } from '../../core/services/core.service';
import { StitchService } from '../../core/stitch/stitch.service';
import { AppRootState } from '../../core/store/index';
import { AppRouterState, defaultAppRouterState } from '../../core/store/router/router';
import {
  FetchEventsAction,
  SetEventsAction,
  SetEventsFiltersAction,
  SetEventsSortingAction,
} from '../store/events-list-actions';
import { FetchTagsAction, SetTagsAction } from '../store/tags-actions';
import { EventsEffects } from './events-effects';

describe('EventsEffects', () => {
  let actions$: TestActions;
  let effects: EventsEffects;
  let store: Store<AppRootState>;
  let coreService: CoreService;
  let stitch: StitchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingAuthAndDbModule.withAuthAndDbReady()],
      providers: [TestActionsProvider],
    });

    actions$ = TestBed.get(Actions);
    coreService = TestBed.get(CoreService);
    store = TestBed.get(Store);
    effects = TestBed.get(EventsEffects);
    stitch = TestBed.get(StitchService);
  });

  it('#whenDbReady$', () => {
    let res: boolean | undefined;
    effects.whenDbReady$.subscribe((v) => (res = v));
    expect(res).toBe(true);
  });

  it('#fetchAndSetTags$', () => {
    actions$.stream = hot('-a', { a: new FetchTagsAction() });
    const expected = cold('-c', { c: new SetTagsAction(mockTags) });
    expect(effects.fetchAndSetTags$).toBeObservable(expected);
  });

  it('#fetchAndSetEvents$', () => {
    actions$.stream = hot('-a', { a: new FetchEventsAction() });
    const expected = cold('-c', { c: new SetEventsAction(mockEventRefs) });
    expect(effects.fetchAndSetEvents$).toBeObservable(expected);
  });

  it('#eventsFiltersToRouter$ should emit new route state', () => {
    // emit router navigation action to emulate url change
    const payload: RouterNavigationPayload<AppRouterState> = {
      routerState: defaultAppRouterState,
      event: {} as RoutesRecognized,
    };

    // We mock ROUTER_NAVIGATION action, so we don't care about actual result,
    // we just want to test if the observable emits.
    actions$.stream = hot('-an', {
      a: new SetEventsFiltersAction({}),
      n: { type: ROUTER_NAVIGATION, payload },
    });
    const expected = cold('--c', { c: defaultAppRouterState });
    expect(effects.eventsFiltersToRouter$).toBeObservable(expected);
  });

  it('#eventsSortingToRouter$ should emit FetchEventsAction afterwards', () => {
    // emit router navigation action to emulate url change
    const payload: RouterNavigationPayload<AppRouterState> = {
      routerState: defaultAppRouterState,
      event: {} as RoutesRecognized,
    };

    // We mock ROUTER_NAVIGATION action, so we don't care about actual result,
    // we just want to test if the observable emits.
    actions$.stream = hot('-an', {
      a: new SetEventsSortingAction({ active: 'foo' }),
      n: { type: ROUTER_NAVIGATION, payload },
    });
    const expected = cold('--c', { c: defaultAppRouterState });
    expect(effects.eventsSortingToRouter$).toBeObservable(expected);
  });
});
