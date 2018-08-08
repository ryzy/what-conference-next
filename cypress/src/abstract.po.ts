import { EventFormPage } from './event-form.po';
import { randomRange } from '../../src/app/core/core-utils';

export const URLs = {
  Home: '/',
  User: '/user',
  NewEventForm: '/edit',
  Event: '/ev',
};

/**
 * Base class for all page object class in the app
 * offering common functionality / helpers / accessors to different parts of the ap
 */
export class AbstractPage {
  static URL = URLs.Home;

  public static visit(url = AbstractPage.URL, waitAndCheck = true): void {
    cy.visit(url);
    if (waitAndCheck) {
      cy.url().should('eq', Cypress.config('baseUrl') + url);
    }
  }

  public static link(linkText) {
    return cy.get('a').contains(linkText);
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

  public static formField(fieldName, withValue?: any, exactValueMatch = false) {
    const inputEl = cy.get(`[formcontrolname="${fieldName}"]`);

    // ATM Cypress only have should('have.value') which is an exact match
    // We need support for `contain`, so here's little workaround...
    if (withValue) {
      return inputEl.then((v) => {
        cy.log(`Input value: '${v.val()}'`);
        cy.wrap(v.val()).should(exactValueMatch ? 'eq' : 'contain', withValue);
      });
    }

    return inputEl;
  }

  public static checkbox(fieldName: string) {
    return cy.get(`[formcontrolname="${fieldName}"]`);
  }

  public static checkboxes(fieldName: string, index?: number) {
    const ch = cy.get(`[formarrayname="${fieldName}"]`).find('input[type=checkbox]');

    return undefined !== index ? ch.eq(index) : ch;
  }

  /**
   * Find SnackBar container
   */
  public static snackBar(expectedContent?: string | RegExp) {
    const snackBarEl = cy.get('.mat-snack-bar-container');

    if (expectedContent) {
      return snackBarEl.within((snackBar) => {
        cy.wrap(snackBar).contains(expectedContent);
      });
    }

    return snackBarEl;
  }

  public static typeIntoFormField(fieldName: string, stringToType: string | number, deFocusAfter: boolean = false) {
    this.formField(fieldName)
      .focus()
      .type('{esc}', { force: true })
      .type(stringToType.toString());

    if (deFocusAfter) {
      cy.get('body').click();
    }
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
   *
   * @param optionIndexToSelect option to select (starting from 0)
   */
  public static autocomplete(optionIndexToSelect: number) {
    return (
      cy
        .get('.mat-autocomplete-panel .mat-option')
        .eq(optionIndexToSelect)
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

  /**
   * Wait for loader to disappear
   */
  public static waitForLoaderToDisappear(whereSelector = 'body') {
    // wait for loader to actually appear...
    // otherwise it before the loader even kicks in, Cypress continues to the next step
    cy.wait(100);
    cy.get(whereSelector).within(() => {
      cy.get('.app-loader').should('not.exist');
    });
  }

  /**
   * Confirm or cancel the visible confirmation dialog (opened elsewhere)
   */
  public static confirmDialog(confirm = true) {
    cy.log(`And I'm presented with confirmation dialog and I ${confirm ? '[Confirm]' : '[Cancel]'}`);
    // cy.wait(100); // wait for modal to finish the animation... otherwise it sometimes fails
    const modalEl = cy.get('.mat-dialog-container');
    modalEl.within(() => {
      cy.contains('Are you sure');
      const btn = confirm ? cy.get('button').contains('Sure') : cy.get('button').contains('Cancel');
      btn.click();
    });

    // wait for dialog to disappear
    // cy.wait(100); // wait for modal to finish the animation... otherwise it sometimes fails
    cy.get('.mat-dialog-container').should('not.exist');
  }

  public static expectNotToBeLoggedIn() {
    cy.log('Then I should NOT be logged');
    cy.get('.app-user-avatar').should('exist');
    cy.get('.app-user-avatar--logged-in').should('not.exist');
  }

  public static expectToBeLoggedIn() {
    cy.log('Then I should be logged in and see my avatar');
    cy.get('.app-user-avatar--logged-in').should('exist');
  }

  //
  // Helpers to validate/wait for a particular page URL
  //

  public static expectToBeOnUserProfilePage() {
    cy.log('And I should be on the User Profile page');
    cy.url().should('eq', Cypress.config('baseUrl') + this.URL);
  }

  public static expectToBeOnHomePage(): void {
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
  }

  public static expectToBeOnEventPage(expectedContent: string): void {
    cy.url().should('match', /\/ev\/.+-.+/);
    cy.contains(expectedContent);
  }

  public static expectToBeOnEventEditingPage(eventIdPresent = true): void {
    cy.url().should('match', eventIdPresent ? /\/edit\/.+-.+/ : /\/edit$/);
    // expect form header
    cy.contains('Event Basic Information');
  }
}
