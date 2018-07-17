import { AppPage, URLs } from '../src/app.po';
import { EventFormPage } from '../src/event-form.po';
import { UserPage } from '../src/user.po';

describe('Event page', () => {
  it(`should redirect to main page when visiting empty ${URLs.Event} segment`, () => {
    AppPage.visit(URLs.Event, false);
    cy.url().should('eq', Cypress.config('baseUrl') + URLs.Home);
  });
});
