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
    this.source = source;
  }
}
