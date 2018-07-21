import { UserPage } from '../src/user.po';

describe('User', () => {
  it('should login with Twitter', () => {
    UserPage.loginWithTwitter();
  });

  it('should login and logout with form', () => {
    UserPage.loginWithForm(Cypress.env('TEST_EDITOR_USER'), Cypress.env('TEST_EDITOR_PASS'));
    UserPage.expectToBeLoggedIn();
    UserPage.expectToBeOnUserProfilePage();
    UserPage.visitAndLogOut();
    UserPage.expectNotToBeLoggedIn();
  });

  it('should login with form and show error', () => {
    UserPage.loginWithForm('some-invalid@email.com', 'some invalid passw', false);
    cy.contains('user-not-found');
    UserPage.expectNotToBeLoggedIn();
  });
});
