export const URLs = {
  Home: '/',
  NewEventForm: '/ev',
};

export class AppPage {
  static URL = URLs.Home;

  static visit(url = AppPage.URL): void {
    cy.visit(url);
    cy.url().should('eq', Cypress.config('baseUrl') + url);
  }

  static link(linkText) {
    return cy
      .get('a, button')
      .contains(linkText)
      .parent('a, button');
  }
}
