
describe('Group management', () => {
  beforeEach(() => {
    cy.visit('/groups', {
      onBeforeLoad(window) {
        window.localStorage.clear();
      },
    });
  });

  function createGroup(name = 'Viagem') {
    cy.contains('button', 'Novo grupo').click();
    cy.get('#group-name').type(name);
    cy.get('#group-description').type('Férias com amigos');
    cy.contains('button', 'Criar grupo').click();
  }

  it('should create a group', () => {
    createGroup();

    cy.contains('h3', 'Viagem').should('be.visible');
    cy.contains('Férias com amigos').should('be.visible');
  });

  it('should edit a group', () => {
    createGroup();

    cy.get('[aria-label="Editar Viagem"]').click();
    cy.get('#group-name').clear().type('Apartamento');
    cy.contains('button', 'Salvar alterações').click();

    cy.contains('h3', 'Apartamento').should('be.visible');
    cy.contains('h3', 'Viagem').should('not.exist');
  });

  it('should delete a group', () => {
    createGroup();

    cy.on('window:confirm', () => true);

    cy.get('[aria-label="Excluir Viagem"]').click();

    cy.contains('h3', 'Viagem').should('not.exist');
    cy.contains('Nenhum grupo criado').should('be.visible');
  });

  it('should persist groups after reloading', () => {
    createGroup();

    cy.reload();

    cy.contains('h3', 'Viagem').should('be.visible');
  });

  it('should cancel group creation', () => {
    cy.contains('button', 'Novo grupo').click();
    cy.get('#group-name').type('Viagem');
    cy.contains('button', 'Cancelar').click();

    cy.contains('h3', 'Viagem').should('not.exist');
    cy.contains('Nenhum grupo criado').should('be.visible');
  });
});
