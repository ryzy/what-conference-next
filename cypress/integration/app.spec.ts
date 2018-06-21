describe('App', () => {
  it('should work', () => {
    cy.visit('/');
    cy.contains('Upcoming conferences');
  });
});
