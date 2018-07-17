import { mockTopics } from '../../../testing/fixtures/topics';
import { countriesData } from '../data/countries';
import { ConferenceEvent, createEventFromFormValues } from './conference-event';

describe('ConferenceEvent', () => {
  describe('#createEventFromFormValues', () => {
    it('#topicTags for boolean flags', () => {
      let res: ConferenceEvent | undefined;

      res = createEventFromFormValues({ topicTags: [false, true, false] }, mockTopics);
      expect(res).toEqual(
        jasmine.objectContaining(<ConferenceEvent>{
          topicTags: { [mockTopics[1].id]: true },
        }),
      );
    });

    it('#topicTags for string tags', () => {
      let res: ConferenceEvent | undefined;

      res = createEventFromFormValues({ topicTags: [mockTopics[2].id] });
      expect(res).toEqual(
        jasmine.objectContaining(<ConferenceEvent>{
          topicTags: { [mockTopics[2].id]: true },
        }),
      );

      res = createEventFromFormValues({ topicTags: [mockTopics[2].id] }, mockTopics);
      expect(res).toEqual(
        jasmine.objectContaining(<ConferenceEvent>{
          topicTags: { [mockTopics[2].id]: true },
        }),
      );
    });

    it('#topicTags with invalid/incomplete inputs', () => {
      let res: ConferenceEvent | undefined;

      // no topics set? it should return empty obj
      res = createEventFromFormValues({ topicTags: [false, true, false] });
      expect(res).toEqual(
        jasmine.objectContaining(<ConferenceEvent>{
          topicTags: {},
        }),
      );

      // invalid input...
      res = createEventFromFormValues({ topicTags: { foo: 'bar' } as any });
      expect(res).toEqual(
        jasmine.objectContaining(<ConferenceEvent>{
          topicTags: {},
        }),
      );
    });

    it('##country and #region', () => {
      let res: ConferenceEvent | undefined;

      // all good
      const mockCountry = countriesData[2];
      res = createEventFromFormValues({ country: mockCountry });
      expect(res).toEqual(
        jasmine.objectContaining(<ConferenceEvent>{
          country: mockCountry.name,
          countryFlag: mockCountry.flag,
          countryCode: mockCountry.isoCode,
          region: mockCountry.region,
          subRegion: mockCountry.subregion,
          addressLatLng: mockCountry.latlng,
        }),
      );
    });
  });
});
