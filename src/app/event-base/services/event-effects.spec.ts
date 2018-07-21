import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { cold, hot } from 'jasmine-marbles';

import { AppTestingAuthAndDbModule } from '../../../testing/app-testing-with-database.module';
import { mockTopics } from '../../../testing/fixtures/topics';
import { TestActions, TestActionsProvider } from '../../../testing/test-actions';
import { LoadTopicsAction, SetTopicsAction } from '../store/topics-actions';
import { EventEffects } from './event-effects';

describe('EventEffects', () => {
  let actions$: TestActions;
  let effects: EventEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingAuthAndDbModule],
      providers: [TestActionsProvider, EventEffects],
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(EventEffects);
  });

  it('$setTopics$', () => {
    const action = new LoadTopicsAction();
    actions$.stream = hot('-a', { a: action });
    const expected = cold('-c', { c: new SetTopicsAction(mockTopics) });
    expect(effects.setTopics$).toBeObservable(expected);
  });

  it('#loadTopics$', () => {
    actions$.stream = hot('');
    // expect LoadTopicsAction and observable to complete
    const expected = cold('(v|)', { v: new LoadTopicsAction() });
    expect(effects.loadTopics$).toBeObservable(expected);
  });
});
