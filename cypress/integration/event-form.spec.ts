import { AppPage, URLs } from '../src/app.po';
import { EventFormPage } from '../src/event-form.po';

describe('Event Form', () => {
  beforeEach(() => {
    AppPage.visit();
  });

  it('Should have working "New Event" link on home page', () => {
    // Given I visit "Home" page
    AppPage.visit();
    // When I click on a "New Event" link
    EventFormPage.link('New Event').click();
    // Then I should be on the "NewEventForm" page
    cy.url().should('contain', URLs.NewEventForm);
    // And I should see "Submit Event" button "disabled"
    EventFormPage.button('Submit Event', true);
  });

  it('Form should work with sample data', () => {
    cy.log('Given I visit "NewEventForm" page');
    EventFormPage.visit();

    cy.log('When I enter "Event" in the field "name"');
    EventFormPage.typeIntoFormField('name', 'Event');

    cy.log('And I tick checkbox no "1" in the field "topicTags"');
    EventFormPage.checkboxes('topicTags', 1).click({ force: true }); // Force=true becase the real inputs are hidden behind MD things

    cy.log('And I select "some date" in the calendar field "date"');
    EventFormPage.selectDateInCalendarField('date');

    cy.log('And I select option no "1" in the dropdown "sizeBand"');
    EventFormPage.select('sizeBand', 1);

    cy.log('And I enter "666" in the field "price"');
    EventFormPage.typeIntoFormField('price', 666);

    cy.log('And I enter "Fr" in the field "country"');
    EventFormPage.typeIntoFormField('country', 'Fr');

    cy.log('And I select option no "2" from the autocomplete field "country"');
    EventFormPage.autocomplete(2);

    cy.log('And I enter "Paris" in the field "city"');
    EventFormPage.typeIntoFormField('city', 'Paris');

    cy.log('And I enter "Museum Louvre" in the field "address"');
    EventFormPage.typeIntoFormField('address', 'Museum Louvre');

    cy.log('And I enter "https://www.louvre.fr/en/evenements" in the field "website"');
    EventFormPage.typeIntoFormField('website', 'https://www.louvre.fr/en/evenements');

    cy.log('And I enter "SuperConf" in the field "twitterHandle"');
    EventFormPage.typeIntoFormField('twitterHandle', 'SuperConf');

    cy.log('And I enter "Lorem ipsum dolar sit amet." in the field "description"');
    EventFormPage.typeIntoFormField('description', 'Lorem ipsum dolar sit amet');

    cy.log('Then I should see "Submit Event" button "enabled"');
    EventFormPage.button('Submit Event', false);
  });

  it('Calendar field should allow manual input', () => {
    cy.log('Given I visit "NewEventForm" page');
    EventFormPage.visit();

    cy.log('When I enter "12/31/2099" in the field "date"');
    EventFormPage.typeIntoFormField('date', '12/31/2099');

    cy.log('I should see date "DEC 2099" in the calendar popover and "31" selected day');
    EventFormPage.triggerCalendarField('date');
    cy.contains('DEC 2099');
    cy.focused().contains('31');
  });
});
