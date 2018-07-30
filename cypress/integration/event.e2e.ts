import { AppPage, URLs } from '../src/app.po';

describe('Event page', () => {
  it(`should redirect to main page when visiting empty ${URLs.Event} segment`, () => {
    AppPage.visit(URLs.Event, false);
    cy.url().should('eq', Cypress.config('baseUrl') + URLs.Home);
  });

  it(`should show 404 for non-existing events`, () => {
    AppPage.visit(URLs.Event + '/some-non-existing-event-page');
    cy.contains(`this event doesn't exist`);
  });
});
