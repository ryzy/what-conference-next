import { mockTag, mockTags } from '../../testing/fixtures/event-tags';
import { mockEvent, mockEventRefs } from '../../testing/fixtures/events';
import { EventsFilters } from '../event-base/model/events-filters';
import { AppSortInfo } from './model/entity';
import { AppRouterParams, AppRouterState } from './store/router/router';
import {
  AppSectionUrls,
  defaultSortInfo,
  getEventLink,
  getEventsFiltersFromRouter,
  getEventsSortInfoFromRouter,
  getTagLink,
  makeEventsFiltersForRouter,
  makeParamsForRouter,
  makeSortInfoForRouter,
} from './url-utils';

describe('url-utils', () => {
  it('#makeParamsForRouter', () => {
    expect(makeParamsForRouter({}, undefined as any)).toEqual({});

    // overriding params
    expect(makeParamsForRouter({ s: 'date' }, { s: 'tags' })).toEqual({ s: 'tags' });

    // converting long `true` to shorter `1`
    expect(makeParamsForRouter({}, { k: true })).toEqual({ k: '1' });

    // un-setting empty variables (so they don't clutter the URL)
    expect(makeParamsForRouter({}, { k: false })).toEqual({});
    expect(makeParamsForRouter({ k: 'foo' }, { k: undefined })).toEqual({});
  });

  it('#makeEventsFiltersForRouter, #getEventsFiltersFromRouter', () => {
    expect(makeEventsFiltersForRouter()).toEqual(<AppRouterParams>{
      where: undefined,
      tags: undefined,
      ws: undefined,
      fws: undefined,
    });

    const testFilters: EventsFilters = {
      where: 'europe',
      tags: ['some', 'tag'],
      workshops: true,
      freeWorkshops: true,
    };
    const expectedParams: AppRouterParams = {
      where: 'europe',
      tags: 'some,tag',
      ws: '1',
      fws: '1',
    };
    expect(makeEventsFiltersForRouter(testFilters)).toEqual(expectedParams);
    expect(getEventsFiltersFromRouter({ params: expectedParams } as AppRouterState)).toEqual(testFilters);
  });

  it('#makeSortInfoForRouter', () => {
    const emptyParams = { s: undefined, sd: undefined };
    // Should make nothing when no router state provided
    expect(makeSortInfoForRouter()).toEqual(emptyParams);
    // Should make nothing when empty router state provided
    expect(makeSortInfoForRouter({} as AppSortInfo)).toEqual(emptyParams);
    // Should not generate state for default sort
    expect(makeSortInfoForRouter({ active: defaultSortInfo.active, direction: defaultSortInfo.direction })).toEqual(
      emptyParams,
    );
    // Should not generate state for default sort, but different direction
    expect(makeSortInfoForRouter({ active: defaultSortInfo.active, direction: 'desc' })).toEqual({
      s: defaultSortInfo.active,
      sd: 'desc',
    });

    // Should generate field name and direction
    expect(makeSortInfoForRouter({ active: 'fieldName', direction: 'desc' })).toEqual({ s: 'fieldName', sd: 'desc' });
    // Should generate only field name if direction is default
    expect(makeSortInfoForRouter({ active: 'fieldName', direction: 'asc' })).toEqual({ s: 'fieldName', sd: undefined });
    // Should make nothing when direction is set to empty string, which means to remove the sort
    expect(makeSortInfoForRouter({ active: 'fieldName', direction: '' })).toEqual(emptyParams);
    // Should make nothing when sort field is empty
    expect(makeSortInfoForRouter({ active: '', direction: 'desc' })).toEqual(emptyParams);
  });

  it('#getEventsSortInfoFromRouter', () => {
    expect(getEventsSortInfoFromRouter(undefined as any)).toEqual(undefined);

    // should generate nice AppSortInfo
    expect(getEventsSortInfoFromRouter({ params: { s: 'fieldName' } } as AppRouterState)).toEqual({
      active: 'fieldName',
      direction: 'asc',
    });

    // should generate nothing when it doesn't make sense... (empty sort field, just direction etc)
    expect(getEventsSortInfoFromRouter({ params: { s: '' } } as AppRouterState)).toEqual(undefined);
    expect(getEventsSortInfoFromRouter({ params: { sd: 'desc' } } as AppRouterState)).toEqual(undefined);
  });

  it('#getEventLink', () => {
    expect(getEventLink(mockEvent.id)).toEqual([AppSectionUrls.Event, mockEvent.id]);
    expect(getEventLink(mockEvent)).toEqual([AppSectionUrls.Event, mockEvent.id]);
    expect(getEventLink(mockEventRefs[0])).toEqual([AppSectionUrls.Event, mockEventRefs[0].id]);
  });

  it('#getTagLink', () => {
    // single tags
    expect(getTagLink(mockTag)).toEqual([AppSectionUrls.EventsList, { tags: mockTag.id }]);
    expect(getTagLink(mockTag.id)).toEqual([AppSectionUrls.EventsList, { tags: mockTag.id }]);

    // multiple tags
    expect(getTagLink([mockTags[0], mockTags[1]])).toEqual([
      AppSectionUrls.EventsList,
      { tags: `${mockTags[0].id},${mockTags[1].id}` },
    ]);
    expect(getTagLink([mockTags[0].id, mockTags[1].id])).toEqual([
      AppSectionUrls.EventsList,
      { tags: `${mockTags[0].id},${mockTags[1].id}` },
    ]);

    // different base url
    expect(getTagLink(mockTag, AppSectionUrls.Event)).toEqual([AppSectionUrls.Event, { tags: mockTag.id }]);
  });
});
