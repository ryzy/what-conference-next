import { EventFormPage } from './event-form.po';
import { randomRange } from './utils';

export const URLs = {
  Home: '/',
  User: '/user',
  NewEventForm: '/new',
  Event: '/ev',
};

export class AppPage {
  static URL = URLs.Home;

  public static visit(url = AppPage.URL, waitAndCheck = true): void {
    cy.visit(url);
    if (waitAndCheck) {
      cy.url().should('eq', Cypress.config('baseUrl') + url);
    }
  }

  public static link(linkText) {
    return cy
      .get('a, button')
      .contains(linkText)
      .parent('a, button');
  }

  public static button(buttonLabel: string, disabled?: boolean) {
    const el = cy
      .get('button')
      .contains(buttonLabel)
      .parent('button');

    if (true === disabled) {
      el.should('be.disabled');
    } else if (false === disabled) {
      el.should('not.be.disabled');
    }

    return el;
  }

  public static formField(fieldName) {
    return cy.get(`[formcontrolname="${fieldName}"]`);
  }

  public static checkboxes(fieldName, indexFrom1 = 0) {
    const ch = cy.get(`[formarrayname="${fieldName}"]`).find('input[type=checkbox]', { timeout: 120000 });

    return indexFrom1 ? ch.eq(indexFrom1 - 1) : ch;
  }

  /**
   * Find snackbar container
   */
  public static snackBar() {
    return cy.get('.mat-snack-bar-container', { timeout: 120000 });
  }

  public static typeIntoFormField(fieldName: string, stringToType: string | number) {
    return this.formField(fieldName)
      .focus()
      .type('{esc}', { force: true })
      .type(stringToType.toString())
      .blur();
  }

  public static select(fieldName, optionIdx) {
    return (
      this.formField(fieldName)
        .click()
        .wait(100) // wait for opening anim
        .get('.mat-select-panel .mat-option')
        .eq(optionIdx)
        .click({ force: true })
        .wait(100) // wait for closing anim

        // Click somewhere else, to un-focus that open overlay.
        // W/o that, sometimes, it doesn't hide it and it causes problems (for the next dropdowns, which needs to open)
        // Also, use `force: true` so it doesn't fail when it's covered by overlay, as that's the case
        // we're actually sorting out here (unfocus/hide the overlay).
        .root()
        .click({ force: true })
    );
  }

  public static triggerCalendarField(fieldName) {
    return this.formField(fieldName).focus();
  }

  public static selectDateInCalendarField(fieldName, todoDateToSelect?: string) {
    return this.triggerCalendarField(fieldName)
      .get('.mat-calendar-next-button')
      .click()
      .click()
      .click()
      .get('.mat-calendar-body-cell')
      .eq(randomRange(0, 28))
      .click();
  }

  /**
   * Note: autocomplete dropdown must be already visible before calling this one!
   */
  public static autocomplete(optionIndexFrom1: number) {
    return (
      cy
        .get('.mat-autocomplete-panel .mat-option')
        .eq(optionIndexFrom1 - 1)
        .click({ force: true })
        .wait(100) // wait for closing anim

        // Click somewhere else, to un-focus that open overlay.
        // W/o that, sometimes, it doesn't hide it and it causes problems (for the next dropdowns, which needs to open)
        // Also, use `force: true` so it doesn't fail when it's covered by overlay, as that's the case
        // we're actually sorting out here (unfocus/hide the overlay).
        .root()
        .click({ force: true })
    );
  }

  public static expectNotToBeLoggedIn() {
    cy.log('Then I should NOT be logged');
    cy.get('.app-user-avatar').should('exist');
    cy.get('.app-user-avatar--logged-in').should('not', 'exist');
  }

  public static expectToBeLoggedIn() {
    cy.log('Then I should be logged in and see my avatar');
    cy.get('.app-user-avatar--logged-in').should('exist');
  }

  public static expectToBeOnUserProfilePage() {
    cy.log('And I should be on the User Profile page');
    cy.url().should('eq', Cypress.config('baseUrl') + this.URL);
  }
}
