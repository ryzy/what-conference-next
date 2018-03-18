import { ConferenceEvent } from './conference-event';

describe('ConferenceEvent', () => {
  it('should create (from empty obj)', () => {
    const ev = new ConferenceEvent({});
    expect(ev).toBeTruthy();
    expect(ev.id).not.toBeUndefined();
    expect(ev.name).not.toBeUndefined();
    expect(ev.date).not.toBeUndefined();
    expect(ev.topicTags).toEqual([]);
    expect(ev.eventDuration).toEqual(1);
    expect(ev.workshopDays).toEqual(0);
    expect(ev.price).toEqual(0);
  });

  it('should generate nice ID from name', () => {
    const ev = new ConferenceEvent({ name: 'My Super Dupęr Conf **Title**'});
    expect(ev.id).toEqual('my-super-duper-conf-title');
  });
});
