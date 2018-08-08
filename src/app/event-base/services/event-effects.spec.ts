import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { of } from 'rxjs';

import { AppTestingAuthAndDbModule } from '../../../testing/app-testing-auth-db.module';
import { mockTags } from '../../../testing/fixtures/event-tags';
import { TestActions, TestActionsProvider } from '../../../testing/test-actions';
import { CoreService } from '../../core/services/core.service';
import { StitchService } from '../../core/stitch/stitch.service';
import { AppRootState } from '../../core/store/index';
import { LoadTagsAction, SetTagsAction } from '../store/tags-actions';
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

  it('#setTags$', () => {
    actions$.stream = hot('-a', { a: new LoadTagsAction() });
    const expected = cold('-c', { c: new SetTagsAction(mockTags) });
    expect(effects.setTags$).toBeObservable(expected);
  });
});
