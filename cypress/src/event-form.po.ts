import { ConferenceEvent, ConferenceEventFormData } from '../../src/app/event-base/model/conference-event';
import { mockEvent } from '../../src/testing/fixtures/events-db';
import { AbstractPage, URLs } from './abstract.po';

/**
 * List of fields in the new event form
 */
export const eventFormFields: { [k in keyof ConferenceEventFormData]: boolean | string } = {
  name: true,
  topicTags: true,
  country: true,
  city: true,
  address: true,
  date: true,
  eventDuration: true,
  workshopDays: true,
  website: true,
  twitterHandle: true,
  description: true,
  price: true,
  sizeBand: true,
};

export const mockE2eEvent: ConferenceEvent = {
  ...mockEvent,
  name: 'Test Event',
};

export class EventFormPage extends AbstractPage {
  static URL = URLs.NewEventForm;

  public static visit(url = EventFormPage.URL): void {
    super.visit(url);
  }

  public static fillTheFormWithRandomData(ev: Partial<ConferenceEvent> = mockE2eEvent): string {
    ev = { ...mockE2eEvent, ...ev }; // some fields might be switched off

    if (ev.name) {
      cy.log('And I enter "Event" in the field "name"');
      this.typeIntoFormField('name', ev.name);
    }

    if (ev.topicTags) {
      cy.log('And I tick checkbox no "1" in the field "topicTags"');
      // Force=true becase the real inputs are hidden behind MD things
      this.checkboxes('topicTags', 1).click({ force: true });
      this.checkboxes('topicTags', 3).click({ force: true });
    }

    if (ev.date) {
      cy.log('And I select "some date" in the calendar field "date"');
      this.selectDateInCalendarField('date');
    }

    if (ev.sizeBand) {
      cy.log('And I select option no "1" in the dropdown "sizeBand"');
      this.select('sizeBand', 1);
    }

    if (ev.price) {
      cy.log('And I enter "666" in the field "price"');
      this.typeIntoFormField('price', ev.price);
    }

    if (ev.country) {
      cy.log('And I enter "Fr" in the field "country"');
      this.typeIntoFormField('country', 'Fr');
      cy.log('And I select option no "2" from the autocomplete field "country"');
      this.autocomplete(2);
      cy.log('And I should see "France" option in "country" field selected');
      this.formField('country').should('have.value', 'France');
    }

    if (ev.city) {
      cy.log('And I enter "Paris" in the field "city"');
      this.typeIntoFormField('city', ev.city);
    }

    if (ev.address) {
      cy.log('And I enter "Museum Louvre" in the field "address"');
      this.typeIntoFormField('address', ev.address);
    }

    if (ev.website) {
      cy.log('And I enter "https://www.louvre.fr/en/evenements" in the field "website"');
      this.typeIntoFormField('website', ev.website);
    }

    if (ev.twitterHandle) {
      cy.log('And I enter "SuperConf" in the field "twitterHandle"');
      this.typeIntoFormField('twitterHandle', ev.twitterHandle);
    }

    if (ev.description) {
      cy.log('And I enter "Lorem ipsum dolar sit amet." in the field "description"');
      this.typeIntoFormField('description', ev.description);
    }

    return ev.name;
  }
}
