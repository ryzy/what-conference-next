import { mockNewEventFormData } from '../../../testing/fixtures/event-form';
import { mockTopics } from '../../../testing/fixtures/topics';
import { countriesData } from '../data/countries';
import { builtinSizeBands } from '../data/size-bands';
import {
  ConferenceEvent,
  ConferenceEventFormData,
  ConferenceEventRef,
  createEventFromFormData,
  createFormDataFromEvent,
} from './conference-event';

describe('ConferenceEvent', () => {
  describe('#createEventFromFormData, #createFormDataFromEvent', () => {
    it('#topicTags for boolean flags', () => {
      let ev: ConferenceEvent | undefined;
      const formTopicTags = [false, true, false];

      // convert to event
      ev = createEventFromFormData({ topicTags: formTopicTags }, mockTopics);
      expect(ev.id).toBeTruthy();
      expect(ev).toEqual(
        jasmine.objectContaining(<ConferenceEvent>{
          topicTags: { [mockTopics[1].id]: true },
        }),
      );

      // convert back to form data
      const formData = createFormDataFromEvent(ev, mockTopics);
      expect(formData).toEqual(jasmine.objectContaining(<ConferenceEventFormData>{ topicTags: formTopicTags }));
    });

    it('#topicTags for string tags (w/o topics dict)', () => {
      let ev: ConferenceEvent | undefined;

      ev = createEventFromFormData({ topicTags: [mockTopics[2].id] });
      expect(ev).toEqual(
        jasmine.objectContaining(<ConferenceEvent>{
          topicTags: { [mockTopics[2].id]: true },
        }),
      );

      // convert back to form data
      const formData = createFormDataFromEvent(ev, mockTopics);
      expect(formData).toEqual(jasmine.objectContaining(<ConferenceEventFormData>{ topicTags: [false, false, true] }));
    });

    it('#topicTags with invalid/incomplete inputs', () => {
      let ev: ConferenceEvent | undefined;

      // no topics set? it should return empty obj
      ev = createEventFromFormData({ topicTags: [false, true, false] });
      expect(ev).toEqual(
        jasmine.objectContaining(<ConferenceEvent>{
          topicTags: {},
        }),
      );

      // invalid input...
      ev = createEventFromFormData({ topicTags: { foo: 'bar' } as any });
      expect(ev).toEqual(
        jasmine.objectContaining(<ConferenceEvent>{
          topicTags: {},
        }),
      );

      // test `createFormDataFromEvent` without providing topics dict (2nd arg)
      const formData = createFormDataFromEvent(ev);
      expect(formData).toEqual(jasmine.objectContaining(<ConferenceEventFormData>{ topicTags: [] }));
    });

    it('#country and #region', () => {
      let ev: ConferenceEvent | undefined;

      const mockCountry = countriesData[2];
      ev = createEventFromFormData({ country: mockCountry });
      expect(ev).toEqual(
        jasmine.objectContaining(<ConferenceEvent>{
          country: mockCountry.name,
          countryCode: mockCountry.isoCode,
          region: mockCountry.region,
          subRegion: mockCountry.subregion,
          addressLatLng: mockCountry.latlng,
        }),
      );

      // convert back to form data
      // expect Country obj to be restored
      const formData = createFormDataFromEvent(ev);
      expect(formData.country.name).toBe(mockCountry.name);
    });

    it('#sizeBand', () => {
      let ev: ConferenceEvent | undefined;

      ev = createEventFromFormData({ sizeBand: builtinSizeBands[1] });
      expect(ev).toEqual(
        jasmine.objectContaining(<ConferenceEvent>{
          sizeBand: builtinSizeBands[1].id,
        }),
      );

      // convert back to form data
      // expect EventSizeBand obj to be restored
      const formData = createFormDataFromEvent(ev);
      expect(formData.sizeBand.id).toBe(builtinSizeBands[1].id);
    });
  });

  describe('ConferenceEventRef', () => {
    let mockEvent: ConferenceEvent;

    beforeEach(() => {
      mockEvent = createEventFromFormData(mockNewEventFormData);
    });

    it('should create', () => {
      const o = {} as ConferenceEvent;
      const ref = new ConferenceEventRef('some-id', o);
      expect(ref.ref).toBe(o);
      expect(ref.id).toBe('some-id');

      expect(ref.date instanceof Date).toBe(true);
    });

    it('#topicTags should be build', () => {
      const ref = new ConferenceEventRef('id', mockEvent, { topics: mockTopics });

      expect(ref.topicTags.length).toBe(
        Object.keys(mockEvent.topicTags).length,
        'Built EventTopic list should equal number of provided topic IDs',
      );
      expect(ref.topicTags[1].id).toBe(
        Object.keys(mockEvent.topicTags)[1],
        'Built EventTopic[1] should equal source topic id',
      );
      expect(ref.topicTags[1].name).not.toBe(
        Object.keys(mockEvent.topicTags)[1],
        'Built EventTopic[1] name should be built from dictionary of EventTopic',
      );
    });

    it('#topicTags (without dictionary of topics)', () => {
      const ref = new ConferenceEventRef('id', mockEvent);

      expect(ref.topicTags.length).toBe(
        Object.keys(mockEvent.topicTags).length,
        'Built EventTopic list should equal number of provided topic IDs',
      );
      expect(ref.topicTags[1].id).toBe(
        Object.keys(mockEvent.topicTags)[1],
        'Built EventTopic[1] should equal source topic id',
      );
      expect(ref.topicTags[1].name).toBe(
        Object.keys(mockEvent.topicTags)[1],
        'Built EventTopic[1] name equal source topic id (since there was no dictionary of topics supplied)',
      );
    });

    it('#country obj should be present', () => {
      const ref = new ConferenceEventRef('id', mockEvent);
      expect(ref.country.name).toBe(mockEvent.country);
    });

    it('#sizeBand', () => {
      const ref = new ConferenceEventRef('id', mockEvent);
      expect(ref.sizeBand).toBe(mockNewEventFormData.sizeBand);
    });
  });
});
