describe('Application', () => {
  it('should load the home page', () => {
    cy.visit('/');
    cy.contains('h1', 'Get started').should('be.visible');
  });

  it('should increment the counter when clicked', () => {
    cy.visit('/');
    cy.contains('button', 'Count is 0').click();
    cy.contains('button', 'Count is 1').should('be.visible');
  });
});