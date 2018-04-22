// tslint:disable:deprecation
import { Actions } from '@ngrx/effects';
import { Observable, EMPTY } from 'rxjs';

/**
 * Helper class to use while testing Effects with jasmine-marbles
 */
export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    // TODO: source is deprecated, find another way
    this.source = source;
  }
}

/**
 * Use in test to provide testing @ngrx Actions, e.g.
 * ```
 * providers: [TestActionsProvider],
 * ```
 */
export const TestActionsProvider = { provide: Actions, useFactory: () => new TestActions() };
