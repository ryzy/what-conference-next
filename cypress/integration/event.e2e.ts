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
});
