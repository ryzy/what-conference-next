import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Actions } from '@ngrx/effects';
import { cold, hot } from 'jasmine-marbles';

import { RouterEffects } from './router-effects';
import { BackAction, ForwardAction, GoAction } from './router-actions';
import { TestActions } from '../../../../testing/test-actions';

describe('RouterEffects', () => {
  let actions$: TestActions;
  let effects: RouterEffects;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: Actions,
          useFactory: () => new TestActions(),
        },
        RouterEffects,
      ],
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(RouterEffects);
    router = TestBed.get(Router);
    location = TestBed.get(Location);

    spyOn(router, 'navigate');
    spyOn(location, 'back');
    spyOn(location, 'forward');
  });

  it('should navigate$', () => {
    const action = new GoAction(['/']);
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-c', { c: action });

    expect(effects.navigate$).toBeObservable(expected);
    expect(router.navigate).toHaveBeenCalledWith(['/'], {});
  });

  it('should navigate$ with NavigationExtras', () => {
    const action = new GoAction(['/'], { queryParams: { test: 'test' } });
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-c', { c: action });

    expect(effects.navigate$).toBeObservable(expected);
    expect(router.navigate).toHaveBeenCalledWith(['/'], { queryParams: { test: 'test' } });
  });

  it('should navigateBack$', () => {
    const action = new BackAction();
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-c', { c: action });

    expect(effects.navigateBack$).toBeObservable(expected);
    expect(location.back).toHaveBeenCalled();
  });

  it('should navigateForward$', () => {
    const action = new ForwardAction();
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-c', { c: action });

    expect(effects.navigateForward$).toBeObservable(expected);
    expect(location.forward).toHaveBeenCalled();
  });
});
