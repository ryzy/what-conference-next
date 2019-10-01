import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router, RoutesRecognized } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngrx/effects';
import { RouterNavigationPayload, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { cold, hot } from 'jasmine-marbles';

import { AppRootState, reducers, rootStoreConfig } from '../store/index';
import { AppRouterState, defaultAppRouterState } from '../store/router/router';
import { RouterEffects } from './router-effects';
import { BackAction, ForwardAction, GoAction } from '../store/router/router-actions';
import { TestActions, TestActionsProvider } from '../../../testing/test-actions';

describe('RouterEffects', () => {
  let actions$: TestActions;
  let effects: RouterEffects;
  let router: Router;
  let location: Location;
  let store: Store<AppRootState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, StoreModule.forRoot(reducers, rootStoreConfig)],
      providers: [TestActionsProvider, RouterEffects],
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(RouterEffects);
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    store = TestBed.get(Store);

    spyOn(router, 'navigate');
    spyOn(location, 'back');
    spyOn(location, 'forward');
  });

  it('should #navigate$', () => {
    const action = new GoAction(['/']);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-c', { c: action });

    expect(effects.navigate$).toBeObservable(expected);
    expect(router.navigate).toHaveBeenCalledWith(['/'], {});
  });

  it('#navigate should emit only after route navigation', () => {
    let navigated: AppRouterState | boolean = false;

    // emit router navigation action to emulate url change
    const payload: RouterNavigationPayload<AppRouterState> = {
      routerState: defaultAppRouterState,
      event: {} as RoutesRecognized,
    };
    actions$.stream = of({ type: ROUTER_NAVIGATION, payload });

    effects.navigate([]).subscribe((v) => (navigated = v));
    expect(navigated).toBeTruthy();
  });
  it('#navigate should not emit without route navigation', () => {
    let navigated: AppRouterState | boolean = false;
    // same like above, but without dispatching ROUTER_NAVIGATION action to the store
    effects.navigate([]).subscribe((v) => (navigated = v));
    expect(navigated).toBe(false);
  });

  it('#navigateWithEventsFilters should emit only after route navigation', () => {
    let navigated: AppRouterState | undefined;

    // emit router navigation action to emulate url change
    const payload: RouterNavigationPayload<AppRouterState> = {
      routerState: { ...defaultAppRouterState, params: { where: 'america', s: 'date' } },
      event: {} as RoutesRecognized,
    };
    actions$.stream = of({ type: ROUTER_NAVIGATION, payload });

    effects.navigateWithEventsFilters().subscribe((v) => (navigated = v));
    expect(navigated).toBeTruthy();
    expect(navigated.params).toEqual({ where: 'america', s: 'date' });
  });
  it('#navigateWithSortInfo should emit only after route navigation', () => {
    let navigated: AppRouterState | boolean = false;

    // emit router navigation action to emulate url change
    const payload: RouterNavigationPayload<AppRouterState> = {
      routerState: defaultAppRouterState,
      event: {} as RoutesRecognized,
    };
    actions$.stream = of({ type: ROUTER_NAVIGATION, payload });

    effects.navigateWithSortInfo().subscribe((v) => (navigated = v));
    expect(navigated).toBeTruthy();
  });
  it('#navigateWithSortInfo should not emit without route navigation', () => {
    let navigated: AppRouterState | boolean = false;
    // same like above, but without dispatching ROUTER_NAVIGATION action to the store
    effects.navigateWithSortInfo().subscribe((v) => (navigated = v));
    expect(navigated).toBe(false);
  });

  it('should #navigate$ with NavigationExtras', () => {
    const action = new GoAction(['/'], { queryParams: { test: 'test' } });
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-c', { c: action });

    expect(effects.navigate$).toBeObservable(expected);
    expect(router.navigate).toHaveBeenCalledWith(['/'], { queryParams: { test: 'test' } });
  });

  it('should #navigateBack$', () => {
    const action = new BackAction();
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-c', { c: action });

    expect(effects.navigateBack$).toBeObservable(expected);
    expect(location.back).toHaveBeenCalled();
  });

  it('should #navigateForward$', () => {
    const action = new ForwardAction();
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-c', { c: action });

    expect(effects.navigateForward$).toBeObservable(expected);
    expect(location.forward).toHaveBeenCalled();
  });
});
