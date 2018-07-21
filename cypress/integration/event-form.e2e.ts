import { AppPage, URLs } from '../src/app.po';
import { EventFormPage } from '../src/event-form.po';
import { UserPage } from '../src/user.po';

describe('Event Form', () => {
  before(() => {
    UserPage.loginWithForm(Cypress.env('TEST_EDITOR_USER'), Cypress.env('TEST_EDITOR_PASS'));
  });

  // after(() => {
  // UserPage.visitAndLogOut();
  // });

  beforeEach(() => {
    AppPage.expectToBeLoggedIn();
  });

  it('App should have working "New Event" link on home page', () => {
    // When I click on a "New Event" link
    AppPage.link('New Event').click();
    // Then I should be on the "NewEventForm" page
    cy.url().should('contain', URLs.NewEventForm);
    // And I should see "Submit Event" button "disabled"
    AppPage.button('Submit Event', true);
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

  it('Should submit and save new event', () => {
    cy.log('Given I visit "NewEventForm" page');
    EventFormPage.visit();
    // cy.reload(true);

    cy.log('And I fill the form with some valid data');
    const eventName = EventFormPage.fillTheFormWithRandomData({ city: false }); // city is auto-set from country

    cy.log('Then I should see "Submit Event" button "enabled"');
    EventFormPage.button('Submit Event', false);

    cy.log('And when I submit the form');
    EventFormPage.button('Submit Event', false).click();

    cy.log('I should see the saved event page');
    EventFormPage.snackBar().contains('successfully saved');
    cy.contains(eventName);
  });
});
