import { AppPage, URLs } from './app.po';
import { randomRange } from './utils';

/**
 * List of fields in the new event form
 */
export const eventFormFields: { [k: string]: boolean | string } = {
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

export class EventFormPage extends AppPage {
  static URL = URLs.NewEventForm;

  public static visit(url = EventFormPage.URL): void {
    super.visit(url);
  }

  public static fillTheFormWithRandomData(fields = eventFormFields): void {
    fields = { ...eventFormFields, ...fields }; // some fields might be switched off

    if (fields.name) {
      cy.log('And I enter "Event" in the field "name"');
      const nameVal = ('string' === typeof fields.name ? fields.name : 'Event') + ' ' + randomRange(1000);
      this.typeIntoFormField('name', nameVal);
    }

    if (fields.topicTags) {
      cy.log('And I tick checkbox no "1" in the field "topicTags"');
      // Force=true becase the real inputs are hidden behind MD things
      this.checkboxes('topicTags', 1).click({ force: true });
    }

    if (fields.date) {
      cy.log('And I select "some date" in the calendar field "date"');
      this.selectDateInCalendarField('date');
    }

    if (fields.sizeBand) {
      cy.log('And I select option no "1" in the dropdown "sizeBand"');
      this.select('sizeBand', 1);
    }

    if (fields.price) {
      cy.log('And I enter "666" in the field "price"');
      this.typeIntoFormField('price', 666);
    }

    if (fields.country) {
      cy.log('And I enter "Fr" in the field "country"');
      this.typeIntoFormField('country', 'Fr');
      cy.log('And I select option no "2" from the autocomplete field "country"');
      this.autocomplete(2);
      cy.log('And I should see "France" option in "country" field selected');
      this.formField('country').should('have.value', 'France');
    }

    if (fields.city) {
      cy.log('And I enter "Paris" in the field "city"');
      this.typeIntoFormField('city', 'Paris');
    }

    if (fields.address) {
      cy.log('And I enter "Museum Louvre" in the field "address"');
      this.typeIntoFormField('address', 'Museum Louvre');
    }

    if (fields.website) {
      cy.log('And I enter "https://www.louvre.fr/en/evenements" in the field "website"');
      this.typeIntoFormField('website', 'https://www.louvre.fr/en/evenements');
    }

    if (fields.twitterHandle) {
      cy.log('And I enter "SuperConf" in the field "twitterHandle"');
      this.typeIntoFormField('twitterHandle', 'SuperConf');
    }

    if (fields.description) {
      cy.log('And I enter "Lorem ipsum dolar sit amet." in the field "description"');
      this.typeIntoFormField('description', 'Lorem ipsum dolar sit amet');
    }
  }
}
