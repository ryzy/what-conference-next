import { AppPage, URLs } from './app.po';
import { randomRange } from './utils';

export class EventFormPage extends AppPage {
  static URL = URLs.NewEventForm;

  static visit(url = EventFormPage.URL): void {
    AppPage.visit(url);
  }

  /**
   *
   * @param {string} fieldName
   * @return {Cypress.Chainable<JQuery<HTMLElement>>}
   */
  static formField(fieldName) {
    return cy.get(`[formcontrolname="${fieldName}"]`);
  }

  /**
   * @param fieldName
   * @param indexFrom1: when > 0, only that checkbox will be returned, otherwise all of them
   */
  static checkboxes(fieldName, indexFrom1 = 0) {
    const ch = cy.get(`[formarrayname="${fieldName}"]`).find('input[type=checkbox]');

    return indexFrom1 ? ch.eq(indexFrom1 - 1) : ch;
  }

  /**
   * @param {string} fieldName
   * @param {string} stringToType
   * @return {Cypress.Chainable<JQuery<HTMLElement>>}
   */
  static typeIntoFormField(fieldName: string, stringToType: string | number) {
    return EventFormPage.formField(fieldName)
      .focus()
      .type('{esc}', { force: true })
      .type(stringToType.toString())
      .blur();
  }

  static select(fieldName, optionIdx) {
    return (
      EventFormPage.formField(fieldName)
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

  static triggerCalendarField(fieldName) {
    return EventFormPage.formField(fieldName).focus();
  }

  static selectDateInCalendarField(fieldName, todoDateToSelect?: string) {
    return EventFormPage.triggerCalendarField(fieldName)
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
   * @param {number} optionIndexFrom1
   * @return {Cypress.Chainable<JQuery<HTMLHtmlElement>>}
   */
  static autocomplete(optionIndexFrom1: number) {
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

  /**
   * @param {string} buttonLabel
   * @param {boolean} disabled
   * @return {Cypress.Chainable<JQuery<HTMLButtonElement>>}
   */
  static button(buttonLabel: string, disabled?: boolean) {
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
}
//
// given('I visit {string} page', (url) => {
//   expect(URLs[url]).not.to.be.empty;
//   cy.visit(URLs[url]);
// });
//
// /**
//  * Test that browser is on a specified URL
//  */
// then('I should be on the {string} page', (url) => {
//   expect(URLs[url]).not.to.be.empty;
//   cy.url().should('eq', Cypress.config('baseUrl') + URLs[url]);
// });
//
// then('I should see {string}', (content) => {
//   cy.contains(content);
// });
//
// then(`I should see {string} in the title`, (title) => {
//   cy.title().should('include', title);
// });
//
// then(`I should see {string} button {string}`, (buttonLabel, state = 'enabled') => {
//   EventFormPage.button(buttonLabel, state === 'disabled');
// });
//
// when('I click on a {string} link', (linkText) => {
//   EventFormPage.link(linkText).click();
// });
//
// when('I enter {string} in the field {string}', (fieldValue, fieldName) => {
//   EventFormPage.typeIntoFormField(fieldName, fieldValue);
// });
//
// when('I select {string} in the calendar field {string}', (date, fieldName) => {
//   EventFormPage.formField(fieldName)
//     .focus()
//     .get('.mat-calendar-next-button')
//     .click()
//     .click()
//     .click()
//     .get('.mat-calendar-body-cell')
//     .eq(randomRange(0, 28))
//     .click();
// });
//
// when('I tick checkbox no {string} in the field {string}', (idx, fieldName) => {
//   EventFormPage.checkboxes(fieldName, idx)
//     // Force=true becase the real inputs are hidden behind MD things
//     .click({ force: true });
// });
//
// when('I select option no {string} in the dropdown {string}', (optionIdx, fieldName) => {
//   EventFormPage.select(fieldName, optionIdx);
// });
// when('I select option no {string} from the autocomplete field {string}', (optionIdx) => {
//   EventFormPage.autocomplete(optionIdx);
// });
