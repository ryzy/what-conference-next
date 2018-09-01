import { AppHomePage } from '../src/app-home.po';
import { EventFormPage, mockE2eEvent } from '../src/event-form.po';
import { UserPage } from '../src/user.po';

describe('Event Editing / Deleting', () => {
  it('Should have "New Event" page, but not accessible for guests', () => {
    cy.log('Given I visit "Home" page');
    AppHomePage.visit();

    cy.log('When I click on a "New Event" link');
    AppHomePage.link('New Event').click();

    cy.log('Then I should be redirected to login page');
    EventFormPage.expectToBeOnUserProfilePage(false);

    EventFormPage.snackBar('You need to login');
  });

  it('should show "New Event" page for logged in users', () => {
    UserPage.loginWithApiKey();

    cy.log('Given I visit "NewEventForm" page');
    AppHomePage.visit();

    cy.log('When I click on a "New Event" link');
    AppHomePage.link('New Event').click();

    cy.log('Then I should be on the "NewEventForm" page');
    EventFormPage.expectToBeOnEventEditingPage(false);

    cy.log('And I should see "Submit Event" button "disabled"');
    AppHomePage.button('Submit Event', true);
  });

  it('Calendar field should allow manual input', () => {
    UserPage.loginWithApiKey();

    cy.log('Given I visit "NewEventForm" page');
    EventFormPage.visit();

    cy.log('When I enter "12/31/2099" in the field "date"');
    EventFormPage.typeIntoFormField('date', '12/31/2099', true);

    cy.log('I should see date "DEC 2099" in the calendar popover and "31" selected day');
    EventFormPage.triggerCalendarField('date');
    EventFormPage.calendarPopup().within(() => {
      cy.contains('DEC 2099');
      cy.get('.mat-calendar-body-selected').contains('31');
    });
  });

  it('Should create and save a new event', () => {
    UserPage.loginWithApiKey();

    cy.log('Given I visit "NewEventForm" page');
    EventFormPage.visit();

    cy.log('When I fill the form with some valid data');
    EventFormPage.expectToBeOnEventEditingPage(false);
    const event = EventFormPage.fillTheFormWithRandomData({ city: '' }); // city is auto-set from country

    cy.log('Then I should see "Submit Event" button "enabled"');
    EventFormPage.button('Submit Event', false);

    cy.log('And when I submit the form');
    EventFormPage.button('Submit Event', false).click();

    cy.log('Then I should see the saved event page');
    EventFormPage.expectToBeOnEventPage(event.name);
    EventFormPage.snackBar().contains('successfully created');

    // TODO: more checks if the event got properly created
    cy.contains(event.description);
    cy.contains(event.twitterHandle);
  });

  it('Should edit an event', () => {
    UserPage.loginWithApiKey();

    const editingEventName = mockE2eEvent.name;

    cy.log('When I visit home page and select an event to edit');
    AppHomePage.visit();
    AppHomePage.visitAnEvent(editingEventName);

    cy.log('When I click on "Edit Event" button');
    EventFormPage.link('Edit Event').click();
    EventFormPage.expectToBeOnEventEditingPage(true);

    cy.log('Then I should see form with event data present');
    EventFormPage.waitForLoaderToDisappear('form');

    EventFormPage.formField('name', editingEventName);
    EventFormPage.formField('description', mockE2eEvent.description);

    // Note: because form is pristine, the button should be disabled
    cy.log('And I should see inactive [Update Event] button');
    EventFormPage.button('Update Event', true);

    cy.log('When I edit the form');
    const newDescription = 'New description of the event';
    EventFormPage.typeIntoFormField('description', newDescription);

    cy.log('And click the now active [Update Event] button');
    EventFormPage.button('Update Event', false).click();
    EventFormPage.expectToBeOnEventPage(editingEventName);
    EventFormPage.snackBar().contains('successfully updated');
    cy.contains(newDescription);
  });

  it('Should delete an event', () => {
    UserPage.loginWithApiKey();

    const editingEventName = mockE2eEvent.name;

    cy.log('When I visit home page and select an event to delete');
    AppHomePage.visit();
    AppHomePage.visitAnEvent(editingEventName);

    cy.log('When I click on "Edit Event" button');
    EventFormPage.link('Edit Event').click();

    cy.log('Then I should be on event editing page');
    EventFormPage.expectToBeOnEventEditingPage(true);
    // wait for event to load, otherwise the [delete] button is not visible yet
    EventFormPage.waitForLoaderToDisappear('form');

    cy.log('When I click on "Delete Event" button and do NOT confirm');
    EventFormPage.button('Delete Event', false).click();
    EventFormPage.confirmDialog(false);
    cy.log('Then nothing should happen and I should be still on event edit page');
    EventFormPage.expectToBeOnEventEditingPage();

    cy.log('When I click on "Delete Event" button and I do confirm');
    EventFormPage.button('Delete Event', false).click();
    EventFormPage.confirmDialog();
    EventFormPage.snackBar().contains('successfully deleted');
    EventFormPage.expectToBeOnHomePage();
  });

  it('Should show notification when cannot load event for editing', () => {
    UserPage.loginWithApiKey();

    cy.log('Given I visit "NewEventForm" page with invalid non-existing event link');
    EventFormPage.visit(EventFormPage.URL + '/some-non-existing-event');

    cy.log('Then I should see the form');
    EventFormPage.expectToBeOnEventEditingPage();
    EventFormPage.waitForLoaderToDisappear();

    cy.log('And I should see a notification with not-found message');
    EventFormPage.snackBar(/Event .+ not found/);
  });
});
