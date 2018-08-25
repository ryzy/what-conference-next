import { URLs } from '../src/abstract.po';
import { AppHomePage } from '../src/app-home.po';

describe('Event page', () => {
  it(`should redirect to main page when visiting empty ${URLs.Event} segment`, () => {
    AppHomePage.visit(URLs.Event, false);
    AppHomePage.expectToBeOnHomePage();
  });

  it(`should show 404 for non-existing events`, () => {
    AppHomePage.visit(URLs.Event + '/some-non-existing-event-page');
    cy.contains(`this event doesn't exist`);
  });

  it('should show an event page', () => {
    cy.log('Give I visit Home Page');
    AppHomePage.visit();
    cy.log('And I click on the event link');
    AppHomePage.visitAnEvent();

    cy.log('I should see event details page');
    cy.contains('Price');
    cy.contains('Website');
    cy.contains('Location');
    cy.contains('Workshops');
  });
});
