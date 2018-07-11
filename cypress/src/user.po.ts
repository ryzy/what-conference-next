import { AppPage, URLs } from './app.po';

export class UserPage extends AppPage {
  static URL = URLs.User;

  static PAGE_TITLE = 'Your account';
  static LOGIN_FORM_PAGE_TITLE = 'Log in to your account';

  public static visit(url = this.URL) {
    super.visit(url);
  }

  public static loginButton() {
    return cy.get('.twitter-login-button');
  }

  public static loginWithTwitter() {
    this.visit();
    this.loginButton()
      .should('exist')
      .should('contain', 'Login with Twitter');
  }

  public static loginWithForm(username: string = '', password: string = '', expectSuccess = true) {
    cy.log('When I visit login form page');
    this.visit(this.URL + '/login');
    cy.contains(this.LOGIN_FORM_PAGE_TITLE);

    cy.log(`And I type credentials for *${username}*`);
    this.typeIntoFormField('username', username);
    this.typeIntoFormField('password', password);
    cy.log('And I submit the form');
    this.button('Log In', false).click();

    if (expectSuccess) {
      this.expectToBeLoggedIn();
    }
  }

  public static visitAndLogOut() {
    cy.log('When I visit user page by clicking on avatar link');
    cy.get('a')
      .get('app-user-avatar')
      .click();
    cy.log('And I am presented with User Profile page');
    cy.contains(this.PAGE_TITLE);

    cy.log('Then I should be able to click on logout button and log out');
    this.button('Logout').click();
  }
}
