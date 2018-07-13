import { mockTopics } from '../../../testing/fixtures/topics';
import { countriesData } from '../data/countries';
import { ConferenceEvent } from './conference-event';

describe('ConferenceEvent', () => {
  it('should create (from empty obj)', () => {
    const ev = new ConferenceEvent({});
    expect(ev).toBeTruthy();
    expect(ev.id).not.toBeUndefined();
    expect(ev.name).not.toBeUndefined();
    expect(ev.date).not.toBeUndefined();
    expect(ev.topicTags).toEqual({});
    expect(ev.eventDuration).toEqual(1);
    expect(ev.workshopDays).toBeUndefined();
    expect(ev.price).toBeUndefined();
  });

  it('should generate nice ID from name', () => {
    const ev = new ConferenceEvent({ name: 'My Super Dupęr Conf **Title**' });
    expect(ev.id).toEqual('my-super-duper-conf-title');
  });

  it('#fromFormValues should work for topic tags', () => {
    let res: ConferenceEvent | undefined;

    // no topics set? it should return empty obj
    res = ConferenceEvent.fromFormValues({ topicTags: [false, true, false] });
    expect(res).toEqual(
      jasmine.objectContaining(<ConferenceEvent>{
        topicTags: {},
      }),
    );

    // all good
    res = ConferenceEvent.fromFormValues({ topicTags: [false, true, false] }, mockTopics);
    expect(res).toEqual(
      jasmine.objectContaining(<ConferenceEvent>{
        topicTags: { [mockTopics[1].id]: true },
      }),
    );

    // invalid input...
    res = ConferenceEvent.fromFormValues({ topicTags: { foo: 'bar' } });
    console.log('res', res);
    expect(res).toEqual(
      jasmine.objectContaining(<ConferenceEvent>{
        topicTags: {},
      }),
    );
  });

  it('#fromFormValues should work for country and region', () => {
    let res: ConferenceEvent | undefined;

    // all good
    const mockCountry = countriesData[2];
    res = ConferenceEvent.fromFormValues({ country: mockCountry });
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
