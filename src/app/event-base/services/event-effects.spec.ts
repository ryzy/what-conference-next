import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { of } from 'rxjs';

import { AppTestingAuthAndDbModule } from '../../../testing/app-testing-auth-db.module';
import { mockTopics } from '../../../testing/fixtures/topics';
import { TestActions, TestActionsProvider } from '../../../testing/test-actions';
import { CoreService } from '../../core/services/core.service';
import { StitchService } from '../../core/stitch/stitch.service';
import { AppRootState } from '../../core/store/index';
import { LoadTopicsAction, SetTopicsAction } from '../store/topics-actions';
import { EventEffects } from './event-effects';

describe('EventEffects', () => {
  let actions$: TestActions;
  let effects: EventEffects;
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
    effects = TestBed.get(EventEffects);
    stitch = TestBed.get(StitchService);
  });

  it('#whenDbReady$', () => {
    let res: boolean | undefined;
    effects.whenDbReady$.subscribe((v) => (res = v));
    expect(res).toBe(true);
  });

  it('#setTopics$', () => {
    actions$.stream = hot('-a', { a: new LoadTopicsAction() });
    const expected = cold('-c', { c: new SetTopicsAction(mockTopics) });
    expect(effects.setTopics$).toBeObservable(expected);
  });
});
