import { defaultAppRouterState } from '../../core/store/router/router';
import { getEventsQueryFromRouterState, getEventsQuerySortFromRouterState } from './db-utils';

describe('db-utils', () => {
  it('#getEventsQueryFromRouterState defaults', () => {
    const q = getEventsQueryFromRouterState(defaultAppRouterState);
    expect(Object.keys(q)).toEqual(['status', 'date']);
    expect(q.status).toBeTruthy();
    expect(q.date).toBeTruthy();
  });

  it('#getEventsQueryFromRouterState location', () => {
    let q = getEventsQueryFromRouterState({ ...defaultAppRouterState, params: { where: 'americas' } });
    expect(q.status).toBeTruthy();
    expect(q.date).toBeTruthy();
    expect(q.region).toBe('Americas');
    expect(Object.keys(q)).not.toContain('subRegion');
    expect(Object.keys(q)).not.toContain('countryCode');

    q = getEventsQueryFromRouterState({ ...defaultAppRouterState, params: { where: 'americas,something' } });
    expect(q.region).toBe('Americas');
    expect(q.subRegion).toBe('Something');
    expect(Object.keys(q)).not.toContain('countryCode');

    q = getEventsQueryFromRouterState({ ...defaultAppRouterState, params: { where: 'pl' } });
    expect(q.countryCode).toBe('pl');
    expect(Object.keys(q)).not.toContain('region');
    expect(Object.keys(q)).not.toContain('subRegion');
  });

  it('#getEventsQueryFromRouterState workshops', () => {
    let q = getEventsQueryFromRouterState(defaultAppRouterState);
    expect(Object.keys(q)).not.toContain('workshops');
    expect(Object.keys(q)).not.toContain('freeWorkshops');

    q = getEventsQueryFromRouterState({ ...defaultAppRouterState, params: { ws: '1', fws: '1' } });
    expect(q.workshops).toBe(true);
    expect(q.freeWorkshops).toBe(true);
  });

  it('#getEventsQueryFromRouterState tags', () => {
    let q = getEventsQueryFromRouterState(defaultAppRouterState);
    expect(Object.keys(q)).not.toContain('tags');

    q = getEventsQueryFromRouterState({ ...defaultAppRouterState, params: { tags: 'tag1,tag2' } });
    expect(q.tags).toBeTruthy();
    expect(q.tags['$in']).toEqual(['tag1', 'tag2']);
  });

  it('#getEventsQuerySortFromRouterState', () => {
    expect(getEventsQuerySortFromRouterState(undefined as any)).toEqual({ date: 1 });
    expect(getEventsQuerySortFromRouterState(defaultAppRouterState)).toEqual({ date: 1 });
    expect(getEventsQuerySortFromRouterState({ ...defaultAppRouterState, params: { s: 'foo' } })).toEqual({ foo: 1 });
    expect(getEventsQuerySortFromRouterState({ ...defaultAppRouterState, params: { s: 'foo', sd: 'desc' } })).toEqual({
      foo: -1,
    });
  });
});
