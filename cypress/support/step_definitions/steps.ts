const URLs = {
  Home: '/',
  NewEventForm: '/ev',
};

function randomRange(min = 0, max = 10) {
  return Math.floor(Math.random() * (max - min)) + min;
}

class AppPage {
  static link(linkText) {
    return cy
      .get('a, button')
      .contains(linkText)
      .parent();
  }
}

class EventFormPage extends AppPage {
  /**
   *
   * @param {string} fieldName
   * @return {Cypress.Chainable<JQuery<HTMLElement>>}
   */
  static formField(fieldName) {
    return cy.get(`[formcontrolname="${fieldName}"]`);
  }

  /**
   *
   * @param {string} fieldName
   * @param {number} indexFrom1: when > 0, only that checkbox will be returned, otherwise all of them
   * @return {Cypress.Chainable<JQuery<HTMLElement>>}
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
  static typeIntoFormField(fieldName, stringToType) {
    return EventFormPage.formField(fieldName)
      .focus()
      .type('{esc}', { force: true })
      .type(stringToType)
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

  /**
   * Note: autocomplete dropdown must be already visible before calling this one!
   *
   * @param {number} optionIndexFrom1
   * @return {Cypress.Chainable<JQuery<HTMLHtmlElement>>}
   */
  static autocomplete(optionIndexFrom1) {
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
  static button(buttonLabel, disabled = undefined) {
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

given('I visit {string} page', (url) => {
  expect(URLs[url]).not.to.be.empty;
  cy.visit(URLs[url]);
});

then('I should see {string}', (content) => {
  cy.contains(content);
});

then('I should be on the {string} page', (content) => {
  cy.contains(content);
});

then(`I should see {string} in the title`, (title) => {
  cy.title().should('include', title);
});

then(`I should see {string} button {string}`, (buttonLabel, state = 'enabled') => {
  EventFormPage.button(buttonLabel, state === 'disabled');
});

when('I click on a {string} link', (linkText) => {
  EventFormPage.link(linkText).click();
});

when('I enter {string} in the field {string}', (fieldValue, fieldName) => {
  EventFormPage.typeIntoFormField(fieldName, fieldValue);
});

when('I select {string} in the calendar field {string}', (date, fieldName) => {
  EventFormPage.formField(fieldName)
    .focus()
    .get('.mat-calendar-next-button')
    .click()
    .click()
    .click()
    .get('.mat-calendar-body-cell')
    .eq(randomRange(0, 28))
    .click();
});

when('I tick checkbox no {string} in the field {string}', (idx, fieldName) => {
  EventFormPage.checkboxes(fieldName, idx)
    // Force=true becase the real inputs are hidden behind MD things
    .click({ force: true });
});

when('I select option no {string} in the dropdown {string}', (optionIdx, fieldName) => {
  EventFormPage.select(fieldName, optionIdx);
});
when('I select option no {string} from the autocomplete field {string}', (optionIdx) => {
  EventFormPage.autocomplete(optionIdx);
});
