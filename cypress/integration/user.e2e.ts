import { UserApiKeys, UserPage } from '../src/user.po';

describe('User', () => {
  it('should login with Google', () => {
    UserPage.loginWithGoogle();
  });

  it('should login and logout with form', () => {
    UserPage.loginWithForm(Cypress.env('TEST_EDITOR_USER'), Cypress.env('TEST_EDITOR_PASS'));
    UserPage.expectToBeLoggedIn();
    UserPage.expectToBeOnUserProfilePage();
    UserPage.visitAndLogOut();
    UserPage.expectNotToBeLoggedIn();
  });

  it('should login with form and show error', () => {
    UserPage.loginWithForm('some-invalid@email.com', 'some invalid pass', false);
    cy.contains('invalid username/password');
    UserPage.expectNotToBeLoggedIn();
  });

  it('should NOT login with API key', () => {
    UserPage.visit(UserPage.URL + '/login/invalid-api-key');
    cy.contains('invalid API key');
  });

  it('should login with valid API key', () => {
    UserPage.visit(UserPage.URL + '/login/' + Cypress.env(UserApiKeys.TEST_EDITOR_USER_API_KEY));
    cy.contains(/Success.+?Logged in as/);
  });
});
