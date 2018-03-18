import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';

import { mockUser } from '../../../../testing/fixtures/user';
import { User } from '../../model/user';
import { AppRootState, reducers } from '../index';
import { AppActions, AppActionType, SetUserAction } from './app-actions';
import { appInitialState, appReducer, AppState } from './app-reducer';
import * as appSelectors from './app-selectors';

describe('AppState', () => {
  let store: Store<AppRootState>;

  describe('appReducer:', () => {

    it('should return state', () => {
      expect(appReducer(appInitialState, {} as AppActions)).toBe(appInitialState);
    });

    it(`should generate state for *${AppActionType.SET_USER}*`, () => {
      const state = appReducer(appInitialState, new SetUserAction(mockUser));
      expect(state.user).toBe(mockUser);

      const state2 = appReducer(appInitialState, new SetUserAction());
      expect(state2.user).toBe(undefined);
    });
  });

  describe('selectors:', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot(reducers),
        ],
      });

      store = TestBed.get(Store);
    });

    it('#getUser', () => {
      let user: User|undefined;
      store.select(appSelectors.getUser).subscribe(u => user = u);
      expect(user).toBe(undefined);

      store.dispatch(new SetUserAction(mockUser));
      expect(user).toBe(mockUser);
    });
  });
});
