import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';

import { mockTags } from '../../../../testing/fixtures/event-tags';
import { mockUser, mockUserData } from '../../../../testing/fixtures/user';
import { EventsFeatureStoreName, eventsReducers } from '../../../event-base/store/index';
import { User, UserData } from '../../model/user';
import { AppRootState, reducers } from '../index';
import { appInitialState, appReducer, AppState, defaultUserData } from './app-reducer';
import * as appActions from './app-actions';
import * as appSelectors from './app-selectors';
import * as tagsActions from '../../../event-base/store/tags-actions';

describe('AppState', () => {
  let store: Store<AppRootState>;

  describe('appReducer:', () => {
    it('should return state', () => {
      expect(appReducer(appInitialState, {} as appActions.AppActions)).toBe(appInitialState);
    });

    it(`should generate state for *${appActions.AppActionType.DB_READY}*`, () => {
      expect(appInitialState.dbReady).toBeFalsy();

      const state = appReducer(appInitialState, new appActions.DbReadyAction());
      expect(state.dbReady).toBe(true);
    });

    it(`should generate state for *${appActions.AppActionType.SET_USER}*`, () => {
      const state = appReducer(appInitialState, new appActions.SetUserAction(mockUser));
      expect(state.user).toBe(mockUser);

      const state2 = appReducer(appInitialState, new appActions.SetUserAction());
      expect(state2.user).toBe(undefined);
    });

    it(`should generate state for *${appActions.AppActionType.SET_USER_DATA}*`, () => {
      const state = appReducer(appInitialState, new appActions.SetUserDataAction(mockUserData));
      expect(state.userData).toBe(mockUserData);

      const state2 = appReducer(appInitialState, new appActions.SetUserDataAction());
      expect(state2.userData).toBe(undefined);
    });
  });

  describe('selectors:', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [StoreModule.forRoot(reducers), StoreModule.forFeature(EventsFeatureStoreName, eventsReducers)],
      });

      store = TestBed.get(Store);
    });

    it('#selectUser', () => {
      let user: User | undefined;
      store.select(appSelectors.selectUser).subscribe((u) => (user = u));
      expect(user).toBe(undefined);

      store.dispatch(new appActions.SetUserAction(mockUser));
      expect(user).toBe(mockUser);
    });

    it('#selectUserData', () => {
      let data: UserData | undefined;
      store.select(appSelectors.selectUserData).subscribe((u) => (data = u));
      expect(data).toBe(defaultUserData);

      store.dispatch(new appActions.SetUserDataAction(mockUserData));
      expect(data).toBe(mockUserData);
    });

    it('#selectInitDataFetched: first db, then tags', () => {
      let res: boolean | undefined;
      store.select(appSelectors.selectInitDataFetched).subscribe((v) => (res = v));
      expect(res).toBe(false);

      store.dispatch(new appActions.DbReadyAction());
      expect(res).toBe(false);

      store.dispatch(new tagsActions.SetTagsAction(mockTags));
      expect(res).toBe(true);
    });

    it('#selectIsDbReady', () => {
      let res: boolean | undefined;
      store.select(appSelectors.selectIsDbReady).subscribe((v) => (res = v));
      expect(res).toBe(false);

      store.dispatch(new appActions.DbReadyAction());
      expect(res).toBe(true);
    });

    it('#selectInitDataFetched: first tags, then db', () => {
      let res: boolean | undefined;
      store.select(appSelectors.selectInitDataFetched).subscribe((v) => (res = v));
      expect(res).toBe(false);

      store.dispatch(new tagsActions.SetTagsAction(mockTags));
      expect(res).toBe(false);

      store.dispatch(new appActions.DbReadyAction());
      expect(res).toBe(true);
    });
  });
});
