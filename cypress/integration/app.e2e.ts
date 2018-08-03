import { AppHomePage } from '../src/app-home.po';

describe('App', () => {
  it('should work', () => {
    cy.visit('/');
    cy.contains('Upcoming conferences');
  });

  it('should show Error 404', () => {
    AppHomePage.visit('/some/invalid/url');
    cy.contains('404: Not Found');
    cy.contains("this page doesn't exist");
  });
});
