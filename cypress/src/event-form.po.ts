import { randomRange } from '../../src/app/core/core-utils';
import { builtinSizeBands } from '../../src/app/event-base/data/size-bands';
import { ConferenceEvent, entityToIndex } from '../../src/app/event-base/model/conference-event';
import { mockEvent } from '../../src/testing/fixtures/events';
import { AbstractPage, URLs } from './abstract.po';

export const mockE2eEvent: ConferenceEvent = {
  ...mockEvent,
  name: 'Test Event',
  date: new Date(),
};

export class EventFormPage extends AbstractPage {
  static URL = URLs.NewEventForm;

  public static visit(url = EventFormPage.URL): void {
    super.visit(url);
  }

  public static fillTheFormWithRandomData(eventData: Partial<ConferenceEvent> = mockE2eEvent): ConferenceEvent {
    const ev: ConferenceEvent = { ...mockE2eEvent, ...eventData }; // some fields might be switched off
    // console.log('EventFormPage#fillTheFormWithRandomData', ev);

    if (ev.name) {
      cy.log('And I enter "Event" in the field "name"');
      this.typeIntoFormField('name', ev.name + ' ' + randomRange());
    }

    if (ev.tags) {
      cy.log(`And I tick tags "${ev.tags.join(', ')}"`);
      cy.get('.primary-tags')
        .get('.mat-chip')
        .contains('Frontend')
        .click();
      cy.get('.secondary-tags')
        .get('.mat-chip')
        .contains('Angular')
        .click();
    }

    if (ev.date) {
      cy.log('And I select "some date" in the calendar field "date"');
      this.selectDateInCalendarField('date', ev.date);
    }
    if (ev.eventDuration) {
      this.typeIntoFormField('eventDuration', ev.eventDuration);
    }

    if (ev.sizeBand) {
      const idx = entityToIndex(ev.sizeBand, builtinSizeBands);
      cy.log(`And I select option no "${idx}" in the dropdown "sizeBand"`);

      this.select('sizeBand', idx);
    }

    if (ev.price) {
      cy.log(`And I enter "${ev.price}" in the field "price"`);
      this.typeIntoFormField('price', ev.price);
    }
    if (ev.workshops) {
      cy.log(`And I tick the "workshops" checkbox`);
      this.checkbox('workshops').click();
    }
    if (ev.freeWorkshops) {
      cy.log(`And I tick the "freeWorkshops" checkbox`);
      this.checkbox('freeWorkshops').click();
    }

    if (ev.country) {
      cy.log(`And I enter "${ev.countryCode}" in the field "country"`);
      this.typeIntoFormField('country', ev.countryCode);
      cy.log(`And I select option no "0" from the autocomplete field "country"`);
      this.autocomplete(0);
      cy.log(`And I should see ${ev.country} option in "country" field selected`);
      this.formField('country').should('have.value', ev.country);
    }

    if (ev.city) {
      cy.log(`And I enter "${ev.city}" in the field "city"`);
      this.typeIntoFormField('city', ev.city);
    }

    if (ev.address) {
      cy.log(`And I enter "${ev.address}" in the field "address"`);
      this.typeIntoFormField('address', ev.address);
    }

    if (ev.website) {
      cy.log(`And I enter "${ev.website}" in the field "website"`);
      this.typeIntoFormField('website', ev.website);
    }

    if (ev.twitterHandle) {
      cy.log(`And I enter "${ev.twitterHandle}" in the field "twitterHandle"`);
      this.typeIntoFormField('twitterHandle', ev.twitterHandle);
    }

    if (ev.description) {
      cy.log(`And I enter "${ev.description}" in the field "description"`);
      this.typeIntoFormField('description', ev.description);
    }

    return ev;
  }
}
