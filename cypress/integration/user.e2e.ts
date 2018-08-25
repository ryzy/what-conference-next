import { URLs } from '../src/abstract.po';
import { AppHomePage } from '../src/app-home.po';
import { UserApiKeys, UserPage } from '../src/user.po';

describe('User', () => {
  it('should login with Google', () => {
    UserPage.loginWithGoogle();
  });

  it('should login and logout with form', () => {
    UserPage.loginWithForm(Cypress.env('TEST_USER'), Cypress.env('TEST_USER_PASS'), true);
    UserPage.expectToBeOnUserProfilePage();
    UserPage.visitAndLogOut();
    UserPage.expectNotToBeLoggedIn();

    cy.log('And I should be on the home page');
    AppHomePage.expectToBeOnHomePage();

    // We do re-login to MongoDB after user logout (since Mongo Stitch needs some auth session)
    // Make sure everything works as expected and we have some events on the home page
    cy.log('And I should see some events there');
    AppHomePage.expectToHaveEventsList();
  });

  it('should login with form and show error', () => {
    UserPage.loginWithForm('some-invalid@email.com', 'invalid pass', false);
    cy.contains('invalid username/password');
    UserPage.expectNotToBeLoggedIn();
  });

  it('should NOT login with invalid API key', () => {
    UserPage.visit(URLs.UserAuth + '/invalid-api-key');
    cy.contains('invalid API key');
  });

  it('should login with valid API key', () => {
    UserPage.visit(URLs.UserAuth + '/' + Cypress.env(UserApiKeys.TEST_EDITOR_USER_API_KEY));
    cy.contains('Logged in as');
  });

  it('should see page with API Keys (for logged in user)', () => {
    UserPage.loginWithForm(Cypress.env('TEST_USER'), Cypress.env('TEST_USER_PASS'), true);
    UserPage.visit(URLs.UserAuth);

    cy.log('And I should see something about api keys');
    cy.contains('API Key');
    cy.contains('Fetch all keys').click();

    // after api key arrived, we should see some fields with the data
    cy.contains('"disabled": false');
  });
});
