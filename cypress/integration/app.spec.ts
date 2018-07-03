// import { randomRange } from '../support/step_definitions/steps';

import { something } from '../support/commands';

describe('App', () => {
  // randomRange(1, 5);
  something();

  it('should work', () => {
    cy.visit('/');
    cy.contains('Upcoming conferences');
  });
});
