
describe('Application navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the dashboard', () => {
    cy.contains('h2', 'Visão geral').should('be.visible');
    cy.contains('Total de despesas').should('be.visible');
  });

  it('should navigate to groups', () => {
    cy.contains('a', 'Criar primeiro grupo').click();

    cy.location('pathname').should('eq', '/groups');
    cy.contains('h2', 'Meus grupos').should('be.visible');
  });
});
