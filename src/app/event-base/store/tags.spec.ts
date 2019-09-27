import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { rootStoreConfig } from '../../core/store/index';

import {
  EventsFeatureStoreName,
  eventsInitialState,
  eventsReducers,
  EventsRootState,
  selectAllTags,
  selectTagsIsLoaded,
  selectTagsState,
  selectTagsCount,
  selectAllTagsSorted,
} from './index';
import { TagsActions, TagsActionType, FetchTagsAction, SetTagsAction } from './tags-actions';
import { tagsInitialState, tagsReducer, TagsState } from './tags-reducer';
import { mockTags, mockTagsWithSub } from '../../../testing/fixtures/event-tags';
import { EventTag } from '../model/event-tag';

describe('TagsState', () => {
  let store: Store<EventsRootState>;
  let state: TagsState;

  describe('tagsReducer:', () => {
    it('should return state', () => {
      expect(tagsReducer(tagsInitialState, {} as TagsActions)).toBe(tagsInitialState);
    });

    it(`should generate state for *${TagsActionType.FETCH_TAGS}*`, () => {
      state = tagsReducer(tagsInitialState, new FetchTagsAction());
      expect(state.loaded).toBe(false);
      expect(state.ids).toEqual([]);
      expect(state.entities).toEqual({});

      state = tagsReducer(state, new SetTagsAction(mockTags));
      expect(state.loaded).toBe(true);
      expect(state.ids.length).toBeGreaterThan(0);

      state = tagsReducer(state, new FetchTagsAction());
      expect(state.loaded).toBe(false);
      expect(state.ids).toEqual([]);
      expect(state.entities).toEqual({});
    });

    it(`should generate state for *${TagsActionType.SET_TAGS}*`, () => {
      state = tagsReducer(tagsInitialState, new SetTagsAction(mockTags));
      expect(state.loaded).toBe(true);
      expect(state.ids.length).toBeGreaterThan(0);
    });
  });

  describe('selectors:', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot({} as any, rootStoreConfig),
          StoreModule.forFeature(EventsFeatureStoreName, eventsReducers, { initialState: eventsInitialState }),
        ],
      });

      store = TestBed.get(Store);
    });

    it('#selectTagsState', () => {
      let res: TagsState | undefined;
      store.select(selectTagsState).subscribe((v) => (res = v));
      expect(res).toEqual(tagsInitialState);
    });

    it('#selectAllTags, #selectTagsCount', () => {
      let res: EventTag[] | undefined;
      let total: number | undefined;
      store.select(selectAllTags).subscribe((v) => (res = v));
      store.select(selectTagsCount).subscribe((v) => (total = v));
      expect(res).toEqual([]);
      expect(total).toBe(0);

      store.dispatch(new SetTagsAction(mockTags));
      expect(res).toEqual(mockTags);
      expect(total).toBe(mockTags.length);
    });

    it('#selectTagsIsLoaded', () => {
      let res: boolean | undefined;
      store.select(selectTagsIsLoaded).subscribe((v) => (res = v));
      expect(res).toBe(false);

      store.dispatch(new SetTagsAction(mockTags));
      expect(res).toBe(true);
    });

    it('#selectAllTagsSorted', () => {
      let res: EventTag[] | undefined;
      store.select(selectAllTagsSorted).subscribe((v) => (res = v));
      store.dispatch(new SetTagsAction(mockTagsWithSub));
      expect(res[0]).toEqual(mockTagsWithSub[0]); // expect 1st main tag
      expect(res[1]).toEqual(mockTagsWithSub[1]); // expect 2nd main tag
      expect(res[2]).toEqual(mockTagsWithSub[5]); // expect 2nd main tag sub-tag
      expect(res[3]).toEqual(mockTagsWithSub[2]); // expect 3rd main tag
    });
  });
});
