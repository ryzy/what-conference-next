import { mockEvent, mockEventFormData } from '../../../testing/fixtures/events';
import { mockLex, mockLexEmpty, mockTag, mockTags } from '../../../testing/fixtures/event-tags';
import { countriesData } from '../../data/countries';
import { builtinSizeBands } from '../data/size-bands';
import {
  ConferenceEvent,
  ConferenceEventRef,
  createEventFromFormData,
  createFormDataFromEvent,
  ensureValidConferenceEventObj,
  EventStatus,
  entityToIndex,
} from './conference-event';
import { ConferenceEventLexicon, EventTag } from './event-tag';

describe('ConferenceEvent model', () => {
  describe('#ensureValidConferenceEventObj', () => {
    it('should ensure valid ConferenceEvent obj', () => {
      const ev = ensureValidConferenceEventObj();
      expect(ev).toBeDefined();
      expect(ev.id).toBeTruthy();
      expect(ev.tags).toEqual([]);
      expect(ev.hashTags).toEqual([]);
      expect(ev.workshops).toBe(false);
      expect(ev.freeWorkshops).toBe(false);
    });

    it('workshops', () => {
      let ev = ensureValidConferenceEventObj({ workshops: true, freeWorkshops: false });
      expect(ev).toEqual(
        jasmine.objectContaining(<ConferenceEvent>{
          workshops: true,
          freeWorkshops: false,
        }),
      );

      ev = ensureValidConferenceEventObj({ workshops: 'foo', freeWorkshops: 'bar' });
      expect(ev).toEqual(
        jasmine.objectContaining(<ConferenceEvent>{
          workshops: true,
          freeWorkshops: true,
        }),
      );
    });
  });

  describe('#createEventFromFormData, #createFormDataFromEvent', () => {
    it('#tags', () => {
      let ev: ConferenceEvent | undefined;
      const formTags = [mockTags[0].id, mockTags[1].id];

      // convert to event
      ev = createEventFromFormData({ tags: formTags }, mockLex);
      expect(ev.id).toBeTruthy();
      expect(ev.tags).toEqual(formTags);

      // convert back to form data
      const formData = createFormDataFromEvent(ev, mockLex);
      expect(formData.tags).toEqual(formTags);
    });

    it('#tags for string tags (w/o tags db)', () => {
      let ev: ConferenceEvent | undefined;

      ev = createEventFromFormData({ tags: [mockTags[2].id] }, undefined as any);
      expect(ev.tags).toEqual([mockTags[2].id]);

      // convert back to form data
      const formData = createFormDataFromEvent(ev, mockLex);
      expect(formData.tags).toEqual([mockTags[2].id]);
    });

    it('#tags with invalid/incomplete inputs', () => {
      let ev: ConferenceEvent | undefined;

      // no tags set? it should return empty obj
      ev = createEventFromFormData({}, mockLexEmpty);
      expect(ev.tags).toEqual([]);

      // invalid input...
      ev = createEventFromFormData({ tags: { foo: 'bar' } as any }, undefined as any);
      expect(ev.tags).toEqual([]);

      // non-existing tags: should fallback to their IDs
      ev = createEventFromFormData({ tags: ['non', 'existing'] }, mockLexEmpty);
      expect(ev.tags).toEqual(['non', 'existing']);

      // empty tags should be filtered out
      ev = createEventFromFormData({ tags: ['tag1', 'tag2', ''] }, mockLexEmpty);
      expect(ev.tags).toEqual(['tag1', 'tag2']);
    });

    it('#workshop, #freeWorkshop', () => {
      let ev: ConferenceEvent | undefined;

      ev = createEventFromFormData({}, mockLexEmpty);
      expect(ev).toEqual(
        jasmine.objectContaining(<ConferenceEvent>{
          workshops: false,
          freeWorkshops: false,
        }),
      );

      ev = createEventFromFormData({ workshops: true, freeWorkshops: true }, mockLexEmpty);
      expect(ev).toEqual(
        jasmine.objectContaining(<ConferenceEvent>{
          workshops: true,
          freeWorkshops: true,
        }),
      );
    });

    it('#country, #region, #geoPoint', () => {
      let ev: ConferenceEvent | undefined;

      const mockCountry = countriesData[2];
      ev = createEventFromFormData({ country: mockCountry }, mockLexEmpty);
      expect(ev).toEqual(
        jasmine.objectContaining(<ConferenceEvent>{
          country: mockCountry.name,
          countryCode: mockCountry.isoCode,
          region: mockCountry.region,
          subRegion: mockCountry.subregion,
          geoPoint: { type: 'Point', coordinates: mockCountry.latlng },
        }),
      );

      // convert back to form data
      // expect Country obj to be restored
      const formData = createFormDataFromEvent(ev, mockLexEmpty);
      expect(formData.country.name).toBe(mockCountry.name);
    });

    it('#hashTags', () => {
      let ev: ConferenceEvent | undefined;

      ev = createEventFromFormData({}, mockLexEmpty);
      expect(ev.hashTags).toEqual([]);

      ev = createEventFromFormData({ hashTags: 'some, hash,tags, with,  mixed-spacing' }, mockLexEmpty);
      expect(ev.hashTags).toEqual(['some', 'hash', 'tags', 'with', 'mixed-spacing']);

      // convert back to form data
      const formData = createFormDataFromEvent(ev, mockLexEmpty);
      expect(formData.hashTags).toBe('some, hash, tags, with, mixed-spacing');
    });

    it('#sizeBand', () => {
      let ev: ConferenceEvent | undefined;

      ev = createEventFromFormData({ sizeBand: builtinSizeBands[1] }, mockLexEmpty);
      expect(ev).toEqual(
        jasmine.objectContaining(<ConferenceEvent>{
          sizeBand: builtinSizeBands[1].id,
        }),
      );

      // convert back to form data
      // expect EventSizeBand obj to be restored
      const formData = createFormDataFromEvent(ev, mockLexEmpty);
      expect(formData.sizeBand.id).toBe(builtinSizeBands[1].id);
    });

    it('#origin should be initialised', () => {
      let ev: ConferenceEvent | undefined;

      ev = createEventFromFormData({}, mockLexEmpty);
      expect(ev.origin).toBeDefined();
      expect(ev.origin.authorId).toBe('');
    });

    it('#status should be initialised', () => {
      let ev: ConferenceEvent | undefined;

      ev = createEventFromFormData({}, mockLexEmpty);
      expect(ev.status).toBe(EventStatus.Published);
    });
  });

  describe('ConferenceEventRef', () => {
    it('should create', () => {
      const o = {} as ConferenceEvent;
      const ref = new ConferenceEventRef(o, {} as ConferenceEventLexicon);
      expect(ref.ref).toBeDefined();
      expect(ref.ref.id).toBeTruthy();
      expect(ref.id).toContain('-');
      expect(ref.tags).toEqual([]);

      expect((ref.date as any) instanceof Date).toBe(true);
    });

    it('#tags should be build', () => {
      const ref = new ConferenceEventRef(mockEvent, mockLex);

      // Expect at least two tags, just so we really test this functionality
      expect(ref.tags.length).toBeGreaterThan(1);
      // Built EventTag list should equal number of provided tags
      expect(ref.tags.length).toBe(Object.keys(mockEvent.tags).length);

      const k = 1; // take the 2nd one from the stock
      const testedTagId = mockEvent.tags[k];
      // Assembled tags should have valid tag IDs
      expect(ref.tags[k].id).toBe(testedTagId);
      // Tags should be assembled from provided dictionary of tags
      expect(ref.tags[k].name).not.toBe(testedTagId);
    });

    it('#tags: non longer existing tags should be skipped', () => {
      let ref = new ConferenceEventRef(mockEvent, mockLexEmpty);
      expect(ref.tags).toEqual([]);

      const existingTag: EventTag = { id: 'existing', name: 'existing' };
      ref = new ConferenceEventRef(
        { ...mockEvent, tags: ['non', 'existing', '', 'or', 'invalid'] },
        { tags: [existingTag] },
      );
      expect(ref.tags).toEqual([existingTag]);
    });

    it('#country obj should be present', () => {
      const ref = new ConferenceEventRef(mockEvent, mockLexEmpty);
      expect(ref.country.name).toBe(mockEvent.country);
    });

    it('#sizeBand', () => {
      const ref = new ConferenceEventRef(mockEvent, mockLexEmpty);
      expect(ref.sizeBand).toBe(mockEventFormData.sizeBand);
    });
  });

  describe('misc', () => {
    it('#tagToIndex', () => {
      expect(entityToIndex()).toBe(-1);
      expect(entityToIndex('some-tag')).toBe(-1);

      expect(entityToIndex(mockTag, mockTags)).toBe(0); // mockTag is the first one from mockTags
      expect(entityToIndex(mockTag.id, mockTags)).toBe(0); // mockTag is the first one from mockTags
      expect(entityToIndex(undefined, mockTags)).toBe(-1);
    });
  });
});
